import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    // Validate user credentials
    const user = await database.validateUser(email, password)
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }

    // Check if role matches (for admin, must be admin role)
    if (role === 'admin' && user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Access denied. Admin credentials required.' 
      }, { status: 403 })
    }

    if (role === 'user' && user.role !== 'user') {
      return NextResponse.json({ 
        error: 'Invalid user credentials' 
      }, { status: 403 })
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({ 
      user: userWithoutPassword,
      message: 'Login successful' 
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Login failed. Please try again.' 
    }, { status: 500 })
  }
}
