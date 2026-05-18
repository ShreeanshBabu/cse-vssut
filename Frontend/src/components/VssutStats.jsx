import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animated stat counters with optional footnotes.
 * @param {{ stats: { label: string, value: number, note?: string }[], title?: string, subtitle?: string }} props
 */
export function VssutStats({ stats, title, subtitle }) {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !ref.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.vssut-stat__num', ref.current).forEach((el) => {
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: el.dataset.target,
            duration: 2.2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 82%',
            },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, [stats]);

  return (
    <section ref={ref} className="vssut-stats container home-section">
      {title && (
        <h2 className="section-title" data-reveal>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="section-lead" data-reveal data-reveal-delay="0.05">
          {subtitle}
        </p>
      )}
      <div className="vssut-stats__grid grid-responsive">
        {stats.map((s) => (
          <article key={s.label} className="glass-panel vssut-stat card-interactive" data-reveal>
            <div
              className="vssut-stat__num gradient-text"
              data-target={s.value}
            >
              0
            </div>
            <div className="vssut-stat__label">{s.label}</div>
            {s.note && <p className="vssut-stat__note">{s.note}</p>}
          </article>
        ))}
      </div>
      <style>{`
        .vssut-stats__grid {
          margin-top: 1.5rem;
          text-align: center;
        }
        .vssut-stat {
          padding: 1.75rem 1.25rem;
        }
        .vssut-stat__num {
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 700;
          font-family: var(--font-display);
          line-height: 1.1;
        }
        .vssut-stat__label {
          margin-top: 0.5rem;
          color: var(--accent-b);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }
        .vssut-stat__note {
          margin: 0.5rem 0 0;
          font-size: 0.75rem;
          color: var(--text-faint);
        }
      `}</style>
    </section>
  );
}
