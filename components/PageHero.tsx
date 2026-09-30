import Image from "next/image";

export default function PageHero({ title, text }: { title: string; text: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#06114f] text-white">
      <Image src="/brand/zenfy/bg-dark.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-80" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#050b36]/95 via-[#06114f]/80 to-[#06114f]/30" />
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Zenfy · Companhia A &amp; P</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.035em] md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-blue-50/80">{text}</p>
      </div>
    </section>
  );
}
