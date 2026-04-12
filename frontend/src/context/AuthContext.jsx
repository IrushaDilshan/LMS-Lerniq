import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // We mock a logged in user state. In a real app, this would come from a login API / JWT.
  // Available roles: 'USER', 'ADMIN', 'TECHNICIAN'
  
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Student User',
    role: 'USER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });

  const mockLoginAs = (role) => {
    switch (role) {
      case 'ADMIN':
        setCurrentUser({ id: 99, name: 'Admin Manager', role: 'ADMIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' });
        break;
      case 'TECHNICIAN':
        setCurrentUser({ id: 10, name: 'John Doe (Tech)', role: 'TECHNICIAN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech' });
        break;
      case 'USER':
      default:
        setCurrentUser({ id: 1, name: 'Student User', role: 'USER', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' });
        break;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, mockLoginAs }}>
      {children}
    </AuthContext.Provider>
  );
};
