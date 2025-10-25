"use client"

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import UserRow from "./UserRow"

export default function UsersTable({ users, loading, pagination, onPageChange }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No users found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-slate-900 text-white">
              <th className="px-4 py-3 text-left text-sm font-semibold ">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold ">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold ">User ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold ">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold ">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold ">Branch</th>
              <th className="px-4 py-3 text-left text-sm font-semibold ">Year</th>
              <th className="px-4 py-3 text-left text-sm font-semibold ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
          <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
          <span className="font-semibold">{pagination.total}</span> users
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, pagination.page - 2) + i
              if (pageNum > pagination.totalPages) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 p-0 text-sm font-medium rounded-md ${
                    pageNum === pagination.page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
