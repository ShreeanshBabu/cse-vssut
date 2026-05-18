import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MadeWithLove } from '../components/MadeWithLove.jsx';
import { VSSUT_UNIVERSITY } from '../data/vssut.js';

export function AdminLogin() {
  const { login, isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (ready && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login container">
      <div className="glass-panel admin-login__card" data-reveal>
        <h1 className="admin-login__title">Admin sign in</h1>
        <p className="admin-login__lead">
          CMS for {VSSUT_UNIVERSITY.shortName} CSE — manage notices, announcements, and faculty.
          Changes sync to the public site via the API.
        </p>
        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <MadeWithLove compact />
      </div>
      <style>{`
        .admin-login {
          min-height: calc(100vh - var(--nav-h) - 4rem);
          display: grid;
          place-items: center;
          padding: 2rem 0;
        }
        .admin-login__card {
          width: min(420px, 100%);
          padding: 2rem;
        }
        .admin-login__title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 400;
          margin: 0 0 0.5rem;
        }
        .admin-login__lead {
          margin: 0 0 1.5rem;
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .admin-login__form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .admin-field input {
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
          background: var(--bg-base);
        }
        .admin-login__error {
          margin: 0;
          color: #f87171;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
