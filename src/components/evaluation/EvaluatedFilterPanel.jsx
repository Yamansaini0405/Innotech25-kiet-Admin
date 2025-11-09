"use client"

export default function EvaluatedFilterPanel({ filters, setFilters, adminRole }) {
  const departmentOptions = [
    { value: "CSE", label: "CSE" },
    { value: "IT,CSE_Cyber_Security", label: "IT and CSE Cyber Security" },
    { value: "CSIT", label: "CSIT" },
    { value: "CS,CSE_Data_Science", label: "CS and CSE Data Science" },
    { value: "CSE_AI", label: "CSE AI" },
    { value: "CSE_AIML", label: "CSE AIML" },
    { value: "ECE,ECE_VLSI", label: "ECE and ECE VLSI" },
    { value: "EEE,ELCE", label: "EEE and ELCE" },
    { value: "ME,AMIA", label: "ME and AMIA" },
    { value: "MCA", label: "MCA" },
    { value: "MBA", label: "MBA" },
    { value: "B_PHARMA,M_PHARMA,D_PHARMA", label: "B PHARMA and M PHARMA and D PHARMA (KSOP)" },
    { value: "Other", label: "Other" },
  ]

  const handleDepartmentChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      department: e.target.value,
    }))
  }

  const handleTopTeamsChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      topTeams: value === null ? null : value,
    }))
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminRole === "superadmin" && (
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Department <span className="text-red-600">*</span>
            </label>
            <select
              value={filters.department}
              onChange={handleDepartmentChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a Department</option>
              {departmentOptions.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-600 mt-1">Required - Select a department to view results</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">Top Teams</label>
          <div className="flex gap-2">
            {[3, 5, 10, 30,100].map((num) => (
              <button
                key={num}
                onClick={() => handleTopTeamsChange(filters.topTeams === num ? null : num)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.topTeams === num
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                }`}
              >
                Top {num}
              </button>
            ))}
            {filters.topTeams && (
              <button
                onClick={() => handleTopTeamsChange(null)}
                className="px-3 py-2 rounded-md text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
