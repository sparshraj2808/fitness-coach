/* BMICalculator.jsx - Dynamic weight/height slider with glowing speedometer scale */
import React, { useState } from 'react';
import { api } from '../utils/api';

export default function BMICalculator({ initialWeight, initialHeight, onUpdate }) {
  const [weight, setWeight] = useState(initialWeight || 70);
  const [height, setHeight] = useState(initialHeight || 175);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const heightM = height / 100;
  const bmiVal = Number((weight / (heightM * heightM)).toFixed(1));

  let category = 'Normal';
  let categoryColor = 'var(--text-neon-lime)';
  let needlePosition = 50; // percentage across the bar

  if (bmiVal < 18.5) {
    category = 'Underweight';
    categoryColor = 'var(--neon-purple)';
    needlePosition = 15;
  } else if (bmiVal >= 18.5 && bmiVal < 25) {
    category = 'Normal';
    categoryColor = 'var(--text-neon-lime)';
    needlePosition = 40;
  } else if (bmiVal >= 25 && bmiVal < 30) {
    category = 'Overweight';
    categoryColor = 'var(--neon-blue)';
    needlePosition = 68;
  } else {
    category = 'Obese';
    categoryColor = 'var(--neon-red)';
    needlePosition = 90;
  }

  const handleSaveBMI = async () => {
    setSaving(true);
    setMessage('');
    try {
      // 1. Log weight progress entry to tracking history
      await api.logWeight(weight);
      // 2. Update user profile details
      await api.updateProfile({ weight, height });
      
      setMessage('✅ Stats checked & saved successfully!');
      if (onUpdate) {
        onUpdate();
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update profile stats.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🧮 Cyber BMI Calculator</h3>
      <p style={styles.subtitle}>Calculate and track your Body Mass Index</p>

      <div style={styles.sliders}>
        <div style={styles.sliderGroup}>
          <div style={styles.sliderLabel}>
            <span>Weight: <strong>{weight} kg</strong></span>
          </div>
          <input 
            type="range" 
            min="40" 
            max="150" 
            value={weight} 
            onChange={(e) => setWeight(Number(e.target.value))}
            style={styles.rangeInput}
          />
        </div>

        <div style={styles.sliderGroup}>
          <div style={styles.sliderLabel}>
            <span>Height: <strong>{height} cm</strong></span>
          </div>
          <input 
            type="range" 
            min="120" 
            max="220" 
            value={height} 
            onChange={(e) => setHeight(Number(e.target.value))}
            style={styles.rangeInput}
          />
        </div>
      </div>

      <div style={styles.resultsBox}>
        <div style={styles.bmiCircle}>
          <span style={styles.bmiNum}>{bmiVal}</span>
          <span style={styles.bmiLabel}>BMI Index</span>
        </div>
        <div style={styles.categoryInfo}>
          <span style={styles.catLabel}>Category</span>
          <span style={{ ...styles.catVal, color: categoryColor }}>{category}</span>
        </div>
      </div>

      <div style={styles.gaugeContainer}>
        <div style={styles.gaugeBar}>
          <div style={{ ...styles.gaugeNeedle, left: `${needlePosition}%` }}></div>
          <div style={styles.gaugeSegUnder}></div>
          <div style={styles.gaugeSegNormal}></div>
          <div style={styles.gaugeSegOver}></div>
          <div style={styles.gaugeSegObese}></div>
        </div>
        <div style={styles.gaugeLabels}>
          <span>&lt;18.5</span>
          <span>18.5-24.9</span>
          <span>25.0-29.9</span>
          <span>30.0+</span>
        </div>
      </div>

      <button 
        disabled={saving} 
        className="cyber-button" 
        style={styles.saveBtn}
        onClick={handleSaveBMI}
      >
        {saving ? 'Syncing...' : 'Save & Log Stats'}
      </button>

      {message && <p style={styles.messageText}>{message}</p>}
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
    border: '1px solid rgba(255, 255, 255, 0.05)',
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
    marginBottom: '1.25rem',
  },
  sliders: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    marginBottom: '1.25rem',
  },
  sliderGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.35rem',
  },
  rangeInput: {
    width: '100%',
    WebkitAppearance: 'none',
    background: 'var(--bg-tertiary)',
    height: '6px',
    borderRadius: 'var(--border-radius-full)',
    outline: 'none',
    cursor: 'pointer',
  },
  resultsBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '0.75rem 1.25rem',
    borderRadius: 'var(--border-radius-md)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    marginBottom: '1.25rem',
  },
  bmiCircle: {
    width: '68px',
    height: '68px',
    borderRadius: 'var(--border-radius-full)',
    border: '3px solid var(--neon-blue)',
    boxShadow: 'var(--neon-blue-glow)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bmiNum: {
    fontSize: '1.3rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '800',
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  bmiLabel: {
    fontSize: '0.55rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginTop: '0.1rem',
  },
  categoryInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  catLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  catVal: {
    fontSize: '1.25rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '700',
    textShadow: '0 0 10px rgba(0,0,0,0.5)',
  },
  gaugeContainer: {
    width: '100%',
    marginBottom: '1.5rem',
  },
  gaugeBar: {
    position: 'relative',
    height: '10px',
    borderRadius: 'var(--border-radius-full)',
    display: 'flex',
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  gaugeSegUnder: {
    flex: '18.5',
    background: 'var(--neon-purple)',
  },
  gaugeSegNormal: {
    flex: '6.5',
    background: 'var(--text-neon-lime)',
  },
  gaugeSegOver: {
    flex: '5',
    background: 'var(--neon-blue)',
  },
  gaugeSegObese: {
    flex: '10',
    background: 'var(--neon-red)',
  },
  gaugeNeedle: {
    position: 'absolute',
    top: '-3px',
    width: '6px',
    height: '16px',
    background: 'var(--text-primary)',
    borderRadius: 'var(--border-radius-full)',
    border: '1.5px solid var(--bg-primary)',
    boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
    transform: 'translateX(-50%)',
    transition: 'left var(--transition-normal)',
    zIndex: 10,
  },
  gaugeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    marginTop: '0.35rem',
    padding: '0 0.25rem',
  },
  saveBtn: {
    width: '100%',
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
  },
  messageText: {
    fontSize: '0.8rem',
    textAlign: 'center',
    marginTop: '0.75rem',
    fontWeight: '600',
  }
};
