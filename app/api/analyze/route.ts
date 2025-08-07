import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

interface Issue {
  problem: string
  count: number
  severity: 'high' | 'medium' | 'low'
}

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 })
    }

    let issues: Issue[] = []

    // Try AI analysis first if OpenAI API key is available (but we removed it, so this will skip)
    const hasOpenAIKey = false // Removed OpenAI completely

    if (hasOpenAIKey) {
      // This block will never execute now
    } else {
      console.log('Using keyword analysis (OpenAI removed)')
      issues = performKeywordAnalysis(transcript)
    }

    // Sort by count (descending) and limit to top 10
    issues = issues
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return NextResponse.json({ issues })
  } catch (error) {
    console.error('Analysis error:', error)
    
    // Final fallback to keyword analysis
    const { transcript } = await request.json()
    const issues = performKeywordAnalysis(transcript)
    
    return NextResponse.json({ issues })
  }
}

function performKeywordAnalysis(transcript: string): Issue[] {
  const text = transcript.toLowerCase()
  
  // Enhanced problem keywords with more variations
  const problemKeywords = {
    'Service Delays & Timing Issues': [
      'delay', 'late', 'slow', 'waiting', 'behind schedule', 'overdue', 
      'taking too long', 'still waiting', 'not arrived', 'missed deadline'
    ],
    'App & Website Technical Problems': [
      'crash', 'error', 'bug', 'not working', 'broken', 'glitch', 'freeze',
      'loading', 'timeout', 'connection', 'server', 'down', 'offline'
    ],
    'Billing & Payment Issues': [
      'charge', 'billing', 'payment', 'refund', 'money', 'cost', 'price',
      'invoice', 'credit card', 'transaction', 'overcharged', 'double charged'
    ],
    'Poor Customer Service Experience': [
      'support', 'help', 'service', 'representative', 'unhelpful', 'rude',
      'hold time', 'wait time', 'transfer', 'hang up', 'no response'
    ],
    'Order & Delivery Problems': [
      'order', 'delivery', 'shipping', 'package', 'item', 'product',
      'missing', 'wrong item', 'damaged', 'lost package', 'tracking'
    ],
    'Account & Login Issues': [
      'account', 'login', 'password', 'access', 'profile', 'locked out',
      'forgot password', 'username', 'authentication', 'verification'
    ],
    'Product Quality Concerns': [
      'quality', 'defective', 'damaged', 'poor', 'bad', 'broken',
      'not as described', 'faulty', 'malfunctioning', 'disappointing'
    ],
    'Communication & Information Gaps': [
      'communication', 'notification', 'update', 'inform', 'notify',
      'no information', 'unclear', 'confusing', 'mixed messages'
    ],
    'Process & Policy Frustrations': [
      'process', 'procedure', 'policy', 'complicated', 'confusing', 'difficult',
      'bureaucratic', 'red tape', 'hoops', 'requirements'
    ],
    'Cancellation & Return Difficulties': [
      'cancel', 'return', 'refund', 'exchange', 'unsubscribe',
      'opt out', 'stop service', 'end subscription', 'terminate'
    ]
  }

  const issues: Issue[] = []

  for (const [problem, keywords] of Object.entries(problemKeywords)) {
    let count = 0
    let contextMatches = 0

    keywords.forEach(keyword => {
      // Count direct keyword matches
      const matches = text.match(new RegExp(`\\b${keyword}\\b`, 'g'))
      if (matches) {
        count += matches.length
        
        // Check for negative context around keywords
        const negativeContext = text.match(new RegExp(`(problem|issue|trouble|frustrated|angry|upset|disappointed).{0,50}\\b${keyword}\\b`, 'g'))
        if (negativeContext) contextMatches += negativeContext.length
      }
    })

    if (count > 0) {
      // Adjust severity based on frequency and negative context
      let severity: 'high' | 'medium' | 'low' = 'low'
      const totalScore = count + (contextMatches * 2) // Weight negative context more heavily
      
      if (totalScore >= 4 || contextMatches >= 2) severity = 'high'
      else if (totalScore >= 2 || contextMatches >= 1) severity = 'medium'

      issues.push({ problem, count: totalScore, severity })
    }
  }

  // If no issues found, add a default message
  if (issues.length === 0) {
    issues.push({
      problem: 'General customer inquiry or feedback',
      count: 1,
      severity: 'low'
    })
  }

  return issues.sort((a, b) => b.count - a.count).slice(0, 10)
}
