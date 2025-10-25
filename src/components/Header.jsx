
import { Settings, LogOut, User, Users, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"


const Header = () => {
  const navigate = useNavigate()
  

 const handleLogout = async () => {
    // Logout logic
    navigate("/login")
  }



  return (
    <header className="bg-slate-900 shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="px-4">
              <h1 className="text-lg font-bold text-white">InnoTech</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
    </header>
  )
}

export default Header
