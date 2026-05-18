import { useEffect, useRef } from 'react';

export function AnimatedCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.matchMedia('(max-width: 768px)').matches;

    if (reduce || coarse || narrow) {
      document.body.classList.remove('use-custom-cursor');
      return undefined;
    }

    document.body.classList.add('use-custom-cursor');

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return undefined;

    let hover = false;

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = () => {
      ring.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) scale(0.92)`;
    };

    const onUp = () => {
      ring.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) scale(1)`;
    };

    const setHover = (isHover) => {
      hover = isHover;
      ring.classList.toggle('cursor-ring--hover', isHover);
      dot.classList.toggle('cursor-dot--hover', isHover);
    };

    const onOver = (e) => {
      const t = e.target;
      if (
        t.closest(
          'a, button, input, textarea, select, [role="button"], .glass-panel, .card-interactive'
        )
      ) {
        setHover(true);
      } else {
        setHover(false);
      }
    };

    const tick = () => {
      const lerp = 0.18;
      pos.current.x += (target.current.x - pos.current.x) * lerp;
      pos.current.y += (target.current.y - pos.current.y) * lerp;
      const scale = hover ? 1.35 : 1;
      ring.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) scale(${scale})`;
      dot.style.transform = `translate(${target.current.x}px, ${target.current.y}px)`;
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseover', onOver);
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseover', onOver);
      document.body.classList.remove('use-custom-cursor');
    };
  }, []);

  return (
    <div className="cursor-root" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
      <style>{`
        .cursor-root {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99999;
        }
        .cursor-ring {
          position: fixed;
          left: 0;
          top: 0;
          width: 40px;
          height: 40px;
          margin: -20px 0 0 -20px;
          border-radius: 50%;
          border: 1px solid color-mix(in srgb, var(--accent-b) 70%, transparent);
          box-shadow:
            0 0 24px color-mix(in srgb, var(--accent-a) 35%, transparent),
            inset 0 0 20px color-mix(in srgb, var(--accent-b) 15%, transparent);
          transition: transform 0.15s ease, border-color 0.2s ease;
          will-change: transform;
        }
        .cursor-ring--hover {
          border-color: color-mix(in srgb, var(--accent-a) 80%, transparent);
        }
        .cursor-dot {
          position: fixed;
          left: 0;
          top: 0;
          width: 8px;
          height: 8px;
          margin: -4px 0 0 -4px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
          box-shadow: 0 0 12px color-mix(in srgb, var(--accent-b) 50%, transparent);
          will-change: transform;
          transition: transform 0.12s ease;
        }
        .cursor-dot--hover {
          transform: scale(1.25);
        }
        @media (pointer: coarse), (max-width: 768px), (prefers-reduced-motion: reduce) {
          .cursor-root { display: none; }
        }
      `}</style>
    </div>
  );
}
