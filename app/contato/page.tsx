import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";
export const metadata=pageMeta("Contato","Fale com a Zenfy e solicite uma análise gratuita da sua empresa.","/contato");
export default function Contato(){return <main><PageHero title="Vamos conversar sobre sua empresa." text="Conte o que você precisa. A Zenfy analisa o cenário e usa essas informações para entender o próximo passo."/><section className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-24"><ContactForm/></section></main>}
