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
  walletAddress?: string;
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
  budget: number; // ADA
  deadline: string; // ISO date string
  status: "pending" | "active" | "submitted" | "revision_requested" | "completed";
  progressPercent: number;
  submissionNote?: string;
  rejectionNote?: string;
  submittedAt?: string;
  completedAt?: string;
  files?: string[]; // file URLs
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
  role?: "freelancer" | "client";
  walletAddress?: string;
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
  milestoneId: string | null;
  milestoneName: string | null;
  amount: number; // ADA
  status: PaymentStatus;
  createdAt: string;
  completedAt?: string;
}

// ─── Milestone Action Payloads ────────────────────────────────────────────────

export interface SubmitMilestonePayload {
  submissionNote?: string;
  fileUrls?: string[];
}

export interface RejectMilestonePayload {
  rejectionNote: string;
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

// ─── Jobs / Recruitment ────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  description?: string;
  budget: number;           // ADA (Float)
  duration?: string;
  deadline?: string;        // ISO 8601 DateTime — tuỳ chọn
  skills: string[];
  status: 'OPEN' | 'DRAFT' | 'CLOSED';
  clientId: string;
  clientName?: string;      // populated từ BE include
  applicationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerRating?: number;
  coverLetter?: string;
  proposedBudget?: number;  // ADA (Float)
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface CreateJobPayload {
  title: string;
  description?: string;
  budget: number;
  duration?: string;
  deadline?: string;
  skills: string[];
}

export interface ApplyPayload {
  coverLetter?: string;
  proposedBudget?: number;
}

export interface JobFilters {
  search?: string;
  skills?: string;
  budgetMin?: number;
  budgetMax?: number;
}
