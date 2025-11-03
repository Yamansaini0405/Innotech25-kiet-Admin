"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, CheckCircle, Clock, Building2, GraduationCap, Briefcase, Microscope } from "lucide-react"
import StatCard from "../components/StatCard"

export default function DashboardPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL || ""
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adminType, setAdminType] = useState(null)

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [isToggleLoading, setIsToggleLoading] = useState(false)

  const [toggleMessage, setToggleMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          setError("No authentication token found. Please login first.")
          setLoading(false)
          return
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [statsResponse, regStatusResponse] = await Promise.all([
          fetch(`${baseUrl}/api/admin/dashboard/stats`, { method: "GET", headers }),
          fetch(`${baseUrl}/api/registration/status`, { method: "GET", headers })
        ]);

        // Process Stats Response
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
          if (statsData.data.totalCollegeInsideTeams !== undefined) {
            setAdminType("super");
          } else {
            setAdminType("dept");
          }
        } else {
          throw new Error(statsData.message || "Failed to fetch dashboard stats");
        }

        // Process Registration Status Response
        const regStatusData = await regStatusResponse.json();
        if (regStatusData.success) {
          setIsRegistrationOpen(regStatusData.data.isRegistrationOpen ?? false);
        } else {
          throw new Error(regStatusData.message || "Failed to fetch registration status");
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Error fetching dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  const handleToggleRegistration = async (e) => {
    const newStatus = e.target.checked
    setIsToggleLoading(true)
    setToggleMessage({ text: "", type: "" }); 

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found.")
      }

      const response = await fetch(`${baseUrl}/api/admin/registration/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRegistrationOpen: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        setIsRegistrationOpen(newStatus)
        setToggleMessage({ text: data.message || "Registration status updated successfully!", type: "success" });
      } else {
        throw new Error(data.message || "Failed to update status.")
      }
    } catch (err) {
      console.error("Error updating registration status:", err)
      setToggleMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setIsToggleLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg border border-red-200 max-w-md">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <p className="text-gray-600">
            {adminType === "super" ? "Super Admin Overview" : "Department Admin Overview"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats?.totalUsers} icon={Users} color="blue" trend={null} />
          <StatCard title="Total Teams" value={stats?.totalTeams} icon={Building2} color="purple" trend={null} />
          <StatCard
            title="Completed Teams"
            value={stats?.totalCompletedTeams}
            icon={CheckCircle}
            color="green"
            trend={null}
          />
          <StatCard title="Pending Teams" value={stats?.totalPendingTeams} icon={Clock} color="orange" trend={null} />
          {adminType === "super" && (
            <>
              <StatCard
                title="College Inside Teams"
                value={stats?.totalCollegeInsideTeams}
                icon={GraduationCap}
                color="indigo"
                trend={null}
              />
              <StatCard
                title="School Teams"
                value={stats?.totalSchoolInsideTeams}
                icon={Building2}
                color="cyan"
                trend={null}
              />
              <StatCard
                title="Researcher Teams"
                value={stats?.totalResearcherTeams}
                icon={Microscope}
                color="pink"
                trend={null}
              />
              <StatCard
                title="Startup Teams"
                value={stats?.totalStartupTeams}
                icon={Briefcase}
                color="amber"
                trend={null}
              />
            </>
          )}
        </div>

        {/* Summary Section */}
        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalTeams}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {stats?.totalTeams > 0 ? Math.round((stats?.totalCompletedTeams / stats?.totalTeams) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Rate</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats?.totalTeams > 0 ? Math.round((stats?.totalPendingTeams / stats?.totalTeams) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* --- REGISTRATION SETTINGS SECTION --- */}
        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Settings</h2>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-gray-800 font-medium">Allow New Registrations</span>
              <p className="text-sm text-gray-500">
                {isRegistrationOpen ? "Registrations are currently OPEN" : "Registrations are currently CLOSED"}
              </p>
            </div>
            <label
              htmlFor="registration-toggle"
              className={`relative inline-flex items-center cursor-pointer ${isToggleLoading ? "opacity-50 cursor-wait" : ""
                }`}
            >
              <input
                type="checkbox"
                id="registration-toggle"
                className="sr-only peer"
                checked={isRegistrationOpen}
                onChange={handleToggleRegistration}
                disabled={isToggleLoading}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* --- FEEDBACK MESSAGE UI --- */}
          {toggleMessage.text && (
            <p className={`text-sm mt-3 ${
                toggleMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {toggleMessage.text}
            </p>
          )}

        </div>

      </div>
    </div>
  )
}