import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * White card with rounded corners and subtle shadow.
 * Used as section wrapper throughout the Create Contract form.
 */
export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SectionHeadingProps {
  children: React.ReactNode;
}

/** Heading inside a SectionCard with bottom border */
export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div className="px-6 pt-5 pb-4 border-b border-gray-100">
      <h2 className="text-base font-bold text-gray-800">{children}</h2>
    </div>
  );
}
