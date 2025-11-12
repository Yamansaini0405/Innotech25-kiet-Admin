"use client"

export default function EvaluatedFilterPanel({ filters, setFilters, categoryOptions }) {
  
  // Options for the new primary filter
  const participationCategoryOptions = [
    { value: "college", label: "College" },
    { value: "school", label: "School" },
    { value: "researcher", label: "Researcher" },
    { value: "startup", label: "Startup" },
  ]

  const handleParticipationCategoryChange = (e) => {
    setFilters({
      participationCategory: e.target.value,
      category: "", // Reset innovation category when participation category changes
    })
  }

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      category: e.target.value,
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
        <div>
          <label htmlFor="participationCategory" className="block text-sm font-medium text-slate-900 mb-2">
            Participation Category <span className="text-red-600">*</span>
          </label>
          <select
            id="participationCategory"
            value={filters.participationCategory}
            onChange={handleParticipationCategoryChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a Participation Category</option>
            {participationCategoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional filter: Only show if participation category is 'college' */}
        {filters.participationCategory === "college" && (
          <div>
            <label htmlFor="innovationCategory" className="block text-sm font-medium text-slate-900 mb-2">
              Innovation Category <span className="text-red-600">*</span>
            </label>
            <select
              id="innovationCategory"
              value={filters.category}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an Innovation Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}