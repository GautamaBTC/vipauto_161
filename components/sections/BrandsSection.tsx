"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { brands } from "@/data/brands";

export function BrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
    stagger: { each: 0.06, from: "center" },
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section ref={sectionRef} className="reveal-section section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">\u0421 \u043A\u0430\u043A\u0438\u043C\u0438 \u043C\u0430\u0440\u043A\u0430\u043C\u0438 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u043C</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          {"\u0415\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u0438\u0435, \u043A\u043E\u0440\u0435\u0439\u0441\u043A\u0438\u0435, \u044F\u043F\u043E\u043D\u0441\u043A\u0438\u0435 \u0438 \u043A\u0438\u0442\u0430\u0439\u0441\u043A\u0438\u0435 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u0438. \u041F\u043E\u0434\u0431\u0438\u0440\u0430\u0435\u043C \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043F\u043E\u0434 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u0443\u044E \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0443."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
          {brands.map((brand) => (
            <span
              key={brand.id}
              className="brand-chip rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
