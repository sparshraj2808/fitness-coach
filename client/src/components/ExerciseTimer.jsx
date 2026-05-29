/* ExerciseTimer.jsx - Interactive workout timer with synthesizer alarm */
import React, { useState, useEffect, useRef } from 'react';

export default function ExerciseTimer() {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(60);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      triggerSciFiAlarm();
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, secondsLeft]);

  // Synthesize a high-tech sci-fi beep using the Web Audio API
  const triggerSciFiAlarm = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Ring sequence: 3 futuristic synth beeps
      const playBeep = (time, freq, duration) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        // frequency glide for dynamic "synth" sound
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, time + duration);
        
        gainNode.gain.setValueAtTime(0.15, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(time);
        osc.stop(time + duration);
      };

      const now = audioCtx.currentTime;
      playBeep(now, 880, 0.35);
      playBeep(now + 0.4, 987, 0.35);
      playBeep(now + 0.8, 1200, 0.6);
    } catch (e) {
      console.warn('Web Audio Context not permitted or blocked by browser policies.', e);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(initialSeconds);
  };

  const addTime = (amount) => {
    setSecondsLeft((prev) => prev + amount);
    setInitialSeconds((prev) => prev + amount);
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute stroke offset for circular timer
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = secondsLeft / initialSeconds;
  const strokeDashoffset = circumference - (progressPercent * circumference);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>⏳ Cyber Exercise Timer</h3>
      <p style={styles.subtitle}>Log intervals between sets & exercises</p>
      
      <div style={styles.timerGraphic}>
        <svg style={styles.circleSvg} width="180" height="180">
          <circle 
            style={styles.circleBg}
            cx="90" 
            cy="90" 
            r={radius} 
          />
          <circle 
            style={{
              ...styles.circleFill,
              strokeDasharray: circumference,
              strokeDashoffset: isNaN(strokeDashoffset) ? 0 : strokeDashoffset,
              stroke: isActive ? 'var(--neon-green)' : 'var(--neon-blue)',
            }}
            cx="90" 
            cy="90" 
            r={radius} 
            transform="rotate(-90 90 90)"
          />
        </svg>
        <div style={{
          ...styles.display,
          color: isActive ? 'var(--text-neon-lime)' : 'var(--text-neon-cyan)',
          textShadow: isActive ? 'var(--neon-green-glow)' : 'var(--neon-blue-glow)',
        }}>
          {formatTime(secondsLeft)}
        </div>
      </div>

      <div style={styles.buttonRow}>
        <button className="cyber-button" style={styles.controlBtn} onClick={toggleTimer}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="cyber-button secondary" style={styles.controlBtn} onClick={resetTimer}>
          Reset
        </button>
      </div>

      <div style={styles.presetsRow}>
        <button style={styles.presetBtn} onClick={() => addTime(30)}>+30s</button>
        <button style={styles.presetBtn} onClick={() => addTime(60)}>+1m</button>
        <button style={styles.presetBtn} onClick={() => {
          setIsActive(false);
          setSecondsLeft(300);
          setInitialSeconds(300);
        }}>5m Tabata</button>
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
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: 'var(--glass-shadow)',
    width: '100%',
    maxWidth: '320px',
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
  timerGraphic: {
    position: 'relative',
    width: '180px',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  circleSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  circleBg: {
    fill: 'none',
    stroke: 'var(--bg-tertiary)',
    strokeWidth: '6',
  },
  circleFill: {
    fill: 'none',
    strokeWidth: '6',
    strokeLinecap: 'round',
    transition: 'stroke-dashoffset 1s linear, stroke var(--transition-normal)',
  },
  display: {
    fontSize: '2.2rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    transition: 'all var(--transition-normal)',
  },
  buttonRow: {
    display: 'flex',
    gap: '0.75rem',
    width: '100%',
    marginBottom: '1rem',
  },
  controlBtn: {
    flex: 1,
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
  },
  presetsRow: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
  },
  presetBtn: {
    flex: 1,
    background: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.35rem 0.5rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    transition: 'all var(--transition-fast)',
  }
};
