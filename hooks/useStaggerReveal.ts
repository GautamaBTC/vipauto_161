"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { adaptRevealVarsForMobile, REVEAL_CONFIG } from "@/lib/revealConfig";

type GsapVars = Record<string, unknown>;

type StaggerRevealConfig = {
  childSelector: string;
  from: GsapVars;
  to: GsapVars;
  stagger?: number | Record<string, unknown>;
  duration?: number;
  ease?: string;
  threshold?: number;
  once?: boolean;
  observe?: boolean;
  revealed?: boolean;
};

export function useStaggerReveal(ref: RefObject<HTMLElement | null>, config: StaggerRevealConfig): void {
  const gsap = useGSAP();
  const reduced = useReducedMotion();
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const playedRef = useRef(false);

  const {
    childSelector,
    from,
    to,
    stagger = 0.1,
    duration = REVEAL_CONFIG.defaultDuration,
    ease = REVEAL_CONFIG.defaultEase,
    threshold = REVEAL_CONFIG.defaultThreshold,
    once = true,
    observe = true,
    revealed = false,
  } = config;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const isMobile = window.matchMedia(REVEAL_CONFIG.mobileQuery).matches;

    const children = Array.from(container.querySelectorAll<HTMLElement>(childSelector));
    if (!children.length) return;

    const showImmediately = () => {
      gsap.set(children, { ...to, clearProps: "visibility,transform,opacity,filter" });
      playedRef.current = true;
    };

    if (reduced) {
      container.classList.add("is-revealed");
      showImmediately();
      return;
    }

    if (isMobile) {
      children.forEach((child, index) => {
        child.classList.add("mobile-stagger-item");
        child.style.setProperty("--stagger-index", String(index));
      });

      const activate = () => {
        if (once && playedRef.current) return;
        container.classList.add("is-revealed", "mobile-stagger-active");
        playedRef.current = true;
      };

      if (!observe) {
        if (revealed) activate();
        else {
          playedRef.current = false;
          container.classList.remove("mobile-stagger-active");
        }
        return () => {
          children.forEach((child) => child.style.removeProperty("--stagger-index"));
        };
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            activate();
            if (once) observer.disconnect();
          } else if (!once) {
            playedRef.current = false;
            container.classList.remove("mobile-stagger-active");
          }
        },
        { threshold },
      );

      observer.observe(container);

      return () => {
        observer.disconnect();
        children.forEach((child) => child.style.removeProperty("--stagger-index"));
      };
    }

    const fromVars = isMobile ? adaptRevealVarsForMobile(from) : from;
    const toVars = isMobile ? adaptRevealVarsForMobile(to) : to;
    const durationValue = isMobile ? duration * REVEAL_CONFIG.mobileDurationMultiplier : duration;

    const run = () => {
      if (once && playedRef.current) return;
      tweenRef.current?.kill();
      gsap.set(children, fromVars);
      tweenRef.current = gsap.to(children, {
        ...toVars,
        duration: durationValue,
        ease,
        stagger,
      });
      playedRef.current = true;
    };

    if (!observe) {
      if (revealed) run();
      return () => {
        tweenRef.current?.kill();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          if (once) observer.disconnect();
        } else if (!once) {
          playedRef.current = false;
        }
      },
      { threshold },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      tweenRef.current?.kill();
    };
  }, [
    childSelector,
    duration,
    ease,
    from,
    gsap,
    observe,
    once,
    reduced,
    ref,
    revealed,
    stagger,
    threshold,
    to,
  ]);
}
