import { useState, useEffect } from "react";
import { FaPen, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import axios from 'axios';

const District = () => {
    const [districts, setDistricts] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentDistrict, setCurrentDistrict] = useState({ name: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editDistrictId, setEditDistrictId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    useEffect(() => {
        fetchDistricts();
    }, []);

    const fetchDistricts = async () => {
        try {
            const response = await axios.get('https://iinms.brri.gov.bd/api/district/districts');
            const data = response.data.reverse();
            setDistricts(data);
            setFilteredDistricts(data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const openAddDistrictModal = () => {
        setCurrentDistrict({ name: "" });
        setIsEditMode(false);
        setEditDistrictId(null);
        setModalVisible(true);
    };

    const openEditDistrictModal = (id) => {
        const districtToEdit = districts.find((district) => district.id === id);
        if (districtToEdit) {
            setCurrentDistrict(districtToEdit);
            setIsEditMode(true);
            setEditDistrictId(id);
            setModalVisible(true);
        }
    };

    const saveDistrict = async () => {
        if (isEditMode) {
            try {
                await axios.put(`https://iinms.brri.gov.bd/api/district/districts/${editDistrictId}`, currentDistrict);
                fetchDistricts();
            } catch (error) {
                console.error("Error updating district:", error);
            }
        } else {
            try {
                await axios.post('https://iinms.brri.gov.bd/api/district/districts', currentDistrict);
                fetchDistricts();
            } catch (error) {
                console.error("Error adding district:", error);
            }
        }
        setModalVisible(false);
        setCurrentDistrict({ name: "" });
    };

    const deleteDistrict = async (id) => {
        try {
            await axios.delete(`https://iinms.brri.gov.bd/api/district/districts/${id}`);
            fetchDistricts();
        } catch (error) {
            console.error("Error deleting district:", error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = districts.filter((district) =>
            district.name.toLowerCase().includes(query)
        );
        setFilteredDistricts(filtered);
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedDistricts = [...filteredDistricts].sort((a, b) => {
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
        setFilteredDistricts(sortedDistricts);
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
                        <h1 className="text-3xl font-bold text-center text-black">District List</h1>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search by district name..."
                                className="border px-4 py-2 rounded focus:outline-none focus:ring-2"
                            />
                            <button
                                onClick={openAddDistrictModal}
                                className="bg-slate-600 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300"
                            >
                                Add District
                            </button>
                        </div>
                    </div>
                    <table className="max-w-[160vh] w-full border-collapse bg-white rounded shadow-lg">
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
                                <th className="px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDistricts?.map((district, index) => (
                                <tr key={district.id} className="hover:bg-gray-100 border-b">
                                    <td className="px-6 py-3 w-24">{index + 1}</td>
                                    <td className="px-6 py-3">{district.name}</td>
                                    <td className="px-6 py-3 h-full flex gap-4">
                                        <button
                                            onClick={() => openEditDistrictModal(district.id)}
                                            className="text-slate-600 hover:underline"
                                        >
                                            <FaPen />
                                        </button>
                                        <button
                                            onClick={() => deleteDistrict(district.id)}
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
                                    {isEditMode ? "Edit District" : "Add District"}
                                </h2>
                                <label className="block mb-2 font-medium">District Name</label>
                                <input
                                    type="text"
                                    value={currentDistrict.name}
                                    onChange={(e) => setCurrentDistrict({ ...currentDistrict, name: e.target.value })}
                                    className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                                    placeholder="Enter District name"
                                />
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setModalVisible(false)}
                                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveDistrict}
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

export default District;