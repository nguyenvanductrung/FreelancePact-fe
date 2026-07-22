"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Briefcase, MessageSquare, User, AlertCircle, Search, Plus } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";
import { NAVY } from "@/constants";
import { WalletConnectButton } from "@/components/web3/WalletConnectButton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AuthUser } from "@/types";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface NavBarProps {
  /** Which nav link is currently active (match by label) */
  activePage?: string;
  /** Initials for the logged-in user avatar */
  userInitials?: string;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { href: "/jobs", label: "Find Work", icon: <Search className="w-3.5 h-3.5" /> },
  { href: "/contracts", label: "Contracts", icon: <Briefcase className="w-3.5 h-3.5" /> },
  { href: "/messages", label: "Chat", icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { href: "/profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
  { href: "/notifications", label: "Notifications", icon: <AlertCircle className="w-3.5 h-3.5" /> },
];

export function NavBar({ activePage, userInitials = "JD" }: NavBarProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authApi.me();
        if (res.data) setUser(res.data);
      } catch (err) {
        // Silently ignore if not logged in
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return userInitials;
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleSwitchRole = async (targetRole: "client" | "freelancer") => {
    if (isSwitching) return;
    setIsSwitching(true);
    try {
      const { profileApi } = await import("@/lib/api");
      await profileApi.switchRole(targetRole);
      window.location.href = targetRole === "client" ? "/dashboard/client" : "/dashboard";
    } catch (e) {
      console.error(e);
      toast.error("Không thể chuyển đổi vai trò lúc này");
      setIsSwitching(false);
    }
  };

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

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-4 md:gap-5">
        <Link
          href="/jobs/new"
          className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#4F6AF5] text-white text-sm font-semibold rounded-full hover:bg-[#3d55d9] transition-all shadow-sm hover:shadow active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Post a Job
        </Link>
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
            {getInitials(user?.fullName)}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-2">
            <div className="flex flex-col gap-1">
              {user?.fullName && (
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">Vai trò: {user.role}</p>
                </div>
              )}
              <Link
                href="/profile"
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Hồ sơ cá nhân
              </Link>
              
              {!user || user.role === "freelancer" ? (
                <button
                  disabled={isSwitching}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                  onClick={() => handleSwitchRole("client")}
                >
                  {isSwitching ? "Đang chuyển..." : "Chuyển sang Client"}
                </button>
              ) : null}
              
              {!user || user.role === "client" ? (
                <button
                  disabled={isSwitching}
                  className="w-full text-left px-3 py-2 text-sm text-emerald-600 font-semibold hover:bg-emerald-50 rounded-md transition-colors disabled:opacity-50"
                  onClick={() => handleSwitchRole("freelancer")}
                >
                  {isSwitching ? "Đang chuyển..." : "Chuyển sang Freelancer"}
                </button>
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
