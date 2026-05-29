/* Dashboard.jsx - Central fitness overview and quick logging panel */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import StreakCounter from '../components/StreakCounter';
import BMICalculator from '../components/BMICalculator';

const FITNESS_TIPS = [
  "🔋 Hydrate early! Dehydration of just 2% drops active power output by up to 20%.",
  "💤 Deep sleep is when muscle recovery peaks. Aim for 7-9 hours to rebuild muscle tissue.",
  "🏋️‍♂️ Muscle burns more calories than fat even at rest. Don't skip strength exercises!",
  "🥑 Quality proteins post-workout rebuild micro-tears and accelerate strength gains.",
  "⏰ Standard intervals of 60-90s between sets optimize strength recovery for heavy lifts."
];

export default function Dashboard({ onNavigate }) {
  const { user, refreshProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickWaterLoading, setQuickWaterLoading] = useState(false);
  const [quickFoodLoading, setQuickFoodLoading] = useState(false);
  const [calorieLogVal, setCalorieLogVal] = useState(250);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const fetchStats = async () => {
    try {
      const currentStats = await api.getTrackerStatus();
      setStats(currentStats);
    } catch (e) {
      console.error("Failed to load dashboard statistics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Rotate tip every 10 seconds
    const interval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % FITNESS_TIPS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickWater = async () => {
    setQuickWaterLoading(true);
    try {
      await api.logWater(250);
      await fetchStats();
      await refreshProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setQuickWaterLoading(false);
    }
  };

  const handleQuickFoodLog = async () => {
    if (calorieLogVal <= 0) return;
    setQuickFoodLoading(true);
    try {
      await api.logCalories(calorieLogVal);
      await fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setQuickFoodLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Syncing Telemetry...</p>
      </div>
    );
  }

  const calorieConsumedPercent = Math.min(100, Math.round(((stats?.caloriesConsumed || 0) / (stats?.calorieConsumingTarget || 2000)) * 100));
  const calorieBurnedPercent = Math.min(100, Math.round(((stats?.caloriesBurned || 0) / (stats?.caloriesBurnedTarget || 400)) * 100));
  const waterPercent = Math.min(100, Math.round(((stats?.waterLogged || 0) / (stats?.waterTarget || 2500)) * 100));

  return (
    <div className="main-content">
      {/* Welcome & Tip Marquee */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.welcomeText}>Welcome back, <span className="text-gradient">{user?.username}</span>!</h1>
          <p style={styles.subtext}>Your personal AI Coach is online. Ready for another high-octane session?</p>
        </div>
        <div style={styles.tipMarquee}>
          <span style={styles.tipTitle}>💡 Coach Tip</span>
          <p style={styles.tipBody}>{FITNESS_TIPS[activeTipIndex]}</p>
        </div>
      </div>

      <div style={styles.dashboardGrid}>
        {/* Core telemetry column */}
        <div style={styles.leftCol}>
          {/* Streak & Badges Widget */}
          <StreakCounter 
            streak={stats?.streak || user?.streak || 0} 
            achievements={stats?.achievements || user?.achievements || []} 
          />

          {/* Quick Logs Drawer */}
          <div className="cyber-card" style={styles.cardSpacing}>
            <h3 style={styles.cardTitle}>⚡ Cyber Logging Deck</h3>
            <p style={styles.cardSubtitle}>Record food and water metrics without leaving home</p>
            
            <div style={styles.logDeck}>
              {/* Quick Water Button */}
              <div style={styles.deckItem}>
                <span style={styles.deckEmoji}>🥤</span>
                <button 
                  className="cyber-button" 
                  disabled={quickWaterLoading}
                  style={styles.deckBtn}
                  onClick={handleQuickWater}
                >
                  {quickWaterLoading ? 'Logging...' : '➕ 250ml Water'}
                </button>
              </div>

              {/* Quick Calorie Button */}
              <div style={styles.deckItem}>
                <span style={styles.deckEmoji}>🍳</span>
                <div style={styles.foodRow}>
                  <input 
                    type="number"
                    value={calorieLogVal}
                    onChange={(e) => setCalorieLogVal(Number(e.target.value))}
                    style={styles.foodInput}
                  />
                  <button 
                    className="cyber-button secondary" 
                    disabled={quickFoodLoading}
                    style={styles.deckBtn}
                    onClick={handleQuickFoodLog}
                  >
                    {quickFoodLoading ? 'Saving...' : '➕ Log Calories'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Actions */}
          <div style={styles.actionsDeck}>
            <button className="cyber-button" style={styles.actionBtn} onClick={() => onNavigate('chat')}>
              💬 Consult AI Coach
            </button>
            <button className="cyber-button secondary" style={styles.actionBtn} onClick={() => onNavigate('workouts')}>
              🏋️‍♂️ Start Workout
            </button>
          </div>
        </div>

        {/* Analytics & BMI Column */}
        <div style={styles.rightCol}>
          {/* Telemetry Ring Summaries */}
          <div className="cyber-card" style={styles.cardSpacing}>
            <h3 style={styles.cardTitle}>📈 Daily Activity Telemetry</h3>
            <p style={styles.cardSubtitle}>Your dynamic progress towards today's target levels</p>

            <div style={styles.telemetryBars}>
              {/* Calorie Intake progress */}
              <div style={styles.barGroup}>
                <div style={styles.barHeader}>
                  <span>🍳 Calories Consumed</span>
                  <strong>{stats?.caloriesConsumed || 0} / {stats?.calorieConsumingTarget || 2000} kcal</strong>
                </div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${calorieConsumedPercent}%`, background: 'var(--gradient-cyber)' }}></div>
                </div>
              </div>

              {/* Calorie Burned progress */}
              <div style={styles.barGroup}>
                <div style={styles.barHeader}>
                  <span>🔥 Calories Burned (Workouts)</span>
                  <strong>{stats?.caloriesBurned || 0} / {stats?.caloriesBurnedTarget || 400} kcal</strong>
                </div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${calorieBurnedPercent}%`, background: 'var(--neon-green)', boxShadow: 'var(--neon-green-glow)' }}></div>
                </div>
              </div>

              {/* Water Intake Progress */}
              <div style={styles.barGroup}>
                <div style={styles.barHeader}>
                  <span>💧 Hydration Progress</span>
                  <strong>{stats?.waterLogged || 0} / {stats?.waterTarget || 2500} ml</strong>
                </div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${waterPercent}%`, background: 'var(--neon-blue)', boxShadow: 'var(--neon-blue-glow)' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* BMI Card */}
          <BMICalculator 
            initialWeight={stats?.weight || user?.weight || 70} 
            initialHeight={stats?.height || user?.height || 175} 
            onUpdate={fetchStats} 
          />
        </div>
      </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  welcomeText: {
    fontSize: '2.2rem',
    fontWeight: '800',
  },
  subtext: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  tipMarquee: {
    background: 'rgba(0, 240, 255, 0.05)',
    border: '1px solid rgba(0, 240, 255, 0.1)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '0.85rem 1.25rem',
    maxWidth: '400px',
    flex: '1 1 300px',
  },
  tipTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-neon-cyan)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '0.2rem',
  },
  tipBody: {
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '2rem',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  cardSpacing: {
    padding: '1.5rem 2rem',
  },
  cardTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.15rem',
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '1.25rem',
  },
  logDeck: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  deckItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  deckEmoji: {
    fontSize: '1.5rem',
  },
  deckBtn: {
    padding: '0.5rem 1.25rem',
    fontSize: '0.8rem',
  },
  foodRow: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
    alignItems: 'center',
  },
  foodInput: {
    width: '70px',
    background: 'var(--bg-tertiary)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  actionsDeck: {
    display: 'flex',
    gap: '1rem',
  },
  actionBtn: {
    flex: 1,
    padding: '0.85rem',
    justifyContent: 'center',
  },
  telemetryBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  barGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  barHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.35rem',
  },
  barTrack: {
    height: '10px',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--border-radius-full)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 'var(--border-radius-full)',
    transition: 'width var(--transition-slow) ease-out',
  }
};
