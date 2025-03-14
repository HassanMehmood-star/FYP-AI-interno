// AutContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); // Check for token on initial load

  const login = () => {
    setIsAuthenticated(true);
    console.log("User logged in: isAuthenticated =", true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    console.log("User logged out: isAuthenticated =", false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
