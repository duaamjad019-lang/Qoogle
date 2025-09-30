import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<User>;
  signup: (username: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'qoogle-users';
const CURRENT_USER_STORAGE_KEY = 'qoogle-currentUser';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const userJson = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("Failed to parse current user from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch (error) {
       console.error("Failed to set current user in localStorage", error);
    }
  }, [currentUser]);

  const getUsers = () => {
    try {
        const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        return usersJson ? JSON.parse(usersJson) : {};
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return {};
    }
  };

  const login = async (username: string, password: string): Promise<User> => {
    const users = getUsers();
    if (users[username] && users[username] === password) {
      const user = { username };
      setCurrentUser(user);
      return user;
    }
    throw new Error('Invalid username or password.');
  };

  const signup = async (username: string, password: string): Promise<User> => {
    const users = getUsers();
    if (users[username]) {
      throw new Error('Username already exists.');
    }
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
    }
    users[username] = password;
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        const user = { username };
        setCurrentUser(user);
        return user;
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
        throw new Error("Could not create account.");
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = { currentUser, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
