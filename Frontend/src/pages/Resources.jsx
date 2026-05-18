import { useEffect, useState } from 'react';
import { publicApi } from '../api/client';
import { useStaggerSectionReveal } from '../hooks/useScrollReveal.js';
import { VssutPageBanner } from '../components/VssutPageBanner.jsx';
import { VssutCampusGallery } from '../components/VssutCampusGallery.jsx';
import { VSSUT_UNIVERSITY } from '../data/vssut.js';

const clubs = [
  {
    name: 'Robotics Society, VSSUT',
    body: 'AIR 4 at E-Yantra (IIT Bombay); Top 10 at NHIDE 2026 (Ministry of Education). Design patents and national competition wins.',
  },
  {
    name: 'Technical societies & fests',
    body: 'TECHTRONIX (ETC), SPECTRUM, TEDx VSSUT, IEEE Day, SIH, and department clubs host workshops and hackathons year-round.',
  },
  {
    name: 'Campus infrastructure',
    body: `${VSSUT_UNIVERSITY.campusAcres}-acre campus with Computer Centre, Central Library, E-Learning Centre, ${VSSUT_UNIVERSITY.hallsOfResidence}+ halls of residence, and labs for CSE, networks, and projects.`,
  },
  {
    name: 'Training & placement',
    body: 'Central Training & Placement cell connects VSSUT students with industry; ZOHO Skill Hub and industry summits inaugurated on campus (2026).',
  },
];

export function Resources() {
  const [announcements, setAnnouncements] = useState([]);
  const cardsRef = useStaggerSectionReveal();

  useEffect(() => {
    let alive = true;
    publicApi
      .announcements()
      .then((res) => {
        if (!alive) return;
        setAnnouncements(res?.data?.announcements ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setAnnouncements([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="resources">
      <VssutPageBanner
        pageTitle="Resources & student life"
        pageDescription={`Student clubs, labs, and events at ${VSSUT_UNIVERSITY.shortName} Burla — plus live announcements from this portal.`}
      />
      <div className="container">
        <header>
          <h1 className="section-title" data-reveal>
            Resources
          </h1>
          <p className="section-lead" data-reveal data-reveal-delay="0.06">
            VSSUT hosts national-level technical achievements, modern skill hubs, and a vibrant
            residential campus on the banks of the Mahanadi near Hirakud Dam.
          </p>
        </header>

        <section className="resources__block">
          <h2 className="resources__h2" data-reveal>
            Announcements & fests
          </h2>
          {announcements.length === 0 ? (
            <p className="glass-panel resources__empty" data-reveal>
              No active announcements in the CMS. Recent university events include VSSUT Marathon
              2026, ZOHO Skill Hub inauguration, and Global Industrial Summit — see{' '}
              <a href={VSSUT_UNIVERSITY.website} target="_blank" rel="noreferrer">
                vssut.ac.in
              </a>
              .
            </p>
          ) : (
            <ul className="resources__announcements">
              {announcements.map((a) => (
                <li key={a._id} className="glass-panel resources__announcement" data-reveal>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="resources__block">
          <h2 className="resources__h2" data-reveal>
            Clubs, labs & campus
          </h2>
          <div ref={cardsRef} className="grid-responsive">
            {clubs.map((c) => (
              <article key={c.name} className="glass-panel resources-card card-interactive" data-stagger-child>
                <h3 className="resources-card__title">{c.name}</h3>
                <p className="resources-card__body">{c.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <VssutCampusGallery title="VSSUT gate & CSE department highlights" />

      <style>{`
        .resources {
          padding-bottom: var(--space-section);
        }
        .resources__block {
          margin-top: 2.5rem;
        }
        .resources__h2 {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 400;
          margin: 0 0 1.25rem;
        }
        .resources__empty {
          padding: 1.25rem 1.5rem;
          color: var(--text-muted);
        }
        .resources__announcements {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .resources__announcement {
          padding: 1.25rem 1.5rem;
        }
        .resources__announcement h3 {
          margin: 0 0 0.5rem;
          font-size: 1.05rem;
        }
        .resources__announcement p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .resources-card {
          padding: 1.35rem 1.5rem;
        }
        .resources-card__title {
          margin: 0 0 0.5rem;
        }
        .resources-card__body {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.92rem;
        }
      `}</style>
    </div>
  );
}
