'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, MessageCircleHeart, X } from 'lucide-react';
import { APP_META } from '@/lib/constants';

export default function WelcomeModal({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('medimind-welcome-seen');
    if (!hasSeen) {
      setIsVisible(true);
    } else {
      onClose?.();
    }
  }, [onClose]);

  const handleClose = () => {
    sessionStorage.setItem('medimind-welcome-seen', 'true');
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close welcome modal">
          <X size={20} />
        </button>

        <div className="welcome-header">
          <div className="welcome-logo">
            <div className="welcome-logo-icon">
              <MessageCircleHeart size={36} />
            </div>
            <h1 className="welcome-title">{APP_META.name}</h1>
            <p className="welcome-tagline">{APP_META.tagline}</p>
          </div>
        </div>

        <div className="welcome-body">
          <div className="welcome-features">
            <div className="welcome-feature">
              <Sparkles size={20} className="feature-icon" />
              <div>
                <h3>Symptom Guidance</h3>
                <p>Describe your symptoms and get educational health information</p>
              </div>
            </div>
            <div className="welcome-feature">
              <ShieldCheck size={20} className="feature-icon" />
              <div>
                <h3>Report Analysis</h3>
                <p>Upload medical reports or images for AI-powered observations</p>
              </div>
            </div>
          </div>

          <div className="welcome-disclaimer-box">
            <ShieldCheck size={18} />
            <p>{APP_META.disclaimerFull}</p>
          </div>
        </div>

        <button className="welcome-cta" onClick={handleClose}>
          Get Started
        </button>
      </div>
    </div>
  );
}
