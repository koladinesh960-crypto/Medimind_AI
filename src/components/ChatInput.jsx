'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Square } from 'lucide-react';

export default function ChatInput({ onSend, isLoading, onCancel }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Describe your symptoms or ask a health question..."
          rows={1}
          disabled={isLoading}
          maxLength={2000}
          id="chat-input"
          aria-label="Chat message input"
        />
        <div className="chat-input-actions">
          {input.length > 0 && (
            <span className="char-count">{input.length}/2000</span>
          )}
          {isLoading ? (
            <button
              className="btn-send btn-cancel"
              onClick={onCancel}
              title="Cancel"
              aria-label="Cancel request"
            >
              <Square size={18} />
            </button>
          ) : (
            <button
              className="btn-send"
              onClick={handleSubmit}
              disabled={!input.trim()}
              title="Send message"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
      <p className="chat-input-hint">
        Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
