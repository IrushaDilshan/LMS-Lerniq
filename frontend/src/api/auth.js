import axios from 'axios';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8089/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = (payload) => authApi.post('/login', payload);

export const register = (payload) => authApi.post('/register', payload);
