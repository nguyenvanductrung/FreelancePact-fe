"use client";

import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2, ChevronDown } from "lucide-react";
import { WalletProvider } from "@/types/web3";

export function WalletConnectButton() {
  const { walletState, connectWallet, disconnectWallet, isConnecting, connectingProvider } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleConnect = async (provider: WalletProvider) => {
    await connectWallet(provider);
    setIsModalOpen(false);
  };

  const formatAddress = (addr: string | null) => {
    if (!addr) return "";
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 4)}`;
  };

  // Connected state: show address/balance + dropdown
  if (walletState.connected && walletState.address) {
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ backgroundColor: "#1B2A4A", borderColor: "#1B2A4A" }}>
            <Wallet className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-gray-800 leading-tight">
              {walletState.balanceAda.toLocaleString()} ADA
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              {formatAddress(walletState.address)}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <p className="text-xs font-medium text-gray-500">Connected to {walletState.provider === 'nami' ? 'Nami' : 'Eternl'}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate" title={walletState.address}>
                {walletState.address}
              </p>
            </div>
            <div className="p-1">
              <button
                onClick={() => {
                  disconnectWallet();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Disconnected state: show Connect button + Modal
  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="h-9 px-4 rounded-full text-sm font-semibold text-white transition-colors duration-200 shadow-sm hover:shadow"
        style={{ backgroundColor: "#1B2A4A" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#141f36")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1B2A4A")}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      {/* Simple Backdrop Modal for Dialog */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" 
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900" style={{ color: "#1B2A4A" }}>Connect Wallet</h3>
                <p className="text-sm text-gray-500 mt-1">Select a provider to continue</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-50" style={{ color: "#4F6AF5" }}>
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {/* Nami Option */}
              <button
                onClick={() => handleConnect('nami')}
                disabled={isConnecting}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://namiwallet.io/favicon.ico" 
                      alt="Nami" 
                      className="w-6 h-6 object-contain" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                        }
                      }} 
                    />
                    <span className="text-sm font-bold text-emerald-600 hidden">N</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#4F6AF5]">Nami</p>
                    <p className="text-xs text-gray-500">Browser Extension</p>
                  </div>
                </div>
                {isConnecting && connectingProvider === 'nami' ? (
                  <Loader2 className="w-5 h-5 text-[#4F6AF5] animate-spin" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-300 -rotate-90 group-hover:text-[#4F6AF5]" />
                )}
              </button>

              {/* Eternl Option */}
              <button
                onClick={() => handleConnect('eternl')}
                disabled={isConnecting}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://eternl.io/favicon.ico" 
                      alt="Eternl" 
                      className="w-6 h-6 object-contain" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                        }
                      }} 
                    />
                    <span className="text-sm font-bold text-red-600 hidden">E</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#4F6AF5]">Eternl</p>
                    <p className="text-xs text-gray-500">Browser Extension</p>
                  </div>
                </div>
                {isConnecting && connectingProvider === 'eternl' ? (
                  <Loader2 className="w-5 h-5 text-[#4F6AF5] animate-spin" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-300 -rotate-90 group-hover:text-[#4F6AF5]" />
                )}
              </button>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 text-center border-t border-gray-100">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
