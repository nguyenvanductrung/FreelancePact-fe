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
};

// ─── Contracts API ────────────────────────────────────────────────────────────

export const contractsApi = {
  /**
   * GET /contracts?page=&pageSize=
   * Header: Bearer token
   * Response: PaginatedResponse<ContractSummary>
   */
  list: (page = 1, pageSize = 10) =>
    request<PaginatedResponse<ContractSummary>>(
      `/contracts?page=${page}&pageSize=${pageSize}`,
      { headers: authHeaders() }
    ),

  /**
   * GET /contracts/:id
   * Header: Bearer token
   * Response: ApiResponse<ContractDetail>
   */
  get: (id: string) =>
    request<ApiResponse<ContractDetail>>(`/contracts/${id}`, {
      headers: authHeaders(),
    }),

  /**
   * POST /contracts
   * Header: Bearer token
   * Body: CreateContractPayload
   * Response: ApiResponse<ContractDetail>
   */
  create: (payload: CreateContractPayload) =>
    request<ApiResponse<ContractDetail>>("/contracts", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),

  /**
   * POST /contracts/:id/sign
   * Header: Bearer token
   * Response: ApiResponse<ContractDetail>
   */
  sign: (id: string) =>
    request<ApiResponse<ContractDetail>>(`/contracts/${id}/sign`, {
      method: "POST",
      headers: authHeaders(),
    }),

  /**
   * PATCH /contracts/:id/milestones/:milestoneId/complete
   * Header: Bearer token
   * Response: ApiResponse<ContractDetail>
   */
  completeMilestone: (contractId: string, milestoneId: string) =>
    request<ApiResponse<ContractDetail>>(
      `/contracts/${contractId}/milestones/${milestoneId}/complete`,
      { method: "PATCH", headers: authHeaders() }
    ),
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
   * Response: ApiResponse<Payment[]>
   */
  list: (contractId: string) =>
    request<ApiResponse<Payment[]>>(`/contracts/${contractId}/payments`, {
      headers: authHeaders(),
    }),

  /**
   * POST /contracts/:contractId/payments/release
   * Header: Bearer token
   * Body: { milestoneId: string }
   * Response: ApiResponse<Payment>
   */
  release: (contractId: string, milestoneId: string) =>
    request<ApiResponse<Payment>>(`/contracts/${contractId}/payments/release`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ milestoneId }),
    }),
};
