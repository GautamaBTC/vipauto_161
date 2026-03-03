"use client";

import { useRef } from "react";
import { ClipboardCheck, CircleDollarSign, Crown, Handshake, ScanLine, Warehouse, Wrench, Zap } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { ComparisonCard } from "@/components/comparison/ComparisonCard";
import { ComparisonItem } from "@/components/comparison/ComparisonItem";

const garageItems = [
  {
    icon: <Wrench className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "\u0417\u0430\u043C\u0435\u043D\u0430 \u0434\u0435\u0442\u0430\u043B\u0435\u0439 \u0431\u0435\u0437 \u043F\u043E\u0438\u0441\u043A\u0430 \u043F\u0435\u0440\u0432\u043E\u043F\u0440\u0438\u0447\u0438\u043D\u044B",
  },
  {
    icon: <CircleDollarSign className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "\u041D\u0435\u044F\u0441\u043D\u044B\u0435 \u0441\u0440\u043E\u043A\u0438 \u0438 \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043F\u043E \u0444\u0430\u043A\u0442\u0443",
  },
  {
    icon: <Zap className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "\u041D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043D\u0430 \u0441\u043B\u043E\u0436\u043D\u043E\u0439 \u044D\u043B\u0435\u043A\u0442\u0440\u0438\u043A\u0435",
  },
] as const;

const vipItems = [
  {
    icon: <ScanLine className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "\u0414\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0430 \u0446\u0435\u043F\u0435\u0439 \u0438 \u0431\u043B\u043E\u043A\u043E\u0432 \u043F\u043E\u0434 \u043D\u0430\u0433\u0440\u0443\u0437\u043A\u043E\u0439",
  },
  {
    icon: <Handshake className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0435 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E \u0441\u0442\u0430\u0440\u0442\u0430 \u0440\u0435\u043C\u043E\u043D\u0442\u0430",
  },
  {
    icon: <ClipboardCheck className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0432\u044B\u0434\u0430\u0447\u0435\u0439 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044F",
  },
] as const;

export function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.CLIP_BOTTOM,
    from: { clipPath: "inset(100% 0 0 0)", autoAlpha: 0.02 },
    to: { clipPath: "inset(0% 0 0 0)", autoAlpha: 1 },
    duration: 0.8,
    threshold: 0.12,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".comparison-garage",
    from: { x: -120, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
    duration: 0.7,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".comparison-vip",
    from: { x: 120, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
    duration: 0.7,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".comparison-garage [data-comparison-item]",
    from: { y: 24, x: -20, autoAlpha: 0 },
    to: { y: 0, x: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".comparison-vip [data-comparison-item]",
    from: { y: 24, x: 20, autoAlpha: 0 },
    to: { y: 0, x: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section
      ref={sectionRef}
      id="compare"
      className="reveal-section relative mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(ellipse, rgba(0,240,255,0.08) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-1/2 h-[400px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(ellipse, rgba(204,255,0,0.1) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mb-8 text-center sm:mb-14">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-2)] sm:mb-5 sm:px-5 sm:py-2 sm:text-[13px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-badge-pulse" />
          {"\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435"}
        </div>

        <h2 className="text-[clamp(22px,5vw,44px)] font-bold leading-tight tracking-tight text-gray-100">
          <span className="text-[var(--text-secondary)]">{"\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0433\u0430\u0440\u0430\u0436"}</span>{" "}
          <span className="mx-1 text-white/20 sm:mx-2">vs</span>{" "}
          <span className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">VIP\u0410\u0432\u0442\u043E</span>
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-white/40 sm:mt-4 sm:text-[15px]">
          {"\u0427\u0435\u043C \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u043E\u0434\u0445\u043E\u0434 \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u043E\u0442 \u043F\u0440\u0438\u0432\u044B\u0447\u043D\u043E\u0433\u043E \u0440\u0435\u043C\u043E\u043D\u0442\u0430 \u0431\u0435\u0437 \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0438."}
        </p>
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-5 lg:grid-cols-[1fr_auto_1fr]">
          <ComparisonCard
            variant="garage"
            badge={"\u0413\u0430\u0440\u0430\u0436\u043D\u044B\u0439 \u043F\u043E\u0434\u0445\u043E\u0434"}
            title={"\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0433\u0430\u0440\u0430\u0436"}
            titleIcon={<Warehouse className="h-5 w-5" />}
            className="comparison-garage"
          >
            {garageItems.map((item) => (
              <ComparisonItem key={item.text} icon={item.icon} text={item.text} variant="negative" />
            ))}
          </ComparisonCard>

          <div className="flex items-center justify-center py-2 lg:py-0">
            <div className="absolute hidden h-[70%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />

            <div className="animate-float-slow relative z-10 mx-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl sm:h-14 sm:w-14 lg:mx-0">
              <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-white/10" />
              <span className="text-base font-bold tracking-tight text-white/40 sm:text-lg">vs</span>
            </div>

            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />
          </div>

          <ComparisonCard
            variant="vip"
            badge={"\u041F\u043E\u0434\u0445\u043E\u0434 VIP\u0410\u0432\u0442\u043E"}
            title={"VIP\u0410\u0432\u0442\u043E"}
            titleIcon={<Crown className="h-5 w-5" />}
            className="comparison-vip"
          >
            {vipItems.map((item) => (
              <ComparisonItem key={item.text} icon={item.icon} text={item.text} variant="positive" />
            ))}
          </ComparisonCard>
        </div>
      </div>
    </section>
  );
}
