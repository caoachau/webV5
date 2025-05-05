"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { FiUpload, FiFilter, FiX } from "react-icons/fi"
import api from "../services/api"
import FileCard from "../components/FileCard"
import Pagination from "../components/Pagination"
import SearchBar from "../components/SearchBar"
import { useAuth } from "../contexts/AuthContext"

const FileList = () => {
  const { currentUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1,
  })

  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [fileType, setFileType] = useState(searchParams.get("fileType") || "")
  const [tags, setTags] = useState(searchParams.get("tags") || "")

  useEffect(() => {
    fetchFiles()
  }, [searchParams])

  const fetchFiles = async () => {
    try {
      setLoading(true)

      const response = await api.get("/files", {
        params: {
          page: searchParams.get("page") || 1,
          limit: 12,
          search: searchParams.get("search") || "",
          fileType: searchParams.get("fileType") || "",
          tags: searchParams.get("tags") || "",
        },
      })

      setFiles(response.data.data.files)
      setPagination(response.data.data.pagination)
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm) => {
    const params = { ...Object.fromEntries(searchParams) }

    if (searchTerm) {
      params.search = searchTerm
    } else {
      delete params.search
    }

    params.page = 1 // Reset to first page on new search
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    const params = { ...Object.fromEntries(searchParams) }
    params.page = newPage
    setSearchParams(params)
  }

  const applyFilters = () => {
    const params = { ...Object.fromEntries(searchParams) }

    if (fileType) {
      params.fileType = fileType
    } else {
      delete params.fileType
    }

    if (tags) {
      params.tags = tags
    } else {
      delete params.tags
    }

    params.page = 1 // Reset to first page on filter change
    setSearchParams(params)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFileType("")
    setTags("")

    const params = { ...Object.fromEntries(searchParams) }
    delete params.fileType
    delete params.tags
    params.page = 1

    setSearchParams(params)
    setShowFilters(false)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Documents</h1>

        <div className="flex flex-wrap gap-2">
          {currentUser && (
            <Link
              to="/files/upload"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center"
            >
              <FiUpload className="mr-2" /> Upload
            </Link>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition flex items-center"
          >
            <FiFilter className="mr-2" /> Filters
          </button>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search documents..."
          initialValue={searchParams.get("search") || ""}
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
              <FiX />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fileType" className="block text-gray-700 font-medium mb-1">
                File Type
              </label>
              <input
                type="text"
                id="fileType"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. pdf, doc, image"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-gray-700 font-medium mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. report, finance (comma separated)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={clearFilters} className="px-4 py-2 text-gray-700 hover:text-gray-900">
              Clear Filters
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(searchParams.get("search") || searchParams.get("fileType") || searchParams.get("tags")) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchParams.get("search") && (
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>Search: {searchParams.get("search")}</span>
              <button
                onClick={() => {
                  const params = { ...Object.fromEntries(searchParams) }
                  delete params.search
                  setSearchParams(params)
                }}
                className="ml-2 text-indigo-800 hover:text-indigo-950"
              >
                <FiX size={14} />
              </button>
            </div>
          )}

          {searchParams.get("fileType") && (
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>Type: {searchParams.get("fileType")}</span>
              <button
                onClick={() => {
                  const params = { ...Object.fromEntries(searchParams) }
                  delete params.fileType
                  setSearchParams(params)
                }}
                className="ml-2 text-indigo-800 hover:text-indigo-950"
              >
                <FiX size={14} />
              </button>
            </div>
          )}

          {searchParams.get("tags") && (
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>Tags: {searchParams.get("tags")}</span>
              <button
                onClick={() => {
                  const params = { ...Object.fromEntries(searchParams) }
                  delete params.tags
                  setSearchParams(params)
                }}
                className="ml-2 text-indigo-800 hover:text-indigo-950"
              >
                <FiX size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* File Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          {files.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}

export default FileList
