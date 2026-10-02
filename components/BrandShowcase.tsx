import Image from "next/image";

export default function BrandShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative mx-auto w-full ${compact ? "max-w-[360px]" : "max-w-[470px]"}`}>
      <div className="absolute inset-[12%] rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute bottom-[8%] right-[5%] h-36 w-36 rounded-full bg-violet-400/15 blur-3xl" />
      <div className="float-soft relative flex min-h-[250px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.035] p-5 backdrop-blur-[2px] sm:min-h-[320px] sm:p-8">
        <Image
          src="/brand/zenfy/Zenfy-logo1-transparente.png"
          alt="Zenfy"
          width={1254}
          height={1254}
          priority
          className="h-auto w-full max-w-[390px] object-contain drop-shadow-[0_18px_32px_rgba(6,17,79,.22)]"
        />
      </div>
    </div>
  );
}
