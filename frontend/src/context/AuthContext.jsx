import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // We mock a logged in user state. In a real app, this would come from a login API / JWT.
  // Available roles: 'USER', 'ADMIN', 'TECHNICIAN'
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('uniops_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('uniops_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('uniops_user');
    }
  }, [currentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const mockLoginAs = useCallback((role) => {
    switch (role) {
      case 'ADMIN':
        setCurrentUser({ id: '99', name: 'Admin Manager', role: 'ADMIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' });
        break;
      case 'TECHNICIAN':
        setCurrentUser({ id: '10', name: 'John Doe (Tech)', role: 'TECHNICIAN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech' });
        break;
      case 'USER':
        setCurrentUser({ id: '1', name: 'Student User', role: 'USER', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' });
        break;
      default:
        setCurrentUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, mockLoginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
