import { api } from './client';

export const fetchProblems = () => api.get('/problems');
export const fetchProblemBySlug = (slug) => api.get(`/problems/${slug}`);
