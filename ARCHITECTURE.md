# MediMind AI Assistant — Architecture

## Model Used
- **Text & Vision**: Gemini 2.5 Flash (`gemini-2.5-flash`) via `@google/genai` SDK
- Gemini 2.5 Flash handles both text chat and image/PDF analysis in a single model
- No separate vision model needed — unified multimodal capabilities

> **Note**: Gemini 1.5 Flash and 2.0 Flash were shut down as of June 1, 2026. This project uses the currently stable `gemini-2.5-flash` model.

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **AI SDK**: `@google/genai` (Node.js)
- **File Upload**: React Dropzone
- **Markdown**: react-markdown
- **Icons**: Lucide React

## Prompt Engineering Strategy
- **System prompt** enforces safety boundaries: no diagnosis, no prescriptions, emergency escalation
- **Few-shot-style instructions** guide tone: empathetic, simple, cautious, structured
- **Report analysis** uses a specialized prompt that outputs structured sections (Key Observations, Items Requiring Attention, Simple Explanation, Next Steps)
- **Emergency addendum** is dynamically prepended when red-flag patterns are detected
- All responses checked for disclaimer presence in post-processing

## Red-Flag Detection

### Layer 1: Keyword Matching
- 13 pattern groups covering cardiac emergencies, stroke, anaphylaxis, infant fever, mental health crisis, overdose, seizures, severe bleeding, and more
- Two matching modes: `matchAll` (all keywords must appear) and `matchAny` (any keyword triggers)
- Case-insensitive matching against user input

### Layer 2: LLM Semantic Check
- When keyword detection triggers, the system prompt is augmented with `EMERGENCY_ADDENDUM`
- This instructs the LLM to start its response with an emergency warning block
- Provides condition-specific guidance (CPR instructions, poison control numbers, etc.)

### Detection → UI Flow
1. User message → `redFlagDetector.detectRedFlags()` → keyword match
2. If triggered → API response includes `isRedFlag: true` + condition details
3. Frontend renders `<RedFlagAlert>` modal with emergency guidance + phone numbers
4. All red-flag events logged with timestamps (in-memory, console output)

## Privacy Handling
- **No medical data written to any database** — all processing is in-memory
- Uploaded files are converted to base64 `Buffer` objects, sent to Gemini API, then garbage collected
- **No file system writes** — files never touch disk
- **Sessions are stateless** — no cookies, no tracking, no user identification
- Chat history is maintained only in React state (browser memory) — lost on page refresh
- Privacy notice modal displayed before first file upload

## Safety Disclaimers
Shown in three locations (hardcoded, cannot be disabled):
1. **App header** — Always-visible `<SafetyDisclaimer>` banner
2. **First load** — Welcome modal with full disclaimer text
3. **Every AI response** — Footer disclaimer: "⚠️ This is for informational purposes only. Please consult a qualified doctor."

## Project Structure
```
medimind-app/
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout + safety banner
│   │   ├── page.js                # Main dashboard/chat page
│   │   ├── globals.css            # Design system + Tailwind v4
│   │   └── api/
│   │       ├── chat/route.js      # POST /api/chat
│   │       └── analyze/route.js   # POST /api/analyze
│   ├── components/                # 10 React components
│   ├── lib/                       # Gemini client, red-flag detector, prompts, constants
│   └── hooks/                     # useChat hook
├── ARCHITECTURE.md
├── .env.example
└── README.md
```
