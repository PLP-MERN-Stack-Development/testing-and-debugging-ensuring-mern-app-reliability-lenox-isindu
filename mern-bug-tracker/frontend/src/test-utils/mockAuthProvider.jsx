import React from 'react';

const MockAuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(MockAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children, user = null }) => {
  const value = {
    user,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    joinWorkspace: jest.fn(),
    updateUser: jest.fn(),
    loading: false
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};