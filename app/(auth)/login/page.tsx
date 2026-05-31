"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";

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

import { LogoIcon } from "@/components/LogoIcon";

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMessage = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
        throw new Error(errMessage || "Đăng nhập thất bại");
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
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
      <div
        className="
          relative flex flex-col justify-between overflow-hidden
          h-[200px] md:h-auto md:w-2/5 md:min-h-screen
          px-8 py-8 md:px-12 md:py-12
        "
        style={{ backgroundColor: "#1E3A5F" }}
      >
        {/* Dot-grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff18 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-white">
          <LogoIcon className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight select-none">
            FreelancePact
          </span>
        </div>

        {/* Center headline — hidden on mobile banner */}
        <div className="relative z-10 hidden md:block mt-auto">
          <h1 className="text-4xl font-extrabold leading-tight text-white tracking-tight">
            Secure Your Work.
            <br />
            Guarantee Your Pay.
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
            FreelancePact provides legal-grade smart contracts and secure
            escrow for the modern independent professional.
          </p>
        </div>

        {/* Spacer on desktop */}
        <div className="hidden md:block" />
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Scrollable form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 md:px-16">
          <div className="w-full max-w-md space-y-6">
            {/* Brand mark (desktop only — mobile shows it in left banner) */}
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
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Log in to manage your{" "}
                <span className="text-blue-600 font-medium">contracts</span> and{" "}
                <span className="text-blue-600 font-medium">payments</span>.
              </p>
            </div>

            {/* Social buttons */}
            <div className="space-y-3">
              <Button
                id="btn-google"
                type="button"
                variant="outline"
                className="w-full h-11 text-sm font-medium gap-3 border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => console.log("Google OAuth clicked")}
              >
                <GoogleIcon />
                Continue with Google
              </Button>
              <Button
                id="btn-linkedin"
                type="button"
                variant="outline"
                className="w-full h-11 text-sm font-medium gap-3 border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => console.log("LinkedIn OAuth clicked")}
              >
                <LinkedInIcon />
                Continue with LinkedIn
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">
                or log in with email
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-300 focus-visible:ring-[#1E3A5F]/40 focus-visible:border-[#1E3A5F]"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium transition-colors"
                    style={{ color: "#1E3A5F" }}
                    tabIndex={0}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-11 border-gray-300 focus-visible:ring-[#1E3A5F]/40 focus-visible:border-[#1E3A5F]"
                    autoComplete="current-password"
                  />
                  <button
                    id="toggle-password"
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/40 rounded"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                id="btn-login"
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-sm font-semibold text-white transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "#1E3A5F",
                }}
                onMouseEnter={(e) =>
                  !isLoading && (e.currentTarget.style.backgroundColor = "#16304F")
                }
                onMouseLeave={(e) =>
                  !isLoading && (e.currentTarget.style.backgroundColor = "#1E3A5F")
                }
              >
                {isLoading ? "Đang xử lý..." : "Log In"}
              </Button>
            </form>

            {/* Sign up prompt */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register?role=freelancer"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#1E3A5F" }}
              >
                Sign up as Freelancer
              </Link>{" "}
              or{" "}
              <Link
                href="/register?role=client"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#1E3A5F" }}
              >
                Client
              </Link>
            </p>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="border-t border-gray-100 px-6 py-4 md:px-16">
          <div className="max-w-md mx-auto md:max-w-none flex flex-col md:flex-row items-center justify-between gap-3">
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "#1E3A5F" }}
              >
                FreelancePact
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                © 2024 FreelancePact. Secure Payments. Legal Contracts.
              </p>
            </div>
            <nav
              className="flex items-center gap-4"
              aria-label="Footer navigation"
            >
              <Link
                href="/terms"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/support"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Contact Support
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
