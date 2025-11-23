import { useState, useEffect } from 'react';
import { workspaceService } from '../../../services/workspaceService';

const BugForm = ({ onSubmit, loading = false, currentWorkspace }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    projectTitle: '',
    githubRepo: '',
    assignee: ''
  });
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState('');

  useEffect(() => {
    if (currentWorkspace) {
      loadWorkspaceMembers();
    }
  }, [currentWorkspace]);

  const loadWorkspaceMembers = async () => {
    try {
      const response = await workspaceService.getWorkspaceMembers(currentWorkspace._id);
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAssigneeSearch = (searchTerm) => {
    setAssigneeSearch(searchTerm);
    
    if (searchTerm.length > 0) {
      const filtered = members.filter(member =>
        member.userId.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
      setShowMemberSearch(true);
    } else {
      setShowMemberSearch(false);
    }
  };

  const selectMember = (member) => {
    setFormData({
      ...formData,
      assignee: member.userId._id
    });
    setAssigneeSearch(member.userId.username);
    setShowMemberSearch(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      workspaceId: currentWorkspace._id
    };
    
    onSubmit(submitData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      projectTitle: '',
      githubRepo: '',
      assignee: ''
    });
    setAssigneeSearch('');
  };

  const getSelectedMemberName = () => {
    if (!formData.assignee) return '';
    const member = members.find(m => m.userId._id === formData.assignee);
    return member ? member.userId.username : '';
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Report New Bug</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Project Title *</label>
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="e.g., Website Redesign, Mobile App"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bug Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            required
            maxLength={100}
            placeholder="Brief description of the bug"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            required
            maxLength={500}
            placeholder="Detailed description of the bug, steps to reproduce, expected behavior..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assignee</label>
            <div className="member-search-container">
              <input
                type="text"
                value={assigneeSearch}
                onChange={(e) => handleAssigneeSearch(e.target.value)}
                className="form-input"
                placeholder="Search team members..."
              />
              {showMemberSearch && (
                <div className="member-search-results">
                  {filteredMembers.map(member => (
                    <div
                      key={member.userId._id}
                      className="member-option"
                      onClick={() => selectMember(member)}
                    >
                      <div className="font-semibold">{member.userId.username}</div>
                      <div className="text-sm text-gray-500">{member.userId.email}</div>
                    </div>
                  ))}
                  {filteredMembers.length === 0 && (
                    <div className="member-option text-gray-500">
                      No members found
                    </div>
                  )}
                </div>
              )}
            </div>
            {formData.assignee && (
              <div className="text-sm text-green-600 mt-1">
                Assigned to: {getSelectedMemberName()}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            GitHub Repository URL <span style={{ color: '#64748b', fontWeight: 'normal' }}>(Optional)</span>
          </label>
          <input
            type="url"
            name="githubRepo"
            value={formData.githubRepo}
            onChange={handleChange}
            className="form-input"
            placeholder="https://github.com/username/repository"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Reporting Bug...' : 'Report Bug'}
        </button>
      </form>
    </div>
  );
};

export default BugForm;