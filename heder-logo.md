# Отладочный подход — минимальный рабочий пример LogoReveal

## Почему не работало

`useGSAP` с пустыми `dependencies: []` в связке с `opacity: 0` в inline style может приводить к ситуации, когда в React StrictMode (dev) эффекты вызываются дважды, а cleanup/revert ломает ожидаемую последовательность.

Результат: элемент может остаться скрытым (`opacity: 0`) или анимация отрабатывает некорректно.

## Минимальный рабочий подход

- Использовать обычный `useEffect` для предсказуемого one-shot запуска.
- Добавить guard `hasAnimated.current`, чтобы исключить повтор в StrictMode.
- Инициализацию стилей делать через `gsap.set`.
- Не завязывать старт на inline `opacity: 0` в JSX.

```tsx
// LogoReveal.tsx
'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface LogoRevealProps {
  words: string[];
  className?: string;
}

export function LogoReveal({ words, className = '' }: LogoRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const wordEls = container.querySelectorAll<HTMLElement>('.logo-word');
    const accent = container.querySelector<HTMLElement>('.logo-accent');

    if (!wordEls.length) return;

    wordEls.forEach((el, i) => {
      const fromLeft = i % 2 === 0;
      gsap.set(el, {
        opacity: 0,
        x: fromLeft ? -80 : 80,
        rotation: fromLeft ? -8 : 8,
        scale: 0.85,
      });
    });

    if (accent) {
      gsap.set(accent, {
        opacity: 0,
        scaleX: 0,
      });
    }

    const tl = gsap.timeline({ delay: 0.3 });

    wordEls.forEach((el, i) => {
      tl.to(
        el,
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
        },
        i === 0 ? 0 : '-=0.35'
      );
    });

    tl.to(
      container,
      {
        scale: 1.04,
        duration: 0.2,
        ease: 'power2.out',
      },
      '+=0.05'
    );

    tl.to(container, {
      scale: 1,
      duration: 0.35,
      ease: 'power2.inOut',
    });

    if (accent) {
      tl.to(
        accent,
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed left-5 top-5 z-[10001] flex flex-col items-start ${className}`}
      style={{
        transition: 'none',
        transformOrigin: 'left center',
      }}
    >
      <div className="flex items-baseline gap-2">
        {words.map((word, i) => (
          <span
            key={i}
            className="logo-word"
            style={{
              display: 'inline-block',
              fontSize: '1.4rem',
              fontWeight: i === 0 ? 800 : 300,
              color: i === 0 ? '#ccff00' : '#ffffff',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'none',
              transformOrigin: 'center center',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <div
        className="logo-accent mt-1 h-[2px] w-full bg-gradient-to-r from-[#ccff00] to-[#00f0ff]"
        style={{
          transformOrigin: 'left center',
          transition: 'none',
        }}
      />
    </div>
  );
}
```

## Ключевые отличия

| Изменение | Зачем |
|---|---|
| `useEffect` вместо `useGSAP` | Предсказуемый запуск и меньше шансов словить revert-конфликты в dev StrictMode |
| `hasAnimated.current` guard | Исключает повторный запуск анимации |
| `querySelectorAll` | Простой прямой DOM-поиск |
| Без `clearProps` | Минимум лишней логики в debug-варианте |
| Без `opacity: 0` в JSX | Начальные состояния задает GSAP |

## Примечание

Если будет краткий flash до старта анимации, можно временно добавить `opacity: 0` в JSX для `.logo-word`, но базовый вариант сначала проверяется без него.
