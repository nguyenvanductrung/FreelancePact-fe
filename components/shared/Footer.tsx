import Link from "next/link";
import { NAVY, FOOTER_LINKS } from "@/constants";

interface FooterProps {
  maxWidth?: string;
}

export function Footer({ maxWidth = "max-w-7xl" }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white px-8 py-4">
      <div className={`${maxWidth} mx-auto flex flex-col md:flex-row items-center justify-between gap-2`}>
        <div>
          <p className="text-sm font-bold" style={{ color: NAVY }}>
            FreelancePact
          </p>
          <p className="text-xs text-gray-400">
            © 2024 FreelancePact. Secure Payments. Legal Contracts.
          </p>
        </div>
        <nav className="flex items-center gap-5" aria-label="Footer navigation">
          {FOOTER_LINKS.map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
