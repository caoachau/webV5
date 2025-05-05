import { Link } from "react-router-dom"
import { FiUser, FiCalendar, FiBookOpen } from "react-icons/fi"
import { format } from "date-fns"

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="h-40 bg-indigo-100 relative">
        {course.coverImage ? (
          <img
            src={course.coverImage || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiBookOpen size={48} className="text-indigo-500" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 text-xs rounded">
          {course.category}
        </div>
      </div>

      <div className="p-4 flex-grow">
        <h3 className="text-lg font-medium text-gray-900 truncate" title={course.title}>
          {course.title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2" title={course.description}>
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1">
          {course.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span>{course.instructor.displayName}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            <span>{format(new Date(course.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>

      <Link
        to={`/courses/${course._id}`}
        className="block w-full py-3 text-center bg-indigo-600 hover:bg-indigo-700 text-white transition"
      >
        View Course
      </Link>
    </div>
  )
}

export default CourseCard
