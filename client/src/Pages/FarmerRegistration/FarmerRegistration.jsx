import { useEffect, useState, useContext } from "react";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext, useAuthContext } from "../../Components/context/AuthProvider";
import { ChevronsUpDown } from "lucide-react";
import { Parser } from "@json2csv/plainjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '/logo.png';

const FarmerRegistration = () => {
  const { rolePermission } = useContext(AuthContext);
  const { authUser, loadingUser } = useAuthContext();
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [farmerList, setFarmerList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedInsects, setSelectedInsects] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isOtherDiseasesOpen, setIsOtherDiseasesOpen] = useState(false);
  const [isOtherInsectsOpen, setIsOtherInsectsOpen] = useState(false);
  const [otherDiseases, setOtherDiseases] = useState("");
  const [otherInsects, setOtherInsects] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saaoId, setSaaoId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
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
    dateOfBirth: "",
    age: "",
    alternateContactRelation: "",
    mobileNumber: "",
    nationalId: "",
    whatsappNumber: "",
    alternateContact: "",
    educationStatus: "",
    eduOther: "",
    village: "",
    farmSize: "",
    fertilizerUsage: "",
    majorDiseases: "",
    majorInsects: "",
    progressiveFarmer: "",
    region: authUser?.RegistedUser?.region || "",
    block: authUser?.RegistedUser?.block || "",
    union: authUser?.RegistedUser?.union || "",
    upazila: authUser?.RegistedUser?.upazila || "",
    district: authUser?.RegistedUser?.district || "",
    division: authUser?.RegistedUser?.division || "",
    hotspot: authUser?.RegistedUser?.hotspot || "",
    coordinates: "",
    role: "farmer",
    saaoId: authUser?.id || null,
    saaoName: authUser?.name || null,
  });

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Update age when dateOfBirth changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      age: calculateAge(prev.dateOfBirth),
    }));
  }, [formData.dateOfBirth]);

  const fetchFarmers = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        let sortedFarmers = data.data;

        // Apply sorting
        if (sortConfig.key) {
          sortedFarmers = [...data.data].sort((a, b) => {
            const key = columnKeyMap[sortConfig.key] || sortConfig.key.toLowerCase().replace(/\s+/g, '');
            let valueA = a[key] || '';
            let valueB = b[key] || '';

            // Handle numeric sorting for ID and age
            if (sortConfig.key === 'ID' || sortConfig.key === 'Age') {
              valueA = Number(valueA) || 0;
              valueB = Number(valueB) || 0;
            }

            if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
          });
        }
        console.log(sortedFarmers);

        setFarmerList(sortedFarmers);
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
      alert("Failed to fetch farmers. Please try again.");
    }
  };

  useEffect(() => {
    if (authUser?.role?.toLowerCase() === "saao" && authUser?.id ) {
      console.log("saaoId:", saaoId);
      
      const url = `https://iinms.brri.gov.bd/api/farmers/farmers/role/farmer?page=${page}&limit=${rowsPerPage}&saaoId=${authUser?.id}&search=${searchText}`;
      fetchFarmers(url);
    }
    else if (authUser?.role?.toLowerCase() !== "saao") {
      console.log("without saaoId");
      const url = `https://iinms.brri.gov.bd/api/farmers/farmers/role/farmer?page=${page}&limit=${rowsPerPage}&search=${searchText}`;
      fetchFarmers(url);
    }
    
  }, [page, rowsPerPage, saaoId, authUser?.role, searchText, authUser?.id, sortConfig]);

  // Updated columns to match form inputs
  const initialColumns = [
    { name: "ID", visible: true },
    { name: "Name", visible: true },
    { name: "Father's Name", visible: true },
    { name: "Spouse Name", visible: true },
    { name: "Gender", visible: true },
    // { name: "Date of Birth", visible: true },
    { name: "Age", visible: true },
    { name: "Mobile Number", visible: true },
    { name: "National ID", visible: true },
    { name: "WhatsApp Number", visible: true },
    { name: "Imo Number", visible: true },
    { name: "Alternate Contact", visible: true },
    { name: "Relationship with Farmer", visible: true },
    { name: "Education Status", visible: true },
    { name: "Village", visible: true },
    { name: "Farm Size", visible: true },
    { name: "Total Urea Uses (kg/bigha)", visible: true },
    { name: "Major Diseases", visible: true },
    { name: "Major Insects", visible: true },
    { name: "Progressive Farmer", visible: true },
    { name: "Region", visible: true },
    { name: "Block", visible: true },
    { name: "Union", visible: true },
    { name: "Upazila", visible: true },
    { name: "District", visible: true },
    { name: "Division", visible: true },
    { name: "Hotspot", visible: true },
    { name: "SAAO", visible: true },
    { name: "Action", visible: true },
  ];

  const [columns, setColumns] = useState(initialColumns);

  // Handle column sorting
  const handleSort = (columnName) => {
    setSortConfig((prev) => ({
      key: columnName,
      direction: prev.key === columnName && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleColumnModal = () => setIsColumnModalOpen(!isColumnModalOpen);

  const handleColumnToggle = (columnName) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.name === columnName ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const toggleFarmerModal = () => {
    setIsFarmerModalOpen(!isFarmerModalOpen);
    if (!isFarmerModalOpen) {
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
      fatherName: "",
      gender: "",
      imoNumber: "",
      // dateOfBirth: "",
      age: "",
      mobileNumber: "",
      nationalId: "",
      whatsappNumber: "",
      alternateContact: "",
      alternateContactRelation: "",
      educationStatus: "",
      eduOther: "",
      village: "",
      farmSize: "",
      fertilizerUsage: "",
      majorDiseases: "",
      majorInsects: "",
      progressiveFarmer: "",
      region: authUser?.RegistedUser?.region || "",
      block: authUser?.RegistedUser?.block || "",
      union: authUser?.RegistedUser?.union || "",
      upazila: authUser?.RegistedUser?.upazila || "",
      district: authUser?.RegistedUser?.district || "",
      division: authUser?.RegistedUser?.division || "",
      hotspot: authUser?.RegistedUser?.hotspot || "",
      coordinates: "",
      role: "farmer",
      saaoId: authUser?.id || null,
      saaoName: authUser?.name || null,
    });
    setSelectedDiseases([]);
    setSelectedInsects([]);
    setIsEdit(false);
    setSelectedId(null);
    setIsOtherDiseasesOpen(false);
    setIsOtherInsectsOpen(false);
    setOtherDiseases("");
    setOtherInsects("");
  };

  const closeModal = () => {
    setIsFarmerModalOpen(false);
    resetForm();
  };

  const registerFarmer = async (e) => {
    e.preventDefault();
    if (formData.mobileNumber.length < 11) {
      return alert("Mobile number must be 11 digits long.");
    }
    if (formData.whatsappNumber && formData.whatsappNumber.length < 11) {
      return alert("WhatsApp number must be 11 digits long.");
    }
    if (formData.alternateContact && formData.alternateContact.length < 11) {
      return alert("Alternate contact number must be 11 digits long.");
    }

    const rawDate = formData.dateOfBirth;
    const parsedDate = new Date(rawDate);
    const safeDateOfBirth = isNaN(parsedDate.getTime())
      ? null
      : parsedDate.toISOString().split('T')[0]; // MySQL-compatible format

    const submissionData = {
      ...formData,
      dateOfBirth: safeDateOfBirth,
      educationStatus: formData.educationStatus === "other" ? formData.eduOther : formData.educationStatus,
    };
    delete submissionData.eduOther; // Remove eduOther if not needed

    setLoading(true);
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
        setIsFarmerModalOpen(false);
        resetForm();
        fetchFarmers();
        setLoading(false);
      } else {
        throw new Error("Failed to save farmer");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save farmer. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteFarmer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;

    try {
      const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchFarmers();
      } else {
        throw new Error("Failed to delete farmer");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete farmer. Please try again.");
    }
  };

  const handleEdit = (farmer) => {
    console.log(farmer);
    
    setIsEdit(true);
    setIsFarmerModalOpen(true);
    setSelectedId(farmer.id);
    setFormData({
      name: farmer.name || "",
      fatherName: farmer.fatherName || "",
      spouseName: farmer.spouseName || "",
      gender: farmer.gender || "",
      // dateOfBirth: farmer.dateOfBirth || "",
      age: farmer.age  || "",
      mobileNumber: farmer.mobileNumber || "",
      nationalId: farmer.nationalId || "",
      whatsappNumber: farmer.whatsappNumber || "",
      alternateContact: farmer.alternateContact || "",
      alternateContactRelation: farmer.alternateContactRelation || "",
      educationStatus: farmer.educationStatus || "",
      eduOther: farmer.educationStatus === "other" ? farmer.educationStatus : "",
      village: farmer.village || "",
      farmSize: farmer.farmSize || "",
      imoNumber: farmer.imoNumber || "",
      fertilizerUsage: farmer.fertilizerUsage || "",
      TSPUsage: farmer.TSPUsage || "",
      MoPUsage: farmer.MoPUsage || "",
      ZincUsage: farmer.ZincUsage || "",
      GypsumUsage: farmer.GypsumUsage || "",
      dapUsage: farmer.dapUsage || "",
      majorDiseases: farmer.majorDiseases || "",
      majorInsects: farmer.majorInsects || "",
      progressiveFarmer: farmer.progressiveFarmer || "",
      region: farmer.region || "",
      block: farmer.block || "",
      union: farmer.union || "",
      upazila: farmer.upazila || "",
      district: farmer.district || "",
      division: farmer.division || "",
      hotspot: farmer.hotspot || "",
      coordinates: farmer.coordinates || "",
      role: "farmer",
      saaoId: farmer.saaoId || authUser?.id || null,
      saaoName: farmer.saaoName || authUser?.name || null,
    });
    setSelectedDiseases(farmer.majorDiseases ? farmer.majorDiseases.split(', ') : []);
    setSelectedInsects(farmer.majorInsects ? farmer.majorInsects.split(', ') : []);
  };

  const handleSelectDiseases = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "others") {
      setIsOtherDiseasesOpen(true);
      return;
    }
    if (!selectedDiseases.includes(selectedValue)) {
      const updatedSelectedDiseases = [...selectedDiseases, selectedValue];
      setSelectedDiseases(updatedSelectedDiseases);
      setFormData({
        ...formData,
        majorDiseases: updatedSelectedDiseases.join(', '),
      });
    }
  };

  const handleDeleteDiseases = (valueToDelete) => {
    const updatedSelectedDiseases = selectedDiseases.filter((value) => value !== valueToDelete);
    setSelectedDiseases(updatedSelectedDiseases);
    setFormData({
      ...formData,
      majorDiseases: updatedSelectedDiseases.join(', '),
    });
  };

  const handleAddDiseases = () => {
    if (otherDiseases.trim()) {
      const updatedSelectedDiseases = [...selectedDiseases, otherDiseases];
      setSelectedDiseases(updatedSelectedDiseases);
      setFormData({
        ...formData,
        majorDiseases: updatedSelectedDiseases.join(', '),
      });
      setIsOtherDiseasesOpen(false);
      setOtherDiseases("");
    }
  };

  const handleSelectInsect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "others") {
      setIsOtherInsectsOpen(true);
      return;
    }
    if (!selectedInsects.includes(selectedValue)) {
      const updatedSelectedInsects = [...selectedInsects, selectedValue];
      setSelectedInsects(updatedSelectedInsects);
      setFormData({
        ...formData,
        majorInsects: updatedSelectedInsects.join(', '),
      });
    }
  };

  const handleDeleteInsect = (valueToDelete) => {
    const updatedSelectedInsects = selectedInsects.filter((value) => value !== valueToDelete);
    setSelectedInsects(updatedSelectedInsects);
    setFormData({
      ...formData,
      majorInsects: updatedSelectedInsects.join(', '),
    });
  };

  const handleAddInsect = () => {
    if (otherInsects.trim()) {
      const updatedSelectedInsects = [...selectedInsects, otherInsects];
      setSelectedInsects(updatedSelectedInsects);
      setFormData({
        ...formData,
        majorInsects: updatedSelectedInsects.join(', '),
      });
      setIsOtherInsectsOpen(false);
      setOtherInsects("");
    }
  };

  const columnKeyMap = {
    ID: "id",
    Name: "name",
    "Father's Name": "fatherName",
    "Spouse Name": "spouseName",
    Gender: "gender",
    // "Date of Birth": "dateOfBirth",
    Age: "age",
    "Mobile Number": "mobileNumber",
    "National ID": "nationalId",
    "WhatsApp Number": "whatsappNumber",
    "Imo Number": "imoNumber",
    "Alternate Contact": "alternateContact",
    "Education Status": "educationStatus",
    Village: "village",
    "Farm Size": "farmSize",
    "Total Urea Uses (kg/bigha)": "fertilizerUsage",
    "Major Diseases": "majorDiseases",
    "Major Insects": "majorInsects",
    "Progressive Farmer": "progressiveFarmer",
    "Relationship with Farmer": "alternateContactRelation",
    Region: "region",
    Block: "block",
    Union: "union",
    Upazila: "upazila",
    District: "district",
    Division: "division",
    Hotspot: "hotspot",
    SAAO: "saaoName",
  };

  // Copy to Clipboard
  const handleCopy = async () => {
    try {
      const visibleColumns = columns.filter((col) => col.visible && col.name !== "Action");

      // Step 3: Generate header row
      const header = visibleColumns.map((col) => col.name).join("\t");

      // Step 4: Generate rows
      const rows = farmerList.slice(0, rowsPerPage).map((farmer, index) =>
        visibleColumns
          .map((col) => {
            if (col.name === "ID") {
              return pagination.currentPage === 1
                ? index + 1
                : (pagination.currentPage - 1) * rowsPerPage + index + 1;
            }

            const actualKey = columnKeyMap[col.name];
            return actualKey ? farmer[actualKey] || '' : '';
          })
          .join("\t")
      );

      // Step 5: Combine
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
        value: col.name.toLowerCase().replace(/\s+/g, ''),
      }));

      // Step 3: Generate rows of data
      const data = farmerList.slice(0, rowsPerPage).map((farmer, index) => {
        const row = {};
        visibleColumns.forEach((col) => {
          const keyAlias = col.name.toLowerCase().replace(/\s+/g, '');
          const actualKey = columnKeyMap[col.name];

          if (col.name === "ID") {
            row[keyAlias] =
              pagination.currentPage === 1
                ? index + 1
                : (pagination.currentPage - 1) * rowsPerPage + index + 1;
          } else {
            row[keyAlias] = actualKey ? farmer[actualKey] || '' : '';
          }
        });
        return row;
      });

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "farmers.csv";
      link.click();
    } catch (error) {
      console.error("CSV export failed:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  // Export to PDF with Beautiful Design
  const handleExportPDF = () => {
    try {
      // registerFiraSansFont(jsPDF);
      const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 12; // Margin in mm

      // Set default font
      doc.setFont(undefined, "normal");
      doc.setFontSize(12);

      // // Header: Title and Branding
      // doc.addImage(logo, 'PNG', margin, 16, 15, 15);
      // doc.setFontSize(12);
      // doc.setTextColor(50);
      // doc.setFont("helvetica", "bold");
      // doc.text("Bangladesh Rice research Institute (BRRI)", margin + 18, 15);
      // // Branding (Replace with logo if available)
      // doc.setFontSize(10);
      // doc.setTextColor(100);
      // const date = new Date();

      // const options = {
      //   weekday: 'long',
      //   year: 'numeric',
      //   month: 'long',
      //   day: '2-digit',
      //   hour: '2-digit',
      //   minute: '2-digit',
      //   hour12: true,
      // };

      // const formattedDate = date.toLocaleString('en-US', options);

      // doc.setFont(undefined, "normal");
      // doc.text(formattedDate, pageWidth - margin, 35, { align: "right" });
      // // doc.text("Generated by: " + (authUser?.name || "Admin"), pageWidth - margin, 25, { align: "right" });

      // // Date and Time
      // doc.setFontSize(10);
      // doc.setTextColor(50);
      // doc.text("Gazipur-1701", margin + 18, 20);
      // doc.setFont("helvetica", "bold");
      // doc.text("Contact Agromet Lab", margin + 18, 25);

      // doc.setFontSize(10);
      // doc.setTextColor(50);
      // doc.setFont(undefined, "normal");
      // doc.text("Email: info.brriagromet@gmail.com", margin + 18, 30);
      // doc.text("Mobile: 09644300300", margin + 18, 35);

      // Border around content
      // doc.setDrawColor(200); // Light gray border
      // doc.setLineWidth(0.5);
      // doc.rect(margin - 5, 10, pageWidth - 2 * (margin - 5), pageHeight - 2 * 10); // Border with padding

      // Prepare table data
      const visibleColumns = columns.filter((col) => col.visible && col.name !== "Action");

      const headers = visibleColumns.map((col) => col.name);

      const data = farmerList.slice(0, rowsPerPage).map((farmer, index) =>
        visibleColumns.map((col) => {
          if (col.name === "ID") {
            return pagination.currentPage === 1
              ? index + 1
              : (pagination.currentPage - 1) * rowsPerPage + index + 1;
          }
          const key = columnKeyMap[col.name];
          return key ? farmer[key] || '' : '';
        })
      );

      // Table with styling
      autoTable(doc, {
        startY: 40,
        head: [headers],
        body: data,
        theme: 'grid',
        styles: {
          font: "helvetica",
          fontSize: 3,
          cellPadding: 1,
          textColor: [50, 50, 50],
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 40, left: margin, right: margin, bottom: 20 },
        didDrawPage: (data) => {
          // ---- Header (repeated on every page) ----
          doc.addImage(logo, 'PNG', margin, 16, 15, 15);
          doc.setFontSize(12);
          doc.setTextColor(50);
          doc.setFont("helvetica", "bold");
          doc.text("Bangladesh Rice research Institute (BRRI)", margin + 18, 15);
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text("Gazipur-1701", margin + 18, 20);
          doc.text("Contact Agromet Lab", margin + 18, 25);
          doc.setFontSize(10);
          doc.setTextColor(50);
          doc.setFont(undefined, "normal");
          doc.text("Email: info.brriagromet@gmail.com", margin + 18, 30);
          doc.text("Mobile: 09644300300", margin + 18, 35);

          const date = new Date();
          const formattedDate = date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          doc.setFont(undefined, "normal");
          doc.text(formattedDate, pageWidth - margin, 35, { align: "right" });

          // ---- Footer (repeated on every page) ----
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 12, { align: "center" });
          doc.text("© 2025 Smart Agro-Advisory Dissemination System.", margin, pageHeight - 6);
          doc.text("Generated by: " + (authUser?.name || "Admin"), pageWidth - margin, pageHeight - 6, { align: "right" });
        },
      });


      doc.save("farmers-report.pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <main className="p-6">
        <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Farmer List</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={toggleFarmerModal}
            >
              + Add Farmer
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full space-y-3 md:space-y-0">
            <input
              type="text"
              placeholder="Search by Name, Phone, or Village"
              className="border rounded px-4 py-2 w-full md:w-1/2 lg:w-1/3"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex flex-wrap justify-between md:justify-end space-x-2">
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
                        className={`border px-4 py-2 cursor-pointer ${index === 0 ? "sticky left-0 bg-gray-50" : ""}`}
                        style={{ width: index === 0 ? "50px" : "150px" }}
                        onClick={() => handleSort(col.name)}
                      >
                        <p className="flex items-center justify-between">
                          {col.name}
                          <ChevronsUpDown size={14} />
                          {sortConfig.key === col.name && (
                            <span className="ml-1">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </p>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {farmerList.slice(0, rowsPerPage).map((farmer, index) => (
                  <tr className="text-sm" key={farmer.id} style={{ height: "50px" }}>
                    {columns
                      .filter((col) => col.visible)
                      .map((col, colIndex) => (
                        <td
                          key={col.name}
                          className={`border px-4 py-2 ${colIndex === 0 ? "sticky left-0" : ""} ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${colIndex === 3 ? "capitalize" : ""}`}
                          style={{ width: colIndex === 0 ? "50px" : "150px" }}
                        >
                          {col.name === "ID" &&
                            (pagination.currentPage === 1
                              ? index + 1
                              : (pagination.currentPage - 1) * rowsPerPage + index + 1)}
                          {col.name === "Name" && farmer.name}
                          {col.name === "Father's Name" && farmer.fatherName}
                          {col.name === "Spouse Name" && farmer.spouseName}
                          {col.name === "Gender" && farmer.gender}
                          {/* {col.name === "Date of Birth" && farmer.dateOfBirth} */}
                          {col.name === "Age" && farmer.age}
                          {col.name === "Mobile Number" && farmer.mobileNumber}
                          {col.name === "National ID" && farmer.nationalId}
                          {col.name === "WhatsApp Number" && farmer.whatsappNumber}
                          {col.name === "Imo Number" && farmer.imoNumber}
                          {col.name === "Alternate Contact" && farmer.alternateContact}
                          {col.name === "Relationship with Farmer" && farmer.alternateContactRelation}
                          {col.name === "Education Status" &&
                            (farmer.educationStatus === "other" ? farmer.eduOther : farmer.educationStatus)}
                          {col.name === "Village" && farmer.village}
                          {col.name === "Farm Size" && farmer.farmSize}
                          {col.name === "Total Urea Uses (kg/bigha)" && farmer.fertilizerUsage}
                          {col.name === "Major Diseases" && farmer.majorDiseases}
                          {col.name === "Major Insects" && farmer.majorInsects}
                          {col.name === "Progressive Farmer" && farmer.progressiveFarmer}
                          {col.name === "Region" && farmer.region}
                          {col.name === "Block" && farmer.block}
                          {col.name === "Union" && farmer.union}
                          {col.name === "Upazila" && farmer.upazila}
                          {col.name === "District" && farmer.district}
                          {col.name === "Division" && farmer.division}
                          {col.name === "Hotspot" && farmer.hotspot}
                          {col.name === "SAAO" && farmer.saaoName}
                          {col.name === "Action" && (
                            <div className="flex space-x-2">
                              {rolePermission["Farmer Edit"] && (
                                <button
                                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                  onClick={() => handleEdit(farmer)}
                                >
                                  <FaEdit />
                                </button>
                              )}
                              {rolePermission["Farmer Delete"] && (
                                <button
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  onClick={() => handleDeleteFarmer(farmer.id)}
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

        {isFarmerModalOpen && (
          <div className="fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative max-h-[90vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-2/3">
              <h3 className="text-lg font-semibold mb-4">Farmer Registration</h3>
              <button
                className="absolute top-2 right-5 text-xl text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                ×
              </button>
              <form onSubmit={registerFarmer}>
                <div>
                  <label className="block mt-4">
                    Farmer's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label className="block mt-4">
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                  />
                  <label className="block mt-4">
                    Spouse Name
                  </label>
                  <input
                    type="text"
                    name="spouseName"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.spouseName}
                    onChange={handleChange}
                  />
                  <label className="block mt-4">
                    Gender <span className="text-red-500">*</span>
                  </label>
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
                  {/* <label className="block mt-4">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="border w-full p-2 rounded"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  /> */}
                  <label className="block mt-4">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Age "
                    className="border w-full p-2 rounded"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                  <label className="block mt-4">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
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
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
                    required
                  />
                  <label className="block mt-4">NID Number<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="nationalId"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.nationalId}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    required
                  />
                  <label className="block mt-4">WhatsApp Number</label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.whatsappNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,11}$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
                  />
                  <label className="block mt-4">IMO Number</label>
                  <input
                    type="tel"
                    name="imoNumber"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.imoNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,11}$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    pattern="[0-9]{11}"
                    minLength="11"
                    maxLength="11"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mt-4">Alternate Contact Number</label>
                      <input
                        type="tel"
                        name="alternateContact"
                        placeholder="Family member's mobile number"
                        className="border w-full p-2 rounded"
                        value={formData.alternateContact}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,11}$/.test(value)) {
                            handleChange(e);
                          }
                        }}
                        pattern="[0-9]{11}"
                        minLength="11"
                        maxLength="11"
                      />
                    </div>
                    <div>
                      <label className="block mt-4">Relation With farmer</label>
                      <select
                        name="alternateContactRelation"
                        className="border w-full p-2 rounded"
                        value={formData.alternateContactRelation}
                        onChange={handleChange}
                      >
                        <option value="">Select Relation</option>
                        <option value="father">Father</option>
                        <option value="mother">Mother</option>
                        <option value="husband">Husband</option>
                        <option value="wife">Wife</option>
                        <option value="son">Son</option>
                        <option value="daughter">Daughter</option>
                        <option value="brother">Brother</option>
                        <option value="sister">Sister</option>
                      </select>
                    </div>
                  </div>
                  <label className="block mt-4">Education Status</label>
                  <select
                    name="educationStatus"
                    className="border w-full p-2 rounded"
                    value={formData.educationStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Education Status</option>
                    <option value="illiterate">Illiterate</option>
                    <option value="signature">Signature</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="SSC">SSC</option>
                    <option value="HSC">HSC</option>
                    <option value="higher">Higher</option>
                  </select>
                  {/* {formData.educationStatus === "other" && (
                    <input
                      type="text"
                      name="eduOther"
                      placeholder="Specify Education Status"
                      className="border w-full p-2 mt-2 rounded"
                      value={formData.eduOther}
                      onChange={handleChange}
                    />
                  )} */}
                  <label className="block mt-4">Village/Locality</label>
                  <input
                    type="text"
                    name="village"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.village}
                    onChange={handleChange}
                  />
                  <label className="block mt-4">Farm Size (in decimal)</label>
                  <input
                    type="number"
                    name="farmSize"
                    placeholder=""
                    className="border w-full p-2 rounded"
                    value={formData.farmSize}
                    onChange={handleChange}
                  />
                  <div className="flex flex-col md:flex-row lg:flex-row gap-2 text-center">
                    <div>
                      <label className="block mt-4">Total Urea Uses (kg/bigha)</label>
                      <input
                        type="number"
                        name="fertilizerUsage"
                        placeholder=""
                        className="border w-full p-2 rounded"
                        value={formData.fertilizerUsage}
                        onChange={handleChange}
                      />
                    </div>
                    <div><label className="block mt-4">Total TSP Uses (kg/bigha)</label>
                      <input
                        type="number"
                        name="TSPUsage"
                        placeholder=""
                        className="border w-full p-2 rounded"
                        value={formData.TSPUsage}
                        onChange={handleChange}
                      /></div>
                    <div><label className="block mt-4">Total MoP Uses (kg/bigha)</label>
                      <input
                        type="number"
                        name="MoPUsage"
                        placeholder=""
                        className="border w-full p-2 rounded"
                        value={formData.MoPUsage}
                        onChange={handleChange}
                      /></div>
                    <div><label className="block mt-4">Total Gypsum Uses (kg/bigha)</label>
                      <input
                        type="number"
                        name="GypsumUsage"
                        placeholder=""
                        className="border w-full p-2 rounded"
                        value={formData.GypsumUsage}
                        onChange={handleChange}
                      /></div>
                    <div><label className="block mt-4">Total Zinc Uses (kg/bigha)</label>
                      <input
                        type="number"
                        name="ZincUsage"
                        placeholder=""
                        className="border w-full p-2 rounded"
                        value={formData.ZincUsage}
                        onChange={handleChange}
                      /></div>
                    <div><label className="block mt-4">Total DAP Uses(kg/bigha)</label>
                      <input
                        type="number"
                        name="dapUsage"
                        placeholder=""
                        className="border w-full p-2 rounded"
                        value={formData.dapUsage}
                        onChange={handleChange}
                      /></div>
                  </div>
                  <label className="block mt-4">Major Diseases</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedDiseases.map((disease) => (
                      <div key={disease} className="flex items-center bg-gray-200 p-1 rounded">
                        <span>{disease}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => handleDeleteDiseases(disease)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <select
                    name="majorDiseases"
                    className="border w-full p-2 rounded"
                    value=""
                    onChange={handleSelectDiseases}
                  >
                    <option value="">Select Major Diseases</option>
                    <option value="Leaf Blast">Leaf Blast</option>
                    <option value="Neck Blast">Neck Blast</option>
                    <option value="Bacterial Blight">Bacterial Blight</option>
                    <option value="Sheath Blight">Sheath Blight</option>
                    <option value="Bakani">Bakani</option>
                    <option value="others">Others</option>
                  </select>
                  {isOtherDiseasesOpen && (
                    <div>
                      <label className="block mt-4">Other Diseases</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="otherDiseases"
                          placeholder=""
                          className="border w-full p-2 rounded"
                          value={otherDiseases}
                          onChange={(e) => setOtherDiseases(e.target.value)}
                        />
                        <button
                          className="btn-sm w-[30%] bg-gray-500 text-white font-bold py-2 px-4 rounded"
                          onClick={handleAddDiseases}
                          type="button"
                        >
                          Add Diseases
                        </button>
                      </div>
                    </div>
                  )}
                  <label className="block mt-4">Major Insects</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedInsects.map((insect) => (
                      <div key={insect} className="flex items-center bg-gray-200 p-1 rounded">
                        <span>{insect}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => handleDeleteInsect(insect)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <select
                    name="majorInsects"
                    className="border w-full p-2 rounded"
                    value=""
                    onChange={handleSelectInsect}
                  >
                    <option value="">Select Major Insects</option>
                    <option value="BPH">BPH</option>
                    <option value="Majra">Majra</option>
                    <option value="Hispa">Hispa</option>
                    <option value="Leaf Folder">Leaf Folder</option>
                    <option value="Rice Borer">Rice Borer</option>
                    <option value="Rice Borer">Rice Bug</option>
                    <option value="Green Leaf hopper">Green Leaf hopper</option>
                    <option value="others">Others</option>
                  </select>
                  {isOtherInsectsOpen && (
                    <div>
                      <label className="block mt-4">Other Insects</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="otherInsects"
                          placeholder=""
                          className="border w-full p-2 rounded"
                          value={otherInsects}
                          onChange={(e) => setOtherInsects(e.target.value)}
                        />
                        <button
                          className="btn-sm w-[30%] bg-gray-500 text-white font-bold py-2 px-4 rounded"
                          onClick={handleAddInsect}
                          type="button"
                        >
                          Add Insects
                        </button>
                      </div>
                    </div>
                  )}
                  <label className="block mt-4">Progressive Farmer</label>
                  <select
                    name="progressiveFarmer"
                    className="border w-full p-2 rounded"
                    value={formData.progressiveFarmer}
                    onChange={handleChange}
                  >
                    <option value="">Select Progressive Farmer</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                  >
                    {loading ? "Submitting..." : "Submit"}
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

export default FarmerRegistration;