import api from './api';

export const bugService = {
  // Get all bugs for workspace
  getBugs: async (workspaceId) => {
    const response = await api.get(`/bugs?workspaceId=${workspaceId}`);
    return response.data;
  },

  // Create new bug
  createBug: async (bugData) => {
    const response = await api.post('/bugs', bugData);
    return response.data;
  },

  // Update bug
  updateBug: async (id, bugData) => {
    const response = await api.put(`/bugs/${id}`, bugData);
    return response.data;
  },

  // Delete bug
  deleteBug: async (id) => {
    const response = await api.delete(`/bugs/${id}`);
    return response.data;
  },
};