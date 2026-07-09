"use client";

import React, { useState, useEffect } from "react";
import { X, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Milestone, ContractDetail } from "@/types";
import { milestonesApi } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RejectMilestoneModalProps {
  milestone: Pick<Milestone, "id" | "name">;
  onClose: () => void;
  /** Called after a successful rejection — parent should refresh contract data / chat */
  onSuccess?: (updatedContract: ContractDetail) => void;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-white border border-red-200 shadow-xl rounded-xl px-5 py-4 animate-in slide-in-from-bottom-2 duration-300">
      <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0" />
      <span className="text-sm font-medium text-gray-800">{message}</span>
      <button onClick={onDismiss} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function RejectMilestoneModal({ milestone, onClose, onSuccess }: RejectMilestoneModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async () => {
    setError(null);
    if (!reason.trim()) {
      setError("Please provide a reason for requesting changes.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedContract = await milestonesApi.reject(milestone.id, {
        rejectionNote: reason.trim(),
      });

      setShowToast(true);
      onSuccess?.(updatedContract);
      setTimeout(onClose, 500);
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = reason.trim().length > 0 && !isSubmitting;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                Yêu cầu chỉnh sửa Milestone
              </h2>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">{milestone.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Reason Input */}
            <div>
              <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700 mb-1.5">
                Lý do từ chối nghiệm thu <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reject-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Mô tả chi tiết những phần chưa đạt yêu cầu hoặc cần chỉnh sửa để Freelancer có căn cứ thực hiện lại..."
                rows={5}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder:text-gray-400 resize-none transition"
              />
              <p className="mt-1 text-xs text-gray-400 text-right">
                {reason.length} characters
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              id="btn-reject-milestone"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Xác nhận từ chối"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <SuccessToast
          message="Yêu cầu sửa đổi thành công! Trạng thái đã chuyển sang Changes Requested."
          onDismiss={() => setShowToast(false)}
        />
      )}
    </>
  );
}