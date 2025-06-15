import { useState, useEffect } from "react";
import { FaPen, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import axios from "axios";

const Region = () => {
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRegion, setCurrentRegion] = useState({ name: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRegionId, setEditRegionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await axios.get("https://iinms.brri.gov.bd/api/region/regions");
      const data = response.data.reverse();
      setRegions(data);
      setFilteredRegions(data);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const openAddRegionModal = () => {
    setCurrentRegion({ name: "" });
    setIsEditMode(false);
    setEditRegionId(null);
    setModalVisible(true);
  };

  const openEditRegionModal = (id) => {
    const regionToEdit = regions.find((region) => region.id === id);
    if (regionToEdit) {
      setCurrentRegion(regionToEdit);
      setIsEditMode(true);
      setEditRegionId(id);
      setModalVisible(true);
    }
  };

  const saveRegion = async () => {
    if (isEditMode) {
      try {
        await axios.put(`https://iinms.brri.gov.bd/api/region/regions/${editRegionId}`, currentRegion);
        fetchRegions();
      } catch (error) {
        console.error("Error updating region:", error);
      }
    } else {
      try {
        await axios.post("https://iinms.brri.gov.bd/api/region/regions", currentRegion);
        fetchRegions();
      } catch (error) {
        console.error("Error adding region:", error);
      }
    }
    setModalVisible(false);
    setCurrentRegion({ name: "" });
  };

  const deleteRegion = async (id) => {
    try {
      await axios.delete(`https://iinms.brri.gov.bd/api/region/regions/${id}`);
      fetchRegions();
    } catch (error) {
      console.error("Error deleting region:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = regions.filter((region) =>
      region.name.toLowerCase().includes(query)
    );
    setFilteredRegions(filtered);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedRegions = [...filteredRegions].sort((a, b) => {
      if (key === "index") {
        return direction === "asc" ? a.id - b.id : b.id - a.id;
      }
      if (key === "name") {
        return direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
    setFilteredRegions(sortedRegions);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ padding: "25px", flexGrow: 1, backgroundColor: "#f9fafb" }}>
        <div className="p-6 bg-gray-50 min-h-screen w-[159vh]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-center text-black">Region List</h1>
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by region name..."
                className="border px-4 py-2 rounded focus:outline-none focus:ring-2"
              />
              <button
                onClick={openAddRegionModal}
                className="bg-slate-600 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300"
              >
                Add Region
              </button>
            </div>
          </div>
          <table className="w-full max-w-[160vh] border-collapse bg-white rounded shadow-lg">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left cursor-pointer " onClick={() => handleSort("index")}>
                 <p className="flex gap-5"> # {getSortIcon("index")}</p>
                </th>
                <th className="px-6 py-3 text-left cursor-pointer flex gap-5" onClick={() => handleSort("name")}>
                  Name {getSortIcon("name")}
                </th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegions?.map((region, index) => (
                <tr key={region.id} className="hover:bg-gray-100 border-b">
                  <td className="px-6 py-3 w-24">{index + 1}</td>
                  <td className="px-6 py-3">{region.name}</td>
                  <td className="px-6 py-3 h-full flex gap-4">
                    <button
                      onClick={() => openEditRegionModal(region.id)}
                      className="text-slate-600 hover:underline"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => deleteRegion(region.id)}
                      className="hover:underline text-red-500"
                    >
                      <BiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {modalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
                <h2 className="text-2xl font-bold mb-4 text-center text-black">
                  {isEditMode ? "Edit Region" : "Add Region"}
                </h2>
                <label className="block mb-2 font-medium">Region Name</label>
                <input
                  type="text"
                  value={currentRegion.name}
                  onChange={(e) =>
                    setCurrentRegion({ ...currentRegion, name: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  placeholder="Enter Region name"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setModalVisible(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveRegion}
                    className="bg-slate-600 text-white px-4 py-2 rounded shadow hover:shadow-lg transition duration-300"
                  >
                    Save
                  </button>
                </div>
                <button
                  onClick={() => setModalVisible(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Region;