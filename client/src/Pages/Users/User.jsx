import { useEffect, useState, useRef } from "react";
import { BiPen } from "react-icons/bi";

const User = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState({ id: null, name: "", role: "", password: "", mobileNumber: "" , roleId: null });
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [searchFarmer, setSearchFarmer] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [showFarmerDropdown, setShowFarmerDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const USERS_API_URL = "https://iinms.brri.gov.bd/api/users";
  const ROLES_API_URL = "https://iinms.brri.gov.bd/api/roles";
  const FARMERS_API_URL = "https://iinms.brri.gov.bd/api/farmers/farmers";

  const farmerInputRef = useRef();
  const roleInputRef = useRef();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await fetch(ROLES_API_URL);
      const data = await response.json();
      setRoles(data);
      setFilteredRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch farmers
  const fetchFarmers = async () => {
    try {
      const response = await fetch(FARMERS_API_URL);
      const data = await response.json();
      setFarmers(data);
      setFilteredFarmers(data.slice(0, 5)); // Show first 5 farmers initially
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchFarmers();
  }, []);

  const openModal = (type, user = { id: null, name: "", role: "", password: "", mobileNumber: "" , roleId: null }) => {
    setModalType(type);
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser({ id: null, name: "", role: "", password: "", mobileNumber: "" , roleId: null });
    setSelectedFarmer(null);
  };

  const handleSave = async () => {
    const { id, name, role, password , roleId} = currentUser;
    const payload = {
      name,
      role,
      password,
      mobileNumber:selectedFarmer?.mobileNumber ,
      farmerId: selectedFarmer?.id || null,
      roleId
    };

    try {
      if (modalType === "add") {
        await fetch(USERS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (modalType === "edit") {
        await fetch(`${USERS_API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      fetchUsers(); // Refresh users list
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${USERS_API_URL}/${id}`, { method: "DELETE" });
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Filter farmers based on search input
  useEffect(() => {
    if (searchFarmer) {
      setFilteredFarmers(
        farmers.filter((farmer) =>
          farmer.name.toLowerCase().includes(searchFarmer.toLowerCase())
        )
      );
    } else {
      setFilteredFarmers(farmers.slice(0, 5)); // Show first 5 if no search input
    }
  }, [searchFarmer, farmers]);

  // Filter roles based on search input
  useEffect(() => {
    if (searchRole) {
      setFilteredRoles(
        roles.filter((role) => role.name.toLowerCase().includes(searchRole.toLowerCase()))
      );
    } else {
      setFilteredRoles(roles); // Show all roles if no search input
    }
  }, [searchRole, roles]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        farmerInputRef.current &&
        !farmerInputRef.current.contains(event.target)
      ) {
        setShowFarmerDropdown(false);
      }
      if (roleInputRef.current && !roleInputRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[166vh] mx-auto p-4 bg-[#f9fafb]">
      <h1 className="text-2xl font-semibold mb-4">User List</h1>
      <button
        className="mb-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
        onClick={() => openModal("add")}
      >
        Add User
      </button>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border border-gray-300">Name</th>
            <th className="text-left px-4 py-2 border border-gray-300">Mobile Number</th>
            <th className="text-left px-4 py-2 border border-gray-300">Role</th>
            <th className="text-left px-4 py-2 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-gray-50">
              <td className="px-4 py-2 border border-gray-300">{user.name}</td>
              <td className="px-4 py-2 border border-gray-300">{user.mobileNumber}</td>
              <td className="px-4 py-2 border border-gray-300">{user.role}</td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => openModal("edit", user)}
                >
                  <BiPen />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 ml-2"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start mt-10 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "add" ? "Add User" : "Edit User"}
            </h2>

            {/* Farmer Name Dropdown */}
            <div className="mb-4 relative" ref={farmerInputRef}>
              <label className="block text-sm font-medium mb-1">Farmer Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-1"
                placeholder="Search farmer"
                value={searchFarmer}
                onFocus={() => setShowFarmerDropdown(true)}
                onChange={(e) => setSearchFarmer(e.target.value)}
              />
              {showFarmerDropdown && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow-lg max-h-40 overflow-y-auto">
                  {filteredFarmers.map((farmer, index) => (
                    <li
                      key={index}
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                        selectedFarmer?.name === farmer.name ? "bg-gray-200" : ""
                      }`}
                      onClick={() => {
                        setSelectedFarmer(farmer);
                        setCurrentUser({ ...currentUser, name: farmer.name });
                        setSearchFarmer(farmer.name);
                        setShowFarmerDropdown(false);
                      }}
                    >
                      {farmer.name}
                    </li>
                  ))}
                  {filteredFarmers.length === 0 && (
                    <li className="px-3 py-2 text-gray-500">No farmers found</li>
                  )}
                </ul>
              )}
            </div>

            {/* Role Dropdown */}
            <div className="mb-4 relative" ref={roleInputRef}>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-1"
                placeholder="Search role"
                value={searchRole}
                onFocus={() => setShowRoleDropdown(true)}
                onChange={(e) => setSearchRole(e.target.value)}
              />
              {showRoleDropdown && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow-lg max-h-40 overflow-y-auto">
                  {filteredRoles.map((role, index) => (
                    <li
                      key={index}
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                        currentUser.role === role.name ? "bg-gray-200" : ""
                      }`}
                      onClick={() => {
                        setCurrentUser({ ...currentUser, role: role.name , roleId: role.id });
                        setSearchRole(role.name);
                        setShowRoleDropdown(false);
                      }}
                    >
                      {role.name}
                    </li>
                  ))}
                  {filteredRoles.length === 0 && (
                    <li className="px-3 py-2 text-gray-500">No roles found</li>
                  )}
                </ul>
              )}
            </div>
            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Enter password"
                value={currentUser.password}
                onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
