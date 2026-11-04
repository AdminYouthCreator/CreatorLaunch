import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  businessProgramApi,
  PROGRAM_TOKEN_KEY,
  PROGRAM_USER_KEY,
  ProgramUser,
} from '@/utils/businessProgramApi';

interface BusinessProgramContextValue {
  user: ProgramUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<ProgramUser>;
  logout: () => void;
}

const BusinessProgramContext = createContext<BusinessProgramContextValue | null>(null);

export const BusinessProgramProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ProgramUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(PROGRAM_TOKEN_KEY);
    const cached = localStorage.getItem(PROGRAM_USER_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (_error) {
        localStorage.removeItem(PROGRAM_USER_KEY);
      }
    }

    businessProgramApi
      .me()
      .then(({ user: currentUser }) => {
        setUser(currentUser);
        localStorage.setItem(PROGRAM_USER_KEY, JSON.stringify(currentUser));
      })
      .catch(() => {
        localStorage.removeItem(PROGRAM_TOKEN_KEY);
        localStorage.removeItem(PROGRAM_USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await businessProgramApi.login(email, password);
    localStorage.setItem(PROGRAM_TOKEN_KEY, result.token);
    localStorage.setItem(PROGRAM_USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
    return result.user as ProgramUser;
  };

  const logout = () => {
    localStorage.removeItem(PROGRAM_TOKEN_KEY);
    localStorage.removeItem(PROGRAM_USER_KEY);
    setUser(null);
  };

  return (
    <BusinessProgramContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </BusinessProgramContext.Provider>
  );
};

export const useBusinessProgram = () => {
  const context = useContext(BusinessProgramContext);
  if (!context) throw new Error('useBusinessProgram must be used inside BusinessProgramProvider');
  return context;
};
