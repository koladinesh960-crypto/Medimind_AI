import { NextResponse } from 'next/server';
import { analyzeFile } from '@/lib/gemini';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const query = formData.get('query') || '';

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file size (20MB max)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 20MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Accepted: JPEG, PNG, GIF, WebP, PDF' },
        { status: 400 }
      );
    }

    // Convert to buffer (in-memory only — never written to disk)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Analyze with Gemini Vision
    const aiResponse = await analyzeFile(buffer, file.type, query);

    // Ensure analysis disclaimer
    let finalResponse = aiResponse;
    if (!finalResponse.includes('AI observation')) {
      finalResponse += '\n\n⚠️ This is an AI observation, not a medical diagnosis. Please share these results with your healthcare provider.';
    }

    return NextResponse.json({
      response: finalResponse,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('[Analyze API Error]', error);

    if (error.message?.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'API key not configured. Please set GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze file. Please try again.' },
      { status: 500 }
    );
  }
}
