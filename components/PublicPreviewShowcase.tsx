const projects=[
  {title:"Climatização",tag:"Serviços locais",url:"https://preview-climatizacao.vercel.app/",text:"Página comercial focada em orçamento, confiança e contato rápido."},
  {title:"Estética & Beleza",tag:"Beleza",url:"https://preview-estetica-beleza.vercel.app/",text:"Visual elegante para apresentar procedimentos, serviços e agendamentos."},
  {title:"Móveis Planejados",tag:"Interiores · Modelo 01",url:"https://preview-moveis-planejados.vercel.app/",text:"Estrutura para apresentar ambientes e transformar interesse em pedidos de orçamento."},
  {title:"Móveis Planejados",tag:"Interiores · Modelo 02",url:"https://silveira-moveis-planejados-preview.vercel.app/",text:"Uma segunda direção visual para empresas de móveis e projetos personalizados."},
  {title:"Automotivo",tag:"Automóveis",url:"https://preview-automotivo.vercel.app/",text:"Experiência forte para estética automotiva, serviços e atendimento pelo WhatsApp."},
  {title:"Energia Solar",tag:"Energia",url:"https://preview-energia-solar.vercel.app/",text:"Página comercial para explicar economia, benefícios e captar novos contatos."},
];

export default function PublicPreviewShowcase(){
  return <section className="border-y border-zinc-100 bg-[#f8fbff]">
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">Demonstrações da Zenfy</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl lg:text-5xl">Veja na prática alguns estilos que podemos construir.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-zinc-600">Estes modelos demonstrativos apresentam possibilidades de design e estrutura. Abra uma demonstração, navegue pelo projeto e use como referência para explicar o que você gostaria de ter na sua empresa.</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-500 shadow-sm lg:max-w-xs">
          <strong className="text-[#09113f]">Landing Page ou Site?</strong><br/>
          Se você ainda não sabe a diferença, a Zenfy te orienta de acordo com seu objetivo.
        </div>
      </div>

      <div className="mt-9 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project,index)=>{
          const message=`Olá Andrey! Vi no site da Zenfy a demonstração "${project.title} - ${project.tag}". Gostei desse estilo e quero entender como ficaria algo parecido para minha empresa.`;
          const whatsapp=`https://wa.me/5545998406220?text=${encodeURIComponent(message)}`;

          return <article key={project.url} className="group overflow-hidden rounded-[1.7rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/10">
            <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300"/>
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300"/>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300"/>
                <span className="ml-2 truncate rounded-full bg-white px-3 py-1 text-[10px] font-bold text-zinc-400">Demonstração · {String(index+1).padStart(2,"0")}</span>
              </div>
            </div>

            <div className="relative h-[235px] overflow-hidden bg-[#eef3fb]">
              <iframe
                src={project.url}
                title={`Projeto ${project.title} ${project.tag}`}
                loading="lazy"
                tabIndex={-1}
                className="pointer-events-none absolute left-0 top-0 h-[900px] w-[1440px] origin-top-left scale-[.43] border-0 sm:scale-[.46]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06114f]/10 via-transparent to-transparent"/>
            </div>

            <div className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-brand">{project.tag}</p>
              <h3 className="mt-1.5 text-xl font-black tracking-[-0.03em] text-[#09113f]">{project.title}</h3>
              <p className="mt-2 min-h-[42px] text-sm leading-relaxed text-zinc-500">{project.text}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Ver projeto ↗</a>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Quero algo assim</a>
              </div>
            </div>
          </article>;
        })}
      </div>

      <div className="mt-7 flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-[#06114f] p-5 text-white sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="font-black">Gostou de partes de projetos diferentes?</p>
          <p className="mt-1 text-sm text-blue-50/70">A referência serve para orientar. O projeto final pode misturar ideias e ser construído sob medida para sua empresa.</p>
        </div>
        <a href="https://wa.me/5545998406220?text=Olá%20Andrey!%20Vi%20os%20projetos%20no%20site%20da%20Zenfy%20e%20quero%20conversar%20sobre%20um%20site%20ou%20landing%20page%20para%20minha%20empresa." target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#09113f] transition hover:-translate-y-0.5">Falar sobre meu projeto →</a>
      </div>
    </div>
  </section>;
}
