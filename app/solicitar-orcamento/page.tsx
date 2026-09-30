import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";
export const metadata=pageMeta("Solicitar análise gratuita","Solicite uma análise gratuita da presença digital da sua empresa com a Zenfy.","/solicitar-orcamento");
export default function SolicitarOrcamento(){return <main><PageHero title="Solicite uma análise gratuita da sua empresa." text="Mostre onde sua empresa está hoje e o que você quer melhorar. A partir disso, a Zenfy consegue propor uma direção mais concreta."/><section className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-24"><ContactForm/></section></main>}
