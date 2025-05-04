import { useEffect, useState } from "react";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import { useAuthContext } from "../../Components/context/AuthProvider";

const FarmerRegistration = () => {
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [farmerList, setFarmerList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { authUser, loadingUser } = useAuthContext();
  const [selectedseason, setSelectedseason] = useState([]);
  const [selectedcrop, setSelectedcrop] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [otherSoilType, setOtherSoilType] = useState('');
  const [otherIrrigation, setOtherIrrigation] = useState('');
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
    cultivationSeason: [],
    cropType: [],
    role: "farmer",
    userId: authUser?.id || null
  });
  // Base API URL

  const fetchFarmers = async () => {
    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/farmers/farmers/role/farmer");
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setFarmerList(data);
      } else {
        throw new Error("Failed to fetch farmers");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);
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

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
    else console.log("Form Data: ", formData);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };
  const resetForm = () => setCurrentStep(1);
  const closeModal = () => {
    setIsFarmerModalOpen(false);
  };
  const registerFarmer = async () => {
    console.log("Form Data: ", formData);
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
      // nationalId: SAAO.nationalId || "",
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
  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    // Check if the value is already selected
    if (!selectedseason.includes(selectedValue)) {
      const updatedSeason = [...selectedseason, selectedValue];
      setSelectedseason(updatedSeason);
      setFormData({
        ...formData,
        cultivationSeason: updatedSeason.join(', '), // Convert array to string
      });
    }
  };

  const handleDelete = (valueToDelete) => {
    // Remove selected value
    const updatedSeason = selectedseason.filter((value) => value !== valueToDelete);
    setSelectedseason(updatedSeason);
  };
  const handleselectCrops = (e) => {
    const selectedValue = e.target.value;
    // Check if the value is already selected
    if (!selectedcrop.includes(selectedValue)) {
      const updatedSeason = [...selectedcrop, selectedValue];
      setSelectedcrop(updatedSeason);
      setFormData({
        ...formData,
        majorCrops: updatedSeason.join(', '), // Convert array to string
      });
    }
  };

  const handleDeleteCrops = (valueToDelete) => {
    // Remove selected value
    const updatedSeason = selectedcrop.filter((value) => value !== valueToDelete);
    setSelectedcrop(updatedSeason);
  };
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
            <div className="flex flex-wrap justify-center md:justify-end space-x-2">
              <select
                className="border rounded px-4 py-2"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              >
                <option value={10}>Show 10</option>
                <option value={25}>Show 25</option>
                <option value={50}>Show 50</option>
                <option value={100}>Show 100</option>
                <option value={500}>Show 500</option>
                <option value={1000}>Show 1000</option>
                <option value={1500}>Show 1500</option>
                <option value={2000}>Show 2000</option>
                <option value={2500}>Show 2500</option>
              </select>
              <button className="border px-4 py-2 rounded hover:bg-gray-100">Copy</button>
              <button className="border px-4 py-2 rounded hover:bg-gray-100">Excel</button>
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
          <div className="max-w-[150vh]  overflow-x-scroll">
            <table className="table-auto w-full mt-4 border rounded ">
              <thead>
                <tr className="bg-gray-200">
                  {columns
                    .filter((col) => col.visible)
                    .map((col) => (
                      <th key={col.name} className="border px-4 py-2">
                        {col.name}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.slice(0, rowsPerPage).map((farmer, index) => (
                  <tr key={farmer.id}>
                    {columns
                      .filter((col) => col.visible)
                      .map((col) => (
                        <td key={col.name} className="border px-4 py-2">
                          {/* Render farmer data dynamically based on column names */}
                          {col.name === "ID" && index + 1}
                          {col.name === "Farmer Name" && farmer.name}
                          {col.name === "Father Name" && farmer.fatherName}
                          {col.name === "Gender" && farmer.gender}
                          {col.name === "Mobile Number" && farmer.mobileNumber}
                          {col.name === "Whatsapp Number" && farmer.whatsappNumber}
                          {col.name === "Imo Number" && farmer.imoNumber}
                          {col.name === "Messenger ID" && farmer.messengerId}
                          {col.name === "Email" && farmer.email}
                          {col.name === "Alternate Contact" && farmer.alternateContact}
                          {/* {col.name === "National ID" && farmer.nationalId}
                          {col.name === "Agriculture Card" && farmer.agrilCard} */}
                          {col.name === "Education Status" && farmer.educationStatus}
                          {col.name === "Village" && farmer.village}
                          {col.name === "Block" && farmer.block}
                          {col.name === "Union" && farmer.union}
                          {col.name === "Upazila" && farmer.upazila}
                          {col.name === "District" && farmer.district}
                          {col.name === "Division" && farmer.division}
                          {col.name === "Region" && farmer.region}
                          {/* {col.name === "Coordinates" && farmer.coordinates} */}
                          {col.name === "Hotspot" && farmer.hotspot && farmer.hotspot.join(", ")}
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
                          {col.name === "Action" && (
                            <div className="flex space-x-2">
                              <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => handleEdit(farmer)}>
                                <FaEdit />
                              </button>
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
        </div>

        {/* Column Modal */}
        {isColumnModalOpen && (
          <div className="fixed inset-0  z-[999] bg-black bg-opacity-50 flex items-center justify-end">
            <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/3 lg:w-1/3">
              <h3 className="text-lg font-semibold mb-4">Select Columns</h3>
              <ul className="space-y-2 max-h-[50vh] overflow-y-scroll">
                {columns.map((col) => (
                  <li key={col.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={col.visible}
                      onChange={() => handleColumnToggle(col.name)}
                    />
                    <span>{col.name}</span>
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={toggleColumnModal}
              >
                Close
              </button>
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
              <form>
                {/* Step 1: Farmer Identification */}
                <div className={`space-y-4 ${currentStep === 1 ? "" : "hidden"}`}>
                  <h1 className="text-xl">Personal Information</h1>
                  <input
                    type="text"
                    name="name"
                    placeholder="Farmer's Name"
                    className="border w-full p-2 rounded"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="Father's Name"
                    className="border w-full p-2 rounded"
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
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
                    type="number"
                    name="age"
                    placeholder="Age"
                    className="border w-full p-2 rounded"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    className="border w-full p-2 rounded"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="whatsappNumber"
                    placeholder="WhatsApp Number"
                    className="border w-full p-2 rounded"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="imoNumber"
                    placeholder="IMO Number"
                    className="border w-full p-2 rounded"
                    value={formData.imoNumber}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="messengerId"
                    placeholder="Messenger ID"
                    className="border w-full p-2 rounded"
                    value={formData.messengerId}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border w-full p-2 rounded"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="alternateContact"
                    placeholder="Alternate Contact"
                    className="border w-full p-2 rounded"
                    value={formData.alternateContact}
                    onChange={handleChange}
                  />
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
                  <input
                    type="text"
                    name="village"
                    placeholder="Village/Locality"
                    className="border w-full p-2 rounded"
                    value={formData.village}
                    onChange={handleChange}
                  />
                </div>

                {/* Step 3: Rice Crop Details */}
                <div className={`space-y-4 ${currentStep === 2 ? "" : "hidden"}`}>
                  <h1 className="text-xl">Farming Information</h1>
                  <input
                    type="text"
                    name="farmSize"
                    placeholder="Farm Size (in acres/hectares)"
                    className="border w-full p-2 rounded"
                    value={formData.farmSize}
                    onChange={handleChange}
                  />
                  <select
                    name="landType"
                    className="border w-full p-2 rounded"
                    value={formData.landType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Land Type</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedseason.map((seasonName) => (
                      <div key={seasonName} className="flex items-center bg-gray-200 p-1 rounded">
                        <span>{seasonName}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => handleDelete(seasonName)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <select
                    name="cultivationSeason"
                    className="border w-full p-2 rounded"
                    value={formData.cultivationSeason}
                    onChange={handleSelect}
                    required
                  >
                    <option value="">Select Season</option>
                    <option value="aus">Aus</option>
                    <option value="aman">Aman</option>
                    <option value="boro">Boro</option>
                  </select>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedcrop.map((seasonName) => (
                      <div key={seasonName} className="flex items-center bg-gray-200 p-1 rounded">
                        <span>{seasonName}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => handleDeleteCrops(seasonName)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <select
                    name="majorCrops"
                    className="border w-full p-2 rounded"
                    value={formData.majorCrops}
                    onChange={handleselectCrops}
                  >
                    <option value="">Select Major Crops</option>
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="maize">Maize</option>
                    <option value="vegetables">Vegetables</option>
                  </select>

                  <select
                    name="plantingMethod"
                    className="border w-full p-2 rounded"
                    value={formData.plantingMethod}
                    onChange={handleChange}
                  >
                    <option value="">Select Planting Method</option>
                    <option value="directSeeding">Direct Seeding</option>
                    <option value="transplanting">Transplanting</option>
                  </select>

                  <select
                    name="irrigationPractices"
                    className="border w-full p-2 rounded"
                    value={formData.irrigationPractices}
                    onChange={handleChange}
                  >
                    <option value="">Select Irrigation Practices</option>
                    <option value="AWD">AWD</option>
                    <option value="continuousFlooding">Continuous Flooding</option>
                    <option value="others">Others</option>
                  </select>
                  {
                    formData.irrigationPractices === "others" && (
                      <input
                        type="text"
                        name="irrigationPracticesOthers"
                        placeholder="Others"
                        className="border w-full p-2 rounded"
                        value={otherIrrigation}
                        onChange={(e) => setOtherIrrigation(e.target.value)}
                      />
                    )
                  }
                  <select
                    name="soilType"
                    className="border w-full p-2 rounded"
                    value={formData.soilType}
                    onChange={handleChange}
                  >
                    <option value="">Select Soil Type</option>
                    <option value="clay">Clay</option>
                    <option value="clayLoam">Clay Loam</option>
                    <option value="sandy">Sandy</option>
                    <option value="silt">Silt</option>
                    <option value="sandyLoam">Sandy Loam</option>
                    <option value="others">Others</option>
                  </select>
                  {
                    formData.soilType === "others" && (
                      <input
                        type="text"
                        name="soilTypeOthers"
                        placeholder="Others"
                        className="border w-full p-2 rounded"
                        value={otherSoilType}
                        onChange={(e) => setOtherSoilType(e.target.value)}
                      />
                    )
                  }
                  <input
                    type="text"
                    name="croppingPattern"
                    placeholder="Cropping Pattern"
                    className="border w-full p-2 rounded"
                    value={formData.croppingPattern}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="riceVarieties"
                    placeholder="Rice Varieties"
                    className="border w-full p-2 rounded"
                    value={formData.riceVarieties}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="fertilizerUsage"
                    placeholder="total Urea usage (kg)/season"
                    className="border w-full p-2 rounded"
                    value={formData.fertilizerUsage}
                    onChange={handleChange}
                  />

                </div>

              </form>

              {/* Navigation Buttons */}
              <div className="flex justify-between space-x-4 mt-4">
                <button
                  className={`bg-gray-400 text-white px-4 py-2 rounded ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-500"
                    }`}
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>
                {currentStep === 2 ?
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={registerFarmer}
                  >
                    Submit
                  </button> :
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={nextStep}
                  >
                    Next
                  </button>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerRegistration
