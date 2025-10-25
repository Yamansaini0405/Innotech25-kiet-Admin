// API configuration and helper functions
const API_BASE_URL = import.meta.env.VITE_BASE_URL
console.log(API_BASE_URL)

export const getAuthToken = () => {
  return localStorage.getItem("token")
}

export const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] API Error:", error)
    throw error
  }
}

export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return apiCall(`/users${queryString ? `?${queryString}` : ""}`)
}

export const getCollegeInsideTeams = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return apiCall(`/teams/college/inside${queryString ? `?${queryString}` : ""}`)
}

export const getCollegeOutsideTeams = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return apiCall(`/teams/college/outside${queryString ? `?${queryString}` : ""}`)
}

export const getSchoolTeams = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return apiCall(`/teams/school${queryString ? `?${queryString}` : ""}`)
}

export const getResearcherTeams = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return apiCall(`/teams/researcher${queryString ? `?${queryString}` : ""}`)
}

export const getTeamById = async (id) => {
  return apiCall(`/teams/${id}`)
}
