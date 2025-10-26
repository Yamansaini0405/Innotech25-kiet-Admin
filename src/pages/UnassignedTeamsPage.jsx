"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Loader2, Filter } from "lucide-react"

export default function UnassignedTeamsPage() {
    const baseUrl = import.meta.env.VITE_BASE_URL || ""
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [filters, setFilters] = useState({
    department: "",
    category: "",
    participationCategory: "",
  })
  const [stats, setStats] = useState({
    totalTeams: 0,
    byDepartment: {},
    byCategory: {},
    byParticipationCategory: {},
  })

  // Fetch unassigned teams
  useEffect(() => {
    fetchUnassignedTeams()
  }, [])

  const fetchUnassignedTeams = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${baseUrl}/api/admin/unassignedteams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (data.success) {
        setTeams(data.data || [])
        calculateStats(data.data || [])
      } else {
        setMessage({ type: "error", text: "Failed to load unassigned teams" })
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
      setMessage({ type: "error", text: "Failed to load unassigned teams" })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (teamsData) => {
    const statsData = {
      totalTeams: teamsData.length,
      byDepartment: {},
      byCategory: {},
      byParticipationCategory: {},
    }

    teamsData.forEach((team) => {
      // By Department
      statsData.byDepartment[team.department] = (statsData.byDepartment[team.department] || 0) + 1

      // By Category
      if (team.category) {
        const categoryName = team.category.name
        statsData.byCategory[categoryName] = (statsData.byCategory[categoryName] || 0) + 1
      } else {
        statsData.byCategory["Uncategorized"] = (statsData.byCategory["Uncategorized"] || 0) + 1
      }

      // By Participation Category
      statsData.byParticipationCategory[team.participationCategory] =
        (statsData.byParticipationCategory[team.participationCategory] || 0) + 1
    })

    setStats(statsData)
  }

  const getFilteredTeams = () => {
    return teams.filter((team) => {
      if (filters.department && team.department !== filters.department) return false
      if (filters.category && team.category?.name !== filters.category) return false
      if (filters.participationCategory && team.participationCategory !== filters.participationCategory) return false
      return true
    })
  }

  const filteredTeams = getFilteredTeams()

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      department: "",
      category: "",
      participationCategory: "",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8 bg-slate-200 p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Unassigned Teams</h1>
          <p className="text-slate-600">View and manage teams without assigned judges</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Teams */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <p className="text-sm text-slate-600 mb-2">Total Unassigned Teams</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalTeams}</p>
          </div>

          {/* Departments Count */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <p className="text-sm text-slate-600 mb-2">Departments</p>
            <p className="text-3xl font-bold text-slate-900">{Object.keys(stats.byDepartment).length}</p>
          </div>

          {/* Categories Count */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <p className="text-sm text-slate-600 mb-2">Categories</p>
            <p className="text-3xl font-bold text-slate-900">{Object.keys(stats.byCategory).length}</p>
          </div>

          {/* Participation Types Count */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <p className="text-sm text-slate-600 mb-2">Participation Types</p>
            <p className="text-3xl font-bold text-slate-900">{Object.keys(stats.byParticipationCategory).length}</p>
          </div>
        </div>

        {/* Statistics Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* By Department */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Teams by Department</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(stats.byDepartment)
                .sort((a, b) => b[1] - a[1])
                .map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                    <span className="text-sm text-slate-700">{dept}</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* By Category */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Teams by Category</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(stats.byCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                    <span className="text-sm text-slate-700 truncate">{category}</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Department Filter */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-900 mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {Object.keys(stats.byDepartment)
                  .sort()
                  .map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-900 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {Object.keys(stats.byCategory)
                  .sort()
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Teams Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <p className="text-sm text-slate-600">
              Showing {filteredTeams.length} of {teams.length} teams
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Team Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Team Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Leader</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-600">
                      No teams found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{team.teamCode}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{team.teamName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{team.department}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{team.category?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{team.participationCategory}</td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-slate-900">{team.leaderUser.name}</p>
                          <p className="text-xs text-slate-500">{team.leaderUser.email}</p>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
