"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"

const departmentOptions = [
  "CSE",
  "IT",
  "CSIT",
  "CS",
  "CSE_AI",
  "CSE_AIML",
  "ECE",
  "ELCE",
  "EEE",
  "ME",
  "CSE_Cyber_Security",
  "CSE_Data_Science",
  "ECE_VLSI",
  "AMIA",
  "MCA",
  "MBA",
  "B_PHARMA",
  "Other",
]

export default function TeamFilterPanel({ teamType, filters, onFilterChange, pagination, onLimitChange }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleDepartmentChange = (e) => {
    onFilterChange({ ...filters, department: e.target.value })
  }

  const handleCompletionChange = (e) => {
    onFilterChange({ ...filters, isCompleted: e.target.value })
  }

  const handleKeitianChange = (e) => {
    onFilterChange({ ...filters, isKeitian: e.target.value })
  }

  const handleLimitChange = (e) => {
    onLimitChange(Number.parseInt(e.target.value))
  }

  const handleClearFilters = () => {
    onFilterChange({ department: "", isCompleted: "", isKeitian: "" })
  }

  const isCollegeTeam = teamType === "college-inside" || teamType === "college-outside"

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Filters</h3>
        </div>
        <span className="text-slate-500">{isExpanded ? "−" : "+"}</span>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Department Filter - Only for College Teams */}
            {isCollegeTeam && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                <select
                  name="department"
                  value={filters.department}
                  onChange={handleDepartmentChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm "
                >
                  <option value="">All Departments</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept} >
                      {/* Replace underscores with spaces for readability */}
                      {dept.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Keitian Status Filter - Only for College Teams */}
            {isCollegeTeam && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Keitian Status</label>
                <select
                  value={filters.isKeitian}
                  onChange={handleKeitianChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All</option>
                  <option value="true">KIET Students</option>
                  <option value="false">Non-KIET Students</option>
                </select>
              </div>
            )}

            {/* Completion Status Filter - For All Teams */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Completion Status</label>
              <select
                value={filters.isCompleted}
                onChange={handleCompletionChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All</option>
                <option value="true">Completed</option>
                <option value="false">Pending</option>
              </select>
            </div>

            {/* Results Per Page */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Results Per Page</label>
              <select
                value={pagination.limit}
                onChange={handleLimitChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
