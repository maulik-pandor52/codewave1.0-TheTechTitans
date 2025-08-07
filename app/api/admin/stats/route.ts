import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const stats = await database.getSubmissionStats()
    const allUsers = await database.getAllUsers()
    const allSubmissions = await database.getAllAudioSubmissions()
    
    return NextResponse.json({ 
      stats,
      users: allUsers.map(u => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt })),
      submissions: allSubmissions
    })

  } catch (error) {
    console.error('Get admin stats error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch admin statistics' 
    }, { status: 500 })
  }
}
