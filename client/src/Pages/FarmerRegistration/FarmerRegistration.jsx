import { useEffect, useState } from "react";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import { useAuthContext } from "../../Components/context/AuthProvider";
import { use } from "react";
import { ChevronsUpDown } from "lucide-react";

const FarmerRegistration = () => {
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [farmerList, setFarmerList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { authUser, loadingUser } = useAuthContext();
  const [selectedDeseases, setSelectedDeseases] = useState([]);
  const [selectedInsects, setSelectedInsects] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isOtherDiseasesOpen, setIsOtherDiseasesOpen] = useState(false);
  const [isOtherInsectsOpen, setIsOtherInsectsOpen] = useState(false);
  const [otherDiseases, setOtherDiseases] = useState("");
  const [otherInsects, setOtherInsects] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalFarmers: 0,
    limit: 10,
  });
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    gender: "",
    mobileNumber: "",
    whatsappNumber: "",
    imoNumber: "",
    messengerId: "",
    email: "",
    alternateContact: "",
    nationalId: "",
    // Location Information,
    region: authUser?.RegistedUser?.region,
    block: authUser?.RegistedUser?.block || "",
    union: authUser?.RegistedUser?.union || "",
    upazila: authUser?.RegistedUser?.upazila || "",
    district: authUser?.RegistedUser?.district || "",
    division: authUser?.RegistedUser?.division || "",
    // coordinates: authUser?.RegistedUser?.coordinates || "",
    hotspot: authUser?.RegistedUser?.hotspot || [],
    coordinates: "",
    role: "farmer",
    saaoId: authUser?.id || null,
    saaoName: authUser?.name || null,
  });
  // Base API URL

  const fetchFarmers = async () => {
    try {
      const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/role/farmer?page=${page}&limit=${rowsPerPage}`);
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setFarmerList(data.data);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalFarmers: data.pagination.totalFarmers,
          limit: data.pagination.limit,
        });
      } else {
        throw new Error("Failed to fetch farmers");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [page, rowsPerPage]);
  // Define the available columns and their initial visibility state
  const initialColumns = [
    { name: "ID", visible: true },
    { name: "Farmer Name", visible: true },
    { name: "Father Name", visible: true },
    { name: "Gender", visible: true },
    { name: "Mobile Number", visible: true },
    { name: "Whatsapp Number", visible: true },
    { name: "Imo Number", visible: true },
    { name: "Messenger ID", visible: true },
    { name: "Email", visible: true },
    { name: "Alternate Contact", visible: true },
    // { name: "National ID", visible: true },
    // { name: "Agriculture Card", visible: true },
    { name: "Education Status", visible: true },
    // Location Information
    { name: "Village", visible: true },
    { name: "Block", visible: true },
    { name: "Union", visible: true },
    { name: "Upazila", visible: true },
    { name: "District", visible: true },
    { name: "Division", visible: true },
    { name: "Region", visible: true },
    // { name: "Coordinates", visible: true },
    { name: "Hotspot", visible: true },
    // Rice Crop Details
    { name: "Farm Size", visible: true },
    { name: "Land Type", visible: true },
    { name: "Cultivation Season", visible: true },
    { name: "Major Crops", visible: true },
    { name: "Cropping Pattern", visible: true },
    { name: "Rice Varieties", visible: true },
    { name: "Planting Method", visible: true },
    { name: "Irrigation Practices", visible: true },
    { name: "Fertilizer Usage", visible: true },
    { name: "Soil Type", visible: true },
    { name: "SAAO", visible: true },
    { name: "Action", visible: true },
  ];


  const [columns, setColumns] = useState(initialColumns);

  const toggleColumnModal = () => setIsColumnModalOpen(!isColumnModalOpen);

  // Handle column visibility toggle
  const handleColumnToggle = (columnName) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.name === columnName ? { ...col, visible: !col.visible } : col
      )
    );
  };
  const toggleFarmerModal = () => {
    setIsFarmerModalOpen(!isFarmerModalOpen);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setCurrentStep(1);
  const closeModal = () => {
    setIsFarmerModalOpen(false);
  };
  const registerFarmer = async (e) => {

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
        const data = await response.json();
        setIsFarmerModalOpen(false);
        setIsEdit(false); // reset edit mode
        console.log("farmer saved successfully:", data);
        fetchFarmers(); // Refresh the list
        e.form.reset();
      } else {
        throw new Error("Failed to save SAAO");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteSAAO = async (id) => {
    try {
      const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("SAAO deleted successfully");
        fetchFarmers(); // Refresh the list
      } else {
        throw new Error("Failed to delete SAAO");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Filter farmerList based on search text
  const filteredFarmers = farmerList.filter((farmer) => {
    return (
      farmer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      farmer.mobileNumber.includes(searchText) ||
      farmer.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });


  const handleEdit = (SAAO) => {
    setIsEdit(true);
    setIsFarmerModalOpen(true);
    setSelectedId(SAAO.id);

    setFormData({
      name: SAAO.name || "",
      fatherName: SAAO.fatherName || "",
      gender: SAAO.gender || "",
      mobileNumber: SAAO.mobileNumber || "",
      whatsappNumber: SAAO.whatsappNumber || "",
      imoNumber: SAAO.imoNumber || "",
      messengerId: SAAO.messengerId || "",
      email: SAAO.email || "",
      alternateContact: SAAO.alternateContact || "",
      nationalId: SAAO.nationalId || "",
      // agrilCard: SAAO.agrilCard || "",
      educationStatus: SAAO.educationStatus || "",
      // Location
      village: SAAO.village || "",
      block: SAAO.block || "",
      union: SAAO.union || "",
      upazila: SAAO.upazila || "",
      district: SAAO.district || "",
      division: SAAO.division || "",
      region: SAAO.region || "",
      // coordinates: SAAO.coordinates || "",
      hotspot: SAAO.hotspot || [],
      // Rice Crop Details
      farmSize: SAAO.farmSize || "",
      landType: SAAO.landType || "",
      cultivationSeason: SAAO.cultivationSeason || "",
      majorCrops: SAAO.majorCrops || "",
      croppingPattern: SAAO.croppingPattern || "",
      riceVarieties: SAAO.riceVarieties || "",
      plantingMethod: SAAO.plantingMethod || "",
      irrigationPractices: SAAO.irrigationPractices || "",
      fertilizerUsage: SAAO.fertilizerUsage || "",
      soilType: SAAO.soilType || "",
      avgProduction: SAAO.avgProduction || "",
      // Stage-wise Crop Management
      plantingDate: SAAO.plantingDate || "",
      seedlingAge: SAAO.seedlingAge || "",
      transplantationDate: SAAO.transplantationDate || "",
      wateringStages: SAAO.wateringStages || "",
      harvestDate: SAAO.harvestDate || "",
      pestDiseases: SAAO.pestDiseases || "",
      weedManagement: SAAO.weedManagement || "",
      role: "farmer",
      eduOther: SAAO.eduOther || "",
    });
  };
  const handleSelectDiseases = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "others") {
      setIsOtherDiseasesOpen(true);
      return;
    }
    // Check if the value is already selected
    if (!selectedDeseases.includes(selectedValue)) {
      const updatedSelectedDeseases = [...selectedDeseases, selectedValue];
      setSelectedDeseases(updatedSelectedDeseases);
      setFormData({
        ...formData,
        majorDiseases: updatedSelectedDeseases.join(', '), // Update the formData with the new hotspots list
      });
    }
  }

  const handleDeleteDiseases = (valueToDelete) => {
    // Remove selected value
    const updatedSelectedDeseases = selectedDeseases.filter((value) => value !== valueToDelete);
    setSelectedDeseases(updatedSelectedDeseases);
  };
  const handleAddDiseases = () => {
    setSelectedDeseases([...selectedDeseases, otherDiseases]);
    setIsOtherDiseasesOpen(false);
    setOtherDiseases("");
  }
  const handleSelectInsect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "others") {
      setIsOtherInsectsOpen(true);
      return;
    }
    // Check if the value is already selected
    if (!selectedDeseases.includes(selectedValue)) {
      const updatedSelectedInsects = [...selectedInsects, selectedValue];
      setSelectedInsects(updatedSelectedInsects);
      setFormData({
        ...formData,
        majorInsects: updatedSelectedInsects.join(', '), // Update the formData with the new hotspots list
      });
    }
  }

  const handleDeleteInsect = (valueToDelete) => {
    // Remove selected value
    const updatedSelectedInsects = selectedInsects.filter((value) => value !== valueToDelete);
    setSelectedInsects(updatedSelectedInsects);
  };


  const handleAddInsect = () => {
    setSelectedInsects([...selectedInsects, otherInsects]);
    setIsOtherInsectsOpen(false);
    setOtherInsects("");
  }
  console.log(authUser);

  return (
    <div className="min-h-screen w-full bg-gray-100">

      {/* Main Content */}
      <main className=" p-6">
        <div className="container mx-auto bg-white rounded-lg shadow-md p-6 ">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Farmer List</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={toggleFarmerModal}
            >
              + Add Farmer
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full space-y-3 md:space-y-0">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by Name, Phone, or Email"
              className="border rounded px-4 py-2 w-full md:w-1/2 lg:w-1/3"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {/* Buttons & Select Section */}
            <div className="flex flex-wrap justify-between md:justify-end space-x-2">
              <select
                className="border rounded px-4 py-2"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              >
                <option value={10}>Show 10</option>
                <option value={25}>Show 25</option>
                <option value={50}>Show 50</option>
                <option value={100}>Show 100</option>
              </select>
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

          {/* Table */}
          <div className="max-w-[150vh]  overflow-x-scroll overflow-auto max-h-[500px] custom-scrollbar">
            <table className="table-fixed w-full mt-4 border rounded">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 text-sm border-b">
                  {columns
                    .filter((col) => col.visible)
                    .map((col, index) => (
                      <th
                        key={col.name}
                        className={`border px-4 py-2 ${index === 0 ? "sticky left-0 bg-gray-50" : ""} `}
                        style={{ width: "150px" }}  // Apply fixed width to each header
                      >
                        <p className="flex items-center justify-between">{col.name} <ChevronsUpDown size={14} /></p>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {filteredFarmers.slice(0, rowsPerPage).map((farmer, index) => (
                  <tr className="text-sm" key={farmer.id} style={{ height: "50px" }}> {/* Fixed row height */}
                    {columns
                      .filter((col, colIndex) => col.visible)
                      .map((col, colIndex) => (
                        <td
                          key={col.name}
                          className={`border px-4 py-2 ${colIndex === 0 ? "sticky left-0" : ""} ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${colIndex === 3 ? 'capitalize' : ''}`}
                          style={{ width: "150px" }} // Apply fixed width to each cell
                        >
                          {col.name === "ID" && (
                            pagination?.currentPage === 1 ? index + 1 : (pagination?.currentPage - 1) * rowsPerPage + index + 1
                          )}

                          {col.name === "Farmer Name" && farmer.name}
                          {col.name === "Father Name" && farmer.fatherName}
                          {col.name === "Gender" && farmer.gender}
                          {col.name === "Mobile Number" && farmer.mobileNumber}
                          {col.name === "Whatsapp Number" && farmer.whatsappNumber}
                          {col.name === "Imo Number" && farmer.imoNumber}
                          {col.name === "Messenger ID" && farmer.messengerId}
                          {col.name === "Email" && farmer.email}
                          {col.name === "Alternate Contact" && farmer.alternateContact}
                          {col.name === "Education Status" && farmer.educationStatus}
                          {col.name === "Village" && farmer.village}
                          {col.name === "Block" && farmer.block}
                          {col.name === "Union" && farmer.union}
                          {col.name === "Upazila" && farmer.upazila}
                          {col.name === "District" && farmer.district}
                          {col.name === "Division" && farmer.division}
                          {col.name === "Region" && farmer.region}
                          {col.name === "Hotspot" && farmer.hotspot && farmer.hotspot}
                          {col.name === "Farm Size" && farmer.farmSize}
                          {col.name === "Land Type" && farmer.landType}
                          {col.name === "Cultivation Season" && farmer.cultivationSeason}
                          {col.name === "Major Crops" && farmer.majorCrops}
                          {col.name === "Cropping Pattern" && farmer.croppingPattern}
                          {col.name === "Rice Varieties" && farmer.riceVarieties}
                          {col.name === "Planting Method" && farmer.plantingMethod}
                          {col.name === "Irrigation Practices" && farmer.irrigationPractices}
                          {col.name === "Fertilizer Usage" && farmer.fertilizerUsage}
                          {col.name === "Soil Type" && farmer.soilType}
                          {col.name === "SAAO" && farmer.saaoName}
                          {col.name === "Action" && (
                            <div className="flex space-x-2">
                              {authUser?.RegistedUser?.role !== "saao" && (
                                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => handleEdit(farmer)}>
                                  <FaEdit />
                                </button>
                              )}
                              <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDeleteSAAO(farmer.id)}>
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className=" flex justify-between items-center w-full mt-5 md:hidden lg:hidden">
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
              Page
              {pagination.currentPage} of {pagination.totalPages}
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

        {/* Column Modal */}
        {isColumnModalOpen && (
          <div
            className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-end"
            onClick={toggleColumnModal} // This will close the modal when clicking outside
          >
            <div
              className="bg-white rounded shadow-lg w-full md:w-1/4 lg:w-1/5 py-1"
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside the modal content
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


        {/* Farmer Modal */}
        {isFarmerModalOpen && (
          <div className=" fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative max-h-[90vh] overflow-y-scroll  bg-white p-6 rounded-lg shadow-lg w-full  md:w-2/3 lg:w-2/3">
              <h3 className="text-lg font-semibold mb-4">Farmer Registration</h3>
              <button
                className="absolute top-2 right-5 text-xl text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                &times;
              </button>
              <form onSubmit={registerFarmer}>
                {/* Step 1: Farmer Identification */}
                <div>
                  <label className="block mt-4" htmlFor="">Farmer's Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label className="block mt-4" htmlFor="">Father's Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="fatherName"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                  />
                  <label className="block mt-4" htmlFor="">Gender</label>
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
                  <label className="block mt-4" htmlFor="">Age <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="age"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.age}
                    onChange={handleChange}

                    required
                  />
                  <label className="block mt-4" htmlFor="">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,11}$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    required
                  />
                  <label className="block mt-4" htmlFor="">NID Number</label>
                  <input
                    type="text"
                    name="nationalId"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.nationalId}
                    onChange={handleChange}

                  />
                  <label className="block mt-4" htmlFor="">WhatsApp Number</label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                  />
                  <label className="block mt-4" htmlFor="">Alternate Contact</label>
                  <input
                    type="text"
                    name="alternateContact"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.alternateContact}
                    onChange={handleChange}
                  />
                  <label className="block mt-4" htmlFor="">Education Status</label>
                  <select
                    name="educationStatus"
                    className="border w-full p-2 rounded"
                    value={formData.educationStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Education Status</option>
                    <option value="illiterate">Illiterate</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="higher">Higher</option>
                    <option value="other">Other</option>
                  </select>
                  {
                    formData.educationStatus === 'other' && <input type="text" name="eduOther" placeholder="Education Status" className="border w-full p-2 mt-2 rounded" value={formData.eduOther}

                      onChange={handleChange} />
                  }
                  <label className="block mt-4" htmlFor="">Village/Locality</label>
                  <input
                    type="text"
                    name="village"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.village}
                    onChange={handleChange}
                  />
                  <label className="block mt-4" htmlFor="">Farm Size (in decimal)</label>
                  <input
                    type="text"
                    name="farmSize"
                    placeholder=""
                    className="border w-full p-2  rounded"
                    value={formData.farmSize}
                    onChange={handleChange}
                  />
                  <label className="block mt-4" htmlFor="">Total Urea Uses (kg/bigha)</label>
                  <input
                    type="text"
                    name="fertilizerUsage"
                    placeholder=""
                    className="border w-full p-2  rounded"
                    value={formData.fertilizerUsage}
                    onChange={handleChange}
                  />
                </div>

                <label className="block mt-4" htmlFor="">Major Diseases</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedDeseases.map((selectedDesease) => (
                    <div key={selectedDesease} className="flex items-center bg-gray-200 p-1 rounded">
                      <span>{selectedDesease}</span>
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() => handleDeleteDiseases(selectedDesease)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <select
                  name="cropType"
                  className="border w-full p-2 rounded"
                  value={formData.diseases} onChange={handleSelectDiseases}
                >
                  <option value="">Select Major Diseases</option>
                  <option value="Leaf Blast">Leaf Blast</option>
                  <option value="Neck Blast">Neck Blast</option>
                  <option value="Bacterial Blight">Bacterial Blight</option>
                  <option value="Sheath Blight">Sheath Blight</option>
                  <option value="Bakani">Bakani</option>
                  <option value="others">others</option>
                </select>
                {
                  isOtherDiseasesOpen ? (
                    <div>
                      <label className="block mt-4" htmlFor="">Other Diseases</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="otherDiseases"
                          placeholder=""
                          className="border w-full p-2 rounded"
                          value={otherDiseases}
                          onChange={(e) => setOtherDiseases(e.target.value)}
                        />
                        <button className="btn-sm w-[30%] bg-gray-500 text-white font-bold py-2 px-4 rounded" onClick={handleAddDiseases}>Add Diseases</button>
                      </div>
                    </div>

                  ) : null
                }
                <label className="block mt-4" htmlFor="">Major Insects</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedInsects.map((selectedInsect) => (
                    <div key={selectedInsect} className="flex items-center bg-gray-200 p-1 rounded">
                      <span>{selectedInsect}</span>
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() => handleDeleteInsect(selectedInsect)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <select
                  name="cropType"
                  className="border w-full p-2 rounded"
                  value={formData.insects} onChange={handleSelectInsect}
                >
                  <option value="">Select Major Insects</option>
                  <option value="BPH">BPH</option>
                  <option value="Majra">Majra</option>
                  <option value="Hispa">Hispa</option>
                  <option value="leaf Folder">leaf Folder</option>
                  <option value="Rice Borer">Rice Borer</option>
                  <option value="Green Leaf hopper">Green Leaf hopper</option>
                  <option value="others">others</option>
                </select>
                {
                  isOtherInsectsOpen ? (
                    <div>
                      <label className="block mt-4" htmlFor="">Other Insects</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="otherInsects"
                          placeholder=""
                          className="border w-full p-2 rounded"
                          value={otherInsects}
                          onChange={(e) => setOtherInsects(e.target.value)}
                        />
                        <button className="btn-sm w-[30%] bg-gray-500 text-white font-bold py-2 px-4 rounded" onClick={handleAddInsect}>Add Insects</button>
                      </div>
                    </div>

                  ) : null
                }
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

export default FarmerRegistration
