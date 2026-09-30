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
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        <Image
          src="/brand/zenfy/logo-primary.webp"
          alt="Símbolo da Zenfy"
          fill
          sizes="40px"
          className="scale-[2.65] object-cover object-[50%_25%]"
          priority
        />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block text-xl font-extrabold tracking-[-0.04em] ${light ? "text-white" : "text-[#09113f]"}`}>Zenfy</span>
          <span className={`mt-1 block text-[10px] font-medium uppercase tracking-[0.16em] ${light ? "text-white/65" : "text-zinc-500"}`}>Agência Digital</span>
        </span>
      )}
    </span>
  );

  return href ? <Link href={href} aria-label="Zenfy — página inicial">{content}</Link> : content;
}
