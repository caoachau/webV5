"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FiMenu, FiX, FiLogOut, FiUpload, FiBookOpen } from "react-icons/fi"

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center">
            <FiBookOpen className="mr-2" /> DocShare
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-indigo-200 transition">
              Home
            </Link>
            <Link to="/files" className="hover:text-indigo-200 transition">
              Documents
            </Link>
            <Link to="/courses" className="hover:text-indigo-200 transition">
              Courses
            </Link>
            {currentUser && (
              <Link to="/files/upload" className="hover:text-indigo-200 transition">
                Upload
              </Link>
            )}
          </div>

          {/* Auth Buttons / Profile */}
          <div className="hidden md:block">
            {currentUser ? (
              <div className="relative">
                <button onClick={toggleProfile} className="flex items-center space-x-2 focus:outline-none">
                  <img
                    src={currentUser.photoURL || "https://via.placeholder.com/40"}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{currentUser.displayName}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <Link
                      to="/files/upload"
                      className="block px-4 py-2 text-gray-800 hover:bg-indigo-100 flex items-center"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUpload className="mr-2" /> Upload Document
                    </Link>
                    <Link
                      to="/courses/create"
                      className="block px-4 py-2 text-gray-800 hover:bg-indigo-100 flex items-center"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiBookOpen className="mr-2" /> Create Course
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-indigo-500">
            <Link to="/" className="block py-2 hover:bg-indigo-700 px-2 rounded" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/files" className="block py-2 hover:bg-indigo-700 px-2 rounded" onClick={toggleMenu}>
              Documents
            </Link>
            <Link to="/courses" className="block py-2 hover:bg-indigo-700 px-2 rounded" onClick={toggleMenu}>
              Courses
            </Link>
            {currentUser && (
              <>
                <Link to="/files/upload" className="block py-2 hover:bg-indigo-700 px-2 rounded" onClick={toggleMenu}>
                  Upload Document
                </Link>
                <Link to="/courses/create" className="block py-2 hover:bg-indigo-700 px-2 rounded" onClick={toggleMenu}>
                  Create Course
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                  className="w-full text-left block py-2 hover:bg-indigo-700 px-2 rounded"
                >
                  Logout
                </button>
              </>
            )}
            {!currentUser && (
              <Link
                to="/login"
                className="block py-2 bg-white text-indigo-600 rounded mt-2 text-center"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
