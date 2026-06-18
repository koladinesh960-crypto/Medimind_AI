'use client';

import Markdown from 'react-markdown';
import { User, Bot, AlertTriangle, FileText, Clock } from 'lucide-react';

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`message-row ${isUser ? 'message-user' : 'message-ai'} ${isError ? 'message-error' : ''}`}>
      <div className="message-avatar">
        {isUser ? (
          <div className="avatar avatar-user">
            <User size={18} />
          </div>
        ) : (
          <div className={`avatar avatar-ai ${isError ? 'avatar-error' : ''}`}>
            <Bot size={18} />
          </div>
        )}
      </div>

      <div className="message-content-wrap">
        <div className="message-meta">
          <span className="message-sender">{isUser ? 'You' : 'MediMind AI'}</span>
          <span className="message-time">
            <Clock size={12} />
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-ai'} ${isError ? 'bubble-error' : ''}`}>
          {message.isFileUpload && (
            <div className="file-badge">
              <FileText size={14} />
              <span>{message.fileName}</span>
            </div>
          )}

          {message.isRedFlag && message.redFlagConditions?.length > 0 && (
            <div className="inline-redflag">
              <AlertTriangle size={16} />
              <span>Emergency indicators detected</span>
            </div>
          )}

          {isUser ? (
            <p className="message-text">{message.content}</p>
          ) : (
            <div className="message-markdown">
              <Markdown>{message.content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
