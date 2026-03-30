import { collection, getDocs } from "firebase/firestore"
import Events from "../components/Events"
import { db } from "@/config/firebase"

const page = async () => {
  return (
    <Events/>
  )
}

export default page