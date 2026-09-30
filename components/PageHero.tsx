import Image from "next/image";

export default function PageHero({ title, text }: { title: string; text: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#06114f] text-white">
      <Image
        src="/brand/zenfy/bg-dark.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#03072a]/90 via-[#06114f]/60 to-[#06114f]/10" />
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Zenfy · Uma empresa da Companhia A &amp; P</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.035em] drop-shadow-sm md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-blue-50/90">{text}</p>
      </div>
    </section>
  );
}
