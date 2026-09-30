import Image from "next/image";
import Link from "next/link";

type Props = {
  href?: string;
  compact?: boolean;
  light?: boolean;
  className?: string;
};

export default function BrandLogo({ href = "/", compact = false, light = false, className = "" }: Props) {
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5">
        <Image
          src="/brand/zenfy/logo-primary.webp"
          alt="Símbolo Zenfy"
          fill
          sizes="44px"
          className="scale-[2.5] object-cover object-[50%_24%]"
          priority
        />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block text-[22px] font-extrabold tracking-[-0.05em] ${light ? "text-white" : "text-[#09113f]"}`}>Zenfy</span>
          <span className={`mt-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em] ${light ? "text-cyan-100/75" : "text-zinc-500"}`}>Companhia A &amp; P</span>
        </span>
      )}
    </span>
  );

  return href ? <Link href={href} aria-label="Zenfy — página inicial">{content}</Link> : content;
}
