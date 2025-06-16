import { useEffect, useState, useContext } from "react";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import { ChevronsUpDown } from "lucide-react";
import { AuthContext } from "../../Components/context/AuthProvider";

const ScientistRegistration = () => {
  const { rolePermission } = useContext(AuthContext);
  const [isScientistModalOpen, setIsScientistModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [scientistList, setScientistList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [regions, setRegions] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalFarmers: 0,
    limit: 10,
  });
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    hotspot: "",
    region: "",
    division: "",
    district: "",
    upazila: "",
    gender: "",
    mobileNumber: "",
    alternateContact: "",
    whatsappNumber: "",
    messengerId: "",
    email: "",
    emailOfficial: "",
    role: "Scientist",
  });

  // Fetch location data
  useEffect(() => {
    if (!formData.hotspot) return;

    const fetchRegion = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/regions?hotspot=${formData.hotspot}`
        );
        if (!response.ok) throw new Error("Failed to fetch region data");
        const data = await response.json();
        setRegions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching region data:", error);
      }
    };

    fetchRegion();
  }, [formData.hotspot]);

  useEffect(() => {
    if (!formData.region || !formData.hotspot) return;

    const fetchDivision = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/divisions?region=${formData.region}&hotspot=${formData.hotspot}`
        );
        if (!response.ok) throw new Error("Failed to fetch division data");
        const data = await response.json();
        setDivisions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching division data:", error);
      }
    };

    fetchDivision();
  }, [formData.region, formData.hotspot]);

  useEffect(() => {
    if (!formData.division || !formData.region || !formData.hotspot) return;

    const fetchDistrict = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/districts?division=${formData.division}&region=${formData.region}&hotspot=${formData.hotspot}`
        );
        if (!response.ok) throw new Error("Failed to fetch district data");
        const data = await response.json();
        setDistricts(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching district data:", error);
      }
    };

    fetchDistrict();
  }, [formData.division, formData.region, formData.hotspot]);

  useEffect(() => {
    if (!formData.district || !formData.division || !formData.region || !formData.hotspot) return;

    const fetchUpazila = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/upazilas?district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${formData.hotspot}`
        );
        if (!response.ok) throw new Error("Failed to fetch upazila data");
        const data = await response.json();
        setUpazilas(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching upazila data:", error);
      }
    };

    fetchUpazila();
  }, [formData.district, formData.division, formData.region, formData.hotspot]);

  useEffect(() => {
    if (!formData.upazila || !formData.district || !formData.division || !formData.region || !formData.hotspot) return;

    const fetchUnion = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/unions?upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${formData.hotspot}`
        );
        if (!response.ok) throw new Error("Failed to fetch union data");
        const data = await response.json();
        setUnions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching union data:", error);
      }
    };

    fetchUnion();
  }, [formData.upazila, formData.district, formData.division, formData.region, formData.hotspot]);

  useEffect(() => {
    if (!formData.union || !formData.upazila || !formData.district || !formData.division || !formData.region || !formData.hotspot) return;

    const fetchBlock = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/blocks?union=${formData.union}&upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${formData.hotspot}`
        );
        if (!response.ok) throw new Error("Failed to fetch block data");
        const data = await response.json();
        setBlocks(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };

    fetchBlock();
  }, [formData.union, formData.upazila, formData.district, formData.division, formData.region, formData.hotspot]);

  // Fetch hotspots
  const API_URL = "https://iinms.brri.gov.bd/api/hotspots";
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setHotspots(data.reverse());
      } catch (error) {
        console.error("Error fetching hotspots:", error);
      }
    };
    fetchHotspots();
  }, []);

  // Fetch scientists
  const fetchScientists = async () => {
    try {
      const response = await fetch(
        `https://iinms.brri.gov.bd/api/farmers/farmers/role/Scientist?page=${page}&limit=${rowsPerPage}&search=${searchText}`
      );
      if (response.ok) {
        const data = await response.json();
        setScientistList(data.data);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalFarmers: data.pagination.totalFarmers,
          limit: data.pagination.limit,
        });
      } else {
        throw new Error("Failed to fetch Scientists");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchScientists();
  }, [page, rowsPerPage, searchText]);

  // Updated columns to match form inputs
  const initialColumns = [
    { name: "ID", visible: true },
    { name: "Name", visible: true },
    { name: "Designation", visible: true },
    { name: "Hotspot", visible: true },
    { name: "Region", visible: true },
    { name: "Division", visible: true },
    { name: "District", visible: true },
    { name: "Upazila", visible: true },
    // { name: "Union", visible: true },
    // { name: "Block", visible: true },
    { name: "Gender", visible: true },
    { name: "Mobile Number (Personal)", visible: true },
    { name: "Mobile Number (Official)", visible: true },
    { name: "WhatsApp Number", visible: true },
    { name: "Messenger ID", visible: true },
    { name: "Email (Personal)", visible: true },
    { name: "Email (Official)", visible: true },
    { name: "Action", visible: true },
  ];

  const [columns, setColumns] = useState(initialColumns);

  const toggleColumnModal = () => setIsColumnModalOpen(!isColumnModalOpen);

  const handleColumnToggle = (columnName) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.name === columnName ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const toggleScientistModal = () => {
    setIsScientistModalOpen(!isScientistModalOpen);
    if (!isScientistModalOpen) {
      resetForm();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      hotspot: "",
      region: "",
      division: "",
      district: "",
      upazila: "",
      gender: "",
      mobileNumber: "",
      alternateContact: "",
      whatsappNumber: "",
      messengerId: "",
      email: "",
      emailOfficial: "",
      role: "Scientist",
    });
    setIsEdit(false);
    setSelectedId(null);
  };

  const closeModal = () => {
    setIsScientistModalOpen(false);
    resetForm();
  };

  const registerScientist = async (e) => {
    e.preventDefault();
    if (formData.mobileNumber.length < 11) {
      return alert("Mobile number must be 11 digits long.");
    }
    if (formData.whatsappNumber && formData.whatsappNumber.length < 11) {
      return alert("WhatsApp number must be 11 digits long.");
    }

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `https://iinms.brri.gov.bd/api/farmers/farmers/${selectedId}`
        : "https://iinms.brri.gov.bd/api/farmers/farmers";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        setIsScientistModalOpen(false);
        resetForm();
        fetchScientists();
      } else {
        throw new Error("Failed to save Scientist");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save Scientist. Please try again.");
    }
  };

  const handleDeleteScientist = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scientist?")) return;

    try {
      const response = await fetch(
        `https://iinms.brri.gov.bd/api/farmers/farmers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchScientists();
      } else {
        throw new Error("Failed to delete Scientist");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete Scientist. Please try again.");
    }
  };

  const handleEdit = (scientist) => {
    setIsEdit(true);
    setIsScientistModalOpen(true);
    setSelectedId(scientist.id);
    setFormData({
      name: scientist.name || "",
      designation: scientist.designation || "", 
      hotspot: scientist.hotspot || "",
      region: scientist.region || "",
      division: scientist.division || "",
      district: scientist.district || "",
      upazila: scientist.upazila || "",
      gender: scientist.gender || "",
      mobileNumber: scientist.mobileNumber || "",
      alternateContact: scientist.alternateContact || "",
      whatsappNumber: scientist.whatsappNumber || "",
      messengerId: scientist.messengerId || "",
      email: scientist.email || "",
      emailOfficial: scientist.emailOfficial || "",
      role: scientist.role || "Scientist",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <main className="md:p-6 lg:p-8">
        <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Scientist List</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={toggleScientistModal}
            >
              + Add Scientist
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full space-y-3 md:space-y-0">
            <input
              type="text"
              placeholder="Search by Name, Phone, or District"
              className="border rounded px-4 py-2 w-full md:w-1/2 lg:w-1/3"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex flex-wrap justify-center md:justify-end space-x-2">
              <input
                type="number"
                className="border rounded px-4 py-2"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value) || 10)}
                min={1}
                placeholder="Rows per page"
              />
              <button className="border px-4 py-2 rounded hover:bg-gray-100">Copy</button>
              <button className="border px-4 py-2 rounded hover:bg-gray-100">CSV</button>
              <button className="border px-4 py-2 rounded hover:bg-gray-100">PDF</button>
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100 flex items-center justify-center"
                onClick={toggleColumnModal}
              >
                <FaBars className="text-lg" />
              </button>
            </div>
          </div>

          <div className="max-w-[150vh] overflow-x-scroll overflow-auto max-h-[500px] custom-scrollbar">
            <table className="table-fixed w-full mt-4 border rounded">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 text-sm border-b">
                  {columns
                    .filter((col) => col.visible)
                    .map((col, index) => (
                      <th
                        key={col.name}
                        className={`border px-4 py-2 ${index === 0 ? "sticky left-0 bg-gray-50" : ""}`}
                        style={{ width: index === 0 ? "50px" : "150px" }}
                      >
                        <p className="flex items-center justify-between">
                          {col.name} <ChevronsUpDown size={14} />
                        </p>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {scientistList.slice(0, rowsPerPage).map((scientist, rowIndex) => (
                  <tr key={scientist.id} className="text-sm" style={{ height: "50px" }}>
                    {columns
                      .filter((col) => col.visible)
                      .map((col, index) => (
                        <td
                          key={col.name}
                          className={`border px-4 py-2 ${index === 0 ? "sticky left-0" : ""} ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} ${index === 10 ? "capitalize" : ""}`}
                          style={{ width: "150px" }}
                        >
                          {col.name === "ID" &&
                            (pagination.currentPage === 1
                              ? rowIndex + 1
                              : (pagination.currentPage - 1) * rowsPerPage + rowIndex + 1)}
                          {col.name === "Name" && scientist.name}
                          {col.name === "Designation" && scientist.designation}
                          {col.name === "Hotspot" && scientist.hotspot}
                          {col.name === "Region" && scientist.region}
                          {col.name === "Division" && scientist.division}
                          {col.name === "District" && scientist.district}
                          {col.name === "Upazila" && scientist.upazila}
                          {/* {col.name === "Union" && scientist.union}
                          {col.name === "Block" && scientist.block} */}
                          {col.name === "Gender" && scientist.gender}
                          {col.name === "Mobile Number (Personal)" && scientist.mobileNumber}
                          {col.name === "Mobile Number (Official)" && scientist.alternateContact}
                          {col.name === "WhatsApp Number" && scientist.whatsappNumber}
                          {col.name === "Messenger ID" && scientist.messengerId}
                          {col.name === "Email (Personal)" && scientist.email}
                          {col.name === "Email (Official)" && scientist.emailOfficial}
                          {col.name === "Action" && (
                            <div className="flex space-x-2">
                              {rolePermission["Scientist Edit"] && (
                                <button
                                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                  onClick={() => handleEdit(scientist)}
                                >
                                  <FaEdit />
                                </button>
                              )}
                              {rolePermission["Scientist Delete"] && (
                                <button
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  onClick={() => handleDeleteScientist(scientist.id)}
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center w-full mt-5 md:hidden lg:hidden">
            <label className="mr-2 w-1/2">Jump to page:</label>
            <input
              type="number"
              value={page}
              onChange={(e) => setPage(parseInt(e.target.value))}
              className="px-2 py-1 border rounded border-gray-300 w-1/2"
            />
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <button
              onClick={() => setPage(page - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="hidden md:block lg:block text-sm">
              <label className="mr-2">Jump to page:</label>
              <input
                type="number"
                value={page}
                onChange={(e) => setPage(parseInt(e.target.value))}
                className="px-2 py-1 border rounded border-gray-300"
              />
            </div>
            <button
              onClick={() => setPage(page + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>

        {isColumnModalOpen && (
          <div
            className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-end"
            onClick={toggleColumnModal}
          >
            <div
              className="bg-white rounded shadow-lg w-full md:w-1/4 lg:w-1/5 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="space-y-2 max-h-[50vh] overflow-y-scroll">
                {columns.map((col) => (
                  <li
                    key={col.name}
                    className={`flex items-center cursor-pointer px-3 space-x-2 ${col.visible ? "bg-gray-200 p-1 px-3" : ""}`}
                    onClick={() => handleColumnToggle(col.name)}
                  >
                    <span>{col.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {isScientistModalOpen && (
          <div className="fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative max-h-[90vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-2/3">
              <h3 className="text-lg font-bold mb-4 text-center">Scientist Registration</h3>
              <button
                className="absolute top-2 right-5 text-xl text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                ×
              </button>
              <form onSubmit={registerScientist}>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Scientist's Name"
                    className="border w-full p-2 rounded"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation"
                    className="border w-full p-2 rounded"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  />
                  <select
                    name="hotspot"
                    className="border w-full p-2 rounded"
                    value={formData.hotspot}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Hotspot</option>
                    {hotspots?.map((hotspot) => (
                      <option key={hotspot.id} value={hotspot.name}>
                        {hotspot.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="region"
                    className="border w-full p-2 rounded"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Region</option>
                    {regions?.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  <select
                    name="division"
                    className="border w-full p-2 rounded"
                    value={formData.division}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Division</option>
                    {divisions?.map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}
                  </select>
                  <select
                    name="district"
                    className="border w-full p-2 rounded"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select District</option>
                    {districts?.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <select
                    name="upazila"
                    className="border w-full p-2 rounded"
                    value={formData.upazila}
                    onChange={handleChange}
                  >
                    <option value="">Select Upazila</option>
                    {upazilas?.map((upazila) => (
                      <option key={upazila} value={upazila}>
                        {upazila}
                      </option>
                    ))}
                  </select>
                 
                  <select
                    name="gender"
                    className="border w-full p-2 rounded"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number (Personal)"
                    className="border w-full p-2 rounded"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
                    onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                    required
                  />
                  <input
                    type="tel"
                    name="alternateContact"
                    placeholder="Mobile Number (Official)"
                    className="border w-full p-2 rounded"
                    value={formData.alternateContact}
                    onChange={handleChange}
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
                    onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                  />
                  <input
                    type="tel"
                    name="whatsappNumber"
                    placeholder="WhatsApp Number"
                    className="border w-full p-2 rounded"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
                    onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                  />
                  <input
                    type="text"
                    name="messengerId"
                    placeholder="Facebook ID"
                    className="border w-full p-2 rounded"
                    value={formData.messengerId}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email (Personal)"
                    className="border w-full p-2 rounded"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="emailOfficial"
                    placeholder="Email (Official)"
                    className="border w-full p-2 rounded"
                    value={formData.emailOfficial}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScientistRegistration;