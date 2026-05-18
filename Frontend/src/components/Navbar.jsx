import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/people', label: 'People' },
  { to: '/academics', label: 'Academics' },
  { to: '/resources', label: 'Resources' },
  { to: '/alumni', label: 'Alumni' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav glass-panel glass-panel--strong">
      <div className="site-nav__inner container">
        <Link to="/" className="site-nav__brand" onClick={() => setOpen(false)}>
          <span className="site-nav__mark" aria-hidden="true" />
          <span className="site-nav__titles">
            <span className="site-nav__dept">CSE</span>
            <span className="site-nav__sub">VSSUT · Burla</span>
          </span>
        </Link>

        <button
          type="button"
          className="site-nav__toggle btn btn--ghost"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <nav id="primary-nav" className={`site-nav__links ${open ? 'is-open' : ''}`}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `site-nav__link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <Link to="/admin" className="site-nav__link site-nav__admin" onClick={() => setOpen(false)}>
            Admin
          </Link>
          <button
            type="button"
            className="btn site-nav__theme"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
      <style>{`
        .site-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          margin: 0.75rem auto 0;
          width: min(1120px, calc(100% - 1.5rem));
          border-radius: var(--radius-pill);
        }
        .site-nav__inner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.55rem 1rem;
          min-height: var(--nav-h);
        }
        .site-nav__brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          margin-right: auto;
        }
        .site-nav__brand:hover {
          text-decoration: none;
        }
        .site-nav__mark {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.65rem;
          background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
          box-shadow: 0 8px 28px var(--glow);
        }
        .site-nav__titles {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .site-nav__dept {
          font-weight: 700;
          letter-spacing: 0.04em;
          font-size: 0.95rem;
        }
        .site-nav__sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }
        .site-nav__toggle {
          display: none;
        }
        .site-nav__links {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.35rem 0.75rem;
        }
        .site-nav__link {
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-pill);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
        }
        .site-nav__link:hover {
          color: var(--text-primary);
          text-decoration: none;
          background: var(--glow);
        }
        .site-nav__link.is-active {
          color: var(--text-primary);
          background: color-mix(in srgb, var(--accent-b) 12%, transparent);
        }
        .site-nav__admin {
          border: 1px dashed var(--border-glass);
        }
        .site-nav__theme {
          padding: 0.4rem 1rem;
          font-size: 0.85rem;
        }
        @media (max-width: 900px) {
          .site-nav__toggle {
            display: inline-flex;
          }
          .site-nav__links {
            display: none;
            position: absolute;
            left: 0.75rem;
            right: 0.75rem;
            top: calc(100% + 0.35rem);
            flex-direction: column;
            align-items: stretch;
            padding: 0.75rem;
            border-radius: var(--radius-lg);
            background: var(--bg-glass-strong);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-glass);
            box-shadow: var(--shadow-float);
          }
          .site-nav__links.is-open {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
