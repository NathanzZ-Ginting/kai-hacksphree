// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface UserData {
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userData: UserData;
  login: (token: string, user: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: "", email: "" });

  // Check token on app start
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      // Verify token dengan backend (optional)
      setIsLoggedIn(true);
      // Anda bisa fetch user data dari endpoint /me di sini
    }
  }, []);

  const login = (token: string, user: UserData) => {
    sessionStorage.setItem("authToken", token);
    setIsLoggedIn(true);
    setUserData(user);
  };

  const logout = () => {
    sessionStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUserData({ name: "", email: "" });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
