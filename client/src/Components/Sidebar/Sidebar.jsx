import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { FaTachometerAlt, FaCloudSun, FaWater, FaSignOutAlt, FaClipboardList, FaCogs, FaArchive, FaComments, FaInfoCircle, FaPumpSoap, FaSeedling, FaCloud, FaLeaf, FaTint, FaGasPump, FaLock, FaDisease, FaUser, FaPhone } from "react-icons/fa";
import { IoIosAddCircle, IoMdSwitch } from "react-icons/io";
import logo from "../../assets/brri.png";
import useLogout from "../../Hook/useLogout";
import { AuthContext } from "../context/AuthProvider";
import { TbReport } from "react-icons/tb";
import { GoArrowSwitch } from "react-icons/go";
import { WiSmallCraftAdvisory } from "react-icons/wi";

const Sidebar = () => {
  const { logout, loading } = useLogout();
  const [openMenus, setOpenMenus] = useState({});
  const { authUser, isslider, setIsslider, rolePermission } = useContext(AuthContext);
  const location = useLocation();
  const [isHidden, setIsHidden] = useState(false);

  // Toggle menu visibility
  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Check if the link is active
  const isActive = (path) => location.pathname.startsWith(path);

  // Handle mouse enter and leave events for hover functionality
  const handleMouseEnter = () => {
    if (isHidden) {
      setIsHidden(false); // Set to false when mouse enters
    }
  };

  const handleMouseLeave = () => {
    if (isHidden) {
      setIsHidden(true); // Set back to true when mouse leaves
    }
  };
  console.log(rolePermission);

  return (
    <div
      className={`${isHidden ? "w-fit" : "w-72"} h-screen bg-white text-gray-800 shadow-lg fixed lg:sticky md:sticky top-0 transition-all duration-300 z-[1000] ${isslider ? 'left-0' : 'left-[-360px]'
        } flex flex-col overflow-y-auto font-montserrat font-extralight`}
      onMouseEnter={handleMouseEnter}  // Trigger on hover
      onMouseLeave={handleMouseLeave}  // Trigger when hover ends
      onMouseOut={handleMouseLeave}
    >
      <div className="flex flex-col justify-center items-center px-4 py-5 border-b relative">
        <GoArrowSwitch onClick={() => setIsHidden(!isHidden)} className={`text-3xl hidden md:block lg:block ml-auto cursor-pointer absolute ${isHidden ? "top-0 mb-2" : " top-4"} right-4 bg-slate-300 m-2 rounded-full p-2`} />
        <img src={logo} alt="Logo" className={`w-12 h-12 rounded-full mr-4 ${isHidden ? "hidden" : ""}`} />
        <h2 className={`text-xl font-bold text-center ml-[-14px] ${isHidden ? "hidden" : ""}`}>SAADS</h2>
        <p className={`text-center text-[9px]  ${isHidden ? "hidden" : ""}`}>Smart Agro-Advisory Dissemination System</p>
        <RxCross2 className="text-2xl ml-auto cursor-pointer absolute top-4 right-4 md:hidden lg:hidden" onClick={() => setIsslider(false)} />
      </div>

      <div className="flex flex-col px-4 space-y-4 mt-4">
        <Link to="/" onClick={() => setIsslider(false)}>
          <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
            <FaTachometerAlt className="mr-3 text-lg" /> {isHidden ? "" : "Dashboard"}
          </button>
        </Link>

        <div>
          <button
            className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${isActive("/registration") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
            onClick={() => toggleMenu("registration")}
          >
            <span className="flex items-center"><FaClipboardList className="mr-3" /> {isHidden ? "" : "Registration"}</span>
            {isHidden ? '' : <IoIosAddCircle />}
          </button>
          <ul className={`mt-2 ${openMenus.registration ? "block" : "hidden"} pl-4 space-y-1`}>
            {(rolePermission && rolePermission["AD List"]) && (
              <li><Link onClick={() => setIsslider(false)} to="/ad-registration" className="hover:text-green-700">AD</Link></li>
            )}
            {(rolePermission && rolePermission["DD List"]) && (
              <li><Link onClick={() => setIsslider(false)} to="/admin-registration" className="hover:text-green-700">DD</Link></li>
            )}
            {(rolePermission && rolePermission["UAO List"]) && (
              <li><Link onClick={() => setIsslider(false)} to="/uao-registration" className="hover:text-green-700">UAO</Link></li>
            )}
            {(rolePermission && rolePermission["SAAO List"]) && (
              <li><Link onClick={() => setIsslider(false)} to="/saao-registration" className="hover:text-green-700">SAAO</Link></li>
            )}
            {(rolePermission && rolePermission["Farmer List"]) && (
              <li>
                <Link onClick={() => setIsslider(false)} to="/farmer-registration" className="hover:text-green-700">
                  Farmer
                </Link>
              </li>
            )}
            {(rolePermission && rolePermission["Scientist List"]) && (
              <li>
                <Link onClick={() => setIsslider(false)} to="/scientist-registration" className="hover:text-green-700">
                  Scientist
                </Link>
              </li>
            )}
            {(rolePermission && rolePermission["Journalist List"]) && (
              <li>
                <Link onClick={() => setIsslider(false)} to="/journalists-registration" className="hover:text-green-700">
                  Journalists
                </Link>
              </li>
            )}

          </ul>
        </div>

        {/* {(rolePermission && rolePermission["Report"]) && (
          <div>
            <Link onClick={() => setIsslider(false)} to="/report">
              <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/report") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
                <TbReport className="mr-3" /> {isHidden ? "" : "Report"}
              </button>
            </Link>
          </div>
        )} */}
        {(rolePermission && rolePermission["Diseases List"]) && (
          <Link to="/advisory" onClick={() => setIsslider(false)}>
            <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/advisory") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
              <WiSmallCraftAdvisory className="mr-3 text-lg" /> {isHidden ? "" : "Advisory"}
            </button>
          </Link>
        )}
        {(rolePermission && rolePermission["Diseases List"]) && (
          <Link to="/call-center" onClick={() => setIsslider(false)}>
            <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/call-center") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
              <FaPhone className="mr-3 text-lg" /> {isHidden ? "" : "Call Center"}
            </button>
          </Link>
        )}
        {(rolePermission && rolePermission["Diseases List"]) && (
          <Link to="/diseases-survey" onClick={() => setIsslider(false)}>
            <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/diseases-survey") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
              <FaDisease className="mr-3 text-lg" /> {isHidden ? "" : "Disease Survey"}
            </button>
          </Link>
        )}

        {(rolePermission && rolePermission["Diseases List"]) && (
          <Link to="/growth-stage-survey" onClick={() => setIsslider(false)}>
            <button className={`flex items-center w-full px-2 py-2 rounded-lg ${isActive("/growth-stage-survey") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
              <FaDisease className="mr-3 text-lg" /> {isHidden ? "" : "Growth Stage Survey"}
            </button>
          </Link>
        )}
        {(rolePermission && rolePermission["Diseases List"]) && (
          <Link to="/insect-pests" onClick={() => setIsslider(false)}>
            <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/insect-pests") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
              <FaDisease className="mr-3 text-lg" /> {isHidden ? "" : "Insect Pest Survey"}
            </button>
          </Link>
        )}
        {(rolePermission && rolePermission["Report"]) && (
          <div>
            <button
              className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${isActive("/report") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
              onClick={() => toggleMenu("report")}
            >
              <span className="flex items-center"><TbReport className="mr-3" />  {isHidden ? "" : "Report"}</span>
              {isHidden ? '' : <IoIosAddCircle />}
            </button>
            <ul className={`mt-2 ${openMenus["report"] ? "block" : "hidden"} pl-4 space-y-1`}>
              {(rolePermission && rolePermission["Send Feedback"]) && (
                <li><Link onClick={() => setIsslider(false)} to="/report" className="hover:text-green-700">Performance Reports</Link></li>
              )}
              {(rolePermission && rolePermission["Feedback Table"]) && (
                <li><Link onClick={() => setIsslider(false)} to="/area-report" className="hover:text-green-700"> Area-wise</Link></li>
              )}
              {(rolePermission && rolePermission["Feedback Table"]) && (
                <li><Link onClick={() => setIsslider(false)} to="/field-report" className="hover:text-green-700">union wise</Link></li>
              )}
              {(rolePermission && rolePermission["Feedback Table"]) && (
                <li><Link onClick={() => setIsslider(false)} to="/saao-report" className="hover:text-green-700">SAAO Reports</Link></li>
              )}
            </ul>
          </div>
        )}
        {(rolePermission && rolePermission["Feedback"]) && (
          <div>
            <button
              className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${isActive("/feedback") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
              onClick={() => toggleMenu("feedback")}
            >
              <span className="flex items-center"><FaComments className="mr-3" /> {isHidden ? "" : "Feedback"}</span>
              {isHidden ? '' : <IoIosAddCircle />}
            </button>
            <ul className={`mt-2 ${openMenus["feedback"] ? "block" : "hidden"} pl-4 space-y-1`}>
              {(rolePermission && rolePermission["Send Feedback"]) && (
                <li><Link onClick={() => setIsslider(false)} to="/send-feedback" className="hover:text-green-700">Send</Link></li>
              )}
              {(rolePermission && rolePermission["Feedback Table"]) && (
                <li><Link onClick={() => setIsslider(false)} to="/feedback" className="hover:text-green-700">User Feedbacks</Link></li>
              )}
            </ul>
          </div>
        )}

        <div>
          <Link onClick={() => setIsslider(false)} to="/about">
            <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/about") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
              <FaInfoCircle className="mr-3" /> {isHidden ? "" : "About"}
            </button>
          </Link>
        </div>

        {
          authUser?.role?.toLowerCase() === "saao" && (
            <div>
              <Link onClick={() => setIsslider(false)} to="/update-password">
                <button className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive("/update-password") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}>
                  <FaLock className="mr-3" /> {isHidden ? "" : "Change Password"}
                </button>
              </Link>
            </div>
          )

        }

        {
          authUser?.role?.toLowerCase() !== "saao" && (
            <div>
              <button
                className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${isActive("/settings") ? "bg-green-700 text-white" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
                onClick={() => toggleMenu("settings")}
              >
                <span className="flex items-center"><FaCogs className="mr-3" /> {isHidden ? "" : "Settings"}</span>
                {isHidden ? '' : <IoIosAddCircle />}
              </button>
              <ul className={`mt-2 ${openMenus["settings"] ? "block" : "hidden"} pl-4 space-y-3`}>

                {(rolePermission && rolePermission["Add Region"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/region">Add Region</Link></li>
                )}
                {(rolePermission && rolePermission["Add Hotspot"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/hotspot">Add Hotspot</Link></li>
                )}
                {(rolePermission && rolePermission["Add Division"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/division">Add Division</Link></li>
                )}
                {(rolePermission && rolePermission["Add District"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/district">Add District</Link></li>
                )}
                {(rolePermission && rolePermission["Add Upazela"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/upazila">Add Upazila</Link></li>
                )}
                {(rolePermission && rolePermission["Add Union"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/union">Add Union</Link></li>
                )}
                {(rolePermission && rolePermission["Add Block"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/block">Add Block</Link></li>
                )}
                {(rolePermission && rolePermission["Add User"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/user">Add User</Link></li>
                )}

                {(rolePermission && rolePermission["Change Password"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/update-password">Change Password</Link></li>
                )}
                {(rolePermission && rolePermission["Roles"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/role">Role</Link></li>
                )}
                {(rolePermission && rolePermission["Permissions"]) && (
                  <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/role-permission">Role Permission</Link></li>
                )}

                {/* <li><Link onClick={() => setIsslider(false)} className="hover:text-green-700" to="/weather-parameter"> Add Weather Parameter</Link></li> */}

              </ul>
            </div>
          )
        }
        {(rolePermission && rolePermission["Profile"]) && (
          <div>
            <Link onClick={() => setIsslider(false)} to="/profile">
              <button
                className={`flex items-center w-full px-4 py-2 rounded-lg ${loading ? "bg-gray-300" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
              >
                <FaUser className="mr-3" /> {isHidden ? "" : "Profile"}
              </button>
            </Link>
          </div>
        )}
        <div>
          <button
            onClick={logout}
            disabled={loading}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${loading ? "bg-gray-300" : "bg-gray-100 hover:bg-green-700 hover:text-white"}`}
          >
            <FaSignOutAlt className="mr-3" /> {isHidden ? "" : `${loading ? "Logging out..." : "Logout"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
