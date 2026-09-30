import Image from "next/image";
import Link from "next/link";

export default function CtaBanner({ title = "Solicite uma análise gratuita da sua empresa", text = "Descubra oportunidades para fortalecer sua presença digital e transformar mais visitas em oportunidades comerciais." }: { title?: string; text?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-8 text-white shadow-2xl shadow-blue-950/15 md:p-14">
        <Image src="/brand/zenfy/bg-dark.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03072a]/95 via-[#06114f]/70 to-[#06114f]/15" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">Zenfy · Companhia A &amp; P</p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight">{title}</h2>
          <p className="mt-3 max-w-xl text-blue-50/90">{text}</p>
          <Link href="/solicitar-orcamento" className="btn btn-primary mt-8">Solicitar análise</Link>
        </div>
      </div>
    </section>
  );
}
