"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Coins,
  Users,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast, Toaster } from "sonner";

import { NavBar } from "@/components/shared/NavBar";
import { Footer } from "@/components/shared/Footer";
import { NAVY } from "@/constants";
import { jobsApi, authApi } from "@/lib/api";
import { mockJobs } from "@/lib/mock-data/jobs";
import type { Job } from "@/types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

// ─── Apply Form Schema ────────────────────────────────────────────────────────

const applySchema = z.object({
  coverLetter: z
    .string()
    .min(50, "Thư chào hàng phải có ít nhất 50 ký tự")
    .max(2000, "Tối đa 2000 ký tự"),
  proposedBudget: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
      "Ngân sách phải là số dương"
    ),
});
type ApplyFormValues = z.infer<typeof applySchema>;

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Job["status"] }) {
  const map: Record<Job["status"], { label: string; className: string }> = {
    OPEN: {
      label: "Đang tuyển",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    DRAFT: {
      label: "Nháp",
      className: "bg-gray-100 text-gray-600 border-gray-200",
    },
    CLOSED: {
      label: "Đã đóng",
      className: "bg-red-100 text-red-600 border-red-200",
    },
  };
  const { label, className } = map[status] ?? map.CLOSED;
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        className
      )}
    >
      {status === "OPEN" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
      )}
      {label}
    </span>
  );
}

// ─── Skeleton Loading ─────────────────────────────────────────────────────────

function JobDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      <div className="space-y-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="space-y-3 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="flex gap-2 pt-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ─── Apply Dialog ─────────────────────────────────────────────────────────────

function ApplyDialog({
  job,
  open,
  onClose,
  onSuccess,
}: {
  job: Job;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: { coverLetter: "", proposedBudget: "" },
  });

  const handleSubmit = async (values: ApplyFormValues) => {
    setSubmitting(true);
    try {
      await jobsApi.apply(job.id, {
        coverLetter: values.coverLetter,
        proposedBudget: values.proposedBudget
          ? Number(values.proposedBudget)
          : undefined,
      });
      toast.success("🎉 Nộp đơn ứng tuyển thành công!");
      form.reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Nộp đơn thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div
          className="px-6 py-5 border-b"
          style={{ backgroundColor: `${NAVY}08` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: NAVY }}
              >
                Nộp đơn ứng tuyển
              </h2>
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                {job.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="px-6 py-5 space-y-5"
          >
            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-800">
                    Thư chào hàng <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Giới thiệu bản thân, kinh nghiệm liên quan và tại sao bạn phù hợp với vị trí này..."
                      rows={6}
                      className="resize-none focus-visible:ring-[#4F6AF5]"
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <span className="text-xs text-gray-400 ml-auto">
                      {field.value.length}/2000
                    </span>
                  </div>
                  <FormDescription>
                    Tối thiểu 50 ký tự. Hãy thuyết phục Client chọn bạn!
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proposedBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-800">
                    Ngân sách đề xuất{" "}
                    <span className="text-gray-400 font-normal text-xs">
                      (tuỳ chọn, ADA)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
                        ₳
                      </span>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        placeholder={String(job.budget)}
                        className="pl-8 focus-visible:ring-[#4F6AF5]"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Để trống nếu bạn đồng ý với ngân sách {job.budget} ₳ của
                    Client.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={submitting}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                className="flex-1 font-semibold"
                style={{ backgroundColor: NAVY }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Gửi đơn ứng tuyển
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    authApi.me()
      .then(res => setCurrentUser(res.data))
      .catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    if (id) loadJob();
  }, [id]);

  const loadJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobsApi.getById(id);
      setJob(res.data);
    } catch {
      // Fallback to mock data for development
      const mock = mockJobs.find((j) => j.id === id);
      if (mock) {
        setJob(mock as unknown as Job);
      } else {
        setError("Không tìm thấy công việc này.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isOpen = job?.status === "OPEN";

  const handleApplyClick = () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để ứng tuyển.");
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }
    const role = currentUser.role?.toLowerCase();
    if (role === "client") {
      toast.error("Tài khoản doanh nghiệp (Client) không thể ứng tuyển.");
      return;
    }
    setApplyOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" style={{ fontFamily: "Inter, sans-serif" }}>
      <Toaster richColors position="top-right" />
      <NavBar activePage="Find Work" />

      {/* ── Loading ── */}
      {loading && (
        <main className="flex-1">
          <JobDetailSkeleton />
        </main>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{error}</h2>
            <p className="text-gray-500 mb-6">
              Công việc có thể đã bị xoá hoặc bạn không có quyền truy cập.
            </p>
            <Button onClick={() => router.push("/jobs")} style={{ backgroundColor: NAVY }}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về danh sách việc làm
            </Button>
          </div>
        </main>
      )}

      {/* ── Content ── */}
      {!loading && job && (
        <>
          {/* Hero banner */}
          <div
            className="text-white py-8 px-4"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2d4a7a 100%)` }}
          >
            <div className="max-w-6xl mx-auto">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại danh sách
              </Link>
              <div className="flex items-start gap-3 flex-wrap">
                <StatusBadge status={job.status} />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-3 leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/70">
                {job.clientName && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {job.clientName}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Đăng{" "}
                  {format(new Date(job.createdAt), "dd/MM/yyyy", { locale: vi })}
                </span>
                {job.deadline && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Hạn chót:{" "}
                    {format(new Date(job.deadline), "dd/MM/yyyy", { locale: vi })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* ── Left column ── */}
            <div className="space-y-6 min-w-0">
              {/* Description */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: NAVY }}
                >
                  Mô tả công việc
                </h2>
                {job.description ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">Chưa có mô tả chi tiết.</p>
                )}
              </section>

              {/* Skills */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: NAVY }}
                >
                  Kỹ năng yêu cầu
                </h2>
                {job.skills && job.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="px-3 py-1 text-sm font-medium bg-[#EEF1FD] text-[#4F6AF5] hover:bg-[#dde3fb] border-0"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Chưa liệt kê kỹ năng.</p>
                )}
              </section>

              {/* Client info */}
              {job.clientName && (
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2
                    className="text-lg font-bold mb-4"
                    style={{ color: NAVY }}
                  >
                    Về Client
                  </h2>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: NAVY }}
                    >
                      {job.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {job.clientName}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Đã đăng {job.applicationCount ?? 0} đơn ứng tuyển
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* ── Right sidebar (sticky) ── */}
            <aside className="lg:sticky lg:top-24 h-fit space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Sidebar header */}
                <div
                  className="px-6 py-4 border-b"
                  style={{ backgroundColor: `${NAVY}08` }}
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Thông tin công việc
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* Budget */}
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                      <Coins className="w-3.5 h-3.5" />
                      Ngân sách
                    </div>
                    <div
                      className="text-2xl font-extrabold"
                      style={{ color: NAVY }}
                    >
                      {job.budget.toLocaleString()} ₳
                    </div>
                    <div className="text-xs text-gray-400">ADA</div>
                  </div>

                  {/* Duration */}
                  {job.duration && (
                    <div className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        Thời gian
                      </div>
                      <p className="font-semibold text-gray-800">
                        {job.duration}
                      </p>
                    </div>
                  )}

                  {/* Deadline */}
                  {job.deadline && (
                    <div className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Hạn chót ứng tuyển
                      </div>
                      <p className="font-semibold text-gray-800">
                        {format(new Date(job.deadline), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </p>
                    </div>
                  )}

                  {/* Applicants count */}
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                      <Users className="w-3.5 h-3.5" />
                      Số đơn ứng tuyển
                    </div>
                    <p className="font-semibold text-gray-800">
                      {job.applicationCount ?? 0} proposals
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="px-6 py-5 border-t bg-gray-50/50">
                  {hasApplied ? (
                    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 text-emerald-700 rounded-lg font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-5 h-5" />
                      Đã ứng tuyển
                    </div>
                  ) : (
                    <Button
                      className="w-full font-semibold text-base py-5 shadow-md hover:shadow-lg transition-all"
                      style={{ backgroundColor: NAVY }}
                      disabled={!isOpen}
                      onClick={handleApplyClick}
                    >
                      {isOpen ? (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Nộp đơn ứng tuyển
                        </>
                      ) : (
                        "Công việc đã đóng"
                      )}
                    </Button>
                  )}
                  {!isOpen && !hasApplied && (
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Công việc này không còn nhận đơn ứng tuyển.
                    </p>
                  )}
                </div>
              </div>

              {/* Share / Back link */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/jobs")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Xem tất cả công việc
              </Button>
            </aside>
          </main>

          {/* Apply Dialog */}
          <ApplyDialog
            job={job}
            open={applyOpen}
            onClose={() => setApplyOpen(false)}
            onSuccess={() => setHasApplied(true)}
          />
        </>
      )}

      <Footer />
    </div>
  );
}
