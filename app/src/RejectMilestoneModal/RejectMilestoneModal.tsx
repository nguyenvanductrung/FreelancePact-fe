// src/components/RejectMilestoneModal.tsx
"use client";

import { useState, FormEvent } from "react";
import { AlertCircle, X, MessageSquare, Loader2 } from "lucide-react";
import { milestonesApi } from "@/lib/api";
import { NAVY } from "@/constants";

interface RejectMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneId: string;
  milestoneTitle: string;
  onRejectSuccess?: () => void;
}

export default function RejectMilestoneModal({
  isOpen,
  onClose,
  milestoneId,
  milestoneTitle,
  onRejectSuccess,
}: RejectMilestoneModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do từ chối nghiệm thu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Gọi API PATCH gửi lên lý do từ chối
      await milestonesApi.reject(milestoneId, { reason: reason.trim() });
      
      // Reset form & đóng modal thành công
      setReason("");
      if (onRejectSuccess) onRejectSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi gửi yêu cầu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-gray-900">Từ chối nghiệm thu</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Giai đoạn (Milestone)</p>
            <p className="text-sm font-semibold text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              {milestoneTitle}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Lý do từ chối & Yêu cầu chỉnh sửa <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Vui lòng nêu rõ lý do không đạt và các điểm cần freelancer sửa đổi, bổ sung..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder:text-gray-400 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Hiển thị lỗi hệ thống nếu có */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Gợi ý quy trình */}
          <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-xs leading-relaxed">
            Hành động này sẽ đưa trạng thái Milestone về <strong>"Yêu cầu chỉnh sửa"</strong> và tự động gửi tin nhắn thông báo kèm lý do vào phòng chat chung của hai bên.
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              style={{ backgroundColor: "#EF4444" }} 
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Gửi yêu cầu
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}