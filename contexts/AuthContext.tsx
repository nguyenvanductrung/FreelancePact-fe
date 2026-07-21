"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/types";
import { authApi } from "@/lib/api";
import { useWallet } from "@/contexts/WalletContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  /** Thông tin user hiện tại. `null` nếu chưa đăng nhập. */
  user: AuthUser | null;
  /** `true` trong khi đang fetch thông tin user từ /auth/me */
  isLoadingUser: boolean;
  /** Cập nhật user sau khi login thành công */
  setUser: (user: AuthUser | null) => void;
  /** Đăng xuất: gọi API + xóa token + reset wallet + redirect /login */
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { disconnectWallet } = useWallet();
  const router = useRouter();

  // ── Khôi phục session khi refresh trang ────────────────────────────────────
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      setIsLoadingUser(false);
      return;
    }

    authApi
      .me()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // Token không hợp lệ hoặc hết hạn → xóa sạch
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      .finally(() => {
        setIsLoadingUser(false);
      });
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Bỏ qua lỗi API (token có thể đã hết hạn)
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      disconnectWallet();
      setUser(null);
      router.push("/login");
    }
  }, [disconnectWallet, router]);

  return (
    <AuthContext.Provider value={{ user, isLoadingUser, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
