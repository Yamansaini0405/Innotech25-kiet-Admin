"use client"

import { useState, useEffect } from "react"
import { ChevronDown, AlertCircle, Loader2, Star, Target, Users, TrendingUp } from "lucide-react"
import EvaluatedFilterPanel from "../components/evaluation/EvaluatedFilterPanel"
import EvaluatedTeamCard from "../components/evaluation/EvaluatedTeamCard"
import EvaluatedDetailsModal from "../components/evaluation/EvaluatedDetailsModal"

const TEAMS_PER_PAGE = 8

// Added the categoryOptions you provided
const categoryOptions = [
  { id: 1, name: "1. Smart Solutions, Smarter Society" },
  { id: 2, name: "2. AI solutions for automation" },
  { id: 3, name: "3. Automation and Robotics" },
  { id: 4, name: "4. From Concept to Reality" },
  { id: 5, name: "5. Start Small, Scale Big, Sustain Always" },
  { id: 6, name: "6. Gen Z to Budding Engineers" },
  { id: 7, name: "7. Creative Visions for a Sustainable Future" },
]

export default function EvaluatedTeamsPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL || ""

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false) // Changed initial loading to false
  const [error, setError] = useState(null)
  
  // Updated filters state
  const [filters, setFilters] = useState({
    participationCategory: "",
    category: "",
  })

  const [expandedCategories, setExpandedCategories] = useState({})
  const [markingQualified, setMarkingQualified] = useState({})
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Removed adminRole useEffect

  // Updated fetch logic based on new filters
  useEffect(() => {
    // 1. Don't fetch if no participation category is selected
    if (!filters.participationCategory) {
      setCategories([])
      setError(null)
      setLoading(false)
      return
    }

    // 2. If college, wait for innovation category
    if (filters.participationCategory === "college" && !filters.category) {
      setCategories([])
      setError(null)
      setLoading(false)
      return
    }

    // 3. Fetch if (participationCategory is not college) OR (participationCategory is college AND category is selected)
    fetchEvaluatedTeams()
  }, [filters])

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

      // New API endpoint and params
      const params = new URLSearchParams()
      params.append("participationCategory", filters.participationCategory)

      if (filters.participationCategory === "college" && filters.category) {
        params.append("categoryId", filters.category)
      }

      let url = `${baseUrl}/api/admin/finalresult?${params.toString()}`

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

        const flatTeams = data.data
        const groupedData = {}

        const categoryNameMap = new Map(categoryOptions.map(cat => [cat.id, cat.name]))

        flatTeams.forEach(team => {
          const categoryId = team.categoryId
          
          if (!groupedData[categoryId]) {
            groupedData[categoryId] = {
              categoryId: categoryId,
              category: categoryNameMap.get(categoryId) || `Unknown Category ${categoryId}`,
              teams: [] 
            }
          }
          
          groupedData[categoryId].teams.push(team)
        })

        const groupedArray = Object.values(groupedData)
        
        setCategories(groupedArray)
        const expanded = {}
        groupedArray.forEach((cat) => {
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


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 bg-slate-200 p-4 rounded-lg shadow-sm">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Evaluated Teams</h1>
              <p className="text-slate-600">Review final results by participation category</p>
            </div>
          </div>

        </div>

        <EvaluatedFilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          categoryOptions={categoryOptions} 
        />

        {!filters.participationCategory && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">Please select a participation category to view results</p>
          </div>
        )}
        
        {filters.participationCategory === "college" && !filters.category && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">Please select an innovation category to view college results</p>
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

        {!loading && categories.length > 0 && (
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

        {!loading && !error && categories.length === 0 && filters.participationCategory && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No evaluated teams found for the selected filters</p>
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