"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { WalletState, WalletProvider } from "@/types/web3";
import { mockConnectWallet } from "@/lib/mock-web3";

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
    const saved = localStorage.getItem("fp_wallet_mock");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.connected) {
          setWalletState(parsed);
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
      const state = await mockConnectWallet(provider);
      setWalletState(state);
      localStorage.setItem("fp_wallet_mock", JSON.stringify(state));
    } catch (error) {
      console.error("Failed to connect wallet", error);
    } finally {
      setIsConnecting(false);
      setConnectingProvider(null);
    }
  };

  const disconnectWallet = () => {
    setWalletState(defaultState);
    localStorage.removeItem("fp_wallet_mock");
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
