"use client";

import { useState } from "react";
import { Wallet, Loader2, ExternalLink, Lock, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { EscrowStatus } from "@/types/web3";
import { useWallet } from "@/contexts/WalletContext";
import { DisputeModal } from "@/components/web3/DisputeModal";
import { contractsApi } from "@/lib/api";

// ─── Status badge config ──────────────────────────────────────────────────────

type BadgeConfig = {
  label: string;
  dot: string;
  pill: string;
  text: string;
};

const STATUS_CONFIG: Record<EscrowStatus, BadgeConfig> = {
  PENDING_DEPOSIT: {
    label: "Chờ Nạp tiền",
    dot: "bg-gray-400",
    pill: "bg-gray-100 border-gray-200",
    text: "text-gray-600",
  },
  FUNDED: {
    label: "Đã Nạp tiền",
    dot: "bg-blue-500",
    pill: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
  },
  SUBMITTED: {
    label: "Đã Nộp sản phẩm",
    dot: "bg-amber-400",
    pill: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
  },
  CLIENT_CONFIRMED: {
    label: "Client đã Xác nhận",
    dot: "bg-amber-500 animate-pulse",
    pill: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
  },
  FREELANCER_CONFIRMED: {
    label: "Freelancer đã Xác nhận",
    dot: "bg-amber-500 animate-pulse",
    pill: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
  },
  RELEASED: {
    label: "Đã Giải ngân",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
  },
  DISPUTED: {
    label: "Đang Tranh chấp",
    dot: "bg-red-500 animate-pulse",
    pill: "bg-red-50 border-red-200",
    text: "text-red-700",
  },
  RESOLVED: {
    label: "Đã Giải quyết",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
  },
};

// ─── Mock tx history ──────────────────────────────────────────────────────────

const MOCK_TX_HISTORY = [
  {
    hash: "a1b2c3d4e5f6...7a8b9c",
    label: "Deposit vào Escrow",
    time: "24 Thg 10, 2024 · 09:00",
    icon: <Lock className="w-3.5 h-3.5 text-blue-500" />,
  },
  {
    hash: "f1e2d3c4b5a6...1f2e3d",
    label: "Xác nhận Milestone 1",
    time: "30 Thg 10, 2024 · 14:22",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface EscrowStatusCardProps {
  escrowStatus: EscrowStatus;
  contractId: string;
  onStatusChange?: (status: EscrowStatus) => void;
}

export function EscrowStatusCard({
  escrowStatus: initialStatus,
  contractId,
  onStatusChange,
}: EscrowStatusCardProps) {
  const { walletState } = useWallet();
  const [status, setStatus] = useState<EscrowStatus>(initialStatus);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  const cfg = STATUS_CONFIG[status];
  const showTxHistory = status !== "PENDING_DEPOSIT";
  const showDepositCta = status === "PENDING_DEPOSIT" && walletState.connected;
  const showNotConnected = status === "PENDING_DEPOSIT" && !walletState.connected;

  const handleDeposit = async () => {
    if (!walletState.connected || !walletState.wallet || !walletState.address) {
      alert("Vui lòng kết nối ví để nạp ADA!");
      return;
    }

    setIsDepositing(true);
    try {
      // 1. Khởi tạo giao dịch
      const res = await contractsApi.buildFundTx(contractId, walletState.address);
      
      // 2. User ký giao dịch (không dùng partial sign vì chỉ 1 người ký)
      const signedTxCbor = await walletState.wallet.signTx(res.unsignedTxCbor);
      
      // 3. Gửi lên mạng lưới
      await contractsApi.submitFundTx(contractId, signedTxCbor);
      
      // 4. Chờ xác nhận (Polling)
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const c = await contractsApi.getContractById(contractId);
          if (c.status === "active") {
            clearInterval(pollInterval);
            setStatus("FUNDED");
            onStatusChange?.("FUNDED");
            setIsDepositing(false);
          }
        } catch (e) {
          console.error("Poll error", e);
        }

        if (attempts > 12) { // 12 * 5s = 60s
          clearInterval(pollInterval);
          setIsDepositing(false);
          alert("Giao dịch đang được xử lý trên mạng Cardano (có thể mất thêm thời gian). Vui lòng F5 trang lại sau.");
        }
      }, 5000);
      
      return; // prevent setting isDepositing to false immediately
    } catch (err: any) {
      console.error("Deposit failed:", err);
      alert("Lỗi nạp tiền: " + err.message);
      setIsDepositing(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* ── Card header — matches OverviewCard / PartnerCard exactly ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">Escrow Cardano</span>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.pill} ${cfg.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="px-5 py-4 space-y-4">

        {/* Contract ID reference */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Contract</span>
          <span className="text-xs font-mono font-semibold text-gray-700">#{contractId}</span>
        </div>

        {/* ── PENDING_DEPOSIT + wallet connected: Deposit CTA ── */}
        {showDepositCta && (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-800">Chờ nạp tiền</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  ADA chưa được khoá vào Escrow Validator. Nhấn bên dưới để bắt đầu.
                </p>
              </div>
            </div>

            <button
              onClick={handleDeposit}
              disabled={isDepositing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#0B3C5D" }}
            >
              {isDepositing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý giao dịch...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Deposit ADA to Escrow
                </>
              )}
            </button>

            {walletState.balanceAda > 0 && (
              <p className="text-center text-xs text-gray-400">
                Số dư ví:{" "}
                <span className="font-semibold text-gray-600">
                  {walletState.balanceAda.toLocaleString()} ADA
                </span>
              </p>
            )}
          </div>
        )}

        {/* ── PENDING_DEPOSIT + wallet NOT connected ── */}
        {showNotConnected && (
          <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl p-3">
            <Wallet className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Kết nối ví</span> của bạn để tương tác
              với Escrow và thực hiện deposit.
            </p>
          </div>
        )}

        {/* ── FUNDED or later: on-chain tx history ── */}
        {showTxHistory && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Lịch sử giao dịch
            </p>

            {MOCK_TX_HISTORY.slice(
              0,
              status === "FUNDED" ? 1 : MOCK_TX_HISTORY.length
            ).map((tx, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700">{tx.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono truncate">{tx.hash}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{tx.time}</p>
                </div>
                <a
                  href={`https://cardanoscan.io/transaction/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex-shrink-0 mt-1"
                  aria-label="View on explorer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}

            {/* DISPUTED warning */}
            {status === "DISPUTED" && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl p-3 mt-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-800">Đang có Tranh chấp</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    ADA đang bị khoá. Chờ kết quả DAO Council Vote.
                  </p>
                </div>
              </div>
            )}

            {/* Open Dispute Button */}
            {["FUNDED", "SUBMITTED", "CLIENT_CONFIRMED", "FREELANCER_CONFIRMED"].includes(status) && (
              <button
                onClick={() => {
                  setStatus("DISPUTED");
                  onStatusChange?.("DISPUTED");
                  setIsDisputeModalOpen(true);
                }}
                className="w-full mt-4 py-2 text-xs font-semibold text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
              >
                Open Dispute (Simulation)
              </button>
            )}
          </div>
        )}
      </div>

      <DisputeModal
        contractId={contractId}
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onResolve={(outcome) => {
          setStatus("RESOLVED");
          onStatusChange?.("RESOLVED");
        }}
      />
    </div>
  );
}
