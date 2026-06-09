"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { X, UploadCloud, FileText, FileImage, Archive, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Milestone } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface SubmitMilestoneModalProps {
  milestone: Pick<Milestone, "id" | "name" | "budget" | "deadline">;
  onClose: () => void;
  /** Called after a successful submission — parent should refresh milestone list */
  onSuccess?: (milestoneId: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/gif", "image/webp", "application/zip", "application/x-zip-compressed"];
const ACCEPTED_EXT = ".pdf,.png,.jpg,.jpeg,.gif,.webp,.zip";

function FileIcon({ type }: { type: string }) {
  if (type.startsWith("image/")) return <FileImage className="w-4 h-4 text-blue-500" />;
  if (type.includes("zip")) return <Archive className="w-4 h-4 text-yellow-600" />;
  return <FileText className="w-4 h-4 text-red-500" />;
}

function formatDeadline(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatVND(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)}M ₫`;
  return `${amount.toLocaleString("vi-VN")} ₫`;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-white border border-green-200 shadow-xl rounded-xl px-5 py-4 animate-in slide-in-from-bottom-2 duration-300">
      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
      <span className="text-sm font-medium text-gray-800">{message}</span>
      <button onClick={onDismiss} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function SubmitMilestoneModal({ milestone, onClose, onSuccess }: SubmitMilestoneModalProps) {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const addFiles = useCallback((incoming: File[]) => {
    const valid = incoming.filter((f) => ACCEPTED_TYPES.includes(f.type));
    if (valid.length < incoming.length) {
      setError("Some files were skipped — only PDF, images, and ZIP are accepted.");
    }
    setFiles((prev) => [
      ...prev,
      ...valid.map((f) => ({
        id: `${f.name}-${f.size}-${Date.now()}`,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    ]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!description.trim()) {
      setError("Please describe what you completed.");
      return;
    }
    if (!confirmed) {
      setError("Please confirm the work meets the agreed requirements.");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: replace with real API call
      // const fileUrls = await Promise.all(files.map(uploadFile));
      // await fetch(`/api/v1/milestones/${milestone.id}/submit`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //   },
      //   body: JSON.stringify({ description: description.trim(), fileUrls }),
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setShowToast(true);
      onSuccess?.(milestone.id);
      setTimeout(onClose, 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = description.trim().length > 0 && confirmed && !isSubmitting;

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
                Submit Milestone
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

          {/* Milestone meta */}
          <div className="flex gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="font-medium text-gray-400">Budget:</span>
              <span className="font-semibold text-[#1B2A4A]">{formatVND(milestone.budget)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="font-medium text-gray-400">Deadline:</span>
              <span>{formatDeadline(milestone.deadline)}</span>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Description */}
            <div>
              <label htmlFor="milestone-description" className="block text-sm font-medium text-gray-700 mb-1.5">
                What did you complete? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="milestone-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work you completed for this milestone. Include any key decisions, links to deliverables, or notes for the client..."
                rows={4}
                className="w-full px-4 py-3 text-sm bg-[#F3F4F6] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2A4A]/30 placeholder:text-gray-400 resize-none transition"
              />
              <p className="mt-1 text-xs text-gray-400 text-right">
                {description.length} characters
              </p>
            </div>

            {/* File Upload Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Attachments <span className="text-gray-400 font-normal">(PDF, image, or ZIP)</span>
              </label>
              <div
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-[#1B2A4A] bg-[#1B2A4A]/5 scale-[1.01]"
                    : "border-gray-200 hover:border-[#1B2A4A]/40 hover:bg-gray-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_EXT}
                  onChange={handleFileInput}
                  className="hidden"
                  aria-label="Upload files"
                />
                <UploadCloud className={`mx-auto w-8 h-8 mb-2 transition-colors ${isDragging ? "text-[#1B2A4A]" : "text-gray-400"}`} />
                <p className="text-sm font-medium text-gray-700">
                  {isDragging ? "Drop files here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Accepts PDF, PNG, JPG, GIF, WEBP, ZIP</p>
              </div>

              {/* File list */}
              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-3 px-3 py-2.5 bg-[#F3F4F6] rounded-lg text-sm"
                    >
                      <FileIcon type={f.type} />
                      <span className="flex-1 min-w-0 truncate text-gray-800 font-medium">{f.name}</span>
                      <span className="text-gray-400 flex-shrink-0">{formatBytes(f.size)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label={`Remove ${f.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirmation Checklist */}
            <label
              htmlFor="confirm-checkbox"
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                confirmed
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                id="confirm-checkbox"
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#1B2A4A] flex-shrink-0 cursor-pointer"
              />
              <span className={`text-sm leading-snug ${confirmed ? "text-green-800" : "text-gray-700"}`}>
                I confirm that this work meets the agreed requirements and is ready for client review.
              </span>
            </label>

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
              Cancel
            </button>
            <button
              id="btn-submit-milestone"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1B2A4A" }}
              onMouseEnter={(e) => {
                if (canSubmit) e.currentTarget.style.backgroundColor = "#131D33";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1B2A4A";
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Review"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <SuccessToast
          message="Milestone submitted successfully! Waiting for client review."
          onDismiss={() => setShowToast(false)}
        />
      )}
    </>
  );
}
