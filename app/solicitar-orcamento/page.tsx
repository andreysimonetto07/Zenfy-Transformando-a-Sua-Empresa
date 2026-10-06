import Link from "next/link";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata=pageMeta(
  "Pedir orçamento",
  "Fale com a Zenfy pelo WhatsApp e peça um orçamento personalizado para sua empresa.",
  "/solicitar-orcamento"
);

const options=[
  {
    title:"Site ou Landing Page",
    text:"Para apresentar sua empresa, serviços, ofertas e transformar visitas em contatos.",
    contact:"Andrey",
    phone:"5545998406220",
    message:"Olá Andrey! Vi o site da Zenfy e quero pedir um orçamento para um site ou landing page para minha empresa. Quero explicar o que preciso.",
  },
  {
    title:"Sistema ou Automação",
    text:"Para organizar processos, criar painéis, integrações ou reduzir tarefas manuais.",
    contact:"Andrey",
    phone:"5545998406220",
    message:"Olá Andrey! Vi o site da Zenfy e quero pedir um orçamento para um sistema ou automação para minha empresa. Quero explicar o que preciso.",
  },
  {
    title:"Tráfego Pago",
    text:"Para anunciar, gerar novas oportunidades e acompanhar os resultados das campanhas.",
    contact:"Pedro",
    phone:"554598122270",
    message:"Olá Pedro! Vi o site da Zenfy e quero pedir um orçamento para tráfego pago para minha empresa. Quero explicar meu objetivo e entender como vocês podem ajudar.",
  },
  {
    title:"Ainda não sei o que preciso",
    text:"Explique o objetivo da sua empresa e a Zenfy ajuda a identificar o caminho mais adequado.",
    contact:"Andrey",
    phone:"5545998406220",
    message:"Olá Andrey! Vi o site da Zenfy e quero melhorar a presença digital da minha empresa, mas ainda não sei exatamente qual solução preciso. Posso te explicar meu cenário?",
  },
];

export default async function SolicitarOrcamento({searchParams}:{searchParams:Promise<{servico?:string}>}) {
  const params=await searchParams;
  const requested=(params.servico||"").trim();

  const matched=requested
    ? options.find(option=>option.title.toLocaleLowerCase("pt-BR").includes(requested.toLocaleLowerCase("pt-BR")) || requested.toLocaleLowerCase("pt-BR").includes(option.title.toLocaleLowerCase("pt-BR")))
    : null;

  const customMessage=requested
    ? `Olá ${matched?.contact||"Andrey"}! Vi no site da Zenfy a solução "${requested}" e quero pedir um orçamento personalizado para minha empresa. Quero explicar o que preciso.`
    : "";

  const customPhone=matched?.phone||"5545998406220";

  return <main>
    <PageHero
      title="Orçamento sob medida para o que sua empresa precisa."
      text="Cada empresa recebe um orçamento personalizado. Você explica o que quer melhorar e a Zenfy entende o cenário antes de montar uma proposta."
    />

    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
      {requested&&<div className="mb-6 rounded-[1.5rem] border border-blue-200 bg-blue-50/70 p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div>
          <p className="eyebrow">Você veio por uma solução específica</p>
          <h2 className="mt-2 text-xl font-black text-[#09113f]">{requested}</h2>
          <p className="mt-1 text-sm text-zinc-600">Abra o WhatsApp e explique o que você quer para sua empresa.</p>
        </div>
        <a
          href={`https://wa.me/${customPhone}?text=${encodeURIComponent(customMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-4 w-full sm:mt-0 sm:w-auto"
        >
          Pedir orçamento no WhatsApp
        </a>
      </div>}

      <div className="mb-7 max-w-3xl">
        <p className="eyebrow">Escolha por onde começar</p>
        <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Conte o que você quer para sua empresa.</h2>
        <p className="mt-3 leading-relaxed text-zinc-600">Escolha o assunto mais próximo do que você procura. O WhatsApp abre com uma mensagem pronta e você explica os detalhes. A proposta é montada depois dessa conversa, de forma personalizada.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {options.map((option,index)=>{
          const href=`https://wa.me/${option.phone}?text=${encodeURIComponent(option.message)}`;
          return <article key={option.title} className="surface group p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient text-sm font-black text-white shadow-md">{String(index+1).padStart(2,"0")}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[.1em] text-emerald-700">WhatsApp</span>
            </div>
            <h3 className="mt-5 text-2xl font-black tracking-[-0.03em] text-[#09113f]">{option.title}</h3>
            <p className="mt-2 min-h-[48px] text-sm leading-relaxed text-zinc-600">{option.text}</p>
            <p className="mt-4 text-xs font-bold text-zinc-400">Atendimento inicial com {option.contact}</p>
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full">Pedir orçamento →</a>
          </article>;
        })}
      </div>

      <div className="mt-7 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-black text-[#09113f]">Já é cliente da Zenfy?</p>
          <p className="mt-1 text-sm text-zinc-500">Entre no seu portal para acompanhar campanhas, projetos, atualizações e resultados da sua empresa.</p>
        </div>
        <Link href="/login" className="btn btn-ghost mt-4 w-full sm:mt-0 sm:w-auto">Entrar no portal</Link>
      </div>
    </section>
  </main>;
}
