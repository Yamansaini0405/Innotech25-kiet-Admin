"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle2, Loader2, Plus, X, Download } from "lucide-react"

const convertTeamsToCSV = (data, categoryOptions) => {
  if (data.length === 0) return ""

  const headers = [
    "Team ID",
    "Team Code",
    "Team Name",
    "Department",
    "Category",
    "Problem Statement ID",
    "Leader Name",
    "Leader Email",
  ]

  const escapeCell = (cell) => {
    let strCell = cell === null || cell === undefined ? "" : String(cell)
    if (strCell.includes(",") || strCell.includes('"') || strCell.includes("\n")) {
      strCell = `"${strCell.replace(/"/g, '""')}"`
    }
    return strCell
  }

  const headerRow = headers.map(escapeCell).join(",")

  const rows = data.map((team) => {
    const categoryName = categoryOptions.find((c) => c.id == team.categoryId)?.name || team.categoryId

    const rowData = [
      team.id,
      team.teamCode,
      team.teamName,
      team.department,
      categoryName,
      team.problemStatementId,
      team.leaderUser?.name,
      team.leaderUser?.email,
    ]
    return rowData.map(escapeCell).join(",")
  })

  return [headerRow, ...rows].join("\n")
}

export default function AssignJudgePage() {
  const baseUrl = import.meta.env.VITE_BASE_URL || ""

  const participationCategoryOptions = [
    { value: "college", label: "College" },
    { value: "school", label: "School" },
    { value: "researcher", label: "Researcher" },
    { value: "startup", label: "Startup" },
  ]

  const categoryOptions = [
    { id: 1, name: "Smart Solutions, Smarter Society" },
    { id: 2, name: "AI solutions for automation" },
    { id: 3, name: "Automation and Robotics" },
    { id: 4, name: "From Concept to Reality" },
    { id: 5, name: "Start Small, Scale Big, Sustain Always" },
    { id: 7, name: "Creative Visions for a Sustainable Future" },
  ]

  const [selectedParticipationCategory, setSelectedParticipationCategory] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("unassign")
  const [teams, setTeams] = useState([])
  const [judges, setJudges] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [message, setMessage] = useState(null)
  const [showJudgeSelection, setShowJudgeSelection] = useState(false)
  const [selectedJudges, setSelectedJudges] = useState([])
  const [judgeSearch, setJudgeSearch] = useState("")
  const [showJudgeDropdown, setShowJudgeDropdown] = useState(false)
  const [selectedTeams, setSelectedTeams] = useState([])
  const [panelName, setPanelName] = useState("")

  useEffect(() => {
    fetchJudges()
  }, [])

  useEffect(() => {
    setSelectedCategory("")
    setTeams([]) // Clear teams
    setMessage(null) // Clear messages
  }, [selectedParticipationCategory])

  useEffect(() => {
    // Always need participation category and status
    if (!selectedParticipationCategory || !selectedStatus) {
      setTeams([])
      setMessage(null)
      return
    }

    // Case 1: College is selected
    if (selectedParticipationCategory === "college") {
      if (selectedCategory) {
        fetchTeams()
      } else {
        // College is selected, but category is not yet
        setTeams([])
        setMessage(null)
      }
    } else {
      // Case 2: Non-college is selected
      // Status is already checked, so we can fetch
      fetchTeams()
    }
  }, [selectedParticipationCategory, selectedCategory, selectedStatus]) // Dependencies are correct

  const fetchJudges = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${baseUrl}/api/admin/judges`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setJudges(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching judges:", error)
    }
  }

  const fetchTeams = async () => {
    // Guard clauses based on the new logic
    if (!selectedParticipationCategory || !selectedStatus) {
      setMessage({ type: "error", text: "Please select participation category and status" })
      return
    }
    if (selectedParticipationCategory === "college" && !selectedCategory) {
      setMessage({ type: "error", text: "Please select an innovation category" })
      return
    }

    try {
      setLoading(true)
      setMessage(null)
      setTeams([])
      const token = localStorage.getItem("token")

      // Build the URL dynamically
      let apiUrl = `${baseUrl}/api/admin/getbydepartmentandcategory?participationCategory=${selectedParticipationCategory}&status=${selectedStatus}`

      if (selectedParticipationCategory === "college") {
        apiUrl += `&categoryId=${selectedCategory}`
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (data.success) {
        setTeams(data.data || [])
        if (data.data.length === 0) {
          setMessage({ type: "info", text: "No teams found for selected filters" })
        }
      } else {
        setMessage({ type: "error", text: "Failed to load teams" })
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
      setMessage({ type: "error", text: "Failed to load teams" })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectJudge = (judge) => {
    if (selectedJudges.find((j) => j.id === judge.id)) {
      setSelectedJudges(selectedJudges.filter((j) => j.id !== judge.id))
    } else if (selectedJudges.length < 3) {
      setSelectedJudges([...selectedJudges, judge])
      setJudgeSearch("")
      setShowJudgeDropdown(false)
    }
  }

  const handleToggleTeam = (teamId) => {
    setSelectedTeams((prev) => (prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]))
  }

  const handleAssignJudges = async () => {
    console.log("api called")
    if (selectedJudges.length < 2 || selectedJudges.length > 3) {
      setMessage({ type: "error", text: "Please select 2 or 3 judges" })
      return
    }

    if (selectedTeams.length === 0) {
      setMessage({ type: "error", text: "Please select at least one team" })
      return
    }

    if (!panelName.trim()) {
      setMessage({ type: "error", text: "Please enter a panel name" })
      return
    }

    try {
      setSubmitting(true)
      setMessage(null)

      const token = localStorage.getItem("token")
      const apiUrl = new URL(`${baseUrl}/api/admin/assigjudgebydepartmentandcategory`)

      const body = {
        judgeId1: selectedJudges[0].id,
        judgeId2: selectedJudges[1].id,
        ...(selectedJudges[2] && { judgeId3: selectedJudges[2].id }),
        teamIds: selectedTeams,
        panelName: panelName,
      }

      const response = await fetch(apiUrl.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: data.message || "Judges assigned successfully" })
        setSelectedJudges([])
        setSelectedTeams([])
        setPanelName("")
        setShowJudgeSelection(false)
        fetchTeams()
      } else {
        setMessage({ type: "error", text: data.message || "Failed to assign judges" })
      }
    } catch (error) {
      console.error("Error assigning judges:", error)
      setMessage({ type: "error", text: "Failed to assign judges" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const csvData = convertTeamsToCSV(teams, categoryOptions)
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "teams.csv"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setMessage({ type: "success", text: "Teams exported successfully" })
    } catch (error) {
      console.error("Error exporting teams:", error)
      setMessage({ type: "error", text: "Failed to export teams" })
    } finally {
      setIsExporting(false)
    }
  }

  const availableJudges = judges.filter((judge) => !selectedJudges.find((j) => j.id === judge.id))

  const filteredJudges = availableJudges.filter(
    (judge) =>
      judge.name.toLowerCase().includes(judgeSearch.toLowerCase()) ||
      judge.email.toLowerCase().includes(judgeSearch.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-slate-200 p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Assign Judges</h1>
          <p className="text-slate-600">Assign judges to teams by participation category and innovation category</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : message.type === "info"
                  ? "bg-blue-50 border-blue-200 text-blue-800"
                  : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Select Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="participationCategory" className="block text-sm font-medium text-slate-900 mb-2">
                Participation Category
              </label>
              <select
                id="participationCategory"
                value={selectedParticipationCategory}
                onChange={(e) => setSelectedParticipationCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Participation Category</option>
                {participationCategoryOptions.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

           {selectedParticipationCategory === "college" && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-900 mb-2">
                  Innovation Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-900 mb-2">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="unassign">Unassigned</option>
                <option value="assign">Assigned</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-slate-600 font-medium">Loading teams...</span>
          </div>
        )}

        {/* Teams Section */}
        {!loading && teams.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Teams ({teams.length}) - Selected: {selectedTeams.length}
              </h2>
              {selectedStatus === "unassign" ? (
                <button
                  onClick={() => setShowJudgeSelection(!showJudgeSelection)}
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Assign Judges
                </button>
              ) : (
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isExporting ? "Exporting..." : "Export as CSV"}
                </button>
              )}
            </div>

            {/* Judge Selection Interface */}
            {showJudgeSelection && selectedStatus === "unassign" && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Select Judges and Panel Details</h3>

                {/* Panel Name Input */}
                <div className="mb-6">
                  <label htmlFor="panelName" className="block text-sm font-medium text-slate-900 mb-2">
                    Panel Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="panelName"
                    type="text"
                    placeholder="Enter panel name (e.g., Panel A, Evaluation Committee)"
                    value={panelName}
                    onChange={(e) => setPanelName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Selected Judges */}
                {selectedJudges.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Selected Judges ({selectedJudges.length}/3):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedJudges.map((judge) => (
                        <div
                          key={judge.id}
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{judge.name}</span>
                          <button
                            onClick={() => handleSelectJudge(judge)}
                            className="hover:text-blue-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Available Judges ({availableJudges.length}) - Select 2 to 3:
                  </p>

                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Search judges by name or email..."
                      value={judgeSearch}
                      onChange={(e) => setJudgeSearch(e.target.value)}
                      onFocus={() => setShowJudgeDropdown(true)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {showJudgeDropdown && (
                    <div className="relative mb-3">
                      <div className="absolute top-0 left-0 right-0 bg-white border border-slate-300 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                        {filteredJudges.length === 0 ? (
                          <div className="p-3 text-sm text-slate-600 text-center">
                            {availableJudges.length === 0 ? "All judges selected" : "No judges found"}
                          </div>
                        ) : (
                          filteredJudges.map((judge) => (
                            <button
                              key={judge.id}
                              onClick={() => handleSelectJudge(judge)}
                              className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-slate-100 last:border-b-0 transition-colors"
                            >
                              <p className="font-medium text-slate-900">{judge.name}</p>
                              <p className="text-sm text-slate-600">{judge.email}</p>
                              {judge.phonenumber && <p className="text-xs text-slate-500">{judge.phonenumber}</p>}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {showJudgeDropdown && (
                    <button
                      onClick={() => setShowJudgeDropdown(false)}
                      className="text-sm text-slate-600 hover:text-slate-900 mb-3"
                    >
                      Close dropdown
                    </button>
                  )}
                </div>

                {/* Assign Button */}
                {selectedJudges.length >= 2 && selectedTeams.length > 0 && panelName.trim() && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleAssignJudges}
                      disabled={submitting}
                      className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        "Confirm Assignment"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowJudgeSelection(false)
                        setSelectedTeams([])
                        setPanelName("")
                      }}
                      className="px-4 py-2 bg-slate-300 text-slate-900 font-medium rounded-md hover:bg-slate-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Teams Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold w-12">
                      {selectedStatus === "unassign" && showJudgeSelection ? (
                        <input
                          type="checkbox"
                          checked={selectedTeams.length === teams.length && teams.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTeams(teams.map((t) => t.id))
                            } else {
                              setSelectedTeams([])
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                      ) : null}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">SNo.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Team Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Team Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Leader</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {teams.map((team, index) => {
                    const categoryName = categoryOptions.find((c) => c.id == team.categoryId)?.name || team.categoryId
                    return (
                      <tr key={team.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm">
                          {selectedStatus === "unassign" && showJudgeSelection ? (
                            <input
                              type="checkbox"
                              checked={selectedTeams.includes(team.id)}
                              onChange={() => handleToggleTeam(team.id)}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300"
                            />
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{team.teamCode}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{team.teamName}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{team.department}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{categoryName}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{team.leaderUser?.name || "N/A"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
