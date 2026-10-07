import Link from "next/link";
import ClientShowcaseGallery from "@/components/ClientShowcaseGallery";
import { requireClientPortal } from "@/lib/client-portal";
import { BUSINESS_CONTACT, whatsappHref } from "@/lib/contact";

export default async function InspiracoesPage(){
  const { company } = await requireClientPortal();
  const companyName=company?.name||"sua empresa";
  const message=`Olá ${BUSINESS_CONTACT.name}! Sou cliente da Zenfy e quero entender qual estrutura faz mais sentido para ${companyName}: uma Landing Page ou um Site Completo. Pode me orientar?`;
  const whatsapp=whatsappHref(message);

  return <div className="mx-auto max-w-7xl">
    <section className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-6 text-white shadow-2xl shadow-blue-950/10 sm:p-8 lg:p-10">
      <div className="absolute inset-0 zenfy-dark-art opacity-80"/>
      <div className="relative max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Sites & Inspirações</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-5xl">Veja na prática o que a Zenfy pode construir para sua empresa.</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-blue-50/78 sm:text-lg">Antes de escolher um modelo, entenda a diferença entre uma Landing Page e um Site Completo. Depois, explore demonstrações reais e encontre um estilo que combine com {companyName}.</p>
      </div>
    </section>

    <section className="mt-6">
      <div className="mb-4">
        <p className="eyebrow">Entenda em menos de 1 minuto</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#09113f]">Landing Page ou Site Completo?</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="relative overflow-hidden rounded-[1.7rem] border border-blue-200 bg-white p-6 shadow-lg shadow-blue-950/5 sm:p-7">
          <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-300/15 blur-3xl"/>
          <div className="relative">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-brand">Focada em conversão</span>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Landing Page</h3>
            <p className="mt-3 leading-relaxed text-zinc-600">É uma página criada com um objetivo principal: fazer a pessoa pedir orçamento, chamar no WhatsApp, se cadastrar ou comprar.</p>

            <div className="mt-5 grid gap-2 text-sm">
              <Row text="Ideal para campanhas de Meta Ads e Google Ads"/>
              <Row text="Mensagem direta e uma ação principal"/>
              <Row text="Carregamento rápido e foco no celular"/>
              <Row text="Ótima para testar uma oferta ou serviço"/>
            </div>

            <div className="mt-6 rounded-2xl bg-blue-50/70 p-4">
              <p className="text-xs font-black uppercase tracking-[.12em] text-brand">Exemplo simples</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">Anúncio de climatização → cliente entra na página → entende o serviço → vê prova/confiança → chama no WhatsApp para orçamento.</p>
            </div>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-[1.7rem] border border-violet-200 bg-white p-6 shadow-lg shadow-blue-950/5 sm:p-7">
          <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-violet-300/15 blur-3xl"/>
          <div className="relative">
            <span className="inline-flex rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">Presença digital completa</span>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Site Completo</h3>
            <p className="mt-3 leading-relaxed text-zinc-600">É uma estrutura maior para apresentar toda a empresa. Pode ter várias páginas, serviços, portfólio, sobre, contato e outras áreas.</p>

            <div className="mt-5 grid gap-2 text-sm">
              <Row text="Melhor para fortalecer a marca e autoridade"/>
              <Row text="Pode apresentar vários serviços e produtos"/>
              <Row text="Permite páginas como Sobre, Projetos e Contato"/>
              <Row text="Pode crescer junto com a empresa"/>
            </div>

            <div className="mt-6 rounded-2xl bg-violet-50/70 p-4">
              <p className="text-xs font-black uppercase tracking-[.12em] text-violet-700">Exemplo simples</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">A pessoa pesquisa sua empresa → entra no site → conhece a marca → vê serviços e projetos → entende a diferença da empresa → entra em contato.</p>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-[1.5rem] border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-black text-[#09113f]">Ainda não sabe qual escolher?</p>
          <p className="mt-1 text-sm text-zinc-500">A Zenfy pode analisar seu objetivo e indicar a estrutura mais adequada sem complicar.</p>
        </div>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary shrink-0">Quero uma recomendação</a>
      </div>
    </section>

    <ClientShowcaseGallery />

    <section className="mt-8 rounded-[2rem] bg-[#06114f] p-6 text-white sm:p-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-cyan-100">Não precisa copiar um modelo</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] sm:text-3xl">Gostou de partes diferentes? A Zenfy pode criar algo próprio para sua empresa.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-blue-50/70">Você pode gostar do visual de um projeto, da estrutura de outro e de uma seção específica de outro. Isso serve como referência; o projeto final pode ser construído sob medida.</p>
        </div>
        <Link href="/cliente/projetos" className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/15">Ver meus projetos →</Link>
      </div>
    </section>
  </div>;
}

function Row({text}:{text:string}){
  return <div className="flex items-start gap-2 rounded-xl bg-zinc-50 px-3 py-2.5"><span className="mt-0.5 font-black text-brand">✓</span><span className="font-semibold text-zinc-600">{text}</span></div>;
}
