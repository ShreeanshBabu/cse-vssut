import { useStaggerSectionReveal } from '../hooks/useScrollReveal.js';
import { VssutPageBanner } from '../components/VssutPageBanner.jsx';
import { VssutCampusGallery } from '../components/VssutCampusGallery.jsx';
import { VSSUT_CSE, VSSUT_UNIVERSITY } from '../data/vssut.js';

const btechProgramme = {
  name: 'B.Tech — Computer Science & Engineering (all branches)',
  seats: VSSUT_CSE.btechStudents,
  summary: `${VSSUT_CSE.btechStudents} B.Tech students in the CSE department (B.Tech CSE + B.Tech CSE AI & ML). Department established in 1994.`,
  syllabusHref: 'https://cse.vssut.ac.in/',
};

const programmes = [
  btechProgramme,
  {
    name: 'M.Tech — CSE (multiple specializations)',
    seats:
      VSSUT_CSE.programmes.mtechCse +
      VSSUT_CSE.programmes.mtechAiMl +
      VSSUT_CSE.programmes.mtechDataScience +
      VSSUT_CSE.programmes.mtechIot +
      VSSUT_CSE.programmes.mtechCyberSecurity,
    summary:
      'Specializations: CSE (36), AI & ML (18), Data Science (18), IoT (18), Cyber Security (18) — total 108 seats/year.',
    syllabusHref: 'https://cse.vssut.ac.in/',
  },
  {
    name: 'MCA — Master of Computer Applications',
    seats: VSSUT_CSE.programmes.mca,
    summary: '30 seats per year at the CSE department, VSSUT Burla.',
    syllabusHref: 'https://cse.vssut.ac.in/',
  },
  {
    name: 'Ph.D. — Computer Science & Engineering',
    seats: null,
    summary:
      'Doctor of Philosophy in Engineering. Follow VSSUT admission notices and contact the department for research areas.',
    syllabusHref: 'https://www.vssut.ac.in/',
  },
];

export function Academics() {
  const ref = useStaggerSectionReveal();

  return (
    <div className="academics">
      <VssutPageBanner
        pageTitle="Academics — CSE, VSSUT"
        pageDescription={`${VSSUT_UNIVERSITY.name} offers B.Tech, B.Arch, M.Tech, M.Sc., MCA, and Ph.D. CSE has ${VSSUT_CSE.btechStudents} B.Tech students and published intake on cse.vssut.ac.in.`}
      />
      <div className="container">
        <header>
          <h1 className="section-title" data-reveal>
            Academics
          </h1>
          <p className="section-lead" data-reveal data-reveal-delay="0.06">
            Programme structure for the Department of Computer Science & Engineering. Seat numbers
            are from the official CSE department website.
          </p>
        </header>

        <div ref={ref} className="academics__grid grid-responsive">
          {programmes.map((p) => (
            <article key={p.name} className="glass-panel academics-card card-interactive" data-stagger-child>
              <h2 className="academics-card__title">{p.name}</h2>
              {p.seats != null && (
                <p className="academics-card__seats">
                  <strong>{p.seats}</strong>
                  {p.name.includes('B.Tech') && p.seats === VSSUT_CSE.btechStudents
                    ? ' B.Tech students'
                    : ' seats / year'}
                </p>
              )}
              <p className="academics-card__body">{p.summary}</p>
              <a
                className="btn btn--primary academics-card__link"
                href={p.syllabusHref}
                target="_blank"
                rel="noreferrer"
              >
                Official syllabus & notices
              </a>
            </article>
          ))}
        </div>

        <section className="academics__meta glass-panel" data-reveal>
          <h2 className="academics__meta-title">Vision & mission (CSE)</h2>
          <p>
            <strong>Vision:</strong> To be a recognized leader in quality technical education and
            research, equipping students for the modern computing industry and academia.
          </p>
          <p>
            <strong>Mission:</strong> Produce IT professionals and researchers; collaborate
            globally; promote centres of excellence; deliver reliable technology services to society.
          </p>
          <p className="academics__meta-note">
            University motto: {VSSUT_UNIVERSITY.motto} ({VSSUT_UNIVERSITY.mottoMeaning}). NIRF
            Engineering ranking band: {VSSUT_UNIVERSITY.nirfEngineeringBand} ({VSSUT_UNIVERSITY.nirfYear}).
          </p>
        </section>
      </div>

      <VssutCampusGallery title="VSSUT gate & CSE department highlights" />

      <style>{`
        .academics {
          padding-bottom: var(--space-section);
        }
        .academics__grid {
          margin-top: 2rem;
        }
        .academics-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-height: 100%;
        }
        .academics-card__title {
          margin: 0;
          font-size: 1.15rem;
          line-height: 1.35;
        }
        .academics-card__seats {
          margin: 0;
          font-size: 0.85rem;
          color: var(--accent-b);
        }
        .academics-card__body {
          margin: 0;
          flex: 1;
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .academics-card__link {
          align-self: flex-start;
        }
        .academics__meta {
          margin-top: 2.5rem;
          padding: 1.75rem 2rem;
          max-width: 52rem;
        }
        .academics__meta-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 400;
          margin: 0 0 0.75rem;
        }
        .academics__meta p {
          margin: 0 0 1rem;
          color: var(--text-muted);
        }
        .academics__meta-note {
          font-size: 0.85rem;
          color: var(--text-faint);
        }
      `}</style>
    </div>
  );
}
