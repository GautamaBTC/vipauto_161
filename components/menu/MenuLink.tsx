"use client";

import { useCallback, useRef, type MouseEvent } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/cn";

type MenuLinkProps = {
  href: string;
  label: string;
  index: number;
  onRegister: (el: HTMLAnchorElement | null, index: number) => void;
  onClick?: () => void;
};

export function MenuLink({ href, label, index, onRegister, onClick }: MenuLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  const setRef = useCallback(
    (el: HTMLAnchorElement | null) => {
      linkRef.current = el;
      onRegister(el, index);
    },
    [onRegister, index],
  );

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!linkRef.current || !glowRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    gsap.to(glowRef.current, {
      x: e.clientX - rect.left - 80,
      y: e.clientY - rect.top - 80,
      opacity: 0.6,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
  };

  const num = String(index + 1).padStart(2, "0");

  return (
    <li className="w-full">
      <a
        ref={setRef}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        tabIndex={-1}
        className={cn(
          "group perspective-[800px] relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-transparent px-6 py-5 text-[1.65rem] font-semibold tracking-wide text-white opacity-0 transition-colors duration-300 hover:text-[#dc2626] focus-visible:text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12151A] active:scale-[0.97]",
        )}
      >
        <span className="absolute left-6 font-mono text-[0.6rem] font-normal tracking-[0.2em] text-white/15 transition-colors duration-300 group-hover:text-[#dc2626]/40">
          {num}
        </span>

        <span>{label}</span>

        <span
          className="absolute bottom-3 left-1/2 h-[1.5px] w-0 -translate-x-1/2 rounded-full bg-[#dc2626] shadow-[0_0_6px_rgba(220,38,38,0.4)] transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:w-[35%] group-focus-visible:w-[35%]"
          aria-hidden="true"
        />

        <span
          ref={glowRef}
          className="pointer-events-none absolute h-40 w-40 rounded-full opacity-0"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
      </a>
    </li>
  );
}
