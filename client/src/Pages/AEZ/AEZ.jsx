import axios from "axios";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { FaPen } from "react-icons/fa";

const AEZ = () => {
    const [roles, setRoles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRole, setCurrentRole] = useState("");
    const [currentDistricts, setCurrentDistricts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editRoleId, setEditRoleId] = useState(null);

    // Base API URL
    const API_URL = "https://iinms.brri.gov.bd/api/aezs"; // Changed endpoint for AEZ

    // Fetch all AEZs
    const fetchRoles = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setRoles(data.reverse());
        } catch (error) {
            console.error("Error fetching AEZs:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // Add or update an AEZ
    const saveRole = async () => {
        const payload = { name: currentRole, district: currentDistricts };

        try {
            if (isEditMode) {
                // Update existing AEZ
                await fetch(`${API_URL}/${editRoleId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                // Add new AEZ
                await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }
            fetchRoles();
        } catch (error) {
            console.error("Error saving AEZ:", error);
        }

        setModalVisible(false);
        resetModal();
    };

    // Delete an AEZ
    const deleteRole = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            fetchRoles();
        } catch (error) {
            console.error("Error deleting AEZ:", error);
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-[159vh] max-w-[150vh]">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-6 text-center text-black">AEZ List</h1>
                <button
                    onClick={openAddRoleModal}
                    className="bg-slate-600 mb-5 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300"
                >
                    Add AEZ
                </button>
            </div>

            <table className="w-full border-collapse bg-white rounded shadow-lg">
                <thead className="bg-slate-700 text-white">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">#</th>
                        <th className="border border-gray-300 px-4 py-2">AEZ Name</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role , index) => (
                        <tr key={role.id} className="hover:bg-gray-100">
                            <td className="border-b px-6 py-3 w-24">{index + 1}</td>
                            <td className="border-b px-6 py-3">{role.name}</td>
                            <td className="border-b px-6 py-3 flex gap-4">
                                <button onClick={() => openEditRoleModal(role.id)} className="text-slate-600 hover:underline">
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
                        <h2 className="text-2xl font-bold mb-4 text-center">{isEditMode ? "Edit AEZ" : "Add AEZ"}</h2>
                        <label className="block mb-2 font-medium">AEZ Name</label>
                        <input
                            type="text"
                            value={currentRole}
                            onChange={(e) => setCurrentRole(e.target.value)}
                            className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                            placeholder="Enter AEZ name"
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
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AEZ;
