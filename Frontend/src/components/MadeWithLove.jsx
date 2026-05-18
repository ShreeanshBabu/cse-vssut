import { TEAM_CREDITS } from '../data/vssut.js';

export function MadeWithLove({ compact = false }) {
  return (
    <div className={`made-with-love ${compact ? 'made-with-love--compact' : ''}`}>
      <p className="made-with-love__lead">
        Made with <span className="made-with-love__heart" aria-label="love">♥</span> by
      </p>
      <ul className="made-with-love__names">
        {TEAM_CREDITS.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <style>{`
        .made-with-love {
          text-align: center;
          padding: 1rem 0 0.25rem;
        }
        .made-with-love--compact {
          padding: 0.5rem 0;
        }
        .made-with-love__lead {
          margin: 0 0 0.5rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .made-with-love__heart {
          color: #f472b6;
          display: inline-block;
          animation: heart-pulse 1.4s ease-in-out infinite;
        }
        @keyframes heart-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .made-with-love__names {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.35rem 1rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        @media (prefers-reduced-motion: reduce) {
          .made-with-love__heart { animation: none; }
        }
      `}</style>
    </div>
  );
}
