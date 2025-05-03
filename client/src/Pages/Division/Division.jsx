import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import axios from 'axios'; // Add axios for API requests

const Division = () => {
  const [divisions, setDivisions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDivision, setCurrentDivision] = useState({
    name: ""
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDivisionId, setEditDivisionId] = useState(null);

  // Fetch all divisions on component mount
  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get('https://iinms.brri.gov.bd/api/division/divisions'); // Adjust API endpoint as needed
      setDivisions(response.data.reverse());
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };

  const openAddDivisionModal = () => {
    setCurrentDivision({ name: ""});
    setIsEditMode(false);
    setEditDivisionId(null);
    setModalVisible(true);
  };

  const openEditDivisionModal = (id) => {
    const divisionToEdit = divisions.find((division) => division.id === id);
    if (divisionToEdit) {
      setCurrentDivision(divisionToEdit);
      setIsEditMode(true);
      setEditDivisionId(id);
      setModalVisible(true);
    }
  };

  const saveDivision = async () => {
    if (isEditMode) {
      // Update existing division
      try {
        await axios.put(`https://iinms.brri.gov.bd/api/division/divisions/${editDivisionId}`, currentDivision);
        fetchDivisions(); // Refresh divisions list
      } catch (error) {
        console.error("Error updating division:", error);
      }
    } else {
      // Add new division
      try {
        await axios.post('https://iinms.brri.gov.bd/api/division/divisions', currentDivision);
        fetchDivisions(); // Refresh divisions list
      } catch (error) {
        console.error("Error adding division:", error);
      }
    }
    setModalVisible(false);
    setCurrentDivision({ name: "" });
  };

  const deleteDivision = async (id) => {
    try {
      await axios.delete(`https://iinms.brri.gov.bd/api/division/divisions/${id}`);
      fetchDivisions(); // Refresh divisions list
    } catch (error) {
      console.error("Error deleting division:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* Main Content */}
      <div style={{ padding: "25px", flexGrow: 1, backgroundColor: "#f9fafb" }}>
        <div className="p-6 bg-gray-50 min-h-screen w-[159vh]">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">Division List</h1>
            <div className="flex justify-end mb-4">
              <button onClick={openAddDivisionModal} className="bg-slate-600 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300">
                Add Division
              </button>
            </div>
          </div>
          <table className="w-full border-collapse bg-white rounded shadow-lg">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th className=" px-6 py-3 text-left">#</th>
                <th className=" px-6 py-3 text-left">Name</th>
                <th className=" px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {divisions?.map((division , index) => (
                <tr key={division.id} className="hover:bg-gray-100 border-b">
                  <td className=" px-6 py-3 w-24">{index + 1}</td>
                  <td className=" px-6 py-3">{division.name}</td>
                  <td className=" px-6 py-3 h-full flex gap-4">
                    <button onClick={() => openEditDivisionModal(division.id)} className="text-slate-600 hover:underline">
                      <FaPen />
                    </button>
                    <button onClick={() => deleteDivision(division.id)} className="hover:underline text-red-500">
                      <BiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {modalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
                <h2 className="text-2xl font-bold mb-4 text-center text-black">
                  {isEditMode ? "Edit Division" : "Add Division"}
                </h2>
                <label className="block mb-2 font-medium">Division Name</label>
                <input
                  type="text"
                  value={currentDivision.name}
                  onChange={(e) => setCurrentDivision({ ...currentDivision, name: e.target.value })}
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  placeholder="Enter Division name"
                />
                <div className="flex justify-end gap-4">
                  <button onClick={() => setModalVisible(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                  <button onClick={saveDivision} className="bg-slate-600 text-white px-4 py-2 rounded shadow hover:shadow-lg transition duration-300">
                    Save
                  </button>
                </div>
                <button onClick={() => setModalVisible(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">
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

export default Division;
