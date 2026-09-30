import Image from "next/image";

export default function BrandShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative mx-auto w-full ${compact ? "max-w-[360px]" : "max-w-[430px]"}`}>
      <div className="absolute inset-10 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="float-soft relative overflow-hidden rounded-[2rem] border border-white/40 bg-white p-4 shadow-2xl shadow-blue-950/25 sm:p-6">
        <Image
          src="/brand/zenfy/Zenfy-logo1.webp"
          alt="Zenfy"
          width={1254}
          height={1254}
          priority
          className="h-auto w-full rounded-[1.4rem]"
        />
      </div>
    </div>
  );
}
