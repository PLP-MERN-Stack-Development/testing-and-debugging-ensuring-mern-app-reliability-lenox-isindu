const Features = () => {
  const features = [
    {
      icon: '',
      title: 'Workspace Isolation',
      description: 'Keep your bugs private to your team with dedicated workspaces and secure access codes.'
    },
    {
      icon: '',
      title: 'Team Collaboration',
      description: 'Invite team members, assign bugs, and track progress together in real-time.'
    },
    {
      icon: '',
      title: 'Smart Bug Tracking',
      description: 'Prioritize, categorize, and track bugs with custom statuses and priority levels.'
    },
    {
      icon: '',
      title: 'GitHub Integration',
      description: 'Link bugs directly to GitHub repositories for better development workflow.'
    },
    {
      icon: '',
      title: 'Project Organization',
      description: 'Group bugs by projects and keep your development work organized and focused.'
    },
    {
      icon: '',
      title: 'Fast & Reliable',
      description: 'Built with modern technologies for speed, reliability, and great user experience.'
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Why Choose BugTracker?</h2>
        <p className="section-subtitle">
          Everything you need to manage bugs efficiently and keep your development team productive.
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;