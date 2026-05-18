import { useEffect } from 'react';
import { Users, User } from 'lucide-react';
import { alumniData } from '../data/alumni';
import { VssutPageBanner } from '../components/VssutPageBanner.jsx';
import { VssutCampusGallery } from '../components/VssutCampusGallery.jsx';
import { VSSUT_UNIVERSITY } from '../data/vssut.js';

export function Alumni() {
  useEffect(() => {
    document.title = 'Distinguished Alumni | VSSUT';
  }, []);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'grid';
  };

  return (
    <div className="alumni-page">
      <VssutPageBanner
        pageTitle="Distinguished alumni"
        pageDescription={`Notable graduates of ${VSSUT_UNIVERSITY.name} — leaders in parliament, industry, research, and public service.`}
      />
      <div className="container alumni-container">
        {/* Header Section */}
        <div className="alumni-header">
          <div className="badge-pill">
            <Users size={18} /> Our Pride
          </div>
          <h1 className="section-title gradient-text">Distinguished Alumni Gallery</h1>
          <p className="section-lead">
            Meet distinguished alumni of VSSUT Burla featured on the official university website —
            from Rajya Sabha to DRDO, global banks, and top research institutes.
          </p>
        </div>

        {/* Grid Section */}
        <div className="alumni-grid">
          {alumniData.map((alumnus) => (
            <div 
              key={alumnus.id}
              className="glass-panel alumni-card"
            >
              <div className="alumni-card__img-wrapper">
                <img 
                  src={alumnus.imageUrl} 
                  alt={alumnus.name}
                  className="alumni-card__img"
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="alumni-card__placeholder" style={{ display: 'none' }}>
                  <User size={48} />
                </div>
                <div className="alumni-card__overlay">
                  <span className="alumni-card__batch">
                    Class of {alumnus.batch}
                  </span>
                </div>
              </div>
              <div className="alumni-card__content">
                <h3 className="alumni-card__name">
                  {alumnus.name}
                </h3>
                <div className="alumni-card__meta">
                  <span className="alumni-card__role">{alumnus.role}</span>
                  <span className="alumni-card__company">@ {alumnus.company}</span>
                </div>
                <p className="alumni-card__desc">
                  {alumnus.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VssutCampusGallery title="VSSUT gate & CSE department highlights" />

      <style>{`
        .alumni-page {
          padding: var(--space-section) 0;
          width: 100%;
          min-height: 80vh;
        }
        .alumni-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .alumni-header {
          text-align: center;
          maxWidth: 800px;
          margin: 0 auto;
        }
        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          borderRadius: var(--radius-pill);
          marginBottom: 1.5rem;
          color: var(--accent-b);
          fontWeight: 600;
        }
        .alumni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          paddingTop: 2rem;
        }
        .alumni-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .alumni-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-float);
        }
        .alumni-card__img-wrapper {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: var(--bg-glass);
        }
        .alumni-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .alumni-card:hover .alumni-card__img {
          transform: scale(1.05);
        }
        .alumni-card__placeholder {
          width: 100%;
          height: 100%;
          place-items: center;
          color: var(--text-faint);
          background: var(--bg-glass);
        }
        .alumni-card__overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          padding: 1.5rem 1.5rem 0.5rem;
          color: #fff;
        }
        .alumni-card__batch {
          fontWeight: 700;
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: var(--accent-a);
          color: #000;
          borderRadius: var(--radius-pill);
          fontSize: 0.75rem;
          marginBottom: 0.5rem;
        }
        .alumni-card__content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }
        .alumni-card__name {
          margin: 0;
          fontSize: 1.25rem;
          fontFamily: var(--font-display);
        }
        .alumni-card__meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .alumni-card__role {
          fontWeight: 600;
          color: var(--accent-b);
        }
        .alumni-card__company {
          color: var(--text-faint);
          fontSize: 0.9rem;
        }
        .alumni-card__desc {
          margin: 0;
          color: var(--text-muted);
          fontSize: 0.95rem;
          lineHeight: 1.5;
          marginTop: auto;
        }
      `}</style>
    </div>
  );
}
