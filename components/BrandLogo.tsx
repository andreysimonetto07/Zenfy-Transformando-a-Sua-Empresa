import Image from "next/image";
import Link from "next/link";

type Props = { href?: string; compact?: boolean; light?: boolean; className?: string };

export default function BrandLogo({ href = "/", compact = false, light = false, className = "" }: Props) {
  const content = compact ? (
    <span className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center ${className}`}>
      <Image
        src="/brand/zenfy/icone-zenfy-transparente.png"
        alt="Ícone Zenfy"
        fill
        sizes="44px"
        className="object-contain drop-shadow-[0_6px_16px_rgba(23,105,255,.18)]"
        priority
      />
    </span>
  ) : (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="relative block h-12 w-[158px] sm:w-[174px]">
        <Image
          src="/brand/zenfy/Zenfy-logo1-transparente.png"
          alt="Zenfy"
          fill
          sizes="(max-width: 640px) 158px, 174px"
          className={`object-contain object-left ${light ? "drop-shadow-[0_4px_18px_rgba(255,255,255,.12)]" : "drop-shadow-[0_5px_18px_rgba(23,105,255,.10)]"}`}
          priority
        />
      </span>
      <span className={`hidden border-l pl-3 text-[9px] font-bold uppercase leading-relaxed tracking-[0.16em] sm:block ${light ? "border-white/15 text-cyan-100/75" : "border-zinc-200 text-zinc-500"}`}>
        Companhia<br/>A &amp; P
      </span>
    </span>
  );

  return href ? <Link href={href} aria-label="Zenfy — início">{content}</Link> : content;
}
