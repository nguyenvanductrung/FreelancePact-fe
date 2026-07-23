"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { WalletState, WalletProvider } from "@/types/web3";
import { BrowserWallet } from '@meshsdk/core';

interface WalletContextType {
  walletState: WalletState;
  connectWallet: (provider: WalletProvider) => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  connectingProvider: WalletProvider | null;
}

const defaultState: WalletState = {
  connected: false,
  provider: null,
  address: null,
  balanceAda: 0,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>(defaultState);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<WalletProvider | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fp_wallet_real");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.provider) {
          // auto reconnect in background
          connectWallet(parsed.provider);
        }
      } catch (e) {
        console.error("Failed to parse wallet state", e);
      }
    }
  }, []);

  const connectWallet = async (provider: WalletProvider) => {
    setIsConnecting(true);
    setConnectingProvider(provider);
    try {
      const wallet = await BrowserWallet.enable(provider);
      const addresses = await wallet.getUsedAddresses();
      const address = addresses[0] || (await wallet.getChangeAddress());
      
      const balanceArr = await wallet.getBalance();
      const lovelace = balanceArr.find((asset) => asset.unit === 'lovelace')?.quantity;
      const balanceAda = lovelace ? Number(lovelace) / 1000000 : 0;
      
      const state: WalletState = {
        connected: true,
        provider,
        address,
        balanceAda,
        wallet,
      };
      
      setWalletState(state);
      // We only save the provider name, not the whole state/wallet instance
      localStorage.setItem("fp_wallet_real", JSON.stringify({ provider }));

      // Sync wallet address to backend if user is logged in
      try {
        const { profileApi } = await import("@/lib/api");
        await profileApi.update({ walletAddress: address });
      } catch (e) {
        console.error("Could not sync wallet to backend (maybe not logged in):", e);
      }
    } catch (error) {
      console.error("Failed to connect wallet", error);
      alert("Kết nối ví thất bại. Vui lòng kiểm tra lại tiện ích ví (Nami/Eternl).");
    } finally {
      setIsConnecting(false);
      setConnectingProvider(null);
    }
  };

  const disconnectWallet = () => {
    setWalletState(defaultState);
    localStorage.removeItem("fp_wallet_real");
  };

  return (
    <WalletContext.Provider
      value={{
        walletState,
        connectWallet,
        disconnectWallet,
        isConnecting,
        connectingProvider,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletContextProvider");
  }
  return context;
}
