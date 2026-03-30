import { collection, getDocs } from "firebase/firestore"
import { db } from "@/config/firebase"
import AddEvent from "@/app/components/AddEvent"

const page = () => {
  
  return (
    <AddEvent />
  )
}

export default page