import api from './api';

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.user) {
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.user) {
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Join workspace
  joinWorkspace: async (workspaceCode) => {
    const response = await api.post('/auth/join-workspace', { workspaceCode });
    return response.data;
  },

  // Logout
  logout: async () => {
    sessionStorage.removeItem('user');
    await api.post('/auth/logout');
  },

  // Get current user
  getCurrentUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};