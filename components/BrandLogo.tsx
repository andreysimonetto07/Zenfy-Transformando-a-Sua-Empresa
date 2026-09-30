import Link from "next/link";
import ZenfyMark from "@/components/ZenfyMark";

type Props = { href?: string; compact?: boolean; light?: boolean; className?: string };

export default function BrandLogo({ href = "/", compact = false, light = false, className = "" }: Props) {
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border p-1.5 shadow-lg ${light ? "border-white/15 bg-white/10" : "border-zinc-200/80 bg-white"}`}>
        <ZenfyMark className="h-full w-full" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block text-[22px] font-black tracking-[-0.055em] ${light ? "text-white" : "text-[#09113f]"}`}>Zenfy</span>
          <span className={`mt-1.5 block text-[9px] font-bold uppercase tracking-[0.17em] ${light ? "text-cyan-100/80" : "text-zinc-500"}`}>Companhia A &amp; P</span>
        </span>
      )}
    </span>
  );
  return href ? <Link href={href} aria-label="Zenfy — início">{content}</Link> : content;
}
