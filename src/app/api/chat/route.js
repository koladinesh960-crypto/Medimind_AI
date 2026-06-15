import { NextResponse } from 'next/server';
import { sendChatMessage } from '@/lib/gemini';
import { detectRedFlags } from '@/lib/redFlagDetector';
import { APP_META } from '@/lib/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Step 1: Red-flag detection
    const { isRedFlag, conditions } = detectRedFlags(message);

    // Step 2: Convert history format for Gemini
    const geminiHistory = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Step 3: Send to Gemini
    const aiResponse = await sendChatMessage(message, geminiHistory, isRedFlag);

    // Step 4: Ensure disclaimer is present
    let finalResponse = aiResponse;
    if (!finalResponse.includes('consult a qualified')) {
      finalResponse += `\n\n${APP_META.responseDisclaimer}`;
    }

    return NextResponse.json({
      response: finalResponse,
      isRedFlag,
      redFlagConditions: isRedFlag ? conditions : [],
    });
  } catch (error) {
    console.error('[Chat API Error]', error);

    if (error.message?.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'API key not configured. Please set GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}
