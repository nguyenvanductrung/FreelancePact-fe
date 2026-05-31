"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, User, Building2, ArrowRight } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";

// ─── Inline SVG Icons ───────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        d="M7.75 9.5H5.25v9h2.5v-9zM6.5 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zM18.75 18.5h-2.5v-4.25c0-1.014-.363-1.625-1.25-1.625-.875 0-1.25.611-1.25 1.625V18.5h-2.5v-9h2.5v1.2c.375-.688 1.1-1.45 2.375-1.45 1.763 0 2.625 1.163 2.625 3.438V18.5z"
        fill="#fff"
      />
    </svg>
  );
}

// ─── Register Form Component ────────────────────────────────────────────────

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultRole = searchParams.get("role");

  const [role, setRole] = useState<"freelancer" | "client">(
    defaultRole === "client" ? "client" : "freelancer"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      setError("Bạn phải đồng ý với Điều khoản và Chính sách bảo mật.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3001/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Validation errors usually come in nested errors object or single message
        const errMessage = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
        throw new Error(errMessage || "Đăng ký thất bại");
      }

      // Save tokens
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      // Redirect
      router.push("/contracts");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto">
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:px-16">
        <div className="w-full max-w-md space-y-6">
          {/* Brand mark for mobile */}
          <div className="flex items-center gap-2 md:hidden mb-4">
            <LogoIcon className="w-7 h-7" />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: "#1E3A5F" }}
            >
              FreelancePact
            </span>
          </div>

          {/* Heading */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h2>
            <p className="mt-2 text-sm text-gray-500">
              Bắt đầu hành trình làm việc chuyên nghiệp của bạn.
            </p>
          </div>

          {/* Social buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-sm font-medium gap-3 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <GoogleIcon />
              Đăng ký với Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-sm font-medium gap-3 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <LinkedInIcon />
              Đăng ký với LinkedIn
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Hoặc đăng ký bằng email
            </span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Bạn muốn tham gia với vai trò?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("freelancer")}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${role === "freelancer"
                      ? "border-[#1E3A5F] bg-[#1E3A5F]/5 text-[#1E3A5F]"
                      : "border-gray-200 hover:border-gray-300 text-gray-500"
                    }`}
                >
                  <User className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Tôi là Freelancer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${role === "client"
                      ? "border-[#1E3A5F] bg-[#1E3A5F]/5 text-[#1E3A5F]"
                      : "border-gray-200 hover:border-gray-300 text-gray-500"
                    }`}
                >
                  <Building2 className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Tôi là Khách hàng</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 border-gray-300 focus-visible:ring-[#1E3A5F]/40 focus-visible:border-[#1E3A5F]"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Địa chỉ Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-gray-300 focus-visible:ring-[#1E3A5F]/40 focus-visible:border-[#1E3A5F]"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tạo mật khẩu mạnh"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-11 border-gray-300 focus-visible:ring-[#1E3A5F]/40 focus-visible:border-[#1E3A5F]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 accent-[#1E3A5F] cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-snug">
                Tôi đồng ý với <Link href="/terms" className="text-[#1E3A5F] font-medium hover:underline">Điều khoản dịch vụ</Link> và <Link href="/privacy" className="text-[#1E3A5F] font-medium hover:underline">Chính sách bảo mật</Link> của FreelancePact.
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-sm font-semibold text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1E3A5F" }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#16304F")}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#1E3A5F")}
            >
              {isLoading ? "Đang xử lý..." : "Tạo tài khoản"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Đã có tài khoản? <Link href="/login" className="text-[#1E3A5F] font-semibold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
      <div className="relative flex flex-col justify-center items-center overflow-hidden h-[240px] md:h-auto md:w-5/12 md:min-h-screen px-8 py-8 md:px-12 md:py-12 bg-[#F4F7F9] border-r border-gray-200">
        {/* Dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
          <div className="flex items-center gap-2 text-[#1E3A5F]">
            <LogoIcon className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight select-none">
              FreelancePact
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 tracking-tight">
              Hợp tác an toàn.
              <br />
              Thanh toán bảo đảm.
            </h1>
            <p className="text-base leading-relaxed text-gray-600">
              Tham gia nền tảng đáng tin cậy nhất dành cho các freelancer chuyên nghiệp và doanh nghiệp. Hợp đồng pháp lý chặt chẽ, giao dịch minh bạch.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="flex-1 bg-white flex items-center justify-center">Đang tải...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
