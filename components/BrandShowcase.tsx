import Image from "next/image";

type Props = {
  variant: "primary" | "growth";
  compact?: boolean;
  label?: string;
};

export default function BrandShowcase({ variant, compact = false, label }: Props) {
  const isPrimary = variant === "primary";
  const src = isPrimary ? "/brand/zenfy/Zenfy-logo1.webp" : "/brand/zenfy/Zenfy-logo2.webp";
  const alt = isPrimary ? "Logo principal Zenfy" : "Logo Zenfy de crescimento";

  return (
    <div className={`relative mx-auto w-full ${compact ? "max-w-[380px]" : "max-w-[470px]"}`}>
      <div className={`absolute inset-10 rounded-full blur-3xl ${isPrimary ? "bg-cyan-300/25" : "bg-fuchsia-400/20"}`} />
      <div className="float-soft relative overflow-hidden rounded-[2rem] border border-white/40 bg-white p-3 shadow-2xl shadow-blue-950/30 sm:p-5">
        <Image
          src={src}
          alt={alt}
          width={1254}
          height={1254}
          priority={isPrimary}
          className="h-auto w-full rounded-[1.4rem]"
        />
      </div>
      {label && (
        <p className="relative mt-4 text-center text-xs font-extrabold uppercase tracking-[.16em] text-zinc-500">{label}</p>
      )}
    </div>
  );
}
