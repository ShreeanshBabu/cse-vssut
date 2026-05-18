function normalizeApiBase(value) {
  const trimmed = String(value || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.endsWith('/api') ? trimmed.slice(0, -4) : trimmed;
}

// Support both VITE_API_URL (current) and VITE_API_BASE_URL (legacy .env naming).
const base = normalizeApiBase(
  import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? ''
);

async function parseJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const { skipAuth, timeoutMs, ...init } = options;
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token && !skipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const controller = new AbortController();
  const timeoutId =
    typeof timeoutMs === 'number' && timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

  let res;
  try {
    res = await fetch(`${base}${path}`, {
      ...init,
      headers,
      credentials: 'include',
      signal: init.signal ?? controller.signal,
    });
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
  const data = await parseJson(res);
  if (!res.ok) {
    const firstErr = data?.errors?.[0];
    const msg =
      data?.message ||
      (typeof firstErr === 'string' ? firstErr : firstErr?.msg) ||
      res.statusText ||
      'Request failed';
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const publicApi = {
  notices: (params) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/api/public/notices${q ? `?${q}` : ''}`, { skipAuth: true });
  },
  faculty: () => apiFetch('/api/public/faculty', { skipAuth: true }),
  announcements: () => apiFetch('/api/public/announcements', { skipAuth: true }),
  chat: (message) =>
    apiFetch('/api/public/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      skipAuth: true,
      timeoutMs: 20000,
    }),
};

export const authApi = {
  login: (body) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
  refresh: () => apiFetch('/api/auth/refresh', { method: 'POST' }),
};

export const adminApi = {
  notices: {
    list: (params) => {
      const q = new URLSearchParams(params).toString();
      return apiFetch(`/api/notices${q ? `?${q}` : ''}`);
    },
    create: (body) => apiFetch('/api/notices', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) =>
      apiFetch(`/api/notices/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => apiFetch(`/api/notices/${id}`, { method: 'DELETE' }),
  },
  announcements: {
    list: () => apiFetch('/api/announcements'),
    create: (body) => apiFetch('/api/announcements', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) =>
      apiFetch(`/api/announcements/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => apiFetch(`/api/announcements/${id}`, { method: 'DELETE' }),
  },
  faculty: {
    list: () => apiFetch('/api/faculty'),
    /** @param {FormData | object} body */
    create: (body) =>
      apiFetch('/api/faculty', {
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    /** @param {string} id @param {FormData | object} body */
    update: (id, body) =>
      apiFetch(`/api/faculty/${id}`, {
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/api/faculty/${id}`, { method: 'DELETE' }),
  },
};
