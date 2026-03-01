import { Magnetic } from "@/components/effects/Magnetic";
import { TypeWriter } from "@/components/effects/TypeWriter";
import { siteConfig } from "@/lib/siteConfig";

export function HeroSection() {
  return (
    <section id="top" className="section-padding pt-24 sm:pt-28">
      <div className="container-shell">
        <div className="card-surface relative overflow-hidden p-7 sm:p-10">
          <div className="relative grid gap-7 lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                <span className="accent-dot" />
                Шахты • с 2016 года • рейтинг {siteConfig.rating}
              </p>
              <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                {siteConfig.brand}: {siteConfig.specialization}
              </h1>
              <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">
                Премиальный центр автоэлектрики. Диагностика, StarLine, автосвет, кодирование блоков и сложные
                электрические случаи.
              </p>
              <div className="mt-4 inline-flex items-center rounded-full border border-[#0066cc66] bg-[#0066cc1a] px-3 py-1 text-xs font-semibold text-[#a7ccff]">
                Официальный дилер StarLine
              </div>
              <p className="mt-5 text-sm text-[var(--text-secondary)]">
                <TypeWriter words={["заряжаем ваш автомобиль", "делаем сложную электрику понятной", "работаем точно и аккуратно"]} />
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Magnetic>
                  <a
                    href={siteConfig.social.whatsapp}
                    className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold transition hover:brightness-110"
                  >
                    Записаться в WhatsApp
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={siteConfig.social.telegram}
                    className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                  >
                    Написать в Telegram
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
