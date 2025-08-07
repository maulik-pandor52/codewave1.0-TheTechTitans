'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { Sun, Moon, LogOut, User, Shield } from 'lucide-react'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-400">
            CallSenseAI
          </h1>
          
          <div className="flex items-center gap-4">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              size="sm"
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'about' ? 'default' : 'ghost'}
              onClick={() => onNavigate('about')}
              size="sm"
            >
              About Us
            </Button>
            <Button
              variant={currentPage === 'contact' ? 'default' : 'ghost'}
              onClick={() => onNavigate('contact')}
              size="sm"
            >
              Contact Us
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          {user && (
            <>
              <div className="flex items-center gap-2 text-sm">
                {user.role === 'admin' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                <span className="dark:text-white">{user.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({user.role})</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
