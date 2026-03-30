"use client"

import { db } from "@/config/firebase"
import { addDoc, collection } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const AddEvent = () => {
  const [email,setEmail] = useState("")
  const [eventName,setEventName] = useState("")
  const [eventDescription,setEventDescription] = useState("")
  const [eventDate,setEventDate] = useState("")
  const [eventTime,setEventTime] = useState("")
  const [eventVenue,setEventVenue] = useState("")
  const [eventTeamSize,setEventTeamSize] = useState("")
  const [eventLink,setEventLink] = useState("")
  const [eventImage,setEventImage] = useState(null)
  const [error,setError] = useState("")
  const [showErrorBox,setShowErrorBox] = useState(false)
  const router = useRouter()
  const [loading,setLoading] = useState(false)
  useEffect(() => {
      const storedEmail = localStorage.getItem("email")
      if(storedEmail) setEmail(localStorage.getItem("email"))
      else router.push("/")
  },[])
  const uploadImage = async () => {
    const formData = new FormData()
    formData.append("file", eventImage)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
    const data = await res.json()
    return data.secure_url
  }
  const validateInput = () => {
    if(!eventName || eventName.trim() === ""){
      setError("Event name field is mandatory!")
      setShowErrorBox(true)
      return false
    }
    if(!eventDescription || eventDescription.trim() === ""){
      setError("Event description field is mandatory!")
      setShowErrorBox(true)
      return false
    }
    if(!eventDate || eventDate.trim() === ""){
      setError("Event date field is mandatory!")
      setShowErrorBox(true)
      return false
    }
    if(!eventTime || eventTime.trim() === "" ){
      setError("Event time field is mandatory!")
      setShowErrorBox(true)
      return false
    }
    if(!eventVenue || eventVenue.trim() === ""){
      setError("Event venue field is mandatory!")
      setShowErrorBox(true)
      return false
    }
    if(eventTeamSize.trim() === "" || !eventTeamSize){
      setError("Event team size field is mandatory!")
      setShowErrorBox(true)
      return false
    }
    if(parseInt(eventTeamSize) <= 0){
      setError("Event team size field is mandatory!")
      setShowErrorBox(true)
      return false
    }
    if(!eventLink || eventLink.trim() === ""){
      setError("Event registration link field is mandatory!")
      setShowErrorBox(true)
      return false
    }
    if(!eventImage){
      setError("Event image field is mandatory!")
      setShowErrorBox(true)
      return false
    }
    const selectedDateAndTime = new Date(`${eventDate}T${eventTime}`)
    const now = new Date()
    if(now > selectedDateAndTime){
      setError("Event date and time cannot be in the past!")
      setShowErrorBox(true)
      return false
    }
    return true
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if(!validateInput()){
      setLoading(false)
      return
    }
    setLoading(true)
    try{
      const imageUrl = await uploadImage()
      await addDoc(collection(db, "events"),{
        date: eventDate,
        time: eventTime,
        eventDescription,
        eventName,
        formLink: eventLink,
        poster: imageUrl,
        teamSize: eventTeamSize,
        venue: eventVenue,
        emailId: email || "unknown@gmail.com"
      })
      setError("Added event successfully!")
      setShowErrorBox(true)
    }
    catch(err){
      setError("Something went wrong!")
      setShowErrorBox(true)
    }
    setLoading(false)
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow flex flex-col gap-4">

    <h1 className="text-xl font-semibold text-center">Add Event</h1>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <input
        placeholder="Event name"
        type="text"
        value={eventName}
        onChange={e => setEventName(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="Event description"
        type="text"
        value={eventDescription}
        onChange={e => setEventDescription(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="date"
        value={eventDate}
        onChange={e => setEventDate(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="time"
        value={eventTime}
        onChange={e => setEventTime(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="Venue"
        type="text"
        value={eventVenue}
        onChange={e => setEventVenue(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="Team size"
        type="number"
        value={eventTeamSize}
        onChange={e => setEventTeamSize(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="Registration link"
        type="text"
        value={eventLink}
        onChange={e => setEventLink(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="file"
        onChange={e => setEventImage(e.target.files[0])}
        className="text-sm rounded-full bg-blue-600 py-2 px-4 text-white cursor-pointer hover:bg-blue-700 transition font-semibold"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
      >
        Submit
      </button>

    </form>
  </div>
    {loading && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-700 font-medium">Loading...</p>

    </div>
  </div>}
  {showErrorBox && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => {
            setShowErrorBox(false)
            if(error === "Added event successfully!" || error === "Something went wrong!"){
              router.push("/events")
              router.refresh()
            }
          }}
          className="bg-red-500 text-white px-4 py-1 rounded-lg cursor-pointer"
        >
          OK
        </button>
      </div>
    </div>
  )}

</div>
  )
}

export default AddEvent