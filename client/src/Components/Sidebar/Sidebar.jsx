import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { FaTachometerAlt, FaCloudSun, FaWater, FaSignOutAlt, FaClipboardList, FaCogs, FaArchive, FaComments, FaInfoCircle, FaPumpSoap, FaSeedling, FaCloud, FaLeaf, FaTint, FaGasPump } from "react-icons/fa";
import { IoIosAddCircle, IoMdSwitch } from "react-icons/io";
import logo from "../../assets/brri.png";
import useLogout from "../../Hook/useLogout";
import { AuthContext } from "../context/AuthProvider";
import { TbReport } from "react-icons/tb";

const Sidebar = () => {
  const { logout, loading } = useLogout();
  const [openMenus, setOpenMenus] = useState({});
  const { isslider, setIsslider } = useContext(AuthContext);
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div
      className={`w-72 h-screen bg-white text-gray-800 shadow-lg fixed lg:sticky md:sticky top-0 transition-all duration-300 z-[1000] ${isslider ? 'left-0' : 'left-[-360px]'
        } flex flex-col overflow-y-auto font-montserrat font-extralight`}
    >
      <div className="flex items-center px-4 py-5 border-b relative">
        <img src={logo} alt="Logo" className="w-12 h-12 rounded-full mr-4" />
        <h2 className="text-xl font-bold">SAADs</h2>
        <RxCross2 className="text-2xl ml-auto cursor-pointer absolute top-4 right-4 md:hidden lg:hidden" onClick={() => setIsslider(false)} />
      </div>
      <div className="flex flex-col px-4 space-y-4 mt-4">
        <Link to="/">
          <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
            <FaTachometerAlt className="mr-3 text-lg" /> Dashboard
          </button>
        </Link>

        <div>
          <button
            className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${isActive("/registration") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
            onClick={() => toggleMenu("registration")}
          >
            <span className="flex items-center"><FaClipboardList className="mr-3" /> Registration</span>
            <IoIosAddCircle />
          </button>
          <ul className={`mt-2 ${openMenus.registration ? "block" : "hidden"} pl-4 space-y-1`}>
            <li><Link to="/ad-registration" className="hover:text-green-700">AD</Link></li>
            <li><Link to="/admin-registration" className="hover:text-green-700">Admin/DD</Link></li>
            <li><Link to="/uao-registration" className="hover:text-green-700">UAO</Link></li>
            <li><Link to="/saao-registration" className="hover:text-green-700">SAAO</Link></li>
            <li><Link to="/farmer-registration" className="hover:text-green-700">Farmer</Link></li>
          </ul>
        </div>
        <div>
          <button
            className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${isActive("/feedback") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
            onClick={() => toggleMenu("feedback")}
          >
            <span className="flex items-center"><FaComments className="mr-3" /> Feedback</span>
            <IoIosAddCircle />
          </button>
          <ul className={`mt-2 ${openMenus["feedback"] ? "block" : "hidden"} pl-4 space-y-1`}>
            <li><Link to="/send-feedback" className="hover:text-green-700">Send</Link></li>
            <li><Link to="/feedback" className="hover:text-green-700">User Feedbacks</Link></li>
          </ul>
        </div>

        <div>
          <Link to="/about">
            <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/about") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
              <FaInfoCircle className="mr-3" /> About
            </button>
          </Link>
        </div>
        <div>
          <Link to="/report">
            <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/report") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
              <TbReport className="mr-3" /> Report
            </button>
          </Link>
        </div>
        <div>
          <button
            className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${isActive("/settings") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
            onClick={() => toggleMenu("settings")}
          >
            <span className="flex items-center"><FaCogs className="mr-3" /> Settings</span>
            <IoIosAddCircle />
          </button>
          <ul className={`mt-2 ${openMenus["settings"] ? "block" : "hidden"} pl-4 space-y-3`}>
            <li><Link className="hover:text-green-700" to="/role">Role</Link></li>
            <li><Link className="hover:text-green-700" to="/role-permission">Role Permission</Link></li>
            <li><Link className="hover:text-green-700" to="/block">Add Block</Link></li>
            <li><Link className="hover:text-green-700" to="/union">Add Union</Link></li>
            <li><Link className="hover:text-green-700" to="/upazila">Add Upazila</Link></li>
            <li><Link className="hover:text-green-700" to="/district">Add District</Link></li>
            <li><Link className="hover:text-green-700" to="/division">Add Division</Link></li>
            <li><Link className="hover:text-green-700" to="/region">Add Region</Link></li>
            <li><Link className="hover:text-green-700" to="/csa">Add CSA</Link></li>
            <li><Link className="hover:text-green-700" to="/aez"> Add AEZ</Link></li>
            <li><Link className="hover:text-green-700" to="/hotspot">Add Hotspot</Link></li>
            <li><Link className="hover:text-green-700" to="/weather-parameter"> Add Weather Parameter</Link></li>
            <li><Link className="hover:text-green-700" to="/user">Add User</Link></li>
          </ul>
        </div>

        <div>
          <button
            onClick={logout}
            disabled={loading}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${loading ? "bg-gray-300" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
          >
            <FaSignOutAlt className="mr-3" /> {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
