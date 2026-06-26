import { useState, FormEvent } from 'react';
import { milestonesApi } from '@/lib/api';
import { AlertTriangle, FileUp, LinkIcon, Send, Loader2 } from 'lucide-react';
interface SubmitMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneId: string;
  milestoneTitle: string;
  onSubmitSuccess: (milestoneId: string, proofOfWork: string) => void;
}

export default function SubmitMilestoneModal({
  isOpen,
  onClose,
  milestoneId,
  milestoneTitle,
  onSubmitSuccess,
}: SubmitMilestoneModalProps) {
  const [submissionNote, setSubmissionNote] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!proofLink.trim()) {
      setError("Vui lòng cung cấp link minh chứng sản phẩm (GitHub, Figma...)");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Hợp nhất văn bản ghi chú và link minh chứng làm proofOfWork gửi lên API
      const proofOfWork = JSON.stringify({
        note: submissionNote.trim(),
        link: proofLink.trim(),
        submittedAt: new Date().toISOString(),
      });

      // Gọi API PATCH /milestones/:id/submit từ lib/api của bạn
      await milestonesApi.submit(milestoneId, { proofOfWork });

      // Gọi callback để cập nhật lại trạng thái trên giao diện UI cha
      onSubmitSuccess(milestoneId, proofOfWork);
      
      // Reset form và đóng modal
      setSubmissionNote("");
      setProofLink("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra khi nộp sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Nộp sản phẩm báo cáo</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[350px]">{milestoneTitle}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input 1: Ghi chú */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <FileUp className="w-3.5 h-3.5 text-gray-400" />
              Ghi chú / Mô tả sản phẩm nộp
            </label>
            <textarea
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
              placeholder="Mô tả ngắn gọn công việc đã hoàn thành hoặc các lưu ý cho Client..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none resize-none transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Input 2: Link minh chứng */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
              Link kết quả công việc <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
              placeholder="https://github.com/... hoặc https://figma.com/..."
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-50"
              style={{ backgroundColor: "#0B3C5D" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Gửi báo cáo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
