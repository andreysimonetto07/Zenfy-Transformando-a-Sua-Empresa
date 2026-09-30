import Image from "next/image";
import GrowthMark from "@/components/GrowthMark";

export default function BrandShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative mx-auto w-full ${compact ? "max-w-[390px]" : "max-w-[470px]"}`}>
      <div className="brand-orbit brand-orbit-one" />
      <div className="brand-orbit brand-orbit-two" />

      <div className="float-soft relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/95 p-3 shadow-2xl shadow-blue-950/35 sm:p-5">
        <Image
          src="/brand/zenfy/Zenfy-logo2.webp"
          alt="Logo Zenfy"
          width={1254}
          height={1254}
          priority
          className="h-auto w-full rounded-[1.4rem]"
        />
      </div>

      <div className="float-soft-delayed absolute -bottom-6 right-0 w-[44%] rounded-[1.5rem] border border-white/35 bg-white/95 p-3 shadow-2xl shadow-blue-950/25 sm:-right-5 sm:-bottom-8">
        <GrowthMark className="mx-auto h-auto w-full" />
        <p className="mt-1 text-center text-lg font-black tracking-[-0.06em] text-[#09113f] sm:text-xl">Zenfy</p>
      </div>
    </div>
  );
}
