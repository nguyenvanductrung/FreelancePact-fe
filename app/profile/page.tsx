"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  Send,
  Briefcase,
  Palette,
  Building2,
  Code2,
  LayoutDashboard,
  MessageSquare,
  User,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Globe,
  Award,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { NavBar } from "@/components/shared/NavBar";
import { Footer } from "@/components/shared/Footer";
import { ReputationNFTGallery } from "@/components/profile/ReputationNFTGallery";
import { mockReputationNFTs } from "@/lib/mock-web3";
import { NAVY, BLUE } from "@/constants";
import { authApi, profileApi } from "@/lib/api";
import type { UserProfile } from "@/types";
import { toast } from "sonner";

// ─── Static mock data ──────────────

const FALLBACK_MOCK_PROFILE: UserProfile = {
  id: "mock-123",
  fullName: "Elena Rodriguez",
  title: "Senior UI/UX Designer",
  location: "San Francisco, CA",
  bio: "Crafting intuitive and engaging digital experiences. Over 8 years of experience helping startups and enterprise clients translate complex problems into beautiful, usable products.",
  hourlyRate: 85,
  availabilityHoursPerWeek: 20,
  skills: ["UI Design", "UX Research", "Figma", "Design Systems", "Prototyping", "Wireframing", "User Testing", "Accessibility"],
  successRate: 100,
  totalContracts: 24,
  rating: 4.9,
  badges: [
    { id: "1", label: "Top Rated", icon: "award" },
    { id: "2", label: "KYC Verified", icon: "check" },
    { id: "3", label: "English · Tiếng Việt", icon: "globe" }
  ],
  portfolioItems: [
    {
      id: "1",
      title: "FinTech Mobile App",
      description: "End-to-end redesign of a banking super-app with 2M+ users.",
      imageUrl: "/portfolio/fintech-app.png",
      tag: "UI/UX",
    },
    {
      id: "2",
      title: "SaaS Analytics Dashboard",
      description: "Dark-theme data visualization platform for enterprise teams.",
      imageUrl: "/portfolio/dark-dashboard.png",
      tag: "Dashboard",
    },
    {
      id: "3",
      title: "Agency Landing Page",
      description: "Conversion-focused landing page with 38% uplift in sign-ups.",
      imageUrl: "/portfolio/landing-page.png",
      tag: "Web Design",
    },
  ],
  experience: [
    {
      id: "1",
      role: "Lead Designer",
      company: "TechCorp Inc.",
      startYear: 2021,
      description: "Led a team of 5 designers, built the design system, shipped 12 product launches.",
    },
    {
      id: "2",
      role: "UX Designer",
      company: "Creative Agency",
      startYear: 2018,
      endYear: 2021,
      description: "Crafted end-to-end UX flows for 30+ client projects across fintech, edtech and retail.",
    },
    {
      id: "3",
      role: "Product Designer",
      company: "StartupHub",
      startYear: 2016,
      endYear: 2018,
      description: "Early-stage designer responsible for brand identity and MVP product design.",
    },
  ],
  isKycVerified: true,
  isOnline: true
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Tab type ─────────────────────────────────────────────────────────────────

type ProfileTab = "profile" | "contracts" | "settings";

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function ProfileSidebar({ profile }: { profile: UserProfile }) {
  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Avatar section */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6 bg-gradient-to-b from-slate-50 to-white border-b border-gray-100">
          <div className="relative mb-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white"
              style={{ background: `linear-gradient(135deg,#F59E0B,${BLUE})` }}
            >
              {getInitials(profile.fullName)}
            </div>
            {profile.isOnline && <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />}
          </div>
          <h1 className="text-lg font-extrabold text-gray-900 text-center">{profile.fullName}</h1>
          <p className="text-sm font-medium mt-0.5 text-center" style={{ color: BLUE }}>
            {profile.title || "Freelancer"}
          </p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
            <MapPin className="w-3 h-3" /> {profile.location || "N/A"}
          </div>
          {profile.walletAddress && (
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
               <span className="text-gray-400 font-bold">ADA</span> {profile.walletAddress.slice(0, 10)}...{profile.walletAddress.slice(-8)}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          <div className="flex flex-col items-center py-3 px-2 gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-gray-900">{profile.successRate}%</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Thành công</span>
          </div>
          <div className="flex flex-col items-center py-3 px-2 gap-1">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-gray-900">{profile.totalContracts}</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Hợp đồng</span>
          </div>
          <div className="flex flex-col items-center py-3 px-2 gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-gray-900">{profile.rating}★</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Đánh giá</span>
          </div>
        </div>

        {/* Rate & availability */}
        <div className="px-5 py-4 space-y-2 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-gray-500">
              <DollarSign className="w-3.5 h-3.5" /> <span>Hourly Rate</span>
            </div>
            <span className="font-bold text-gray-800">${profile.hourlyRate || 0}/hr</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Clock className="w-3.5 h-3.5" /> <span>Availability</span>
            </div>
            <span className="font-semibold text-emerald-600">{profile.availabilityHoursPerWeek || 0} hrs/week</span>
          </div>
        </div>

        {/* Bio */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
            {profile.bio}
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 space-y-2.5">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white rounded-xl transition-opacity hover:opacity-90 active:scale-[0.98] shadow-md"
            style={{ backgroundColor: NAVY }}
            onClick={() => console.log("Request Contract clicked")}
          >
            <Send className="w-4 h-4" /> Request Contract
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all hover:bg-gray-50"
            style={{ borderColor: NAVY, color: NAVY }}
            onClick={() => console.log("Message clicked")}
          >
            <MessageSquare className="w-4 h-4" /> Message
          </button>
        </div>

        {/* Badges */}
        <div className="px-5 pb-5 flex flex-wrap gap-1.5">
          {profile.badges?.map((b) => (
            <span
              key={b.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-semibold"
            >
              <Award className="w-3 h-3" /> {b.label}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Tab cards ────────────────────────────────────────────────────────────────

function SkillsCard({ skills }: { skills: string[] }) {
  const defaultColors = [
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-violet-50 text-violet-700 border-violet-200",
    "bg-pink-50 text-pink-700 border-pink-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-emerald-50 text-emerald-700 border-emerald-200"
  ];
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${NAVY}15` }}>
          <Code2 className="w-4 h-4" style={{ color: NAVY }} />
        </div>
        <h2 className="text-sm font-bold text-gray-800">Kỹ năng chuyên môn</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills?.map((skill, index) => (
          <span
            key={skill}
            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${defaultColors[index % defaultColors.length]} hover:scale-105 transition-transform cursor-default`}
          >
            {skill}
          </span>
        ))}
        {(!skills || skills.length === 0) && <p className="text-sm text-gray-400">Chưa có kỹ năng nào</p>}
      </div>
    </div>
  );
}

function ExperienceCard({ experience }: { experience: any[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${NAVY}15` }}>
          <Briefcase className="w-4 h-4" style={{ color: NAVY }} />
        </div>
        <h2 className="text-sm font-bold text-gray-800">Kinh nghiệm làm việc</h2>
      </div>
      <div className="relative">
        <div className="absolute left-3.5 top-4 bottom-4 w-px bg-gray-200" />
        <div className="space-y-6">
          {experience?.map((exp, i) => (
            <div key={exp.id || i} className="flex gap-4 items-start relative">
              <div
                className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white"
                style={{ backgroundColor: !exp.endYear ? NAVY : "#7E57C2" }}
              >
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-bold ${!exp.endYear ? "text-gray-900" : "text-gray-700"}`}>{exp.role}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{exp.company}</p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                      !exp.endYear ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {exp.startYear} – {exp.endYear ? exp.endYear : "Present"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
          {(!experience || experience.length === 0) && <p className="text-sm text-gray-400 pl-10">Chưa có kinh nghiệm</p>}
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ items }: { items: any[] }) {
  const fallbackImg = "/portfolio/landing-page.png";
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${NAVY}15` }}>
            <LayoutDashboard className="w-4 h-4" style={{ color: NAVY }} />
          </div>
          <h2 className="text-sm font-bold text-gray-800">Portfolio</h2>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold transition-colors hover:underline" style={{ color: BLUE }}>
          View All <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
      {(!items || items.length === 0) ? (
        <p className="text-sm text-gray-400">Chưa có dự án portfolio</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {items.slice(0, 2).map((p, i) => (
              <div
                key={p.id || i}
                className="group relative rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer aspect-[4/3] bg-gray-100"
              >
                <Image src={p.imageUrl || fallbackImg} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-1 bg-blue-100 text-blue-700`}>{p.tag || "Dự án"}</span>
                  <p className="text-white text-xs font-semibold leading-tight">{p.title}</p>
                </div>
              </div>
            ))}
          </div>
          {items.length > 2 && (
            <div className="group relative rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer bg-gray-100" style={{ height: "130px" }}>
              <Image src={items[2].imageUrl || fallbackImg} alt={items[2].title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-1 bg-emerald-100 text-emerald-700`}>{items[2].tag || "Dự án"}</span>
                <p className="text-white text-sm font-semibold">{items[2].title}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProfileTabs({ active, onChange }: { active: ProfileTab; onChange: (t: ProfileTab) => void }) {
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
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
            active === tab.key
              ? "border-blue-600 text-blue-700 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
}

function ContractsTab() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 shadow-sm">
      <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
      <p className="text-sm">Danh sách hợp đồng sẽ hiển thị tại đây.</p>
      <Link href="/contracts/CTR-2024-892" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold" style={{ color: BLUE }}>
        Xem hợp đồng mẫu <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function SettingsTab({ 
  profile, 
  onUpdate 
}: { 
  profile: UserProfile; 
  onUpdate: (data: Partial<UserProfile>) => Promise<void> 
}) {
  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    title: profile.title || "",
    location: profile.location || "",
    bio: profile.bio || "",
    hourlyRate: profile.hourlyRate || 0,
    availabilityHoursPerWeek: profile.availabilityHoursPerWeek || 0,
    skills: profile.skills ? profile.skills.join(", ") : "",
    walletAddress: profile.walletAddress || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      fullName: profile.fullName || "",
      title: profile.title || "",
      location: profile.location || "",
      bio: profile.bio || "",
      hourlyRate: profile.hourlyRate || 0,
      availabilityHoursPerWeek: profile.availabilityHoursPerWeek || 0,
      skills: profile.skills ? profile.skills.join(", ") : "",
      walletAddress: profile.walletAddress || ""
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload: Partial<UserProfile> = {
      fullName: formData.fullName,
      title: formData.title,
      location: formData.location,
      bio: formData.bio,
      hourlyRate: Number(formData.hourlyRate),
      availabilityHoursPerWeek: Number(formData.availabilityHoursPerWeek),
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      walletAddress: formData.walletAddress
    };
    try {
      await onUpdate(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-3">Chỉnh sửa hồ sơ cá nhân</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Họ và tên</label>
          <input 
            type="text" 
            value={formData.fullName} 
            onChange={e => setFormData({...formData, fullName: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 text-sm" 
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Tiêu đề nghề nghiệp</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 text-sm" 
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 block mb-1">Mô tả bản thân (Bio)</label>
        <textarea 
          value={formData.bio} 
          onChange={e => setFormData({...formData, bio: e.target.value})}
          className="w-full border rounded-lg px-3 py-2 text-sm h-24"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Địa điểm</label>
          <input 
            type="text" 
            value={formData.location} 
            onChange={e => setFormData({...formData, location: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 text-sm" 
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Mức lương mỗi giờ ($)</label>
          <input 
            type="number" 
            value={formData.hourlyRate} 
            onChange={e => setFormData({...formData, hourlyRate: Number(e.target.value)})}
            className="w-full border rounded-lg px-3 py-2 text-sm" 
            min={0}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Số giờ rảnh mỗi tuần</label>
          <input 
            type="number" 
            value={formData.availabilityHoursPerWeek} 
            onChange={e => setFormData({...formData, availabilityHoursPerWeek: Number(e.target.value)})}
            className="w-full border rounded-lg px-3 py-2 text-sm" 
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 block mb-1">Kỹ năng (phân cách bằng dấu phẩy)</label>
        <input 
          type="text" 
          value={formData.skills} 
          onChange={e => setFormData({...formData, skills: e.target.value})}
          className="w-full border rounded-lg px-3 py-2 text-sm" 
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 block mb-1">Địa chỉ ví Cardano (Tùy chọn)</label>
        <input 
          type="text" 
          value={formData.walletAddress} 
          onChange={e => setFormData({...formData, walletAddress: e.target.value})}
          className="w-full border rounded-lg px-3 py-2 text-sm" 
          placeholder="addr1..."
        />
      </div>

      <button disabled={isSubmitting} type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-50">
        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [isMock, setIsMock] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const meRes = await authApi.me();
      if (!meRes.data || !meRes.data.id) {
        throw new Error("Not logged in");
      }
      const userId = meRes.data.id;
      
      const profileRes = await profileApi.get(userId);
      if (profileRes.data) {
        setProfile(profileRes.data);
        setIsMock(false);
      } else {
        setProfile(FALLBACK_MOCK_PROFILE);
        setIsMock(true);
      }
    } catch (err: any) {
      console.error("Failed to load profile", err);
      // Hỗ trợ chế độ Mock fallback để chạy thử nếu không có backend
      setProfile(FALLBACK_MOCK_PROFILE);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (payload: Partial<UserProfile>) => {
    try {
      await profileApi.update(payload);
      toast.success("Cập nhật hồ sơ thành công!");
      await loadProfile(); // Reload
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi cập nhật hồ sơ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F1F5F9", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <NavBar activePage="Profile" />

      <main className="flex-1 flex flex-col gap-6 px-6 py-6 max-w-[1200px] mx-auto w-full">
        {isMock && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>
                <strong>Chế độ Mock Data:</strong> Bạn chưa đăng nhập hoặc không kết nối được tới server. 
                Các thay đổi sẽ không được lưu vào cơ sở dữ liệu. Vui lòng <Link href="/login" className="underline font-semibold">Đăng nhập</Link>.
              </span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <ProfileSidebar profile={profile} />

          <div className="flex-1 min-w-0 flex flex-col">
            <ProfileTabs active={activeTab} onChange={setActiveTab} />

            {activeTab === "profile" && (
              <div className="space-y-5">
                <SkillsCard skills={profile.skills} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <ExperienceCard experience={profile.experience} />
                  <PortfolioCard items={profile.portfolioItems} />
                </div>
                {/* TODO: filter by current freelancer ID once auth wiring is connected */}
                <ReputationNFTGallery nfts={mockReputationNFTs} />
              </div>
            )}
            {activeTab === "contracts" && <ContractsTab />}
            {activeTab === "settings" && <SettingsTab profile={profile} onUpdate={handleUpdateProfile} />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
