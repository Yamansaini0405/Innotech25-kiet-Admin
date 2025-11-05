"use client"

import { useState } from "react"
import { Download, X } from "lucide-react"

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

export default function ExportFilterPanel({ selectedDepts, setSelectedDepts, onFetch }) {
  const [isOpen, setIsOpen] = useState(false)

  const addDepartment = (dept) => {
    if (!selectedDepts.find((d) => d.value === dept.value)) {
      setSelectedDepts([...selectedDepts, dept])
    }
    setIsOpen(false)
  }

  const removeDepartment = (value) => {
    setSelectedDepts(selectedDepts.filter((d) => d.value !== value))
  }

  const toggleDepartmentDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Filter Panels</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Departments <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <button
            onClick={toggleDepartmentDropdown}
            className="w-full px-4 py-2 text-left bg-white border border-slate-300 rounded-lg hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {selectedDepts.length === 0 ? "Select departments..." : `${selectedDepts.length} selected`}
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {departments.map((dept) => (
                <button
                  key={dept.value}
                  onClick={() => addDepartment(dept)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 transition-colors text-slate-900"
                >
                  {dept.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedDepts.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedDepts.map((dept) => (
            <div
              key={dept.value}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {dept.label}
              <button onClick={() => removeDepartment(dept.value)} className="hover:text-blue-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onFetch}
        disabled={selectedDepts.length === 0}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Fetch Panels
      </button>
    </div>
  )
}
