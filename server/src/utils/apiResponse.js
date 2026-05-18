/**
 * Standard success response body (no HTTP status — set via res.status()).
 * @param {object} [data]
 * @param {string} [message]
 * @returns {{ success: true, message?: string, data?: object }}
 */
export function apiSuccess(data, message) {
  const payload = { success: true };
  if (message !== undefined && message !== null) payload.message = message;
  if (data !== undefined) payload.data = data;
  return payload;
}
