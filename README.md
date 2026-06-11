# MediMind AI Assistant Bot

> 🏥 Your safe, smart, AI-powered medical companion

**MediMind** is a responsible AI medical assistant built for the **AI Model Development Contest 2026 – Indian Servers**. It provides educational health information through an intuitive chat interface with image/report analysis capabilities.

## ⚠️ Important Disclaimer

**MediMind is for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.**

## ✨ Features

1. **Text-Based Symptom Conversation** — Describe symptoms in plain language, get safe, educational responses
2. **Image & Report Analysis** — Upload X-rays, skin photos, lab reports (PDF/JPG/PNG) for AI observations
3. **Emergency Red-Flag Detection** — Automatic detection of dangerous symptom combinations with emergency guidance
4. **Patient-Friendly Explanations** — Complex medical terms translated to simple language
5. **Beautiful Chat UI** — Modern medical-themed interface with dark sidebar, glassmorphism, and animations
6. **Privacy-First** — No data stored beyond session; in-memory processing only

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- A [Google Gemini API key](https://aistudio.google.com/apikey) (free tier available)

### Setup

```bash
# Clone the repository
cd medimind-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| AI Model | Google Gemini 2.5 Flash |
| AI SDK | @google/genai |
| File Upload | React Dropzone |
| Icons | Lucide React |
| Markdown | react-markdown |

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.js          # Root layout + safety banner
│   ├── page.js            # Main dashboard
│   ├── globals.css        # Design system
│   └── api/
│       ├── chat/route.js  # Chat endpoint
│       └── analyze/route.js # File analysis endpoint
├── components/            # 10 React components
├── lib/                   # AI client, red-flag detector, prompts
└── hooks/                 # useChat state management
```

## 🛡️ Safety Features

- **No diagnosis, no prescriptions** — AI is restricted by system prompt
- **Emergency detection** — Chest pain, stroke signs, allergic reactions, infant fever, mental health crisis
- **Always-visible disclaimer** — Header banner, welcome modal, every response footer
- **Privacy notice** — Shown before any file upload
- **No data persistence** — Everything processed in-memory, nothing stored

## 📖 Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation.

## 📝 License

Built for AI Model Development Contest 2026 — Indian Servers.
