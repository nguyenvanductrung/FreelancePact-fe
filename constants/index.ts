// ─── Brand Colors ─────────────────────────────────────────────────────────────

export const NAVY = "#0B3C5D";
export const BLUE = "#1565C0";
export const NAVY_DARK = "#1E3A5F";

// ─── Payment Term Options ─────────────────────────────────────────────────────

export const PAYMENT_TERM_OPTIONS = [
  {
    value: "escrow-milestone" as const,
    label: "Escrow theo Milestone",
    desc: "Thanh toán được giữ trong ví escrow và giải phóng khi mỗi milestone hoàn thành.",
  },
  {
    value: "escrow-full" as const,
    label: "Escrow toàn bộ",
    desc: "Toàn bộ ngân sách được escrow ngay khi ký hợp đồng, giải phóng khi nghiệm thu cuối.",
  },
  {
    value: "net-15" as const,
    label: "Net-15",
    desc: "Thanh toán trong vòng 15 ngày kể từ ngày xuất hóa đơn.",
  },
  {
    value: "net-30" as const,
    label: "Net-30",
    desc: "Thanh toán trong vòng 30 ngày kể từ ngày xuất hóa đơn.",
  },
] as const;

// ─── Nav Links ────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { href: "/contracts", label: "Contracts" },
  { href: "/profile", label: "Profile" },
  { href: "/chat", label: "Chat" },
] as const;

// ─── Footer Links ─────────────────────────────────────────────────────────────

export const FOOTER_LINKS = ["Terms of Service", "Privacy Policy", "Contact Support"] as const;

// ─── API Base URL ─────────────────────────────────────────────────────────────

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
