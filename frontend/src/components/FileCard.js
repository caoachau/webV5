import { FiDownload, FiEye, FiFile, FiFileText, FiImage, FiVideo, FiMusic, FiArchive } from "react-icons/fi"
import { format } from "date-fns"

const FileCard = ({ file }) => {
  // Function to determine file icon based on file type
  const getFileIcon = () => {
    const fileType = file.fileType.toLowerCase()

    if (fileType.includes("pdf")) {
      return <FiFileText size={24} className="text-red-500" />
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FiFileText size={24} className="text-blue-500" />
    } else if (fileType.includes("excel") || fileType.includes("sheet") || fileType.includes("csv")) {
      return <FiFileText size={24} className="text-green-500" />
    } else if (fileType.includes("powerpoint") || fileType.includes("presentation")) {
      return <FiFileText size={24} className="text-orange-500" />
    } else if (fileType.includes("image")) {
      return <FiImage size={24} className="text-purple-500" />
    } else if (fileType.includes("video")) {
      return <FiVideo size={24} className="text-red-600" />
    } else if (fileType.includes("audio")) {
      return <FiMusic size={24} className="text-blue-600" />
    } else if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("archive")) {
      return <FiArchive size={24} className="text-yellow-600" />
    } else {
      return <FiFile size={24} className="text-gray-500" />
    }
  }

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="p-4 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            {getFileIcon()}
            <h3 className="ml-2 text-lg font-medium text-gray-900 truncate" title={file.name}>
              {file.name}
            </h3>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2" title={file.description}>
          {file.description || "No description available"}
        </p>

        <div className="mt-4 flex flex-wrap gap-1">
          {file.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <div>
            <p>Size: {formatFileSize(file.fileSize)}</p>
            <p>Uploaded: {format(new Date(file.createdAt), "MMM d, yyyy")}</p>
          </div>
          <div className="flex space-x-2">
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-gray-200"
              title="View"
            >
              <FiEye />
            </a>
            <a
              href={file.fileUrl}
              download
              className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-gray-200"
              title="Download"
            >
              <FiDownload />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileCard
