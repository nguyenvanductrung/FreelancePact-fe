"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { NavBar } from "@/components/shared/NavBar";
import { Search, SlidersHorizontal, Calendar, Banknote, FileText } from "lucide-react";
import { ContractSummary } from "@/types";

// ─── Extended mock type for marketplace listing ──────────────────────────────

interface MarketplaceListing extends ContractSummary {
  description: string;
  category: string;
  skills: string[];
  deadline: string;
  clientAvatar?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

// TODO: replace with real API calls — GET /contracts with query params
const MOCK_LISTINGS: MarketplaceListing[] = [
  {
    id: "CTR-2024-901",
    title: "E-Commerce Website Redesign",
    partnerName: "Acme Corp",
    status: "active",
    totalValue: 45000000,
    startDate: "2024-07-01T00:00:00Z",
    endDate: "2024-09-30T00:00:00Z",
    progressPercent: 0,
    description:
      "Looking for an experienced UI/UX designer to revamp our e-commerce platform. The site serves 50k+ monthly users and needs a modern refresh.",
    category: "Design",
    skills: ["Figma", "UI/UX", "Prototyping"],
    deadline: "2024-07-20T00:00:00Z",
    clientAvatar: "AC",
  },
  {
    id: "CTR-2024-902",
    title: "React Native Mobile App",
    partnerName: "Startup Inc",
    status: "active",
    totalValue: 120000000,
    startDate: "2024-08-01T00:00:00Z",
    endDate: "2024-11-30T00:00:00Z",
    progressPercent: 0,
    description:
      "Build a cross-platform mobile app with React Native for our logistics startup. Features include real-time tracking, push notifications, and offline support.",
    category: "Dev",
    skills: ["React Native", "TypeScript", "Node.js"],
    deadline: "2024-08-10T00:00:00Z",
    clientAvatar: "SI",
  },
  {
    id: "CTR-2024-903",
    title: "SEO & Content Marketing Campaign",
    partnerName: "Ngoc Foods",
    status: "active",
    totalValue: 25000000,
    startDate: "2024-07-15T00:00:00Z",
    endDate: "2024-10-15T00:00:00Z",
    progressPercent: 0,
    description:
      "Develop and execute a 3-month SEO strategy and content calendar for our food brand. Target audience: health-conscious millennials in Vietnam.",
    category: "Marketing",
    skills: ["SEO", "Content Writing", "Analytics"],
    deadline: "2024-07-18T00:00:00Z",
    clientAvatar: "NF",
  },
  {
    id: "CTR-2024-904",
    title: "Technical Documentation Writing",
    partnerName: "DevTools VN",
    status: "active",
    totalValue: 18000000,
    startDate: "2024-07-10T00:00:00Z",
    endDate: "2024-08-10T00:00:00Z",
    progressPercent: 0,
    description:
      "Create comprehensive API docs and user guides for our developer platform. Must have experience with Markdown, OpenAPI, and technical writing for SaaS products.",
    category: "Writing",
    skills: ["Technical Writing", "Markdown", "OpenAPI"],
    deadline: "2024-07-22T00:00:00Z",
    clientAvatar: "DV",
  },
  {
    id: "CTR-2024-905",
    title: "Brand Identity Design",
    partnerName: "GreenLife",
    status: "active",
    totalValue: 35000000,
    startDate: "2024-07-05T00:00:00Z",
    endDate: "2024-08-31T00:00:00Z",
    progressPercent: 0,
    description:
      "Design a complete brand identity including logo, color palette, typography system, and brand guidelines for an eco-friendly lifestyle brand.",
    category: "Design",
    skills: ["Branding", "Illustrator", "Logo Design"],
    deadline: "2024-07-25T00:00:00Z",
    clientAvatar: "GL",
  },
  {
    id: "CTR-2024-906",
    title: "NestJS Backend API Development",
    partnerName: "FinTech Solutions",
    status: "active",
    totalValue: 95000000,
    startDate: "2024-08-05T00:00:00Z",
    endDate: "2024-11-05T00:00:00Z",
    progressPercent: 0,
    description:
      "Build a robust REST API with NestJS and PostgreSQL for a fintech payment platform. Must include authentication, rate limiting, and comprehensive test coverage.",
    category: "Dev",
    skills: ["NestJS", "PostgreSQL", "Docker"],
    deadline: "2024-08-15T00:00:00Z",
    clientAvatar: "FS",
  },
];

const CATEGORIES = ["Design", "Dev", "Marketing", "Writing"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "budget-high", label: "Budget: High → Low" },
  { value: "budget-low", label: "Budget: Low → High" },
  { value: "deadline", label: "Deadline: Soonest" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatVND(amount: number) {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)}M ₫`;
  }
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatDeadline(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Closed";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays <= 7) return `${diffDays}d left`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Avatar Component ────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  ["#EDE9FE", "#7C3AED"],
  ["#D1FAE5", "#059669"],
  ["#FEF3C7", "#D97706"],
  ["#DBEAFE", "#2563EB"],
  ["#FCE7F3", "#BE185D"],
  ["#E0F2FE", "#0369A1"],
];

function ClientAvatar({ initials, index }: { initials: string; index: number }) {
  const [bg, fg] = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold select-none flex-shrink-0"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-green-100 text-green-700">Open</span>;
  }
  return <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-500">{status}</span>;
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <FileText className="w-9 h-9 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">No contracts found</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">
        Try adjusting your filters or search query to find more opportunities.
      </p>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ContractsMarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(200);
  const [sortBy, setSortBy] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // TODO: replace with real API calls — GET /contracts?search=...&category=...&budgetMin=...&budgetMax=...&sort=...
    setListings(MOCK_LISTINGS);
  }, []);

  // Toggle category
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Filtered + sorted results
  const filtered = useMemo(() => {
    let result = [...listings];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((l) => selectedCategories.includes(l.category));
    }

    result = result.filter(
      (l) =>
        l.totalValue >= budgetMin * 1_000_000 &&
        l.totalValue <= budgetMax * 1_000_000
    );

    if (sortBy === "budget-high") {
      result.sort((a, b) => b.totalValue - a.totalValue);
    } else if (sortBy === "budget-low") {
      result.sort((a, b) => a.totalValue - b.totalValue);
    } else if (sortBy === "deadline") {
      result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }

    return result;
  }, [listings, search, selectedCategories, budgetMin, budgetMax, sortBy]);

  // ─── Sidebar Content (shared between drawer + desktop) ─────────────────────

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="search-contracts"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contracts..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F3F4F6] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2A4A]/30 placeholder:text-gray-400 transition"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Category
        </label>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-gray-300 accent-[#1B2A4A]"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Budget Range
        </label>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Min</span>
              <span className="font-medium text-gray-700">{budgetMin}M ₫</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={5}
              value={budgetMin}
              onChange={(e) => setBudgetMin(Math.min(Number(e.target.value), budgetMax - 5))}
              className="w-full h-1.5 accent-[#1B2A4A] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Max</span>
              <span className="font-medium text-gray-700">{budgetMax}M ₫</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={5}
              value={budgetMax}
              onChange={(e) => setBudgetMax(Math.max(Number(e.target.value), budgetMin + 5))}
              className="w-full h-1.5 accent-[#1B2A4A] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full py-2.5 px-3 text-sm bg-[#F3F4F6] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2A4A]/30 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setSearch("");
          setSelectedCategories([]);
          setBudgetMin(0);
          setBudgetMax(200);
          setSortBy("newest");
        }}
        className="w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      <NavBar activePage="Contracts" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Contracts</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filtered.length} opportunit{filtered.length === 1 ? "y" : "ies"} available
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-6 items-start">
          {/* ─── Sidebar ──────────────────────────────────────────────── */}

          {/* Mobile drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 md:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <SidebarContent />
              </div>
            </div>
          )}

          {/* Desktop sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">Filters</h2>
            <SidebarContent />
          </aside>

          {/* ─── Contract Cards Grid ──────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <EmptyState />
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {filtered.map((listing, idx) => (
                  <div
                    key={listing.id}
                    className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug line-clamp-2 group-hover:text-[#1B2A4A] transition-colors">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <ClientAvatar initials={listing.clientAvatar ?? listing.partnerName.slice(0, 2).toUpperCase()} index={idx} />
                          <span className="text-sm text-gray-500">{listing.partnerName}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-0.5">
                        <StatusBadge status={listing.status} />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {listing.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {listing.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#F3F4F6] text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Budget & Deadline */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Banknote className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-[#1B2A4A]">
                          {formatVND(listing.totalValue)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDeadline(listing.deadline)}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-xs text-gray-400 font-medium">{listing.category}</span>
                      <Link
                        href={`/contracts/${listing.id}`}
                        className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
                        style={{ backgroundColor: "#1B2A4A" }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
