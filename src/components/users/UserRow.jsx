"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import UserDetails from "./UserDetails"


export default function UserRow({ user }) {
  const [expanded, setExpanded] = useState(false)

  const getProfileType = () => {
    if (user.collegeStudent) return "College Student"
    if (user.schoolStudent) return "School Student"
    if (user.researcher) return "Researcher"
    if (user.startup) return "Startup"
    return "N/A"
  }

  const getBranch = () => {
    if (user.collegeStudent) return user.collegeStudent.branch
    if (user.schoolStudent) return user.schoolStudent.school
    if (user.researcher) return user.researcher.field
    if (user.startup) return user.startup.industry
    return "N/A"
  }

  const getYear = () => {
    if (user.collegeStudent) return user.collegeStudent.year
    if (user.schoolStudent) return user.schoolStudent.grade
    return "N/A"
  }

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{user.name}</td>
        <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{user.userId}</td>
        <td className="px-4 py-3 text-sm">
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {user.participationCategory || "N/A"}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-900">{getProfileType()}</td>
        <td className="px-4 py-3 text-sm text-gray-900">{getBranch()}</td>
        <td className="px-4 py-3 text-sm text-gray-900">{getYear()}</td>
        <td className="px-4 py-3 text-sm">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View
              </>
            )}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-gray-200 bg-gray-50">
          <td colSpan="8" className="px-4 py-4">
            <UserDetails user={user} />
          </td>
        </tr>
      )}
    </>
  )
}
