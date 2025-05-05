"use client"

import React from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show first page
    pageNumbers.push(1)

    // Calculate start and end of page range around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push("...")
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("...")
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-md ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-indigo-100"
        }`}
      >
        <FiChevronLeft />
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="w-10 h-10 flex items-center justify-center">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-md ${
                currentPage === page ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-indigo-100"
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-md ${
          currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-indigo-100"
        }`}
      >
        <FiChevronRight />
      </button>
    </div>
  )
}

export default Pagination
