import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import { supabase } from './config/supabase'

// Components
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import AuthPage from './pages/AuthPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import Layout from './components/Layout'

function App() {
  const { user, loading, initialize } = useAuthStore()
  const initializedRef = React.useRef(false)

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializedRef.current) {
      return
    }
    initializedRef.current = true

    // Initialize auth
    initialize()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          useAuthStore.setState({ user: session.user, loading: false })
          useAuthStore.getState().fetchProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          useAuthStore.setState({ user: null, profile: null, loading: false })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [initialize])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/" replace /> : <AuthPage />} 
            />
            <Route 
              path="/" 
              element={
                user ? (
                  <Layout>
                    <FeedPage />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              } 
            />
            <Route 
              path="/profile/:userId?" 
              element={
                user ? (
                  <Layout>
                    <ProfilePage />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              } 
            />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App