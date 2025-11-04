"use client";

import { Toaster as Sonner } from "sonner";

export const Toaster = (props: any) => {
  return (
    <Sonner
      theme="light" // ✅ React용 기본 테마 (Next.js 아님)
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};
