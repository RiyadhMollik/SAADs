import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa"; 
import { BiTrash } from "react-icons/bi";
import axios from 'axios'; // Add axios for API requests

const Upazila = () => {
    const [upazilas, setUpazilas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUpazila, setCurrentUpazila] = useState({ name: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUpazilaId, setEditUpazilaId] = useState(null);

    // Fetch all upazilas on component mount
    useEffect(() => {
        fetchUpazilas();
    }, []);

    const fetchUpazilas = async () => {
        try {
            const response = await axios.get('https://iinms.brri.gov.bd/api/upazila/upazilas'); // Adjust API endpoint as needed
            setUpazilas(response.data.reverse());   
        } catch (error) {
            console.error("Error fetching upazilas:", error);
        }
    };

    const openAddUpazilaModal = () => {
        setCurrentUpazila({ name: ""});
        setIsEditMode(false);
        setEditUpazilaId(null);
        setModalVisible(true);
    };

    const openEditUpazilaModal = (id) => {
        const upazilaToEdit = upazilas.find((upazila) => upazila.id === id);
        if (upazilaToEdit) {
            setCurrentUpazila(upazilaToEdit);
            setIsEditMode(true);
            setEditUpazilaId(id);
            setModalVisible(true);
        }
    };

    const saveUpazila = async () => {
        if (isEditMode) {
            // Update existing upazila
            try {
                await axios.put(`https://iinms.brri.gov.bd/api/upazila/upazilas/${editUpazilaId}`, currentUpazila);
                fetchUpazilas(); // Refresh upazilas list
            } catch (error) {
                console.error("Error updating upazila:", error);
            }
        } else {
            // Add new upazila
            try {
                await axios.post('https://iinms.brri.gov.bd/api/upazila/upazilas', currentUpazila);
                fetchUpazilas(); // Refresh upazilas list
            } catch (error) {
                console.error("Error adding upazila:", error);
            }
        }
        setModalVisible(false);
        setCurrentUpazila({ name: "", latitude: "", longitude: "" });
    };

    const deleteUpazila = async (id) => {
        try {
            await axios.delete(`https://iinms.brri.gov.bd/api/upazila/upazilas/${id}`);
            fetchUpazilas(); // Refresh upazilas list
        } catch (error) {
            console.error("Error deleting upazila:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            {/* Main Content */}
            <div
                style={{
                    padding: "25px",
                    flexGrow: 1,
                    backgroundColor: "#f9fafb",
                }}
            >
                <div className="p-6 bg-gray-50 min-h-screen w-[159vh]">
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-bold mb-6 text-center text-black">
                            Upazila List
                        </h1>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={openAddUpazilaModal}
                                className="bg-slate-600 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300"
                            >
                                Add Upazila
                            </button>
                        </div>
                    </div>

                    <table className="w-full border-collapse bg-white rounded shadow-lg">
                        <thead className="bg-slate-700 text-white">
                            <tr >
                                <th className=" px-6 py-3 text-left">#</th>
                                <th className=" px-6 py-3 text-left">Name</th>
                                <th className=" px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upazilas?.map((upazila , index) => (
                                <tr key={upazila.id} className="hover:bg-gray-100 border-b">
                                    <td className=" px-6 py-3 w-24">{index + 1}</td>
                                    <td className=" px-6 py-3">{upazila.name}</td>
                                    <td className=" px-6 py-3 h-full flex gap-4">
                                        <button
                                            onClick={() => openEditUpazilaModal(upazila.id)}
                                            className="text-slate-600 hover:underline"
                                        >
                                            <FaPen />
                                        </button>
                                        <button
                                            onClick={() => deleteUpazila(upazila.id)}
                                            className="hover:underline text-red-500"
                                        >
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
                                    {isEditMode ? "Edit Upazila" : "Add Upazila"}
                                </h2>
                                <label className="block mb-2 font-medium">Upazila Name</label>
                                <input
                                    type="text"
                                    value={currentUpazila.name}
                                    onChange={(e) => setCurrentUpazila({ ...currentUpazila, name: e.target.value })}
                                    className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                                    placeholder="Enter Upazila name"
                                />
                                
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setModalVisible(false)}
                                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveUpazila}
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

export default Upazila;
