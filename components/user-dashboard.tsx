'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Upload, FileAudio, CheckCircle, Users, MessageSquare } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface UserDashboardProps {
  onNavigate: (page: string) => void
}

interface Issue {
  problem: string
  count: number
  severity: 'high' | 'medium' | 'low'
}

const mockUsers = [
  {
    name: 'Hardik',
    issues: [
      { problem: 'App crash during checkout', count: 3, severity: 'high' as const },
      { problem: 'Payment processing delays', count: 2, severity: 'medium' as const }
    ]
  },
  {
    name: 'Het',
    issues: [
      { problem: 'Website loading errors', count: 4, severity: 'high' as const },
      { problem: 'Account access problems', count: 1, severity: 'low' as const }
    ]
  },
  {
    name: 'Maulik',
    issues: [
      { problem: 'Service delays', count: 2, severity: 'medium' as const },
      { problem: 'Poor customer support experience', count: 3, severity: 'high' as const }
    ]
  },
  {
    name: 'Chirag',
    issues: [
      { problem: 'Billing discrepancies', count: 1, severity: 'low' as const },
      { problem: 'Product delivery delays', count: 2, severity: 'medium' as const }
    ]
  }
]

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [transcriptMessage, setTranscriptMessage] = useState('')
  const [currentTranscript, setCurrentTranscript] = useState('')
  const { user } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadComplete(false)
      setTranscriptMessage('')
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    try {
      // Step 1: Transcribe the audio
      setProgress(25)
      const formData = new FormData()
      formData.append('audio', file)

      const transcriptResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      
      if (!transcriptResponse.ok) {
        throw new Error(`Transcription failed: ${transcriptResponse.status}`)
      }

      setProgress(50)
      const transcriptData = await transcriptResponse.json()
      
      if (transcriptData.error) {
        throw new Error(transcriptData.error)
      }

      // Step 2: Analyze the transcript
      setProgress(70)
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptData.transcript }),
      })
      
      if (!analysisResponse.ok) {
        throw new Error(`Analysis failed: ${analysisResponse.status}`)
      }
      
      const analysisData = await analysisResponse.json()
      
      if (analysisData.error) {
        throw new Error(analysisData.error)
      }

      // Step 3: Save to database
      setProgress(85)
      const submissionResponse = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name,
          userEmail: user?.email,
          fileName: file.name,
          fileSize: file.size,
          transcript: transcriptData.transcript,
          confidence: transcriptData.confidence,
          duration: transcriptData.duration,
          words: transcriptData.words,
          speakers: transcriptData.speakers,
          sentiment: transcriptData.sentiment,
          issues: analysisData.issues || [],
          apiUsed: transcriptData.api_used,
          realTranscription: transcriptData.real_transcription || false
        }),
      })

      if (!submissionResponse.ok) {
        console.warn('Failed to save submission to database')
      }

      setProgress(100)
      setUploadComplete(true)
      setCurrentTranscript(transcriptData.transcript)
      setTranscriptMessage(`Thank you! Your audio file "${file.name}" has been successfully submitted and transcribed. Our AI has analyzed the content and extracted key issues. Your feedback is valuable for improving our services.`)
      
    } catch (error) {
      console.error('Submission failed:', error)
      alert(`Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-400 mb-2">
            User Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Submit your audio files for AI analysis
          </p>
        </div>

        {/* Audio Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Submit Your Audio
            </CardTitle>
            <CardDescription>
              Upload your customer call recording for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-file">Audio File</Label>
              <Input
                id="audio-file"
                type="file"
                accept=".mp3,.wav,.m4a,.flac,.ogg,.webm"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            
            {file && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <FileAudio className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">{file.name}</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleSubmit} 
              disabled={!file || isUploading}
              className="w-full"
              size="lg"
            >
              {isUploading ? 'Submitting...' : 'Submit Audio'}
            </Button>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Processing your audio submission...
                </p>
              </div>
            )}

            {uploadComplete && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-300">
                      Response Submitted Successfully!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                      {transcriptMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentTranscript && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Your Audio Transcript
                  </CardTitle>
                  <CardDescription>
                    AI-generated transcript from your audio submission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {currentTranscript}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* User Issues Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Issues Overview
            </CardTitle>
            <CardDescription>
              Current issues reported by users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockUsers.map((user, index) => (
                <div key={index} className="p-4 bg-white dark:bg-gray-700 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                        {user.name[0]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {user.issues.map((issue, issueIndex) => (
                      <div key={issueIndex} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                          {issue.problem}
                        </span>
                        <Badge className={getSeverityColor(issue.severity)} size="sm">
                          {issue.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
