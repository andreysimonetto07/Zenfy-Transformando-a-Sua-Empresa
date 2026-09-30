import Image from "next/image";
import Link from "next/link";

type Props={href?:string;compact?:boolean;light?:boolean;className?:string};

export default function BrandLogo({href="/",compact=false,light=false,className=""}:Props){
  const content=(
    <span className={`inline-flex items-center ${className}`}>
      <span className={`relative block h-12 w-[104px] overflow-hidden rounded-2xl border shadow-md ${light?"border-white/15 bg-white":"border-zinc-200 bg-white"}`}>
        <Image src="/brand/zenfy/Zenfy-logo-official.webp" alt="Zenfy" fill sizes="104px" className="object-contain p-1.5" priority />
      </span>
      {!compact&&<span className={`ml-2 hidden text-[9px] font-black uppercase tracking-[.14em] sm:block ${light?"text-cyan-100/70":"text-zinc-400"}`}>Companhia A &amp; P</span>}
    </span>
  );
  return href?<Link href={href} aria-label="Zenfy — início">{content}</Link>:content;
}
