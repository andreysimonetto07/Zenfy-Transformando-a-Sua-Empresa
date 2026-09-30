import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Contato", "Fale com a Zenfy e solicite uma análise gratuita da sua empresa.", "/contato");

export default function Contato() {
  return (
    <main>
      <PageHero title="Vamos conversar sobre sua empresa" text="Conte o que você precisa. A Zenfy analisa seu cenário e entra em contato para entender o próximo passo." />
      <section className="mx-auto max-w-3xl px-5 py-16"><ContactForm /></section>
    </main>
  );
}
