'use client';

import { Shield } from 'lucide-react';
import { APP_META } from '@/lib/constants';

export default function SafetyDisclaimer() {
  return (
    <div className="safety-disclaimer">
      <div className="safety-disclaimer-content">
        <Shield size={16} className="safety-icon" />
        <span>{APP_META.disclaimerShort}</span>
      </div>
    </div>
  );
}
