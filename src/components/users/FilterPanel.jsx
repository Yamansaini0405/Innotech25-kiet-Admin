"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"

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

export default function FilterPanel({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalFilters({ ...localFilters, [name]: value })
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      page: 1,
      limit: 20,
      department: "",
      participationCategory: "",
      type: "",
      userId: "",
      teamCode: "",
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Department Filter */}
        {localStorage.getItem("role") === "superadmin" && (
            <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Department</label>
          <select
            name="department"
            value={localFilters.department}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" >All Departments</option>
            {departmentOptions.map(dept => (
              <option key={dept} value={dept} >
                {/* Replace underscores with spaces for readability */}
                {dept.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      )}

        {/* Participation Category Filter */}
        {localStorage.getItem("role") === "superadmin" && (<div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Participation Category</label>
          <select
            name="participationCategory"
            value={localFilters.participationCategory}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="school">School</option>
            <option value="college">College</option>
            <option value="researcher">Researcher</option>
            <option value="startup">Startup</option>
          </select>
        </div>)}

        {/* Profile Type Filter */}
       {localStorage.getItem("role") === "superadmin" && ( <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Profile Type</label>
          <select
            name="type"
            value={localFilters.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="collegeStudent">College Student</option>
            <option value="schoolStudent">School Student</option>
            <option value="researcher">Researcher</option>
            <option value="startup">Startup</option>
          </select>
        </div>)}

        {/* User ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">User ID</label>
          <input
            type="text"
            name="userId"
            placeholder="e.g., KIET123"
            value={localFilters.userId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Team Code Filter */}
    

        {/* Limit Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Results Per Page</label>
          <select
            name="limit"
            value={localFilters.limit}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Apply Filters
        </button>
      </div>
    </div>
  )
}
