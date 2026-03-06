# Mobile Animation Incident Report (2026-03-06)

## Project
- Name: `vipauto_161`
- Stack: Next.js App Router, React 19, TypeScript, GSAP 3, Tailwind CSS v4
- Production domain: `vipauto161.ru`

## Reported Symptoms (Real Devices)
- Logo animation in mobile header does not run.
- Phone digits wave animation in mobile menu does not run.
- Scroll reveal animations do not run on phone, while desktop DevTools mobile emulation looks correct.
- First load can show a blank page; after refresh content appears without animations.
- Burger icon middle line thickness differs: in desktop emulation it looks thinner, on real phone all lines look equal.

## Key Findings
1. Global motion policy was too aggressive.
   - `@media (prefers-reduced-motion: reduce)` globally forced near-zero animation/transition durations for all elements.
   - On real devices/browser configurations this often disables animation behavior unlike desktop emulation.

2. Reveal sections had hard hidden default.
   - `.reveal-section { visibility: hidden; }`
   - If JS observers/effects were delayed or failed, sections stayed hidden, causing blank-content perception.

3. Mobile browser compatibility issue in reduced-motion hook.
   - `MediaQueryList.addEventListener("change", ...)` is not universally reliable across all mobile browsers.
   - Missing fallback to `addListener/removeListener` increased risk of runtime issues.

4. Boot gating in layout could hide UI if startup timing/script execution differed.
   - `boot-ui` visibility depended on `ui-ready` class toggled by inline script.
   - This added another failure path to initial blank screen.

5. Burger visual parity issue.
   - All lines had effectively same geometric height on real devices due pixel ratio rounding.

## Implemented Fixes

### 1) Global CSS reliability updates
File: `app/globals.css`
- Removed boot fade gate dependency:
  - Kept `.boot-ui` always visible.
  - Removed `html:not(.ui-ready) .boot-ui { opacity: 0; }`.
- Changed reveal baseline:
  - `.reveal-section` now defaults to `visibility: visible`.
- Scoped reduced-motion kill-switch:
  - Global hard-stop animations now apply only when explicitly requested with `html[data-reduce-motion="true"]`.

### 2) Layout startup simplification
File: `app/layout.tsx`
- Removed `ui-boot` inline script block that toggled `ui-ready`.
- This removes race conditions that could keep initial content hidden.

### 3) Reduced motion hook hardening
File: `hooks/useReducedMotion.ts`
- Added compatibility fallback:
  - Uses `addEventListener/removeEventListener` when available.
  - Falls back to `addListener/removeListener`.
- Added mobile consistency rule:
  - On mobile viewport, reduced-motion no longer disables reveal logic by default.

### 4) MobileMenu animation stability + parity
File: `components/layout/MobileMenu.tsx`
- Added helper `shouldReduceMotion()` to align motion policy with real-device behavior.
- Kept logo GSAP on motion-enabled path for mobile parity.
- Added `force3D: false` in phone digits animation setup/tweens to avoid compositor artifacts.
- Normalized burger line thickness:
  - Top/Bottom: `1.5px`
  - Middle: `1px`
  - Fixes “all lines equal” look on physical devices.

## Relevant Code Snippets

```ts
// hooks/useReducedMotion.ts
const update = () => {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  setReduced(media.matches && !isMobile);
};

if (typeof media.addEventListener === "function") {
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
}

media.addListener(update);
return () => media.removeListener(update);
```

```css
/* app/globals.css */
.reveal-section {
  visibility: visible;
}

@media (prefers-reduced-motion: reduce) {
  html[data-reduce-motion="true"] *,
  html[data-reduce-motion="true"] *::before,
  html[data-reduce-motion="true"] *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// components/layout/MobileMenu.tsx
function shouldReduceMotion(): boolean {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
  return prefersReduced && !isMobileViewport;
}
```

## Validation Checklist
- [ ] No blank page on first load.
- [ ] Logo animation runs on real mobile devices.
- [ ] Phone digits wave runs when menu is open.
- [ ] Scroll reveal appears/animates instead of static hidden blocks.
- [ ] Burger middle line remains visibly thinner on physical devices.
- [ ] Behavior between desktop mobile emulation and real phone is close/consistent.

## Changed Files
- `app/globals.css`
- `app/layout.tsx`
- `hooks/useReducedMotion.ts`
- `components/layout/MobileMenu.tsx`
