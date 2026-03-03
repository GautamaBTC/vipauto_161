"use client";

import { useRef } from "react";
import { LeadForm } from "@/components/forms/LeadForm";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { siteConfig } from "@/lib/siteConfig";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.SCALE_IN,
    from: { scale: 0.92, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1 },
    duration: 0.65,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".contact-info-col",
    from: { x: -120, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
    duration: 0.6,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".contact-form-col",
    from: { x: 120, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
    duration: 0.6,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".contact-form-col .form-reveal",
    from: { y: 24, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.4,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section ref={sectionRef} id="contacts" className="reveal-section section-padding">
      <div className="container-shell">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <article className="contact-info-col card-surface rounded-xl p-6 md:p-8">
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0438 \u0437\u0430\u043F\u0438\u0441\u044C</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{siteConfig.address}</p>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{siteConfig.schedule}</p>
            <ul className="mt-6 space-y-3 text-base md:space-y-4 md:text-lg">
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="text-[var(--text-primary)]/90 transition-colors duration-200 hover:text-[var(--text-primary)]"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <a
                href={siteConfig.social.telegram}
                className="inline-flex items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-4 py-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]"
              >
                Telegram
              </a>
              <a
                href={siteConfig.social.whatsapp}
                className="inline-flex items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-4 py-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]"
              >
                WhatsApp
              </a>
              <a
                href={siteConfig.yandexMaps}
                className="inline-flex items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-4 py-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]"
              >
                {"\u042F\u043D\u0434\u0435\u043A\u0441 \u041A\u0430\u0440\u0442\u044B"}
              </a>
            </div>
          </article>
          <article className="contact-form-col card-surface rounded-xl p-6 md:p-8">
            <h3 className="form-reveal text-2xl font-semibold leading-snug md:text-3xl">\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0437\u0430\u044F\u0432\u043A\u0443</h3>
            <p className="form-reveal mt-4 text-sm leading-normal text-[var(--text-secondary)]/75">
              {"\u041E\u0442\u0432\u0435\u0442\u0438\u043C \u0432 \u0440\u0430\u0431\u043E\u0447\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0443\u0435\u043C \u0443\u0434\u043E\u0431\u043D\u0443\u044E \u0434\u0430\u0442\u0443 \u0432\u0438\u0437\u0438\u0442\u0430."}
            </p>
            <div className="form-reveal mt-6">
              <LeadForm />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
