"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle2, Loader2, Settings, Settings2 } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [statsType, setStatsType] = useState(null)
  const [isCustomStats, setIsCustomStats] = useState(false)
  const [totalUsers, setTotalUsers] = useState("")
  const [totalTeams, setTotalTeams] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
   const [currentStats, setCurrentStats] = useState(null)
  const baseUrl = import.meta.env.VITE_BASE_URL || ""

  // Fetch current stats configuration
  useEffect(() => {
    const fetchStatsConfig = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${baseUrl}/api/participantsstats`,
            { method: "GET", headers: { "Content-Type": "application/json" , Authorization: `Bearer ${localStorage.getItem("token")}` }}
        )
        const data = await response.json()

        if (data.success) {
          setStatsType(data.type)
           setCurrentStats(data.data)
          // s1 = custom stats ON, s2 = custom stats OFF
          setIsCustomStats(data.type === "s1")
        }
      } catch (error) {
        console.error("Error fetching stats config:", error)
        setMessage({ type: "error", text: "Failed to load settings" })
      } finally {
        setLoading(false)
      }
    }

    fetchStatsConfig()
  }, [])

  // Handle toggle for s1 (custom stats currently ON)
  const handleToggleCustomStats = async (checked) => {
    console.log(localStorage.getItem("token"))
    try {
      setSubmitting(true)
      setMessage(null)

      const response = await fetch(`${baseUrl}/api/admin/setting`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
        body: JSON.stringify({ visibleStats: checked }),
      })

      const data = await response.json()

      if (data.success) {
        setIsCustomStats(checked)
        setMessage({
          type: "success",
          text: checked ? "Custom stats enabled" : "Custom stats disabled",
        })
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update settings" })
      }
    } catch (error) {
      console.error("Error updating stats:", error)
      setMessage({ type: "error", text: "Failed to update settings" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleS2 = (checked) => {
    setIsCustomStats(checked)
    if (!checked) {
      // Reset form when toggling off
      setTotalUsers("")
      setTotalTeams("")
      setMessage(null)
    }
  }

  // Handle update for s2 (custom stats currently OFF)
  const handleUpdateCustomStats = async () => {
    console.log(localStorage.getItem("token"))
    if (!totalUsers.trim() || !totalTeams.trim()) {
      setMessage({ type: "error", text: "Please fill in all fields" })
      return
    }

    try {
      setSubmitting(true)
      setMessage(null)

      const response = await fetch(`${baseUrl}/api/admin/setting`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
        
        body: JSON.stringify({
          visibleStats: true,
          totalUsers: totalUsers.trim(),
          totalTeams: totalTeams.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsCustomStats(true)
        setMessage({ type: "success", text: "Custom stats enabled successfully" })
        // Reset form
        setTotalUsers("")
        setTotalTeams("")
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update settings" })
      }
    } catch (error) {
      console.error("Error updating stats:", error)
      setMessage({ type: "error", text: "Failed to update settings" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-full mx-auto ">
        {/* Header */}
        <div className="mb-8 bg-slate-200 p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-2"><Settings className="inline-block w-6 h-6 mr-2" /> Settings</h1>
          <p className="text-slate-600">Manage your statistics display preferences</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
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

        {/* Stats Visibility Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Statistics Display</h2>
            <p className="text-sm text-slate-600 mt-1">
              {statsType === "s1"
                ? "Custom statistics are currently enabled"
                : "Real-time statistics are currently displayed"}
            </p>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-6">
            {/* S1 Case: Custom Stats ON */}
            {statsType === "s1" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-slate-900">Custom Statistics</p>
                    <p className="text-sm text-slate-600">Showing custom data instead of real-time statistics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCustomStats}
                      onChange={(e) => handleToggleCustomStats(e.target.checked)}
                      disabled={submitting}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  Toggle off to display real-time statistics from your actual data.
                </p>
              </div>
            )}

            {/* S2 Case: Custom Stats OFF */}
            {statsType === "s2" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">Custom Statistics</p>
                    <p className="text-sm text-slate-600">Currently showing real-time statistics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCustomStats}
                      onChange={(e) => handleToggleS2(e.target.checked)}
                      disabled={submitting}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Form for entering custom stats */}
                {isCustomStats && (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-900">Enter custom statistics to display</p>

                    <div className="space-y-2">
                      <label htmlFor="totalUsers" className="block text-sm font-medium text-slate-900">
                        Total Users
                      </label>
                      <input
                        id="totalUsers"
                        type="text"
                        placeholder="e.g., 8000"
                        value={totalUsers}
                        onChange={(e) => setTotalUsers(e.target.value)}
                        disabled={submitting}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="totalTeams" className="block text-sm font-medium text-slate-900">
                        Total Teams
                      </label>
                      <input
                        id="totalTeams"
                        type="text"
                        placeholder="e.g., 400"
                        value={totalTeams}
                        onChange={(e) => setTotalTeams(e.target.value)}
                        disabled={submitting}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <p className="text-xs text-slate-600">
                      These values will be displayed on your public statistics page.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Footer with Action Button */}
          {statsType === "s2" && isCustomStats && (
            <div className="border-t border-slate-200 p-6">
              <button
                onClick={handleUpdateCustomStats}
                disabled={submitting || !totalUsers.trim() || !totalTeams.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Statistics"
                )}
              </button>
            </div>
          )}
        </div>

        {currentStats && (
          <div className="mt-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-600 mb-1">Total Prize Pool</p>
                <p className="text-2xl font-bold text-slate-900">{currentStats.totalPrizePool}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-slate-600 mb-1">Total Awards</p>
                <p className="text-2xl font-bold text-slate-900">{currentStats.totalAwards}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-slate-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{currentStats.totalUsers}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-slate-600 mb-1">Total Teams</p>
                <p className="text-2xl font-bold text-slate-900">{currentStats.totalTeams}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
