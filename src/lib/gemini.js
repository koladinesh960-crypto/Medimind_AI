import { GoogleGenAI } from '@google/genai';
import { MODEL_NAME } from './constants';
import { SYSTEM_PROMPT, REPORT_ANALYSIS_PROMPT, EMERGENCY_ADDENDUM } from './systemPrompt';

let aiClient = null;

function getClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not set. Please add it to your .env.local file.'
      );
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * Send a chat message with conversation history.
 * @param {string} message - User's current message
 * @param {Array} history - Previous conversation turns [{role, parts}]
 * @param {boolean} isEmergency - Whether red-flag was detected
 * @returns {Promise<string>} AI response text
 */
export async function sendChatMessage(message, history = [], isEmergency = false) {
  const ai = getClient();

  let systemInstruction = SYSTEM_PROMPT;
  if (isEmergency) {
    systemInstruction += '\n\n' + EMERGENCY_ADDENDUM;
  }

  const chat = ai.chats.create({
    model: MODEL_NAME,
    history: history,
    config: {
      systemInstruction: systemInstruction,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}

/**
 * Analyze an uploaded file (image or PDF) with Gemini Vision.
 * @param {Buffer} fileBuffer - File data as Buffer
 * @param {string} mimeType - MIME type of the file
 * @param {string} userQuery - Optional user query about the file
 * @returns {Promise<string>} AI analysis text
 */
export async function analyzeFile(fileBuffer, mimeType, userQuery = '') {
  const ai = getClient();

  const base64Data = fileBuffer.toString('base64');

  const prompt = userQuery
    ? `${userQuery}\n\nPlease analyze the uploaded document following your guidelines.`
    : 'Please analyze this medical document/image and provide your observations following your guidelines.';

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    config: {
      systemInstruction: REPORT_ANALYSIS_PROMPT,
    },
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt },
        ],
      },
    ],
  });

  return response.text;
}
