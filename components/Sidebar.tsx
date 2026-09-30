"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import LogoutButton from "@/components/LogoutButton";

export default function Sidebar({ items, title, subtitle, userName }: { items: [string,string][]; title: string; subtitle?: string; userName?: string }) {
  const pathname=usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#050b2d] p-4 text-sm text-zinc-300 md:min-h-screen md:w-64 md:p-5">
      <div className="mb-4 md:mb-7">
        <BrandLogo light href="/" />
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="font-extrabold tracking-tight text-white">{title}</p>
          {subtitle&&<p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-200/70">{subtitle}</p>}
          {userName&&<p className="mt-2 truncate text-xs text-white/50">Conectado como {userName}</p>}
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
        {items.map(([href,label])=>{
          const active=pathname===href || (href!=="/admin/dashboard"&&href!=="/cliente/dashboard"&&pathname.startsWith(href+"/"));
          return <Link key={href} href={href} className={`whitespace-nowrap rounded-xl px-3 py-2.5 font-semibold transition-colors ${active?"bg-white/12 text-white":"text-zinc-400 hover:bg-white/10 hover:text-white"}`}>{label}</Link>;
        })}
      </nav>

      <LogoutButton />
    </aside>
  );
}
