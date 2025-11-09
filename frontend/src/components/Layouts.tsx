import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const Layouts = () => {
  return (
    <>
        <Navbar/>
        <div>
            <Sidebar/>
            <Outlet/>
        </div>
    </>
  )
}

export default Layouts