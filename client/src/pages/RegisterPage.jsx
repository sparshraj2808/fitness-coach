/* RegisterPage.jsx - Comprehensive user scaffolding and telemetry enrollment page */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('loss');
  const [experience, setExperience] = useState('beginner');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setFormError('Please fill in username, email, and password.');
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      await register({
        username,
        email,
        password,
        goal,
        experience,
        weight: Number(weight),
        height: Number(height)
      });
      onNavigate('dashboard');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="cyber-card glow-green" style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>🧬 Recruit New Athlete</h2>
          <p style={styles.subtitle}>Enlist below to initiate your customized training plans</p>
        </div>

        {formError && <div style={styles.errorBox}>{formError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Athlete Name</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="RippedWarrior" 
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="warrior@fitcoach.ai" 
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Goal</label>
              <select 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={styles.select}
              >
                <option value="loss">Weight Loss & Fitness</option>
                <option value="gain">Muscle Gain & Power</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Experience Level</label>
              <select 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                style={styles.select}
              >
                <option value="beginner">Beginner (Rookie)</option>
                <option value="intermediate">Intermediate (Adept)</option>
                <option value="advanced">Advanced (Veteran)</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Current Weight (kg)</label>
              <input 
                type="number" 
                min="30"
                max="250"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Current Height (cm)</label>
              <input 
                type="number" 
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroupFull}>
            <label style={styles.label}>Establish Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••" 
              style={styles.input}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="cyber-button secondary" 
            style={styles.submitBtn}
          >
            {loading ? 'Compiling Athlete...' : 'Initialize Account ⚡'}
          </button>
        </form>

        <div style={styles.footer}>
          <span>Registered?</span>
          <button style={styles.linkBtn} onClick={() => onNavigate('login')}>
            Synchronize Session
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
    minHeight: '85vh',
  },
  card: {
    width: '100%',
    maxWidth: '560px',
    padding: '2.5rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontFamily: 'Outfit, sans-serif',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '0.25rem',
  },
  errorBox: {
    background: 'rgba(255, 28, 67, 0.1)',
    border: '1px solid var(--neon-red)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.75rem 1rem',
    fontSize: '0.8rem',
    marginBottom: '1.5rem',
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroupFull: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  input: {
    background: 'var(--bg-tertiary)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.85rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all var(--transition-fast)',
  },
  select: {
    background: 'var(--bg-tertiary)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.85rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    padding: '0.85rem',
    marginTop: '0.5rem',
    justifyContent: 'center',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1.5rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-neon-lime)',
    cursor: 'pointer',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif',
    padding: 0,
  }
};
