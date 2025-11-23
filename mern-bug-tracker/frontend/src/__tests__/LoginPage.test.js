import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '../pages/LoginPage.jsx';

// Mock the AuthContext BEFORE importing the component
jest.mock('../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    loading: false
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

test('Login page renders', () => {
  render(<LoginPage />);
  
  expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  expect(screen.getByText('Sign in to your BugTracker account')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
});