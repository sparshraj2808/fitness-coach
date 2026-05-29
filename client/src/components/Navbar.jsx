/* Navbar.jsx - Top navigation header with premium cyber-grid styling */
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuth();

  const handleLinkClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.brand} onClick={() => handleLinkClick('landing')}>
          <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m6.5 6.5 11 11" />
            <path d="m21 21-1-1" />
            <path d="m3 3 1 1" />
            <path d="m18.5 5.5 1.5-1.5" />
            <path d="m5.5 18.5-1.5 1.5" />
            <path d="M8.5 2 2 8.5" />
            <path d="M22 15.5 15.5 22" />
          </svg>
          <span className="text-gradient" style={styles.brandText}>FitCoach <span style={styles.brandAi}>AI</span></span>
        </div>

        <div style={styles.linksContainer}>
          <button 
            style={{...styles.navLink, ...(currentPage === 'landing' ? styles.activeLink : {})}}
            onClick={() => handleLinkClick('landing')}
          >
            Home
          </button>
          
          {user ? (
            <>
              <button 
                style={{...styles.navLink, ...((currentPage === 'dashboard' || currentPage === 'chat' || currentPage === 'workouts' || currentPage === 'diet' || currentPage === 'progress') ? styles.activeLink : {})}}
                onClick={() => handleLinkClick('dashboard')}
              >
                Dashboard
              </button>
              <button 
                style={styles.navLink}
                onClick={() => {
                  logout();
                  handleLinkClick('landing');
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button 
                style={{...styles.navLink, ...(currentPage === 'login' ? styles.activeLink : {})}}
                onClick={() => handleLinkClick('login')}
              >
                Login
              </button>
              <button 
                className="cyber-button" 
                style={styles.registerBtn}
                onClick={() => handleLinkClick('register')}
              >
                Start Free
              </button>
            </>
          )}
          
          <button 
            style={{...styles.navLink, ...(currentPage === 'support' ? styles.activeLink : {})}}
            onClick={() => handleLinkClick('support')}
          >
            Support
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    height: '70px',
    background: 'rgba(6, 10, 19, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--glass-border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 'var(--max-width-content)',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '28px',
    height: '28px',
    color: 'var(--text-neon-cyan)',
    filter: 'drop-shadow(var(--neon-blue-glow))',
  },
  brandText: {
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '800',
    fontSize: '1.4rem',
    letterSpacing: '-0.03em',
  },
  brandAi: {
    color: 'var(--text-neon-lime)',
    filter: 'drop-shadow(var(--neon-green-glow))',
  },
  linksContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    padding: '0.5rem 0.75rem',
    transition: 'all var(--transition-fast)',
    borderRadius: 'var(--border-radius-sm)',
  },
  activeLink: {
    color: 'var(--text-neon-cyan)',
    textShadow: 'var(--neon-blue-glow)',
  },
  registerBtn: {
    padding: '0.5rem 1.25rem',
    fontSize: '0.8rem',
  }
};
