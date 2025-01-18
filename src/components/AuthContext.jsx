// src/contexts/AuthContext.js
"use client"; // Mark this file as a Client Component

import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Example login function
  const login = (userData) => {
    setUser(userData);
  };

  // Example logout function
  const logout = () => {
    setUser(null);
  };

  // Value to be provided by the context
  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);