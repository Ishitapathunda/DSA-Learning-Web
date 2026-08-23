import { api } from './client';

export const fetchStreak = () => api.get('/streak');
export const fetchBadges = () => api.get('/badges');
export const fetchLeaderboard = () => api.get('/leaderboard');
export const fetchAnalytics = () => api.get('/analytics');
