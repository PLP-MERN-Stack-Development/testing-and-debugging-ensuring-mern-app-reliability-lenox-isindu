import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="modern-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="header-logo">
            <span className="logo-gradient">BugTracker</span>
          </Link>
        </div>

        <nav className="header-right">
          {user ? (
            <Link to="/dashboard" className="header-btn header-btn-outline">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="header-btn header-btn-outline">
                Sign In
              </Link>
              <Link to="/signup" className="header-btn header-btn-primary">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
