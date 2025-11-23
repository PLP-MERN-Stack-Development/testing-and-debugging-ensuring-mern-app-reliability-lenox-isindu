import BugCard from '../BugCard/BugCard';

const BugList = ({ bugs, loading, error, onUpdateBug, onDeleteBug }) => {
  if (loading) {
    return (
      <div className="card text-center">
        <div className="text-gray-500">Loading bugs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!bugs || bugs.length === 0) {
    return (
      <div className="card text-center">
        <div className="text-gray-500">
          <h3 className="text-lg font-medium mb-2">No bugs reported</h3>
          <p>All clear! No bugs to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {bugs.map(bug => (
        <BugCard
          key={bug._id}
          bug={bug}
          onUpdate={onUpdateBug}
          onDelete={onDeleteBug}
        />
      ))}
    </div>
  );
};

export default BugList;