"use client"

import { useState, useEffect } from "react"
import { Loader2, Download } from "lucide-react"
import FilterPanel from "../components/users/FilterPanel"
import UsersTable from "../components/users/UsersTable"

const convertUsersToCSV = (data) => {
    if (data.length === 0) return ""

    // 1. Define the headers based on the JSON structure
    const headers = [
        "User DB ID",
        "User Public ID",
        "Name",
        "Email",
        "Phone Number",
        "Is Kietian",
        "Participation Category",
        "College",
        "Course",
        "Year",
        "Branch",
        "UID",
        "Startup Name", // Added for startup (if it exists)
        "School Name", // Added for schoolStudent (if it exists)
        "Researcher Institution", // Added for researcher (if it exists)
        "Created At",
        "Updated At",
    ]

    // Helper function to safely escape cells
    const escapeCell = (cell) => {
        let strCell = cell === null || cell === undefined ? "" : String(cell)
        if (strCell.includes(",") || strCell.includes('"') || strCell.includes("\n")) {
            // Escape quotes by doubling them and wrap the whole cell in quotes
            strCell = `"${strCell.replace(/"/g, '""')}"`
        }
        return strCell
    }

    const headerRow = headers.map(escapeCell).join(",")

    const rows = data.map((user) => {
        const rowData = [
            user.id,
            user.userId,
            user.name,
            user.email,
            user.phonenumber,
            user.isKietian,
            user.participationCategory,
            user.collegeStudent?.college, // Safely access nested data
            user.collegeStudent?.course,
            user.collegeStudent?.year,
            user.collegeStudent?.branch,
            user.collegeStudent?.uid,
            user.startup?.name, // Use '?' in case startup is null or has no 'name'
            user.schoolStudent?.school, // Guessing 'school' field
            user.researcher?.institution, // Guessing 'institution' field
            user.createdAt,
            user.updatedAt,
        ]

        return rowData.map(escapeCell).join(",")
    })


    return [headerRow, ...rows].join("\n")
}

export default function UsersPage() {
    const baseUrl = import.meta.env.VITE_BASE_URL || ""
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        department: "",
        participationCategory: "",
        type: "",
        userId: "",
        teamCode: "",
    })

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 20,
    })

    // Fetch users based on filters
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                params.append("page", filters.page)
                params.append("limit", filters.limit)

                if (filters.department) params.append("department", filters.department)
                if (filters.participationCategory) params.append("participationCategory", filters.participationCategory)
                if (filters.type) params.append("type", filters.type)
                if (filters.userId) params.append("userId", filters.userId)
                if (filters.teamCode) params.append("teamCode", filters.teamCode)

                const response = await fetch(`${baseUrl}/api/admin/users?${params.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    })
                const data = await response.json()

                if (data.success) {
                    setUsers(data.data)
                    setPagination({
                        total: data.total,
                        totalPages: data.totalPages,
                        page: data.page,
                        limit: data.limit,
                    })
                }
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [filters])

    const handleExport = async () => {
        setIsExporting(true)
        try {
            // Build params with filters, but without pagination
            const exportParams = new URLSearchParams()

            if (filters.department) exportParams.append("department", filters.department)
            if (filters.participationCategory) exportParams.append("participationCategory", filters.participationCategory)
            if (filters.type) exportParams.append("type", filters.type)
            if (filters.userId) exportParams.append("userId", filters.userId)
            if (filters.teamCode) exportParams.append("teamCode", filters.teamCode)

            exportParams.append("page", 1)
            exportParams.append("limit", pagination.total > 0 ? pagination.total : 1)

            // We omit page/limit to get ALL filtered results
            const response = await fetch(`${baseUrl}/api/admin/users?${exportParams.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            const data = await response.json()
            if (!data.success) throw new Error(data.message || "Failed to fetch data for export")

            const usersToExport = data.data || []

            if (usersToExport.length === 0) {
                console.warn("No data to export for the current filters.")
                // You could set an error message here
                setIsExporting(false)
                return
            }

            // Convert data to CSV using our new helper
            const csvData = convertUsersToCSV(usersToExport)

            // Create blob and trigger download
            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
            const link = document.createElement("a")
            const csvUrl = URL.createObjectURL(blob)

            link.href = csvUrl
            link.setAttribute("download", `users-export-${new Date().toISOString().split("T")[0]}.csv`)
            document.body.appendChild(link)
            link.click()

            // Clean up
            document.body.removeChild(link)
            URL.revokeObjectURL(csvUrl)
        } catch (err) {
            console.error("[v0] Error exporting users:", err)
            // You might want to set an error state here
        } finally {
            setIsExporting(false)
        }
    }

    const handleFilterChange = (newFilters) => {
        setFilters({ ...newFilters, page: 1 }) // Reset to page 1 when filters change
    }

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 bg-slate-200 p-4 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 ">Users Management</h1>
                    <p className="text-gray-600">Manage and filter users across different categories and departments</p>
                </div>

                {/* Filter Panel */}
                <div className="mb-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <FilterPanel filters={filters} onFilterChange={handleFilterChange} />


                </div>
                <div className="my-2 flex justify-end">
                    <button
                        onClick={handleExport}
                        disabled={loading || isExporting} // Disable if loading users or exporting
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

                {/* Users Table */}
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <UsersTable users={users} loading={loading} pagination={pagination} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    )
}
