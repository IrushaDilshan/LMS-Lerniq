import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { 
  login as loginAPI, 
  signup as signupAPI,
  requestStudentSignupOtp as requestOtpAPI,
  verifyStudentSignupOtp as verifyOtpAPI
} from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("uniops_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("uniops_user");
      }
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("uniops_user");
    setCurrentUser(null);
  }, []);

  const login = useCallback(async (email, password, role) => {
    try {
      const response = await loginAPI(email, password, role);
      const userData = {
        id: response.id,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(response.fullName)}`,
      };
      setCurrentUser(userData);
      localStorage.setItem("uniops_user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  }, []);

  const signup = useCallback(async (fullName, email, password, role) => {
    try {
      const response = await signupAPI(fullName, email, password, role);
      const userData = {
        id: response.id,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(response.fullName)}`,
      };
      setCurrentUser(userData);
      localStorage.setItem("uniops_user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  }, []);

  const requestStudentSignupOtp = useCallback(async (fullName, email, password, role) => {
    try {
      const response = await requestOtpAPI(fullName, email, password, role);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const verifyStudentSignupOtp = useCallback(async (email, otp) => {
    try {
      const response = await verifyOtpAPI(email, otp);
      const userData = {
        id: response.id,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(response.fullName)}`,
      };
      setCurrentUser(userData);
      localStorage.setItem("uniops_user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  }, []);

  const mockLoginAs = useCallback((role) => {
    let user = null;

    switch (role) {
      case "ADMIN":
        user = {
          id: "99",
          fullName: "Admin Manager",
          role: "ADMIN",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        };
        break;

      case "TECHNICIAN":
        user = {
          id: "10",
          fullName: "John Doe (Tech)",
          role: "TECHNICIAN",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
        };
        break;

      case "USER":
        user = {
          id: "1",
          fullName: "Student User",
          role: "USER",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        };
        break;

      default:
        user = null;
    }

    setCurrentUser(user);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      mockLoginAs, 
      logout, 
      login, 
      signup,
      requestStudentSignupOtp,
      verifyStudentSignupOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};