/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { User } from "../types/User";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AuthContextData {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return navigate("/login");
      const response = await axios.get("http://localhost:3001/auth", {
        headers: { accessToken: token },
      });
      if (response.data.error) return;
      setUser(response.data);
      setLoading(false);
    };

    getUser();
  }, []);

  const logout = async () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
