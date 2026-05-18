import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Network, TerminalSquare, Cpu, Code2 } from 'lucide-react';

const ITEMS = [
  { id: 1, Icon: Network, size: 48 },
  { id: 2, Icon: TerminalSquare, size: 64 },
  { id: 3, Icon: Cpu, size: 56 },
  { id: 4, Icon: Code2, size: 40 },
  { id: 5, Icon: Network, size: 32 },
  { id: 6, Icon: TerminalSquare, size: 48 },
];

export function FloatingAesthetics() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.floating-item');
      const cw = container.clientWidth || 800;
      const ch = container.clientHeight || 600;

      items.forEach((item) => {
        gsap.set(item, {
          x: gsap.utils.random(0, cw),
          y: gsap.utils.random(0, ch),
          scale: gsap.utils.random(0.5, 1.2),
          opacity: gsap.utils.random(0.08, 0.25),
        });

        const float = () => {
          gsap.to(item, {
            x: `+=${gsap.utils.random(-120, 120)}`,
            y: `+=${gsap.utils.random(-120, 120)}`,
            rotation: `+=${gsap.utils.random(-30, 30)}`,
            duration: gsap.utils.random(10, 18),
            ease: 'sine.inOut',
            onComplete: float,
          });
        };
        float();
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {ITEMS.map((item) => (
        <div key={item.id} className="floating-item" style={{ position: 'absolute' }}>
          <item.Icon size={item.size} color="var(--accent-b)" opacity={0.15} />
        </div>
      ))}
    </div>
  );
}
