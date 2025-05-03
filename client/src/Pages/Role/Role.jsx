import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Role = () => {
    const [roles, setRoles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRole, setCurrentRole] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editRoleId, setEditRoleId] = useState(null);

    const API_URL = "https://iinms.brri.gov.bd/api/roles"; // Update with your API base URL

    // Fetch roles from API
    const fetchRoles = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    // Add or Edit a role
    const saveRole = async () => {
        const method = isEditMode ? "PUT" : "POST";
        const url = isEditMode ? `${API_URL}/${editRoleId}` : API_URL;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: currentRole }),
            });

            if (response.ok) {
                fetchRoles(); // Refresh the list
                setModalVisible(false);
                setCurrentRole("");
            } else {
                console.error("Error saving role:", await response.json());
            }
        } catch (error) {
            console.error("Error saving role:", error);
        }
    };

    // Delete a role
    const deleteRole = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (response.ok) {
                fetchRoles(); // Refresh the list
            } else {
                console.error("Error deleting role:", await response.json());
            }
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    };

    // Open Add Role Modal
    const openAddRoleModal = () => {
        setCurrentRole("");
        setIsEditMode(false);
        setEditRoleId(null);
        setModalVisible(true);
    };

    // Open Edit Role Modal
    const openEditRoleModal = (id) => {
        const roleToEdit = roles.find((role) => role.id === id);
        if (roleToEdit) {
            setCurrentRole(roleToEdit.name);
            setIsEditMode(true);
            setEditRoleId(id);
            setModalVisible(true);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
            {/* Main Content */}
            <div
                style={{
                    flexGrow: 1,
                    backgroundColor: "#f9fafb",
                }}
            >
                <div className="p-6 bg-gray-50 min-h-screen w-full">
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-bold mb-6 text-center text-black">
                            Role Management
                        </h1>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={openAddRoleModal}
                                className="bg-slate-600 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300"
                            >
                                Add Role
                            </button>
                        </div>
                    </div>

                    <table className="w-full border-collapse bg-white rounded shadow-lg">
                        <thead className="bg-slate-600 text-white">
                            <tr>
                                <th className="border-b  px-6 py-3 text-left">ID</th>
                                <th className="border-b px-6 py-3 text-left">Name</th>
                                <th className="border-b px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role ,i) => (
                                <tr key={role.id} className="hover:bg-gray-100">
                                    <td className="border-b px-6 py-3">{i + 1}</td>
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
                                            className="text-red-600 hover:underline"
                                        >
                                           <MdDelete/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Modal */}
                    {modalVisible && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-lg shadow-lg w-full md:w-1/3 lg:w-1/3 p-6 relative">
                                <h2 className="text-2xl font-bold mb-4 text-center text-black">
                                    {isEditMode ? "Edit Role" : "Add Role"}
                                </h2>
                                <label className="block mb-2 font-medium">Role Name</label>
                                <input
                                    type="text"
                                    value={currentRole}
                                    onChange={(e) => setCurrentRole(e.target.value)}
                                    className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                                    placeholder="Enter role name"
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

export default Role;
