import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import axios from 'axios';

const Union = () => {
    const [unions, setUnions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUnion, setCurrentUnion] = useState({ name: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUnionId, setEditUnionId] = useState(null);

    useEffect(() => {
        fetchUnions();
    }, []);
    const fetchUnions = async () => {
        try {
            const response = await axios.get('https://iinms.brri.gov.bd/api/unions');
            setUnions(response.data.reverse());
        } catch (error) {
            console.error("Error fetching unions:", error);
        }
    };
    const openAddUnionModal = () => {
        setCurrentUnion({ name: "" });
        setIsEditMode(false);
        setEditUnionId(null);
        setModalVisible(true);
    };
    const openEditUnionModal = (id) => {
        const unionToEdit = unions.find((union) => union.id === id);
        if (unionToEdit) {
            setCurrentUnion(unionToEdit);
            setIsEditMode(true);
            setEditUnionId(id);
            setModalVisible(true);
        }
    };
    const saveUnion = async () => {
        if (isEditMode) {
            try {
                await axios.put(`https://iinms.brri.gov.bd/api/unions/${editUnionId}`, currentUnion);
                fetchUnions();
            } catch (error) {
                console.error("Error updating union:", error);
            }
        } else {
            try {
                await axios.post('https://iinms.brri.gov.bd/api/unions', currentUnion);
                fetchUnions();
            } catch (error) {
                console.error("Error adding union:", error);
            }
        }
        setModalVisible(false);
        setCurrentUnion({ name: "" });
    };
    const deleteUnion = async (id) => {
        try {
            await axios.delete(`https://iinms.brri.gov.bd/api/unions/${id}`);
            fetchUnions();
        } catch (error) {
            console.error("Error deleting union:", error);
        }
    };
    return (
        <div style={{ display: "flex", flexDirection: "row"}}>
            <div style={{ padding: "25px", flexGrow: 1, backgroundColor: "#f9fafb" }}>
                <div className="p-6 bg-gray-50 min-h-screen w-[159vh]">
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-bold mb-6 text-center text-black">Union List</h1>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={openAddUnionModal}
                                className="bg-slate-600 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300"
                            >
                                Add Union
                            </button>
                        </div>
                    </div>

                    <table className="w-full border-collapse bg-white rounded shadow-lg">
                        <thead className="bg-slate-700 text-white">
                            <tr className="border-b">
                                <th className=" px-6 py-3 text-left">#</th>
                                <th className=" px-6 py-3 text-left">Name</th>
                                <th className=" px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unions?.map((union , index) => (
                                <tr key={union.id} className="hover:bg-gray-100 border-b">
                                    <td className=" px-6 py-3 w-24">{index + 1}</td>
                                    <td className=" px-6 py-3">{union.name}</td>
                                    <td className=" px-6 py-3 h-full flex gap-4">
                                        <button onClick={() => openEditUnionModal(union.id)} className="text-slate-600 hover:underline">
                                            <FaPen />
                                        </button>
                                        <button onClick={() => deleteUnion(union.id)} className="hover:underline text-red-500">
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
                                <h2 className="text-2xl font-bold mb-4 text-center text-black">{isEditMode ? "Edit Union" : "Add Union"}</h2>
                                <label className="block mb-2 font-medium">Union Name</label>
                                <input
                                    type="text"
                                    value={currentUnion.name}
                                    onChange={(e) => setCurrentUnion({ ...currentUnion, name: e.target.value })}
                                    className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                                    placeholder="Enter Union name"
                                />
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => setModalVisible(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                                    <button onClick={saveUnion} className="bg-slate-600 text-white px-4 py-2 rounded shadow hover:shadow-lg transition duration-300">Save</button>
                                </div>
                                <button onClick={() => setModalVisible(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Union;
