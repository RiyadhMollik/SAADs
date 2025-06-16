import { useEffect, useState, useContext } from "react";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import { ChevronsUpDown } from "lucide-react";
import { AuthContext } from "../../Components/context/AuthProvider";

const JournalistsRegistration = () => {
  const { rolePermission } = useContext(AuthContext);
  const [isJournalistsModalOpen, setIsJournalistsModalOpen] = useState(false);
  const [JournalistsList, setJournalistsList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    address: "",
    mediaType: "",
    mediaName: "",
    expertise: "",
    otherExpertise: "",
    gender: "",
    mobileNumber: "",
    alternateContact: "",
    whatsappNumber: "",
    messengerId: "",
    email: "",
    emailOfficial: "",
    role: "Journalists",
  });

  // Remove unused location-related state variables
  // const [regions, setRegions] = useState([]);
  // const [hotspot, setHotspot] = useState([]);
  // const [selectedHotspots, setSelectedHotspots] = useState([]);
  // const [districts, setDistricts] = useState([]);
  // const [divisions, setDivisions] = useState([]);
  // const [upazilas, setUpazilas] = useState([]);
  // const [unions, setUnions] = useState([]);
  // const [block, setBlock] = useState([]);  

  // Remove unused useEffect hooks for location data fetching
  // (All useEffect hooks related to regions, divisions, districts, upazilas, unions, blocks, hotspots)

  const fetchJournalists = async () => {
    try {
      const response = await fetch(
        `https://iinms.brri.gov.bd/api/farmers/farmers/role/Journalists?page=${page}&limit=${rowsPerPage}&search=${searchText}`
      );
      if (response.ok) {
        const data = await response.json();
        setJournalistsList(data.data);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalFarmers: data.pagination.totalFarmers,
          limit: data.pagination.limit,
        });
      } else {
        throw new Error("Failed to fetch Journalists");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchJournalists();
  }, [page, rowsPerPage, searchText]);

  // Updated columns to match form inputs
  const initialColumns = [
    { name: "ID", visible: true },
    { name: "Name", visible: true },
    { name: "Designation", visible: true },
    { name: "Office Address", visible: true },
    { name: "Media Type", visible: true },
    { name: "Name of Media", visible: true },
    { name: "Area of Expertise", visible: true },
    { name: "Gender", visible: true },
    { name: "Mobile Number (Personal)", visible: true },
    { name: "Mobile Number (Official)", visible: true },
    { name: "WhatsApp Number", visible: true },
    { name: "Facebook ID", visible: true },
    { name: "Email (Personal)", visible: true },
    { name: "Email (Official)", visible: true },
    { name: "Action", visible: true },
  ];

  const [columns, setColumns] = useState(initialColumns);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const toggleColumnModal = () => setIsColumnModalOpen(!isColumnModalOpen);

  const handleColumnToggle = (columnName) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.name === columnName ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const toggleJournalistsModal = () => {
    setIsJournalistsModalOpen(!isJournalistsModalOpen);
    if (!isJournalistsModalOpen) {
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
      address: "",
      mediaType: "",
      mediaName: "",
      expertise: "",
      otherExpertise: "",
      gender: "",
      mobileNumber: "",
      alternateContact: "",
      whatsappNumber: "",
      messengerId: "",
      email: "",
      emailOfficial: "",
      role: "Journalists",
    });
    setIsEdit(false);
    setSelectedId(null);
  };

  const closeModal = () => {
    setIsJournalistsModalOpen(false);
    resetForm();
  };

  const registerJournalists = async (e) => {
    e.preventDefault();
    if (formData.mobileNumber.length < 11) {
      return alert("Mobile number must be 11 digits long.");
    }
    if (formData.whatsappNumber.length < 11) {
      return alert("WhatsApp number must be 11 digits long.");
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      expertise: formData.expertise === "others" ? formData.otherExpertise : formData.expertise,
    };
    delete submissionData.otherExpertise; // Remove otherExpertise if not needed

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
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        await response.json();
        setIsJournalistsModalOpen(false);
        resetForm();
        fetchJournalists();
      } else {
        throw new Error("Failed to save Journalists");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save Journalists. Please try again.");
    }
  };

  const handleDeleteJournalists = async (id) => {
    if (!window.confirm("Are you sure you want to delete this journalist?")) return;

    try {
      const response = await fetch(
        `https://iinms.brri.gov.bd/api/farmers/farmers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchJournalists();
      } else {
        throw new Error("Failed to delete Journalists");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete Journalists. Please try again.");
    }
  };

  const handleEdit = (journalist) => {
    setIsEdit(true);
    setIsJournalistsModalOpen(true);
    setSelectedId(journalist.id);
    setFormData({
      name: journalist.name || "",
      designation: journalist.designation || "",
      address: journalist.address || "",
      mediaType: journalist.mediaType || "",
      mediaName: journalist.mediaName || "",
      expertise: journalist.expertise || "",
      otherExpertise: journalist.expertise === "others" ? journalist.expertise : "",
      gender: journalist.gender || "",
      mobileNumber: journalist.mobileNumber || "",
      alternateContact: journalist.alternateContact || "",
      whatsappNumber: journalist.whatsappNumber || "",
      messengerId: journalist.messengerId || "",
      email: journalist.email || "",
      emailOfficial: journalist.emailOfficial || "",
      role: journalist.role || "Journalists",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <main className="md:p-6 lg:p-8">
        <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Journalists List</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={toggleJournalistsModal}
            >
              + Add Journalists
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full space-y-3 md:space-y-0">
            <input
              type="text"
              placeholder="Search by Name, Phone, or Media"
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
                {JournalistsList.slice(0, rowsPerPage).map((journalist, rowIndex) => (
                  <tr key={journalist.id} className="text-sm" style={{ height: "50px" }}>
                    {columns
                      .filter((col) => col.visible)
                      .map((col, index) => (
                        <td
                          key={col.name}
                          className={`border px-4 py-2 text-center capitalize overflow-hidden ${index === 0 ? "sticky left-0" : ""} ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} ${index === 7 ? "capitalize" : ""}`}
                          style={{ width: "150px" }}
                        >
                          {col.name === "ID" &&
                            (pagination.currentPage === 1
                              ? rowIndex + 1
                              : (pagination.currentPage - 1) * rowsPerPage + rowIndex + 1)}
                          {col.name === "Name" && journalist.name}
                          {col.name === "Designation" && journalist.designation}
                          {col.name === "Office Address" && journalist.address}
                          {col.name === "Media Type" && journalist.mediaType}
                          {col.name === "Name of Media" && journalist.mediaName}
                          {col.name === "Area of Expertise" && journalist.expertise}
                          {col.name === "Gender" && journalist.gender}
                          {col.name === "Mobile Number (Personal)" &&
                            journalist.mobileNumber && (
                              <a href={`tel:${journalist.mobileNumber}`} className=" hover:underline">
                                {journalist.mobileNumber}
                              </a>
                            )}

                          {col.name === "Mobile Number (Official)" &&
                            journalist.alternateContact && (
                              <a href={`tel:${journalist.alternateContact}`} className=" hover:underline">
                                {journalist.alternateContact}
                              </a>
                            )}

                          {col.name === "WhatsApp Number" &&
                            journalist.whatsappNumber && (
                              <a
                                href={`https://wa.me/${journalist.whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600  hover:underline"
                              >
                                {journalist.whatsappNumber}
                              </a>
                            )}

                          {col.name === "Facebook ID" &&
                            journalist.messengerId && (
                              <a
                                href={`https://facebook.com/${journalist.messengerId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 lowercase  hover:underline"
                              >
                                {journalist.messengerId}
                              </a>
                            )}

                          {col.name === "Email (Personal)" &&
                            journalist.email && (
                              <a href={`mailto:${journalist.email}`} className="text-purple-700 lowercase  hover:underline">
                                {journalist.email}
                              </a>
                            )}

                          {col.name === "Email (Official)" &&
                            journalist.emailOfficial && (
                              <a href={`mailto:${journalist.emailOfficial}`} className="text-purple-700 lowercase  hover:underline">
                                {journalist.emailOfficial}
                              </a>
                            )}

                          {col.name === "Action" && (
                            <div className="flex space-x-2">
                              {rolePermission["Journalist Edit"] && (
                                <button
                                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                  onClick={() => handleEdit(journalist)}
                                >
                                  <FaEdit />
                                </button>
                              )}
                              {rolePermission["Journalist Delete"] && (
                                <button
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  onClick={() => handleDeleteJournalists(journalist.id)}
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

        {isJournalistsModalOpen && (
          <div className="fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative max-h-[90vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-2/3">
              <h3 className="text-lg font-bold mb-4 text-center">Journalists Registration</h3>
              <button
                className="absolute top-2 right-5 text-xl text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                ×
              </button>
              <form onSubmit={registerJournalists}>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Journalist's Name"
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
                  <input
                    type="text"
                    name="address"
                    placeholder="Office Address"
                    className="border w-full p-2 rounded"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  <select
                    name="mediaType"
                    className="border w-full p-2 rounded"
                    value={formData.mediaType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Media Type</option>
                    <option value="print">Print</option>
                    <option value="electronic">Electronic</option>
                  </select>
                  <input
                    type="text"
                    name="mediaName"
                    placeholder="Name of Media"
                    className="border w-full p-2 rounded"
                    value={formData.mediaName}
                    onChange={handleChange}
                    required
                  />
                  <select
                    name="expertise"
                    className="border w-full p-2 rounded"
                    value={formData.expertise}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Area of Expertise</option>
                    <option value="general">General</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="others">Others</option>
                  </select>
                  {formData.expertise === "others" && (
                    <input
                      type="text"
                      name="otherExpertise"
                      placeholder="Other Expertise"
                      className="border w-full p-2 rounded"
                      value={formData.otherExpertise}
                      onChange={handleChange}
                      required
                    />
                  )}
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
                    required
                  />
                  <input
                    type="text"
                    name="messengerId"
                    placeholder="Facebook ID"
                    className="border w-full p-2 rounded"
                    value={formData.messengerId}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email (Personal)"
                    className="border w-full p-2 rounded"
                    value={formData.email}
                    onChange={handleChange}
                    required
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

export default JournalistsRegistration;