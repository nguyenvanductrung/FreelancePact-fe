"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { disputesApi } from "@/lib/api";
import { Loader2, Gavel, CheckCircle2 } from "lucide-react";
import { NavBar } from "@/components/shared/NavBar";

export default function AdminDisputesPage() {
  const { walletState } = useWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // In a real app, this would be fetched from API.
  // For demonstration, we hardcode a dummy dispute to test the flow.
  const dummyDispute = {
    id: "dispute_demo_1",
    contractId: "contract_demo_1",
    reason: "Freelancer không hoàn thành dự án",
    status: "OPEN",
  };

  const handleVote = async (choice: string) => {
    if (!walletState.connected || !walletState.wallet) {
      alert("Vui lòng kết nối ví Admin (Council)!");
      return;
    }
    try {
      setLoading(true);
      setResult(null);

      // 1. Submit choice and get unsigned tx
      const res = await disputesApi.vote(dummyDispute.id, choice, "Quyết định từ hội đồng");
      const { voteId, unsignedTxCbor } = res;

      // 2. Sign tx (partial sign)
      // Note: signTx(cbor, true) is for partial signing
      const partialSigCbor = await walletState.wallet.signTx(unsignedTxCbor, true);

      // 3. Submit partial sig
      const submitRes = await disputesApi.submitPartialSig(dummyDispute.id, voteId, partialSigCbor);
      
      if (submitRes.resolved) {
        setResult(`Đã giải quyết tranh chấp thành công! TxHash: ${submitRes.txHash}`);
      } else {
        setResult(`Đã ghi nhận phiếu bầu. Chờ thêm chữ ký từ các Admin khác...`);
      }
    } catch (e: any) {
      console.error(e);
      alert("Lỗi khi xử lý Vote: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Gavel className="w-8 h-8 text-blue-600" />
            DAO Council Panel
          </h1>
        </div>

        {!walletState.connected ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 mb-4">Vui lòng kết nối ví để xem và xử lý các tranh chấp.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {result && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-800">{result}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Contract #{dummyDispute.contractId}</h3>
                  <p className="text-sm text-gray-500 mt-1">Lý do: {dummyDispute.reason}</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">
                  {dummyDispute.status}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quyết định phán xử:</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleVote("CLIENT")}
                    disabled={loading}
                    className="py-2.5 px-4 bg-blue-50 text-blue-700 border border-blue-200 font-bold rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    Hoàn tiền (Client)
                  </button>
                  <button
                    onClick={() => handleVote("FREELANCER")}
                    disabled={loading}
                    className="py-2.5 px-4 bg-purple-50 text-purple-700 border border-purple-200 font-bold rounded-xl hover:bg-purple-100 transition-colors disabled:opacity-50"
                  >
                    Trả lương (Freelancer)
                  </button>
                  <button
                    onClick={() => handleVote("SPLIT")}
                    disabled={loading}
                    className="py-2.5 px-4 bg-gray-50 text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Chia đôi (50/50)
                  </button>
                </div>
                {loading && (
                  <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang xây dựng và ký Transaction...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
