"use client"

import { useState } from "react"
import { X, CheckCircle2, Award, User, AlertTriangle, Clock, Trash, TrashIcon, Delete } from "lucide-react"

export default function EvaluatedDetailsModal({ team, onClose, onMarkQualified, isMarking }) {
  const [expandedEvaluations, setExpandedEvaluations] = useState({})

  const calculateAverageFromEvaluations = (evaluations) => {
    if (!evaluations || evaluations.length === 0) return 0
    const sum = evaluations.reduce((acc, evaluation) => acc + evaluation.totalScore, 0)
    return (sum / evaluations.length).toFixed(2)
  }

  const averageScore =
    team.evaluations && team.evaluations.length > 0
      ? calculateAverageFromEvaluations(team.evaluations)
      : Number.parseFloat(team.averageScore || 0).toFixed(2)

  const isNotFullyEvaluated = team.numberofassignedJudges !== team.numberofevaluatedJudges

  const handleDelete = async (id) => {
    try {
      const password = window.prompt("Enter admin password to confirm delete:")
      if (!password) return

      // Call delete API: admin/api/evaluation/:evaluationId/:password
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/evaluation/${id}/${encodeURIComponent(password)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      const data = await res.json()

      if (!res.ok) {
        // show error message from API
        window.alert(data?.message || "Failed to delete evaluation")
        return
      }

      // success
      window.alert(data?.message || "Evaluation deleted successfully")
      // Optionally close modal or refresh parent
      if (onClose) onClose()
    } catch (error) {
      console.error(error)
      window.alert(error?.message || "An error occurred")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">{team.teamName}</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium">{team.teamCode}</span>
            </div>
            <p className="text-sm text-slate-600">
              Department: {team.department} • Category: {team.inovationIdeaName}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
          {/* Team Overview */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">
              <span className="font-medium text-slate-900">Innovation Idea:</span> {team.inovationIdeaDesc}
            </p>
            <div className="flex flex-wrap gap-6 mt-4 justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Average Score</p>
                <p className="text-2xl font-bold text-blue-600">{averageScore}/50</p>
              </div>

            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Team Members
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[team.leaderUser, team.member1, team.member2, team.member3, team.member4]
                .filter(Boolean)
                .map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    {member.profileImage && (
                      <img
                        src={member.profileImage || "/placeholder.svg"}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                      <p className="text-xs text-slate-500 truncate">{member.email}</p>
                      <p className="text-xs text-slate-500 truncate">{member.phonenumber}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Evaluations */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Evaluation Details ({team.evaluations?.length || 0})
            </h3>
            <div className="space-y-3">
              {team.evaluations && team.evaluations.length > 0 ? (
                team.evaluations.map((evaluation, idx) => (
                  <div key={evaluation.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <button
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between flex-1 gap-10 ">
                        <div className="mr-auto flex justify-start flex-col ">
                          <p className="font-medium text-slate-900 text-left">Evaluator {idx + 1}</p>
                          <p className="text-sm text-slate-600">{evaluation.evaluator.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-600">{evaluation.totalScore.toFixed(2)}/50</p>
                        </div>
                        <div className="flex gap-3">
                          <button className="bg-green-600 text-white p-2 px-4 font-bold rounded-xl cursor-pointer hover:bg-green-700 transition-colors" onClick={() =>
                            setExpandedEvaluations((prev) => ({
                              ...prev,
                              [evaluation.id]: !prev[evaluation.id],
                            }))
                          }>
                            Expand
                          </button>
                          <button className="bg-red-600 text-white p-2 px-4 font-bold rounded-xl cursor-pointer hover:bg-red-700 transition-colors" onClick={() => handleDelete(evaluation.id)}>
                            Delete
                          </button>
                        </div>

                      </div>
                    </button>

                    {expandedEvaluations[evaluation.id] && (
                      <div className="px-4 py-4 bg-slate-50 border-t border-slate-200 space-y-4">
                        {/* Criteria Scores */}
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2">Criteria Scores:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <p className="text-xs text-slate-600">{evaluation.departmentrubric.criterion1}</p>
                              <p className="text-lg font-semibold text-slate-900">
                                {evaluation.category1TotalScore.toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <p className="text-xs text-slate-600">{evaluation.departmentrubric.criterion2}</p>
                              <p className="text-lg font-semibold text-slate-900">
                                {evaluation.category2TotalScore.toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <p className="text-xs text-slate-600">{evaluation.departmentrubric.criterion3}</p>
                              <p className="text-lg font-semibold text-slate-900">
                                {evaluation.category3TotalScore.toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <p className="text-xs text-slate-600">{evaluation.departmentrubric.criterion4}</p>
                              <p className="text-lg font-semibold text-slate-900">
                                {evaluation.category4TotalScore.toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <p className="text-xs text-slate-600">{evaluation.departmentrubric.criterion5}</p>
                              <p className="text-lg font-semibold text-slate-900">
                                {evaluation.category5TotalScore.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Sub-Criteria Scores */}
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2">Sub-Criteria Scores:</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <span className="text-slate-600">{evaluation.departmentrubric.subcriterion11}</span>
                              <p className="font-semibold text-slate-900">{evaluation.category11Score.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <span className="text-slate-600">{evaluation.departmentrubric.subcriterion12}</span>
                              <p className="font-semibold text-slate-900">{evaluation.category12Score.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <span className="text-slate-600">{evaluation.departmentrubric.subcriterion21}</span>
                              <p className="font-semibold text-slate-900">{evaluation.category21Score.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <span className="text-slate-600">{evaluation.departmentrubric.subcriterion22}</span>
                              <p className="font-semibold text-slate-900">{evaluation.category22Score.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <span className="text-slate-600">{evaluation.departmentrubric.subcriterion31}</span>
                              <p className="font-semibold text-slate-900">{evaluation.category31Score.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <span className="text-slate-600">{evaluation.departmentrubric.subcriterion32}</span>
                              <p className="font-semibold text-slate-900">{evaluation.category32Score.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <span className="text-slate-600">{evaluation.departmentrubric.subcriterion41}</span>
                              <p className="font-semibold text-slate-900">{evaluation.category41Score.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <span className="text-slate-600">{evaluation.departmentrubric.subcriterion42}</span>
                              <p className="font-semibold text-slate-900">{evaluation.category42Score.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                          Evaluated on: {new Date(evaluation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600 text-center py-4">No evaluations available</p>
              )}
            </div>
          </div>
          {team.notEvaluatedJudges && team.notEvaluatedJudges.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Pending Evaluations ({team.notEvaluatedJudges.length})
              </h3>
              <div className="space-y-3">
                {team.notEvaluatedJudges.map((judge) => (
                  <div key={judge.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{judge.name}</p>
                        <p className="text-sm text-slate-600">{judge.email}</p>
                      </div>
                      <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
