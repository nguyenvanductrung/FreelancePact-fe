"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, User, Loader2, Gavel } from "lucide-react";
import { NAVY } from "@/constants";

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (outcome: "Client" | "Freelancer") => void;
}

type Vote = "pending" | "client" | "freelancer";

export function DisputeModal({ isOpen, onClose, onResolve }: DisputeModalProps) {
  const [phase, setPhase] = useState<"initial" | "voting" | "resolved">("initial");
  const [votes, setVotes] = useState<Vote[]>(["pending", "pending", "pending"]);

  useEffect(() => {
    if (isOpen) {
      setPhase("initial");
      setVotes(["pending", "pending", "pending"]);
    }
  }, [isOpen]);

  // Simulate voting process
  useEffect(() => {
    if (phase === "voting") {
      const t1 = setTimeout(() => setVotes(["client", "pending", "pending"]), 800);
      const t2 = setTimeout(() => setVotes(["client", "freelancer", "pending"]), 1600);
      const t3 = setTimeout(() => {
        setVotes(["client", "freelancer", "client"]);
        setTimeout(() => setPhase("resolved"), 500);
      }, 2500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [phase]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={phase === "voting" ? undefined : onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-red-50/30">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Mở Tranh chấp (Dispute)</h3>
            <p className="text-sm text-gray-500 mt-0.5">Mô phỏng DAO Council Vote</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {phase === "initial" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  Trạng thái hợp đồng sẽ chuyển sang <strong>DISPUTED</strong>. Số lượng ADA trong
                  Escrow sẽ bị khóa cho đến khi Council đưa ra phán quyết cuối cùng.
                </p>
              </div>
              <button
                onClick={() => setPhase("voting")}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white rounded-xl shadow-md transition-all hover:bg-red-700 active:scale-[0.98] bg-red-600"
              >
                <ShieldAlert className="w-4 h-4" /> Bắt đầu Mô phỏng Vote
              </button>
            </div>
          )}

          {(phase === "voting" || phase === "resolved") && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-gray-900">
                  {phase === "voting" ? "Đang thu thập phiếu bầu..." : "Đã có kết quả phán quyết"}
                </h4>
                <p className="text-xs text-gray-500">
                  Ban quản trị (DAO Council) đang xem xét bằng chứng.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((num, i) => {
                  const vote = votes[i];
                  return (
                    <div
                      key={num}
                      className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all duration-300 ${
                        vote === "pending"
                          ? "bg-gray-50 border-gray-200"
                          : vote === "client"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                          vote === "pending"
                            ? "bg-gray-300"
                            : vote === "client"
                            ? "bg-blue-500"
                            : "bg-emerald-500"
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Admin {num}</span>
                      <div className="h-5 flex items-center justify-center">
                        {vote === "pending" ? (
                          <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
                        ) : (
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              vote === "client" ? "text-blue-700" : "text-emerald-700"
                            }`}
                          >
                            Vote: {vote}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {phase === "resolved" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800">Tranh chấp đã được giải quyết</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Tỷ lệ 2/3 ủng hộ Client. Tiền sẽ được hoàn trả.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onResolve("Client");
                  onClose();
                }}
                className="w-full py-3 text-sm font-bold text-white rounded-xl shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: NAVY }}
              >
                Cập nhật trạng thái RESOLVED
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
