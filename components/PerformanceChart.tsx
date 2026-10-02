type Point = { label:string; value:number };

export default function PerformanceChart({
  title,
  description,
  data,
  format="number",
}:{
  title:string;
  description?:string;
  data:Point[];
  format?:"number"|"currency"|"percent";
}) {
  const clean=data.length?data:[{label:"—",value:0}];
  const width=760, height=250, padX=34, padTop=24, padBottom=42;
  const innerW=width-padX*2, innerH=height-padTop-padBottom;
  const max=Math.max(...clean.map(d=>Number(d.value)||0),1);
  const min=0;
  const x=(i:number)=>clean.length<=1?width/2:padX+(i/(clean.length-1))*innerW;
  const y=(v:number)=>padTop+innerH-((v-min)/(max-min))*innerH;
  const points=clean.map((d,i)=>`${x(i)},${y(Number(d.value)||0)}`).join(" ");
  const area=`${padX},${padTop+innerH} ${points} ${width-padX},${padTop+innerH}`;
  const id="g"+title.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,14);

  return <section className="surface overflow-hidden p-5 sm:p-6">
    <div>
      <p className="text-lg font-black text-[#09113f]">{title}</p>
      {description&&<p className="mt-1 text-sm text-zinc-500">{description}</p>}
    </div>

    <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50/70 to-white">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={title}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1769ff" stopOpacity=".24"/>
            <stop offset="100%" stopColor="#7437ff" stopOpacity=".02"/>
          </linearGradient>
          <linearGradient id={id+"line"} x1="0" x2="1">
            <stop offset="0%" stopColor="#19d3e7"/>
            <stop offset="48%" stopColor="#1769ff"/>
            <stop offset="100%" stopColor="#8b3df4"/>
          </linearGradient>
        </defs>

        {[0,.25,.5,.75,1].map((r)=><line key={r} x1={padX} x2={width-padX} y1={padTop+innerH*r} y2={padTop+innerH*r} stroke="#dfe7f3" strokeWidth="1"/>)}
        <polygon points={area} fill={`url(#${id})`}/>
        <polyline points={points} fill="none" stroke={`url(#${id+"line"})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>

        {clean.map((d,i)=>{
          const showLabel=clean.length<=8 || i===0 || i===clean.length-1 || i%Math.max(1,Math.floor(clean.length/6))===0;
          return <g key={i}>
            <circle cx={x(i)} cy={y(Number(d.value)||0)} r="4.5" fill="#fff" stroke="#1769ff" strokeWidth="3">
              <title>{d.label}: {formatValue(d.value,format)}</title>
            </circle>
            {showLabel&&<text x={x(i)} y={height-15} textAnchor="middle" fontSize="11" fill="#8b93a7">{d.label}</text>}
          </g>;
        })}
      </svg>
    </div>
  </section>;
}

function formatValue(value:number,format:"number"|"currency"|"percent") {
  if(format==="currency")return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value);
  if(format==="percent")return value.toFixed(2)+"%";
  return new Intl.NumberFormat("pt-BR").format(value);
}
