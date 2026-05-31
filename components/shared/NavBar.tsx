"use client";

import Link from "next/link";
import { Bell, Briefcase, MessageSquare, User, AlertCircle } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";
import { NAVY } from "@/constants";

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
  { href: "/contracts", label: "Contracts", icon: <Briefcase className="w-3.5 h-3.5" /> },
  { href: "/chat", label: "Chat", icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { href: "/profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
  { href: "#", label: "Alerts", icon: <AlertCircle className="w-3.5 h-3.5" /> },
];

export function NavBar({ activePage, userInitials = "JD" }: NavBarProps) {
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
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors pb-0.5 ${
                isActive
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
      <div className="flex items-center gap-4">
        <button
          className="relative p-1.5 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
          style={{ background: "linear-gradient(135deg, #7E57C2, #512DA8)" }}
          aria-label="Profile menu"
        >
          {userInitials}
        </div>
      </div>
    </nav>
  );
}
