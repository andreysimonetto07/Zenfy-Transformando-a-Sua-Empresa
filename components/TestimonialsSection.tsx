import type { Testimonial } from "@/types/portfolio";

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="border-y border-zinc-100 bg-[#f8fbff]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow">Prova social</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-[#09113f] sm:text-4xl">O que clientes reais dizem sobre o trabalho.</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article key={t.id} className="surface p-6">
              {t.rating ? <p className="text-sm tracking-[.16em] text-amber-500">{"★".repeat(t.rating)}</p> : null}
              <blockquote className="mt-4 text-base leading-relaxed text-zinc-700">“{t.quote}”</blockquote>
              <div className="mt-6 border-t border-zinc-100 pt-4">
                <p className="font-black text-[#09113f]">{t.name}</p>
                <p className="text-sm text-zinc-500">{[t.role,t.company].filter(Boolean).join(" · ")}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
