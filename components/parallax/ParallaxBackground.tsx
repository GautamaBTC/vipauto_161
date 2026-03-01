"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ParallaxLayer {
  className: string;
  style?: React.CSSProperties;
  scrollSpeed: number;
  mouseSpeed: number;
}

const LAYERS: readonly ParallaxLayer[] = [
  {
    className: "absolute inset-0",
    style: {
      background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(30,60,120,0.45), transparent 70%)",
    },
    scrollSpeed: 0.15,
    mouseSpeed: 0.005,
  },
  {
    className: "absolute -top-1/4 left-1/4 h-[120vh] w-[120vw] rounded-full blur-3xl",
    style: {
      background: "radial-gradient(circle, rgba(56,120,200,0.18), transparent 55%)",
    },
    scrollSpeed: 0.3,
    mouseSpeed: 0.012,
  },
  {
    className: "absolute top-1/3 -right-1/4 h-[100vh] w-[100vw] rounded-full blur-3xl",
    style: {
      background: "radial-gradient(circle, rgba(100,60,180,0.14), transparent 50%)",
    },
    scrollSpeed: 0.45,
    mouseSpeed: 0.018,
  },
  {
    className: "absolute inset-0",
    style: {
      background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.015) 50%, transparent 60%)",
    },
    scrollSpeed: 0.55,
    mouseSpeed: 0.022,
  },
  {
    className: "absolute inset-0 bg-repeat mix-blend-soft-light opacity-[0.035]",
    style: {
      backgroundImage:
        "url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.85%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')",
      backgroundSize: "180px 180px",
    },
    scrollSpeed: 0.08,
    mouseSpeed: 0,
  },
];

interface ParallaxBackgroundProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  intensity?: number;
}

export function ParallaxBackground({ scrollContainerRef, intensity = 1 }: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mouseLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const setScrollLayerRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      scrollLayerRefs.current[index] = el;
    },
    [],
  );

  const setMouseLayerRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      mouseLayerRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileFactor = isMobile ? 0.45 : 1;
    const factor = intensity * mobileFactor;

    if (prefersReduced) {
      gsap.set(containerRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power2.out" });

      LAYERS.forEach((layer, i) => {
        const el = scrollLayerRefs.current[i];
        if (!el) return;

        gsap.fromTo(
          el,
          { y: 30 * layer.scrollSpeed * factor },
          {
            y: 0,
            duration: 1.8,
            delay: i * 0.12,
            ease: "power3.out",
          },
        );

        gsap.to(el, {
          y: () => layer.scrollSpeed * factor * window.innerHeight * 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            scroller: scrollContainerRef?.current ?? undefined,
            invalidateOnRefresh: true,
          },
        });
      });
    }, containerRef);

    if (!isMobile) {
      const quickSetters = LAYERS.map((layer, i) => {
        const el = mouseLayerRefs.current[i];
        if (!el || layer.mouseSpeed === 0) return null;
        return {
          xTo: gsap.quickTo(el, "x", { duration: 0.8, ease: "power2.out" }),
          yTo: gsap.quickTo(el, "y", { duration: 0.8, ease: "power2.out" }),
          speed: layer.mouseSpeed,
        };
      });

      const handleMouseMove = (e: MouseEvent) => {
        mousePos.current = {
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        };
      };

      const tickMouse = () => {
        quickSetters.forEach((setter) => {
          if (!setter) return;
          const mx = mousePos.current.x * setter.speed * window.innerWidth * factor;
          const my = mousePos.current.y * setter.speed * window.innerHeight * factor;
          setter.xTo(mx);
          setter.yTo(my);
        });
        rafId.current = window.requestAnimationFrame(tickMouse);
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      rafId.current = window.requestAnimationFrame(tickMouse);

      return () => {
        ctx.revert();
        window.removeEventListener("mousemove", handleMouseMove);
        window.cancelAnimationFrame(rafId.current);
      };
    }

    return () => {
      ctx.revert();
    };
  }, [intensity, scrollContainerRef]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden opacity-0"
      style={{ willChange: "opacity" }}
    >
      {LAYERS.map((layer, i) => (
        <div key={i} ref={setScrollLayerRef(i)} className="absolute inset-0" style={{ willChange: "transform" }}>
          <div ref={setMouseLayerRef(i)} className={layer.className} style={{ ...layer.style, willChange: "transform" }} />
        </div>
      ))}
    </div>
  );
}

export default ParallaxBackground;
