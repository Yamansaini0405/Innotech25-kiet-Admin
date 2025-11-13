"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, Users2, LogOut, Menu, X, Settings, GraduationCap, PencilLine, Target } from "lucide-react"

export default function Sidebar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleLogout = () => {
    navigate("/login")
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Participants", path: "/users" },
    { icon: Users2, label: "Teams", path: "/teams" },
    ...(localStorage.getItem("role") === "superadmin"
      ? [{ icon: Settings, label: "Settings", path: "/settings" }]
      : []),
    ...(localStorage.getItem("role") === "superadmin"
      ? [{ icon: PencilLine, label: "Create Judge", path: "/judges" }]
      : []),
    ...(localStorage.getItem("role") === "superadmin"
      ? [{ icon: GraduationCap, label: "Assign Judge", path: "/assign-judge" }]
      : []),
      // ...(localStorage.getItem("role") === "superadmin"
      // ? [{ icon: Target, label: "Evaluate", path: "/evaluate" }]
      // : []),
    ...(localStorage.getItem("role") === "superadmin"
      ? [{ icon: Target, label: "Unassign team", path: "/unassign-teams" }]
      : []),
      ...(localStorage.getItem("role") === "superadmin"
      ? [{ icon: Target, label: "Evaluated Teams", path: "/evaluated-teams" }]
      : []),
      // { icon: Users2, label: "Export Panel", path: "/export" }
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 border border-slate-700 rounded text-cyan-400"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-slate-900 border-r border-slate-700 flex flex-col transition-transform duration-300 z-40`}
      >
        {/* Logo Section */}
        <div className="pt-6 pb-1 border-b border-slate-700">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="https://www.kiet.edu/assets/frontend/img/logo.png"
              alt="InnoTech"
              className="w-32 h-fit object-contain"
            />
            <span className="text-2xl text-white font-semibold">X</span>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/innotechImage-fAoUsQkEiBECAKDX6UwHqaQywPdwRI.jpg"
              alt="InnoTech"
              className="w-10 h-10 object-contain"
            />



          </div>
          {/* <div className="px-4">
              <h1 className="text-lg font-bold text-white">InnoTech</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div> */}

        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-scroll no-scrollbar">

          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path)
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-4 mb-2">
          <h1 className="text-lg font-bold text-white">InnoTech25 <span className="text-xs text-slate-400">(Admin Portal)</span></h1>

        </div>
        {/* Admin Info & Logout */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          <div className="px-4 py-2 bg-slate-800 rounded">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold text-cyan-400 truncate">{localStorage.getItem("role")}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
