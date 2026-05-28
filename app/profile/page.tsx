"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogoIcon } from "@/components/LogoIcon";
import {
  Bell,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Send,
  ExternalLink,
  Briefcase,
  Palette,
  Building2,
  Code2,
  LayoutDashboard,
  MessageSquare,
  User,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Globe,
  Award,
  TrendingUp,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAVY = "#0B3C5D";
const BLUE = "#1565C0";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS = [
  { label: "UI Design", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "UX Research", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { label: "Figma", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { label: "Design Systems", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Prototyping", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "Wireframing", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { label: "User Testing", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { label: "Accessibility", color: "bg-teal-50 text-teal-700 border-teal-200" },
];

const EXPERIENCE = [
  {
    id: 1,
    role: "Lead Designer",
    company: "TechCorp Inc.",
    period: "2021 – Present",
    desc: "Led a team of 5 designers, built the design system, shipped 12 product launches.",
    icon: <Building2 className="w-4 h-4 text-white" />,
    iconBg: NAVY,
    active: true,
  },
  {
    id: 2,
    role: "UX Designer",
    company: "Creative Agency",
    period: "2018 – 2021",
    desc: "Crafted end-to-end UX flows for 30+ client projects across fintech, edtech and retail.",
    icon: <Palette className="w-4 h-4 text-white" />,
    iconBg: "#7E57C2",
    active: false,
  },
  {
    id: 3,
    role: "Product Designer",
    company: "StartupHub",
    period: "2016 – 2018",
    desc: "Early-stage designer responsible for brand identity and MVP product design.",
    icon: <Zap className="w-4 h-4 text-white" />,
    iconBg: "#F59E0B",
    active: false,
  },
];

const PORTFOLIO = [
  {
    id: 1,
    title: "FinTech Mobile App",
    desc: "End-to-end redesign of a banking super-app with 2M+ users.",
    img: "/portfolio/fintech-app.png",
    tag: "UI/UX",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    title: "SaaS Analytics Dashboard",
    desc: "Dark-theme data visualization platform for enterprise teams.",
    img: "/portfolio/dark-dashboard.png",
    tag: "Dashboard",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    id: 3,
    title: "Agency Landing Page",
    desc: "Conversion-focused landing page with 38% uplift in sign-ups.",
    img: "/portfolio/landing-page.png",
    tag: "Web Design",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
];

const STATS = [
  { label: "Thành công", value: "100%", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
  { label: "Hợp đồng", value: "24", icon: <Briefcase className="w-4 h-4 text-blue-500" /> },
  { label: "Đánh giá", value: "4.9★", icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> },
];

type ProfileTab = "profile" | "contracts" | "settings";

// ─── Navbar ───────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
      <Link href="/" className="flex items-center gap-2 select-none">
        <LogoIcon className="w-8 h-8" style={{ color: NAVY }} />
        <span className="text-base font-bold" style={{ color: NAVY }}>
          FreelancePact
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-7">
        {[
          { href: "/contracts", label: "Contracts", icon: <Briefcase className="w-3.5 h-3.5" /> },
          { href: "#", label: "Chat", icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { href: "/profile", label: "Profile", icon: <User className="w-3.5 h-3.5" />, active: true },
          { href: "#", label: "Alerts", icon: <AlertCircle className="w-3.5 h-3.5" /> },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors pb-0.5 ${item.active
                ? "border-b-2 font-semibold"
                : "text-gray-500 hover:text-gray-800"
              }`}
            style={item.active ? { color: NAVY, borderColor: NAVY } : undefined}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>

      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <Bell className="w-4 h-4" />
        <span>Notifications</span>
      </button>
    </nav>
  );
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function ProfileSidebar() {
  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Avatar section */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6 bg-gradient-to-b from-slate-50 to-white border-b border-gray-100">
          {/* Avatar */}
          <div className="relative mb-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white"
              style={{ background: `linear-gradient(135deg,#F59E0B,${BLUE})` }}
            >
              ER
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
          </div>

          <h1 className="text-lg font-extrabold text-gray-900 text-center">Elena Rodriguez</h1>
          <p className="text-sm font-medium mt-0.5 text-center" style={{ color: BLUE }}>
            Senior UI/UX Designer
          </p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            San Francisco, CA
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-3 px-2 gap-1">
              {s.icon}
              <span className="text-sm font-bold text-gray-900">{s.value}</span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Rate & availability */}
        <div className="px-5 py-4 space-y-2 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-gray-500">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Hourly Rate</span>
            </div>
            <span className="font-bold text-gray-800">$85/hr</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Availability</span>
            </div>
            <span className="font-semibold text-emerald-600">20 hrs/week</span>
          </div>
        </div>

        {/* Bio */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed">
            Crafting intuitive and engaging digital experiences. Over{" "}
            <span className="font-semibold text-gray-700">8 years</span> of experience helping
            startups and enterprise clients translate complex problems into beautiful, usable products.
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 space-y-2.5">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white rounded-xl transition-opacity hover:opacity-90 active:scale-[0.98] shadow-md"
            style={{ backgroundColor: NAVY }}
            onClick={() => console.log("Request Contract clicked")}
          >
            <Send className="w-4 h-4" />
            Request Contract
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all hover:bg-gray-50"
            style={{ borderColor: NAVY, color: NAVY }}
            onClick={() => console.log("Message clicked")}
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </button>
        </div>

        {/* Badges */}
        <div className="px-5 pb-5 flex flex-wrap gap-1.5">
          {[
            { icon: <Award className="w-3 h-3" />, label: "Top Rated" },
            { icon: <CheckCircle2 className="w-3 h-3" />, label: "KYC Verified" },
            { icon: <Globe className="w-3 h-3" />, label: "English · Tiếng Việt" },
          ].map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-semibold"
            >
              {b.icon}
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Skills Card ──────────────────────────────────────────────────────────────

function SkillsCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${NAVY}15` }}
        >
          <Code2 className="w-4 h-4" style={{ color: NAVY }} />
        </div>
        <h2 className="text-sm font-bold text-gray-800">Kỹ năng chuyên môn</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {SKILLS.map((skill) => (
          <span
            key={skill.label}
            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${skill.color} hover:scale-105 transition-transform cursor-default`}
          >
            {skill.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Experience Timeline ──────────────────────────────────────────────────────

function ExperienceCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${NAVY}15` }}
        >
          <Briefcase className="w-4 h-4" style={{ color: NAVY }} />
        </div>
        <h2 className="text-sm font-bold text-gray-800">Kinh nghiệm làm việc</h2>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3.5 top-4 bottom-4 w-px bg-gray-200" />

        <div className="space-y-6">
          {EXPERIENCE.map((exp, i) => (
            <div key={exp.id} className="flex gap-4 items-start relative">
              {/* Timeline dot */}
              <div
                className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white"
                style={{ backgroundColor: exp.iconBg }}
              >
                {exp.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-bold ${exp.active ? "text-gray-900" : "text-gray-700"}`}>
                      {exp.role}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{exp.company}</p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${exp.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio Grid ───────────────────────────────────────────────────────────

function PortfolioCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${NAVY}15` }}
          >
            <LayoutDashboard className="w-4 h-4" style={{ color: NAVY }} />
          </div>
          <h2 className="text-sm font-bold text-gray-800">Portfolio</h2>
        </div>
        <button
          className="flex items-center gap-1 text-xs font-semibold transition-colors hover:underline"
          style={{ color: BLUE }}
        >
          View All <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Top row — 2 thumbnails */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {PORTFOLIO.slice(0, 2).map((p) => (
          <div
            key={p.id}
            className="group relative rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer aspect-[4/3] bg-gray-100"
          >
            <Image
              src={p.img}
              alt={p.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-1 ${p.tagColor}`}>
                {p.tag}
              </span>
              <p className="text-white text-xs font-semibold leading-tight">{p.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom — wide thumbnail */}
      <div
        className="group relative rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer bg-gray-100"
        style={{ height: "130px" }}
      >
        <Image
          src={PORTFOLIO[2].img}
          alt={PORTFOLIO[2].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-1 ${PORTFOLIO[2].tagColor}`}>
            {PORTFOLIO[2].tag}
          </span>
          <p className="text-white text-sm font-semibold">{PORTFOLIO[2].title}</p>
          <p className="text-white/80 text-xs mt-0.5">{PORTFOLIO[2].desc}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Tabs ─────────────────────────────────────────────────────────────

function ProfileTabs({
  active,
  onChange,
}: {
  active: ProfileTab;
  onChange: (t: ProfileTab) => void;
}) {
  const tabs: { key: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Hồ sơ", icon: <User className="w-3.5 h-3.5" /> },
    { key: "contracts", label: "Hợp đồng", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { key: "settings", label: "Cài đặt", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-5 bg-white rounded-t-xl px-4 pt-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${active === tab.key
              ? "border-blue-600 text-blue-700 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
            }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Contracts tab placeholder ────────────────────────────────────────────────

function ContractsTab() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 shadow-sm">
      <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
      <p className="text-sm">Danh sách hợp đồng của Elena sẽ hiển thị tại đây.</p>
      <Link
        href="/contracts/CTR-2024-892"
        className="inline-flex items-center gap-1 mt-3 text-sm font-semibold"
        style={{ color: BLUE }}
      >
        Xem hợp đồng mẫu <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 shadow-sm">
      <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-40" />
      <p className="text-sm">Cài đặt tài khoản và thông báo.</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F1F5F9", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <NavBar />

      <main className="flex-1 flex gap-6 px-6 py-6 max-w-[1200px] mx-auto w-full">
        {/* ── Left Sidebar ── */}
        <ProfileSidebar />

        {/* ── Right Main Panel ── */}
        <div className="flex-1 min-w-0 flex flex-col">
          <ProfileTabs active={activeTab} onChange={setActiveTab} />

          {activeTab === "profile" && (
            <div className="space-y-5">
              {/* Skills */}
              <SkillsCard />

              {/* Experience + Portfolio grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ExperienceCard />
                <PortfolioCard />
              </div>
            </div>
          )}

          {activeTab === "contracts" && <ContractsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold" style={{ color: NAVY }}>FreelancePact</p>
            <p className="text-xs text-gray-400">
              © 2024 FreelancePact. Secure Payments. Legal Contracts.
            </p>
          </div>
          <nav className="flex items-center gap-5">
            {["Terms of Service", "Privacy Policy", "Contact Support"].map((l) => (
              <Link key={l} href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                {l}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
