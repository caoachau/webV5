import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-9xl font-bold text-indigo-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition">
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
