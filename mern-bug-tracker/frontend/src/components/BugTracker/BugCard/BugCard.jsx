import Button from '../UI/Button';
import { useAuth } from '../../../contexts/AuthContext'; 

const BugCard = ({ bug, onUpdate, onDelete }) => {
  const { user } = useAuth(); 
  
  const handleStatusChange = (newStatus) => {
    onUpdate(bug._id, { status: newStatus });
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  // Safely extract user information
  const reporterName = bug.reporter?.username || 'Unknown User';
  const assigneeName = bug.assignee?.username || 'Unassigned';
  
  // Permission checks
  const isAssignee = bug.assignee && user && bug.assignee._id === user.id;
  const isReporter = bug.reporter && user && bug.reporter._id === user.id;
  const canModifyBug = isAssignee || isReporter; 
  // Only assignee can change status (resolve, start progress, etc.)
  const canChangeStatus = isAssignee;
  
  // Only reporter or assignee can delete the bug
  const canDeleteBug = isReporter || isAssignee;

  return (
    <div className={`card ${getPriorityClass(bug.priority)}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{bug.title}</h3>
        <div className="flex items-center gap-2">
          <span className={`status-badge status-${bug.status.replace('-', '')}`}>
            {bug.status}
          </span>
          {isAssignee && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              
            </span>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{bug.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <div>
          <strong>Project:</strong> {bug.projectTitle}
        </div>
        {bug.githubRepo && (
          <div>
            <strong>Repo:</strong> 
            <a 
              href={bug.githubRepo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              View
            </a>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <div>
          <strong>Reporter:</strong> 
          <span className={isReporter ? "font-semibold text-blue-600 ml-1" : "ml-1"}>
            {reporterName} {isReporter }
          </span>
        </div>
        <div>
          <strong>Assignee:</strong> 
          <span className={isAssignee ? "font-semibold text-green-600 ml-1" : "ml-1"}>
            {assigneeName} {isAssignee }
          </span>
        </div>
        <div>
          <strong>Priority:</strong> 
          <span className={`ml-1 font-medium ${
            bug.priority === 'high' ? 'text-red-600' :
            bug.priority === 'medium' ? 'text-orange-600' : 'text-green-600'
          }`}>
            {bug.priority}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {/* Status change buttons - only visible to assignee */}
          {canChangeStatus && (
            <>
              {bug.status !== 'open' && (
                <Button 
                  variant="primary" 
                  onClick={() => handleStatusChange('open')}
                  className="text-xs"
                >
                  Re-open
                </Button>
              )}
              {bug.status !== 'in-progress' && (
                <Button 
                  variant="primary" 
                  onClick={() => handleStatusChange('in-progress')}
                  className="text-xs"
                >
                  Start Progress
                </Button>
              )}
              {bug.status !== 'resolved' && (
                <Button 
                  variant="success" 
                  onClick={() => handleStatusChange('resolved')}
                  className="text-xs"
                >
                  Resolve
                </Button>
              )}
            </>
          )}
          
          {/* Show message if user is not assignee but can see the bug */}
          {!canChangeStatus && bug.status !== 'resolved' && (
            <span className="text-xs text-gray-500 italic">
              
            </span>
          )}
        </div>
        
        {/* Delete button - only for reporter or assignee */}
        {canDeleteBug ? (
          <Button 
            variant="danger" 
            onClick={() => onDelete(bug._id)}
            className="text-xs"
          >
            Delete
          </Button>
        ) : (
          <span className="text-xs text-gray-500 italic">
            
          </span>
        )}
      </div>
      
      {/* Show permissions info for non-assignees */}
      {!isAssignee && bug.assignee && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          🔒 <strong>{assigneeName}</strong>. 
        </div>
      )}
    </div>
  );
};

export default BugCard;