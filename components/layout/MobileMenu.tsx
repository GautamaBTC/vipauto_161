"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowUpRight, PhoneCall } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/cn";
import { useLockScroll } from "@/hooks/useLockScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type MenuItem = {
  id: string;
  href: string;
  label: string;
};

const MENU_ITEMS: readonly MenuItem[] = [
  { id: "services", href: "#services", label: "Услуги" },
  { id: "advantages", href: "#advantages", label: "Преимущества" },
  { id: "process", href: "#process", label: "Процесс" },
  { id: "reviews", href: "#reviews", label: "Отзывы" },
  { id: "contacts", href: "#contacts", label: "Контакты" },
] as const;

const HEADER_HEIGHT = 80;

export function MobileMenu() {
  const reduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("services");

  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const lineTopRef = useRef<HTMLSpanElement>(null);
  const lineMidRef = useRef<HTMLSpanElement>(null);
  const lineBotRef = useRef<HTMLSpanElement>(null);

  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const pendingAnchorRef = useRef<string | null>(null);

  useLockScroll(isOpen);

  const setItemRef = useCallback((index: number, el: HTMLAnchorElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  const runPendingScroll = useCallback(() => {
    const pending = pendingAnchorRef.current;
    if (!pending) return;
    pendingAnchorRef.current = null;

    const id = pending.replace("#", "");
    const node = document.getElementById(id);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const closeMenu = useCallback((href?: string) => {
    if (href) pendingAnchorRef.current = href;
    setIsOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const trapFocus = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !isOpen || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [isOpen],
  );

  useEffect(() => {
    const sections = MENU_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        closeMenu();
        return;
      }
      trapFocus(event);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, isOpen, trapFocus]);

  useEffect(() => {
    const root = rootRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const cta = ctaRef.current;
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];

    if (!root || !backdrop || !panel || !cta || !top || !mid || !bot || !items.length) return;

    gsap.killTweensOf([root, backdrop, panel, cta, top, mid, bot, ...items]);

    const setClosedIcon = () => {
      gsap.set(top, {
        y: 0,
        rotation: 0,
        width: "100%",
        autoAlpha: 1,
        boxShadow: "0 0 12px rgba(204,255,0,0.35)",
      });
      gsap.set(mid, {
        y: 0,
        rotation: 0,
        width: "72%",
        autoAlpha: 1,
        boxShadow: "0 0 12px rgba(0,240,255,0.35)",
      });
      gsap.set(bot, {
        y: 0,
        rotation: 0,
        width: "54%",
        autoAlpha: 1,
      });
    };

    if (isOpen) {
      gsap.set(root, { visibility: "visible", pointerEvents: "auto" });

      if (reduced) {
        gsap.set(panel, { yPercent: 0 });
        gsap.set(items, { x: 0, autoAlpha: 0 });
        gsap.set(cta, { autoAlpha: 0, y: 0 });

        const tl = gsap.timeline();
        tl.to(backdrop, { autoAlpha: 1, duration: 0.12, ease: "power2.out" }, 0)
          .to(items, { autoAlpha: 1, duration: 0.14, stagger: 0, ease: "power2.out" }, 0)
          .to(cta, { autoAlpha: 1, duration: 0.14, ease: "power2.out" }, 0.04);
      } else {
        gsap.set(backdrop, { autoAlpha: 0 });
        gsap.set(panel, { yPercent: -100, autoAlpha: 1 });
        gsap.set(items, {
          x: (i: number) => (i % 2 === 0 ? -60 : 60),
          autoAlpha: 0,
        });
        gsap.set(cta, { autoAlpha: 0, y: 20 });

        const tl = gsap.timeline();
        tl.to(backdrop, { autoAlpha: 1, duration: 0.18, ease: "power2.out" }, 0)
          .to(panel, { yPercent: 0, duration: 0.44, ease: "power3.out" }, 0)
          .to(
            items,
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.34,
              stagger: 0.1,
              ease: "power3.out",
            },
            0.1,
          )
          .to(
            cta,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.24,
              ease: "power3.out",
            },
            0.24,
          );
      }

      gsap.to(top, {
        y: 7,
        rotation: 42,
        width: "108%",
        transformOrigin: "50% 50%",
        duration: 0.24,
        ease: "power2.out",
        boxShadow: "0 0 14px rgba(204,255,0,0.45)",
      });
      gsap.to(mid, {
        y: -3,
        rotation: -54,
        width: "86%",
        transformOrigin: "50% 50%",
        duration: 0.24,
        ease: "power2.out",
        boxShadow: "0 0 14px rgba(0,240,255,0.45)",
      });
      gsap.to(bot, {
        autoAlpha: 0,
        x: 8,
        scaleX: 0.2,
        duration: 0.18,
        ease: "power2.inOut",
      });

      window.setTimeout(() => {
        itemRefs.current[0]?.focus();
      }, reduced ? 80 : 160);
      return;
    }

    if (reduced) {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { visibility: "hidden", pointerEvents: "none" });
          runPendingScroll();
          burgerRef.current?.focus();
        },
      });

      tl.to([items, cta], { autoAlpha: 0, duration: 0.12, stagger: 0, ease: "power2.in" }, 0).to(
        backdrop,
        { autoAlpha: 0, duration: 0.12, ease: "power2.in" },
        0,
      );

      setClosedIcon();
      return;
    }

    const closeTl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { visibility: "hidden", pointerEvents: "none" });
        runPendingScroll();
        burgerRef.current?.focus();
      },
    });

    closeTl
      .to(
        items,
        {
          x: (i: number) => (i % 2 === 0 ? -50 : 50),
          autoAlpha: 0,
          duration: 0.22,
          stagger: { each: 0.08, from: "end" },
          ease: "power2.in",
        },
        0,
      )
      .to(cta, { autoAlpha: 0, y: 16, duration: 0.18, ease: "power2.in" }, 0)
      .to(panel, { yPercent: -100, duration: 0.32, ease: "power3.in" }, 0.1)
      .to(backdrop, { autoAlpha: 0, duration: 0.22, ease: "power2.in" }, 0.1);

    setClosedIcon();
  }, [isOpen, reduced, runPendingScroll]);

  const phoneHref = useMemo(() => `tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[1200] flex h-20 items-center bg-[rgba(5,10,20,0.75)] px-5 shadow-[0_1px_0_rgba(224,230,237,0.05),0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-[20px] backdrop-saturate-[180%] md:hidden">
        <Link href="/" className="relative z-[1201] select-none" aria-label="VIPAuto161 Главная">
          <Image src="/images/plate-logo.svg" alt="VIPАвто 161" width={164} height={44} className="h-9 w-auto" priority />
        </Link>
      </header>

      <button
        ref={burgerRef}
        type="button"
        onClick={isOpen ? () => closeMenu() : openMenu}
        aria-label={isOpen ? "Закрыть мобильное меню" : "Открыть мобильное меню"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-dialog"
        className={cn(
          "fixed right-5 top-4 z-[1301] flex h-12 w-12 items-center justify-center rounded-xl md:hidden",
          "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
          "hover:shadow-[0_0_22px_rgba(0,240,255,0.24)]",
        )}
      >
        <span className="relative flex h-[20px] w-8 flex-col justify-between">
          <span
            ref={lineTopRef}
            className="block h-0.5 rounded-full"
            style={{ width: "100%", background: "var(--accent)", boxShadow: "0 0 12px rgba(204,255,0,0.35)" }}
          />
          <span
            ref={lineMidRef}
            className="ml-auto block h-0.5 rounded-full"
            style={{ width: "72%", background: "var(--accent-2)", boxShadow: "0 0 12px rgba(0,240,255,0.35)" }}
          />
          <span
            ref={lineBotRef}
            className="ml-auto block h-0.5 rounded-full"
            style={{
              width: "54%",
              background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
              boxShadow: "0 0 12px rgba(0,240,255,0.25)",
            }}
          />
        </span>
      </button>

      <div ref={rootRef} className="pointer-events-none invisible fixed inset-0 z-[1250] md:hidden" aria-hidden={!isOpen}>
        <div
          ref={backdropRef}
          className="absolute inset-0 bg-[rgba(5,10,20,0.7)] backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        />

        <div
          id="mobile-nav-dialog"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Мобильная навигация"
          className="absolute inset-0 overflow-y-auto bg-[rgba(5,10,20,0.92)] pt-[96px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
          style={{
            borderTop: "1px solid rgba(0,240,255,0.2)",
            boxShadow: "inset 0 1px 0 rgba(224,230,237,0.06)",
          }}
        >
          <div className="container-shell flex min-h-[calc(100dvh-96px)] flex-col pb-8">
            <ul className="space-y-2 pt-6">
              {MENU_ITEMS.map((item, index) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      ref={(el) => setItemRef(index, el)}
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        closeMenu(item.href);
                      }}
                      className={cn(
                        "group relative flex items-center gap-4 rounded-2xl px-3 py-4",
                        "transition-colors duration-200 hover:bg-[var(--bg-secondary)]/45",
                        isActive ? "bg-[var(--bg-secondary)]/50" : "bg-transparent",
                      )}
                    >
                      <span
                        className={cn(
                          "text-3xl font-bold leading-none text-[var(--text-primary)] sm:text-4xl",
                          isActive ? "text-[var(--accent)]" : "",
                        )}
                        style={{ textShadow: isActive ? "0 0 18px rgba(204,255,0,0.22)" : "none" }}
                      >
                        <span className="bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-primary)] bg-clip-text text-transparent transition-all duration-300 group-hover:from-[var(--accent)] group-hover:to-[var(--accent-2)]">
                          {item.label}
                        </span>
                      </span>

                      <span className="ml-auto h-px w-12 bg-[var(--line)] transition-all duration-300 group-hover:w-20 group-hover:bg-[var(--accent-2)]/65" />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div ref={ctaRef} className="mt-auto pt-8">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-secondary)]/50 p-4 backdrop-blur-md">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={siteConfig.social.whatsapp}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#050A14] shadow-[0_0_20px_rgba(204,255,0,0.26)] transition-all duration-200 hover:shadow-[0_0_28px_rgba(204,255,0,0.35)]"
                  >
                    WhatsApp
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <a
                    href={siteConfig.social.telegram}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--accent-2)]/40 bg-[rgba(0,240,255,0.08)] px-4 py-3 font-semibold text-[var(--text-primary)] shadow-[0_0_16px_rgba(0,240,255,0.18)] transition-all duration-200 hover:border-[var(--accent-2)]/70"
                  >
                    Telegram
                    <ArrowUpRight className="h-4 w-4 text-[var(--accent-2)]" />
                  </a>
                </div>

                <a
                  href={phoneHref}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)]/55 hover:text-[var(--accent)]"
                >
                  <PhoneCall className="h-4 w-4" />
                  {siteConfig.phones[0]}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: HEADER_HEIGHT }} aria-hidden />
    </>
  );
}
