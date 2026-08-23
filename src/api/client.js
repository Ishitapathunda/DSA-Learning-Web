// Minimal fetch wrapper for the backend API.
//
// In dev, requests to /api/* are proxied to the Express server by Vite
// (see vite.config.js), so this stays same-origin and the httpOnly auth
// cookie is sent automatically. `credentials: 'include'` also makes this
// work if the frontend and backend are ever deployed on different origins,
// as long as the backend's CORS `origin` + `credentials: true` match.
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClientError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = 'GET', body, ...rest } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = data?.error?.message || 'Something went wrong. Please try again.';
    throw new ApiClientError(message, response.status, data?.error?.details);
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export { ApiClientError };
