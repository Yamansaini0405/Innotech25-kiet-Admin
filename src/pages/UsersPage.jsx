"use client"

import { useState, useEffect } from "react"
import FilterPanel from "../components/users/FilterPanel"
import UsersTable from "../components/users/UsersTable"

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

                {/* Users Table */}
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <UsersTable users={users} loading={loading} pagination={pagination} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    )
}
