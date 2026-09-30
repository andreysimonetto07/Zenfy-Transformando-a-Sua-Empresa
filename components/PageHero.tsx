export default function PageHero({ title, text }: { title: string; text: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#06114f] text-white">
      <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: "url('/brand/zenfy/Zenfy-BackGround1.webp')" }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#020624]/92 via-[#06114f]/62 to-[#06114f]/12" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 md:py-28">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-100">Zenfy · Companhia A &amp; P</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.045em] drop-shadow-sm sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:text-lg">{text}</p>
      </div>
    </section>
  );
}
