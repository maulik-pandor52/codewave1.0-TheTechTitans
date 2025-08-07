'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Users, Zap, Shield, Target, Award } from 'lucide-react'

export function AboutPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze customer calls to extract meaningful insights and identify recurring issues.'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: 'Real-Time Processing',
      description: 'Fast transcription and analysis using AssemblyAI Professional API with sentiment analysis and speaker detection.'
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: 'Issue Prioritization',
      description: 'Automatically ranks problems by severity and frequency to help you focus on what matters most to your customers.'
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: 'Enterprise Security',
      description: 'Secure processing of sensitive customer data with enterprise-grade privacy and compliance standards.'
    }
  ]

  const teamMembers = [
    { name: 'Hardik', role: 'AI Engineer', expertise: 'Machine Learning & NLP' },
    { name: 'Het', role: 'Backend Developer', expertise: 'API Development & Integration' },
    { name: 'Maulik', role: 'Frontend Developer', expertise: 'UI/UX & React Development' },
    { name: 'Chirag', role: 'Product Manager', expertise: 'Strategy & Customer Analytics' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-400">
            About CallSenseAI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            CallSense is a smart call analysis tool that turns audio calls into text and identifies key problems using AI. We help users quickly understand the main issues discussed in any conversation—making communication clearer, faster, and&nbsp;more&nbsp;effective.
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            By The Tech Titans
          </Badge>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-purple-900 dark:text-purple-400">
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our mission with CallSense is to make it easy for businesses to understand what their customers are struggling with—just by listening to their calls. Instead of going through hours of call recordings, we help teams instantly see the most common problems using speech-to-text and AI. This saves time, reduces support tickets, and improves customer&nbsp;satisfaction.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Meet The Tech Titans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                    {member.name[0]}
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-400 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {member.expertise}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Technology Stack</CardTitle>
            <CardDescription className="text-center">
              Powered by cutting-edge AI and modern web technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">AI & ML</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  AssemblyAI, OpenAI, Natural Language Processing
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-300">Frontend</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  React, Next.js, TypeScript, Tailwind CSS
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-300">Backend</h3>
                <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                  Node.js, API Routes, Server Actions
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h3 className="font-semibold text-orange-900 dark:text-orange-300">Infrastructure</h3>
                <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                  Vercel, Cloud APIs, Real-time Processing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center p-8">
            <Award className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ready to Transform Your Customer Service? With Team The Tech Titans :)       </h2>
            <p className="text-blue-100 mb-4">
              Join thousands of businesses using CallSenseAI to improve customer satisfaction
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
