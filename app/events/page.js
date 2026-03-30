import { collection, getDocs } from "firebase/firestore"
import Events from "../components/Events"
import { db } from "@/config/firebase"

const page = async () => {
  const querySnapshot = await getDocs(collection(db,"events"))
  const events = querySnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data() 
    }))
  return (
    <Events events={events}/>
  )
}

export default page