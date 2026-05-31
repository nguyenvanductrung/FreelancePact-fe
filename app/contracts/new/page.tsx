"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  CalendarDays,
  FileSignature,
  Info,
  Save,
} from "lucide-react";
import { NavBar } from "@/components/shared/NavBar";
import { Footer } from "@/components/shared/Footer";
import { SectionCard, SectionHeading } from "@/components/shared/SectionCard";
import { NAVY, PAYMENT_TERM_OPTIONS } from "@/constants";
import { contractsApi } from "@/lib/api";
import type { Milestone, PaymentTerm, CreateContractPayload } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

let milestoneCounter = 3;

function createMilestone(): Milestone {
  return {
    id: `ms-${milestoneCounter++}`,
    name: "",
    budget: 0,
    deadline: "",
    status: "pending",
    progressPercent: 0,
  };
}

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-md outline-none transition-all placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

// ─── Milestone Row ────────────────────────────────────────────────────────────

function MilestoneRow({
  index,
  milestone,
  canDelete,
  onChange,
  onDelete,
}: {
  index: number;
  milestone: Milestone;
  canDelete: boolean;
  onChange: (id: string, field: "name" | "budget" | "deadline", value: string) => void;
  onDelete: (id: string) => void;
}) {
  const nameId = `ms-name-${milestone.id}`;
  const budgetId = `ms-budget-${milestone.id}`;
  const deadlineId = `ms-deadline-${milestone.id}`;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Giai đoạn {index + 1}
        </span>
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(milestone.id)}
            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
            aria-label="Xóa giai đoạn"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px_180px] gap-3">
        {/* Name */}
        <div>
          <label htmlFor={nameId} className={labelCls}>Tên giai đoạn</label>
          <input
            id={nameId}
            type="text"
            value={milestone.name}
            onChange={(e) => onChange(milestone.id, "name", e.target.value)}
            placeholder={index === 0 ? "Liên ý tưởng thiết kế" : "Nhập tên giai đoạn"}
            className={inputCls}
          />
        </div>

        {/* Budget */}
        <div>
          <label htmlFor={budgetId} className={labelCls}>Số tiền (VNĐ)</label>
          <div className="relative">
            <input
              id={budgetId}
              type="number"
              min="0"
              value={milestone.budget || ""}
              onChange={(e) => onChange(milestone.id, "budget", e.target.value)}
              placeholder="0"
              className={`${inputCls} pr-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 pointer-events-none select-none">
              VNĐ
            </span>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label htmlFor={deadlineId} className={labelCls}>Thời hạn</label>
          <input
            id={deadlineId}
            type="date"
            value={milestone.deadline}
            onChange={(e) => onChange(milestone.id, "deadline", e.target.value)}
            className={`${inputCls} pr-8`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateContractPage() {
  const [contractTitle, setContractTitle] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "ms-1", name: "Liên ý tưởng thiết kế", budget: 5000000, deadline: "", status: "pending", progressPercent: 0 },
    { id: "ms-2", name: "", budget: 0, deadline: "", status: "pending", progressPercent: 0 },
  ]);
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerm>("escrow-milestone");
  const [specialTerms, setSpecialTerms] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Total ──────────────────────────────────────────────────────────────────
  const totalVND = milestones.reduce((sum, m) => sum + (m.budget || 0), 0);
  const formattedTotal = new Intl.NumberFormat("vi-VN").format(totalVND);

  // ── Milestone handlers ─────────────────────────────────────────────────────
  const handleMilestoneChange = (
    id: string,
    field: "name" | "budget" | "deadline",
    value: string
  ) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, [field]: field === "budget" ? Number(value) : value }
          : m
      )
    );
  };

  const handleAddMilestone = () =>
    setMilestones((prev) => [...prev, createMilestone()]);

  const handleDeleteMilestone = (id: string) =>
    setMilestones((prev) => prev.filter((m) => m.id !== id));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload: CreateContractPayload = {
      title: contractTitle,
      partnerName,
      description,
      paymentTerm,
      specialTerms: specialTerms || undefined,
      milestones: milestones.map(({ id: _id, status: _s, progressPercent: _p, ...rest }) => rest),
    };

    try {
      // TODO: replace console.log with real API call when BE is ready
      // const result = await contractsApi.create(payload);
      // router.push(`/contracts/${result.data.id}`);
      console.log("📄 Create Contract payload:", payload);
      alert("Hợp đồng đã được tạo thành công! (xem console)");
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message ?? "Đã xảy ra lỗi.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      // TODO: call contractsApi.create({ ...payload, status: 'draft' })
      console.log("💾 Draft saved:", { contractTitle, partnerName, milestones });
    } finally {
      setTimeout(() => setSaving(false), 1200);
    }
  };

  const selectedPaymentOption = PAYMENT_TERM_OPTIONS.find((o) => o.value === paymentTerm);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F8FAFC", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <NavBar activePage="Contracts" />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSignature className="w-6 h-6" style={{ color: NAVY }} />
              <h1 className="text-2xl font-extrabold text-gray-900">Tạo Hợp Đồng Mới</h1>
            </div>
            <p className="text-sm text-gray-500">
              Điền các thông tin chi tiết để tạo hợp đồng dịch vụ tự do.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu…" : "Lưu Nháp"}
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* ── Section 1: General Information */}
          <SectionCard>
            <SectionHeading>Thông Tin Chung</SectionHeading>
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contract-title" className={labelCls}>
                    Tiêu đề hợp đồng <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contract-title"
                    type="text"
                    required
                    value={contractTitle}
                    onChange={(e) => setContractTitle(e.target.value)}
                    placeholder="Vd: Thiết kế Website Thương mại điện tử"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="partner-name" className={labelCls}>
                    Tên Khách hàng / Doanh nghiệp <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="partner-name"
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Nhập tên khách hàng"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className={labelCls}>Mô tả tóm tắt dự án</label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả ngắn gọn về mục tiêu và phạm vi công việc..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Section 2: Milestones */}
          <SectionCard>
            <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800">
                Giai Đoạn <span className="font-normal text-gray-500">(Milestones)</span>
              </h2>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-75"
                style={{ color: NAVY }}
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Giai Đoạn
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {milestones.map((ms, i) => (
                <MilestoneRow
                  key={ms.id}
                  index={i}
                  milestone={ms}
                  canDelete={milestones.length > 1}
                  onChange={handleMilestoneChange}
                  onDelete={handleDeleteMilestone}
                />
              ))}
              <div className="flex justify-end pt-2 border-t border-gray-100 mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-500">Tổng Giá Trị:</span>
                  <span className="text-base font-extrabold" style={{ color: NAVY }}>
                    {formattedTotal} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Section 3: Payment Terms */}
          <SectionCard>
            <SectionHeading>Điều Khoản Thanh Toán</SectionHeading>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_TERM_OPTIONS.map((opt) => {
                  const isSelected = paymentTerm === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/60"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-term"
                        value={opt.value}
                        checked={isSelected}
                        onChange={() => setPaymentTerm(opt.value)}
                        className="mt-0.5 accent-blue-600 flex-shrink-0"
                      />
                      <div>
                        <p className={`text-sm font-semibold ${isSelected ? "text-blue-800" : "text-gray-800"}`}>
                          {opt.label}
                        </p>
                        <p className={`text-xs mt-0.5 leading-relaxed ${isSelected ? "text-blue-600" : "text-gray-400"}`}>
                          {opt.desc}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {selectedPaymentOption && (
                <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <span className="font-semibold">{selectedPaymentOption.label}: </span>
                    {selectedPaymentOption.desc}
                  </p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Section 4: Special Clauses */}
          <SectionCard>
            <SectionHeading>Điều Khoản Khác</SectionHeading>
            <div className="px-6 py-5">
              <label htmlFor="special-terms" className={labelCls}>
                Bổ sung điều khoản đặc biệt{" "}
                <span className="text-gray-400 font-normal">(Không bắt buộc)</span>
              </label>
              <textarea
                id="special-terms"
                rows={5}
                value={specialTerms}
                onChange={(e) => setSpecialTerms(e.target.value)}
                placeholder="Nhập các điều khoản bổ sung về bản quyền, bảo mật thông tin, v.v..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </SectionCard>

          {/* ── Bottom Actions */}
          <div className="flex items-center justify-between gap-3 pt-2 pb-6">
            <p className="text-xs text-gray-400 hidden sm:block">* Các trường bắt buộc phải điền.</p>
            <div className="flex items-center gap-3 ml-auto">
              <Link
                href="/contracts"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy Bỏ
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-opacity hover:opacity-90 active:scale-[0.98] shadow-md disabled:opacity-60"
                style={{ backgroundColor: NAVY }}
              >
                <FileSignature className="w-4 h-4" />
                {submitting ? "Đang tạo…" : "Tạo Hợp Đồng"}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
