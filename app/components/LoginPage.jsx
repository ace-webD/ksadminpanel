"use client"
import { db } from "@/config/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {FaEye, FaEyeSlash} from 'react-icons/fa'

const LoginPage = () => {
  const router = useRouter()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")
  const [isEyeOpen,setIsEyeOpen] = useState(false)
  const [loading,setLoading] = useState(false)

  const validateCredentials = () => {
    if(!email || email.trim() === ""){
      setError("Email field is mandatory!")
      return false
    }
    if(!password || password.trim() === ""){
      setError("Password field is mandatory!")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if(!validateCredentials()) return
    setLoading(true)
    try {
      const q = query(collection(db, "clubs"), where("email", "==", email))
      const snapshot = await getDocs(q)
      if(snapshot.empty){
        setError("No account found with this email!")
        setLoading(false)
        return
      }
      const club = snapshot.docs[0].data()
      if(club.password !== password){
        setError("Incorrect password!")
        setLoading(false)
        return
      }
      localStorage.setItem("email", email)
      router.push("/events")
    } catch(err) {
      setError("Something went wrong. Please try again!")
    }
    setLoading(false)
  }

  const handleEyeClick = () => {
    setIsEyeOpen(prev => !prev)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
  <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-6">

    {/* Header */}
    <div className="text-black rounded-xl py-4">
      <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold">
        KS'26 Admin Panel
      </h1>
    </div>

    {/* Form */}
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-lg font-medium text-gray-700">
        Login
      </h2>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <input
          required
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Password */}
        <div className="relative">
          <input
            required
            type={isEyeOpen ? "text" : "password"}
            placeholder="Enter your password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
          />

          <button
            type="button"
            onClick={handleEyeClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
          >
            {isEyeOpen ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition cursor-pointer disabled:opacity-60"
        >
          {loading ? "Checking..." : "Login"}
        </button>
        {
          error &&
          <p className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded-lg text-sm text-center">
            {error}
          </p>
        }
      </form>
    </div>

  </div>
</div>
  )
}

export default LoginPage