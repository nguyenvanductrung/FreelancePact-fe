"use client";

import { useState, FormEvent, useId } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  Trash2,
  ChevronDown,
  CalendarDays,
  FileSignature,
  Info,
  Save,
  AlertCircle,
  X,
} from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAVY = "#0B3C5D";

const PARTNER_OPTIONS = [
  { value: "", label: "Nhập tên khách hàng" },
  { value: "acme", label: "Acme Corporation" },
  { value: "nova", label: "Nova Digital Studio" },
  { value: "greenleaf", label: "Greenleaf Ventures" },
  { value: "techbridge", label: "TechBridge Inc." },
];

const PAYMENT_TERM_OPTIONS = [
  {
    value: "escrow-milestone",
    label: "Escrow theo Milestone",
    desc: "Thanh toán được giữ trong ví escrow và giải phóng khi mỗi milestone hoàn thành.",
  },
  {
    value: "escrow-full",
    label: "Escrow toàn bộ",
    desc: "Toàn bộ ngân sách được escrow ngay khi ký hợp đồng, giải phóng khi nghiệm thu cuối.",
  },
  {
    value: "net-15",
    label: "Net-15",
    desc: "Thanh toán trong vòng 15 ngày kể từ ngày xuất hóa đơn.",
  },
  {
    value: "net-30",
    label: "Net-30",
    desc: "Thanh toán trong vòng 30 ngày kể từ ngày xuất hóa đơn.",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Milestone {
  id: string;
  name: string;
  budget: string;
  deadline: string;
}

let milestoneCounter = 3;

function createMilestone(): Milestone {
  return { id: `ms-${milestoneCounter++}`, name: "", budget: "", deadline: "" };
}

// ─── Shared Input styles ──────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-md outline-none transition-all placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Top navigation bar */
function NavBar() {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
      <Link href="/" className="flex items-center gap-2 select-none">
        <LogoIcon className="w-8 h-8" style={{ color: NAVY }} />
        <span className="text-base font-bold" style={{ color: NAVY }}>
          FreelancePact
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Dashboard
        </Link>
        <Link
          href="/contracts"
          className="text-sm font-semibold border-b-2 pb-0.5"
          style={{ color: NAVY, borderColor: NAVY }}
        >
          My Contracts
        </Link>
        <Link href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Templates
        </Link>
      </div>

      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <Bell className="w-5 h-5" />
        <span className="hidden sm:inline">Notifications</span>
      </button>
    </nav>
  );
}

/** Section wrapper card */
function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

/** Section heading inside a card */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 pt-5 pb-4 border-b border-gray-100">
      <h2 className="text-base font-bold text-gray-800">{children}</h2>
    </div>
  );
}

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
  onChange: (id: string, field: keyof Milestone, value: string) => void;
  onDelete: (id: string) => void;
}) {
  const nameId = `ms-name-${milestone.id}`;
  const budgetId = `ms-budget-${milestone.id}`;
  const deadlineId = `ms-deadline-${milestone.id}`;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3">
      {/* Row header */}
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

      {/* Fields row */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px_180px] gap-3">
        {/* Name */}
        <div>
          <label htmlFor={nameId} className={labelCls}>
            Tên giai đoạn
          </label>
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
          <label htmlFor={budgetId} className={labelCls}>
            Số tiền (VNĐ)
          </label>
          <div className="relative">
            <input
              id={budgetId}
              type="number"
              min="0"
              value={milestone.budget}
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
          <label htmlFor={deadlineId} className={labelCls}>
            Thời hạn (Ngày)
          </label>
          <div className="relative">
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
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CreateContractPage() {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [contractTitle, setContractTitle] = useState("");
  const [partner, setPartner] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "ms-1", name: "Liên ý tưởng thiết kế", budget: "5000000", deadline: "" },
    { id: "ms-2", name: "", budget: "", deadline: "" },
  ]);
  const [paymentTerm, setPaymentTerm] = useState("escrow-milestone");
  const [specialTerms, setSpecialTerms] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Total calculation ────────────────────────────────────────────────────────
  const totalVND = milestones.reduce((sum, m) => {
    const val = parseFloat(m.budget.replace(/,/g, "") || "0");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const formattedTotal = new Intl.NumberFormat("vi-VN").format(totalVND);

  // ── Milestone handlers ───────────────────────────────────────────────────────
  const handleMilestoneChange = (
    id: string,
    field: keyof Milestone,
    value: string
  ) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleAddMilestone = () => {
    setMilestones((prev) => [...prev, createMilestone()]);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      contractTitle,
      partner,
      description,
      milestones: milestones.map(({ id: _id, ...rest }) => rest),
      paymentTerm,
      specialTerms,
      totalVND,
    };
    console.log("📄 Create Contract payload:", payload);
    alert("Hợp đồng đã được tạo thành công! (xem console)");
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
    console.log("💾 Draft saved:", { contractTitle, partner, milestones });
  };

  const selectedPaymentOption = PAYMENT_TERM_OPTIONS.find(
    (o) => o.value === paymentTerm
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F8FAFC", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <NavBar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSignature className="w-6 h-6" style={{ color: NAVY }} />
              <h1 className="text-2xl font-extrabold text-gray-900">
                Tạo Hợp Đồng Mới
              </h1>
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

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* ── Section 1: General Information ─────────────────────────── */}
          <SectionCard>
            <SectionHeading>Thông Tin Chung</SectionHeading>
            <div className="px-6 py-5 space-y-5">
              {/* Two-col row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contract title */}
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

                {/* Partner */}
                <div>
                  <label htmlFor="partner" className={labelCls}>
                    Tên Khách hàng / Doanh nghiệp{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="partner"
                      type="text"
                      required
                      value={partner}
                      onChange={(e) => setPartner(e.target.value)}
                      placeholder="Nhập tên khách hàng"
                      className={inputCls}
                      list="partner-suggestions"
                    />
                    <datalist id="partner-suggestions">
                      {PARTNER_OPTIONS.filter((o) => o.value).map((o) => (
                        <option key={o.value} value={o.label} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={labelCls}>
                  Mô tả tóm tắt dự án
                </label>
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

          {/* ── Section 2: Milestones ───────────────────────────────────── */}
          <SectionCard>
            <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800">
                Giai Đoạn{" "}
                <span className="font-normal text-gray-500">(Milestones)</span>
              </h2>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-75"
                style={{ color: NAVY }}
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm Giai Đoạn
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

              {/* Total */}
              <div className="flex justify-end pt-2 border-t border-gray-100 mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-500">Tổng Giá Trị:</span>
                  <span
                    className="text-base font-extrabold"
                    style={{ color: NAVY }}
                  >
                    {formattedTotal} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Section 3: Payment Terms ────────────────────────────────── */}
          <SectionCard>
            <SectionHeading>Điều Khoản Thanh Toán</SectionHeading>
            <div className="px-6 py-5 space-y-4">
              {/* Radio choice cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_TERM_OPTIONS.map((opt) => {
                  const isSelected = paymentTerm === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${isSelected
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
                        <p
                          className={`text-sm font-semibold ${isSelected ? "text-blue-800" : "text-gray-800"
                            }`}
                        >
                          {opt.label}
                        </p>
                        <p
                          className={`text-xs mt-0.5 leading-relaxed ${isSelected ? "text-blue-600" : "text-gray-400"
                            }`}
                        >
                          {opt.desc}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Helper info banner */}
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

          {/* ── Section 4: Special Clauses ──────────────────────────────── */}
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

          {/* ── Bottom Actions ──────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-3 pt-2 pb-6">
            {/* Left hint */}
            <p className="text-xs text-gray-400 hidden sm:block">
              * Các trường bắt buộc phải điền.
            </p>

            <div className="flex items-center gap-3 ml-auto">
              <Link
                href="/contracts"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy Bỏ
              </Link>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-opacity hover:opacity-90 active:scale-[0.98] shadow-md"
                style={{ backgroundColor: NAVY }}
              >
                <FileSignature className="w-4 h-4" />
                Tạo Hợp Đồng
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold" style={{ color: NAVY }}>
              FreelancePact
            </p>
            <p className="text-xs text-gray-400">
              © 2024 FreelancePact. Secure Payments. Legal Contracts.
            </p>
          </div>
          <nav className="flex items-center gap-5">
            {["Terms of Service", "Privacy Policy", "Contact Support"].map((l) => (
              <Link
                key={l}
                href="#"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                {l}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
