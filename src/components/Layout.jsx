import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import useAuthStore from '../store/authStore'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuthStore()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      navigate('/auth')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default Layout