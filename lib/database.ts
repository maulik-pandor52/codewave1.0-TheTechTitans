// Simple database simulation - in production, this would be replaced with a real database
interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  createdAt: string
}

interface AudioSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  fileName: string
  fileSize: number
  transcript: string
  confidence: number
  duration: number
  words: number
  speakers: number
  sentiment: string
  issues: Array<{
    problem: string
    count: number
    severity: 'high' | 'medium' | 'low'
  }>
  submittedAt: string
  apiUsed: string
  realTranscription: boolean
}

// In-memory database (in production, this would be a real database)
let users: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@callsenseai.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
]

let audioSubmissions: AudioSubmission[] = []

// Database operations
export const database = {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const existingUser = users.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    return newUser
  },

  async findUserByEmail(email: string): Promise<User | null> {
    return users.find(u => u.email === email) || null
  },

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = users.find(u => u.email === email && u.password === password)
    return user || null
  },

  async getAllUsers(): Promise<User[]> {
    return users.filter(u => u.role === 'user')
  },

  // Audio submission operations
  async createAudioSubmission(submissionData: Omit<AudioSubmission, 'id' | 'submittedAt'>): Promise<AudioSubmission> {
    const newSubmission: AudioSubmission = {
      ...submissionData,
      id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString()
    }

    audioSubmissions.push(newSubmission)
    return newSubmission
  },

  async getAllAudioSubmissions(): Promise<AudioSubmission[]> {
    return audioSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  },

  async getAudioSubmissionsByUser(userId: string): Promise<AudioSubmission[]> {
    return audioSubmissions.filter(s => s.userId === userId)
  },

  async getSubmissionStats() {
    const totalSubmissions = audioSubmissions.length
    const totalUsers = users.filter(u => u.role === 'user').length
    const recentSubmissions = audioSubmissions.filter(s => {
      const submittedDate = new Date(s.submittedAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return submittedDate > weekAgo
    }).length

    // Calculate most common issues
    const allIssues: { [key: string]: number } = {}
    audioSubmissions.forEach(submission => {
      submission.issues.forEach(issue => {
        allIssues[issue.problem] = (allIssues[issue.problem] || 0) + issue.count
      })
    })

    const topIssues = Object.entries(allIssues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([problem, count]) => ({ problem, count }))

    return {
      totalSubmissions,
      totalUsers,
      recentSubmissions,
      topIssues
    }
  }
}
