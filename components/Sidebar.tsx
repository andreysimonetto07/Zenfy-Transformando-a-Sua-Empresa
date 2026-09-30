"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import LogoutButton from "@/components/LogoutButton";

export default function Sidebar({ items, title, subtitle, userName }: { items: [string,string][]; title: string; subtitle?: string; userName?: string }) {
  const pathname=usePathname();

  return (
    <aside className="relative flex w-full shrink-0 flex-col overflow-hidden bg-[#03072a] p-4 text-sm text-zinc-300 md:sticky md:top-0 md:h-screen md:w-72 md:p-5">
      <div className="pointer-events-none absolute -left-20 top-4 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mb-4 md:mb-7">
        <BrandLogo light href="/" />
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          <p className="font-extrabold tracking-tight text-white">{title}</p>
          {subtitle&&<p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-200/70">{subtitle}</p>}
          {userName&&<p className="mt-2 truncate text-xs text-white/50">Conectado como {userName}</p>}
        </div>
      </div>

      <nav className="relative flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-y-auto md:overflow-x-visible md:pb-4">
        {items.map(([href,label])=>{
          const active=pathname===href || (href!=="/admin/dashboard"&&href!=="/cliente/dashboard"&&pathname.startsWith(href+"/"));
          return <Link key={href} href={href} className={`whitespace-nowrap rounded-xl px-3 py-2.5 font-semibold transition-all duration-200 ${active?"bg-white text-[#09113f] shadow-lg shadow-black/10":"text-zinc-400 hover:bg-white/10 hover:text-white"}`}>{label}</Link>;
        })}
      </nav>

      <div className="relative mt-2 md:mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );
}
