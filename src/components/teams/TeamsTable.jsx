"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Users } from "lucide-react"
import TeamDetailsModal from "./TeamDetailsModal"

export default function TeamsTable({ teams, teamType }) {
  const [expandedTeamId, setExpandedTeamId] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const toggleExpand = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId)
  }

  const openTeamDetails = (team) => {
    setSelectedTeam(team)
    setShowModal(true)
  }

  const isCollegeTeam = teamType === "college-inside" || teamType === "college-outside"
  const expandedColSpan = isCollegeTeam ? 7 : 6

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-200 ">
                <th className="px-6 py-3 text-left text-xs font-semibold text-white">Team Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white">Team Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white">Leader</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white">Team Size</th>
                {isCollegeTeam && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white">Department</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-white">Category Id</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white">Actions</th>
              </tr>
            </thead>
            
              {teams.map((team) => (
                <tbody key={team.id}>
                  <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{team.teamName}</div>
                      <div className="text-sm text-slate-500">{team.inovationIdeaName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {team.teamCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={team.leaderUser?.profileImage || "/placeholder-user.jpg"}
                          alt={team.leaderUser?.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900">{team.leaderUser?.name}</div>
                          <div className="text-xs text-slate-500">{team.leaderUser?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-900">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="font-medium">{team.teamSize}</span>
                      </div>
                    </td>
                    {isCollegeTeam && (
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{team.department}</span>
                      </td>
                    )}
                    <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{team.categoryId}</span>
                      </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          team.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {team.isCompleted ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openTeamDetails(team)}
                          className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleExpand(team.id)}
                          className="p-1 hover:bg-slate-200 rounded transition-colors"
                        >
                          {expandedTeamId === team.id ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedTeamId === team.id && (
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <td colSpan={expandedColSpan} className="px-6 py-4">
                        <div className="space-y-4">
                          {/* Innovation Idea */}
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">Innovation Idea</h4>
                            <p className="text-sm text-slate-700">{team.inovationIdeaDesc}</p>
                          </div>

                          {/* Category & Problem Statement */}
                          {team.category && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Category</h4>
                                <p className="text-sm text-slate-700">{team.category.name}</p>
                              </div>
                              {team.problemStatement && (
                                <div>
                                  <h4 className="font-semibold text-slate-900 mb-2">Problem Statement</h4>
                                  <p className="text-sm text-slate-700">{team.problemStatement.title}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Team Members */}
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">Team Members</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                              {[team.member1, team.member2, team.member3, team.member4].map((member, idx) =>
                                member ? (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200"
                                  >
                                    <img
                                      src={member.profileImage || "/placeholder-user.jpg"}
                                      alt={member.name}
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                                      <p className="text-xs text-slate-500 truncate">{member.email}</p>
                                    </div>
                                  </div>
                                ) : null,
                              )}
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-200">
                            <div>
                              <p className="text-xs text-slate-500">Requests</p>
                              <p className="text-sm font-semibold text-slate-900">{team.requestsCount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Assigned Judges</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {team.assignedJudgeIds?.length || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Created</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {new Date(team.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Updated</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {new Date(team.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
            
          </table>
        </div>
      </div>

      {/* Team Details Modal */}
      {showModal && selectedTeam && <TeamDetailsModal team={selectedTeam} onClose={() => setShowModal(false)} />}
    </>
  )
}
