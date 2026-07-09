"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Wallet, ExternalLink, X } from "lucide-react";
import { Milestone } from "@/types";
import { milestonesApi } from "@/lib/api";
import { ContractDetail } from "@/types";

const NAVY = "#0B3C5D";

interface ApproveMilestoneModalProps {
  milestone: Milestone;
  onClose: () => void;
  onSuccess: (updatedContract: ContractDetail) => void;
}

type ApproveStep = "confirm" | "processing" | "success";

function MockTxHash() {
  const hash =
    Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("") + "...";
  return (
    <p className="text-[11px] font-mono text-gray-400 break-all mt-1">{hash}</p>
  );
}

export function ApproveMilestoneModal({
  milestone,
  onClose,
  onSuccess,
}: ApproveMilestoneModalProps) {
  const [step, setStep] = useState<ApproveStep>("confirm");
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setStep("processing");
    setError(null);
    try {
      // Simulate DAOPilot building tx (1.5s delay for UX)
      await new Promise((r) => setTimeout(r, 1500));
      const updatedContract = await milestonesApi.approve(milestone.id);
      setStep("success");
      // Auto-close after 2s on success
      setTimeout(() => {
        onSuccess(updatedContract);
        onClose();
      }, 2200);
    } catch (err: any) {
      setError(err?.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
      setStep("confirm");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={step === "processing" ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: NAVY }}
        >
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-white/80" />
            <span className="text-white font-semibold text-sm">
              Nghiệm thu & Giải ngân ADA
            </span>
          </div>
          {step !== "processing" && (
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6">
          {/* ── CONFIRM step ── */}
          {step === "confirm" && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                  Milestone được nghiệm thu
                </p>
                <p className="text-base font-bold text-emerald-900">
                  {milestone.name}
                </p>
                <div className="flex items-center gap-1.5 mt-3">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-700">
                    Giải ngân:{" "}
                    <span className="font-extrabold text-emerald-800">
                      {milestone.budget.toLocaleString()} ADA
                    </span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                Bằng cách xác nhận, bạn đồng ý rằng sản phẩm của milestone này
                đã đạt yêu cầu.{" "}
                <span className="font-semibold text-gray-800">
                  DAOPilot AI Agent
                </span>{" "}
                sẽ build transaction giải ngân{" "}
                <span className="font-bold" style={{ color: NAVY }}>
                  {milestone.budget.toLocaleString()} ADA
                </span>{" "}
                cho Freelancer.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Huỷ bỏ
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#10B981" }}
                >
                  ✅ Xác nhận nghiệm thu
                </button>
              </div>
            </>
          )}

          {/* ── PROCESSING step ── */}
          {step === "processing" && (
            <div className="flex flex-col items-center py-6 gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${NAVY}15` }}
              >
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: NAVY }}
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">
                  DAOPilot đang xử lý...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Building transaction và submit lên Cardano network
                </p>
              </div>
              {/* Fake progress steps */}
              <div className="w-full space-y-2 mt-2">
                {[
                  "Xác thực điều kiện on-chain...",
                  "Build transaction (Aiken Validator)...",
                  "Submit lên Cardano Mainnet...",
                ].map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-gray-300 animate-spin flex-shrink-0" />
                    <span className="text-xs text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SUCCESS step ── */}
          {step === "success" && (
            <div className="flex flex-col items-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 text-lg">
                  Giải ngân thành công!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold text-emerald-600">
                    {milestone.budget.toLocaleString()} ADA
                  </span>{" "}
                  đã được chuyển vào ví Freelancer
                </p>
              </div>

              {/* Mock on-chain tx info */}
              <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">
                    Transaction Hash
                  </span>
                  <a
                    href="https://cardanoscan.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    CardanoScan
                  </a>
                </div>
                <MockTxHash />
                <p className="text-[10px] text-gray-400">
                  Block confirmations: 3/3 ✓
                </p>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Cửa sổ này sẽ tự đóng sau vài giây...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
