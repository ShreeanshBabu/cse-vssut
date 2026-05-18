function normalizeOrigin(value) {
  if (!value) return '';
  return String(value).trim().replace(/\/+$/, '');
}

function parseAllowedOrigins() {
  const raw = [process.env.CLIENT_URL, process.env.CLIENT_URLS].filter(Boolean).join(',');
  return new Set(
    raw
      .split(',')
      .map((entry) => normalizeOrigin(entry))
      .filter(Boolean)
  );
}

function isLocalDevOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

function isVercelOrigin(origin) {
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

/**
 * CORS configuration:
 * - Dev: allow localhost origins
 * - Prod: allow CLIENT_URL / CLIENT_URLS and optional vercel.app previews
 */
export const corsOptions = {
  origin(origin, callback) {
    const normalized = normalizeOrigin(origin);

    if (process.env.NODE_ENV !== 'production') {
      if (!normalized || isLocalDevOrigin(normalized)) {
        callback(null, true);
        return;
      }
      callback(null, false);
      return;
    }

    // Allow non-browser or same-origin server-to-server requests.
    if (!normalized) {
      callback(null, true);
      return;
    }

    const allowedOrigins = parseAllowedOrigins();
    const allowVercelPreviews =
      String(process.env.ALLOW_VERCEL_PREVIEWS ?? 'true').toLowerCase() !== 'false';

    if (allowedOrigins.has(normalized) || (allowVercelPreviews && isVercelOrigin(normalized))) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};
