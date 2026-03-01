"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMenuStore } from "@/hooks/useMenuStore";
import { DURATION, EASE, createBurgerTimeline, createMenuTimeline } from "@/lib/animations";

type Refs = {
  overlay: HTMLDivElement | null;
  items: HTMLAnchorElement[];
  divider: HTMLDivElement | null;
  footer: HTMLDivElement | null;
  lineTop: HTMLSpanElement | null;
  lineMid: HTMLSpanElement | null;
  lineBot: HTMLSpanElement | null;
};

export function useMenuAnimations() {
  const refs = useRef<Refs>({
    overlay: null,
    items: [],
    divider: null,
    footer: null,
    lineTop: null,
    lineMid: null,
    lineBot: null,
  });

  const burgerTl = useRef<gsap.core.Timeline | null>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const isBuilt = useRef(false);

  const isOpen = useMenuStore((s) => s.isOpen);
  const setAnimating = useMenuStore((s) => s.setAnimating);
  const prevOpen = useRef(false);

  const buildTimelines = useCallback(() => {
    const r = refs.current;
    burgerTl.current?.kill();
    menuTl.current?.kill();

    if (r.lineTop && r.lineMid && r.lineBot) burgerTl.current = createBurgerTimeline(r.lineTop, r.lineMid, r.lineBot);
    if (r.overlay && r.items.length > 0) menuTl.current = createMenuTimeline(r.overlay, r.items, r.divider, r.footer);
    isBuilt.current = true;
  }, []);

  useEffect(() => {
    if (prevOpen.current === isOpen && isBuilt.current) return;
    prevOpen.current = isOpen;

    if (!isBuilt.current) {
      const t = window.setTimeout(() => {
        buildTimelines();
        if (isOpen) playOpen();
      }, 80);
      return () => window.clearTimeout(t);
    }

    if (isOpen) playOpen();
    else playClose();

    function playOpen() {
      const bt = burgerTl.current;
      const mt = menuTl.current;
      const r = refs.current;
      if (!bt || !mt) return;

      if (r.overlay) gsap.set(r.overlay, { visibility: "visible", pointerEvents: "auto" });
      bt.play();
      mt.play();

      const dur = Math.max(bt.duration(), mt.duration());
      gsap.delayedCall(dur, () => {
        setAnimating(false);
        r.items[0]?.focus();
      });
    }

    function playClose() {
      const bt = burgerTl.current;
      const r = refs.current;
      bt?.reverse();

      const reversedItems = [...r.items].reverse();
      gsap.to(reversedItems, {
        y: -30,
        opacity: 0,
        scale: 0.95,
        duration: DURATION.itemExit,
        stagger: DURATION.staggerReverse,
        ease: EASE.smoothIn,
      });

      if (r.divider) gsap.to(r.divider, { scaleX: 0, opacity: 0, duration: 0.2, ease: EASE.smoothIn });
      if (r.footer) gsap.to(r.footer, { y: 15, opacity: 0, duration: 0.2, ease: EASE.smoothIn });

      if (r.overlay) {
        gsap.to(r.overlay, {
          clipPath: "circle(0% at calc(100% - 44px) 40px)",
          duration: 0.4,
          delay: 0.15,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(r.overlay!, { visibility: "hidden", pointerEvents: "none" });
            menuTl.current?.pause(0);
            gsap.set(r.items, { y: 40, opacity: 0, scale: 0.9, rotateX: -15 });
            if (r.divider) gsap.set(r.divider, { scaleX: 0, opacity: 0 });
            if (r.footer) gsap.set(r.footer, { y: 30, opacity: 0 });
            setAnimating(false);
          },
        });
      }
    }
  }, [isOpen, buildTimelines, setAnimating]);

  const setOverlayRef = useCallback((el: HTMLDivElement | null) => {
    refs.current.overlay = el;
    if (el) {
      gsap.set(el, {
        visibility: "hidden",
        pointerEvents: "none",
        clipPath: "circle(0% at calc(100% - 44px) 40px)",
      });
    }
  }, []);
  const addItemRef = useCallback((el: HTMLAnchorElement | null, index: number) => {
    if (el) refs.current.items[index] = el;
  }, []);
  const setDividerRef = useCallback((el: HTMLDivElement | null) => {
    refs.current.divider = el;
  }, []);
  const setFooterRef = useCallback((el: HTMLDivElement | null) => {
    refs.current.footer = el;
  }, []);
  const setLineTopRef = useCallback((el: HTMLSpanElement | null) => {
    refs.current.lineTop = el;
  }, []);
  const setLineMidRef = useCallback((el: HTMLSpanElement | null) => {
    refs.current.lineMid = el;
  }, []);
  const setLineBotRef = useCallback((el: HTMLSpanElement | null) => {
    refs.current.lineBot = el;
  }, []);

  return {
    setOverlayRef,
    addItemRef,
    setDividerRef,
    setFooterRef,
    setLineTopRef,
    setLineMidRef,
    setLineBotRef,
    buildTimelines,
  };
}
