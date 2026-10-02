import Image from "next/image";
import Link from "next/link";

type Props = { href?: string; compact?: boolean; light?: boolean; className?: string };

function DarkBrand({className=""}:{className?:string}) {
  return (
    <span className={`items-center gap-3 ${className}`}>
      <span className="relative block h-11 w-11 shrink-0">
        <Image
          src="/brand/zenfy/icone-zenfy-transparente.png"
          alt=""
          fill
          sizes="44px"
          className="object-contain drop-shadow-[0_7px_18px_rgba(25,211,231,.16)]"
          priority
        />
      </span>
      <span className="text-[1.8rem] font-black tracking-[-0.06em] text-white">Zenfy</span>
      <span className="hidden border-l border-white/15 pl-3 text-[9px] font-bold uppercase leading-relaxed tracking-[0.16em] text-cyan-100/75 sm:block">
        Companhia<br/>A &amp; P
      </span>
    </span>
  );
}

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
  ) : light ? (
    <DarkBrand className={`inline-flex ${className}`} />
  ) : (
    <span className={`inline-flex items-center ${className}`}>
      <span className="brand-logo-light items-center gap-3">
        <span className="relative block h-12 w-[158px] sm:w-[174px]">
          <Image
            src="/brand/zenfy/Zenfy-logo1-transparente.png"
            alt="Zenfy"
            fill
            sizes="(max-width: 640px) 158px, 174px"
            className="object-contain object-left drop-shadow-[0_5px_18px_rgba(23,105,255,.10)]"
            priority
          />
        </span>
        <span className="hidden border-l border-zinc-200 pl-3 text-[9px] font-bold uppercase leading-relaxed tracking-[0.16em] text-zinc-500 sm:block">
          Companhia<br/>A &amp; P
        </span>
      </span>
      <DarkBrand className="brand-logo-dark" />
    </span>
  );

  return href ? <Link href={href} aria-label="Zenfy — início">{content}</Link> : content;
}
