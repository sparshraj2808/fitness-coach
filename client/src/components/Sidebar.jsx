/* Sidebar.jsx - Interactive sidebar for authorized dashboard sections */
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onNavigate, currentPage }) {
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Home Dashboard',
      icon: (
        <svg style={styles.svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      id: 'chat',
      label: 'AI Chat Coach',
      icon: (
        <svg style={styles.svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 'workouts',
      label: 'Workout Plans',
      icon: (
        <svg style={styles.svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6.5 6.5 11 11" />
          <circle cx="6.5" cy="6.5" r="2.5" fill="currentColor"/>
          <circle cx="17.5" cy="17.5" r="2.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 'diet',
      label: 'Diet & Water',
      icon: (
        <svg style={styles.svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
    },
    {
      id: 'progress',
      label: 'Progress Charts',
      icon: (
        <svg style={styles.svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      )
    }
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.profileSection}>
        <div style={styles.avatar}>
          {user?.username?.substring(0, 2).toUpperCase() || 'FC'}
        </div>
        <div style={styles.profileInfo}>
          <h4 style={styles.profileName}>{user?.username || 'User Athlete'}</h4>
          <span style={styles.profileGoal}>🎯 {user?.goal === 'gain' ? 'Muscle Gain' : 'Weight Loss / Fitness'}</span>
        </div>
      </div>

      <nav style={styles.menu}>
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              style={{
                ...styles.menuButton,
                ...(isActive ? styles.activeButton : {})
              }}
              onClick={() => onNavigate(item.id)}
            >
              <span style={{
                ...styles.iconWrapper,
                ...(isActive ? styles.activeIcon : {})
              }}>
                {item.icon}
              </span>
              <span style={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    background: 'rgba(11, 17, 32, 0.7)',
    backdropFilter: 'blur(16px)',
    borderRight: '1px solid var(--glass-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1rem',
    minHeight: 'calc(100vh - 70px)',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '2rem',
    marginBottom: '2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  avatar: {
    width: '46px',
    height: '46px',
    borderRadius: 'var(--border-radius-full)',
    background: 'var(--gradient-cyber)',
    display: 'flex',
    alignItems: 'center',
    justifycontent: 'center',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '800',
    color: 'var(--bg-primary)',
    fontSize: '1rem',
    boxShadow: 'var(--neon-blue-glow)',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  profileName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  profileGoal: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '0.15rem',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'none',
    border: 'none',
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: 'var(--border-radius-md)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all var(--transition-fast)',
  },
  activeButton: {
    background: 'rgba(0, 240, 255, 0.06)',
    color: 'var(--text-neon-cyan)',
    borderLeft: '3px solid var(--neon-blue)',
    borderTopLeftRadius: '2px',
    borderBottomLeftRadius: '2px',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    transition: 'color var(--transition-fast)',
  },
  activeIcon: {
    color: 'var(--text-neon-cyan)',
    filter: 'drop-shadow(var(--neon-blue-glow))',
  },
  svg: {
    width: '20px',
    height: '20px',
  },
  label: {
    flex: 1,
  }
};
