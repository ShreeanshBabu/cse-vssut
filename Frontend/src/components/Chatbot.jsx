import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, AlertCircle } from 'lucide-react';
import { publicApi } from '../api/client.js';
import { getClientChatFallback } from '../utils/chatClientFallback.js';
import { VSSUT_CSE } from '../data/vssut.js';

const MAX_MESSAGE_LENGTH = 500;

const WELCOME = `Hello! I'm the CSE VSSUT assistant. Ask about our ${VSSUT_CSE.btechStudents} B.Tech students, ${VSSUT_CSE.facultyCount} faculty, programmes, or the HOD.`;
const QUICK_PROMPTS = [
  'Who is the HOD of CSE?',
  'How many B.Tech students are in CSE?',
  'How many faculty are in CSE?',
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (rawMessage) => {
    const userMessage = rawMessage.trim();
    if (!userMessage || isLoading) return;
    if (userMessage.length > MAX_MESSAGE_LENGTH) return;

    setInput('');
    setNetworkError(false);
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await publicApi.chat(userMessage);
      const reply = res?.data?.reply;
      if (reply && typeof reply === 'string') {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: getClientChatFallback(userMessage) },
        ]);
      }
    } catch (err) {
      const status = err?.status;
      let errorMsg;
      if (status === 429) {
        errorMsg = 'You are sending messages too fast. Please wait a moment.';
        setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg, isError: true }]);
      } else if (status === 403) {
        setNetworkError(true);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Chat service access is temporarily restricted. Sharing a quick CSE answer now: ' +
              getClientChatFallback(userMessage),
          },
        ]);
      } else if (status === 404) {
        setNetworkError(true);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'I could not reach the live chat service endpoint, so here is a reliable quick answer: ' +
              getClientChatFallback(userMessage),
          },
        ]);
      } else if (!navigator.onLine || status === 0 || err?.message === 'Failed to fetch') {
        setNetworkError(true);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: getClientChatFallback(userMessage),
          },
        ]);
      } else if (err?.name === 'AbortError') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'The server is taking too long, so I am sharing a quick answer now: ' +
              getClientChatFallback(userMessage),
          },
        ]);
      } else if (status >= 500) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: getClientChatFallback(userMessage) },
        ]);
      } else {
        errorMsg = err?.message || 'Sorry, I could not process that. Please try again.';
        setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg, isError: true }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handlePromptClick = async (prompt) => {
    if (isLoading) return;
    await sendMessage(prompt);
  };

  const charsLeft = MAX_MESSAGE_LENGTH - input.length;

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="chatbot-toggle"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9998,
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))',
          color: '#0a0c10',
          border: 'none',
          boxShadow: '0 8px 32px var(--glow)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label="Open Chatbot"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="glass-panel chatbot-panel"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            width: 'min(calc(100vw - 2rem), 380px)',
            height: 'min(calc(100vh - 4rem), 600px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-glass)',
              background: 'var(--bg-glass-strong)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  background: 'var(--glow)',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={20} color="var(--accent-b)" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>CSE Assistant</h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: networkError ? '#f87171' : 'var(--accent-a)',
                  }}
                >
                  {networkError ? 'Offline' : 'Online'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn--ghost"
              style={{ padding: '0.5rem' }}
              aria-label="Close Chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {messages.length === 1 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.45rem',
                }}
              >
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => handlePromptClick(prompt)}
                    disabled={isLoading}
                    style={{
                      padding: '0.4rem 0.7rem',
                      borderRadius: '0.8rem',
                      fontSize: '0.78rem',
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  background: msg.isError
                    ? 'rgba(248, 113, 113, 0.15)'
                    : msg.role === 'user'
                      ? 'linear-gradient(135deg, var(--accent-a), var(--accent-b))'
                      : 'var(--bg-glass-strong)',
                  color: msg.isError
                    ? '#f87171'
                    : msg.role === 'user'
                      ? '#0a0c10'
                      : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderBottomRightRadius: msg.role === 'user' ? '0.25rem' : '1rem',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '0.25rem' : '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  wordBreak: 'break-word',
                }}
              >
                {msg.isError && <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />}
                <span>{msg.content}</span>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  background: 'var(--bg-glass-strong)',
                  borderBottomLeftRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                <Loader2 size={16} className="chatbot-spin" />
                <span>Thinking…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-glass)',
              background: 'var(--bg-glass-strong)',
              display: 'flex',
              gap: '0.5rem',
              flexShrink: 0,
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                placeholder="Ask me anything…"
                style={{
                  width: '100%',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-pill)',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={isLoading}
              />
              {input.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.65rem',
                    color: charsLeft < 50 ? '#f87171' : 'var(--text-faint)',
                    pointerEvents: 'none',
                  }}
                >
                  {charsLeft}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn btn--primary"
              style={{
                padding: '0.75rem',
                borderRadius: '50%',
                opacity: isLoading || !input.trim() ? 0.5 : 1,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              }}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        .chatbot-spin {
          animation: chatbot-spin-anim 1s linear infinite;
        }
        @keyframes chatbot-spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          .chatbot-panel {
            bottom: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
          }
          .chatbot-toggle {
            bottom: 1rem !important;
            right: 1rem !important;
          }
        }
      `}</style>
    </>
  );
}
