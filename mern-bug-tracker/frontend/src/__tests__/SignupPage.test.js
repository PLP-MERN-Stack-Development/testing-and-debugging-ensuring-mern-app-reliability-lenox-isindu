import React from 'react';
import { render, screen } from '@testing-library/react';
import SignupPage from '../pages/SignupPage.jsx';

// Mock the AuthContext BEFORE importing the component
jest.mock('../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: null,
    register: jest.fn(),
    loading: false
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

test('Signup page renders', () => {
  render(<SignupPage />);
  
  expect(screen.getByText('Create Account')).toBeInTheDocument();
  expect(screen.getByText('Create your BugTracker account')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
});