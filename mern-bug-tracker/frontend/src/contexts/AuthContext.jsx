import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const joinWorkspace = async (workspaceCode) => {
    try {
      const response = await authService.joinWorkspace(workspaceCode);
      
      const updatedUser = { 
        ...user, 
        workspaces: [...(user?.workspaces || []), response.data] 
      };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser)); // sessionStorage
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to join workspace' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // clear both state and storage
      setUser(null);
      sessionStorage.removeItem('user'); 
    }
  };

  const updateUser = (updatedUserData) => {
    
    setUser(updatedUserData);
    sessionStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    login,
    register,
    logout,
    joinWorkspace,
    updateUser, 
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};