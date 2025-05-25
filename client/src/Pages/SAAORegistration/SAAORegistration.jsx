import { useEffect, useState } from "react";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import { ChevronsUpDown } from "lucide-react";
import { AuthContext } from "../../Components/context/AuthProvider";
import { useContext } from "react";
const SAAORegistration = () => {
  const { rolePermission } = useContext(AuthContext);
  const [isSAAOModalOpen, setIsSAAOModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [SAAOList, setSAAOList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [regions, setRegions] = useState([]);
  const [hotspot, setHotspot] = useState([]);
  const [selectedHotspots, setSelectedHotspots] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);
  const [block, setBlock] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [irrigationPracticesOthers, setIrrigationPracticesOthers] = useState("");
  const [otherSoilType, setOtherSoilType] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMajorCrop, setSelectedMajorCrop] = useState([]);
  const [isOtherMajorCropOpen, setIsOtherMajorCropOpen] = useState(false);
  const [selectedMajorCropOthers, setSelectedMajorCropOthers] = useState("");
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
    // nationalId: "",
    // Location Information
    upazila: "",
    district: "",
    division: "",
    region: "",
    coordinates: "",
    landType: "",
    hotspot: selectedHotspots,
    majorCrops: selectedMajorCrop.join(", "),
    irrigationPractices: "",
    plantingMethods: "",
    croppingPattern: "",
    riceVarieties: "",
    role: "saao",
  });
  useEffect(() => {
    if (!formData.upazila || !formData.district || !formData.division || !formData.region || !selectedHotspots) return; // Prevent unnecessary API calls

    const fetchUnion = async () => {
      try {
        const response = await fetch(`https://iinms.brri.gov.bd/api/data/unions?upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots}`);
        if (!response.ok) {
          throw new Error("Failed to fetch union data");
        }
        const data = await response.json();
        setUnions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching union data:", error);
      }
    };

    fetchUnion();
  }, [formData.upazila, formData.district, formData.division, formData.region, selectedHotspots]);
  useEffect(() => {
    if (!formData.union || !formData.upazila || !formData.district || !formData.division || !formData.region || !selectedHotspots) return; // Prevent unnecessary API calls

    const fetchBlock = async () => {
      try {
        const response = await fetch(`https://iinms.brri.gov.bd/api/data/blocks?union=${formData.union}&upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots}`);
        if (!response.ok) {
          throw new Error("Failed to fetch block data");
        }
        const data = await response.json();
        setBlock(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };

    fetchBlock();
  }, [formData.union, formData.upazila, formData.district, formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.district || !formData.division || !formData.region || !selectedHotspots) return; // Prevent unnecessary API calls

    const fetchUpazila = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/upazilas?district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch upazila data");
        }
        const data = await response.json();
        setUpazilas(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching upazila data:", error);
      }
    };

    fetchUpazila();
  }, [formData.district, formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.region || !selectedHotspots) return; // Prevent unnecessary API calls 

    const fetchDivision = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/divisions?region=${formData.region}&hotspot=${selectedHotspots}`
        );
        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to fetch division data");
        }
        const data = await response.json();
        console.log(data);

        setDivisions(
          data.sort((a, b) => a.localeCompare(b))
        );
      } catch (error) {
        console.error("Error fetching division data:", error);
      }
    };

    fetchDivision();
  }, [formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.division || !formData.region || !selectedHotspots) return; // Prevent unnecessary API calls

    const fetchDistrict = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/districts?division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch district data");
        }
        const data = await response.json();
        setDistricts(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching district data:", error);
      }
    };

    fetchDistrict();
  }, [formData.division, formData.region, selectedHotspots]);
  useEffect(() => {
    if (!selectedHotspots) return; // Prevent unnecessary API calls

    const fetchRegion = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/regions?hotspot=${selectedHotspots}`
        );
        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to fetch region data");
        }
        const data = await response.json();
        console.log(data);

        setRegions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching region data:", error);
      }
    };

    fetchRegion();
  }, [selectedHotspots]);
  // Base API URL
  const API_URL = "https://iinms.brri.gov.bd/api/hotspots";

  // Fetch all hotspots
  const fetchRoles = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setHotspot(data.reverse());
    } catch (error) {
      console.error("Error fetching hotspots:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setFormData({ ...formData, coordinates: `${lat}, ${lon}` });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to fetch location. Please enable GPS.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  const fetchSAAOs = async () => {
    try {
      const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/role/saao?page=${page}&limit=${rowsPerPage}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSAAOList(data.data);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalFarmers: data.pagination.totalFarmers,
          limit: data.pagination.limit,
        });
      } else {
        throw new Error("Failed to fetch SAAOs");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchSAAOs();
  }, [page, rowsPerPage]);
  // Define the available columns and their initial visibility state
  const initialColumns = [
    { name: "ID", visible: true },
    { name: "SAAO Name", visible: true },
    { name: "Father Name", visible: true },
    { name: "Gender", visible: true },
    { name: "Mobile Number", visible: true },
    { name: "Whatsapp Number", visible: true },
    { name: "Imo Number", visible: true },
    { name: "Messenger ID", visible: true },
    { name: "Email", visible: true },
    { name: "Alternate Contact", visible: true },
    // { name: "National ID", visible: true },
    // Location Information
    { name: "Block", visible: true },
    { name: "Union", visible: true },
    { name: "Upazila", visible: true },
    { name: "District", visible: true },
    { name: "Division", visible: true },
    { name: "Region", visible: true },
    // { name: "Coordinates", visible: true },
    { name: "Hotspot", visible: true },
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
  const toggleSAAOModal = () => {
    setIsSAAOModalOpen(!isSAAOModalOpen);
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
    setIsSAAOModalOpen(false);
  };
  const registerSAAO = async () => {

    if (formData.soilType === "others") {
      formData.soilType = otherSoilType;
    }
    if (formData.irrigationPractices === "others") {
      formData.irrigationPractices = irrigationPracticesOthers;
    }
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
        setIsSAAOModalOpen(false);
        setIsEdit(false); // reset edit mode
        console.log("SAAO saved successfully:", data);
        fetchSAAOs(); // Refresh the list
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
        fetchSAAOs(); // Refresh the list
      } else {
        throw new Error("Failed to delete SAAO");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Filter SAAOList based on search text
  const filteredSAAOs = SAAOList.filter((SAAO) => {
    return (
      SAAO.name.toLowerCase().includes(searchText.toLowerCase()) ||
      SAAO.mobileNumber.includes(searchText) ||
      SAAO.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });


  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    // Check if the value is already selected
    if (!selectedHotspots.includes(selectedValue)) {
      const updatedHotspots = [...selectedHotspots, selectedValue];
      setSelectedHotspots(updatedHotspots);
      setFormData({
        ...formData,
        hotspot: updatedHotspots, // Update the formData with the new hotspots list
      });
    }
  }
  const handleDelete = (valueToDelete) => {
    // Remove selected value
    const updatedHotspot = selectedHotspots.filter((value) => value !== valueToDelete);
    setSelectedHotspots(updatedHotspot);
  };

  const handleEdit = (SAAO) => {
    setIsEdit(true);
    setIsSAAOModalOpen(true);
    console.log(SAAO);
    
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
      block: SAAO.block || "",
      union: SAAO.union || "",
      upazila: SAAO.upazila || "",
      district: SAAO.district || "",
      division: SAAO.division || "",
      region: SAAO.region || "",
      coordinates: SAAO.coordinates || "",
      majorCrops: SAAO.majorCrops || "",
      plantingMethod: SAAO.plantingMethod || "",
      irrigationPractices: SAAO.irrigationPractices || "",
      croppingPattern: SAAO.croppingPattern || "",
      riceVarieties: SAAO.riceVarieties || "",
      soilType: SAAO.soilType || "",
      landType: SAAO.landType || "",
      hotspot: SAAO.hotspot || [],
      role: SAAO.role || "saao", // defaulting to "saao"
    });
    setSelectedHotspots(SAAO.hotspot || []);
    setSelectedId(SAAO.id);
  };

  const handleSelectCrop = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "others") {
      setIsOtherMajorCropOpen(true);
      return;
    }
    // Check if the value is already selected
    if (!selectedMajorCrop.includes(selectedValue)) {
      const updatedSelectedMajorCrop = [...selectedMajorCrop, selectedValue];
      setSelectedMajorCrop(updatedSelectedMajorCrop);
      setFormData({
        ...formData,
        majorCrops: updatedSelectedMajorCrop.join(', '), // Convert array to string (comma-separated)
      });
    }
  }
  const handleDeleteCrop = (valueToDelete) => {
    // Remove selected value
    const updatedSelectedMajorCrop = selectedMajorCrop.filter((value) => value !== valueToDelete);
    setSelectedMajorCrop(updatedSelectedMajorCrop);
  };
  const handleAddCrop = () => {
    setSelectedMajorCrop([...selectedMajorCrop, selectedMajorCropOthers]);
    setIsOtherMajorCropOpen(false);
    setSelectedMajorCropOthers("");
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">

      {/* Main Content */}
      <main className=" md:p-6 lg:p-8">
        <div className="container mx-auto bg-white rounded-lg shadow-md p-6 ">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">SAAO List</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={toggleSAAOModal}
            >
              + Add SAAO
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
                        className={`border px-4 py-2 ${index === 0 ? "sticky left-0 bg-gray-50" : ""}`}
                        style={{ width: "150px" }} // Apply fixed width to each header
                      >
                        <p className="flex items-center justify-between">
                          {col.name} <ChevronsUpDown size={14} />
                        </p>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {filteredSAAOs.slice(0, rowsPerPage).map((SAAO, rowIndex) => (
                  <tr key={SAAO.id} className="text-sm" style={{ height: "50px" }}>
                    {columns
                      .filter((col) => col.visible)
                      .map((col, index) => (
                        <td
                          key={col.name}
                          className={`border px-4 py-2 ${index === 0 ? "sticky left-0" : ""} ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} ${index === 3 ? 'capitalize' : ''}`}
                          style={{ width: "150px" }} // Apply fixed width to each column in body
                        >
                          {col.name === "ID" && (
                            pagination?.currentPage === 1 ? rowIndex + 1 : (pagination?.currentPage - 1) * rowsPerPage + rowIndex + 1
                          )}
                          {col.name === "SAAO Name" && SAAO.name}
                          {col.name === "Father Name" && SAAO.fatherName}
                          {col.name === "Gender" && SAAO.gender}
                          {col.name === "Mobile Number" && SAAO.mobileNumber}
                          {col.name === "Whatsapp Number" && SAAO.whatsappNumber}
                          {col.name === "Imo Number" && SAAO.imoNumber}
                          {col.name === "Messenger ID" && SAAO.messengerId}
                          {col.name === "Email" && SAAO.email}
                          {col.name === "Alternate Contact" && SAAO.alternateContact}
                          {/* {col.name === "National ID" && SAAO.nationalId} */}
                          {col.name === "Agriculture Card" && SAAO.agrilCard}
                          {col.name === "Block" && SAAO.block}
                          {col.name === "Union" && SAAO.union}
                          {col.name === "Upazila" && SAAO.upazila}
                          {col.name === "District" && SAAO.district}
                          {col.name === "Division" && SAAO.division}
                          {col.name === "Region" && SAAO.region}
                          {/* {col.name === "Coordinates" && SAAO.coordinates} */}
                          {col.name === "Hotspot" && SAAO.hotspot && SAAO?.hotspot}
                          {col.name === "Action" && (
                            <div className="flex space-x-2">
                              {rolePermission["SAAO Edit"] === true && (
                                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => handleEdit(SAAO)}>
                                  <FaEdit />
                                </button>
                              )}
                              {rolePermission["SAAO Delete"] === true && (
                                <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDeleteSAAO(SAAO.id)}>
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


        {/* SAAO Modal */}
        {isSAAOModalOpen && (
          <div className=" fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative max-h-[90vh] overflow-y-scroll  bg-white p-6 rounded-lg shadow-lg w-full  md:w-2/3 lg:w-2/3">
              <h3 className="text-lg font-bold mb-4 text-center">SAAO Registration</h3>
              <button
                className="absolute top-2 right-5 text-xl text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                &times;
              </button>
              <form>
                {/* Step 1: SAAO Identification */}
                <div className={`space-y-4 ${currentStep === 1 ? "" : "hidden"}`}>
                  <input
                    type="text"
                    name="name"
                    placeholder="SAAO's Name"
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
                    placeholder="Official Contact"
                    className="border w-full p-2 rounded"
                    value={formData.alternateContact}
                    onChange={handleChange}
                  />
                </div>
                {/* Step 2: Location Information */}
                <div className={`space-y-4 ${currentStep === 2 ? "" : "hidden"}`}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedHotspots.map((hotspotName) => (
                      <div key={hotspotName} className="flex items-center bg-gray-200 p-1 rounded">
                        <span>{hotspotName}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => handleDelete(hotspotName)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <select
                    name="hotspot"
                    className="border w-full p-2 rounded"
                    value=""
                    onChange={handleSelect}
                    required
                  >
                    <option value="">Select Hotspot</option>
                    {hotspot?.map((hotspot) => (
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
                    {regions?.map((hotspot) => (
                      <option key={hotspot} value={hotspot}>
                        {hotspot}
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
                    required
                  >
                    <option value="">Select Upazila</option>
                    {upazilas?.map((upazila) => (
                      <option key={upazila} value={upazila}>
                        {upazila}
                      </option>
                    ))}
                  </select>
                  <select
                    name="union"
                    className="border w-full p-2 rounded"
                    value={formData.union}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Union</option>
                    {unions?.map((union) => (
                      <option key={union} value={union}>
                        {union}
                      </option>
                    ))}
                  </select>
                  <select
                    name="block"
                    className="border w-full p-2 rounded"
                    value={formData.block}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Block</option>
                    {block?.map((block) => (
                      <option key={block} value={block}>
                        {block}
                      </option>
                    ))}
                  </select>
                  {/* <div className="flex gap-2">
                    <input
                      type="text"
                      name="coordinates"
                      placeholder="Coordinates (e.g., Latitude, Longitude)"
                      className="border w-full p-2 rounded"
                      value={formData.coordinates}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="text-blue-500 text-white  rounded"
                      onClick={handleUseMyLocation}
                    >
                      <MdGpsFixed className="text-blue-500" />
                    </button>
                  </div> */}
                </div>
                <div className={`space-y-4 ${currentStep === 3 ? "" : "hidden"}`}>
                  <h1 className="text-xl">Farming Information</h1>
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
                  {
                    selectedMajorCrop.length > 0 ? (
                      <div className="flex flex-wrap gap-2 ">
                        {selectedMajorCrop.map((selectedcrop) => (
                          <div key={selectedcrop} className="flex items-center bg-gray-200 p-1 rounded">
                            <span>{selectedcrop}</span>
                            <button
                              type="button"
                              className="ml-2 text-red-500"
                              onClick={() => handleDeleteCrop(selectedcrop)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null
                  }
                  <select
                    name="majorCrops"
                    className="border w-full p-2 rounded"
                    value={formData.majorCrops}
                    onChange={handleSelectCrop}
                  >
                    <option value="">Select Major Crops</option>
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="maize">Maize</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="others">Others</option>
                  </select>
                  {
                    isOtherMajorCropOpen ? (
                      <div>
                        <label className="block mt-4" htmlFor="">Other Diseases</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="otherDiseases"
                            placeholder=""
                            className="border w-full p-2 rounded"
                            value={selectedMajorCropOthers}
                            onChange={(e) => setSelectedMajorCropOthers(e.target.value)}
                          />
                          <button className="btn-sm w-[30%] bg-gray-500 text-white font-bold py-2 px-4 rounded" onClick={handleAddCrop}>Add Diseases</button>
                        </div>
                      </div>

                    ) : null
                  }
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
                    <option value="">Select Major Irrigation Practices</option>
                    <option value="AWD">AWD</option>
                    <option value="continuousFlooding">Continuous Flooding</option>
                    <option value="others">Others</option>
                  </select>
                  {
                    formData.irrigationPractices === "others" && (
                      <input
                        type="text"
                        name="irrigationPractices"
                        placeholder=" Other Major Irrigation Practices"
                        className="border w-full p-2 rounded"
                        value={irrigationPracticesOthers}
                        onChange={(e) => setIrrigationPracticesOthers(e.target.value)}
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
                        name="soilType"
                        placeholder="Other Soil Type"
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
                {currentStep === 3 ?
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={registerSAAO}
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

export default SAAORegistration
