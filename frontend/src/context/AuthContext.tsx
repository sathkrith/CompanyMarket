import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, onSuccess: () => void) => Promise<void>;
  register: (username: string, password: string, onSuccess: () => void) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider mounted', { user });
    return () => {
      console.log('AuthProvider unmounted');
    };
  }, [user]);

  const login = async (username: string, password: string, onSuccess: () => void) => {
    console.log('Attempting login with', username);
    try {
      const response = await axios.post('/api/login', { username, password });
      setUser({username});
      setToken(response.data.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      console.log('Login successful', response.data);
      onSuccess();
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (username: string, password: string, onSuccess: () => void) => {
    console.log('Attempting registration with', username);
    try {
      const response = await axios.post('/api/register', { username, password });
      setUser({username});
      setToken(response.data.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      console.log('Registration successful', response.data);
      onSuccess();
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out');
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
