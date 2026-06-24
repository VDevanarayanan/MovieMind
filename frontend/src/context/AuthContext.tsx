import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../services/api";

interface AuthState {
  token: string | null;
  email: string | null;
}

interface AuthContextValue extends AuthState {
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialToken = localStorage.getItem("moviemind_token");
  const initialEmail = localStorage.getItem("moviemind_email");
  const [token, setToken] = useState<string | null>(initialToken);
  const [email, setEmail] = useState<string | null>(initialEmail);

  useEffect(() => {
    if (initialToken) {
      setAuthToken(initialToken);
    }
  }, [initialToken]);

  const login = (authToken: string, userEmail: string) => {
    localStorage.setItem("moviemind_token", authToken);
    localStorage.setItem("moviemind_email", userEmail);
    setToken(authToken);
    setEmail(userEmail);
    setAuthToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem("moviemind_token");
    localStorage.removeItem("moviemind_email");
    setToken(null);
    setEmail(null);
    setAuthToken();
  };

  return (
    <AuthContext.Provider value={{ token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
