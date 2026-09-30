import Link from "next/link";

export default function CtaBanner({ title = "Solicite uma análise gratuita da sua empresa", text = "Descubra oportunidades para fortalecer sua presença digital e transformar mais visitas em oportunidades comerciais." }: { title?: string; text?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-7 text-white shadow-2xl shadow-blue-950/15 sm:p-10 md:p-14">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/brand/zenfy/Zenfy-BackGround1.webp')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020624]/95 via-[#06114f]/72 to-[#06114f]/20" />
        <div className="relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-cyan-100">Zenfy · Companhia A &amp; P</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-blue-50/90">{text}</p>
          <Link href="/solicitar-orcamento" className="btn btn-primary mt-8 w-full sm:w-auto">Solicitar análise gratuita</Link>
        </div>
      </div>
    </section>
  );
}
