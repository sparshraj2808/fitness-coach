/* WaterTracker.jsx - Visual liquid glass filler hydration monitor */
import React, { useState } from 'react';
import { api } from '../utils/api';

export default function WaterTracker({ initialLogged, target, onUpdate }) {
  const [logged, setLogged] = useState(initialLogged || 0);
  const [loading, setLoading] = useState(false);

  const handleAddWater = async (amount) => {
    setLoading(true);
    try {
      await api.logWater(amount);
      const nextVal = logged + amount;
      setLogged(nextVal);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Failed to log water intake:', err);
    } finally {
      setLoading(false);
    }
  };

  const percentage = Math.min(100, Math.round((logged / (target || 2500)) * 100));

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>💧 Hydration Tracker</h3>
      <p style={styles.subtitle}>Daily Target: {target || 2500}ml</p>

      <div className="water-glass-container">
        <div 
          className="water-fill" 
          style={{ height: `${percentage}%` }}
        >
          <div className="water-wave"></div>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statVal}>{logged}ml</span>
          <span style={styles.statLabel}>Logged</span>
        </div>
        <div style={styles.statBox}>
          <span style={{...styles.statVal, color: 'var(--text-neon-cyan)'}}>{percentage}%</span>
          <span style={styles.statLabel}>Completed</span>
        </div>
      </div>

      <div style={styles.buttonGrid}>
        <button 
          disabled={loading} 
          style={styles.waterBtn} 
          onClick={() => handleAddWater(250)}
        >
          ➕ 250ml <br/><span style={styles.btnLabel}>Cup</span>
        </button>
        <button 
          disabled={loading} 
          style={styles.waterBtn} 
          onClick={() => handleAddWater(500)}
        >
          ➕ 500ml <br/><span style={styles.btnLabel}>Shaker</span>
        </button>
        <button 
          disabled={loading} 
          style={styles.waterBtn} 
          onClick={() => handleAddWater(750)}
        >
          ➕ 750ml <br/><span style={styles.btnLabel}>Jug</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem',
    background: 'rgba(8, 14, 28, 0.75)',
    borderRadius: 'var(--border-radius-lg)',
    border: '1px solid rgba(0, 240, 255, 0.08)',
    boxShadow: 'var(--glass-shadow)',
    width: '100%',
    margin: '0 auto',
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
    marginBottom: '1rem',
  },
  statsRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: '1.25rem',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '0.75rem',
    borderRadius: 'var(--border-radius-md)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statVal: {
    fontSize: '1.1rem',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif',
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginTop: '0.15rem',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    width: '100%',
  },
  waterBtn: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1px solid rgba(0, 240, 255, 0.1)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.5rem 0.25rem',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '700',
    fontSize: '0.8rem',
    transition: 'all var(--transition-fast)',
    textAlign: 'center',
  },
  btnLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  }
};
