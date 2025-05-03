import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import { IoMenuSharp } from "react-icons/io5";
import { useContext } from "react";
import { AuthContext } from "../Components/context/AuthProvider";
function Main() {
  const { setIsslider } = useContext(AuthContext);
  return (
    <div>
      <div className="flex w-full custom-scrollbar">
        <Sidebar />
        <div className="flex flex-col w-full min-h-screen">
          <div className="h-16 w-full bg-green-800 flex items-center justify-center text-white sticky top-0 z-10 shadow-md gap-5 px-3 ">
            <IoMenuSharp className="text-5xl md:text-3xl lg:text-3xl md:hidden lg:hidden" onClick={() => setIsslider(true)} />
            <h1 className="text-base font-montserrat font-extralight tracking-wide text-center md:text-xl lg:text-xl">
              Smart Rice Advisory Dissemination System
            </h1>
          </div>
          <div className="lg:p-8 md:p-8 w-full ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
