import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../api/client';
import { VssutPageBanner } from '../components/VssutPageBanner.jsx';
import { VSSUT_UNIVERSITY } from '../data/vssut.js';

const tabs = [
  { id: 'notices', label: 'Notices' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'faculty', label: 'Faculty' },
];

export function AdminDashboard() {
  const { isAuthenticated, ready, logout, user } = useAuth();
  const [tab, setTab] = useState('notices');

  if (ready && !isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (!ready) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <p>Loading session…</p>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <VssutPageBanner
        pageTitle="CMS dashboard"
        pageDescription={`Content management for CSE, ${VSSUT_UNIVERSITY.shortName} Burla.`}
      />
      <div className="container">
      <header className="admin-dash__header glass-panel">
        <div>
          <h1 className="admin-dash__title">CMS dashboard</h1>
          <p className="admin-dash__sub">
            {user?.name ? `Signed in as ${user.name}` : 'Administrator'}
          </p>
        </div>
        <div className="admin-dash__actions">
          <Link to="/" className="btn btn--ghost">
            View site
          </Link>
          <button type="button" className="btn" onClick={() => logout()}>
            Log out
          </button>
        </div>
      </header>

      <div className="admin-tabs" role="tablist" aria-label="CMS sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`admin-tabs__btn ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'notices' && <AdminNotices />}
      {tab === 'announcements' && <AdminAnnouncements />}
      {tab === 'faculty' && <AdminFaculty />}

      </div>

      <style>{`
        .admin-dash {
          padding: 1.5rem 0 3rem;
        }
        .admin-dash__header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.25rem;
        }
        .admin-dash__title {
          margin: 0;
          font-size: 1.35rem;
        }
        .admin-dash__sub {
          margin: 0.25rem 0 0;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .admin-dash__actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .admin-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .admin-tabs__btn {
          border: 1px solid var(--border-glass);
          background: var(--bg-glass);
          backdrop-filter: blur(12px);
          padding: 0.45rem 1rem;
          border-radius: var(--radius-pill);
          cursor: pointer;
          font-weight: 600;
          color: var(--text-muted);
        }
        .admin-tabs__btn.is-active {
          color: var(--text-primary);
          border-color: color-mix(in srgb, var(--accent-b) 40%, transparent);
          box-shadow: 0 0 20px var(--glow);
        }
        .admin-panel {
          display: grid;
          gap: 1.5rem;
        }
        @media (min-width: 960px) {
          .admin-panel {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .admin-form label span {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--text-muted);
        }
        .admin-form input,
        .admin-form textarea,
        .admin-form select {
          width: 100%;
          padding: 0.55rem 0.65rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
          background: var(--bg-base);
        }
        .admin-form textarea {
          min-height: 100px;
          resize: vertical;
        }
        .admin-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-height: 70vh;
          overflow: auto;
        }
        .admin-list li {
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          background: var(--bg-glass);
        }
        .admin-list h4 {
          margin: 0 0 0.35rem;
          font-size: 0.95rem;
        }
        .admin-list p {
          margin: 0;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .admin-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.5rem;
        }
        .admin-msg {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
        }
        .admin-msg--err {
          color: #f87171;
        }
      `}</style>
    </div>
  );
}

function AdminNotices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    body: '',
    priority: 'normal',
    status: 'published',
  });

  const load = useCallback(() => {
    setLoading(true);
    adminApi.notices
      .list({ limit: 50, page: 1 })
      .then((res) => setItems(res?.data?.notices ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(n) {
    setEditing(n);
    setForm({
      title: n.title,
      body: n.body,
      priority: n.priority,
      status: n.status,
    });
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await adminApi.notices.update(editing._id, form);
      } else {
        await adminApi.notices.create(form);
      }
      setEditing(null);
      setForm({ title: '', body: '', priority: 'normal', status: 'published' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this notice?')) return;
    setError('');
    try {
      await adminApi.notices.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-panel">
      <form className="glass-panel admin-form" onSubmit={save} style={{ padding: '1.25rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
          {editing ? 'Edit notice' : 'New notice'}
        </h2>
        {error && <p className="admin-msg admin-msg--err">{error}</p>}
        <label>
          <span>Title</span>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Body</span>
          <textarea
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Priority</span>
          <select
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
          >
            <option value="low">low</option>
            <option value="normal">normal</option>
            <option value="urgent">urgent</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </label>
        <div className="admin-row">
          <button type="submit" className="btn btn--primary">
            {editing ? 'Update' : 'Create'}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setEditing(null);
                setForm({ title: '', body: '', priority: 'normal', status: 'published' });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.25rem', margin: '0 0 1rem' }}>
          All notices
        </h2>
        {loading && <p className="admin-msg">Loading…</p>}
        <ul className="admin-list">
          {items.map((n) => (
            <li key={n._id}>
              <h4>{n.title}</h4>
              <p>
                {n.status} · {n.priority}
              </p>
              <div className="admin-row">
                <button type="button" className="btn btn--ghost" onClick={() => startEdit(n)}>
                  Edit
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => remove(n._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    body: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const load = useCallback(() => {
    setLoading(true);
    adminApi.announcements
      .list()
      .then((res) => setItems(res?.data?.announcements ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function toLocalInput(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function startEdit(a) {
    setEditing(a);
    setForm({
      title: a.title,
      body: a.body,
      startDate: toLocalInput(a.startDate),
      endDate: toLocalInput(a.endDate),
      isActive: a.isActive,
    });
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        title: form.title,
        body: form.body,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        isActive: Boolean(form.isActive),
      };
      if (editing) {
        await adminApi.announcements.update(editing._id, payload);
      } else {
        await adminApi.announcements.create(payload);
      }
      setEditing(null);
      setForm({ title: '', body: '', startDate: '', endDate: '', isActive: true });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this announcement?')) return;
    setError('');
    try {
      await adminApi.announcements.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-panel">
      <form className="glass-panel admin-form" onSubmit={save} style={{ padding: '1.25rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
          {editing ? 'Edit announcement' : 'New announcement'}
        </h2>
        {error && <p className="admin-msg admin-msg--err">{error}</p>}
        <label>
          <span>Title</span>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Body</span>
          <textarea
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Start (local)</span>
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>End (local)</span>
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            required
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
          <span>Active</span>
        </label>
        <div className="admin-row">
          <button type="submit" className="btn btn--primary">
            {editing ? 'Update' : 'Create'}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setEditing(null);
                setForm({ title: '', body: '', startDate: '', endDate: '', isActive: true });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.25rem', margin: '0 0 1rem' }}>
          All announcements
        </h2>
        {loading && <p className="admin-msg">Loading…</p>}
        <ul className="admin-list">
          {items.map((a) => (
            <li key={a._id}>
              <h4>{a.title}</h4>
              <p>
                {a.isActive ? 'active' : 'inactive'} · {new Date(a.startDate).toLocaleString()} –{' '}
                {new Date(a.endDate).toLocaleString()}
              </p>
              <div className="admin-row">
                <button type="button" className="btn btn--ghost" onClick={() => startEdit(a)}>
                  Edit
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => remove(a._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AdminFaculty() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    name: '',
    designation: '',
    email: '',
    phone: '',
    bio: '',
    googleScholarUrl: '',
    displayOrder: 0,
    researchAreasText: '',
  });

  const load = useCallback(() => {
    setLoading(true);
    adminApi.faculty
      .list()
      .then((res) => setItems(res?.data?.faculty ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(f) {
    setEditing(f);
    setImage(null);
    setForm({
      name: f.name,
      designation: f.designation,
      email: f.email,
      phone: f.phone || '',
      bio: f.bio || '',
      googleScholarUrl: f.googleScholarUrl || '',
      displayOrder: f.displayOrder ?? 0,
      researchAreasText: (f.researchAreas || []).join(', '),
    });
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    const researchAreas = form.researchAreasText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      if (image) {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('designation', form.designation);
        fd.append('email', form.email);
        fd.append('phone', form.phone);
        fd.append('bio', form.bio);
        fd.append('googleScholarUrl', form.googleScholarUrl);
        fd.append('displayOrder', String(form.displayOrder));
        fd.append('researchAreas', JSON.stringify(researchAreas));
        fd.append('image', image);
        if (editing) {
          await adminApi.faculty.update(editing._id, fd);
        } else {
          await adminApi.faculty.create(fd);
        }
      } else {
        const payload = {
          name: form.name,
          designation: form.designation,
          email: form.email,
          phone: form.phone,
          bio: form.bio,
          googleScholarUrl: form.googleScholarUrl,
          displayOrder: Number(form.displayOrder) || 0,
          researchAreas,
        };
        if (editing) {
          await adminApi.faculty.update(editing._id, payload);
        } else {
          await adminApi.faculty.create(payload);
        }
      }
      setEditing(null);
      setImage(null);
      setForm({
        name: '',
        designation: '',
        email: '',
        phone: '',
        bio: '',
        googleScholarUrl: '',
        displayOrder: 0,
        researchAreasText: '',
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this faculty member?')) return;
    setError('');
    try {
      await adminApi.faculty.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-panel">
      <form className="glass-panel admin-form" onSubmit={save} style={{ padding: '1.25rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
          {editing ? 'Edit faculty' : 'New faculty'}
        </h2>
        {error && <p className="admin-msg admin-msg--err">{error}</p>}
        <label>
          <span>Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Designation</span>
          <input
            value={form.designation}
            onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Phone</span>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </label>
        <label>
          <span>Research areas (comma-separated)</span>
          <input
            value={form.researchAreasText}
            onChange={(e) => setForm((f) => ({ ...f, researchAreasText: e.target.value }))}
          />
        </label>
        <label>
          <span>Bio</span>
          <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
        </label>
        <label>
          <span>Google Scholar URL</span>
          <input
            value={form.googleScholarUrl}
            onChange={(e) => setForm((f) => ({ ...f, googleScholarUrl: e.target.value }))}
          />
        </label>
        <label>
          <span>Display order</span>
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
          />
        </label>
        <label>
          <span>Photo (optional)</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </label>
        <div className="admin-row">
          <button type="submit" className="btn btn--primary">
            {editing ? 'Update' : 'Create'}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setEditing(null);
                setImage(null);
                setForm({
                  name: '',
                  designation: '',
                  email: '',
                  phone: '',
                  bio: '',
                  googleScholarUrl: '',
                  displayOrder: 0,
                  researchAreasText: '',
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.25rem', margin: '0 0 1rem' }}>
          Faculty records
        </h2>
        {loading && <p className="admin-msg">Loading…</p>}
        <ul className="admin-list">
          {items.map((f) => (
            <li key={f._id}>
              <h4>{f.name}</h4>
              <p>{f.designation}</p>
              <div className="admin-row">
                <button type="button" className="btn btn--ghost" onClick={() => startEdit(f)}>
                  Edit
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => remove(f._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
