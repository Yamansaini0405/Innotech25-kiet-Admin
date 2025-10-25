"use client"

export default function UserDetails({ user }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="text-gray-900">{user.phonenumber || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Google ID:</span>
              <span className="text-gray-900 font-mono text-xs">{user.googleId?.substring(0, 20)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Is Kietian:</span>
              <span className="text-gray-900">{user.isKietian ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900 text-xs">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center">
          <h3 className="font-semibold text-gray-900 mb-3 w-full">Profile Image</h3>
          {user.profileImage ? (
            <img
              src={user.profileImage || "/placeholder.svg"}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
      </div>

      {/* College Student Details */}
      {user.collegeStudent && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">College Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">College:</span>
              <p className="text-gray-900 font-medium">{user.collegeStudent.college}</p>
            </div>
            <div>
              <span className="text-gray-600">Course:</span>
              <p className="text-gray-900 font-medium">{user.collegeStudent.course}</p>
            </div>
            <div>
              <span className="text-gray-600">Branch:</span>
              <p className="text-gray-900 font-medium">{user.collegeStudent.branch}</p>
            </div>
            <div>
              <span className="text-gray-600">Year:</span>
              <p className="text-gray-900 font-medium">{user.collegeStudent.year}</p>
            </div>
            <div className="col-span-2 md:col-span-4">
              <span className="text-gray-600">UID:</span>
              <p className="text-gray-900 font-mono text-xs">{user.collegeStudent.uid}</p>
            </div>
          </div>
        </div>
      )}

      {/* School Student Details */}
      {user.schoolStudent && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">School Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">School:</span>
              <p className="text-gray-900 font-medium">{user.schoolStudent.school}</p>
            </div>
            <div>
              <span className="text-gray-600">Grade:</span>
              <p className="text-gray-900 font-medium">{user.schoolStudent.grade}</p>
            </div>
          </div>
        </div>
      )}

      {/* Researcher Details */}
      {user.researcher && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Researcher Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Field:</span>
              <p className="text-gray-900 font-medium">{user.researcher.field}</p>
            </div>
            <div>
              <span className="text-gray-600">Institution:</span>
              <p className="text-gray-900 font-medium">{user.researcher.institution}</p>
            </div>
          </div>
        </div>
      )}

      {/* Startup Details */}
      {user.startup && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Startup Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Company:</span>
              <p className="text-gray-900 font-medium">{user.startup.companyName}</p>
            </div>
            <div>
              <span className="text-gray-600">Industry:</span>
              <p className="text-gray-900 font-medium">{user.startup.industry}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
