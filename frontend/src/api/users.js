import api from './axios';

export const fetchUsers = () => api.get('/users');

export const updateUserRole = (id, role) =>
  api.patch(`/users/${id}/role`, { role });

export const oauthLogin = (payload) =>
  api.post('/users/oauth-login', payload);
