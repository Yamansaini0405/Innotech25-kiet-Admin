export default function StatCard({ title, value, icon: Icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
    pink: "bg-pink-50 text-pink-600 border-pink-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
  }

  const bgColor = colorClasses[color] || colorClasses.blue

  return (
    <div className={`p-6 rounded-lg border ${bgColor} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value ?? 0}</p>
        </div>
        <Icon className="w-8 h-8 opacity-20" />
      </div>
    </div>
  )
}
