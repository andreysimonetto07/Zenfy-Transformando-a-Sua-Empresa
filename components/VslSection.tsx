export default function VslSection() {
  const videoUrl = process.env.NEXT_PUBLIC_ZENFY_VSL_URL?.trim();
  if (!videoUrl) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="overflow-hidden rounded-[2rem] bg-[#020624] shadow-2xl shadow-blue-950/15">
        <div className="grid lg:grid-cols-[.72fr_1.28fr]">
          <div className="zenfy-dark-art flex flex-col justify-center p-7 text-white sm:p-10 lg:p-12">
            <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Conheça a Zenfy</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Tráfego, tecnologia e acompanhamento em uma única estrutura.</h2>
            <p className="mt-4 leading-relaxed text-blue-50/80">Veja como a Zenfy organiza campanhas, páginas, projetos e o portal do cliente.</p>
          </div>
          <div className="bg-black">
            <video controls playsInline preload="metadata" className="aspect-video h-full w-full object-cover">
              <source src={videoUrl} />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
