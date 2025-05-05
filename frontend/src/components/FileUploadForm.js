"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiUpload, FiX } from "react-icons/fi"
import api from "../services/api"
import toast from "react-hot-toast"

const FileUploadForm = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [visibility, setVisibility] = useState("public")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const clearSelectedFile = () => {
    setFile(null)
    setFileName("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", fileName)
    formData.append("description", description)
    formData.append("tags", tags)
    formData.append("visibility", visibility)

    setUploading(true)

    try {
      const response = await api.post("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percentCompleted)
        },
      })

      toast.success("File uploaded successfully!")
      navigate(`/files/${response.data.data.file._id}`)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error.response?.data?.message || "Failed to upload file")
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Document</h2>

      {/* File drop area */}
      <div className="mb-6">
        <label
          htmlFor="file"
          className={`
            block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
            ${file ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-500"}
          `}
        >
          {file ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-indigo-600 font-medium">{file.name}</span>
                <span className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button type="button" onClick={clearSelectedFile} className="text-gray-500 hover:text-red-500">
                <FiX size={20} />
              </button>
            </div>
          ) : (
            <div>
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600">Click to select or drag and drop a file here</p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP, RAR, JPG, PNG, MP4, etc.
              </p>
            </div>
          )}
        </label>
        <input id="file" type="file" className="hidden" onChange={handleFileChange} />
      </div>

      {/* File Details */}
      <div className="space-y-4">
        <div>
          <label htmlFor="fileName" className="block text-gray-700 font-medium mb-1">
            File Name
          </label>
          <input
            type="text"
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label htmlFor="tags" className="block text-gray-700 font-medium mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. report, finance, 2023"
          />
        </div>

        <div>
          <label htmlFor="visibility" className="block text-gray-700 font-medium mb-1">
            Visibility
          </label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="public">Public - Anyone can view</option>
            <option value="private">Private - Only you can view</option>
          </select>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-center mt-2 text-gray-600">{progress}% Uploaded</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>
    </form>
  )
}

export default FileUploadForm
