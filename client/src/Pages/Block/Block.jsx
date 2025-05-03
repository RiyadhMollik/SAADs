import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";

const Block = () => {
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [data, setData] = useState({});
  const [selectedHotspot, setSelectedHotspot] = useState("");
  const [region, setRegion] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [union, setUnion] = useState("");
  const [block, setBlock] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Fetch blocks from the backend
  const fetchBlocks = async () => {
    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/bloks/blocks");
      const data = await response.json();
      setRoles(data.reverse());
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/data");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  }
  // Fetch blocks when the component mounts
  useEffect(() => {
    fetchBlocks();
    fetchData();
  }, []);

  const openAddRoleModal = () => {
    setIsEditMode(false);
    setEditRoleId(null);
    setModalVisible(true);

    // Reset all state variables to empty values when adding a new role
    setSelectedHotspot('');
    setRegion('');
    setDivision('');
    setDistrict('');
    setUpazila('');
    setUnion('');
    setBlock('');
    setLatitude('');
    setLongitude('');
  };


  const openEditRoleModal = (id) => {
    const roleToEdit = roles.find((role) => role.id === id);
    if (roleToEdit) {
      setIsEditMode(true); // Set to Edit mode
      setEditRoleId(id); // Set the ID of the role being edited

      // Prepopulate the form with the role data
      setModalVisible(true);
      setSelectedHotspot(roleToEdit.hotspot);
      setRegion(roleToEdit.region);
      setDivision(roleToEdit.division);
      setDistrict(roleToEdit.district);
      setUpazila(roleToEdit.upazila);
      setUnion(roleToEdit.union);
      setBlock(roleToEdit.block);
      setLatitude(roleToEdit.latitude);
      setLongitude(roleToEdit.longitude);
    }
  };


  const saveRole = async () => {
    if (isEditMode) {
      // Update existing block
      try {
        const response = await fetch(`https://iinms.brri.gov.bd/api/bloks/blocks/${editRoleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block, latitude, longitude, hotspot: selectedHotspot,  region, division, district, upazila, union }),
        });
        const updatedRole = await response.json();
        setRoles((prevRoles) =>
          prevRoles.map((role) => (role.id === editRoleId ? updatedRole : role))
        );
      } catch (error) {
        console.error("Error updating block:", error);
      }
    } else {
      // Add new block
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/bloks/blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block, latitude, longitude, hotspot: selectedHotspot,  region, division, district, upazila, union }),
        });
        const newBlock = await response.json();
        fetchBlocks();
      } catch (error) {
        console.error("Error adding block:", error);
      }
    }

    setModalVisible(false);
  };

  const deleteRole = async (id) => {
    try {
      await fetch(`https://iinms.brri.gov.bd/api/bloks/blocks/${id}`, {
        method: "DELETE",
      });
      setRoles(roles.filter((role) => role.id !== id));
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div >
        <div className="p-6 bg-gray-50 min-h-screen w-full">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">Block List</h1>
            <div className="flex justify-end mb-4">
              <button
                onClick={openAddRoleModal}
                className="bg-slate-600 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300"
              >
                Add Block
              </button>
            </div>
          </div>

          <div className="max-w-[160vh]  overflow-x-scroll">
            <table className="w-full border-collapse bg-white rounded shadow-lg ">
              <thead className="bg-slate-700 text-white">
                <tr>
                  <th className="border-b px-6 py-3 text-left">#</th>
                  <th className="border-b px-6 py-3 text-left">Block</th>
                  <th className="border-b px-6 py-3 text-left">Hotspot</th>
                  <th className="border-b px-6 py-3 text-left">Region</th>
                  <th className="border-b px-6 py-3 text-left">Division</th>
                  <th className="border-b px-6 py-3 text-left">District</th>
                  <th className="border-b px-6 py-3 text-left">Upazila</th>
                  <th className="border-b px-6 py-3 text-left">Union</th>
                  <th className="border-b px-6 py-3 text-left">Latitude</th>
                  <th className="border-b px-6 py-3 text-left">Longitude</th>
                  <th className="border-b px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role , index) => (
                  <tr key={role.id} className="hover:bg-gray-100">
                    <td className="border-b px-6 py-3 w-24">{index + 1}</td>
                    <td className="border-b px-6 py-3">{role.block}</td>
                    <td className="border-b px-6 py-3">{role.hotspot}</td>
                    <td className="border-b px-6 py-3">{role.region}</td>
                    <td className="border-b px-6 py-3">{role.division}</td>
                    <td className="border-b px-6 py-3">{role.district}</td>
                    <td className="border-b px-6 py-3">{role.upazila}</td>
                    <td className="border-b px-6 py-3">{role.union}</td>
                    <td className="border-b px-6 py-3">{role.latitude}</td>
                    <td className="border-b px-6 py-3">{role.longitude}</td>
                    <td className="border-b px-6 py-3 h-full flex gap-4">
                      <button
                        onClick={() => openEditRoleModal(role.id)}
                        className="text-slate-600 hover:underline"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => deleteRole(role.id)}
                        className="hover:underline text-red-500"
                      >
                        <BiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* Modal */}
          {modalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative  max-h-[600px] z-[999999] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-center text-black">
                  {isEditMode ? "Edit Block" : "Add Block"}
                </h2>
                <label className="block mb-2 font-medium">Hotspot</label>
                <select
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  value={selectedHotspot}
                  onChange={(e) => setSelectedHotspot(e.target.value)}
                >
                  <option value="">Select Hotspot</option>
                  {data?.hotspots?.map((hotspot) => (
                    <option key={hotspot.id} value={hotspot.name}>
                      {hotspot.name}
                    </option>
                  ))}
                </select>
                {/* Region */}
                <label className="block mb-2 font-medium">Region</label>
                <select
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="">Select Region</option>
                  {data.regions.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {/* Division */}
                <label className="block mb-2 font-medium">Division</label>
                <select
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                >
                  <option value="">Select Division</option>
                  {data.divisions.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {/* District */}
                <label className="block mb-2 font-medium">District</label>
                <select
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  <option value="">Select District</option>
                  {data.districts.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {/* Upazila */}
                <label className="block mb-2 font-medium">Upazila</label>
                <select
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                >
                  <option value="">Select Upazila</option>
                  {data.upazilas.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {/* Union */}
                <label className="block mb-2 font-medium">Union</label>
                <select
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  value={union}
                  onChange={(e) => setUnion(e.target.value)}
                >
                  <option value="">Select Union</option>
                  {data.unions.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <label className="block mb-2 font-medium">Block </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  placeholder="Enter Block name"
                />
                <label className="block mb-2 font-medium">Latitude</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  placeholder="Enter Latitude"
                />
                <label className="block mb-2 font-medium">Longitude</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  placeholder="Enter Longitude"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setModalVisible(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveRole}
                    className="bg-slate-600 text-white px-4 py-2 rounded shadow hover:shadow-lg transition duration-300"
                  >
                    Save
                  </button>
                </div>
                <button
                  onClick={() => setModalVisible(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Block;
