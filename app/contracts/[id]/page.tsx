"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/LogoIcon";
import {
  ChevronLeft,
  Bell,
  Calendar,
  FileText,
  Download,
  Paperclip,
  Send,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  MoreHorizontal,
  Layers,
  CreditCard,
  MessageSquare,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  Users,
  TrendingUp,
} from "lucide-react";
import { SubmitMilestoneModal } from "@/components/milestones/SubmitMilestoneModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageType = "client" | "self" | "system-file";

interface ChatMessage {
  id: number;
  type: MessageType;
  sender?: string;
  avatar?: string;
  time: string;
  text?: string;
  file?: {
    name: string;
    size: string;
    note: string;
  };
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    type: "client",
    sender: "Sarah Connor",
    avatar: "SC",
    time: "09:11 SA",
    text: "Chào bạn, tôi đã tải lên các bản wireframe ban đầu cho luồng Đăng ký. Bạn có thể xem qua ở tab Milestones nhé. Có một vài điểm về bảo mật tôi cần xác nhận lại.",
  },
  {
    id: 2,
    type: "system-file",
    sender: "Hệ thống",
    time: "09:45 SA",
    file: {
      name: "Wireframes_v1.pdf",
      size: "2.4 MB",
      note: "Đã tải lên vào Milestone 1",
    },
  },
  {
    id: 3,
    type: "self",
    time: "10:12 SA",
    text: "Cảm ơn Sarah. Tôi sẽ xem qua ngay chiều nay. Về phần bảo mật 2FA, chúng ta có thể sử dụng giải pháp mà tôi đã note trong tài liệu yêu cầu ban đầu.",
  },
];

const NAVY = "#0B3C5D";

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 select-none">
        <LogoIcon className="w-8 h-8" style={{ color: NAVY }} />
        <span className="text-base font-bold" style={{ color: NAVY }}>
          FreelancePact
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/contracts"
          className="text-sm font-semibold border-b-2 pb-0.5"
          style={{ color: NAVY, borderColor: NAVY }}
        >
          My Contracts
        </Link>
        <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Profile
        </Link>
        <Link href="/chat" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Chat
        </Link>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-4">
        <button className="relative p-1.5 text-gray-500 hover:text-gray-800 transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
          style={{ background: "linear-gradient(135deg, #7E57C2, #512DA8)" }}
          aria-label="Profile"
        >
          JD
        </div>
      </div>
    </nav>
  );
}

function BreadcrumbBar() {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/contracts" className="flex items-center gap-1 hover:text-gray-800 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Danh sách</span>
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">Chi tiết Hợp đồng #CTR-2024-892</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
          Tùy chọn
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white rounded-md transition-colors hover:opacity-90"
          style={{ backgroundColor: NAVY }}
        >
          <CheckCircle2 className="w-4 h-4" />
          Ký duyệt Thanh toán
        </button>
      </div>
    </div>
  );
}

function ContractHeader() {
  return (
    <div className="px-6 pt-6 pb-4 bg-white">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
        Thiết kế lại Ứng dụng Di động FinTech
      </h1>
      <div className="flex items-center gap-3 mt-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white rounded-full"
          style={{ backgroundColor: "#1565C0" }}
        >
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Đang thực hiện
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          Bắt đầu: 10 Thg 10, 2024
        </span>
      </div>
    </div>
  );
}

type TabKey = "milestones" | "payments" | "discussion";

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "milestones", label: "Milestones", icon: <Layers className="w-3.5 h-3.5" /> },
    { key: "payments", label: "Thanh toán & Hóa đơn", icon: <CreditCard className="w-3.5 h-3.5" /> },
    { key: "discussion", label: "Thảo luận", icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="flex gap-1 px-6 py-2 bg-white border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${active === tab.key
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Chat bubbles ──────────────────────────────────────────────────────────────

function AvatarCircle({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
  );
}

function ClientBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex gap-3 items-start">
      <AvatarCircle initials="SC" color="linear-gradient(135deg,#F59E0B,#D97706)" />
      <div className="flex-1 max-w-[80%]">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{msg.sender}</span>
          <span className="text-xs text-gray-400">{msg.time}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl rounded-tl-none px-4 py-3 shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>
        </div>
      </div>
    </div>
  );
}

function SystemFileBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-gray-500">⚙</span>
      </div>
      <div className="flex-1 max-w-[80%]">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-500">{msg.sender}</span>
          <span className="text-xs text-gray-400">{msg.time}</span>
        </div>
        {msg.file && (
          <div className="bg-white border border-gray-200 rounded-xl rounded-tl-none shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{msg.file.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {msg.file.size} • {msg.file.note}
                </p>
              </div>
              <button
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Download file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SelfBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex gap-3 items-end justify-end">
      <div className="max-w-[75%]">
        <div className="flex items-baseline gap-2 mb-1 justify-end">
          <span className="text-xs text-gray-400">{msg.time}</span>
          <span className="text-sm font-semibold text-gray-800">Bạn</span>
        </div>
        <div
          className="px-4 py-3 rounded-xl rounded-br-none text-white text-sm leading-relaxed shadow-md"
          style={{ backgroundColor: NAVY }}
        >
          {msg.text}
        </div>
      </div>
      <AvatarCircle initials="JD" color="linear-gradient(135deg,#7E57C2,#512DA8)" />
    </div>
  );
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ── Discussion panel ──────────────────────────────────────────────────────────

function DiscussionPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      type: "self",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      text: trimmed,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    console.log("Message sent:", { text: trimmed });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Channel header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-800">Kênh thảo luận chung</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/40">
        <DateSeparator label="HÔM NAY, 24 THG 10" />
        {messages.map((msg) => {
          if (msg.type === "client") return <ClientBubble key={msg.id} msg={msg} />;
          if (msg.type === "system-file") return <SystemFileBubble key={msg.id} msg={msg} />;
          return <SelfBubble key={msg.id} msg={msg} />;
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-full border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-all">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              aria-label="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn để trao đổi an toàn..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-opacity hover:opacity-90 active:scale-95"
            style={{ backgroundColor: NAVY }}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Milestones tab placeholder ────────────────────────────────────────────────

function MilestonesTab() {
  const [submittingMilestone, setSubmittingMilestone] = useState<any>(null);

  const MOCK_MILESTONES = [
    { id: "m1", name: "Milestone 1 — Wireframes & Research", status: "completed", pct: 100, budget: 75000000, deadline: "2024-10-30T00:00:00Z" },
    { id: "m2", name: "Milestone 2 — UI Design System", status: "active", pct: 40, budget: 75000000, deadline: "2024-11-15T00:00:00Z" },
    { id: "m3", name: "Milestone 3 — Prototype & Testing", status: "pending", pct: 0, budget: 75000000, deadline: "2024-11-30T00:00:00Z" },
    { id: "m4", name: "Milestone 4 — Final Delivery", status: "pending", pct: 0, budget: 75000000, deadline: "2024-12-15T00:00:00Z" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {MOCK_MILESTONES.map((m) => (
        <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${m.status === "completed" ? "bg-emerald-500" :
                  m.status === "active" ? "bg-blue-500 animate-pulse" : "bg-gray-300"
                }`} />
              <span className="text-sm font-semibold text-gray-800">{m.name}</span>
            </div>
            <span className="text-sm font-bold flex-shrink-0" style={{ color: NAVY }}>
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(m.budget)}
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Tiến độ</span>
              <span>Hạn: {new Date(m.deadline).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${m.pct}%`,
                  backgroundColor: m.status === "completed" ? "#10B981" : NAVY,
                }}
              />
            </div>
          </div>
          {m.status === "active" && (
            <div className="mt-4 pt-3 border-t border-gray-100 text-right">
              <button
                onClick={() => setSubmittingMilestone(m)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                Submit Milestone
              </button>
            </div>
          )}
        </div>
      ))}

      {submittingMilestone && (
        <SubmitMilestoneModal
          milestone={submittingMilestone}
          onClose={() => setSubmittingMilestone(null)}
          onSuccess={(id) => {
            console.log("Milestone submitted:", id);
            // Refresh list here
          }}
        />
      )}
    </div>
  );
}

function PaymentsTab() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400">
      <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
      <p className="text-sm">Lịch sử thanh toán và hóa đơn sẽ hiển thị ở đây.</p>
    </div>
  );
}

// ── Right Sidebar ─────────────────────────────────────────────────────────────

function OverviewCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <TrendingUp className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-semibold text-gray-700">Tổng quan</span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Total value */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Tổng giá trị</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">$12,500.00</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1 justify-end">
              <Wallet className="w-3 h-3" /> Đã Escrow
            </p>
            <p className="text-lg font-bold mt-0.5" style={{ color: "#1565C0" }}>
              $3,125.00
            </p>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-medium">Tiến độ chung</span>
            <span className="font-bold text-gray-700">25%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: "25%", backgroundColor: NAVY }}
            />
          </div>
        </div>

        {/* Deadline milestone */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">Deadline Milestone 1</p>
            <p className="text-xs text-amber-600 mt-0.5">30 Thg 10, 2024 (Còn 6 ngày)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartnerCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <Users className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-semibold text-gray-700">Thông tin Đối tác</span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Profile row */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}
          >
            SC
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Sarah Connor</p>
            <p className="text-xs text-gray-500">Lead UI/UX Designer</p>
          </div>
        </div>

        {/* Meta info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Đã xác minh KYC</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>San Francisco, CA (PST)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 fill-amber-400" />
            <span>
              <span className="font-semibold text-gray-800">4.9</span>
              <span className="text-gray-400">/5.0 (24 Hợp đồng)</span>
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all hover:text-white group"
          style={{ borderColor: NAVY, color: NAVY }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = NAVY;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = NAVY;
          }}
        >
          <Eye className="w-4 h-4" />
          Xem Hồ sơ Đầy đủ
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("discussion");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <NavBar />
      <BreadcrumbBar />

      {/* Contract header */}
      <ContractHeader />

      {/* Tabs */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Main 2-col layout */}
      <div className="flex-1 flex gap-5 px-6 py-5 max-w-[1400px] mx-auto w-full">

        {/* ── LEFT 70% ── */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Discussion is always rendered for chat height; others are stacked below header */}
          {activeTab === "discussion" && (
            <div className="flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: "400px" }}>
              <DiscussionPanel />
            </div>
          )}
          {activeTab === "milestones" && <MilestonesTab />}
          {activeTab === "payments" && <PaymentsTab />}
        </div>

        {/* ── RIGHT 30% ── */}
        <aside className="w-80 flex-shrink-0 space-y-4 sticky top-[130px] self-start">
          <OverviewCard />
          <PartnerCard />
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold" style={{ color: NAVY }}>FreelancePact</p>
            <p className="text-xs text-gray-400 mt-0.5">© 2024 FreelancePact. Secure Payments. Legal Contracts.</p>
          </div>
          <nav className="flex items-center gap-5">
            {["Terms of Service", "Privacy Policy", "Contact Support"].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                {link}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
