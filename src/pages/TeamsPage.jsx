"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, Download } from "lucide-react"
import TeamFilterPanel from "../components/teams/TeamFilterPanel"
import TeamsTable from "../components/teams/TeamsTable"
import { AlertCircle, CheckCircle } from "lucide-react";



const TEAM_TYPES = [
  { id: "college-inside", label: "College Teams (Inside)", endpoint: "/teams/college/inside" },
  { id: "college-outside", label: "College Teams (Outside)", endpoint: "/teams/college/outside" },
  { id: "school", label: "School Teams", endpoint: "/teams/school" },
  { id: "researcher", label: "Researcher Teams", endpoint: "/teams/researcher" },
  { id: "startup", label: "Startup Teams", endpoint: "/teams/startup" },
]


const QulificationType = [
  { id: "all", label: "All" },
  { id: "qualified", label: "Qualified" },
  { id: "not-qualified", label: "Not Qualified" },
]

const convertToCSV = (data) => {
  if (data.length === 0) return ""

  // 1. Define the specific headers we want in the CSV
  const headers = [
    "Team ID",
    "Team Name",
    "Team Code",
    "CategoryId",
    "Is Keitian",
    "Team Size",
    "Department",
    "Completed",
    "Leader Name",
    "Leader Email",
    "Leader Phonenumber",
    "Leader User ID",
    "Member1 Name",
    "Member1 Email",
    "Member1 Phonenumber",
    "Member2 Name",
    "Member2 Email",
    "Member2 Phonenumber",
    "Member3 Name",
    "Member3 Email",
    "Member3 Phonenumber",
    "Member4 Name",
    "Member4 Email",
    "Member4 Phonenumber",
    "Category",
    "Problem Statement",
  ]

  // Helper function to safely escape cells
  const escapeCell = (cell) => {
    let strCell = cell === null || cell === undefined ? "" : String(cell)
    // Handle arrays (like assignedJudgeIds)
    if (Array.isArray(cell)) {
      strCell = cell.join(";") // Use semicolon as a separator for lists within a cell
    }

    if (strCell.includes(",") || strCell.includes('"') || strCell.includes("\n")) {
      // Escape quotes by doubling them and wrap the whole cell in quotes
      strCell = `"${strCell.replace(/"/g, '""')}"`
    }
    return strCell
  }

  // 2. Create the header row
  const headerRow = headers.map(escapeCell).join(",")

  // 3. Map each team object to a flattened row of data
  const rows = data.map((team) => {
    // This array must match the order of the 'headers' array above
    const rowData = [
      team.id,
      team.teamName,
      team.teamCode,
      team.categoryId,
      team.isKeitian,
      team.teamSize,
      team.department,
      team.isCompleted,
      team.leaderUser?.name, // Use optional chaining (?.) in case leaderUser is null
      team.leaderUser?.email,
      team.leaderUser?.phonenumber,
      team.leaderUser?.userId,
      team.member1?.name,
      team.member1?.email,
      team.member1?.phonenumber,
      team.member2?.name,
      team.member2?.email,
      team.member2?.phonenumber,
      team.member3?.name,
      team.member3?.email,
      team.member3?.phonenumber,
      team.member4?.name,
      team.member4?.email,
      team.member4?.phonenumber,
      team.category?.name,
      team.problemStatement?.title,
    ]

    return rowData.map(escapeCell).join(",")
  })

  // 4. Join all rows
  return [headerRow, ...rows].join("\n")
}

export default function TeamsPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTeamType, setSelectedTeamType] = useState("college-inside")
  const [teamQualificationType, setTeamQualificationType] = useState("all")
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({
    department: "",
    isCompleted: "",
    isKeitian: "",
    categoryId: "",
  })
  const [teamCode, setTeamCode] = useState("");
  const [teamCodeError, setTeamCodeError] = useState(false);

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

      if (teamQualificationType) {
        params.append("qulifiedStatus", teamQualificationType)
      }

      if (teamCode) {
        params.append("teamCode", teamCode)
      }

      // Add department filter only for college teams
      if ((selectedTeamType === "college-inside" || selectedTeamType === "college-outside") && filters.department) {
        params.append("department", filters.department)
      }
      if (filters.isCompleted === "true") {
        params.append("status", "completed")
      } else if (filters.isCompleted === "false") {
        params.append("status", "pending")
      } else {
        params.append("status", "all") // Default
      }
      if (filters.isKeitian) {
        params.append("isKeitian", filters.isKeitian)
      }
      // NEW: Add the categoryId filter
      if (filters.categoryId) {
        params.append("categoryId", filters.categoryId)
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

  const handleExport = async () => {
    setIsExporting(true)
    setError(null)
    try {
      // Build params with filters, but without pagination
      const params = new URLSearchParams()

     if ((selectedTeamType === "college-inside" || selectedTeamType === "college-outside") && filters.department) {
        params.append("department", filters.department)
      }

      if (teamQualificationType) {
        params.append("qulifiedStatus", teamQualificationType)
      }

      if (teamCode) {
        params.append("teamCode", teamCode)
      }

      if (filters.isCompleted === "true") {
        params.append("status", "completed")
      } else if (filters.isCompleted === "false") {
        params.append("status", "pending")
      } else {
        params.append("status", "all") // Default
      }
      if (filters.isKeitian) {
        params.append("isKeitian", filters.isKeitian)
      }
      if (filters.categoryId) {
        params.append("categoryId", filters.categoryId)
      }

      params.append("page", 1)
      // If total is 0, send 1 (API will return 0 rows). Otherwise, send the total.
      params.append("limit", pagination.total > 0 ? pagination.total : 1)

      // We omit page/limit to get ALL filtered results
      const url = `${baseUrl}/api/admin${currentTeamType.endpoint}?${params.toString()}`

      console.log("Export URL:", url) // Debug log
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch data for export")
      const data = await response.json()

      // Assuming the API returns all data in the same { data: [...] } structure
      const teamsToExport = data.data || []

      // --- START: NEW SORTING LOGIC ---
      // Sort the data based on your requirement: Category ID, then Team Code
      teamsToExport.sort((a, b) => {
        // Get category IDs, default to a large number (Infinity) if category is missing
        // This ensures teams without categories are sorted last.
        const categoryIdA = a.category?.id ?? Infinity
        const categoryIdB = b.category?.id ?? Infinity

        // 1. Compare category IDs first
        if (categoryIdA < categoryIdB) return -1
        if (categoryIdA > categoryIdB) return 1

        // 2. If category IDs are the same, sort by teamCode
        const teamCodeA = a.teamCode || "" // Default to empty string if missing
        const teamCodeB = b.teamCode || ""
        
        return teamCodeA.localeCompare(teamCodeB) // Use localeCompare for safe string comparison
      })
      // --- END: NEW SORTING LOGIC ---

      if (teamsToExport.length === 0) {
        setError("No data to export for the current filters.")
        setIsExporting(false)
        return
      }

      // Convert data to CSV (now using the sorted array)
      const csvData = convertToCSV(teamsToExport)

      // Create blob and trigger download
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const csvUrl = URL.createObjectURL(blob)

      link.href = csvUrl
      // Create a dynamic filename
      link.setAttribute("download", `${selectedTeamType}-teams-${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(csvUrl)
    } catch (err) {
      setError(err.message)
      console.error("[v0] Error exporting teams:", err)
    } finally {
      setIsExporting(false)
    }
  }

  const handleTeamTypeChange = (teamTypeId) => {
    setSelectedTeamType(teamTypeId)
    setPagination({ page: 1, limit: 20, total: 0, totalPages: 0 })
    setFilters({ department: "", isCompleted: "", isKeitian: "", categoryId: "" })
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

  const handleChageQualificationType = (qualType) => {
    setTeamQualificationType(qualType)
    setPagination({ page: 1, limit: 20, total: 0, totalPages: 0 })
    setFilters({ department: "", isCompleted: "", isKeitian: "", categoryId: "" })
  }

  const handleChangeTeamCode = () => {
    if (
      teamCode.length === 6 &&
      ["CL", "SH", "SU", "Rh"].some(prefix => teamCode.split("-")[0].includes(prefix))
    ) {
      setPagination({ page: 1, limit: 20, total: 0, totalPages: 0 })
      setFilters({ department: "", isCompleted: "", isKeitian: "", categoryId: "" })
    } else {
      setTeamCodeError(true);
    }

    console.log(teamCode)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8 bg-slate-200 p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Team Management</h1>
          <p className="text-slate-600">Manage and view all teams across different categories</p>
        </div>

        {/* Team Type Selector */}
        {localStorage.getItem("role") === "superadmin" && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Select By Qualification Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {QulificationType.map((Q) => (
                <button
                  key={Q.id}
                  onClick={() => handleChageQualificationType(Q.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${teamQualificationType === Q.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  {Q.label}
                </button>
              ))}

              {/* Team code search input */}
              <div className="relative flex items-center col-span-2">
                <Search className="absolute left-3 text-slate-400 w-5 h-5" />

                <input
                  type="text"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  onBlur={handleChangeTeamCode}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-all duration-200 ${teamCodeError
                      ? "border-red-500 bg-red-50 focus:ring-red-400"
                      : "border-slate-300 bg-white focus:ring-blue-500"
                    } focus:outline-none focus:ring-2 shadow-sm`}
                  placeholder="Search by team code (e.g., CL-1075)"
                />

                {/* Right-side icon */}
                {teamCode && !teamCodeError && (
                  <CheckCircle className="absolute right-3 w-5 h-5 text-green-500" />
                )}
                {teamCodeError && (
                  <AlertCircle className="absolute right-3 w-5 h-5 text-red-500" />
                )}
              </div>

              {/* {teamCodeError && (
                <p className="text-red-500 text-sm mt-1">Invalid team code format</p>
              )} */}
            </div>
          </div>
        )}

        {/* Team Type Selector */}
        {localStorage.getItem("role") === "superadmin" && (<div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Select Team Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {TEAM_TYPES.map((teamType) => (
              <button
                key={teamType.id}
                onClick={() => handleTeamTypeChange(teamType.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedTeamType === teamType.id
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
        <div>
          <TeamFilterPanel
            teamType={selectedTeamType}
            filters={filters}
            onFilterChange={handleFilterChange}
            pagination={pagination}
            onLimitChange={handleLimitChange}
          />
          <div className="my-2 flex justify-end">
            <button
              onClick={handleExport}
              disabled={isExporting || loading} // Disable if loading teams or exporting
              className="flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? "Exporting..." : "Export as CSV"}
            </button>
          </div>
        </div>

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
                      className={`px-3 py-1 rounded ${pagination.page === pageNum
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
