"use client"

import { useState } from "react"
import { ChevronDown, CheckCircle2, User, Award, TrendingUp, Eye } from "lucide-react"

export default function EvaluatedTeamCard({ team, onMarkQualified, isMarking, onViewDetails }) {
  const [expandDetails, setExpandDetails] = useState(false)

  const calculateAverageFromEvaluations = (evaluations) => {
    if (!evaluations || evaluations.length === 0) return 0
    const sum = evaluations.reduce((acc, evaluation) => acc + evaluation.totalScore, 0)
    return (sum / evaluations.length).toFixed(2)
  }

  const averageScore =
    team.evaluations && team.evaluations.length > 0
      ? calculateAverageFromEvaluations(team.evaluations)
      : Number.parseFloat(team.averageScore || 0).toFixed(2)

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all">
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold text-slate-900">{team.teamName}</h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">{team.teamCode}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3 text-sm">
              <span className="text-slate-600">Dept: {team.department}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Inovation Idea Name: {team.inovationIdeaName}</span>
            </div>


            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-slate-900">
                  Average Score: <span className="text-blue-600">{averageScore}/50</span>
                </span>
              </div>
              <div>
                {team.isDepartmentQualified ? (
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Qualified
                  </span>
                ) : (
                  <span className="text-sm text-slate-500">Not Qualified</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!team.isDepartmentQualified && (
              <button
                onClick={onMarkQualified}
                disabled={isMarking}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isMarking ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Marking...
                  </span>
                ) : (
                  "Mark Qualified"
                )}
              </button>
            )}
            {team.isDepartmentQualified && (
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium text-center">
                ✓ Qualified
              </div>
            )}
            <button
              onClick={onViewDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* <div className="p-4 bg-gray-50 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-slate-600" />
          <h5 className="font-medium text-slate-900">Team Members</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[team.leaderUser, team.member1, team.member2, team.member3, team.member4]
            .filter(Boolean)
            .map((member, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {member.profileImage && (
                  <img
                    src={member.profileImage || "/placeholder.svg"}
                    alt={member.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 truncate">{member.email}</p>
                </div>
              </div>
            ))}
        </div>
      </div> */}

      {/* <button
        onClick={() => setExpandDetails(!expandDetails)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors border-t border-slate-200"
      >
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-slate-600" />
          <span className="font-medium text-slate-900">Evaluations ({team.evaluations?.length || 0})</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform ${expandDetails ? "rotate-180" : ""}`} />
      </button> */}
{/* 
      {expandDetails && team.evaluations && team.evaluations.length > 0 && (
        <div className="p-4 space-y-4 bg-gray-50 border-t border-slate-200">
          {team.evaluations.map((evaluation, idx) => (
            <div key={evaluation.id} className="border border-slate-200 rounded-lg p-3 bg-white">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-slate-900">Evaluator {idx + 1}</p>
                  <p className="text-sm text-slate-600">{evaluation.evaluator.name}</p>
                  <p className="text-xs text-slate-500">{evaluation.evaluator.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">{evaluation.totalScore.toFixed(2)}</p>
                  <p className="text-xs text-slate-600">/50</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="text-xs font-medium text-slate-600">{evaluation.departmentrubric.criterion1}</p>
                  <p className="text-lg font-semibold text-slate-900">{evaluation.category1TotalScore.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="text-xs font-medium text-slate-600">{evaluation.departmentrubric.criterion2}</p>
                  <p className="text-lg font-semibold text-slate-900">{evaluation.category2TotalScore.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="text-xs font-medium text-slate-600">{evaluation.departmentrubric.criterion3}</p>
                  <p className="text-lg font-semibold text-slate-900">{evaluation.category3TotalScore.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="text-xs font-medium text-slate-600">{evaluation.departmentrubric.criterion4}</p>
                  <p className="text-lg font-semibold text-slate-900">{evaluation.category4TotalScore.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="text-xs font-medium text-slate-600">{evaluation.departmentrubric.criterion5}</p>
                  <p className="text-lg font-semibold text-slate-900">{evaluation.category5TotalScore.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">Sub-Criteria Scores:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-600">{evaluation.departmentrubric.subcriterion11}</span>
                    <p className="font-semibold text-slate-900">{evaluation.category11Score.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">{evaluation.departmentrubric.subcriterion12}</span>
                    <p className="font-semibold text-slate-900">{evaluation.category12Score.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">{evaluation.departmentrubric.subcriterion21}</span>
                    <p className="font-semibold text-slate-900">{evaluation.category21Score.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">{evaluation.departmentrubric.subcriterion22}</span>
                    <p className="font-semibold text-slate-900">{evaluation.category22Score.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">{evaluation.departmentrubric.subcriterion31}</span>
                    <p className="font-semibold text-slate-900">{evaluation.category31Score.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">{evaluation.departmentrubric.subcriterion32}</span>
                    <p className="font-semibold text-slate-900">{evaluation.category32Score.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">{evaluation.departmentrubric.subcriterion41}</span>
                    <p className="font-semibold text-slate-900">{evaluation.category41Score.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">{evaluation.departmentrubric.subcriterion42}</span>
                    <p className="font-semibold text-slate-900">{evaluation.category42Score.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Evaluated on: {new Date(evaluation.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )} */}
    </div>
  )
}
