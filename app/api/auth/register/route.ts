import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: 'Name, email, and password are required' 
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 })
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters long' 
      }, { status: 400 })
    }

    // Only allow user registration (admin accounts are pre-created)
    if (role === 'admin') {
      return NextResponse.json({ 
        error: 'Admin accounts cannot be registered. Please contact system administrator.' 
      }, { status: 403 })
    }

    try {
      const newUser = await database.createUser({
        name,
        email,
        password,
        role: 'user'
      })

      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = newUser
      
      return NextResponse.json({ 
        user: userWithoutPassword,
        message: 'Registration successful' 
      })

    } catch (dbError) {
      if (dbError instanceof Error && dbError.message.includes('already exists')) {
        return NextResponse.json({ 
          error: 'An account with this email already exists' 
        }, { status: 409 })
      }
      throw dbError
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      error: 'Registration failed. Please try again.' 
    }, { status: 500 })
  }
}
