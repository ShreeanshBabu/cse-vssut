import { vssutCampusCategories } from '../data/vssutImages.js';

export function VssutCampusGallery({ title = 'VSSUT gate & CSE department highlights' }) {
  return (
    <section className="vssut-gallery home-section" aria-label={title}>
      <div className="container">
        <h2 className="section-title" data-reveal>
          {title}
        </h2>
        <p className="section-lead" data-reveal data-reveal-delay="0.05">
          Curated official photographs focused only on the VSSUT main gate and CSE department
          building.
        </p>

        <div className="vssut-gallery__categories">
          {vssutCampusCategories.map((cat) => (
            <div key={cat.id} className="vssut-gallery__category" data-reveal>
              <header className="vssut-gallery__cat-header">
                <h3 className="vssut-gallery__cat-title">{cat.title}</h3>
                <p className="vssut-gallery__cat-desc">{cat.description}</p>
              </header>
              <div className={`vssut-gallery__grid vssut-gallery__grid--${cat.images.length}`}>
                {cat.images.map((img) => (
                  <figure key={img.src} className="vssut-gallery__figure glass-panel">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="vssut-gallery__img"
                    />
                    <figcaption className="vssut-gallery__caption">{img.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .vssut-gallery {
          padding: 2.5rem 0 3.5rem;
          background: var(--bg-glass);
          border-top: 1px solid var(--border-glass);
          border-bottom: 1px solid var(--border-glass);
        }
        .vssut-gallery__categories {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          margin-top: 2rem;
        }
        .vssut-gallery__cat-header {
          margin-bottom: 1rem;
        }
        .vssut-gallery__cat-title {
          margin: 0 0 0.35rem;
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 400;
        }
        .vssut-gallery__cat-desc {
          margin: 0;
          font-size: 0.88rem;
          color: var(--text-muted);
          max-width: 42rem;
        }
        .vssut-gallery__grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(240px, 260px));
          justify-content: center;
        }
        .vssut-gallery__grid--1 {
          grid-template-columns: minmax(260px, 520px);
          justify-content: start;
        }
        .vssut-gallery__figure {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .vssut-gallery__img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
        }
        .vssut-gallery__caption {
          padding: 0.65rem 0.85rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-glass);
        }
      `}</style>
    </section>
  );
}
