import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const submissionData = await request.json()

    const newSubmission = await database.createAudioSubmission(submissionData)
    
    return NextResponse.json({ 
      submission: newSubmission,
      message: 'Audio submission saved successfully' 
    })

  } catch (error) {
    console.error('Submission save error:', error)
    return NextResponse.json({ 
      error: 'Failed to save submission' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let submissions
    if (userId) {
      submissions = await database.getAudioSubmissionsByUser(userId)
    } else {
      submissions = await database.getAllAudioSubmissions()
    }
    
    return NextResponse.json({ submissions })

  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch submissions' 
    }, { status: 500 })
  }
}
