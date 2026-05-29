/* LoginPage.jsx - Futuristic login page with input glow effects */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError('Please fill in all credentials.');
      return;
    }
    
    setLoading(true);
    setFormError('');
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="cyber-card glow-blue" style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>🔐 Initialize Session</h2>
          <p style={styles.subtitle}>Enter credentials to synchronize telemetry</p>
        </div>

        {formError && <div style={styles.errorBox}>{formError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@fitcoach.ai" 
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Access Password</label>
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
            className="cyber-button" 
            style={styles.submitBtn}
          >
            {loading ? 'Decrypting...' : 'Access Platform 🔑'}
          </button>
        </form>

        <div style={styles.footer}>
          <span>New Athlete?</span>
          <button style={styles.linkBtn} onClick={() => onNavigate('register')}>
            Scaffold New Account
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
    padding: '4rem 1rem',
    minHeight: '80vh',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
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
  inputGroup: {
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
    ':focus': {
      borderColor: 'var(--neon-blue)',
      boxShadow: 'var(--neon-blue-glow)',
    }
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
    marginTop: '1.75rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-neon-cyan)',
    cursor: 'pointer',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif',
    padding: 0,
  }
};
