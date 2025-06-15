import axios from "axios";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { FaPen, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const Hotspot = () => {
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRole, setCurrentRole] = useState("");
    const [currentDistricts, setCurrentDistricts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editRoleId, setEditRoleId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    // Base API URL
    const API_URL = "https://iinms.brri.gov.bd/api/hotspots";

    // Fetch all hotspots
    const fetchRoles = async () => {
        try {
            const response = await axios.get(API_URL);
            const data = response.data.reverse();
            setRoles(data);
            setFilteredRoles(data);
        } catch (error) {
            console.error("Error fetching hotspots:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // Add or update a hotspot
    const saveRole = async () => {
        const payload = { name: currentRole, district: currentDistricts };

        try {
            if (isEditMode) {
                // Update existing hotspot
                await axios.put(`${API_URL}/${editRoleId}`, payload);
            } else {
                // Add new hotspot
                await axios.post(API_URL, payload);
            }
            fetchRoles();
        } catch (error) {
            console.error("Error saving hotspot:", error);
        }

        setModalVisible(false);
        resetModal();
    };

    // Delete a hotspot
    const deleteRole = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchRoles();
        } catch (error) {
            console.error("Error deleting hotspot:", error);
        }
    };

    const openAddRoleModal = () => {
        resetModal();
        setModalVisible(true);
    };

    const openEditRoleModal = (id) => {
        const roleToEdit = roles.find((role) => role.id === id);
        if (roleToEdit) {
            setCurrentRole(roleToEdit.name);
            setCurrentDistricts(roleToEdit.district);
            setIsEditMode(true);
            setEditRoleId(id);
            setModalVisible(true);
        }
    };

    const resetModal = () => {
        setCurrentRole("");
        setCurrentDistricts([]);
        setSearchQuery("");
        setIsEditMode(false);
        setEditRoleId(null);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = roles.filter((role) =>
            role.name.toLowerCase().includes(query)
        );
        setFilteredRoles(filtered);
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedRoles = [...filteredRoles].sort((a, b) => {
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
        setFilteredRoles(sortedRoles);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort />;
        return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-[159vh]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-center text-black">Hotspot List</h1>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search by hotspot name..."
                        className="border px-4 py-2 rounded focus:outline-none focus:ring-2"
                    />
                    <button
                        onClick={openAddRoleModal}
                        className="bg-slate-600 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300"
                    >
                        Add Hotspot
                    </button>
                </div>
            </div>

            <table className="w-full max-w-[160vh] border-collapse bg-white rounded shadow-lg">
                <thead className="bg-slate-700 text-white">
                    <tr>
                        <th
                            className="border border-gray-300 px-4 py-2 cursor-pointer"
                            onClick={() => handleSort("index")}
                        >
                            <p className="flex items-center gap-5"> # {getSortIcon("index")}</p>
                        </th>
                        <th
                            className="border border-gray-300 px-4 py-2 cursor-pointer"
                            onClick={() => handleSort("name")}
                        >
                            <p className="flex items-center gap-5"> Hotspot Name {getSortIcon("name")}</p>

                        </th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRoles.map((role, index) => (
                        <tr key={role.id} className="hover:bg-gray-100">
                            <td className="border-b px-6 py-3 w-24">{index + 1}</td>
                            <td className="border-b px-6 py-3">{role.name}</td>
                            <td className="border-b px-6 py-3 flex gap-4">
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

            {modalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            {isEditMode ? "Edit Hotspot" : "Add Hotspot"}
                        </h2>
                        <label className="block mb-2 font-medium">Hotspot Name</label>
                        <input
                            type="text"
                            value={currentRole}
                            onChange={(e) => setCurrentRole(e.target.value)}
                            className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                            placeholder="Enter Hotspot name"
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setModalVisible(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveRole}
                                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:shadow-lg transition duration-300"
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
    );
};

export default Hotspot;