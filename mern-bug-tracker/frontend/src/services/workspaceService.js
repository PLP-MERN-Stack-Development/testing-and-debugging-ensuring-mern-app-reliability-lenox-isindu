import api from './api';


export const workspaceService = {
  // Get user's workspaces
  getMyWorkspaces: async () => {
    const response = await api.get('/workspaces');
    return response.data;
  },

  // Create workspace
  createWorkspace: async (workspaceData) => {
    const response = await api.post('/workspaces/create', workspaceData);
    return response.data;
  },

  // Get workspace members
  getWorkspaceMembers: async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  },

  // Remove member from workspace
  removeMember: async (workspaceId, memberId) => {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
    return response.data;
  }
};


export default workspaceService;