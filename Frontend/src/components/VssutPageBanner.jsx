import { VSSUT_UNIVERSITY } from '../data/vssut.js';

/**
 * Short VSSUT context strip shown at the top of inner pages.
 */
export function VssutPageBanner({ pageTitle, pageDescription }) {
  return (
    <aside className="vssut-banner glass-panel container" data-reveal>
      <div className="vssut-banner__badge">VSSUT · Burla, Odisha</div>
      <p className="vssut-banner__uni">
        <strong>{VSSUT_UNIVERSITY.name}</strong> — established {VSSUT_UNIVERSITY.established},{' '}
        {VSSUT_UNIVERSITY.legacyYears} years of excellence ({VSSUT_UNIVERSITY.legacyLabel}).{' '}
        {VSSUT_UNIVERSITY.studentsTotal.toLocaleString('en-IN')} students ·{' '}
        {VSSUT_UNIVERSITY.campusAcres} acre campus · NIRF Engineering {VSSUT_UNIVERSITY.nirfEngineeringBand}{' '}
        ({VSSUT_UNIVERSITY.nirfYear}).
      </p>
      {pageTitle && <h2 className="vssut-banner__page">{pageTitle}</h2>}
      {pageDescription && <p className="vssut-banner__desc">{pageDescription}</p>}
      <a
        className="vssut-banner__link"
        href={VSSUT_UNIVERSITY.website}
        target="_blank"
        rel="noreferrer"
      >
        Official university website →
      </a>
      <style>{`
        .vssut-banner {
          margin: 0.5rem auto 1.5rem;
          padding: 1.25rem 1.5rem;
          max-width: var(--container-max, 1120px);
        }
        .vssut-banner__badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent-a);
          margin-bottom: 0.5rem;
        }
        .vssut-banner__uni {
          margin: 0 0 0.75rem;
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.55;
        }
        .vssut-banner__page {
          margin: 0 0 0.35rem;
          font-size: 1rem;
          font-weight: 600;
        }
        .vssut-banner__desc {
          margin: 0 0 0.5rem;
          font-size: 0.85rem;
          color: var(--text-faint);
        }
        .vssut-banner__link {
          font-size: 0.82rem;
          font-weight: 600;
        }
      `}</style>
    </aside>
  );
}
