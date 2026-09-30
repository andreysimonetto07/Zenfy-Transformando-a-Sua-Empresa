export default function PageHero({ title, text }: { title: string; text: string }) {
  return (
    <section className="zenfy-dark-art relative isolate overflow-hidden text-white">
      <div className="ambient-dot ambient-dot-a" />
      <div className="ambient-dot ambient-dot-b" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 md:py-28">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-100">Zenfy · Companhia A &amp; P</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.045em] drop-shadow-sm sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:text-lg">{text}</p>
      </div>
    </section>
  );
}
