import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ── Auth Context ──────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

/**
 * Auth context provider.
 * Manages JWT token storage and user info parsing.
 *
 * In production this integrates with Google OAuth2.
 * For dev, a mock login is provided.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ── Init: check for existing token on mount ──────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user_info');

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        // corrupted storage - clear it
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
      }
    }
    setIsLoading(false);
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────

  /**
   * Called after OAuth2 flow completes and API returns a JWT.
   * Decodes the token to extract user info.
   */
  const login = useCallback((token) => {
    localStorage.setItem('access_token', token);

    // Decode JWT payload (base64)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userInfo = {
        sub: payload.sub,
        email: payload.email || payload.sub,
        name: payload.name || payload.sub,
        picture: payload.picture || null,
        roles: payload.roles || ['USER'],
      };
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      setUser(userInfo);
      setIsAuthenticated(true);
    } catch {
      console.error('Failed to decode JWT');
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
