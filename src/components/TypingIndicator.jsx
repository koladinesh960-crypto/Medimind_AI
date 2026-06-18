'use client';

export default function TypingIndicator() {
  return (
    <div className="typing-indicator-container">
      <div className="typing-bubble">
        <div className="typing-avatar">M</div>
        <div className="typing-content">
          <div className="typing-dots">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
          <span className="typing-text">MediMind is thinking...</span>
        </div>
      </div>
    </div>
  );
}
