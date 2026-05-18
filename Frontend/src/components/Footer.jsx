import { Link } from 'react-router-dom';
import { MadeWithLove } from './MadeWithLove.jsx';
import { VSSUT_CSE, VSSUT_UNIVERSITY } from '../data/vssut.js';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div data-reveal>
          <p className="site-footer__title">{VSSUT_CSE.name}</p>
          <p className="site-footer__meta">
            {VSSUT_UNIVERSITY.name}, Burla · {VSSUT_UNIVERSITY.location}
          </p>
          <p className="site-footer__meta">
            HOD: {VSSUT_CSE.hod} ·{' '}
            <a href={`mailto:${VSSUT_CSE.deptEmail}`}>{VSSUT_CSE.deptEmail}</a>
          </p>
        </div>
        <div data-reveal data-reveal-delay="0.08">
          <p className="site-footer__heading">Quick links</p>
          <ul className="site-footer__list">
            <li>
              <a href={VSSUT_UNIVERSITY.website} target="_blank" rel="noreferrer">
                VSSUT main site
              </a>
            </li>
            <li>
              <a href={VSSUT_UNIVERSITY.cseWebsite} target="_blank" rel="noreferrer">
                CSE department (official)
              </a>
            </li>
            <li>
              <Link to="/academics">Programmes & syllabus</Link>
            </li>
            <li>
              <Link to="/people">Faculty directory</Link>
            </li>
            <li>
              <Link to="/resources">Labs & student life</Link>
            </li>
          </ul>
        </div>
        <div data-reveal data-reveal-delay="0.12">
          <p className="site-footer__heading">University facts</p>
          <ul className="site-footer__facts">
            <li>Est. {VSSUT_UNIVERSITY.established} · {VSSUT_UNIVERSITY.legacyYears} years</li>
            <li>{VSSUT_UNIVERSITY.studentsTotal.toLocaleString('en-IN')} students</li>
            <li>{VSSUT_UNIVERSITY.engineeringDepartments} engineering departments</li>
            <li>{VSSUT_UNIVERSITY.campusAcres} acre campus</li>
            <li>VC: {VSSUT_UNIVERSITY.viceChancellor}</li>
          </ul>
        </div>
      </div>

      <MadeWithLove />

      <p className="site-footer__copy container">
        © {new Date().getFullYear()} CSE, VSSUT Burla · Digital Department Challenge · Data sourced
        from vssut.ac.in & cse.vssut.ac.in
      </p>
      <style>{`
        .site-footer {
          margin-top: var(--space-section);
          padding: 3rem 0 2rem;
          border-top: 1px solid var(--border-glass);
        }
        .site-footer__grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        .site-footer__title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          margin: 0 0 0.5rem;
        }
        .site-footer__meta {
          margin: 0 0 0.35rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .site-footer__heading {
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin: 0 0 0.75rem;
          color: var(--text-muted);
        }
        .site-footer__list,
        .site-footer__facts {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .site-footer__copy {
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-glass);
          font-size: 0.78rem;
          color: var(--text-faint);
          text-align: center;
        }
      `}</style>
    </footer>
  );
}
