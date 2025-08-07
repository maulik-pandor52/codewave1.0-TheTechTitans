'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { TrendingUp, AlertCircle, Users, BarChart3, TrendingDown, RefreshCw, FileAudio, Clock, MessageSquare } from 'lucide-react'

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

interface AdminStats {
  totalSubmissions: number
  totalUsers: number
  recentSubmissions: number
  topIssues: Array<{ problem: string; count: number }>
}

interface IssueRanking {
  problem: string
  totalCount: number
  occurrences: number
  percentage: number
  severity: 'high' | 'medium' | 'low'
  affectedUsers: string[]
  recentSubmissions: string[]
}

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState<AudioSubmission[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [issueRankings, setIssueRankings] = useState<IssueRanking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<AudioSubmission | null>(null)

  const calculateIssueRankings = (submissions: AudioSubmission[]): IssueRanking[] => {
    const issueMap: { [key: string]: IssueRanking } = {}
    
    submissions.forEach(submission => {
      submission.issues.forEach(issue => {
        if (!issueMap[issue.problem]) {
          issueMap[issue.problem] = {
            problem: issue.problem,
            totalCount: 0,
            occurrences: 0,
            percentage: 0,
            severity: issue.severity,
            affectedUsers: [],
            recentSubmissions: []
          }
        }
        
        issueMap[issue.problem].totalCount += issue.count
        issueMap[issue.problem].occurrences += 1
        
        // Track affected users (avoid duplicates)
        if (!issueMap[issue.problem].affectedUsers.includes(submission.userName)) {
          issueMap[issue.problem].affectedUsers.push(submission.userName)
        }
        
        // Track recent submissions (last 5)
        if (issueMap[issue.problem].recentSubmissions.length < 5) {
          issueMap[issue.problem].recentSubmissions.push(submission.fileName)
        }
        
        // Update severity to highest found
        if (issue.severity === 'high') {
          issueMap[issue.problem].severity = 'high'
        } else if (issue.severity === 'medium' && issueMap[issue.problem].severity === 'low') {
          issueMap[issue.problem].severity = 'medium'
        }
      })
    })
    
    // Calculate percentages and sort by total impact
    const totalSubmissions = submissions.length
    const rankings = Object.values(issueMap).map(issue => ({
      ...issue,
      percentage: totalSubmissions > 0 ? Math.round((issue.occurrences / totalSubmissions) * 100) : 0
    }))
    
    // Sort by total count (impact) descending
    return rankings.sort((a, b) => b.totalCount - a.totalCount)
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        const fetchedSubmissions = data.submissions || []
        
        setSubmissions(fetchedSubmissions)
        setStats(data.stats || { totalSubmissions: 0, totalUsers: 0, recentSubmissions: 0, topIssues: [] })
        
        // Calculate real-time issue rankings
        const rankings = calculateIssueRankings(fetchedSubmissions)
        setIssueRankings(rankings)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      case 'neutral': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 50) return 'bg-red-500'
    if (percentage >= 25) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-400 mb-2">
              Admin Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Real-Time CallSense AI Analytics & Issue Rankings
            </p>
          </div>
          <Button onClick={fetchData} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Real-time Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileAudio className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.totalSubmissions || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.totalUsers || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Registered Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats?.recentSubmissions || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {issueRankings.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Issue Types</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Issue Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Real-Time Issue Rankings
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-800">
                LIVE DATA
              </Badge>
            </CardTitle>
            <CardDescription>
              Issues automatically categorized and ranked from user audio submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {issueRankings.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No Issues Detected Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Issue rankings will appear here automatically as users submit audio files.
                </p>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md mx-auto">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Ready for Real Data:</strong> Register multiple accounts and upload audio files to see live issue analysis and rankings!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {issueRankings.map((issue, index) => (
                  <div key={index} className="p-6 bg-white dark:bg-gray-700 rounded-lg border shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {issue.problem}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getSeverityColor(issue.severity)} size="sm">
                              {issue.severity} priority
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {issue.occurrences} occurrence{issue.occurrences !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {issue.percentage}%
                        </p>
                        <p className="text-sm text-gray-500">of submissions</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Progress 
                        value={issue.percentage} 
                        className="h-3"
                        style={{
                          '--progress-background': getProgressColor(issue.percentage)
                        } as React.CSSProperties}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Impact Score</p>
                        <p className="text-lg font-bold text-blue-600">{issue.totalCount}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Affected Users</p>
                        <div className="flex flex-wrap gap-1">
                          {issue.affectedUsers.slice(0, 3).map((user, idx) => (
                            <Badge key={idx} variant="outline" size="sm">
                              {user}
                            </Badge>
                          ))}
                          {issue.affectedUsers.length > 3 && (
                            <Badge variant="outline" size="sm">
                              +{issue.affectedUsers.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Recent Files</p>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {issue.recentSubmissions.slice(0, 2).map((file, idx) => (
                            <div key={idx} className="truncate">{file}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Live User Submissions
              <Badge variant="outline" className="ml-2">
                {submissions.length} Total
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time audio submissions from users with AI analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <FileAudio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No user submissions yet. Submissions will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="p-4 bg-white dark:bg-gray-700 rounded-lg border shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                            {submission.userName[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {submission.userName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {submission.userEmail}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={submission.realTranscription ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-800"}>
                          {submission.apiUsed}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-600 rounded">
                        <p className="text-xs text-gray-600 dark:text-gray-300">File</p>
                        <p className="text-sm font-medium">{submission.fileName}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-600 rounded">
                        <p className="text-xs text-gray-600 dark:text-gray-300">Duration</p>
                        <p className="text-sm font-medium">{formatDuration(submission.duration)}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-600 rounded">
                        <p className="text-xs text-gray-600 dark:text-gray-300">Confidence</p>
                        <p className="text-sm font-medium">{(submission.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-600 rounded">
                        <p className="text-xs text-gray-600 dark:text-gray-300">Sentiment</p>
                        <p className={`text-sm font-medium ${getSentimentColor(submission.sentiment)}`}>
                          {submission.sentiment}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-600 rounded">
                        <p className="text-xs text-gray-600 dark:text-gray-300">Issues</p>
                        <p className="text-sm font-medium">{submission.issues.length}</p>
                      </div>
                    </div>

                    {submission.issues.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Identified Issues:</p>
                        <div className="flex flex-wrap gap-2">
                          {submission.issues.slice(0, 3).map((issue, index) => (
                            <Badge key={index} className={getSeverityColor(issue.severity)} size="sm">
                              {issue.problem} ({issue.severity})
                            </Badge>
                          ))}
                          {submission.issues.length > 3 && (
                            <Badge variant="outline" size="sm">
                              +{submission.issues.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {selectedSubmission?.id === submission.id ? 'Hide' : 'View'} Transcript
                    </Button>

                    {selectedSubmission?.id === submission.id && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg border">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {submission.transcript}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
