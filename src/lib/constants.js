export const MODEL_NAME = 'gemini-2.5-flash';

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

export const STARTER_PROMPTS = [
  {
    icon: '🤕',
    title: 'Symptom Check',
    prompt: 'I have a persistent headache and blurry vision for 2 days',
  },
  {
    icon: '🧒',
    title: 'Child Health',
    prompt: 'My child has a fever of 103°F — what should I do?',
  },
  {
    icon: '🔬',
    title: 'Lab Results',
    prompt: 'Explain what high creatinine levels mean',
  },
  {
    icon: '💊',
    title: 'Medicine Info',
    prompt: 'What are the common side effects of ibuprofen?',
  },
];

export const APP_META = {
  name: 'MediMind AI',
  tagline: 'Your safe, smart, AI-powered medical companion',
  version: '1.0.0',
  disclaimerShort: '⚠️ MediMind is for educational purposes only. Not a substitute for professional medical advice.',
  disclaimerFull:
    'This AI assistant provides general health information for educational purposes only. It does not provide medical diagnoses, treatment plans, or prescriptions. Always consult a qualified healthcare professional for medical advice.',
  privacyNotice:
    'Your data is processed securely and is not stored beyond this session. No medical images, reports, or personal health data are saved to any database. All processing happens in-memory and is automatically deleted after your session ends.',
  responseDisclaimer:
    '⚠️ This is for informational purposes only. Please consult a qualified doctor.',
};
