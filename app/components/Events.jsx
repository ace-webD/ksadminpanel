"use client"

import { db } from "@/config/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { FaSignOutAlt, FaTrash, FaPlusCircle } from "react-icons/fa"

const Events = () => {
  const [filteredEvents,setFilteredEvents] = useState([])
  const [email,setEmail] = useState("")
  const [message,setMessage] = useState("")
  const [deleteId,setDeleteId] = useState("")
  const [showErrorBox,setShowErrorBox] = useState(false)
  const [loading,setLoading] = useState(false)
  let router = useRouter()
  const handleSignOut = () => {
    localStorage.clear()
    router.push("/")
  }
  const [loaded, setLoaded] = useState(false)  // ← track if localStorage has been read
  const fetchData = async () => {
    try{
      setLoading(true)
      const querySnapshot = await getDocs(collection(db,"events"))
      const events = querySnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data() 
        }))
      setFilteredEvents(events)
    }
    catch(err){
      console.log(err)
    }
    finally{
      setLoading(false)
    } 
  }
  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    if (storedEmail) setEmail(storedEmail)
    fetchData()
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    if (email) {
      const filter = filteredEvents.filter(event => event.emailId === email)
      setFilteredEvents(filter)
    } else {
      router.push("/")
    }
  }, [email, loaded])
  const handleDelete = async (id) => {
    setLoading(true)
    try{  
      await deleteDoc(doc(db, "events", id))
      fetchData()
    }
    catch(err){
      setMessage("Something went wrong!")
      setShowErrorBox(true)
    }
    setLoading(false)
  }
  const addEvent = () => {
    router.push(`/events/add`)
  }
  return (
    <div className="min-h-screen bg-gray-100 p-4">
  
  {/* Header */}
  <div className="max-w-5xl mx-auto flex justify-between items-center bg-white p-4 rounded-xl shadow">
    <h1 className="text-lg sm:text-xl font-semibold">
      Welcome back, {email || "User"}
    </h1>
    <button onClick={handleSignOut} className="text-red-500 text-xl cursor-pointer">
      <FaSignOutAlt />
    </button>
  </div>

  {/* Add Event */}
  <div className="max-w-5xl mx-auto mt-4 flex items-center gap-2 cursor-pointer text-blue-600" onClick={addEvent}>
    <FaPlusCircle className="text-xl" />
    <span className="text-sm sm:text-base font-medium">Add Event</span>
  </div>

  {/* Events Grid */}
  <div className="max-w-5xl mx-auto mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    
    {filteredEvents?.map((event, index) => (
      <div key={event.id} className="bg-white p-4 rounded-xl shadow flex flex-col gap-2">

        <img
          src={event.poster || "https://via.placeholder.com/300"}
          className="w-full h-40 object-cover rounded-lg"
          alt="event"
        />

        <h2 className="font-semibold text-base">{event.eventName}</h2>

        <p className="text-sm text-gray-600 line-clamp-2">
          {event.eventDescription}
        </p>

        <div className="text-sm text-gray-500">
          <p>👥 Team size: {event.teamSize}</p>
          <p>📅 {event.date} • {event.time}</p>
          <p>📍 {event.venue}</p>
        </div>

        <button
          onClick={() => {
            setDeleteId(event.id)
            setMessage("Are you sure, you want to delete this event!")
            setShowErrorBox(true)
          }}
          className="mt-2 text-red-500 self-end cursor-pointer flex items-center gap-2 bg-black py-2 px-4 rounded-full"
        > Delete
          <FaTrash />
        </button>

      </div>
    ))}

  </div>
    {
      loading &&
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-700 font-medium">Loading...</p>

    </div>
  </div>
    }
  {filteredEvents.length === 0 && (
    <h1 className="text-center mt-10 text-gray-500">
      No events added yet.
    </h1>
  )}
  {showErrorBox && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
        <p className="text-red-600 mb-4">{message}</p>
        <div className="flex flex-row gap-5 mx-auto">
          <button
          onClick={() => {
            setShowErrorBox(false)
            handleDelete(deleteId)
          }}
          className="bg-red-500 text-white px-4 py-1 rounded-lg cursor-pointer mx-auto"
        >
          YES
        </button>
        <button
          onClick={() => {
            setShowErrorBox(false)
            setDeleteId("")
          }}
          className="bg-red-500 text-white px-4 py-1 rounded-lg cursor-pointer mx-auto"
        >
          NO
        </button>
        </div>
      </div>
    </div>
  )}
</div>
  )
}

export default Events