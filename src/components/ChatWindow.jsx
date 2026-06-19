'use client';

import { useRef, useEffect } from 'react';
import { MessageCircleHeart, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { STARTER_PROMPTS, APP_META } from '@/lib/constants';

export default function ChatWindow({ messages, isLoading, onStarterPrompt }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="chat-empty">
        <div className="chat-empty-content">
          <div className="chat-empty-icon">
            <MessageCircleHeart size={48} />
          </div>
          <h2>Welcome to {APP_META.name}</h2>
          <p>{APP_META.tagline}</p>

          <div className="chat-empty-starters">
            <h3>
              <Sparkles size={16} />
              Try asking...
            </h3>
            <div className="starter-grid">
              {STARTER_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  className="starter-card"
                  onClick={() => onStarterPrompt(prompt.prompt)}
                >
                  <span className="starter-card-icon">{prompt.icon}</span>
                  <span className="starter-card-title">{prompt.title}</span>
                  <span className="starter-card-text">{prompt.prompt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
