/* ChatbotPage.jsx - Premium AI personal trainer chat panel with voice dictation */
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const QUICK_PROMPTS = [
  { text: "🏋️‍♂️ Generate a Home Fat-Burn Routine", query: "Give me an intense home bodyweight circuit for fat loss." },
  { text: "🥗 Draft a Muscle-Building Diet", query: "What should I eat to build muscle? Give me a meal plan and macro layout." },
  { text: "💧 Design custom hydration habits", query: "Explain how much water I need to drink and give me 3 hydration habits." },
  { text: "🔥 Give me today's coach challenge", query: "Give me some heavy motivation and today's coach workout challenge!" }
];

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const chatEndRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const logs = await api.getChatHistory();
      if (logs.length === 0) {
        // Create initial greeting message if empty
        setMessages([
          {
            _id: 'welcome',
            sender: 'coach',
            message: `⚡ **Welcome to FitCoach AI, ${user?.username || 'Athlete'}!** \n\nI am your digital fitness coach, personal trainer, and nutrition specialist. I'm completely tuned to help you crush your goal of **${user?.goal || 'fitness'}**!\n\nFeel free to ask me anything about workouts, recovery, hydration, macro ratios, or meal prep. \n\n*What are we attacking today? Choose a quick prompt on the left or type your query below!*`,
            createdAt: new Date().toISOString()
          }
        ]);
      } else {
        setMessages(logs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText('');
    setLoading(true);

    // Optimistically push user message
    const userMsg = {
      _id: 'temp_user_' + Date.now(),
      sender: 'user',
      message: text.trim(),
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await api.sendChatMessage(text.trim());
      // Append official coach message
      setMessages((prev) => [...prev.filter(m => !m._id.startsWith('temp_user')), res.userMessage, res.coachMessage]);
    } catch (err) {
      console.error(err);
      const errMsg = {
        _id: 'temp_err_' + Date.now(),
        sender: 'coach',
        message: '❌ *Failed to communicate with your AI Coach. Please check your local server or API key configs.*',
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your entire chat log history?")) {
      try {
        await api.clearChatHistory();
        setMessages([
          {
            _id: 'welcome',
            sender: 'coach',
            message: `🧹 *Conversation logs wiped clean.* \n\nI am ready to build brand new workout splits and health charts for you. Ask me anything!`,
            createdAt: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Browser Web Speech Recognition dictation handler
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      setTimeout(() => setSpeechError(''), 4000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (recording) {
      setRecording(false);
      return;
    }

    setRecording(true);
    setSpeechError('');

    recognition.start();

    recognition.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      setInputText((prev) => (prev ? prev + ' ' + resultText : resultText));
      setRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setSpeechError(`Voice input failed: ${event.error}`);
      setRecording(false);
      setTimeout(() => setSpeechError(''), 4000);
    };

    recognition.onend = () => {
      setRecording(false);
    };
  };

  // Zero-dependency beautiful Markdown processor for chat bubble content
  const renderMarkdown = (text) => {
    if (!text) return '';
    
    // Standard sanitize / escape helper logic
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headers (### Header)
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Bold text (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet lists (- text)
    // Wrap consecutive list items in <ul>
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    
    // Block quotes (> text)
    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote>$1</blockquote>');

    // Disclaimers (horizontal rule + small italicized disclaimer)
    html = html.replace(/^---$/gm, '<hr />');
    html = html.replace(/^\*FitCoach Disclaimer:(.*?)\*$/gm, '<em>FitCoach Disclaimer: $1</em>');

    // Split text by newlines and wrap in paragraphs if they are not lists/headers
    const lines = html.split('\n');
    let insideList = false;
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('<li>')) {
        if (!insideList) {
          insideList = true;
          return '<ul>' + line;
        }
        return line;
      } else {
        if (insideList) {
          insideList = false;
          return '</ul>' + (trimmed === '' ? '' : `<p>${line}</p>`);
        }
        
        if (trimmed === '' || trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr') || trimmed.startsWith('<blockquote>')) {
          return line;
        }
        return `<p>${line}</p>`;
      }
    });

    let finalHtml = processedLines.join('\n');
    if (insideList) finalHtml += '</ul>';

    return <div dangerouslySetInnerHTML={{ __html: finalHtml }} />;
  };

  return (
    <div className="main-content">
      <div style={styles.chatLayout}>
        {/* Left Side: Instructions & Quick Prompts */}
        <div className="cyber-card" style={styles.promptSidebar}>
          <h3 style={styles.sidebarTitle}>🤖 AI Command deck</h3>
          <p style={styles.sidebarSub}>Tap any action card below to deploy instant training telemetry.</p>
          
          <div style={styles.promptsContainer}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <div 
                key={idx} 
                className="prompt-card" 
                onClick={() => handleSendMessage(prompt.query)}
              >
                <span>{prompt.text}</span>
              </div>
            ))}
          </div>

          <div style={styles.sidebarFooter}>
            <button className="cyber-button secondary" style={styles.clearBtn} onClick={handleClearHistory}>
              🧹 Clear Chat Log
            </button>
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div style={styles.chatArea}>
          <div className="chat-container">
            {/* Conversation Messages */}
            <div style={styles.messagesContainer}>
              {messages.map((msg) => (
                <div 
                  key={msg._id} 
                  className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'coach'}`}
                >
                  {msg.sender === 'coach' ? (
                    renderMarkdown(msg.message)
                  ) : (
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                  )}
                  <span style={styles.timeText}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {loading && (
                <div className="chat-bubble coach" style={styles.loaderBubble}>
                  <div style={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span style={styles.loaderText}>Coach is designing your plan...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Error notifications */}
            {speechError && <div style={styles.speechErrorAlert}>{speechError}</div>}

            {/* Input Bar */}
            <div style={styles.inputBar}>
              <button 
                className={`voice-record-btn ${recording ? 'recording' : ''}`}
                title="Dictate message"
                onClick={handleToggleVoice}
              >
                🎤
              </button>
              
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={recording ? "Listening... speak now." : "Ask about workouts, diet, macros..."}
                style={styles.textInput}
                disabled={loading}
              />

              <button 
                className="cyber-button" 
                style={styles.sendBtn}
                onClick={() => handleSendMessage()}
                disabled={loading || !inputText.trim()}
              >
                Send 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  chatLayout: {
    display: 'flex',
    gap: '2rem',
    height: 'calc(100vh - 120px)',
  },
  promptSidebar: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1.5rem',
  },
  sidebarTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.2rem',
  },
  sidebarSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
  promptsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    flex: 1,
    overflowY: 'auto',
  },
  sidebarFooter: {
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    marginTop: '1rem',
  },
  clearBtn: {
    width: '100%',
    padding: '0.65rem',
    fontSize: '0.75rem',
  },
  chatArea: {
    flex: 1,
    height: '100%',
  },
  messagesContainer: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  timeText: {
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    display: 'block',
    textAlign: 'right',
    marginTop: '0.35rem',
  },
  loaderBubble: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  typingIndicator: {
    display: 'flex',
    gap: '0.25rem',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  speechErrorAlert: {
    background: 'rgba(255,28,67,0.1)',
    borderBottom: '1px solid var(--neon-red)',
    color: 'var(--text-primary)',
    padding: '0.5rem 1.5rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    textAlign: 'center',
  },
  inputBar: {
    padding: '1rem 1.5rem',
    background: 'rgba(8, 14, 28, 0.95)',
    borderTop: '1px solid var(--glass-border)',
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    background: 'var(--bg-tertiary)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.75rem 1.25rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all var(--transition-fast)',
  },
  sendBtn: {
    padding: '0.65rem 1.5rem',
    fontSize: '0.85rem',
  }
};
