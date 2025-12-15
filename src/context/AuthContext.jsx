import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { tokenStore } from "../utils/api";

const AuthContext = createContext(null);

/* ================= PROVIDER ================= */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  /* ================= INIT: CHECK TOKEN ================= */
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenStore.getAccessToken();
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.me();
        setUser(userData);
      } catch (error) {
  
        tokenStore.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /* ================= LOGIN ================= */
  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const userData = await authService.me();
    setUser(userData);
    return userData;
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
  try {
    await authService.logout(); 
  } catch (e) {
 
  } finally {
    tokenStore.clear(); 
    setUser(null);
  }
};


  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
