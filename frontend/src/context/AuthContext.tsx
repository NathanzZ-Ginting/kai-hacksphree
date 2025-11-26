// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

// Tipe data untuk user
interface UserData {
  name: string;
  email: string;
}

// Tipe data untuk context
interface AuthContextType {
  isLoggedIn: boolean;
  userData: UserData | null;
  login: (token: string, user: UserData) => void;
  logout: () => void;
}

// Buat context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State untuk status login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State untuk menyimpan data user
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check token and user data on app start AND on storage changes
  useEffect(() => {
    // Function to check auth status
    const checkAuthStatus = () => {

      // Cek token dan user data di storage
      const token = sessionStorage.getItem("authToken");

      // Ambil user data dari localStorage
      const storedUserData = localStorage.getItem("userData");

      // Jika token dan user data ada, set status login true
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

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to handle login
  const login = (token: string, user: UserData) => {
    sessionStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(user));
    setIsLoggedIn(true);
    setUserData(user);
  };

  // Function to handle logout
  const logout = () => {
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
    setIsLoggedIn(false);
    setUserData(null);
  };

  // Provide context values
  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
