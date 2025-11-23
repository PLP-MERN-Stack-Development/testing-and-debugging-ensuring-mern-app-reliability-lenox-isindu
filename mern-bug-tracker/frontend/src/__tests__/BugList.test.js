import React from 'react';
import { render, screen } from '@testing-library/react';
import BugList from '../components/BugTracker/BugList/BugList.jsx';

// Mock the AuthContext BEFORE importing the component
jest.mock('../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: { id: 'user1', username: 'testuser' },
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    loading: false
  })
}));

// Mock BugCard component
jest.mock('../components/BugTracker/BugCard/BugCard.jsx', () => {
  return function MockBugCard({ bug }) {
    return (
      <div data-testid="bug-card" key={bug._id}>
        <h3>{bug.title}</h3>
        <p>{bug.description}</p>
      </div>
    );
  };
});

const mockBugs = [
  {
    _id: '1',
    title: 'Bug 1',
    description: 'Description 1',
    project: 'Project 1',
    priority: 'high',
    status: 'open',
  },
  {
    _id: '2',
    title: 'Bug 2',
    description: 'Description 2',
    project: 'Project 2',
    priority: 'medium',
    status: 'in-progress',
  }
];

describe('BugList Component', () => {
  test('renders correct number of bug cards', () => {
    render(
      <BugList 
        bugs={mockBugs} 
        onUpdateBug={jest.fn()} 
        onDeleteBug={jest.fn()} 
      />
    );
    
    const bugCards = screen.getAllByTestId('bug-card');
    expect(bugCards).toHaveLength(2);
  });

  test('renders empty state when no bugs', () => {
    render(
      <BugList 
        bugs={[]} 
        onUpdateBug={jest.fn()} 
        onDeleteBug={jest.fn()} 
      />
    );
    
    expect(screen.getByText(/no bugs reported/i)).toBeInTheDocument();
    expect(screen.getByText(/all clear/i)).toBeInTheDocument();
    expect(screen.queryByTestId('bug-card')).not.toBeInTheDocument();
  });
});