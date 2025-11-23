import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BugForm from '../components/BugTracker/BugForm/BugForm.jsx';

jest.mock('../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: { id: 'user1', username: 'testuser' },
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    loading: false
  })
}));

const mockSubmit = jest.fn();

describe('BugForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields', () => {
    render(<BugForm onSubmit={mockSubmit} />);
    
   
    expect(screen.getByPlaceholderText(/e.g., Website Redesign, Mobile App/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Brief description of the bug/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Detailed description of the bug/i)).toBeInTheDocument();
  });

  test('allows user to fill form fields', () => {
    render(<BugForm onSubmit={mockSubmit} />);
    
    // Use getByPlaceholderText for form inputs
    const projectInput = screen.getByPlaceholderText(/e.g., Website Redesign, Mobile App/i);
    const bugInput = screen.getByPlaceholderText(/Brief description of the bug/i);
    
    fireEvent.change(projectInput, {
      target: { value: 'Test Project' }
    });
    fireEvent.change(bugInput, {
      target: { value: 'Test Bug' }
    });
    
    expect(projectInput).toHaveValue('Test Project');
    expect(bugInput).toHaveValue('Test Bug');
  });
});