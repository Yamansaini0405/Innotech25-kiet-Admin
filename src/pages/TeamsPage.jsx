"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import TeamFilterPanel from "../components/teams/TeamFilterPanel"
import TeamsTable from "../components/teams/TeamsTable"


const TEAM_TYPES = [
  { id: "college-inside", label: "College Teams (Inside)", endpoint: "/teams/college/inside" },
  { id: "college-outside", label: "College Teams (Outside)", endpoint: "/teams/college/outside" },
  { id: "school", label: "School Teams", endpoint: "/teams/school" },
  { id: "researcher", label: "Researcher Teams", endpoint: "/teams/researcher" },
  { id: "startup", label: "Startup Teams", endpoint: "/teams/startup" },
]

export default function TeamsPage() {
    const baseUrl = import.meta.env.VITE_BASE_URL
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTeamType, setSelectedTeamType] = useState("college-inside")
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({
    department: "",
    isCompleted: "",
    isKeitian: "",
  })

  const currentTeamType = TEAM_TYPES.find((t) => t.id === selectedTeamType)

  useEffect(() => {
    fetchTeams()
  }, [selectedTeamType, pagination.page, pagination.limit, filters])

  const fetchTeams = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      })

      // Add department filter only for college teams
      if ((selectedTeamType === "college-inside" || selectedTeamType === "college-outside") && filters.department) {
        params.append("department", filters.department)
      }
      const url = `${baseUrl}/api/admin${currentTeamType.endpoint}?${params.toString()}`
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch teams")
      const data = await response.json()

      setTeams(data.data || [])
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }))
    } catch (err) {
      setError(err.message)
      console.error("[v0] Error fetching teams:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleTeamTypeChange = (teamTypeId) => {
    setSelectedTeamType(teamTypeId)
    setPagination({ page: 1, limit: 20, total: 0, totalPages: 0 })
    setFilters({ department: "", isCompleted: "", isKeitian: "" })
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8 bg-slate-200 p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Team Management</h1>
          <p className="text-slate-600">Manage and view all teams across different categories</p>
        </div>

        {/* Team Type Selector */}
       {localStorage.getItem("role")==="superadmin" && ( <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Select Team Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {TEAM_TYPES.map((teamType) => (
              <button
                key={teamType.id}
                onClick={() => handleTeamTypeChange(teamType.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTeamType === teamType.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {teamType.label}
              </button>
            ))}
          </div>
        </div>)}

        {/* Filter Panel */}
        <TeamFilterPanel
          teamType={selectedTeamType}
          filters={filters}
          onFilterChange={handleFilterChange}
          pagination={pagination}
          onLimitChange={handleLimitChange}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-slate-600 font-medium">Loading teams...</span>
          </div>
        )}

        {/* Teams Table */}
        {!loading && teams.length > 0 && <TeamsTable teams={teams} teamType={selectedTeamType} />}

        {/* Empty State */}
        {!loading && teams.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No teams found</p>
            <p className="text-slate-500 text-sm">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination Info */}
        {!loading && teams.length > 0 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
              <span className="font-semibold">{pagination.total}</span> teams
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded ${
                        pagination.page === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
