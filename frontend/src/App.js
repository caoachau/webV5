"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Pages
import Login from "./pages/Login"
import Home from "./pages/Home"
import FileList from "./pages/FileList"
import FileUpload from "./pages/FileUpload"
// import FileDetails from "./pages/FileDetails"
// import CourseList from "./pages/CourseList"
// import CourseDetails from "./pages/CourseDetails"
// import CourseCreate from "./pages/CourseCreate"
import NotFound from "./pages/NotFound"

// Components
import Layout from "./components/Layout"
import { Toaster } from "react-hot-toast"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="files">
              <Route index element={<FileList />} />
              <Route path=":id" element={<FileDetails />} />
              <Route
                path="upload"
                element={
                  <ProtectedRoute>
                    <FileUpload />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="courses">
              <Route index element={<CourseList />} />
              <Route path=":id" element={<CourseDetails />} />
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <CourseCreate />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
