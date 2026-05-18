import { useEffect, useState } from 'react';
import { publicApi } from '../api/client';

export function NoticeTicker() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    publicApi
      .notices({ limit: 15, page: 1 })
      .then((res) => {
        if (!alive) return;
        setItems(res?.data?.notices ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setErr('Notices unavailable');
      });
    return () => {
      alive = false;
    };
  }, []);

  const line =
    items.length > 0
      ? items.map((n) => `${n.title}`).join('  ·  ')
      : err || 'No notices published yet.';

  return (
    <div className="notice-ticker glass-panel" data-reveal>
      <span className="notice-ticker__label">Latest notices</span>
      <div className="notice-ticker__viewport" role="marquee" aria-live="polite">
        <div className="notice-ticker__track">
          {line} &nbsp;&nbsp;&middot;&nbsp;&nbsp; {line}
        </div>
      </div>
      <style>{`
        .notice-ticker {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.65rem 1rem;
          overflow: hidden;
        }
        .notice-ticker__label {
          flex-shrink: 0;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(120deg, var(--accent-a), var(--accent-b));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .notice-ticker__viewport {
          flex: 1;
          min-width: 0;
          mask-image: linear-gradient(90deg, transparent, black 4%, black 96%, transparent);
          display: flex;
          overflow: hidden;
        }
        .notice-ticker__track {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker-scroll 30s linear infinite;
          color: var(--text-muted);
          font-size: 0.9rem;
          padding-left: 100%;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .notice-ticker__track {
            animation: none;
            padding-left: 0;
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}
