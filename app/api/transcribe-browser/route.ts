import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('audio') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    console.log('Browser transcription for:', file.name)

    // For now, use demo mode to ensure stability
    return generateBrowserDemo(file)

  } catch (error) {
    console.error('Browser transcription error:', error)
    return NextResponse.json({ 
      error: 'Transcription failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function generateBrowserDemo(file: File) {
  const transcript = `This is a demo transcription using browser-based processing for the file "${file.name}". In a production environment, this would use real speech-to-text APIs like OpenAI Whisper or Google Speech-to-Text to convert the actual audio content into text. The customer in this call discusses various service-related concerns including account access issues, billing questions, and requests for technical support. They mention problems with the mobile application, website performance, and delivery tracking. The overall tone suggests they are seeking resolution for multiple interconnected issues that have been affecting their user experience.`

  return NextResponse.json({
    transcript,
    confidence: 0.88,
    duration: Math.floor(file.size / 50000),
    words: transcript.split(' ').length,
    speakers: 1,
    sentiment: 'neutral',
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type
    },
    demo_mode: true,
    api_used: 'Browser Demo Mode'
  })
}
