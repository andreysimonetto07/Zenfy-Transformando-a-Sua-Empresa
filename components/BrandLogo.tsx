import Image from "next/image";
import Link from "next/link";

type Props = { href?: string; compact?: boolean; light?: boolean; className?: string };

export default function BrandLogo({ href = "/", compact = false, light = false, className = "" }: Props) {
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`relative block h-11 w-11 shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ${light ? "bg-white ring-white/20" : "bg-white ring-zinc-200"}`}>
        <Image src="/brand/zenfy/Zenfy-logo1.webp" alt="Zenfy" fill sizes="44px" className="scale-[2.75] object-cover object-[50%_23%]" priority />
      </span>
      {!compact && <span className="leading-none">
        <span className={`block text-[22px] font-black tracking-[-0.055em] ${light ? "text-white" : "text-[#09113f]"}`}>Zenfy</span>
        <span className={`mt-1.5 block text-[9px] font-bold uppercase tracking-[0.17em] ${light ? "text-cyan-100/80" : "text-zinc-500"}`}>Companhia A &amp; P</span>
      </span>}
    </span>
  );
  return href ? <Link href={href} aria-label="Zenfy — início">{content}</Link> : content;
}
