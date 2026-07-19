"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, FileSignature, Save, Plus, X, Loader2 } from "lucide-react";

import { NavBar } from "@/components/shared/NavBar";
import { Footer } from "@/components/shared/Footer";
import { SectionCard, SectionHeading } from "@/components/shared/SectionCard";
import { NAVY } from "@/constants";
import { jobsApi } from "@/lib/api";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Vui lòng nhập tiêu đề")
    .max(100, "Tiêu đề không được vượt quá 100 ký tự"),
  description: z
    .string()
    .min(50, "Mô tả cần ít nhất 50 ký tự để freelancer hiểu rõ yêu cầu"),
  budget: z
    .number({
      message: "Vui lòng nhập ngân sách hợp lệ",
    })
    .positive("Ngân sách phải lớn hơn 0"),
  duration: z.string().optional(),
  deadline: z.date({
    message: "Vui lòng chọn hạn chót ứng tuyển",
  }),
  skills: z
    .array(z.string())
    .min(1, "Vui lòng thêm ít nhất 1 kỹ năng"),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CreateJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [budgetDisplay, setBudgetDisplay] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "< 1 tháng",
      skills: [],
    },
  });

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleAddSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill) {
        const currentSkills = form.getValues("skills");
        if (!currentSkills.includes(newSkill)) {
          form.setValue("skills", [...currentSkills, newSkill], { shouldValidate: true });
        }
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("skills");
    form.setValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove),
      { shouldValidate: true }
    );
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/,/g, "");
    if (val === "") {
      setBudgetDisplay("");
      form.setValue("budget", undefined as any, { shouldValidate: true });
      return;
    }

    // Only allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(val)) return;

    setBudgetDisplay(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      form.setValue("budget", num, { shouldValidate: true });
    }
  };

  const handleBudgetBlur = () => {
    const currentVal = form.getValues("budget");
    if (currentVal) {
      setBudgetDisplay(new Intl.NumberFormat("en-US").format(currentVal));
    }
  };

  const handleBudgetFocus = () => {
    const currentVal = form.getValues("budget");
    if (currentVal) {
      setBudgetDisplay(currentVal.toString());
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call format per instructions
      await new Promise((resolve) => setTimeout(resolve, 800));

      const payload = {
        title: values.title,
        description: values.description,
        budget: values.budget,
        duration: values.duration,
        deadline: values.deadline.toISOString(),
        skills: values.skills,
      };

      console.log("Submitting job payload:", payload);
      await jobsApi.create(payload);

      toast.success("Đăng bài tuyển dụng thành công!");
      router.push("/dashboard/client");
    } catch (error: any) {
      if (error.errors && Object.keys(error.errors).length > 0) {
        const firstErrorKey = Object.keys(error.errors)[0];
        const firstErrorMessage = error.errors[firstErrorKey][0];
        toast.error(`Lỗi dữ liệu (${firstErrorKey}): ${firstErrorMessage}`);
      } else {
        toast.error(error.message || "Đã xảy ra lỗi khi tạo bài tuyển dụng. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F8FAFC", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <NavBar activePage="Jobs" />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSignature className="w-6 h-6" style={{ color: NAVY }} />
              <h1 className="text-2xl font-extrabold text-gray-900">Đăng Dự Án Mới</h1>
            </div>
            <p className="text-sm text-gray-500">
              Điền chi tiết yêu cầu để tìm kiếm Freelancer phù hợp nhất.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            Lưu Nháp
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* ── Section 1: Thông Tin Chung */}
            <SectionCard>
              <SectionHeading>Thông Tin Chung</SectionHeading>
              <div className="px-6 py-5 space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-600 uppercase">
                        Tiêu đề công việc <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Vd: Thiết kế Website Thương mại điện tử"
                            className="pr-16 border-gray-300 focus-visible:ring-blue-100 focus-visible:border-blue-400"
                            {...field}
                          />
                        </FormControl>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          {field.value.length}/100
                        </span>
                      </div>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-600 uppercase">
                        Mô tả chi tiết <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả cụ thể yêu cầu, mục tiêu, và các tài liệu liên quan..."
                            className="min-h-[150px] resize-y border-gray-300 focus-visible:ring-blue-100 focus-visible:border-blue-400 pb-8"
                            {...field}
                          />
                        </FormControl>
                        <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                          {field.value.length} ký tự (tối thiểu 50)
                        </span>
                      </div>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>
            </SectionCard>

            {/* ── Section 2: Yêu Cầu Chuyên Môn */}
            <SectionCard>
              <SectionHeading>Yêu Cầu Chuyên Môn & Ngân Sách</SectionHeading>
              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase">
                          Ngân sách tối đa <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="0"
                              value={budgetDisplay}
                              onChange={handleBudgetChange}
                              onBlur={handleBudgetBlur}
                              onFocus={handleBudgetFocus}
                              className="pr-12 border-gray-300 focus-visible:ring-blue-100 focus-visible:border-blue-400 font-semibold"
                            />
                          </FormControl>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#4F6AF5] pointer-events-none select-none">
                            ADA
                          </span>
                        </div>
                        <FormDescription className="text-xs">
                          Thanh toán bằng Cardano (ADA).
                        </FormDescription>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase mt-1">
                          Hạn chót ứng tuyển <span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "w-full pl-3 text-left font-normal border-gray-300 hover:bg-gray-50",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: vi })
                            ) : (
                              <span>Chọn ngày...</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase">
                          Thời gian dự kiến
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:ring-blue-100 focus:border-blue-400">
                              <SelectValue placeholder="Chọn thời gian" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="< 1 tháng">&lt; 1 Tháng</SelectItem>
                            <SelectItem value="1-3 tháng">1 - 3 Tháng</SelectItem>
                            <SelectItem value="> 3 tháng">&gt; 3 Tháng</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase">
                          Kỹ năng yêu cầu <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 hover:bg-blue-100 gap-1 pr-1.5"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="rounded-full hover:bg-blue-200 p-0.5 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="Gõ kỹ năng và nhấn Enter..."
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                className="border-gray-300 focus-visible:ring-blue-100 focus-visible:border-blue-400"
                              />
                            </FormControl>
                          </div>
                        </div>
                        <FormDescription className="text-xs">
                          Nhấn Enter hoặc phẩy (,) để thêm kỹ năng mới.
                        </FormDescription>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </SectionCard>

            {/* ── Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 pb-6">
              <p className="text-xs text-gray-400 hidden sm:block">* Các trường bắt buộc phải điền.</p>
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="font-semibold text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                  onClick={() => router.back()}
                >
                  Hủy Bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-bold text-white shadow-md px-6"
                  style={{ backgroundColor: NAVY }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Đăng Dự Án
                    </>
                  )}
                </Button>
              </div>
            </div>

          </form>
        </Form>
      </main>

      <Toaster position="top-center" richColors />
      <Footer />
    </div>
  );
}
