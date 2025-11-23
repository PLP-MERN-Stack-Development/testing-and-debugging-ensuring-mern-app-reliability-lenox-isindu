import { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import Features from "../components/Landing/Features";
import HowItWorks from "../components/Landing/HowItWorks";
import CTASection from "../components/Landing/CTASection";
import Footer from "../components/Layout/Footer";

const LandingPage = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    // Ensure VANTA is loaded via CDN
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(
        window.VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 400.0,
          minWidth: 400.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundAlpha: 0, // transparent to let CSS background show
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="landing-page"
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Modern Header */}
      <Header />

      {/* Hero Section */}
      <div className="hero-content" style={{ textAlign: "center", padding: "120px 20px" }}>
        <h1 className="hero-title">
          Track Bugs Effortlessly
        </h1>
        <p className="hero-subtitle">
          Your ultimate bug tracking platform with real-time insights.
        </p>
        <div style={{ marginTop: "40px" }}>
          <a href="/signup" className="header-btn header-btn-primary">
            Get Started
          </a>
        </div>
      </div>

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
