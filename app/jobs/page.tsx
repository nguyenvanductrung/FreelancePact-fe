"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/shared/NavBar";
import { Footer } from "@/components/shared/Footer";
import { NAVY } from "@/constants";
import { Job } from "@/types";
import { mockJobs } from "@/lib/mock-data/jobs";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Clock, Coins, Search, XCircle, AlertCircle, Filter, X } from "lucide-react";

// Helpers
function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "Vừa xong";
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  if (diffInDays === 1) return "Hôm qua";
  return `${diffInDays} ngày trước`;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ITEMS_PER_PAGE = 9;

export default function JobsPage() {
  const router = useRouter();

  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [duration, setDuration] = useState<string>("all");
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 5000]);
  const [selectedSkill, setSelectedSkill] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Extract all unique skills for filter
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    mockJobs.forEach(job => job.skills.forEach(s => skills.add(s)));
    return Array.from(skills).sort();
  }, []);

  // Fetch / Simulate API Call
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Tạm thời dùng mock data, simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setJobs(mockJobs);
      } catch (err) {
        setError("Không thể tải danh sách công việc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search
      if (debouncedSearch && !job.title.toLowerCase().includes(debouncedSearch.toLowerCase())) {
        return false;
      }
      // Duration
      if (duration !== "all" && job.duration !== duration) {
        return false;
      }
      // Skill
      if (selectedSkill !== "all" && !job.skills.includes(selectedSkill)) {
        return false;
      }
      // Budget
      if (job.budget < budgetRange[0] || job.budget > budgetRange[1]) {
        return false;
      }
      return true;
    });
  }, [jobs, debouncedSearch, duration, selectedSkill, budgetRange]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const currentJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, duration, selectedSkill, budgetRange]);

  const hasActiveFilters = search !== "" || duration !== "all" || selectedSkill !== "all" || budgetRange[0] !== 0 || budgetRange[1] !== 5000;

  const clearFilters = () => {
    setSearch("");
    setDuration("all");
    setSelectedSkill("all");
    setBudgetRange([0, 5000]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <NavBar activePage="Jobs" />

      {/* Header Banner */}
      <div className="bg-[#1B2A4A] text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Khám phá Cơ hội</h1>
          <p className="mt-3 text-[#A9B9D0] max-w-2xl text-lg">
            Hàng ngàn dự án freelance chất lượng đang chờ đón bạn. Tìm kiếm, ứng tuyển và bắt đầu công việc ngay hôm nay.
          </p>
        </div>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        
        {/* Sidebar Filters (Sticky) */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: NAVY }}>
                <Filter className="w-5 h-5" />
                Bộ lọc
              </h2>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Xoá lọc
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tên công việc..." 
                    className="pl-9 h-10 focus-visible:ring-[#4F6AF5]" 
                  />
                </div>
              </div>

              <Separator />

              {/* Kỹ năng */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Kỹ năng yêu cầu</label>
                <Select value={selectedSkill} onValueChange={(val) => setSelectedSkill(val || "all")}>
                  <SelectTrigger className="w-full focus:ring-[#4F6AF5]">
                    <SelectValue placeholder="Chọn kỹ năng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả kỹ năng</SelectItem>
                    {allSkills.map(skill => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Ngân sách */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Ngân sách (ADA)</label>
                  <span className="text-xs font-medium text-[#4F6AF5]">
                    {budgetRange[0]} - {budgetRange[1] === 5000 ? "5000+" : budgetRange[1]} ₳
                  </span>
                </div>
                <Slider 
                  value={budgetRange}
                  min={0} 
                  max={5000} 
                  step={50}
                  onValueChange={(val) => setBudgetRange(val as number[])}
                  className="[&_[role=slider]]:bg-[#4F6AF5]"
                />
              </div>

              <Separator />

              {/* Thời gian */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Thời gian dự kiến</label>
                <Select value={duration} onValueChange={(val) => setDuration(val || "all")}>
                  <SelectTrigger className="w-full focus:ring-[#4F6AF5]">
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="< 1 tháng">&lt; 1 tháng</SelectItem>
                    <SelectItem value="1-3 tháng">1 - 3 tháng</SelectItem>
                    <SelectItem value="> 3 tháng">&gt; 3 tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        </aside>

        {/* Job List */}
        <section className="min-w-0">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Thử lại</Button>
              </AlertDescription>
            </Alert>
          ) : loading ? (
            // Loading Skeletons
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="flex flex-col h-full shadow-sm border-gray-200">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pb-4 flex-1">
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 justify-between items-center border-t px-6 py-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            // Empty State
            <div className="bg-white border border-dashed border-gray-300 rounded-xl py-20 px-6 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy công việc phù hợp</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Rất tiếc, hiện tại không có dự án nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc để xem thêm.
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} style={{ backgroundColor: "#4F6AF5" }} className="hover:bg-[#3d55d9]">
                  Xoá bộ lọc
                </Button>
              )}
            </div>
          ) : (
            // Job Grid
            <>
              <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                <span>Hiển thị <strong>{filteredJobs.length}</strong> công việc</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {currentJobs.map(job => (
                  <Card 
                    key={job.id} 
                    className="flex flex-col h-full shadow-sm border-gray-200 hover:shadow-md hover:border-[#4F6AF5]/40 transition-all duration-200 cursor-pointer group"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <CardHeader className="pb-3 px-5 pt-5">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <CardTitle className="text-lg font-bold leading-tight group-hover:text-[#4F6AF5] transition-colors line-clamp-2">
                          {job.title}
                        </CardTitle>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        {job.clientName}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="pb-4 px-5 flex-1">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 3 && (
                          <Badge variant="outline" className="font-medium text-gray-500">
                            +{job.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-4 px-5 pb-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/50 rounded-b-xl">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[#1B2A4A] font-bold">
                          <Coins className="w-4 h-4 text-[#4F6AF5]" />
                          {job.budget.toLocaleString()} ₳
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {job.duration}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{formatRelativeTime(job.createdAt)}</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    Trước
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "ghost"}
                        size="sm"
                        className={currentPage === i + 1 ? "bg-[#1B2A4A] text-white hover:bg-[#16304F]" : ""}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
