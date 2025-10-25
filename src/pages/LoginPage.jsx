"use client"

import { useState } from "react"
import { Mail, Lock, LogIn } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL || ""

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Email and password are required.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${baseUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("Response:", data)

      if (response.ok && data.success) {
        // ✅ Save token and role
        localStorage.setItem("token", data.token)
        if (data.admin?.role) {
          localStorage.setItem("role", data.admin.role)
        }

        navigate("/users")
      } else {
        setError(data.message || "Invalid email or password")
      }
    } catch (err) {
      console.error(err)
      setError("Login failed. Please check your connection")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/innotechImage-fAoUsQkEiBECAKDX6UwHqaQywPdwRI.jpg"
              alt="InnoTech Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">InnoTech 2025</h1>
          <p className="text-slate-400">KIET Group of Institutions</p>
          <p className="text-slate-500 text-sm mt-2">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kiet.edu"
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          © 2025 KIET Group of Institutions. All rights reserved.
        </p>
      </div>
    </div>
  )
}
