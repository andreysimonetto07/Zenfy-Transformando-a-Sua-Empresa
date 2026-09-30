"use client";

import { usePathname } from "next/navigation";

export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const internal = pathname.startsWith("/admin") || pathname.startsWith("/cliente");
  if (internal) return null;
  return <>{children}</>;
}
