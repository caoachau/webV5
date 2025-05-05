"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiBookOpen } from "react-icons/fi"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"

const Login = () => {
  const { currentUser, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect if user is already logged in
    if (currentUser) {
      navigate("/")
    }
  }, [currentUser, navigate])

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      toast.success("Redirecting to Google login...")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Failed to login. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="text-center mb-8">
          <FiBookOpen className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">DocShare</h2>
          <p className="mt-2 text-gray-600">Join the platform to share and discover documents and courses</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-3 px-4 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </button>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
