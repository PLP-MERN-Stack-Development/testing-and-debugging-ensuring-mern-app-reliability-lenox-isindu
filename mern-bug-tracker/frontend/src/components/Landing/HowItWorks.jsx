import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Create Your Workspace',
      description: 'Sign up and create your team workspace with a unique access code.'
    },
    {
      number: '2',
      title: 'Invite Your Team',
      description: 'Share your workspace code with team members to invite them.'
    },
    {
      number: '3',
      title: 'Start Tracking Bugs',
      description: 'Report, assign, and track bugs with your entire team.'
    }
  ];

  return (
    <section className="how-it-works-section" style={{ padding: '80px 0', background: '#f8fafc' }}>
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Get started in minutes and transform how your team handles bug tracking.
        </p>
        <div className="features-grid">
          {steps.map((step, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon" style={{ background: '#dbeafe', fontSize: '1rem', fontWeight: 'bold' }}>
                {step.number}
              </div>
              <h3 className="feature-title">{step.title}</h3>
              <p className="feature-description">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;