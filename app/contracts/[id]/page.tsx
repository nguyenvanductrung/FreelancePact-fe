"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { contractsApi, authApi, paymentsApi, chatApi } from "@/lib/api";
import { ContractDetail, AuthUser, Payment, ChatMessage } from "@/types";
import { toast } from "sonner";
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
import { NavBar } from "@/components/shared/NavBar";
import { SubmitMilestoneModal } from "@/components/milestones/SubmitMilestoneModal";
import { RejectMilestoneModal } from "@/components/milestones/RejectMilestoneModal";
import { ApproveMilestoneModal } from "@/components/milestones/ApproveMilestoneModal";
import { EscrowStatusCard } from "@/components/web3/EscrowStatusCard";
import { mockEscrowStatusByContractId } from "@/lib/mock-web3";
import { EscrowStatus } from "@/types/web3";
import { useSocket } from "@/components/providers/SocketProvider";



const NAVY = "#0B3C5D";

// ─── Sub-components ───────────────────────────────────────────────────────────

function BreadcrumbBar({ contractId }: { contractId: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/contracts" className="flex items-center gap-1 hover:text-gray-800 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Danh sách</span>
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">Chi tiết Hợp đồng #{contractId}</span>
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

function ContractHeader({ contract }: { contract: ContractDetail }) {
  return (
    <div className="px-6 pt-6 pb-4 bg-white">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
        {contract.title}
      </h1>
      <div className="flex items-center gap-3 mt-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white rounded-full"
          style={{ backgroundColor: contract.status === "active" ? "#1565C0" : "#6B7280" }}
        >
          {contract.status === "active" && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
          {contract.status.toUpperCase()}
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          Bắt đầu: {new Date(contract.startDate).toLocaleDateString("vi-VN")}
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
  const time = new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const initials = msg.senderName ? msg.senderName.substring(0, 2).toUpperCase() : "U";
  return (
    <div className="flex gap-3 items-start">
      <AvatarCircle initials={initials} color="linear-gradient(135deg,#F59E0B,#D97706)" />
      <div className="flex-1 max-w-[80%]">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{msg.senderName}</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl rounded-tl-none px-4 py-3 shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>
        </div>
      </div>
    </div>
  );
}

function SystemFileBubble({ msg }: { msg: ChatMessage }) {
  const time = new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-gray-500">⚙</span>
      </div>
      <div className="flex-1 max-w-[80%]">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-500">{msg.senderName}</span>
          <span className="text-xs text-gray-400">{time}</span>
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
                  {msg.file.sizeBytes} bytes • {msg.file.milestoneNote}
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
  const time = new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex gap-3 items-end justify-end">
      <div className="max-w-[75%]">
        <div className="flex items-baseline gap-2 mb-1 justify-end">
          <span className="text-xs text-gray-400">{time}</span>
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

function DiscussionPanel({ contractId, currentUser }: { contractId: string; currentUser: AuthUser }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  // Fetch historical messages on mount
  useEffect(() => {
    if (!contractId) return;
    chatApi.getMessages(contractId, 1, 100)
      .then((res: any) => setMessages(res.data || []))
      .catch((err: any) => console.error("Failed to fetch messages:", err));
  }, [contractId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !contractId) return;
    socket.emit("joinContractRoom", { contractId });
    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveContractRoom", { contractId });
    };
  }, [socket, contractId]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    try {
      const token = localStorage.getItem("accessToken");
      console.log("[DEBUG] Token:", token ? "present" : "MISSING");
      const res = await fetch(
        `http://localhost:3001/api/v1/contracts/${contractId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ type: "TEXT", text: trimmed }),
        }
      );
      const data = await res.json();
      console.log("[DEBUG] Response:", res.status, data);
      if (!res.ok) {
        toast.error(`Lỗi ${res.status}: ${data.message} — errors: ${JSON.stringify(data.errors)}`);
        return;
      }
      setInput("");
    } catch (err: any) {
      console.error("Failed to send message:", err);
      toast.error(err?.message || "Lỗi gửi tin nhắn");
    } finally {
      setIsSending(false);
    }
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
        <DateSeparator label="HÔM NAY" />
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyận!</p>
        )}
        {messages.map((msg) => {
          if (msg.type === "system") return <SystemFileBubble key={msg.id} msg={msg} />;
          if (msg.senderId === currentUser.id) return <SelfBubble key={msg.id} msg={msg} />;
          return <ClientBubble key={msg.id} msg={msg} />;
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
            disabled={isSending}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50"
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

// ── Milestones tab ────────────────────────────────────────────────────────────

function getMilestoneStatusDetails(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return {
        label: "Pending",
        dotClass: "bg-gray-300",
        textClass: "text-gray-500",
      };
    case "active":
      return {
        label: "In Progress",
        dotClass: "bg-blue-500 animate-pulse",
        textClass: "text-blue-600",
      };
    case "submitted":
      return {
        label: "Under Review",
        dotClass: "bg-purple-500 animate-pulse",
        textClass: "text-purple-600",
      };
    case "revision_requested":
      return {
        label: "REVISION_REQUESTED",
        dotClass: "bg-amber-500 animate-pulse",
        textClass: "text-amber-600",
      };
    case "completed":
      return {
        label: "Completed",
        dotClass: "bg-emerald-500",
        textClass: "text-emerald-600",
      };
    default:
      return {
        label: status.toUpperCase(),
        dotClass: "bg-gray-300",
        textClass: "text-gray-500",
      };
  }
}

function MilestonesTab({ contract, currentUser, onContractUpdate }: { contract: ContractDetail, currentUser: AuthUser, onContractUpdate: (c: ContractDetail) => void }) {
  const [submittingMilestone, setSubmittingMilestone] = useState<any>(null);
  const [rejectingMilestone, setRejectingMilestone] = useState<any>(null);
  const [approvingMilestone, setApprovingMilestone] = useState<any>(null);

  const milestones = contract.milestones || [];
  const isFreelancer = currentUser.id === contract.freelancerId;
  const isClient = currentUser.id === contract.clientId;

  return (
    <div className="flex flex-col gap-3">
      {milestones.map((m) => {
        const statusDetails = getMilestoneStatusDetails(m.status);
        return (
          <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusDetails.dotClass}`} />
                <span className="text-sm font-semibold text-gray-800">{m.name}</span>
              </div>
              <span className="text-sm font-bold flex-shrink-0" style={{ color: NAVY }}>
                {m.budget.toLocaleString()} ADA
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>
                  Trạng thái:{" "}
                  <span className={`font-semibold ${statusDetails.textClass}`}>
                    {statusDetails.label}
                  </span>
                </span>
                <span>Hạn: {new Date(m.deadline).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${m.progressPercent}%`,
                    backgroundColor: m.status === "completed" ? "#10B981" : NAVY,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end text-right gap-3">
              {/* Active -> Freelancer can submit */}
              {m.status === "active" && isFreelancer && (
                <button
                  onClick={() => setSubmittingMilestone(m)}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: NAVY }}
                >
                  Submit Milestone
                </button>
              )}

              {/* Revision Requested -> Freelancer can submit again */}
              {m.status === "revision_requested" && isFreelancer && (
                <button
                  onClick={() => setSubmittingMilestone(m)}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90 bg-amber-600"
                >
                  Submit Lại
                </button>
              )}

              {/* Submitted -> Client can approve or reject */}
              {m.status === "submitted" && isClient && (
                <>
                  <button
                    onClick={() => setRejectingMilestone(m)}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Yêu cầu sửa
                  </button>
                  <button
                    onClick={() => setApprovingMilestone(m)}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90 bg-emerald-600"
                  >
                    Approve & Giải ngân
                  </button>
                </>
              )}

              {/* Completed */}
              {m.status === "completed" && (
                <div className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" /> Đã nghiệm thu & giải ngân
                </div>
              )}
            </div>
          </div>
        );
      })}

      {submittingMilestone && (
        <SubmitMilestoneModal
          milestone={submittingMilestone}
          onClose={() => setSubmittingMilestone(null)}
          onSuccess={onContractUpdate}
        />
      )}
      {rejectingMilestone && (
        <RejectMilestoneModal
          milestone={rejectingMilestone}
          onClose={() => setRejectingMilestone(null)}
          onSuccess={onContractUpdate}
        />
      )}
      {approvingMilestone && (
        <ApproveMilestoneModal
          milestone={approvingMilestone}
          onClose={() => setApprovingMilestone(null)}
          onSuccess={onContractUpdate}
        />
      )}
    </div>
  );
}

function PaymentsTab({ contractId }: { contractId: string }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentsApi.list(contractId)
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [contractId]);

  if (loading) return <div className="p-6 text-center text-gray-500">Đang tải lịch sử thanh toán...</div>;

  if (payments.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400">
        <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Chưa có giao dịch thanh toán nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Ngày</th>
              <th className="px-6 py-4">Milestone</th>
              <th className="px-6 py-4">Số lượng (ADA)</th>
              <th className="px-6 py-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-600">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{p.milestoneName || 'Giải ngân Hợp đồng'}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">{p.amount.toLocaleString()} ADA</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    p.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Right Sidebar ─────────────────────────────────────────────────────────────

function OverviewCard({ contract }: { contract: ContractDetail }) {
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
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(contract.totalValue)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1 justify-end">
              <Wallet className="w-3 h-3" /> Đã Escrow
            </p>
            <p className="text-lg font-bold mt-0.5" style={{ color: "#1565C0" }}>
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(contract.escrowedAmount || 0)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-medium">Tiến độ chung</span>
            <span className="font-bold text-gray-700">{contract.progressPercent}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${contract.progressPercent}%`, backgroundColor: NAVY }}
            />
          </div>
        </div>

        {/* Deadline milestone */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">Deadline Hợp đồng</p>
            <p className="text-xs text-amber-600 mt-0.5">{new Date(contract.endDate).toLocaleDateString("vi-VN")}</p>
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
  const params = useParams();
  const contractId = params?.id as string;

  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContract = () => {
    if (!contractId) return Promise.resolve();
    return contractsApi.get(contractId).then(res => {
      setContract(res.data);
    });
  };

  useEffect(() => {
    Promise.all([
      fetchContract(),
      authApi.me().then(res => setCurrentUser(res.data))
    ]).catch(err => {
      console.error(err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [contractId]);

  const [activeTab, setActiveTab] = useState<TabKey>("discussion");
  const [escrowStatus, setEscrowStatus] = useState<EscrowStatus>(
    mockEscrowStatusByContractId[contractId] ?? "PENDING_DEPOSIT"
  );

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Đang tải...</div>;
  if (!contract || !currentUser) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">Không tìm thấy hợp đồng hoặc người dùng.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <NavBar activePage="Contracts" />
      <BreadcrumbBar contractId={contractId} />

      {/* Contract header */}
      <ContractHeader contract={contract} />

      {/* Tabs */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Main 2-col layout */}
      <div className="flex-1 flex gap-5 px-6 py-5 max-w-[1400px] mx-auto w-full">

        {/* ── LEFT 70% ── */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Discussion is always rendered for chat height; others are stacked below header */}
          {activeTab === "discussion" && (
            <div className="flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: "400px" }}>
              <DiscussionPanel contractId={contractId} currentUser={currentUser} />
            </div>
          )}
          {activeTab === "milestones" && <MilestonesTab contract={contract} currentUser={currentUser} onContractUpdate={setContract} />}
          {activeTab === "payments" && <PaymentsTab contractId={contract.id} />}
        </div>

        {/* ── RIGHT 30% ── */}
        <aside className="w-80 flex-shrink-0 space-y-4 sticky top-[130px] self-start">
          <OverviewCard contract={contract} />
          <EscrowStatusCard
            escrowStatus={escrowStatus}
            contractId={contractId}
            onStatusChange={setEscrowStatus}
          />
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
