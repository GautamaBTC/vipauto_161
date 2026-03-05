"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { adaptRevealVarsForMobile, REVEAL_CONFIG } from "@/lib/revealConfig";

type GsapVars = Record<string, unknown>;

type RevealConfig = {
  from: GsapVars;
  to: GsapVars;
  duration?: number;
  delay?: number;
  ease?: string;
  threshold?: number;
  once?: boolean;
  onReveal?: () => void;
};

export function useReveal(ref: RefObject<HTMLElement | null>, config: RevealConfig): boolean {
  const gsap = useGSAP();
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const playedRef = useRef(false);

  const {
    from,
    to,
    duration = REVEAL_CONFIG.defaultDuration,
    delay = 0,
    ease = REVEAL_CONFIG.defaultEase,
    threshold = REVEAL_CONFIG.defaultThreshold,
    once = true,
    onReveal,
  } = config;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const isMobile = window.matchMedia(REVEAL_CONFIG.mobileQuery).matches;

    const showImmediately = () => {
      gsap.set(node, { ...to, clearProps: "visibility" });
      node.classList.add("is-revealed");
      setRevealed(true);
      onReveal?.();
      playedRef.current = true;
    };

    if (reduced || isMobile) {
      showImmediately();
      return;
    }

    const fromVars = isMobile ? adaptRevealVarsForMobile(from) : from;
    const toVars = isMobile ? adaptRevealVarsForMobile(to) : to;
    const durationValue = isMobile ? duration * REVEAL_CONFIG.mobileDurationMultiplier : duration;

    const run = () => {
      if (once && playedRef.current) return;
      tweenRef.current?.kill();
      gsap.set(node, fromVars);
      tweenRef.current = gsap.to(node, {
        ...toVars,
        duration: durationValue,
        delay,
        ease,
        onStart: () => {
          node.classList.add("is-revealed");
        },
        onComplete: () => {
          setRevealed(true);
          onReveal?.();
        },
      });
      playedRef.current = true;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          if (once) observer.disconnect();
        } else if (!once) {
          playedRef.current = false;
          setRevealed(false);
        }
      },
      { threshold },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      tweenRef.current?.kill();
    };
  }, [delay, duration, ease, from, gsap, onReveal, once, reduced, ref, threshold, to]);

  return revealed;
}
