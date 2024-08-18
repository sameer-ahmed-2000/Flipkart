import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { cookies } from "next/headers";
// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component to manage authentication state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for token in localStorage on initial render
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Handle login by setting token and updating authentication state
  const login = (token: string) => {
    Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });
    setIsAuthenticated(true);
  };

  // Handle logout by removing token and updating authentication state
  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Provide authentication state and functions to child components
  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
