import { ApiError } from "@/types";
import { API_BASE_URL } from "@/constants";

// ─── Fetch wrapper ────────────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      statusCode: res.status,
      message: res.statusText,
    }));
    throw error;
  }

  return res.json();
}

// ─── Token helpers ────────────────────────────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

import type {
  LoginPayload,
  AuthTokens,
  AuthUser,
  CreateContractPayload,
  ContractDetail,
  ContractSummary,
  ChatMessage,
  SendMessagePayload,
  UserProfile,
  Payment,
  PaginatedResponse,
  ApiResponse,
  Job,
  Application,
  CreateJobPayload,
  ApplyPayload,
  JobFilters,
  SubmitMilestonePayload,
  RejectMilestonePayload,
} from "@/types";

export const authApi = {
  /**
   * POST /auth/login
   * Body: LoginPayload → Response: AuthTokens
   */
  login: (payload: LoginPayload) =>
    request<ApiResponse<AuthTokens>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * POST /auth/logout
   * Header: Bearer token
   */
  logout: () =>
    request<void>("/auth/logout", {
      method: "POST",
      headers: authHeaders(),
    }),

  /**
   * GET /auth/me
   * Header: Bearer token → Response: AuthUser
   */
  me: () =>
    request<ApiResponse<AuthUser>>("/auth/me", {
      headers: authHeaders(),
    }),

  /**
   * POST /auth/refresh
   * Body: { refreshToken } → Response: AuthTokens
   */
  refresh: (refreshToken: string) =>
    request<ApiResponse<AuthTokens>>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  /**
   * POST /auth/google
   * Body: { accessToken } → Response: AuthTokens
   */
  googleLogin: (accessToken: string) =>
    request<ApiResponse<AuthTokens>>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ accessToken }),
    }),

  /**
   * POST /auth/auth0
   * Body: { code } → Response: AuthTokens
   */
  auth0Login: (code: string) =>
    request<ApiResponse<AuthTokens>>("/auth/auth0", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
};

// ─── Contracts API ────────────────────────────────────────────────────────────

export const contractsApi = {
  /**
   * GET /contracts
   * Header: Bearer token
  /**
   * GET /contracts
   * Header: Bearer token
   * Response: ContractDetail[]
   */
  list: () =>
    request<ApiResponse<ContractDetail[]>>("/contracts", {
      headers: authHeaders(),
    }),

  /**
   * GET /contracts/:id
   * Header: Bearer token → Response: ContractDetail
   */
  get: (id: string) =>
    request<ApiResponse<ContractDetail>>(`/contracts/${id}`, {
      headers: authHeaders(),
    }),

  /**
   * POST /contracts
   * Header: Bearer token
   * Body: CreateContractPayload
   * Response: ContractDetail
   */
  create: (payload: CreateContractPayload) =>
    request<ApiResponse<ContractDetail>>("/contracts", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),

  /**
   * POST /contracts/:id/fund  (Mock Deposit ADA)
   * Header: Bearer token
   * Response: ContractDetail (updated, status → ACTIVE)
   */
  fund: (id: string) =>
    request<ApiResponse<ContractDetail>>(`/contracts/${id}/fund`, {
      method: "POST",
      headers: authHeaders(),
    }),

  /**
   * POST /contracts/:id/sign  (kept for backward compat)
   * Header: Bearer token
   */
  sign: (id: string) =>
    request<ApiResponse<ContractDetail>>(`/contracts/${id}/sign`, {
      method: "POST",
      headers: authHeaders(),
    }),
};

// ─── Chat API ─────────────────────────────────────────────────────────────────

export const chatApi = {
  /**
   * GET /contracts/:contractId/messages?page=&pageSize=
   * Header: Bearer token
   * Response: PaginatedResponse<ChatMessage>
   */
  getMessages: (contractId: string, page = 1, pageSize = 50) =>
    request<PaginatedResponse<ChatMessage>>(
      `/contracts/${contractId}/messages?page=${page}&pageSize=${pageSize}`,
      { headers: authHeaders() }
    ),

  /**
   * POST /contracts/:contractId/messages
   * Header: Bearer token
   * Body: SendMessagePayload (without contractId)
   * Response: ApiResponse<ChatMessage>
   */
  sendMessage: (payload: SendMessagePayload) =>
    request<ApiResponse<ChatMessage>>(
      `/contracts/${payload.contractId}/messages`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      }
    ),
};

// ─── Profile API ──────────────────────────────────────────────────────────────

export const profileApi = {
  /**
   * GET /users/:userId/profile
   * Header: Bearer token
   * Response: ApiResponse<UserProfile>
   */
  get: (userId: string) =>
    request<ApiResponse<UserProfile>>(`/users/${userId}/profile`, {
      headers: authHeaders(),
    }),

  /**
   * PATCH /users/me/role
   * Switch user role
   */
  switchRole: (role: "freelancer" | "client") =>
    request<ApiResponse<UserProfile>>("/users/me/role", {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ role }),
    }),

  /**
   * PATCH /users/me/profile
   * Header: Bearer token
   * Body: Partial<UserProfile>
   * Response: ApiResponse<UserProfile>
   */
  update: (payload: Partial<UserProfile>) =>
    request<ApiResponse<UserProfile>>("/users/me/profile", {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),
};

// ─── Payments API ─────────────────────────────────────────────────────────────

export const paymentsApi = {
  /**
   * GET /contracts/:contractId/payments
   * Header: Bearer token
   * Response: Payment[]
   */
  list: (contractId: string) =>
    request<Payment[]>(`/contracts/${contractId}/payments`, {
      headers: authHeaders(),
    }),
};

// ─── Milestones API ────────────────────────────────────────────────────────────

export const milestonesApi = {
  /**
   * PATCH /milestones/:id/submit
   * Freelancer nộp sản phẩm cho milestone
   */
  submit: (milestoneId: string, payload: SubmitMilestonePayload) =>
    request<ContractDetail>(`/milestones/${milestoneId}/submit`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),

  /**
   * PATCH /milestones/:id/approve
   * Client nghiệm thu + giải ngân ADA cho milestone
   */
  approve: (milestoneId: string) =>
    request<ContractDetail>(`/milestones/${milestoneId}/approve`, {
      method: "PATCH",
      headers: authHeaders(),
    }),

  /**
   * PATCH /milestones/:id/reject
   * Client từ chối, yêu cầu sửa
   */
  reject: (milestoneId: string, payload: RejectMilestonePayload) =>
    request<ContractDetail>(`/milestones/${milestoneId}/reject`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),
};

// ─── Jobs API ─────────────────────────────────────────────────────────────────

export const jobsApi = {
  create: (data: CreateJobPayload) =>
    request<ApiResponse<Job>>("/jobs", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  getAll: (params?: JobFilters) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.skills) query.append("skills", params.skills);
    if (params?.budgetMin !== undefined) query.append("budgetMin", params.budgetMin.toString());
    if (params?.budgetMax !== undefined) query.append("budgetMax", params.budgetMax.toString());

    const queryString = query.toString();
    return request<ApiResponse<Job[]>>(`/jobs${queryString ? `?${queryString}` : ""}`);
  },

  getMyJobs: () =>
    request<ApiResponse<Job[]>>("/jobs/my-jobs", {
      headers: authHeaders(),
    }),

  getById: (id: string) => request<ApiResponse<Job>>(`/jobs/${id}`),

  apply: (jobId: string, data: ApplyPayload) =>
    request<ApiResponse<Application>>(`/jobs/${jobId}/apply`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  getApplications: (jobId: string) =>
    request<ApiResponse<Application[]>>(`/jobs/${jobId}/applications`, {
      headers: authHeaders(),
    }),

  selectFreelancer: (jobId: string, applicationId: string) =>
    request<ApiResponse<{ contractId: string }>>(`/jobs/${jobId}/applications/${applicationId}/select`, {
      method: "POST",
      headers: authHeaders(),
    }),
};
