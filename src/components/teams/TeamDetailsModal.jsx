"use client"

import { X, Mail, Phone } from "lucide-react"



export default function TeamDetailsModal({ team, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{team.teamName}</h2>
            <p className="text-blue-100 text-sm">{team.teamCode}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Innovation Idea */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Innovation Idea</h3>
            <p className="text-slate-700 font-medium mb-1">{team.inovationIdeaName}</p>
            <p className="text-slate-600">{team.inovationIdeaDesc}</p>
          </div>

          {/* Team Leader */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Team Leader</h3>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <img
                src={team.leaderUser?.profileImage || "/placeholder-user.jpg"}
                alt={team.leaderUser?.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{team.leaderUser?.name}</p>
                <div className="flex items-center gap-2 text-slate-600 text-sm mt-1">
                  <Mail className="w-4 h-4" />
                  {team.leaderUser?.email}
                  {team.leaderUser?.userId}
                </div>
                {team.leaderUser?.phonenumber && (
                  <div className="flex items-center gap-2 text-slate-600 text-sm mt-1">
                    <Phone className="w-4 h-4" />
                    {team.leaderUser?.phonenumber}
                  </div>
                )}
                {team.leaderUser?.collegeStudent && (
                  <div className="mt-2 text-sm text-slate-600">
                    <p>{team.leaderUser.collegeStudent.college}</p>
                    <p>
                      {team.leaderUser.collegeStudent.branch} - Year {team.leaderUser.collegeStudent.year}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category & Problem Statement */}
          {(team.category || team.problemStatement) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.category && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Category</h3>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-medium text-slate-900">{team.category.name}</p>
                    <p className="text-sm text-slate-600 mt-1">{team.category.description}</p>
                  </div>
                </div>
              )}
              {team.problemStatement && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Problem Statement</h3>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-medium text-slate-900">{team.problemStatement.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{team.problemStatement.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Team Members */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Team Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[team.member1, team.member2, team.member3, team.member4].map((member, idx) =>
                member ? (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <img
                      src={member.profileImage || "/placeholder-user.jpg"}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-600 truncate">{member.email}</p>
                      <p className="text-xs text-slate-500 mt-1">ID: {member.userId}</p>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="text-xs text-slate-500 font-medium">Team Size</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{team.teamSize}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Requests</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{team.requestsCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Assigned Judges</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{team.assignedJudgeIds?.length || 0}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Status</p>
              <p className={`text-sm font-bold mt-1 ${team.isCompleted ? "text-green-600" : "text-yellow-600"}`}>
                {team.isCompleted ? "Completed" : "Pending"}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">Created</p>
              <p>{new Date(team.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Updated</p>
              <p>{new Date(team.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
