import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('uniops_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('uniops_user', JSON.stringify(currentUser));
      if (currentUser.token) {
        localStorage.setItem('uniops_token', currentUser.token);
      }
    } else {
      localStorage.removeItem('uniops_user');
      localStorage.removeItem('uniops_token');
    }
  }, [currentUser]);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { usernameOrEmail, password });
      const userData = {
        id: res.data.id || res.data.userId,
        name: res.data.username,
        role: res.data.role,
        token: res.data.accessToken,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.data.username}`
      };
      setCurrentUser(userData);
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, message: err.response?.data?.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
