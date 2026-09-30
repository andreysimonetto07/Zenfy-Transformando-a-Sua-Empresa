import Image from "next/image";
import Link from "next/link";

export default function CtaBanner({ title = "Solicite uma análise gratuita da sua empresa", text = "Descubra oportunidades para fortalecer sua presença digital e transformar mais visitas em oportunidades comerciais." }: { title?: string; text?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-8 text-white shadow-xl shadow-blue-950/10 md:p-14">
        <Image src="/brand/zenfy/bg-dark.webp" alt="" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06114f] via-[#06114f]/85 to-transparent" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Zenfy</p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight">{title}</h2>
          <p className="mt-3 max-w-xl text-blue-50/80">{text}</p>
          <Link href="/solicitar-orcamento" className="btn btn-primary mt-8">Solicitar análise</Link>
        </div>
      </div>
    </section>
  );
}
