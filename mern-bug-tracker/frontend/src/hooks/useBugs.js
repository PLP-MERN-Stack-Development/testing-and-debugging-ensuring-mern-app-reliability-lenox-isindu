import { useState, useEffect } from 'react';
import { bugService } from '../services/bugService';

export const useBugs = (workspaceId) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all bugs for workspace
  const fetchBugs = async (id = workspaceId) => {
    if (!id) {
      setBugs([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await bugService.getBugs(id);
      
      
      const processedBugs = response.data.map(bug => ({
        ...bug,
        reporter: bug.reporter || { username: 'Unknown User' },
        assignee: bug.assignee || { username: 'Unassigned' }
      }));
      
      setBugs(processedBugs);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  // Create new bug
  const createBug = async (bugData) => {
    try {
      setError(null);
      const response = await bugService.createBug(bugData);
      
      
      const newBug = {
        ...response.data,
        reporter: response.data.reporter || { username: 'Current User' },
        assignee: response.data.assignee || { username: 'Unassigned' }
      };
      
      setBugs(prev => [newBug, ...prev]);
      return { success: true, data: newBug };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create bug';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Update bug
  const updateBug = async (id, bugData) => {
    try {
      setError(null);
      const response = await bugService.updateBug(id, bugData);
      
      
      const updatedBug = {
        ...response.data,
        reporter: response.data.reporter || { username: 'Unknown User' },
        assignee: response.data.assignee || { username: 'Unassigned' }
      };
      
      setBugs(prev => prev.map(bug => 
        bug._id === id ? updatedBug : bug
      ));
      return { success: true, data: updatedBug };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update bug';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Delete bug
  const deleteBug = async (id) => {
    try {
      setError(null);
      await bugService.deleteBug(id);
      setBugs(prev => prev.filter(bug => bug._id !== id));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete bug';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchBugs();
    }
  }, [workspaceId]);

  return {
    bugs,
    loading,
    error,
    fetchBugs,
    createBug,
    updateBug,
    deleteBug,
  };
};