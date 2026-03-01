import { gsap } from "gsap";

export const EASE = {
  elastic: "elastic.out(1.2, 0.5)",
  expo: "expo.out",
  smooth: "power2.out",
  smoothIn: "power2.in",
  bounce: "back.out(2)",
} as const;

export const DURATION = {
  morph: 0.55,
  morphPhase1: 0.2,
  morphPhase2: 0.35,
  menu: 0.45,
  stagger: 0.07,
  staggerReverse: 0.04,
  item: 0.55,
  itemExit: 0.25,
  footer: 0.45,
} as const;

export function createBurgerTimeline(top: HTMLElement, mid: HTMLElement, bot: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });

  tl.to(top, { y: 8, duration: DURATION.morphPhase1, ease: "power3.inOut" }, 0);
  tl.to(bot, { y: -8, duration: DURATION.morphPhase1, ease: "power3.inOut" }, 0);
  tl.to(mid, { scaleX: 0, opacity: 0, duration: DURATION.morphPhase1 * 0.8, ease: "power2.in" }, 0.05);

  tl.to(
    top,
    { rotation: 50, backgroundColor: "#dc2626", duration: DURATION.morphPhase2, ease: EASE.elastic },
    DURATION.morphPhase1 - 0.05,
  );
  tl.to(
    bot,
    { rotation: -50, backgroundColor: "#dc2626", duration: DURATION.morphPhase2, ease: EASE.elastic },
    DURATION.morphPhase1 - 0.05,
  );

  tl.to(
    [top, bot],
    {
      boxShadow: "0 0 8px rgba(220,38,38,0.5), 0 0 25px rgba(220,38,38,0.2)",
      duration: 0.3,
      ease: "power1.out",
    },
    DURATION.morphPhase1 + 0.15,
  );

  return tl;
}

export function createMenuTimeline(
  overlay: HTMLElement,
  items: HTMLElement[],
  divider: HTMLElement | null,
  footer: HTMLElement | null,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.expo } });

  tl.fromTo(
    overlay,
    {
      clipPath: "circle(0% at calc(100% - 44px) 40px)",
      opacity: 1,
      visibility: "visible",
    },
    {
      clipPath: "circle(150% at calc(100% - 44px) 40px)",
      duration: DURATION.menu + 0.2,
      ease: "power3.inOut",
    },
    0,
  );

  tl.fromTo(
    items,
    { y: 40, opacity: 0, scale: 0.9, rotateX: -15 },
    { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: DURATION.item, stagger: DURATION.stagger, ease: EASE.expo },
    0.15,
  );

  if (divider) {
    tl.fromTo(divider, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.4, ease: EASE.expo }, 0.4);
  }

  if (footer) {
    tl.fromTo(footer, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: DURATION.footer, ease: EASE.expo }, 0.45);
  }

  return tl;
}
