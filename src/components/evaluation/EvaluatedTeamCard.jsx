"use client"

import { useState } from "react"
import { ChevronDown, CheckCircle2, User, Award, TrendingUp, Eye, AlertTriangle } from "lucide-react"

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

  const isNotFullyEvaluated = team.numberofassignedJudges !== team.numberofevaluatedJudges

  return (
    <div
      className={`rounded-lg bg-white overflow-hidden transition-all
        ${
          "border border-slate-200 hover:border-slate-300 hover:shadow-md" // Default border
        }
      `}
    >
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
              
            </div>

            {isNotFullyEvaluated && (
              <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-700">
                      Only {team.numberofevaluatedJudges} of {team.numberofassignedJudges} judges have completed their evaluation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
          
            
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
      
    </div>
  )
}