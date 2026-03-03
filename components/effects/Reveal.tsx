"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { runRevealAnimation } from "@/lib/gsapPresets";
import type { RevealDirection } from "@/lib/gsapPresets";
import { cn } from "@/lib/cn";
import { useInView } from "@/hooks/useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
};

export function Reveal({ children, className, direction = "up" }: RevealProps) {
  const [ref, inView] = useInView({ threshold: 0.28, once: true, rootMargin: "0px 0px -12% 0px" });

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    const tween = runRevealAnimation(node, direction);
    return () => {
      tween.kill();
    };
  }, [direction, inView, ref]);

  const hiddenClass =
    direction === "left"
      ? "translate-x-11 opacity-0"
      : direction === "right"
        ? "-translate-x-11 opacity-0"
        : "translate-y-5 opacity-0";

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform",
        !inView ? hiddenClass : "translate-x-0 translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
