/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { User } from "../types/User";
import axios from "axios";

interface ProfileContextData {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  getUser: () => Promise<void>;
}

export const ProfileContext = createContext({} as ProfileContextData);

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    const response = await axios.get("http://localhost:3001/users", {
      headers: { accessToken: localStorage.getItem("token") },
    });

    setUser(response.data);
  };

  return (
    <ProfileContext.Provider value={{ user, setUser, getUser }}>
      {children}
    </ProfileContext.Provider>
  );
};
