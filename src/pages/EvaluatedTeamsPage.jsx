"use client"

import { useState, useEffect } from "react"
import { ChevronDown, AlertCircle, Loader2, Star, Target, Users, TrendingUp } from "lucide-react"
import EvaluatedFilterPanel from "../components/evaluation/EvaluatedFilterPanel"
import EvaluatedTeamCard from "../components/evaluation/EvaluatedTeamCard"
import EvaluatedDetailsModal from "../components/evaluation/EvaluatedDetailsModal"

const TEAMS_PER_PAGE = 8

export default function EvaluatedTeamsPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL || ""

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adminRole, setAdminRole] = useState(null)
  const [filters, setFilters] = useState({
    department: "",
    topTeams: null,
  })
  const [expandedCategories, setExpandedCategories] = useState({})
  const [markingQualified, setMarkingQualified] = useState({})
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("role")
    setAdminRole(role)
  }, [])

  useEffect(() => {
    if (adminRole === "superadmin" && !filters.department) {
      setCategories([])
      setError(null)
      setLoading(false)
      return
    }

    if (adminRole) {
      fetchEvaluatedTeams()
    }
  }, [filters, adminRole])

  const fetchEvaluatedTeams = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication token not found. Please login first.")
        setLoading(false)
        return
      }

      let url = `${baseUrl}/api/admin/result?`
      const params = new URLSearchParams()

      console.log(filters.department)
      if (adminRole === "superadmin" && filters.department) {
        // params.append("department", filters.department)
        url += `department=${filters.department}&`
      }

      if (filters.topTeams) {
        // params.append("topTeams", filters.topTeams)
        url += `topTeams=${filters.topTeams}&`
      }

      console.log(params.toString());

      // if (params.toString()) {
      //   url += "?" + params.toString()
      // }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch evaluated teams: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setCategories(data.data)
        const expanded = {}
        data.data.forEach((cat) => {
          expanded[cat.categoryId] = true
        })
        setExpandedCategories(expanded)
      } else {
        setError("Failed to load evaluated teams")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const markAsQualified = async (teamId) => {
    try {
      setMarkingQualified((prev) => ({ ...prev, [teamId]: true }))

      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication token not found.")
        return
      }

      const response = await fetch(`${baseUrl}/api/admin/teams/mark-qualified/${teamId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to mark team as qualified: ${response.statusText}`)
      }

      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          teams: category.teams.map((team) => (team.id === teamId ? { ...team, isDepartmentQualified: true } : team)),
        })),
      )

      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam({ ...selectedTeam, isDepartmentQualified: true })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setMarkingQualified((prev) => ({ ...prev, [teamId]: false }))
    }
  }

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const openTeamDetails = (team) => {
    setSelectedTeam(team)
    setShowModal(true)
  }

  if (!adminRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-900">Loading...</p>
        </div>
      </div>
    )
  }

  const totalTeams = categories.reduce((sum, cat) => sum + (cat.teams?.length || 0), 0)
  const qualifiedTeams = categories.reduce(
    (sum, cat) => sum + (cat.teams?.filter((t) => t.isDepartmentQualified).length || 0),
    0,
  )
  const avgScore =
    categories.length > 0
      ? (
          categories.reduce(
            (sum, cat) => sum + (cat.teams?.reduce((s, t) => s + (Number.parseFloat(t.averageScore) || 0), 0) || 0),
            0,
          ) / (totalTeams || 1)
        ).toFixed(2)
      : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 bg-slate-200 p-4 rounded-lg shadow-sm">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Evaluated Teams</h1>
              <p className="text-slate-600">
                {adminRole === "superadmin"
                  ? "Review evaluated team results by department"
                  : "Review your department's evaluated teams"}
              </p>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-slate-600">Total Teams</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{totalTeams}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="text-sm text-slate-600">Qualified</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{qualifiedTeams}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-slate-600">Avg Score</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{avgScore}/50</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-slate-600">Categories</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{categories.length}</p>
            </div>
          </div> */}
        </div>

        {/* {adminRole === "superadmin" ? (
          <EvaluatedFilterPanel filters={filters} setFilters={setFilters} adminRole={adminRole} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-sm">
            <p className="text-sm text-slate-600">Filter your department's evaluated teams by top teams ranking</p>
          </div>
        )} */}
        <EvaluatedFilterPanel filters={filters} setFilters={setFilters} adminRole={adminRole} />
        

        {adminRole === "superadmin" && !filters.department && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">Please select a department to view evaluated teams</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-slate-600">Loading evaluated teams...</p>
            </div>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.categoryId}
                className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleCategory(category.categoryId)}
                  className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={`h-5 w-5 text-slate-600 transition-transform ${
                        expandedCategories[category.categoryId] ? "rotate-180" : ""
                      }`}
                    />
                    <div className="text-left">
                      <h2 className="font-semibold text-slate-900">{category.category}</h2>
                      <p className="text-sm text-slate-600">
                        {category.teams.length} team{category.teams.length !== 1 ? "s" : ""} •
                        <span className="ml-1">
                          {category.teams.filter((t) => t.isDepartmentQualified).length} qualified
                        </span>
                      </p>
                    </div>
                  </div>
                </button>

                {expandedCategories[category.categoryId] && category.teams.length > 0 && (
                  <div className="border-t border-slate-200 p-6 space-y-4">
                    {category.teams.map((team) => (
                      <EvaluatedTeamCard
                        key={team.id}
                        team={team}
                        onMarkQualified={() => markAsQualified(team.id)}
                        isMarking={markingQualified[team.id]}
                        onViewDetails={() => openTeamDetails(team)}
                      />
                    ))}
                  </div>
                )}

                {expandedCategories[category.categoryId] && category.teams.length === 0 && (
                  <div className="border-t border-slate-200 p-6 text-center">
                    <p className="text-slate-600">No teams in this category</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && categories.every((cat) => cat.teams.length === 0) && categories.length > 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No evaluated teams found</p>
          </div>
        )}
      </div>

      {showModal && selectedTeam && (
        <EvaluatedDetailsModal
          team={selectedTeam}
          onClose={() => setShowModal(false)}
          onMarkQualified={() => {
            markAsQualified(selectedTeam.id)
            setShowModal(false)
          }}
          isMarking={markingQualified[selectedTeam.id]}
        />
      )}
    </div>
  )
}
