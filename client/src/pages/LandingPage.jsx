/* LandingPage.jsx - Premium introduction hub for FitCoach AI platform */
import React from 'react';

const MOTIVATIONAL_TIPS = [
  { text: "Consistency is what transforms average effort into spectacular achievements.", author: "FitCoach Team" },
  { text: "Your body is a temple, but you have to treat it like a gym first.", author: "Arnold Schwarzenegger" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" }
];

export default function LandingPage({ onNavigate }) {
  const currentTip = MOTIVATIONAL_TIPS[Math.floor(Math.random() * MOTIVATIONAL_TIPS.length)];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <div style={styles.taglineBox}>
            <span style={styles.taglineText}>⚡ CHIP INTO YOUR HIGHEST POTENTIAL</span>
          </div>
          <h1 style={styles.mainTitle}>
            Unleash Your Strength With <span className="text-gradient">FitCoach AI</span>
          </h1>
          <p style={styles.heroSub}>
            Step into the future of fitness. Get instant workouts, customized meal plans, real-time hydration reminders, and conversational AI guidance from your personal pocket coach.
          </p>
          <div style={styles.ctaRow}>
            <button 
              className="cyber-button" 
              style={styles.ctaMain} 
              onClick={() => onNavigate('register')}
            >
              Get Started Free 🚀
            </button>
            <button 
              className="cyber-button secondary" 
              style={styles.ctaSec} 
              onClick={() => onNavigate('login')}
            >
              Sign In 🔑
            </button>
          </div>
        </div>
      </section>

      {/* Cyber Quote Section */}
      <section className="cyber-card animate-float" style={styles.quoteCard}>
        <span style={styles.quoteQuote}>“</span>
        <p style={styles.quoteText}>{currentTip.text}</p>
        <span style={styles.quoteAuthor}>— {currentTip.author} (Daily Motivation)</span>
      </section>

      {/* Features Grid */}
      <section style={styles.featuresSection}>
        <h2 style={styles.featuresHeading}>⚙️ Engineered Platform Features</h2>
        <p style={styles.featuresSub}>A fully integrated, state-of-the-art telemetry environment for your body</p>

        <div className="dashboard-grid" style={styles.gridOverride}>
          <div className="cyber-card" style={styles.featureCard}>
            <div style={styles.cardHeader}>
              <span style={{...styles.cardIcon, color: 'var(--text-neon-cyan)'}}>🤖</span>
              <h3 style={styles.cardTitle}>Cognitive AI Coach</h3>
            </div>
            <p style={styles.cardDesc}>
              Chat with a personalized fitness assistant trained to build custom exercise routines, clarify calorie metrics, suggest recipes, and motivate you instantly.
            </p>
          </div>

          <div className="cyber-card" style={styles.featureCard}>
            <div style={styles.cardHeader}>
              <span style={{...styles.cardIcon, color: 'var(--text-neon-lime)'}}>🏋️‍♂️</span>
              <h3 style={styles.cardTitle}>Home & Gym Splits</h3>
            </div>
            <p style={styles.cardDesc}>
              Filter targeted workout templates for muscle hypertrophy, lean shreds, or endurance circuits, and track each interval with an active sound-synthesized timer.
            </p>
          </div>

          <div className="cyber-card" style={styles.featureCard}>
            <div style={styles.cardHeader}>
              <span style={{...styles.cardIcon, color: 'var(--neon-purple)'}}>💧</span>
              <h3 style={styles.cardTitle}>Hydration Command</h3>
            </div>
            <p style={styles.cardDesc}>
              Log glass, shaker, or jug volumes to fill a gorgeous interactive water display. Track your percentages and unlock gamified hydration achievement badges.
            </p>
          </div>

          <div className="cyber-card" style={styles.featureCard}>
            <div style={styles.cardHeader}>
              <span style={{...styles.cardIcon, color: 'var(--neon-red)'}}>📊</span>
              <h3 style={styles.cardTitle}>Body Telemetry</h3>
            </div>
            <p style={styles.cardDesc}>
              Leverage dynamic sliders to compute body mass ratios, record weight fluctuations, and view weekly logs rendered on responsive, neon-accented charts.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to Action Footer Section */}
      <section style={styles.bottomCta}>
        <h2 style={styles.bottomCtaTitle}>Are You Ready to Reshape Your Routine?</h2>
        <p style={styles.bottomCtaSub}>No credit card required. Jump start your fitness journey instantly.</p>
        <button 
          className="cyber-button" 
          style={styles.bottomCtaBtn}
          onClick={() => onNavigate('register')}
        >
          Initialize Coach Now ⚡
        </button>
      </section>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '5rem',
  },
  heroSection: {
    position: 'relative',
    minHeight: '65vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '4rem 2rem',
    overflow: 'hidden',
    background: 'radial-gradient(circle at 50% 50%, rgba(13, 20, 35, 0.8) 0%, var(--bg-primary) 100%)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 0)',
    backgroundSize: '24px 24px',
    pointerEvents: 'none',
  },
  heroContent: {
    maxWidth: '800px',
    zIndex: 1,
    animation: 'slideInUp var(--transition-normal)',
  },
  taglineBox: {
    display: 'inline-block',
    background: 'rgba(0, 240, 255, 0.06)',
    border: '1px solid rgba(0, 240, 255, 0.15)',
    padding: '0.35rem 1rem',
    borderRadius: 'var(--border-radius-full)',
    marginBottom: '1.5rem',
  },
  taglineText: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-neon-cyan)',
    letterSpacing: '0.1em',
  },
  mainTitle: {
    fontSize: '3.5rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '800',
    lineHeight: '1.15',
    marginBottom: '1.5rem',
    letterSpacing: '-0.03em',
  },
  heroSub: {
    fontSize: '1.15rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.65',
    marginBottom: '2.5rem',
  },
  ctaRow: {
    display: 'flex',
    gap: '1.25rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaMain: {
    padding: '0.9rem 2.25rem',
    fontSize: '0.95rem',
  },
  ctaSec: {
    padding: '0.9rem 2.25rem',
    fontSize: '0.95rem',
  },
  quoteCard: {
    maxWidth: '700px',
    margin: '-2rem auto 4rem auto',
    zIndex: 10,
    textAlign: 'center',
    padding: '2rem',
    border: '1px solid rgba(57, 255, 20, 0.15)',
    animation: 'float 6s ease-in-out infinite',
  },
  quoteQuote: {
    fontSize: '3.5rem',
    fontFamily: 'Outfit, Georgia, serif',
    color: 'var(--text-neon-lime)',
    lineHeight: '0',
    display: 'block',
    marginBottom: '1rem',
  },
  quoteText: {
    fontSize: '1.15rem',
    fontWeight: '500',
    fontStyle: 'italic',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  quoteAuthor: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  featuresSection: {
    maxWidth: 'var(--max-width-content)',
    margin: '0 auto',
    padding: '0 2rem',
    textAlign: 'center',
  },
  featuresHeading: {
    fontSize: '2.2rem',
    marginBottom: '0.5rem',
  },
  featuresSub: {
    color: 'var(--text-secondary)',
    marginBottom: '3rem',
  },
  gridOverride: {
    marginTop: '2rem',
  },
  featureCard: {
    textAlign: 'left',
    padding: '2rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  cardIcon: {
    fontSize: '1.75rem',
  },
  cardTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  cardDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  bottomCta: {
    textAlign: 'center',
    padding: '4rem 2rem',
    margin: '4rem auto 0 auto',
    maxWidth: '800px',
  },
  bottomCtaTitle: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  bottomCtaSub: {
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
  },
  bottomCtaBtn: {
    padding: '0.85rem 2rem',
  }
};
