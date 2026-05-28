import React from "react";
import Image from "next/image";

export function LogoIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  // Using an image instead of SVG per user request
  return (
    <div className={`relative ${className}`} style={props.style}>
      <Image 
        src="/logo.png" 
        alt="FreelancePact Logo" 
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
