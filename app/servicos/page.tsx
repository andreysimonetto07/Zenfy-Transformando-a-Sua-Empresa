import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import CtaBanner from "@/components/CtaBanner";
import { services } from "@/lib/services";
import { pageMeta } from "@/lib/seo";
export const metadata=pageMeta("Serviços","Sites, landing pages, desenvolvimento web, tráfego pago, automações, criativos, copywriting e consultoria digital.","/servicos");
export default function Servicos(){return <main><PageHero title="Soluções digitais para tirar sua empresa do improviso." text="Do site ao sistema interno, a Zenfy cria estruturas digitais pensadas para credibilidade, organização e crescimento."/><section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24"><div className="grid gap-5 lg:grid-cols-2">{services.map(s=><ServiceCard key={s.title} s={s}/>)}</div></section><CtaBanner/></main>}
