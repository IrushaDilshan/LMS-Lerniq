import React, { createContext, useState, useContext, useCallback } from 'react';
import { oauthLogin } from '../api/users';
import { login, register } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const applyAuthState = useCallback((data, fallback = {}) => {
    const roleValue = data.role ?? fallback.role ?? 'USER';
    const normalizedRole = String(roleValue).replace('ROLE_', '');
    setCurrentUser({
      id: data.id ?? data.externalUserId ?? fallback.id ?? Date.now(),
      name: data.name ?? data.fullName ?? fallback.name ?? 'Campus User',
      role: normalizedRole,
      avatar: data.avatarUrl ?? fallback.avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      email: data.email ?? fallback.email,
      authProvider: data.authProvider ?? fallback.authProvider ?? 'LOCAL',
    });
    if (data.token) {
      setAuthToken(data.token);
      localStorage.setItem('authToken', data.token);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
  }, []);

  const mockLoginAs = useCallback((role) => {
    switch (role) {
      case 'ADMIN':
        setCurrentUser({ id: 99, name: 'Admin Manager', role: 'ADMIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' });
        break;
      case 'TECHNICIAN':
        setCurrentUser({ id: 10, name: 'John Doe (Tech)', role: 'TECHNICIAN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech' });
        break;
      case 'USER':
        setCurrentUser({ id: 1, name: 'Student User', role: 'USER', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' });
        break;
      default:
        setCurrentUser(null);
    }
  }, []);

  const loginWithOAuth = useCallback(async (profile) => {
    const payload = {
      fullName: profile.name,
      email: profile.email,
      authProvider: 'GOOGLE',
      providerToken: profile.providerToken,
      externalUserId: profile.id,
      avatarUrl: profile.avatar,
    };

    try {
      const { data } = await oauthLogin(payload);
      applyAuthState(data, {
        id: profile.id,
        name: profile.name,
        role: 'USER',
        avatar: profile.avatar,
        email: profile.email,
        authProvider: 'GOOGLE',
      });
    } catch (error) {
      // Fallback keeps local development unblocked when API is offline.
      applyAuthState({}, {
        id: profile.id,
        name: profile.name,
        role: 'USER',
        avatar: profile.avatar,
        email: profile.email,
        authProvider: 'GOOGLE',
      });
    }
  }, [applyAuthState]);

  const loginWithPassword = useCallback(async ({ email, password }) => {
    try {
      const { data } = await login({ email, password });
      applyAuthState(data, { email, authProvider: 'LOCAL' });
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || error.response?.data || 'Invalid email or password.',
      };
    }
  }, [applyAuthState]);

  const registerWithPassword = useCallback(async ({ name, email, password }) => {
    try {
      const { data } = await register({ name, email, password });
      applyAuthState(data, { name, email, authProvider: 'LOCAL' });
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || error.response?.data || 'Unable to register account.',
      };
    }
  }, [applyAuthState]);

  return (
    <AuthContext.Provider value={{ currentUser, authToken, mockLoginAs, loginWithOAuth, loginWithPassword, registerWithPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
