"use client";

const previews=[
  {title:"Climatização",tag:"Serviços locais",url:"https://preview-climatizacao.vercel.app/",text:"Página focada em orçamento, confiança e atendimento rápido."},
  {title:"Estética & Beleza",tag:"Beleza",url:"https://preview-estetica-beleza.vercel.app/",text:"Visual elegante para serviços, procedimentos e agendamentos."},
  {title:"Móveis Planejados",tag:"Interiores · Modelo 01",url:"https://preview-moveis-planejados.vercel.app/",text:"Projeto para apresentar ambientes e gerar pedidos de orçamento."},
  {title:"Móveis Planejados",tag:"Interiores · Modelo 02",url:"https://silveira-moveis-planejados-preview.vercel.app/",text:"Outra direção visual para empresas de móveis e projetos sob medida."},
  {title:"Automotivo",tag:"Automóveis",url:"https://preview-automotivo.vercel.app/",text:"Experiência forte para estética automotiva e serviços especializados."},
  {title:"Energia Solar",tag:"Energia",url:"https://preview-energia-solar.vercel.app/",text:"Estrutura comercial para explicar economia, benefícios e captar contatos."},
];

export default function ClientShowcaseGallery(){
  return <section className="mt-10">
    <div className="max-w-3xl">
      <p className="eyebrow">Inspire-se</p>
      <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Veja estilos que a Zenfy pode criar para sua empresa.</h2>
      <p className="mt-3 leading-relaxed text-zinc-600">Essas demonstrações ajudam você a visualizar possibilidades. Não precisa ser do mesmo nicho: se gostar da estrutura ou do estilo, a Zenfy adapta a ideia para a sua empresa.</p>
    </div>

    <div className="mt-7 grid gap-6 lg:grid-cols-2">
      {previews.map((preview,index)=>{
        const message=`Olá Andrey! Sou cliente da Zenfy e vi no portal a demonstração "${preview.title} - ${preview.tag}". Gostei desse estilo e quero conversar sobre algo parecido para minha empresa.`;
        const whatsapp=`https://wa.me/5545998406220?text=${encodeURIComponent(message)}`;

        return <article key={preview.url} className="group overflow-hidden rounded-[1.7rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl">
          <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300"/>
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300"/>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300"/>
              <span className="ml-2 truncate rounded-full bg-white px-3 py-1 text-[10px] font-bold text-zinc-400">Demonstração Zenfy · {String(index+1).padStart(2,"0")}</span>
            </div>
          </div>

          <div className="relative h-[270px] overflow-hidden bg-[#eef3fb]">
            <iframe
              src={preview.url}
              title={`Preview ${preview.title} ${preview.tag}`}
              loading="lazy"
              tabIndex={-1}
              className="pointer-events-none absolute left-0 top-0 h-[900px] w-[1440px] origin-top-left scale-[.48] border-0 sm:scale-[.52]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06114f]/10 via-transparent to-transparent"/>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[.14em] text-brand">{preview.tag}</p>
            <h3 className="mt-1.5 text-2xl font-black tracking-[-0.03em] text-[#09113f]">{preview.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{preview.text}</p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <a href={preview.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost flex-1">Ver demonstração ↗</a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1">Quero algo nesse estilo</a>
            </div>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
