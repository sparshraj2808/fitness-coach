/* StreakCounter.jsx - Neon streak count and achievements badge gallery */
import React from 'react';

const BADGE_DEFINITIONS = [
  {
    id: 'welcome_badge',
    name: 'Welcome Rookie',
    desc: 'Joined the elite FitCoach AI platform',
    icon: '⚡'
  },
  {
    id: 'first_workout',
    name: 'First Sweat',
    desc: 'Completed your first active workout log',
    icon: '🏋️‍♂️'
  },
  {
    id: 'workout_5',
    name: 'Elite Cadet',
    desc: 'Completed 5 active training sessions',
    icon: '🔥'
  },
  {
    id: 'hydration_hero',
    name: 'Hydro Elite',
    desc: 'Logged 2500ml+ water in a single day',
    icon: '💧'
  },
  {
    id: 'streak_3',
    name: 'Consistency Spark',
    desc: 'Maintained a 3-day active login streak',
    icon: '✨'
  },
  {
    id: 'streak_7',
    name: 'Habit Builder',
    desc: 'Maintained a 7-day active login streak',
    icon: '👑'
  }
];

export default function StreakCounter({ streak, achievements }) {
  const unlockedBadges = achievements || [];

  return (
    <div style={styles.container}>
      <div style={styles.streakHeader}>
        <div style={styles.streakInfo}>
          <h3 style={styles.title}>🔥 Active Fitness Streak</h3>
          <p style={styles.subtitle}>Check in daily to maintain your momentum</p>
        </div>
        <div style={styles.streakCountBox}>
          <span style={styles.streakNum}>{streak || 0}</span>
          <span style={styles.streakDays}>Days</span>
        </div>
      </div>

      <div style={styles.badgeSection}>
        <h4 style={styles.badgeSectionTitle}>🏆 Achievement Racks</h4>
        <div style={styles.badgeGrid}>
          {BADGE_DEFINITIONS.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`badge-card ${isUnlocked ? 'unlocked' : ''}`}
                style={styles.cardOverride}
                title={badge.desc}
              >
                <div className="badge-icon">
                  {badge.icon}
                </div>
                <h5 style={{
                  ...styles.badgeName,
                  color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)'
                }}>
                  {badge.name}
                </h5>
                <span style={styles.badgeDesc}>{badge.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    background: 'rgba(8, 14, 28, 0.75)',
    borderRadius: 'var(--border-radius-lg)',
    border: '1px solid rgba(57, 255, 20, 0.08)',
    boxShadow: 'var(--glass-shadow)',
    width: '100%',
  },
  streakHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '1.25rem',
  },
  streakInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.15rem',
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  streakCountBox: {
    width: '64px',
    height: '64px',
    borderRadius: 'var(--border-radius-md)',
    background: 'rgba(57, 255, 20, 0.06)',
    border: '1.5px solid var(--neon-green)',
    boxShadow: 'var(--neon-green-glow)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNum: {
    fontSize: '1.5rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '800',
    color: 'var(--text-neon-lime)',
    lineHeight: 1,
  },
  streakDays: {
    fontSize: '0.55rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    marginTop: '0.1rem',
  },
  badgeSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  badgeSectionTitle: {
    fontSize: '0.9rem',
    fontFamily: 'Outfit, sans-serif',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '0.75rem',
  },
  cardOverride: {
    padding: '1rem 0.5rem',
  },
  badgeName: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginBottom: '0.2rem',
  },
  badgeDesc: {
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    lineHeight: '1.2',
  }
};
