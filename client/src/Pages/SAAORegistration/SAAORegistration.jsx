import { useEffect, useState, useContext } from "react";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import { ChevronsUpDown } from "lucide-react";
import { AuthContext, useAuthContext } from "../../Components/context/AuthProvider";
import { Parser } from "@json2csv/plainjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '/logo.png';

const SAAORegistration = () => {
  const { rolePermission } = useContext(AuthContext);
  const { authUser } = useAuthContext();
  const [isSAAOModalOpen, setIsSAAOModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [SAAOList, setSAAOList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [regions, setRegions] = useState([]);
  const [hotspot, setHotspot] = useState([]);
  const [selectedHotspots, setSelectedHotspots] = useState([]);
  const [selectedHotspotFilter, setSelectedHotspotFilter] = useState(""); // New state for hotspot filter
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
    upazila: "",
    district: "",
    division: "",
    region: "",
    coordinates: "",
    landType: "",
    hotspot: selectedHotspots,
    majorCrops: selectedMajorCrop.join(", "),
    irrigationPractices: "",
    plantingMethod: "",
    croppingPattern: "",
    riceVarieties: "",
    soilType: "",
    role: "saao",
  });

  // Fetch location data
  useEffect(() => {
    if (!formData.upazila || !formData.district || !formData.division || !formData.region || !selectedHotspots) return;
    const fetchUnion = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/unions?upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}region=${formData.region}&hotspot=${selectedHotspots}`
        );
        if (!response.ok) throw new Error("Failed to fetch union data");
        const data = await response.json();
        setUnions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching union data:", error);
      }
    };
    fetchUnion();
  }, [formData.upazila, formData.district, formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.union || !formData.upazila || !formData.district || !formData.division || !formData.region || !selectedHotspots) return;
    const fetchBlock = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/blocks?union=${formData.union}&upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}region=${formData.region}&hotspot=${selectedHotspots}`
        );
        if (!response.ok) throw new Error("Failed to fetch block data");
        const data = await response.json();
        setBlock(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };
    fetchBlock();
  }, [formData.union, formData.upazila, formData.district, formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.district || !formData.division || !formData.region || !selectedHotspots) return;
    const fetchUpazila = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/upazilas?district=${formData.district}&division=${formData.division}region=${formData.region}&hotspot=${selectedHotspots}`
        );
        if (!response.ok) throw new Error("Failed to fetch upazila data");
        const data = await response.json();
        setUpazilas(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching upazila data:", error);
      }
    };
    fetchUpazila();
  }, [formData.district, formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.region || !selectedHotspots) return;
    const fetchDivision = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/divisions?region=${formData.region}&hotspot=${selectedHotspots}`
        );
        if (!response.ok) throw new Error("Failed to fetch division data");
        const data = await response.json();
        setDivisions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching division data:", error);
      }
    };
    fetchDivision();
  }, [formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.division || !formData.region || !selectedHotspots) return;
    const fetchDistrict = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/districts?division=${formData.division}®ion=${formData.region}&hotspot=${selectedHotspots}`
        );
        if (!response.ok) throw new Error("Failed to fetch district data");
        const data = await response.json();
        setDistricts(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching district data:", error);
      }
    };
    fetchDistrict();
  }, [formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    if (!selectedHotspots) return;
    const fetchRegion = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/regions?hotspot=${selectedHotspots}`
        );
        if (!response.ok) throw new Error("Failed to fetch region data");
        const data = await response.json();
        setRegions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching region data:", error);
      }
    };
    fetchRegion();
  }, [selectedHotspots]);

  // Fetch all hotspots
  const fetchRoles = async () => {
    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/hotspots");
      const data = await response.json();
      setHotspot(data.reverse());
    } catch (error) {
      console.error("Error fetching hotspots:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch SAAOs with hotspot filter
  const fetchSAAOs = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: rowsPerPage,
        search: searchText,
      });
      if (selectedHotspotFilter) {
        queryParams.append("hotspot", selectedHotspotFilter);
      }
      const response = await fetch(
        `https://iinms.brri.gov.bd/api/farmers/farmers/role/saao?${queryParams.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
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
      alert("Failed to fetch SAAOs. Please try again.");
    }
  };

  useEffect(() => {
    fetchSAAOs();
  }, [page, rowsPerPage, searchText, selectedHotspotFilter]);

  // Column key mapping
  const columnKeyMap = {
    ID: "id",
    "SAAO Name": "name",
    "Father Name": "fatherName",
    Gender: "gender",
    "Mobile Number": "mobileNumber",
    "Whatsapp Number": "whatsappNumber",
    "Imo Number": "imoNumber",
    "Messenger ID": "messengerId",
    Email: "email",
    "Alternate Contact": "alternateContact",
    Block: "block",
    Union: "union",
    Upazila: "upazila",
    District: "district",
    Division: "division",
    Region: "region",
    Hotspot: "hotspot",
  };

  // Define columns
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
    { name: "Block", visible: true },
    { name: "Union", visible: true },
    { name: "Upazila", visible: true },
    { name: "District", visible: true },
    { name: "Division", visible: true },
    { name: "Region", visible: true },
    { name: "Hotspot", visible: true },
    { name: "Action", visible: true },
  ];

  const [columns, setColumns] = useState(initialColumns);

  // Handle column visibility toggle
  const toggleColumnModal = () => setIsColumnModalOpen(!isColumnModalOpen);

  const handleColumnToggle = (columnName) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.name === columnName ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // Handle hotspot filter change
  const handleHotspotFilterChange = (e) => {
    setSelectedHotspotFilter(e.target.value);
    setPage(1); 
  };

  // Copy to Clipboard
  const handleCopy = async () => {
    try {
      const visibleColumns = columns.filter((col) => col.visible && col.name !== "Action");
      const header = visibleColumns.map((col) => col.name).join("\t");
      const rows = SAAOList.slice(0, rowsPerPage).map((saao, index) =>
        visibleColumns
          .map((col) => {
            if (col.name === "ID") {
              return pagination.currentPage === 1
                ? index + 1
                : (pagination.currentPage - 1) * rowsPerPage + index + 1;
            }
            const actualKey = columnKeyMap[col.name];
            return actualKey ? (Array.isArray(saao[actualKey]) ? saao[actualKey].join(", ") : saao[actualKey] || "") : "";
          })
          .join("\t")
      );
      const text = `${header}\n${rows.join("\n")}`;
      await navigator.clipboard.writeText(text);
      alert("Table data copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Failed to copy data to clipboard. Please try again.");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    try {
      const visibleColumns = columns.filter((col) => col.visible && col.name !== "Action");
      const fields = visibleColumns.map((col) => ({
        label: col.name,
        value: col.name.toLowerCase().replace(/\s+/g, ""),
      }));
      const data = SAAOList.slice(0, rowsPerPage).map((saao, index) => {
        const row = {};
        visibleColumns.forEach((col) => {
          const keyAlias = col.name.toLowerCase().replace(/\s+/g, "");
          const actualKey = columnKeyMap[col.name];
          if (col.name === "ID") {
            row[keyAlias] =
              pagination.currentPage === 1
                ? index + 1
                : (pagination.currentPage - 1) * rowsPerPage + index + 1;
          } else {
            row[keyAlias] = actualKey
              ? Array.isArray(saao[actualKey])
                ? saao[actualKey].join(", ")
                : saao[actualKey] || ""
              : "";
          }
        });
        return row;
      });
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "saaos.csv";
      link.click();
    } catch (error) {
      console.error("CSV export failed:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 12;

      doc.setFontSize(12);
      doc.setTextColor(50);
      doc.setFont("helvetica", "bold");
      doc.addImage(logo, "PNG", margin, 16, 15, 15);
      doc.text("Bangladesh Rice Research Institute (BRRI)", margin + 18, 15);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Gazipur-1701", margin + 18, 20);
      doc.text("Contact Agromet Lab", margin + 18, 25);
      doc.setFontSize(10);
      doc.setTextColor(50);
      doc.setFont("helvetica", "normal");
      doc.text("Email: info.brriagromet@gmail.com", margin + 18, 30);
      doc.text("Mobile: 09644300300", margin + 18, 35);

      const date = new Date();
      const formattedDate = date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      doc.text(formattedDate, pageWidth - margin, 35, { align: "right" });

      const visibleColumns = columns.filter((col) => col.visible && col.name !== "Action");
      const headers = visibleColumns.map((col) => col.name);
      const data = SAAOList.slice(0, rowsPerPage).map((saao, index) =>
        visibleColumns.map((col) => {
          if (col.name === "ID") {
            return pagination.currentPage === 1
              ? index + 1
              : (pagination.currentPage - 1) * rowsPerPage + index + 1;
          }
          const key = columnKeyMap[col.name];
          return key ? (Array.isArray(saao[key]) ? saao[key].join(", ") : saao[key] || "") : "";
        })
      );

      autoTable(doc, {
        startY: 40,
        head: [headers],
        body: data,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 3,
          cellPadding: 1,
          textColor: [50, 50, 50],
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 40, left: margin, right: margin, bottom: 20 },
        didDrawPage: (data) => {
          doc.addImage(logo, "PNG", margin, 16, 15, 15);
          doc.setFontSize(12);
          doc.setTextColor(50);
          doc.setFont("helvetica", "bold");
          doc.text("Bangladesh Rice Research Institute (BRRI)", margin + 18, 15);
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text("Gazipur-1701", margin + 18, 20);
          doc.text("Contact Agromet Lab", margin + 18, 25);
          doc.setFontSize(10);
          doc.setTextColor(50);
          doc.setFont("helvetica", "normal");
          doc.text("Email: info.brriagromet@gmail.com", margin + 18, 30);
          doc.text("Mobile: 09644300300", margin + 18, 35);
          doc.text(formattedDate, pageWidth - margin, 35, { align: "right" });

          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 12, { align: "center" });
          doc.text("© 2025 Smart Agro-Advisory Dissemination System.", margin, pageHeight - 6);
          doc.text("Generated by: " + (authUser?.name || "Admin"), pageWidth - margin, pageHeight - 6, { align: "right" });
        },
      });

      doc.save("saaos-report.pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

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

  const toggleSAAOModal = () => {
    setIsSAAOModalOpen(!isSAAOModalOpen);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      name: "",
      fatherName: "",
      gender: "",
      mobileNumber: "",
      whatsappNumber: "",
      imoNumber: "",
      messengerId: "",
      email: "",
      alternateContact: "",
      upazila: "",
      district: "",
      division: "",
      region: "",
      coordinates: "",
      landType: "",
      hotspot: [],
      majorCrops: "",
      irrigationPractices: "",
      plantingMethod: "",
      croppingPattern: "",
      riceVarieties: "",
      soilType: "",
      role: "saao",
    });
    setSelectedHotspots([]);
    setSelectedMajorCrop([]);
    setIsEdit(false);
    setSelectedId(null);
    setIrrigationPracticesOthers("");
    setOtherSoilType("");
    setIsOtherMajorCropOpen(false);
    setSelectedMajorCropOthers("");
  };

  const closeModal = () => {
    setIsSAAOModalOpen(false);
    resetForm();
  };

  const registerSAAO = async () => {
    if (formData.mobileNumber.length < 11) return alert("Mobile number must be 11 digits long.");
    if (formData.whatsappNumber && formData.whatsappNumber.length < 11)
      return alert("WhatsApp number must be 11 digits long.");
    if (formData.imoNumber && formData.imoNumber.length < 11)
      return alert("IMO number must be 11 digits long.");
    if (formData.alternateContact && formData.alternateContact.length < 11)
      return alert("Alternate contact number must be 11 digits long.");

    const submissionData = {
      ...formData,
      hotspot: selectedHotspots,
      majorCrops: selectedMajorCrop.join(", "),
      soilType: formData.soilType === "others" ? otherSoilType : formData.soilType,
      irrigationPractices:
        formData.irrigationPractices === "others" ? irrigationPracticesOthers : formData.irrigationPractices,
    };

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
        setIsSAAOModalOpen(false);
        resetForm();
        fetchSAAOs();
      } else {
        throw new Error("Failed to save SAAO");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save SAAO. Please check the data and try again.");
    }
  };

  const handleDeleteSAAO = async (id) => {
    if (!window.confirm("Are you sure you want to delete this SAAO?")) return;

    try {
      const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSAAOs();
      } else {
        throw new Error("Failed to delete SAAO");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete SAAO. Please try again.");
    }
  };

  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    if (!selectedHotspots.includes(selectedValue)) {
      const updatedHotspots = [...selectedHotspots, selectedValue];
      setSelectedHotspots(updatedHotspots);
      setFormData({ ...formData, hotspot: updatedHotspots });
    }
  };

  const handleDelete = (valueToDelete) => {
    const updatedHotspot = selectedHotspots.filter((value) => value !== valueToDelete);
    setSelectedHotspots(updatedHotspot);
    setFormData({ ...formData, hotspot: updatedHotspot });
  };

  const handleEdit = (SAAO) => {
    setIsEdit(true);
    setIsSAAOModalOpen(true);
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
      role: "saao",
    });
    setSelectedHotspots(Array.isArray(SAAO.hotspot) ? SAAO.hotspot : SAAO.hotspot ? SAAO.hotspot.split(", ") : []);
    setSelectedMajorCrop(SAAO.majorCrops ? SAAO.majorCrops.split(", ") : []);
    setIrrigationPracticesOthers(SAAO.irrigationPractices || "");
    setOtherSoilType(SAAO.soilType || "");
  };

  const handleSelectCrop = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "others") {
      setIsOtherMajorCropOpen(true);
      return;
    }
    if (!selectedMajorCrop.includes(selectedValue)) {
      const updatedSelectedMajorCrop = [...selectedMajorCrop, selectedValue];
      setSelectedMajorCrop(updatedSelectedMajorCrop);
      setFormData({ ...formData, majorCrops: updatedSelectedMajorCrop.join(", ") });
    }
  };

  const handleDeleteCrop = (valueToDelete) => {
    const updatedSelectedMajorCrop = selectedMajorCrop.filter((value) => value !== valueToDelete);
    setSelectedMajorCrop(updatedSelectedMajorCrop);
    setFormData({ ...formData, majorCrops: updatedSelectedMajorCrop.join(", ") });
  };

  const handleAddCrop = () => {
    if (selectedMajorCropOthers.trim()) {
      const updatedSelectedMajorCrop = [...selectedMajorCrop, selectedMajorCropOthers];
      setSelectedMajorCrop(updatedSelectedMajorCrop);
      setFormData({ ...formData, majorCrops: updatedSelectedMajorCrop.join(", ") });
      setIsOtherMajorCropOpen(false);
      setSelectedMajorCropOthers("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <main className="md:p-6 lg:p-8">
        <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">SAAO List</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={toggleSAAOModal}
            >
              + Add SAAO
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full space-y-3 md:space-y-0">
            <div className="flex flex-col md:flex-row w-full  space-y-3 md:space-y-0 md:space-x-3 ">
              <input
                type="text"
                placeholder="Search by Name, Phone, or Block"
                className="border rounded px-4 py-2 w-full md:w-1/2 lg:w-1/3"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <select
                className="border rounded px-4 py-2 w-full md:w-1/4 lg:w-1/5"
                value={selectedHotspotFilter}
                onChange={handleHotspotFilterChange}
              >
                <option value="">All Hotspots</option>
                {hotspot?.map((hotspot) => (
                  <option key={hotspot.id} value={hotspot.name}>
                    {hotspot.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-2">
              <input
                type="number"
                className="border rounded px-4 py-2"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value) || 10)}
                min={1}
                placeholder="Rows per page"
              />
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100"
                onClick={handleCopy}
              >
                Copy
              </button>
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100"
                onClick={handleExportCSV}
              >
                CSV
              </button>
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100"
                onClick={handleExportPDF}
              >
                PDF
              </button>
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
                {SAAOList.slice(0, rowsPerPage).map((saao, rowIndex) => (
                  <tr key={saao.id} className="text-sm" style={{ height: "50px" }}>
                    {columns
                      .filter((col) => col.visible)
                      .map((col, index) => (
                        <td
                          key={col.name}
                          className={`border px-4 py-2 ${index === 0 ? "sticky left-0" : ""} ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } ${index === 3 ? "capitalize" : ""}`}
                          style={{ width: index === 0 ? "50px" : "150px" }}
                        >
                          {col.name === "ID" &&
                            (pagination.currentPage === 1
                              ? rowIndex + 1
                              : (pagination.currentPage - 1) * rowsPerPage + rowIndex + 1)}
                          {col.name === "SAAO Name" && saao.name}
                          {col.name === "Father Name" && saao.fatherName}
                          {col.name === "Gender" && saao.gender}
                          {col.name === "Mobile Number" && saao.mobileNumber}
                          {col.name === "Whatsapp Number" && saao.whatsappNumber}
                          {col.name === "Imo Number" && saao.imoNumber}
                          {col.name === "Messenger ID" && saao.messengerId}
                          {col.name === "Email" && saao.email}
                          {col.name === "Alternate Contact" && saao.alternateContact}
                          {col.name === "Block" && saao.block}
                          {col.name === "Union" && saao.union}
                          {col.name === "Upazila" && saao.upazila}
                          {col.name === "District" && saao.district}
                          {col.name === "Division" && saao.division}
                          {col.name === "Region" && saao.region}
                          {col.name === "Hotspot" && (Array.isArray(saao.hotspot) ? saao.hotspot.join(", ") : saao.hotspot)}
                          {col.name === "Action" && (
                            <div className="flex space-x-2">
                              {rolePermission["SAAO Edit"] && (
                                <button
                                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                  onClick={() => handleEdit(saao)}
                                >
                                  <FaEdit />
                                </button>
                              )}
                              {rolePermission["SAAO Delete"] && (
                                <button
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  onClick={() => handleDeleteSAAO(saao.id)}
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

        {isSAAOModalOpen && (
          <div className="fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative max-h-[90vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-2/3">
              <h3 className="text-lg font-bold mb-4 text-center">SAAO Registration</h3>
              <button
                className="absolute top-2 right-5 text-xl text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                ×
              </button>
              <form >
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
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    className="border w-full p-2 rounded"
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,11}$/.test(value)) handleChange(e);
                    }}
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
                    required
                  />
                  <input
                    type="tel"
                    name="whatsappNumber"
                    placeholder="WhatsApp Number"
                    className="border w-full p-2 rounded"
                    value={formData.whatsappNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,11}$/.test(value)) handleChange(e);
                    }}
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
                  />
                  <input
                    type="tel"
                    name="imoNumber"
                    placeholder="IMO Number"
                    className="border w-full p-2 rounded"
                    value={formData.imoNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,11}$/.test(value)) handleChange(e);
                    }}
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
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
                    type="tel"
                    name="alternateContact"
                    placeholder="Official Contact"
                    className="border w-full p-2 rounded"
                    value={formData.alternateContact}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,11}$/.test(value)) handleChange(e);
                    }}
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
                  />
                </div>
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="coordinates"
                      placeholder="Coordinates (Lat, Long)"
                      className="border w-full p-2 rounded"
                      value={formData.coordinates}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      onClick={handleUseMyLocation}
                    >
                      Use My Location
                    </button>
                  </div>
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
                  {selectedMajorCrop.length > 0 && (
                    <div className="flex flex-wrap gap-2">
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
                  )}
                  <select
                    name="majorCrops"
                    className="border w-full p-2 rounded"
                    value=""
                    onChange={handleSelectCrop}
                  >
                    <option value="">Select Major Crops</option>
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="maize">Maize</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="others">Others</option>
                  </select>
                  {isOtherMajorCropOpen && (
                    <div>
                      <label className="block mt-4">Other Crops</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="otherMajorCrop"
                          placeholder="Specify Other Crop"
                          className="border w-full p-2 rounded"
                          value={selectedMajorCropOthers}
                          onChange={(e) => setSelectedMajorCropOthers(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-sm w-[30%] bg-gray-500 text-white font-bold py-2 px-4 rounded"
                          onClick={handleAddCrop}
                        >
                          Add Crop
                        </button>
                      </div>
                    </div>
                  )}
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
                  {formData.irrigationPractices === "others" && (
                    <input
                      type="text"
                      name="irrigationPracticesOthers"
                      placeholder="Other Major Irrigation Practices"
                      className="border w-full p-2 rounded"
                      value={irrigationPracticesOthers}
                      onChange={(e) => setIrrigationPracticesOthers(e.target.value)}
                    />
                  )}
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
                  {formData.soilType === "others" && (
                    <input
                      type="text"
                      name="otherSoilType"
                      placeholder="Other Soil Type"
                      className="border w-full p-2 rounded"
                      value={otherSoilType}
                      onChange={(e) => setOtherSoilType(e.target.value)}
                    />
                  )}
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
                <div className="flex justify-between space-x-4 mt-4">
                  <button
                    className={`bg-gray-400 text-white px-4 py-2 rounded ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-500"
                      }`}
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>
                  {currentStep === 3 ? (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={registerSAAO}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SAAORegistration;