'use client'

import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { Navigation } from '@/components/navigation'
import { LoginPage } from '@/components/login-page'
import { RegisterPage } from '@/components/register-page'
import { UserDashboard } from '@/components/user-dashboard'
import { AdminDashboard } from '@/components/admin-dashboard'
import { AboutPage } from '@/components/about-page'
import { ContactPage } from '@/components/contact-page'

// Import the original CallSense component
import OriginalCallSense from '@/components/original-callsense'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('login')
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // If user is authenticated, redirect to appropriate dashboard
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        setCurrentPage('admin-dashboard')
      } else {
        setCurrentPage('user-dashboard')
      }
    } else if (!isAuthenticated) {
      // If not authenticated, show login
      setCurrentPage('login')
    }
  }, [isAuthenticated, user])

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading CallSenseAI...</p>
        </div>
      </div>
    )
  }

  const handleNavigation = (page: string) => {
    setCurrentPage(page)
  }

  // Show navigation only when authenticated
  const showNavigation = isAuthenticated && !['login', 'register'].includes(currentPage)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {showNavigation && (
        <Navigation currentPage={currentPage} onNavigate={handleNavigation} />
      )}
      
      {/* Route to appropriate page */}
      {!isAuthenticated && currentPage === 'login' && (
        <LoginPage onNavigate={handleNavigation} />
      )}
      
      {!isAuthenticated && currentPage === 'register' && (
        <RegisterPage onNavigate={handleNavigation} />
      )}
      
      {isAuthenticated && user?.role === 'user' && (currentPage === 'home' || currentPage === 'user-dashboard') && (
        <UserDashboard onNavigate={handleNavigation} />
      )}
      
      {isAuthenticated && user?.role === 'admin' && (currentPage === 'home' || currentPage === 'admin-dashboard') && (
        <AdminDashboard />
      )}
      
      {isAuthenticated && currentPage === 'about' && (
        <AboutPage />
      )}
      
      {isAuthenticated && currentPage === 'contact' && (
        <ContactPage />
      )}
    </div>
  )
}

export default function CallSensePage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
