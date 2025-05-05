"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiUpload, FiBook, FiSearch, FiBookOpen } from "react-icons/fi"
import api from "../services/api"
import FileCard from "../components/FileCard"
import CourseCard from "../components/CourseCard"
import SearchBar from "../components/SearchBar"
import { useAuth } from "../contexts/AuthContext"

const Home = () => {
  const { currentUser } = useAuth()
  const [recentFiles, setRecentFiles] = useState([])
  const [popularCourses, setPopularCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch recent files
        const filesResponse = await api.get("/files", {
          params: {
            limit: 4,
            page: 1,
          },
        })

        // Fetch popular courses
        const coursesResponse = await api.get("/courses", {
          params: {
            limit: 3,
            page: 1,
          },
        })

        setRecentFiles(filesResponse.data.data.files)
        setPopularCourses(coursesResponse.data.data.courses)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      window.location.href = `/files?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white rounded-lg p-8 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Share Knowledge, Learn Together</h1>
          <p className="text-xl mb-8">Upload, discover and share documents and courses on DocShare</p>

          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for documents, courses, and more..."
            className="mb-8 max-w-2xl mx-auto"
          />

          <div className="flex flex-wrap justify-center gap-4">
            {currentUser ? (
              <>
                <Link
                  to="/files/upload"
                  className="bg-white text-indigo-700 px-6 py-3 rounded-md hover:bg-indigo-100 transition flex items-center"
                >
                  <FiUpload className="mr-2" /> Upload Document
                </Link>
                <Link
                  to="/courses/create"
                  className="bg-indigo-800 text-white px-6 py-3 rounded-md hover:bg-indigo-900 transition flex items-center"
                >
                  <FiBook className="mr-2" /> Create Course
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-indigo-700 px-6 py-3 rounded-md hover:bg-indigo-100 transition flex items-center"
              >
                <FiBookOpen className="mr-2" /> Join DocShare
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Recent Files Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Documents</h2>
          <Link to="/files" className="text-indigo-600 hover:text-indigo-800 transition">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            {recentFiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentFiles.map((file) => (
                  <FileCard key={file._id} file={file} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No documents found</h3>
                <p className="mt-1 text-gray-500">Get started by uploading your first document.</p>
                {currentUser && (
                  <div className="mt-6">
                    <Link
                      to="/files/upload"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                      Upload Document
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* Popular Courses Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Courses</h2>
          <Link to="/courses" className="text-indigo-600 hover:text-indigo-800 transition">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            {popularCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
                <p className="mt-1 text-gray-500">Be the first to create a course on this platform.</p>
                {currentUser && (
                  <div className="mt-6">
                    <Link
                      to="/courses/create"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                      Create Course
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default Home
