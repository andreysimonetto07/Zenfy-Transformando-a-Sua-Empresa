import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";
import { BUSINESS_CONTACTS, whatsappHref } from "@/lib/contact";

export const metadata = pageMeta("Contato", "Fale com Andrey Simoneto ou Pedro Henrique pelo WhatsApp ou formulário da Zenfy e peça um orçamento para sua empresa.", "/contato");

export default function Contato() {
  return <main>
    <PageHero title="Vamos conversar sobre sua empresa." text="Conte seu objetivo, tire dúvidas ou peça um orçamento personalizado. Escolha o canal que funciona melhor para você." />
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-20">
      <div className="mb-10 grid gap-5 md:grid-cols-2">
        {BUSINESS_CONTACTS.map(contact => <article key={contact.whatsapp} className="surface min-w-0 p-6">
          <p className="eyebrow">WhatsApp</p>
          <h2 className="mt-2 text-xl font-black text-[#09113f]">{contact.name}</h2>
          <p className="mt-2 min-h-[42px] text-sm leading-relaxed text-zinc-600">{contact.role}</p>
          <p className="mt-3 text-sm font-semibold text-zinc-500">{contact.phone}</p>
          <a href={whatsappHref(`Olá ${contact.name}! Vi o site da Zenfy e quero conversar sobre o que minha empresa precisa e pedir um orçamento personalizado.`, contact)} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full">Falar pelo WhatsApp →</a>
        </article>)}
      </div>
      <h2 className="mb-2 text-2xl font-black tracking-[-0.03em] text-[#09113f]">Prefere deixar uma mensagem?</h2>
      <p className="mb-6 text-sm leading-relaxed text-zinc-600">Preencha o formulário. A equipe receberá sua solicitação e retornará pelo contato informado.</p>
      <ContactForm />
    </section>
  </main>;
}
