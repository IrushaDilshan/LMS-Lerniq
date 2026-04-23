import React, { createContext, useState, useContext, useCallback } from 'react';
import { oauthLogin } from '../api/users';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const logout = useCallback(() => {
    setCurrentUser(null);
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
      setCurrentUser({
        id: data.externalUserId ?? profile.id,
        name: data.fullName ?? profile.name,
        role: data.role ?? 'USER',
        avatar: data.avatarUrl ?? profile.avatar,
        email: data.email ?? profile.email,
        authProvider: data.authProvider ?? 'GOOGLE',
      });
    } catch (error) {
      // Fallback keeps local development unblocked when API is offline.
      setCurrentUser({
        id: profile.id,
        name: profile.name,
        role: 'USER',
        avatar: profile.avatar,
        email: profile.email,
        authProvider: 'GOOGLE',
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, mockLoginAs, loginWithOAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
