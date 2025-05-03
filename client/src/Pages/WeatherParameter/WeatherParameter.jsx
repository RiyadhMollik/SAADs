import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";

const WeatherParameter = () => {
    const [parameters, setParameters] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentParameter, setCurrentParameter] = useState({
        name: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editParameterId, setEditParameterId] = useState(null);

    // API Base URL
    const API_URL = "https://iinms.brri.gov.bd/api/weather-parameters/weather-parameters";

    // Fetch parameters from the server
    const fetchParameters = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setParameters(data);
        } catch (error) {
            console.error("Error fetching parameters:", error);
        }
    };

    useEffect(() => {
        fetchParameters();
    }, []);

    const openAddParameterModal = () => {
        setCurrentParameter({ name: ""});
        setIsEditMode(false);
        setEditParameterId(null);
        setModalVisible(true);
    };

    const openEditParameterModal = (id) => {
        const parameterToEdit = parameters.find((param) => param.id === id);
        if (parameterToEdit) {
            setCurrentParameter({
                name: parameterToEdit.name,
                latitude: parameterToEdit.latitude,
                longitude: parameterToEdit.longitude,
            });
            setIsEditMode(true);
            setEditParameterId(id);
            setModalVisible(true);
        }
    };

    const saveParameter = async () => {
        try {
            if (isEditMode) {
                // Update parameter
                const response = await fetch(`${API_URL}/${editParameterId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(currentParameter),
                });
                if (response.ok) {
                    fetchParameters();
                }
            } else {
                // Add new parameter
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(currentParameter),
                });
                if (response.ok) {
                    fetchParameters();
                }
            }
        } catch (error) {
            console.error("Error saving parameter:", error);
        } finally {
            setModalVisible(false);
            setCurrentParameter({ name: ""});
        }
    };

    const deleteParameter = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchParameters();
            }
        } catch (error) {
            console.error("Error deleting parameter:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
            <div style={{ padding: "25px", flexGrow: 1, backgroundColor: "#f9fafb" }}>
                <div className="p-6 bg-gray-50 min-h-screen w-[159vh]">
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-bold mb-6 text-center text-black">
                            Weather Parameter List
                        </h1>
                        <button
                            onClick={openAddParameterModal}
                           className="bg-slate-600 text-white px-2 py-1 mb-5  rounded shadow hover:shadow-lg transition duration-300"
                        >
                            Add Weather Parameter
                        </button>
                    </div>

                    <table className="w-full border-collapse bg-white rounded shadow-lg">
                        <thead className="bg-slate-700 text-white">
                            <tr>
                                <th className="border-b px-6 py-3 text-left">ID</th>
                                <th className="border-b px-6 py-3 text-left">Name</th>
                                <th className="border-b px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parameters.map((parameter) => (
                                <tr key={parameter.id} className="hover:bg-gray-100">
                                    <td className="border-b px-6 py-3">{parameter.id}</td>
                                    <td className="border-b px-6 py-3">{parameter.name}</td>
                                    <td className="border-b px-6 py-3 flex gap-4">
                                        <button
                                            onClick={() => openEditParameterModal(parameter.id)}
                                            className="text-slate-600 hover:underline"
                                        >
                                            <FaPen />
                                        </button>
                                        <button
                                            onClick={() => deleteParameter(parameter.id)}
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
                                    {isEditMode ? "Edit Weather Parameter" : "Add Weather Parameter"}
                                </h2>
                                <label className="block mb-2 font-medium">Name</label>
                                <input
                                    type="text"
                                    value={currentParameter.name}
                                    onChange={(e) =>
                                        setCurrentParameter({ ...currentParameter, name: e.target.value })
                                    }
                                    className="w-full border px-4 py-2 rounded mb-4"
                                    placeholder="Enter name"
                                />
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setModalVisible(false)}
                                        className="bg-gray-300 text-black px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveParameter}
                                        className="bg-slate-600 text-white px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeatherParameter;
