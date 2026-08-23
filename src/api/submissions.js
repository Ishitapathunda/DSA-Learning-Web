import { api } from './client';

export const runCode = (slug, code) => api.post('/submissions/run', { slug, code });
export const submitCode = (slug, code) => api.post('/submissions', { slug, code });
export const fetchSubmissions = (slug) => api.get(`/submissions${slug ? `?slug=${encodeURIComponent(slug)}` : ''}`);
