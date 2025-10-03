// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface UserData {
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userData: UserData | null;
  login: (token: string, user: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check token and user data on app start AND on storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = sessionStorage.getItem("authToken");
      const storedUserData = localStorage.getItem("userData");

      if (token && storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          setIsLoggedIn(true);
          setUserData(user);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          // Clear invalid data
          sessionStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setIsLoggedIn(false);
          setUserData(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    // Check initial status
    checkAuthStatus();

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "userData") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (token: string, user: UserData) => {
    sessionStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(user));
    setIsLoggedIn(true);
    setUserData(user);
  };

  const logout = () => {
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
    setIsLoggedIn(false);
    setUserData(null);
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
