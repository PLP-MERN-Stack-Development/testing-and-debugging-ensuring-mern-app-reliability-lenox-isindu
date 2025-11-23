import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to Streamline Your Bug Tracking?
          </h2>
          <p className="cta-subtitle">
            Join thousands of teams who use BugTracker to ship better software, faster.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-btn-primary">
              Start Free Trial
            </Link>
            <Link to="/login" className="cta-btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
