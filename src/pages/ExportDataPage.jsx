"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Download, AlertCircle, Loader2, FileText } from "lucide-react"
import ExportFilterPanel from "../components/export/ExportFilterPanel"

export default function ExportDataPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL || ""

  const [panels, setPanels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [adminRole, setAdminRole] = useState(null)
  const [selectedDepts, setSelectedDepts] = useState([])
  const [expandedPanels, setExpandedPanels] = useState({})
  const [panelDetails, setPanelDetails] = useState({})
  const [fetchingDetails, setFetchingDetails] = useState({})

  useEffect(() => {
    const role = localStorage.getItem("role")
    setAdminRole(role)
  }, [])

  useEffect(() => {
    if (localStorage.getItem("role") !== "superadmin") {
      fetchPanels()
    }
  }, [adminRole])

  const fetchPanels = async () => {
    try {
      setLoading(true)
      setError(null)
      setPanels([])

      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication token not found. Please login first.")
        return
      }

      let url = `${baseUrl}/api/admin/getpanellists`

      if (adminRole === "superadmin") {
        if (!selectedDepts.length) {
          setError("Please select at least one department")
          return
        }
        const deptString = selectedDepts.map((d) => d.value).join(",")
        url += `?department=${deptString}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch panels: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setPanels(data.data)
      } else {
        setError("Failed to load panels")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchPanelDetails = async (panelId) => {
    try {
      if (panelDetails[panelId]) {
        return
      }

      setFetchingDetails((prev) => ({ ...prev, [panelId]: true }))

      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication token not found.")
        return
      }

      const response = await fetch(`${baseUrl}/api/admin/getpanelteamsandjudges/${panelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch panel details: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setPanelDetails((prev) => ({
          ...prev,
          [panelId]: data.data,
        }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setFetchingDetails((prev) => ({ ...prev, [panelId]: false }))
    }
  }

  const togglePanel = async (panelId) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [panelId]: !prev[panelId],
    }))

    if (!expandedPanels[panelId]) {
      await fetchPanelDetails(panelId)
    }
  }

  const exportToCSV = (panelId) => {
    const details = panelDetails[panelId]
    if (!details) return

    const panel = details.panel
    const teams = details.teams
    const judges = details.judges

    let csvContent = "Panel Information\n"
    csvContent += `Panel Name,${panel.panelName}\n`
    csvContent += `Department,"${panel.department.join(", ")}\n`
    csvContent += `Total Teams,${teams.length}\n`
    csvContent += `Total Judges,${judges.length}\n`

    csvContent += "Judges Information\n"
    csvContent += "Judge Name,Email,Phone Number\n"
    judges.forEach((judge) => {
      csvContent += `"${judge.name}","${judge.email}","${judge.phonenumber}"\n`
    })

    csvContent += "\n\nTeams Information\n"
    csvContent += "Team ID,Team Code,Team Name,Department,Leader Name,Leader Email,Category Name\n"
    teams.forEach((team) => {
      csvContent += `${team.id},"${team.teamCode}","${team.teamName}","${team.department}","${team.leaderUser.name}","${team.leaderUser.email}",${team.category.name}\n`
    })

    const element = document.createElement("a")
    element.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`)
    element.setAttribute("download", `${panel.panelName}_export.csv`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Export Panel Data</h1>
          <p className="text-slate-600">
            {adminRole === "superadmin"
              ? "Export evaluation data by selecting departments"
              : "Export your department's evaluation data"}
          </p>
        </div>

        {adminRole === "superadmin" && (
          <ExportFilterPanel selectedDepts={selectedDepts} setSelectedDepts={setSelectedDepts} onFetch={fetchPanels} />
        )}

        {adminRole === "departmentAdmin" && (
          <div className="mb-6">
            <button
              onClick={fetchPanels}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Fetch Panels
            </button>
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
              <p className="text-slate-600">Loading panels...</p>
            </div>
          </div>
        )}

        {!loading && panels.length > 0 && (
          <div className="space-y-4">
            {panels.map((panel) => (
              <div key={panel.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => togglePanel(panel.id)}
                  className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={`h-5 w-5 text-slate-600 transition-transform ${
                        expandedPanels[panel.id] ? "rotate-180" : ""
                      }`}
                    />
                    <div className="text-left">
                      <h2 className="font-semibold text-slate-900">{panel.panelName}</h2>
                      <p className="text-sm text-slate-600">
                        Department: {panel.department.join(", ")} • Category: {panel.category.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      exportToCSV(panel.id)
                    }}
                    disabled={!panelDetails[panel.id] || fetchingDetails[panel.id]}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </button>

                {expandedPanels[panel.id] && (
                  <div className="border-t border-slate-200 p-6">
                    {fetchingDetails[panel.id] ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                          <p className="text-slate-600">Loading panel details...</p>
                        </div>
                      </div>
                    ) : panelDetails[panel.id] ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Judges ({panelDetails[panel.id].judges.length})
                          </h3>
                          <div className="space-y-2">
                            {panelDetails[panel.id].judges.map((judge) => (
                              <div key={judge.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="font-medium text-slate-900">{judge.name}</p>
                                <p className="text-sm text-slate-600">{judge.email}</p>
                                <p className="text-sm text-slate-600">{judge.phonenumber}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Teams ({panelDetails[panel.id].teams.length})
                          </h3>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {panelDetails[panel.id].teams.map((team) => (
                              <div key={team.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-slate-900">{team.teamName}</p>
                                    <p className="text-sm text-slate-600">{team.teamCode}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                      Leader: {team.leaderUser.name} ({team.leaderUser.email})
                                    </p>
                                  </div>
                                  <span className="text-xs bg-slate-200 text-slate-800 px-2 py-1 rounded">
                                    {team.department}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && panels.length === 0 && !error && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">
              {adminRole === "superadmin"
                ? "Please select departments to view panels"
                : "No panels found for your department"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
