import { useState, useEffect } from 'react';
import { workspaceService } from '../../services/workspaceService';
import { useAuth } from '../../contexts/AuthContext';

const WorkspaceMembers = ({ workspace, onMemberRemoved }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (workspace) {
      loadMembers();
    }
  }, [workspace]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await workspaceService.getWorkspaceMembers(workspace._id);
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      await workspaceService.removeMember(workspace._id, memberId);
      loadMembers();
      onMemberRemoved?.();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to remove member');
    }
  };

  const isAdmin = members.find(m => m.userId._id === user.id)?.role === 'admin';

  if (!workspace) {
    return (
      <div className="card">
        <h3 className="font-semibold mb-4">Workspace Members</h3>
        <p className="text-gray-500">Select a workspace to view members</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">Workspace Members</h3>
      
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          Workspace Code: <strong>{workspace.code}</strong>
        </div>
        <div className="text-sm text-gray-600">
          Share this code to invite members
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading members...</div>
      ) : (
        <div className="space-y-3">
          {members.map(member => (
            <div key={member.userId._id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <div className="font-medium">{member.userId.username}</div>
                <div className="text-sm text-gray-500">{member.userId.email}</div>
                <div className="text-xs text-gray-400 capitalize">{member.role}</div>
              </div>
              
              {isAdmin && member.userId._id !== user.id && (
                <button
                  onClick={() => handleRemoveMember(member.userId._id)}
                  className="btn btn-danger text-xs"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceMembers;