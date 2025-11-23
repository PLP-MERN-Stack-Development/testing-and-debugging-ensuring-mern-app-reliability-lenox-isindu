const Footer = () => {
  return (
    <footer style={{ padding: '40px 0', background: '#1e293b', color: 'white' }}>
      <div className="container">
        <div className="text-center">
          <div className="nav-logo" style={{ marginBottom: '16px' }}>
             BugTracker
          </div>
          <p style={{ color: '#94a3b8' }}>
            Streamline your bug tracking process and ship better software.
          </p>
          <p style={{ color: '#64748b', marginTop: '16px', fontSize: '0.875rem' }}>
            © 2025 BugTracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;