import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import CtaBanner from "@/components/CtaBanner";
import { services } from "@/lib/services";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Serviços", "Sites, Landing Pages, desenvolvimento web, tráfego pago, automações, criativos, copywriting e consultoria digital.", "/servicos");

export default function Servicos() {
  return (
    <main>
      <PageHero title="Serviços para estruturar e fazer crescer sua empresa" text="Do site à campanha, cuidamos da estrutura digital que sustenta a geração de novas oportunidades." />
      <div className="mx-auto max-w-6xl px-5">{services.map((s) => <ServiceCard key={s.title} s={s} />)}</div>
      <CtaBanner />
    </main>
  );
}
