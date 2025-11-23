import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="auth-container">
      <div className="auth-card text-center">
        <h1 className="auth-title" style={{ fontSize: '4rem', marginBottom: '16px' }}>404</h1>
        <h2 className="auth-title">Page Not Found</h2>
        <p className="auth-subtitle mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;