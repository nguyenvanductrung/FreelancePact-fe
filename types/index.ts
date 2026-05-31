// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "freelancer" | "client";
  isKycVerified: boolean;
}

// ─── Contract ─────────────────────────────────────────────────────────────────

export type ContractStatus =
  | "draft"
  | "pending_signature"
  | "active"
  | "completed"
  | "cancelled"
  | "disputed";

export type PaymentTerm =
  | "escrow-milestone"
  | "escrow-full"
  | "net-15"
  | "net-30";

export interface Milestone {
  id: string;
  name: string;
  budget: number; // VND
  deadline: string; // ISO date string
  status: "pending" | "active" | "completed";
  progressPercent: number;
}

export interface ContractSummary {
  id: string;
  title: string;
  partnerName: string;
  status: ContractStatus;
  totalValue: number; // VND
  startDate: string;
  endDate: string;
  progressPercent: number;
}

export interface ContractDetail extends ContractSummary {
  description: string;
  paymentTerm: PaymentTerm;
  specialTerms?: string;
  milestones: Milestone[];
  escrowedAmount: number; // VND
  freelancerId: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractPayload {
  title: string;
  partnerName: string;
  description: string;
  paymentTerm: PaymentTerm;
  specialTerms?: string;
  milestones: Omit<Milestone, "id" | "status" | "progressPercent">[];
}

// ─── Chat / Discussion ────────────────────────────────────────────────────────

export type MessageType = "text" | "file" | "system";

export interface ChatMessage {
  id: string;
  contractId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  text?: string;
  file?: {
    name: string;
    sizeBytes: number;
    url: string;
    milestoneNote?: string;
  };
  createdAt: string; // ISO datetime
}

export interface SendMessagePayload {
  contractId: string;
  type: MessageType;
  text?: string;
  fileUrl?: string;
}

// ─── Profile / User ───────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  fullName: string;
  title: string;
  location: string;
  bio: string;
  hourlyRate?: number; // USD
  availabilityHoursPerWeek?: number;
  skills: string[];
  successRate: number; // 0–100
  totalContracts: number;
  rating: number; // 0–5
  badges: ProfileBadge[];
  portfolioItems: PortfolioItem[];
  experience: ExperienceItem[];
  isKycVerified: boolean;
  isOnline: boolean;
}

export interface ProfileBadge {
  id: string;
  label: string;
  icon: string; // icon name key
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tag: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  startYear: number;
  endYear?: number; // undefined = present
  description: string;
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "processing" | "completed" | "failed";

export interface Payment {
  id: string;
  contractId: string;
  milestoneId: string;
  amount: number; // VND
  status: PaymentStatus;
  createdAt: string;
  completedAt?: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}
