import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoticeTicker } from '../components/NoticeTicker.jsx';
import { FloatingAesthetics } from '../components/FloatingAesthetics.jsx';
import { VssutCampusGallery } from '../components/VssutCampusGallery.jsx';
import { VssutStats } from '../components/VssutStats.jsx';
import {
  VSSUT_UNIVERSITY,
  VSSUT_CSE,
  VSSUT_HIGHLIGHT_STATS,
  CSE_HIGHLIGHT_STATS,
} from '../data/vssut.js';
import { vssutHeroImage } from '../data/vssutImages.js';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const heroRef = useRef(null);
  const visualRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !heroRef.current || !visualRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(visualRef.current, {
        y: 80,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
      gsap.to('.home-hero__copy', {
        y: 40,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <FloatingAesthetics />
      <div className="home" style={{ position: 'relative', zIndex: 1 }}>
        <section ref={heroRef} className="home-hero container">
          <div className="home-hero__grid">
            <div className="home-hero__copy">
              <p className="home-eyebrow" data-reveal>
                {VSSUT_UNIVERSITY.name}
              </p>
              <h1 className="home-title" data-reveal data-reveal-delay="0.06">
                Department of <span className="gradient-text">CSE, VSSUT Burla</span>
              </h1>
              <p className="home-lead" data-reveal data-reveal-delay="0.12">
                Oldest engineering college in Odisha (est. {VSSUT_UNIVERSITY.established}) — now a
                state technical university with {VSSUT_UNIVERSITY.studentsTotal.toLocaleString('en-IN')}{' '}
                students, {VSSUT_UNIVERSITY.campusAcres}-acre campus, and a CSE department since{' '}
                {VSSUT_CSE.established} shaping innovators for India and the world.
              </p>
              <div className="home-cta" data-reveal data-reveal-delay="0.18">
                <a className="btn btn--primary" href="#hod-message">
                  HOD&apos;s message
                </a>
                <Link className="btn btn--ghost" to="/people">
                  Meet our {VSSUT_CSE.facultyCount} faculty
                </Link>
              </div>
            </div>
            <div ref={visualRef} className="home-hero__visual glass-panel card-interactive" data-reveal>
              <img
                src={vssutHeroImage.src}
                alt={vssutHeroImage.alt}
                className="home-hero__campus-img"
                loading="eager"
              />
              <p className="home-visual-caption">VSSUT · Burla campus</p>
              <p className="home-visual-text">
                Motto: <em>{VSSUT_UNIVERSITY.motto}</em> — {VSSUT_UNIVERSITY.mottoMeaning}. Celebrating{' '}
                {VSSUT_UNIVERSITY.legacyYears} years ({VSSUT_UNIVERSITY.legacyLabel}).
              </p>
            </div>
          </div>
        </section>

        <section className="container" style={{ marginTop: '2rem' }}>
          <NoticeTicker />
        </section>

        <VssutStats
          title="VSSUT at a glance"
          subtitle={`Figures from the university profile (Wikipedia / vssut.ac.in, ${VSSUT_UNIVERSITY.nirfYear}). Phase-I campus redevelopment: ₹${VSSUT_UNIVERSITY.redevelopmentCrore} crore (Cabinet approval).`}
          stats={VSSUT_HIGHLIGHT_STATS}
        />

        <section id="hod-message" className="container home-section">
          <h2 className="section-title" data-reveal>
            Message from the Head of Department
          </h2>
          <p className="section-lead" data-reveal data-reveal-delay="0.05">
            {VSSUT_CSE.name} — established {VSSUT_CSE.established}, offering B.Tech, M.Tech, MCA, and
            Ph.D programmes at {VSSUT_UNIVERSITY.shortName}.
          </p>
          <article className="glass-panel home-hod" data-reveal data-reveal-delay="0.1">
            <p>
              The Department of Computer Science & Engineering at VSSUT, Burla continues to invest
              in strong foundations, ethical practice, and industry-relevant skills. Our programmes
              emphasise problem-solving, systems thinking, and collaborative learning — preparing
              graduates to contribute responsibly to technology and society.
            </p>
            <p>
              With {VSSUT_CSE.btechStudents} B.Tech students, {VSSUT_CSE.facultyCount} faculty,
              and programmes spanning B.Tech, M.Tech, MCA, and Ph.D, we welcome you to explore
              notices, people, academics, and resources on this portal.
            </p>
            <footer className="home-hod__sign">
              <span className="home-hod__name">{VSSUT_CSE.hod}</span>
              <span className="home-hod__role">Professor & Head of Department, CSE — VSSUT, Burla</span>
            </footer>
          </article>
        </section>

        <VssutCampusGallery />

        <VssutStats
          title="CSE department — intake & people"
          subtitle="Seat matrix from cse.vssut.ac.in (academic year intake capacities)."
          stats={CSE_HIGHLIGHT_STATS}
        />

        <section className="container home-section home-highlights">
          <h2 className="section-title" data-reveal>
            Why VSSUT
          </h2>
          <div className="grid-responsive">
            {[
              {
                t: 'Legacy & location',
                d: `Founded as UCE Burla in ${VSSUT_UNIVERSITY.established} beside Hirakud Dam — first engineering college in Odisha. University status since 2009; UGC Section 12B eligible.`,
              },
              {
                t: 'Scale & rankings',
                d: `${VSSUT_UNIVERSITY.studentsTotal.toLocaleString('en-IN')} students, ${VSSUT_UNIVERSITY.hallsOfResidence}+ halls of residence, NIRF Engineering ${VSSUT_UNIVERSITY.nirfEngineeringBand} band. Robotics Society: AIR 4 E-Yantra (IIT Bombay), Top 10 NHIDE 2026.`,
              },
              {
                t: 'CSE @ VSSUT',
                d: `${VSSUT_CSE.facultyCount} faculty · ${VSSUT_CSE.btechStudents} B.Tech students · research in AI, security, data science & more.`,
              },
            ].map((x, i) => (
              <div
                key={x.t}
                className="glass-panel home-card card-interactive"
                data-reveal
                data-reveal-delay={String(0.06 * (i + 1))}
              >
                <h3 className="home-card__title">{x.t}</h3>
                <p className="home-card__body">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        <style>{`
          .home-hero {
            padding-top: clamp(1.5rem, 4vw, 3rem);
            padding-bottom: 1rem;
          }
          .home-hero__grid {
            display: grid;
            gap: 2rem;
            align-items: center;
            grid-template-columns: 1fr;
          }
          @media (min-width: 900px) {
            .home-hero__grid {
              grid-template-columns: 1.05fr 0.95fr;
            }
          }
          .home-eyebrow {
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--text-muted);
            margin: 0 0 1rem;
          }
          .home-title {
            font-family: var(--font-display);
            font-size: clamp(2.35rem, 5vw, 3.4rem);
            font-weight: 400;
            line-height: 1.1;
            margin: 0 0 1rem;
            letter-spacing: -0.02em;
          }
          .home-lead {
            margin: 0 0 1.5rem;
            max-width: 38rem;
            color: var(--text-muted);
            font-size: 1.05rem;
          }
          .home-cta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .home-hero__visual {
            padding: 0;
            overflow: hidden;
            min-height: 280px;
            max-width: 420px;
            margin-inline: auto;
            display: flex;
            flex-direction: column;
          }
          .home-hero__campus-img {
            width: 100%;
            aspect-ratio: 4 / 3;
            object-fit: cover;
          }
          .home-visual-caption {
            padding: 1rem 1.25rem 0;
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: var(--text-muted);
            margin: 0;
          }
          .home-visual-text {
            padding: 0.5rem 1.25rem 1.25rem;
            margin: 0;
            color: var(--text-muted);
            font-size: 0.9rem;
          }
          .home-section {
            margin-top: var(--space-section);
          }
          .home-hod {
            padding: 1.75rem 2rem;
            max-width: 52rem;
          }
          .home-hod p {
            margin: 0 0 1rem;
            color: var(--text-muted);
          }
          .home-hod__sign {
            margin-top: 1.5rem;
            padding-top: 1.25rem;
            border-top: 1px solid var(--border-glass);
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
            font-size: 0.9rem;
          }
          .home-hod__name {
            font-weight: 600;
            color: var(--text-primary);
          }
          .home-hod__role {
            color: var(--text-faint);
            font-size: 0.85rem;
          }
          .home-card {
            padding: 1.35rem 1.5rem;
          }
          .home-card__title {
            margin: 0 0 0.5rem;
            font-size: 1.05rem;
          }
          .home-card__body {
            margin: 0;
            font-size: 0.92rem;
            color: var(--text-muted);
          }
        `}</style>
      </div>
    </>
  );
}
