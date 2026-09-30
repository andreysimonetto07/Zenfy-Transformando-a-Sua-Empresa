import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function Sidebar({ items, title, subtitle }: { items: [string, string][]; title: string; subtitle?: string }) {
  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#050b2d] p-4 text-sm text-zinc-300 md:min-h-screen md:w-60 md:p-5">
      <div className="mb-3 md:mb-7">
        <p className="font-extrabold tracking-tight text-white">{title}</p>
        {subtitle && <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-200/70">{subtitle}</p>}
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
        {items.map(([href, label]) => <Link key={href} href={href} className="whitespace-nowrap rounded-lg px-3 py-2 transition-colors hover:bg-white/10 hover:text-white">{label}</Link>)}
      </nav>
      <LogoutButton />
    </aside>
  );
}
