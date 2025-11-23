import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Streamline Bug Tracking for Your Entire Team
          </h1>
          <p className="hero-subtitle">
            Isolate issues, collaborate efficiently, and ship faster with our workspace-based 
            bug tracking solution. Keep your team focused and your projects organized.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;