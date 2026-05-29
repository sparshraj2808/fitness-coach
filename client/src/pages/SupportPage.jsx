/* SupportPage.jsx - Platform FAQs and interactive support ticketing form */
import React, { useState } from 'react';

const FAQS = [
  {
    question: "🌐 How does the FitCoach AI Sandbox database operate?",
    answer: "By default, FitCoach AI operates in a zero-dependency sandbox. It creates a local 'db.json' inside the server directory to preserve user sessions, workout logs, water metrics, and achievements. If you want to scale to production, simply provide a MONGODB_URI in the server's environment configuration."
  },
  {
    question: "🤖 Can I hook up a real Large Language Model to the chatbot?",
    answer: "Absolutely! The chatbot is AI-ready. If you add your GEMINI_API_KEY (or OpenAI key) inside the server's '.env' configuration, the platform automatically redirects prompts to the live intelligence engine, enabling extremely custom, generative training advice."
  },
  {
    question: "🎤 How does the voice dictation microphone work?",
    answer: "We leverage the browser's native Web Speech API. When clicking the mic button, the browser requests standard microphone access, listens to your voice locally, transcribes it to text with zero API costs, and populates your input field."
  },
  {
    question: "⏳ Does the exercise timer run in the background?",
    answer: "Yes! The timer is designed using React state hooks and standard intervals. When it hits zero, it triggers a customized, synthesized beep signal via the browser's Web Audio API, even if you are checking off exercises in the list."
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleToggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!subject || !desc) return;
    
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setSubject('');
      setDesc('');
      setTimeout(() => setSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="main-content">
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>📞 Support & FAQ Terminal</h1>
        <p style={styles.pageSubtitle}>Resolve platform questions or submit a direct ticket to our engineering deck.</p>
      </div>

      <div style={styles.splitLayout}>
        {/* Left Side: Expandable FAQ */}
        <div style={styles.leftCol}>
          <h2 style={styles.sectionHeading}>📖 Frequently Asked Questions</h2>
          <div style={styles.faqList}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="cyber-card" 
                  style={{
                    ...styles.faqCard,
                    borderColor: isOpen ? 'var(--neon-blue)' : 'rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={styles.faqHeader} onClick={() => handleToggleFaq(idx)}>
                    <h4 style={{
                      ...styles.faqQuestion,
                      color: isOpen ? 'var(--text-neon-cyan)' : 'var(--text-primary)'
                    }}>
                      {faq.question}
                    </h4>
                    <span style={styles.faqArrow}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                  
                  {isOpen && (
                    <div style={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Contact/Ticket Form */}
        <div style={styles.rightCol}>
          <div className="cyber-card glow-blue" style={styles.ticketCard}>
            <h3 style={styles.cardTitle}>🎟️ Submit Telemetry Ticket</h3>
            <p style={styles.cardSubtitle}>Found a bug or need customized platform assistance? Submit details below.</p>

            {success ? (
              <div style={styles.successMessage}>
                🎉 Support Ticket Dispatched! A technician will synchronize with your session shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ticket Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="E.g., Hydration badge unlock error" 
                    style={styles.textInput}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Problem Description</label>
                  <textarea 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Provide granular steps to replicate the metric issue..." 
                    style={styles.textArea}
                    rows="5"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || !subject || !desc}
                  className="cyber-button" 
                  style={styles.submitBtn}
                >
                  {submitting ? 'Transmitting...' : 'Dispatch Ticket 🚀'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    marginBottom: '2.5rem',
  },
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
  },
  pageSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginTop: '0.2rem',
  },
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2.5rem',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeading: {
    fontSize: '1.4rem',
    fontFamily: 'Outfit, sans-serif',
    marginBottom: '1.25rem',
    color: 'var(--text-primary)',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  faqCard: {
    padding: '1.25rem',
    cursor: 'pointer',
  },
  faqHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  faqQuestion: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.95rem',
    fontWeight: '700',
  },
  faqArrow: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  faqAnswer: {
    marginTop: '0.85rem',
    paddingTop: '0.85rem',
    borderTop: '1px solid rgba(255,255,255,0.03)',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  rightCol: {
    flex: 1,
  },
  ticketCard: {
    padding: '2.5rem 2rem',
  },
  cardTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
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
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: '0.4rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  textInput: {
    background: 'var(--bg-tertiary)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.75rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  textArea: {
    background: 'var(--bg-tertiary)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.75rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%',
    padding: '0.8rem',
    justifyContent: 'center',
  },
  successMessage: {
    background: 'rgba(0, 240, 255, 0.1)',
    border: '1px solid var(--neon-blue)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1.25rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    textAlign: 'center',
    boxShadow: 'var(--neon-blue-glow)',
  }
};
