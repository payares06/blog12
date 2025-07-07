import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const profile = await authAPI.getProfile();
          setUser({
            id: profile._id || profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            profileImage: profile.profileImage,
            createdAt: profile.createdAt,
            lastLogin: profile.lastLogin
          });
        } catch (error) {
          console.error('Failed to get user profile:', error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      setUser({
        id: response.user.id || response.user._id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        profileImage: response.user.profileImage,
        lastLogin: response.user.lastLogin
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.register(name, email, password);
      setUser({
        id: response.user.id || response.user._id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        profileImage: response.user.profileImage
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const updateProfile = async (profileData: { name?: string; profileImage?: string }): Promise<boolean> => {
    try {
      const updatedUser = await authAPI.updateProfile(profileData);
      setUser(prev => prev ? {
        ...prev,
        name: updatedUser.name,
        profileImage: updatedUser.profileImage
      } : null);
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};