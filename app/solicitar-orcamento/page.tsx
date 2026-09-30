import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Solicitar análise gratuita", "Solicite uma análise gratuita da presença digital da sua empresa com a Zenfy.", "/solicitar-orcamento");

export default function SolicitarOrcamento() {
  return (
    <main>
      <PageHero title="Solicite uma análise gratuita da sua empresa" text="Mostre para a Zenfy onde sua empresa está hoje. Vamos identificar oportunidades para fortalecer sua presença digital e sua estrutura comercial." />
      <section className="mx-auto max-w-3xl px-5 py-16"><ContactForm /></section>
    </main>
  );
}
