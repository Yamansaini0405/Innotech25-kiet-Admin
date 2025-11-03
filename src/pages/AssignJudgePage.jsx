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

    // Helper function to safely escape cells
    const escapeCell = (cell) => {
        let strCell = cell === null || cell === undefined ? "" : String(cell)
        if (strCell.includes(",") || strCell.includes('"') || strCell.includes("\n")) {
            strCell = `"${strCell.replace(/"/g, '""')}"`
        }
        return strCell
    }

    const headerRow = headers.map(escapeCell).join(",")

    const rows = data.map((team) => {
        // Find category name from ID
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
    const departments = [
        { value: "CSE,CSE_Cyber_Security", label: "CSE and CSE Cyber Security" },
        { value: "IT", label: "IT" },
        { value: "CSIT", label: "CSIT" },
        { value: "CS,CSE_Data_Science", label: "CS and CSE Data Science" },
        { value: "CSE_AI", label: "CSE AI" },
        { value: "CSE_AIML", label: "CSE AIML" },
        { value: "ECE,ECE_VLSI", label: "ECE and ECE VLSI" },
        { value: "ELCE", label: "ELCE" },
        { value: "EEE", label: "EEE or EN" },
        { value: "ME", label: "ME and AMIA" },
        { value: "MCA", label: "MCA" },
        { value: "MBA", label: "MBA" },
        { value: "B_PHARMA,M_PHARMA,D_PHARMA", label: "B PHARMA and M PHARMA and D PHARMA (KSOP)" },
        { value: "Other", label: "Other" },
    ]

    const categoryOptions = [
        { id: 1, name: "Smart Solutions, Smarter Society" },
        { id: 2, name: "AI solutions for automation" },
        { id: 3, name: "Automation and Robotics" },
        { id: 4, name: "From Concept to Reality" },
        { id: 5, name: "Start Small, Scale Big, Sustain Always" },
        { id: 7, name: "Creative Visions for a Sustainable Future" },
    ]

    const [selectedDept, setSelectedDept] = useState("")
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

    // Fetch judges on component mount
    useEffect(() => {
        fetchJudges()
    }, [])

    useEffect(() => {   
    if (selectedDept && selectedCategory && selectedStatus) {
      fetchTeams()
    } else {
      setTeams([])
      setMessage(null)
    }
  }, [selectedDept, selectedCategory, selectedStatus])

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
        if (!selectedDept || !selectedCategory || !selectedStatus) {
            setMessage({ type: "error", text: "Please select department, category, and status" })
            return
        }

        try {
            setLoading(true)
            setMessage(null)
            setTeams([])
            const token = localStorage.getItem("token")
            const response = await fetch(
                `${baseUrl}/api/admin/getbydepartmentandcategory?department=${selectedDept}&categoryId=${selectedCategory}&status=${selectedStatus}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
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

    const handleAssignJudges = async () => {
        if (selectedJudges.length !== 3) {
            setMessage({ type: "error", text: "Please select exactly 3 judges" })
            return
        }

        try {
            setSubmitting(true)
            setMessage(null)

            const token = localStorage.getItem("token")
            const response = await fetch(
                `${baseUrl}/api/admin/assigjudgebydepartmentandcategory?department=${selectedDept}&categoryId=${selectedCategory}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        judgeId1: selectedJudges[0].id,
                        judgeId2: selectedJudges[1].id,
                        judgeId3: selectedJudges[2].id,
                    }),
                },
            )

            const data = await response.json()

            if (data.success) {
                setMessage({ type: "success", text: data.message || "Judges assigned successfully" })
                setSelectedJudges([])
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

    const handleExport = () => {
        if (teams.length === 0) {
            setMessage({ type: "error", text: "No teams to export." })
            return
        }

        setIsExporting(true)
        try {
            const csvData = convertTeamsToCSV(teams, categoryOptions)

            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
            const link = document.createElement("a")
            const csvUrl = URL.createObjectURL(blob)

            link.href = csvUrl
            link.setAttribute("download", `assigned-teams-${selectedDept}-${new Date().toISOString().split("T")[0]}.csv`)
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(csvUrl)
        } catch (error) {
            console.error("Error exporting teams:", error)
            setMessage({ type: "error", text: "Failed to create CSV file." })
        } finally {
            setIsExporting(false)
        }
    }

    // Get available judges (not already selected)
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
                    <p className="text-slate-600">Assign judges to teams by department and category</p>
                </div>

                {/* Message Alert */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${message.type === "success"
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
                            <label htmlFor="department" className="block text-sm font-medium text-slate-900 mb-2">
                                Department
                            </label>
                            <select
                                id="department"
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.value} value={dept.value}>
                                        {dept.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-900 mb-2">
                                Category
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

                        {/* <div className="flex items-end">
                            <button
                                onClick={fetchTeams}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Load Teams"
                                )}
                            </button>
                        </div> */}
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
                            <h2 className="text-xl font-semibold text-slate-900">Teams ({teams.length})</h2>
                            {selectedStatus === "unassign" ? (
                                // Show Assign Judges button
                                <button
                                    onClick={() => setShowJudgeSelection(!showJudgeSelection)}
                                    disabled={submitting}
                                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Assign Judges
                                </button>
                            ) : (
                                // Show Export CSV button
                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {isExporting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    {isExporting ? "Exporting..." : "Export as CSV"}
                                </button>
                            )}
                        </div>

                        {/* Judge Selection Interface */}
                        {showJudgeSelection && selectedStatus === "unassign" && (
                            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-4">Select 3 Judges</h3>

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

                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                        Available Judges ({availableJudges.length}):
                                    </p>

                                    {/* Search Input */}
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

                                    {/* Dropdown List */}
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

                                    {/* Close dropdown button */}
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
                                {selectedJudges.length === 3 && (
                                    <div className="mt-4 flex gap-2">
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
                                            onClick={() => setShowJudgeSelection(false)}
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
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Team Code</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Team Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Leader</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {teams.map((team) => {
                                        const categoryName =
                                            categoryOptions.find((c) => c.id == team.categoryId)?.name || team.categoryId
                                        return (
                                            <tr key={team.id} className="hover:bg-slate-50 transition-colors">
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
