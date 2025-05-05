"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../supabase"
import api from "../services/api"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      })

      if (error) throw error
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  // Update authentication header for API requests
  const updateAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUserToken(token)
    } else {
      delete api.defaults.headers.common["Authorization"]
      setUserToken(null)
    }
  }

  // Effect to handle auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session) {
          // Get token
          const token = session.access_token
          updateAuthHeader(token)

          // Send token to backend and get user data
          try {
            const response = await api.post("/auth/login")
            setCurrentUser({
              ...session.user,
              ...response.data.data.user,
            })
          } catch (apiError) {
            console.error("Error getting user data from backend:", apiError)
            setCurrentUser(session.user)
          }
        } else {
          setCurrentUser(null)
          updateAuthHeader(null)
        }
      } catch (error) {
        console.error("Auth state change error:", error)
      } finally {
        setLoading(false)
      }
    })

    // Initial session check
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        updateAuthHeader(session.access_token)

        try {
          const response = await api.post("/auth/login")
          setCurrentUser({
            ...session.user,
            ...response.data.data.user,
          })
        } catch (apiError) {
          console.error("Error getting user data from backend:", apiError)
          setCurrentUser(session.user)
        }
      }

      setLoading(false)
    }

    checkSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    currentUser,
    userToken,
    loading,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
