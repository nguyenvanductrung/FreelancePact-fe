"use client";

import Link from "next/link";
import { Bell, Briefcase, MessageSquare, User, AlertCircle, Search, Plus } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";
import { NAVY } from "@/constants";
import { WalletConnectButton } from "@/components/web3/WalletConnectButton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface NavBarProps {
  /** Which nav link is currently active (match by label) */
  activePage?: string;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { href: "/jobs", label: "Find Work", icon: <Search className="w-3.5 h-3.5" /> },
  { href: "/contracts", label: "Contracts", icon: <Briefcase className="w-3.5 h-3.5" /> },
  { href: "/chat", label: "Chat", icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { href: "/profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
  { href: "#", label: "Alerts", icon: <AlertCircle className="w-3.5 h-3.5" /> },
];

export function NavBar({ activePage }: NavBarProps) {
  const { user, logout } = useAuth();

  // Lấy initials từ fullName, fallback "?" nếu chưa đăng nhập
  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const isClient = user?.role === "client";

  return (
    <nav
      className="sticky top-0 z-30 flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 select-none">
        <LogoIcon className="w-8 h-8" style={{ color: NAVY }} />
        <span className="text-base font-bold" style={{ color: NAVY }}>
          FreelancePact
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-7">
        {DEFAULT_NAV_LINKS.map((item) => {
          const isActive = item.label === activePage;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors pb-0.5 ${isActive
                  ? "border-b-2 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
                }`}
              style={isActive ? { color: NAVY, borderColor: NAVY } : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 md:gap-5">
        {/* "Post a Job" — chỉ hiển thị cho client */}
        {isClient && (
          <Link
            href="/jobs/new"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#4F6AF5] text-white text-sm font-semibold rounded-full hover:bg-[#3d55d9] transition-all shadow-sm hover:shadow active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Post a Job
          </Link>
        )}
        <WalletConnectButton />
        <button
          className="relative p-1.5 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <Popover>
          <PopoverTrigger
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            style={{ background: "linear-gradient(135deg, #7E57C2, #512DA8)" }}
            aria-label="Profile menu"
          >
            {userInitials}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-2">
            <div className="flex flex-col gap-1">
              {/* User info */}
              {user && (
                <>
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
                      {user.role}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 my-0.5" />
                </>
              )}

              <Link
                href="/profile"
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Hồ sơ cá nhân
              </Link>
              <div className="border-t border-gray-100 my-0.5" />
              <button
                className="w-full text-left px-3 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                onClick={logout}
              >
                <LogOut className="w-3.5 h-3.5" />
                Đăng xuất
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
