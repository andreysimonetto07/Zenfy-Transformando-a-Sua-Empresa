import Image from "next/image";
import Link from "next/link";

type Props = { href?: string; compact?: boolean; light?: boolean; className?: string };

export default function BrandLogo({ href = "/", compact = false, light = false, className = "" }: Props) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border shadow-md ${light ? "border-white/20 bg-white" : "border-zinc-200 bg-white"}`}>
        <Image
          src="/brand/zenfy/icon-64.png"
          alt="Símbolo Zenfy"
          width={64}
          height={64}
          sizes="44px"
          className="h-full w-full object-contain p-1"
          priority
        />
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
