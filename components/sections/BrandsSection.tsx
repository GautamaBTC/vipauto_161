"use client";

import { useMemo, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { brands } from "@/data/brands";

export function BrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    from: { y: 40, autoAlpha: 0 },
    duration: 0.4,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".brand-chip",
    from: { scale: 0, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1 },
    stagger: { each: 0.04, from: "center" },
    duration: 0.4,
    observe: false,
    revealed: isSectionRevealed,
  });

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((brand) => brand.name.toLowerCase().includes(q));
  }, [query]);

  const chinaCount = brands.filter((brand) => brand.group === "china").length;

  return (
    <section ref={sectionRef} className="reveal-section section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">С какими марками работаем</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-400 md:text-lg">
          Европейские, корейские, японские, американские, российские и китайские автомобили. Подбираем точное решение
          под платформу и электронику конкретной модели.
        </p>

        <details className="mt-8 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
          <summary className="cursor-pointer list-none px-5 py-4 md:px-6 md:py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">Каталог марок</p>
                <p className="mt-1 text-base text-zinc-200 md:text-lg">
                  {`Открыть полный список (${brands.length} марок, из них ${chinaCount} популярных китайских)`}
                </p>
              </div>
              <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-300">
                Развернуть
              </span>
            </div>
          </summary>

          <div className="border-t border-zinc-800/80 px-5 pb-5 pt-4 md:px-6 md:pb-6">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">Найти свою марку</span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Например: Chery, Haval, Toyota, BMW..."
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[var(--accent)] focus:outline-none"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2.5 md:gap-3">
              {filteredBrands.map((brand) => (
                <span
                  key={brand.id}
                  className="brand-chip rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest"
                  style={{
                    color: brand.color,
                    borderColor: `${brand.color}66`,
                    backgroundColor: `${brand.color}12`,
                    boxShadow: `0 0 0 1px ${brand.color}22 inset`,
                  }}
                >
                  {brand.name}
                </span>
              ))}
            </div>

            {!filteredBrands.length ? (
              <p className="mt-4 text-sm text-zinc-400">Марка не найдена: оставьте заявку, проверим совместимость по VIN.</p>
            ) : null}
          </div>
        </details>
      </div>
    </section>
  );
}

