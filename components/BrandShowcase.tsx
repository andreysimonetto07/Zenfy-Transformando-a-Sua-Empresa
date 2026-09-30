import Image from "next/image";
import ZenfyMark from "@/components/ZenfyMark";

type Props = {
  variant: "primary" | "growth";
  compact?: boolean;
};

export default function BrandShowcase({ variant, compact = false }: Props) {
  const isPrimary = variant === "primary";

  return (
    <div className={`relative mx-auto w-full ${compact ? "max-w-[360px]" : "max-w-[440px]"}`}>
      <div className={`absolute inset-10 rounded-full blur-3xl ${isPrimary ? "bg-cyan-300/25" : "bg-fuchsia-400/20"}`} />

      <div className="float-soft relative overflow-hidden rounded-[2rem] border border-white/40 bg-white p-5 shadow-2xl shadow-blue-950/25 sm:p-7">
        {isPrimary ? (
          <div className="flex aspect-square flex-col items-center justify-center rounded-[1.5rem] bg-white px-8">
            <ZenfyMark className="h-auto w-[62%] max-w-[250px]" />
            <div className="mt-4 text-center">
              <p className="text-5xl font-black tracking-[-0.07em] text-[#09113f] sm:text-6xl">Zenfy</p>
            </div>
          </div>
        ) : (
          <Image
            src="/brand/zenfy/Zenfy-logo2.webp"
            alt="Zenfy"
            width={1254}
            height={1254}
            className="h-auto w-full rounded-[1.4rem]"
          />
        )}
      </div>
    </div>
  );
}
