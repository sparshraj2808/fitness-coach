/* WorkoutPlansPage.jsx - Comprehensive training catalog and active workout runner */
import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import ExerciseTimer from '../components/ExerciseTimer';

export default function WorkoutPlansPage({ onNavigate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, home, gym
  const [activeWorkout, setActiveWorkout] = useState(null); // active template object
  const [completedExercises, setCompletedExercises] = useState({});
  const [loggingSession, setLoggingSession] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const data = await api.getWorkoutTemplates();
        setTemplates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, []);

  const handleActivateWorkout = (template) => {
    setActiveWorkout(template);
    setCompletedExercises({});
    setLogSuccess(false);
  };

  const handleToggleExercise = (index) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleLogWorkout = async () => {
    if (!activeWorkout) return;
    setLoggingSession(true);
    try {
      await api.logWorkout({
        name: activeWorkout.name,
        duration: activeWorkout.duration,
        caloriesBurned: activeWorkout.caloriesBurned,
        type: activeWorkout.type
      });
      setLogSuccess(true);
      setTimeout(() => {
        setActiveWorkout(null);
        if (onNavigate) onNavigate('dashboard');
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Failed to log workout session.');
    } finally {
      setLoggingSession(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Calibrating Gym Floor...</p>
      </div>
    );
  }

  const filteredTemplates = templates.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="main-content">
      {/* 1. Active Workout Portal */}
      {activeWorkout ? (
        <div style={styles.activePortal}>
          <div style={styles.activePortalHeader}>
            <button style={styles.backBtn} onClick={() => setActiveWorkout(null)}>
              ⬅️ Quit Session
            </button>
            <h2 style={styles.portalTitle}>🔥 ACTIVE SESSION: {activeWorkout.name}</h2>
          </div>

          <div style={styles.activePortalBody}>
            {/* Left: Interactive Checklist */}
            <div className="cyber-card" style={styles.activeExercisesCard}>
              <h3 style={styles.cardHeaderTitle}>🏋️‍♂️ Exercise Checklist</h3>
              <p style={styles.cardHeaderSub}>Check off items as you complete them to finalize telemetry.</p>
              
              <div style={styles.exercisesList}>
                {activeWorkout.exercises.map((ex, idx) => {
                  const checked = !!completedExercises[idx];
                  return (
                    <div 
                      key={idx} 
                      style={{
                        ...styles.exerciseCheckRow,
                        background: checked ? 'rgba(57, 255, 20, 0.03)' : 'rgba(255,255,255,0.01)',
                        borderColor: checked ? 'var(--neon-green)' : 'rgba(255,255,255,0.05)'
                      }}
                      onClick={() => handleToggleExercise(idx)}
                    >
                      <div style={styles.checkWrapper}>
                        <div style={{
                          ...styles.customCheckbox,
                          background: checked ? 'var(--neon-green)' : 'transparent',
                          borderColor: checked ? 'var(--neon-green)' : 'var(--text-secondary)'
                        }}>
                          {checked && <span style={styles.checkMark}>✓</span>}
                        </div>
                        <div style={styles.exDetails}>
                          <span style={{
                            ...styles.exName,
                            textDecoration: checked ? 'line-through' : 'none',
                            color: checked ? 'var(--text-muted)' : 'var(--text-primary)'
                          }}>
                            {ex.name}
                          </span>
                          <span style={styles.exMeta}>{ex.sets} sets × {ex.reps} (Rest: {ex.rest})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Log finished button */}
              <div style={styles.logActionWrapper}>
                {logSuccess ? (
                  <div style={styles.successMessage}>
                    🎉 Workout Synchronized! Streaks Updated, Calories Burned logged!
                  </div>
                ) : (
                  <button 
                    className="cyber-button"
                    disabled={loggingSession}
                    onClick={handleLogWorkout}
                    style={styles.logWorkoutBtn}
                  >
                    {loggingSession ? 'Encrypting logs...' : 'Log Workout Session ✅'}
                  </button>
                )}
              </div>
            </div>

            {/* Right: Active Timer and stats */}
            <div style={styles.activeSidebar}>
              <ExerciseTimer />
              <div className="cyber-card" style={styles.workoutMetaCard}>
                <h4 style={styles.metaTitle}>🔋 Session Estimation</h4>
                <div style={styles.metaRows}>
                  <div style={styles.metaRow}>
                    <span>Est. Time:</span>
                    <strong>{activeWorkout.duration} mins</strong>
                  </div>
                  <div style={styles.metaRow}>
                    <span>Est. Burn:</span>
                    <strong style={{color: 'var(--text-neon-lime)'}}>{activeWorkout.caloriesBurned} kcal</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Workouts Catalog List */
        <div>
          <div style={styles.catalogHeader}>
            <div>
              <h1 style={styles.titleText}>🏋️‍♂️ Fitness Training Deck</h1>
              <p style={styles.subtitleText}>Browse premium workout splits customized for home bodyweight or gym weight lifting.</p>
            </div>
            
            {/* Filter Toggle */}
            <div style={styles.filterToggles}>
              <button 
                style={{...styles.toggleBtn, ...(filterType === 'all' ? styles.activeToggle : {})}}
                onClick={() => setFilterType('all')}
              >
                All Workouts
              </button>
              <button 
                style={{...styles.toggleBtn, ...(filterType === 'home' ? styles.activeToggle : {})}}
                onClick={() => setFilterType('home')}
              >
                🏡 Home Routine
              </button>
              <button 
                style={{...styles.toggleBtn, ...(filterType === 'gym' ? styles.activeToggle : {})}}
                onClick={() => setFilterType('gym')}
              >
                🏋️‍♂️ Gym Splits
              </button>
            </div>
          </div>

          <div style={styles.templatesGrid}>
            {filteredTemplates.map((template) => (
              <div key={template.id} className="cyber-card" style={styles.workoutCard}>
                <div style={styles.cardTop}>
                  <span style={{
                    ...styles.typeBadge,
                    color: template.type === 'home' ? 'var(--text-neon-cyan)' : 'var(--text-neon-lime)',
                    borderColor: template.type === 'home' ? 'var(--neon-blue)' : 'var(--neon-green)',
                    background: template.type === 'home' ? 'rgba(0, 240, 255, 0.05)' : 'rgba(57, 255, 20, 0.05)'
                  }}>
                    {template.type === 'home' ? '🏡 Home' : '🏋️‍♂️ Gym'}
                  </span>
                  <span style={styles.diffBadge}>{template.difficulty}</span>
                </div>
                
                <h3 style={styles.workoutName}>{template.name}</h3>
                <p style={styles.workoutDesc}>{template.description}</p>

                <div style={styles.workoutStats}>
                  <div style={styles.cardStat}>
                    <span>Duration</span>
                    <strong>{template.duration}m</strong>
                  </div>
                  <div style={styles.cardStat}>
                    <span>Burn</span>
                    <strong style={{color: 'var(--text-neon-cyan)'}}>{template.caloriesBurned} kcal</strong>
                  </div>
                </div>

                <div style={styles.exercisesPeek}>
                  <h4 style={styles.peekTitle}>Exercises Included:</h4>
                  <ul style={styles.peekList}>
                    {template.exercises.slice(0, 3).map((ex, idx) => (
                      <li key={idx} style={styles.peekItem}>✓ {ex.name}</li>
                    ))}
                    {template.exercises.length > 3 && <li style={styles.peekItemMuted}>+ {template.exercises.length - 3} more exercises</li>}
                  </ul>
                </div>

                <button 
                  className="cyber-button"
                  style={styles.activateBtn}
                  onClick={() => handleActivateWorkout(template)}
                >
                  Activate Session ⚡
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid var(--bg-tertiary)',
    borderTopColor: 'var(--neon-blue)',
    borderRadius: 'var(--border-radius-full)',
    animation: 'rotate 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    fontFamily: 'Outfit, sans-serif',
    color: 'var(--text-secondary)',
  },
  catalogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  titleText: {
    fontSize: '2.2rem',
    fontWeight: '800',
  },
  subtitleText: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginTop: '0.2rem',
  },
  filterToggles: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0.35rem',
    borderRadius: 'var(--border-radius-md)',
    gap: '0.25rem',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--border-radius-sm)',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'all var(--transition-fast)',
  },
  activeToggle: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-neon-cyan)',
    boxShadow: 'var(--neon-blue-glow)',
  },
  templatesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  workoutCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  typeBadge: {
    border: '1px solid',
    borderRadius: 'var(--border-radius-full)',
    padding: '0.15rem 0.65rem',
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  diffBadge: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  workoutName: {
    fontSize: '1.25rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  workoutDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '1.25rem',
    flex: 1,
  },
  workoutStats: {
    display: 'flex',
    gap: '1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--border-radius-md)',
    border: '1px solid rgba(255,255,255,0.03)',
    marginBottom: '1rem',
  },
  cardStat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  exercisesPeek: {
    marginBottom: '1.5rem',
  },
  peekTitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.35rem',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  peekList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  peekItem: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  peekItemMuted: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  activateBtn: {
    width: '100%',
    padding: '0.65rem',
    justifyContent: 'center',
  },
  activePortal: {
    animation: 'slideInUp var(--transition-normal)',
  },
  activePortalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  backBtn: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '700',
    fontSize: '0.85rem',
  },
  portalTitle: {
    fontSize: '1.8rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '800',
  },
  activePortalBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '2rem',
  },
  activeExercisesCard: {
    padding: '2rem',
  },
  cardHeaderTitle: {
    fontSize: '1.25rem',
    fontFamily: 'Outfit, sans-serif',
  },
  cardHeaderSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
  exercisesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  exerciseCheckRow: {
    border: '1px solid',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.85rem 1.25rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  checkWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  customCheckbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
  },
  checkMark: {
    color: 'var(--bg-primary)',
    fontSize: '0.8rem',
    fontWeight: '900',
  },
  exDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  exName: {
    fontWeight: '700',
    fontSize: '0.95rem',
    transition: 'color var(--transition-fast)',
  },
  exMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '0.1rem',
  },
  logActionWrapper: {
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  logWorkoutBtn: {
    width: '100%',
    padding: '0.85rem',
    justifyContent: 'center',
  },
  successMessage: {
    background: 'rgba(57, 255, 20, 0.1)',
    border: '1px solid var(--neon-green)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'center',
    boxShadow: 'var(--neon-green-glow)',
  },
  activeSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  workoutMetaCard: {
    padding: '1.25rem 1.5rem',
  },
  metaTitle: {
    fontSize: '0.9rem',
    fontFamily: 'Outfit, sans-serif',
    marginBottom: '0.75rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  metaRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  }
};
