import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const WorkspaceSelector = ({ workspaces, currentWorkspace, onWorkspaceChange, onWorkspaceUpdate }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { joinWorkspace } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setJoining(true);
    const result = await joinWorkspace(joinCode.toUpperCase());
    setJoining(false);

    if (result.success) {
      setJoinCode('');
      setShowDropdown(false);
      onWorkspaceUpdate?.(); // Refresh workspaces
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="btn btn-outline flex items-center gap-2"
      >
        {currentWorkspace ? currentWorkspace.name : 'Select Workspace'}
        <span>▼</span>
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Your Workspaces</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {workspaces.map(ws => (
                <div
                  key={ws.workspaceId._id}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-50 ${
                    currentWorkspace?._id === ws.workspaceId._id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => {
                    onWorkspaceChange(ws.workspaceId);
                    setShowDropdown(false);
                  }}
                >
                  <div className="font-medium">{ws.workspaceId.name}</div>
                  <div className="text-sm text-gray-500">
                    Code: {ws.workspaceId.code} • {ws.role}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2">Join Workspace</h4>
              <form onSubmit={handleJoinWorkspace} className="flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter workspace code"
                  className="form-input flex-1"
                  style={{ padding: '6px 8px', fontSize: '0.875rem', textTransform: 'uppercase' }}
                  maxLength={6}
                />
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={joining}
                  style={{ padding: '6px 12px', fontSize: '0.875rem' }}
                >
                  {joining ? '...' : 'Join'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;