import { useEffect, useState } from "react";
import { FaBars, FaEdit, FaLocationArrow, FaTrash } from "react-icons/fa";
import { ChevronsUpDown } from "lucide-react";
import { useAuthContext } from "../../Components/context/AuthProvider";
import { MdDeleteForever, MdGpsFixed } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '/logo.png';
import bookAntiqua from './book-antiqua.ttf';
const Profile = () => {
    const { authUser, loadingUser } = useAuthContext();
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
    const [selectedClimateExtremes, setSelectedClimateExtremes] = useState([]);
    const [isOtherMajorCropOpen, setIsOtherMajorCropOpen] = useState(false);
    const [selectedMajorCropOthers, setSelectedMajorCropOthers] = useState("");
    const [selectedSeasonVarieties, setSelectedSeasonVarieties] = useState([
        { value: "aus", input: "" },
        { value: "aman", input: "" },
        { value: "boro", input: "" },
    ]);
    const [transplantingDates, setTransplantingDates] = useState([
        { value: "aus", fromDate: "", toDate: "" },
        { value: "aman", fromDate: "", toDate: "" },
        { value: "boro", fromDate: "", toDate: "" },
    ]);
    const [piTimes, setPiTimes] = useState([
        { value: "aus", fromDate: "", toDate: "" },
        { value: "aman", fromDate: "", toDate: "" },
        { value: "boro", fromDate: "", toDate: "" },
    ]);
    const [floweringDates, setFloweringDates] = useState([
        { value: "aus", fromDate: "", toDate: "" },
        { value: "aman", fromDate: "", toDate: "" },
        { value: "boro", fromDate: "", toDate: "" },
    ]);
    const [expectedHarvestPeriods, setExpectedHarvestPeriods] = useState([
        { value: "aus", fromDate: "", toDate: "" },
        { value: "aman", fromDate: "", toDate: "" },
        { value: "boro", fromDate: "", toDate: "" },
    ]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalFarmers: 0,
        limit: 10,
    });

    const seasonOptions = [
        { label: "Aus", value: "aus" },
        { label: "Aman", value: "aman" },
        { label: "Boro", value: "boro" },
    ];

    const climateExtremeOptions = [
        { label: "Flash Flood", value: "Flash Flood" },
        { label: "River Flood", value: "River Flood" },
        { label: "Urban Flood", value: "Urban Flood" },
        { label: "Tidal Surge", value: "Tidal Surge" },
        { label: "Heat Wave", value: "Heat Wave" },
        { label: "Cold Wave", value: "Cold Wave" },
        { label: "Cyclone", value: "Cyclone" },
        { label: "Tornado", value: "Tornado" },
        { label: "Drought", value: "Drought" },
        { label: "Hailstorm", value: "Hailstorm" },
        { label: "Lightning", value: "Lightning" },
        { label: "Landslide", value: "Landslide" },
        { label: "Salinity Intrusion", value: "Salinity Intrusion" },
        { label: "Sea Level Rise", value: "Sea Level Rise" },
    ];

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
        lat: "",
        lan: "",
        landType: "",
        hotspot: [],
        majorCrops: "",
        irrigationPractices: "",
        irrigationSourceType: "",
        plantingMethod: "",
        croppingPattern: "",
        riceVarieties: "",
        soilType: "",
        role: "saao",
        totalCultivatedArea: "",
        numberOfFarmers: "",
        communityInformation: "",
        farmerGroupName: "",
    });

    const handleExportPDF = async () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 12;
            const usablePageWidth = pageWidth - margin * 2;
            const columnWidth = usablePageWidth / 2;
            const loadFont = async (url) => {
                const response = await fetch(url);
                const buffer = await response.arrayBuffer();
                const base64 = btoa(
                    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
                );
                return base64;
            };

            const bookAntiquaBase64 = await loadFont(bookAntiqua);

            // Register the font with jsPDF
            doc.addFileToVFS("Book-Antiqua.ttf", bookAntiquaBase64);
            doc.addFont("Book-Antiqua.ttf", "BookAntiqua", "normal");

            doc.setFont("BookAntiqua", "normal");
            doc.setFontSize(12);

            // Header
            doc.addImage(logo, 'PNG', margin, 16, 15, 15);
            doc.setFontSize(12);
            doc.setTextColor(50);
            doc.setFont("BookAntiqua", "bold");
            doc.text("Bangladesh Rice research Institute (BRRI)", margin + 18, 15);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Gazipur-1701", margin + 18, 20);
            doc.text("Contact Agromet Lab", margin + 18, 25);
            doc.setFontSize(10);
            doc.setTextColor(50);
            doc.setFont("BookAntiqua", "normal");
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
            doc.text(formattedDate, pageWidth - margin, 50, { align: "right" });

            // Personal Information
            doc.setFontSize(12);
            doc.setTextColor(50);
            doc.setFont("BookAntiqua", "bold");
            doc.text("Personal Information", margin, 50);
            autoTable(doc, {
                startY: 55,
                head: [['Field', 'Information']],
                body: [
                    ['Name', formData.name || 'N/A'],
                    ['Father\'s Name', formData.fatherName || 'N/A'],
                    ['Gender', formData.gender || 'N/A'],
                    ['Mobile Number', formData.mobileNumber || 'N/A'],
                    ['WhatsApp Number', formData.whatsappNumber || 'N/A'],
                    ['Messenger ID', formData.messengerId || 'N/A'],
                    ['Email', formData.email || 'N/A'],
                    ['Alternate Contact', formData.alternateContact || 'N/A'],
                ],
                theme: 'grid',
                styles: {
                    font: "BookAntiqua",
                    fontSize: 10,
                    cellPadding: 2,
                    textColor: [50, 50, 50],
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                margin: { left: margin, right: margin },
                columnStyles: {
                    0: { cellWidth: columnWidth },
                    1: { cellWidth: columnWidth },
                },
            });

            // Location Information
            let finalY = doc.lastAutoTable.finalY + 10;
            doc.setFont("BookAntiqua", "bold");
            doc.text("Location Information", margin, finalY);
            autoTable(doc, {
                startY: finalY + 5,
                head: [['Field', 'Information']],
                body: [
                    ['Hotspots', selectedHotspots.join(', ') || 'N/A'],
                    ['Region', formData.region || 'N/A'],
                    ['Division', formData.division || 'N/A'],
                    ['District', formData.district || 'N/A'],
                    ['Upazila', formData.upazila || 'N/A'],
                    ['Union', formData.union || 'N/A'],
                    ['Block', formData.block || 'N/A'],
                    ['Latitude', formData.lat || 'N/A'],
                    ['Longitude', formData.lan || 'N/A'],
                ],
                theme: 'grid',
                styles: {
                    font: "BookAntiqua",
                    fontSize: 10,
                    cellPadding: 2,
                    textColor: [50, 50, 50],
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                margin: { left: margin, right: margin },
                columnStyles: {
                    0: { cellWidth: columnWidth },
                    1: { cellWidth: columnWidth },
                },
            });

            // Farming Information
            finalY = doc.lastAutoTable.finalY + 10;
            doc.setFont("BookAntiqua", "bold");
            doc.text("Farming Information", margin, finalY);
            autoTable(doc, {
                startY: finalY + 5,
                head: [['Field', 'Information']],
                body: [
                    ['Land Type', formData.landType || 'N/A'],
                    ['Major Crops', selectedMajorCrop.join(', ') || 'N/A'],
                    ['Planting Method', formData.plantingMethod || 'N/A'],
                    ['Irrigation Practices', formData.irrigationPractices === "others" ? irrigationPracticesOthers : formData.irrigationPractices || 'N/A'],
                    ['Irrigation Source Type', formData.irrigationSourceType || 'N/A'],
                    ['Soil Type', formData.soilType === "others" ? otherSoilType : formData.soilType || 'N/A'],
                    ['Cropping Pattern', formData.croppingPattern || 'N/A'],
                    ['Climate Extremes', selectedClimateExtremes.join(', ') || 'N/A'],
                    ['Rice Varieties', formData.riceVarieties || 'N/A'],
                    ['Total Cultivated Area', formData.totalCultivatedArea || 'N/A'],
                    ['Number of Farmers', formData.numberOfFarmers || 'N/A'],
                    ['Community Information', formData.communityInformation === "Other" ? formData.farmerGroupName : formData.communityInformation || 'N/A'],
                ],
                theme: 'grid',
                styles: {
                    font: "BookAntiqua",
                    fontSize: 10,
                    cellPadding: 2,
                    textColor: [50, 50, 50],
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                margin: { left: margin, right: margin },
                columnStyles: {
                    0: { cellWidth: columnWidth },
                    1: { cellWidth: columnWidth },
                },
            });

            // Seasonal Information
            finalY = doc.lastAutoTable.finalY + 10;
            doc.setFont("BookAntiqua", "bold");
            doc.text("Seasonal Information", margin, finalY);
            autoTable(doc, {
                startY: finalY + 5,
                head: [['Season', 'Variety/Date']],
                body: [
                    ...selectedSeasonVarieties.map(opt => [seasonOptions.find(o => o.value === opt.value)?.label || opt.value, opt.input || 'N/A']),
                    ...transplantingDates.map(opt => [`Transplanting ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} From`, opt.fromDate || 'N/A']),
                    ...transplantingDates.map(opt => [`Transplanting ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} To`, opt.toDate || 'N/A']),
                    ...piTimes.map(opt => [`PI Time ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} From`, opt.fromDate || 'N/A']),
                    ...piTimes.map(opt => [`PI Time ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} To`, opt.toDate || 'N/A']),
                    ...floweringDates.map(opt => [`Flowering ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} From`, opt.fromDate || 'N/A']),
                    ...floweringDates.map(opt => [`Flowering ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} To`, opt.toDate || 'N/A']),
                    ...expectedHarvestPeriods.map(opt => [`Harvest ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} From`, opt.fromDate || 'N/A']),
                    ...expectedHarvestPeriods.map(opt => [`Harvest ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} To`, opt.toDate || 'N/A']),
                ],
                theme: 'grid',
                styles: {
                    font: "BookAntiqua",
                    fontSize: 10,
                    cellPadding: 2,
                    textColor: [50, 50, 50],
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                margin: { left: margin, right: margin },
                columnStyles: {
                    0: { cellWidth: columnWidth },
                    1: { cellWidth: columnWidth },
                },
            });

            // Footer with page numbers and attribution
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(100);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 12, { align: "center" });
                doc.text("© 2025 Smart Agro-Advisory Dissemination System.", margin, pageHeight - 6);
                doc.text(`Generated by: ${authUser?.name || "Admin"}`, pageWidth - margin, pageHeight - 6, { align: "right" });
            }

            doc.save("profile-report.pdf");
        } catch (error) {
            console.error("PDF export failed:", error);
            alert("Failed to export PDF. Please try again.");
        }
    };


    const handleExportCSV = () => {
        try {
            // Prepare CSV content
            const headers = [
                "Field,Information"
            ];

            const personalInfo = [
                `Name,${formData.name || 'N/A'}`,
                `Father's Name,${formData.fatherName || 'N/A'}`,
                `Gender,${formData.gender || 'N/A'}`,
                `Mobile Number,${formData.mobileNumber || 'N/A'}`,
                `WhatsApp Number,${formData.whatsappNumber || 'N/A'}`,
                `Messenger ID,${formData.messengerId || 'N/A'}`,
                `Email,${formData.email || 'N/A'}`,
                `Alternate Contact,${formData.alternateContact || 'N/A'}`,
            ];

            const locationInfo = [
                `Hotspots,${selectedHotspots.join(', ') || 'N/A'}`,
                `Region,${formData.region || 'N/A'}`,
                `Division,${formData.division || 'N/A'}`,
                `District,${formData.district || 'N/A'}`,
                `Upazila,${formData.upazila || 'N/A'}`,
                `Union,${formData.union || 'N/A'}`,
                `Block,${formData.block || 'N/A'}`,
                `Latitude,${formData.lat || 'N/A'}`,
                `Longitude,${formData.lan || 'N/A'}`,
            ];

            const farmingInfo = [
                `Land Type,${formData.landType || 'N/A'}`,
                `Major Crops,${selectedMajorCrop.join(', ') || 'N/A'}`,
                `Planting Method,${formData.plantingMethod || 'N/A'}`,
                `Irrigation Practices,${formData.irrigationPractices === "others" ? irrigationPracticesOthers : formData.irrigationPractices || 'N/A'}`,
                `Irrigation Source Type,${formData.irrigationSourceType || 'N/A'}`,
                `Soil Type,${formData.soilType === "others" ? otherSoilType : formData.soilType || 'N/A'}`,
                `Cropping Pattern,${formData.croppingPattern || 'N/A'}`,
                `Climate Extremes,${selectedClimateExtremes.join(', ') || 'N/A'}`,
                `Rice Varieties,${formData.riceVarieties || 'N/A'}`,
                `Total Cultivated Area,${formData.totalCultivatedArea || 'N/A'}`,
                `Number of Farmers,${formData.numberOfFarmers || 'N/A'}`,
                `Community Information,${formData.communityInformation === "Other" ? formData.farmerGroupName : formData.communityInformation || 'N/A'}`,
            ];

            const seasonalInfo = [
                ...selectedSeasonVarieties.map(opt => `${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} Variety,${opt.input || 'N/A'}`),
                ...transplantingDates.map(opt => `Transplanting ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} From,${opt.fromDate || 'N/A'}`),
                ...transplantingDates.map(opt => `Transplanting ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} To,${opt.toDate || 'N/A'}`),
                ...piTimes.map(opt => `PI Time ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} From,${opt.fromDate || 'N/A'}`),
                ...piTimes.map(opt => `PI Time ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} To,${opt.toDate || 'N/A'}`),
                ...floweringDates.map(opt => `Flowering ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} From,${opt.fromDate || 'N/A'}`),
                ...floweringDates.map(opt => `Flowering ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} To,${opt.toDate || 'N/A'}`),
                ...expectedHarvestPeriods.map(opt => `Harvest ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} From,${opt.fromDate || 'N/A'}`),
                ...expectedHarvestPeriods.map(opt => `Harvest ${seasonOptions.find(o => o.value === opt.value)?.label || opt.value} To,${opt.toDate || 'N/A'}`),
            ];

            // Combine all sections with headers
            const csvContent = [
                "Personal Information",
                ...personalInfo,
                "",
                "Location Information",
                ...locationInfo,
                "",
                "Farming Information",
                ...farmingInfo,
                "",
                "Seasonal Information",
                ...seasonalInfo,
            ].join("\n");

            // Create and download CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "profile-report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("CSV export failed:", error);
            alert("Failed to export CSV. Please try again.");
        }
    };

    // Handlers for date changes
    const handleTransplantingDateChange = (index, field, value) => {
        const updated = [...transplantingDates];
        updated[index][field] = value;
        setTransplantingDates(updated);
    };

    const handlePiTimeChange = (index, field, value) => {
        const updated = [...piTimes];
        updated[index][field] = value;
        setPiTimes(updated);
    };

    const handleFloweringDateChange = (index, field, value) => {
        const updated = [...floweringDates];
        updated[index][field] = value;
        setFloweringDates(updated);
    };

    const handleExpectedHarvestDateChange = (index, field, value) => {
        const updated = [...expectedHarvestPeriods];
        updated[index][field] = value;
        setExpectedHarvestPeriods(updated);
    };

    // Handler for season variety input changes
    const handleSeasonVarietyInputChange = (index, value) => {
        const updated = [...selectedSeasonVarieties];
        updated[index].input = value;
        setSelectedSeasonVarieties(updated);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataFile = new FormData();
        formDataFile.append('profileImage', file);

        try {
            const response = await fetch('https://iinms.brri.gov.bd/api/upload', {
                method: 'POST',
                body: formDataFile,
            });

            const data = await response.json();
            if (response.ok) {
                setFormData(prev => ({
                    ...prev,
                    profileImage: data.imageUrl,
                }));
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Something went wrong while uploading');
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        lat: position.coords.latitude.toFixed(6),
                        lan: position.coords.longitude.toFixed(6),
                    }));
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // alert("Failed to get location");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        if (authUser?.RegistedUser) {
            setFormData(prev => ({
                ...prev,
                ...authUser.RegistedUser,
                hotspot: authUser.RegistedUser.hotspot || []
            }));
            const hotspotRaw = authUser.RegistedUser?.hotspot;

            let hotspots = [];

            if (typeof hotspotRaw === "string") {
                try {
                    // Try parsing JSON string
                    hotspots = JSON.parse(hotspotRaw);
                } catch {
                    // Fallback: if parsing fails, split by comma (if expected)
                    hotspots = hotspotRaw.split(", ");
                }
            } else if (Array.isArray(hotspotRaw)) {
                hotspots = hotspotRaw;
            }

            setSelectedHotspots(hotspots || [])
            setSelectedMajorCrop(authUser.RegistedUser?.majorCrops?.split(", ") || []);
            setSelectedClimateExtremes(authUser.RegistedUser?.climateExtremes?.split(", ") || []);
            setSelectedId(authUser.RegistedUser.id);
            setSelectedSeasonVarieties(authUser.RegistedUser.seasonWiseDominantVarieties?.length === 3 ? authUser.RegistedUser.seasonWiseDominantVarieties : [
                { value: "aus", input: "" },
                { value: "aman", input: "" },
                { value: "boro", input: "" },
            ]);
            setTransplantingDates(authUser.RegistedUser.transplantingDates?.length === 3 ? authUser.RegistedUser.transplantingDates : [
                { value: "aus", fromDate: "", toDate: "" },
                { value: "aman", fromDate: "", toDate: "" },
                { value: "boro", fromDate: "", toDate: "" },
            ]);
            setPiTimes(authUser.RegistedUser.piTimes?.length === 3 ? authUser.RegistedUser.piTimes : [
                { value: "aus", fromDate: "", toDate: "" },
                { value: "aman", fromDate: "", toDate: "" },
                { value: "boro", fromDate: "", toDate: "" },
            ]);
            setFloweringDates(authUser.RegistedUser.floweringDates?.length === 3 ? authUser.RegistedUser.floweringDates : [
                { value: "aus", fromDate: "", toDate: "" },
                { value: "aman", fromDate: "", toDate: "" },
                { value: "boro", fromDate: "", toDate: "" },
            ]);
            setExpectedHarvestPeriods(authUser.RegistedUser.expectedHarvestPeriods?.length === 3 ? authUser.RegistedUser.expectedHarvestPeriods : [
                { value: "aus", fromDate: "", toDate: "" },
                { value: "aman", fromDate: "", toDate: "" },
                { value: "boro", fromDate: "", toDate: "" },
            ]);
        }
    }, [authUser]);

    useEffect(() => {
        if (!selectedHotspots.length) return;
        const fetchRegion = async () => {
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/data/regions?hotspot=${selectedHotspots.join(',')}`);
                if (!response.ok) throw new Error("Failed to fetch region data");
                const data = await response.json();
                setRegions(data.sort((a, b) => a.localeCompare(b)));
            } catch (error) {
                console.error("Error fetching region data:", error);
            }
        };
        fetchRegion();
    }, [selectedHotspots]);

    useEffect(() => {
        if (!formData.region || !selectedHotspots.length) return;
        const fetchDivision = async () => {
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/data/divisions?region=${formData.region}&hotspot=${selectedHotspots.join(',')}`);
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
        if (!formData.division || !formData.region || !selectedHotspots.length) return;
        const fetchDistrict = async () => {
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/data/districts?division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots.join(',')}`);
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
        if (!formData.district || !formData.division || !formData.region || !selectedHotspots.length) return;
        const fetchUpazila = async () => {
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/data/upazilas?district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots.join(',')}`);
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
        if (!formData.upazila || !formData.district || !formData.division || !formData.region || !selectedHotspots.length) return;
        const fetchUnion = async () => {
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/data/unions?upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots.join(',')}`);
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
        if (!formData.union || !formData.upazila || !formData.district || !formData.division || !formData.region || !selectedHotspots.length) return;
        const fetchBlock = async () => {
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/data/blocks?union=${formData.union}&upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots.join(',')}`);
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
        const fetchHotspots = async () => {
            try {
                const response = await fetch("https://iinms.brri.gov.bd/api/hotspots");
                if (!response.ok) throw new Error("Failed to fetch hotspots");
                const data = await response.json();
                setHotspot(data.reverse());
            } catch (error) {
                console.error("Error fetching hotspots:", error);
            }
        };
        fetchHotspots();
    }, []);

    useEffect(() => {
        const fetchSAAOs = async () => {
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/role/saao?page=${page}&limit=${rowsPerPage}&search=${encodeURIComponent(searchText)}`);
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
            }
        };
        fetchSAAOs();
    }, [page, rowsPerPage, searchText]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHotspotSelect = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !selectedHotspots.includes(selectedValue)) {
            const updatedHotspots = [...selectedHotspots, selectedValue];
            setSelectedHotspots(updatedHotspots);
            setFormData(prev => ({ ...prev, hotspot: updatedHotspots }));
        }
    };

    const handleHotspotDelete = (valueToDelete) => {
        const updatedHotspots = selectedHotspots.filter(value => value !== valueToDelete);
        setSelectedHotspots(updatedHotspots);
        setFormData(prev => ({ ...prev, hotspot: updatedHotspots }));
    };

    const handleCropSelect = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === "others") {
            setIsOtherMajorCropOpen(true);
            return;
        }
        if (selectedValue && !selectedMajorCrop.includes(selectedValue)) {
            const updatedCrops = [...selectedMajorCrop, selectedValue];
            setSelectedMajorCrop(updatedCrops);
            setFormData(prev => ({ ...prev, majorCrops: updatedCrops.join(', ') }));
        }
    };

    const handleClimateExtremeSelect = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !selectedClimateExtremes.includes(selectedValue)) {
            const updatedExtremes = [...selectedClimateExtremes, selectedValue];
            setSelectedClimateExtremes(updatedExtremes);
            setFormData(prev => ({ ...prev, climateExtremes: updatedExtremes.join(', ') }));
        }
    };

    const handleClimateExtremeDelete = (valueToDelete) => {
        const updatedExtremes = selectedClimateExtremes.filter(value => value !== valueToDelete);
        setSelectedClimateExtremes(updatedExtremes);
        setFormData(prev => ({ ...prev, climateExtremes: updatedExtremes.join(', ') }));
    };

    const handleCropDelete = (valueToDelete) => {
        const updatedCrops = selectedMajorCrop.filter(value => value !== valueToDelete);
        setSelectedMajorCrop(updatedCrops);
        setFormData(prev => ({ ...prev, majorCrops: updatedCrops.join(', ') }));
    };

    const handleAddOtherCrop = () => {
        if (selectedMajorCropOthers && !selectedMajorCrop.includes(selectedMajorCropOthers)) {
            const updatedCrops = [...selectedMajorCrop, selectedMajorCropOthers];
            setSelectedMajorCrop(updatedCrops);
            setFormData(prev => ({ ...prev, majorCrops: updatedCrops.join(', ') }));
        }
        setIsOtherMajorCropOpen(false);
        setSelectedMajorCropOthers("");
    };

    const registerSAAO = async (e) => {
        e.preventDefault();
        if (formData.mobileNumber.length !== 11) {
            alert("Mobile number must be 11 digits long.");
            return;
        }

        const submissionData = {
            ...formData,
            transplantingDates,
            piTimes,
            floweringDates,
            expectedHarvestPeriods,
            seasonWiseDominantVarieties: selectedSeasonVarieties,
            hotspot: selectedHotspots,
            majorCrops: selectedMajorCrop.join(', '),
            climateExtremes: selectedClimateExtremes.join(', '),
            soilType: formData.soilType === "others" ? otherSoilType : formData.soilType,
            irrigationPractices: formData.irrigationPractices === "others" ? irrigationPracticesOthers : formData.irrigationPractices,
        };

        try {
            const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                setIsEdit(false);
                alert("SAAO updated successfully!");
                window.location.reload();
            } else {
                throw new Error("Failed to update SAAO");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to update SAAO. Please try again.");
        }
    };

    const resetForm = () => {
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
            lat: "",
            lan: "",
            landType: "",
            hotspot: [],
            majorCrops: "",
            irrigationPractices: "",
            irrigationSourceType: "",
            plantingMethod: "",
            croppingPattern: "",
            riceVarieties: "",
            soilType: "",
            role: "saao",
            totalCultivatedArea: "",
            numberOfFarmers: "",
            communityInformation: "",
            farmerGroupName: "",
        });
        setSelectedHotspots([]);
        setSelectedMajorCrop([]);
        setSelectedClimateExtremes([]);
        setOtherSoilType("");
        setIrrigationPracticesOthers("");
        setIsOtherMajorCropOpen(false);
        setSelectedMajorCropOthers("");
        setSelectedSeasonVarieties([
            { value: "aus", input: "" },
            { value: "aman", input: "" },
            { value: "boro", input: "" },
        ]);
        setTransplantingDates([
            { value: "aus", fromDate: "", toDate: "" },
            { value: "aman", fromDate: "", toDate: "" },
            { value: "boro", fromDate: "", toDate: "" },
        ]);
        setPiTimes([
            { value: "aus", fromDate: "", toDate: "" },
            { value: "aman", fromDate: "", toDate: "" },
            { value: "boro", fromDate: "", toDate: "" },
        ]);
        setFloweringDates([
            { value: "aus", fromDate: "", toDate: "" },
            { value: "aman", fromDate: "", toDate: "" },
            { value: "boro", fromDate: "", toDate: "" },
        ]);
        setExpectedHarvestPeriods([
            { value: "aus", fromDate: "", toDate: "" },
            { value: "aman", fromDate: "", toDate: "" },
            { value: "boro", fromDate: "", toDate: "" },
        ]);
        setCurrentStep(1);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <form className="space-y-6" onSubmit={registerSAAO}>
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-700">Personal Information</h4>
                        <div className="relative w-32 h-32 mx-auto">
                            <label htmlFor="profileImageInput" className="cursor-pointer group block w-full h-full">
                                <img
                                    src={formData.profileImage || "/download.jpeg"}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-md group-hover:opacity-80 transition duration-200"
                                />
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition duration-200">
                                    <span className="text-white text-sm font-medium">Change</span>
                                </div>
                            </label>
                            <input
                                id="profileImageInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    SAAO's Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="SAAO's Name"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
                                    Father's Name
                                </label>
                                <input
                                    type="text"
                                    id="fatherName"
                                    name="fatherName"
                                    placeholder="Father's Name"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                                    Mobile Number
                                </label>
                                <input
                                    type="text"
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    placeholder="Mobile Number"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                                    WhatsApp Number
                                </label>
                                <input
                                    type="text"
                                    id="whatsappNumber"
                                    name="whatsappNumber"
                                    placeholder="WhatsApp Number"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.whatsappNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="messengerId" className="block text-sm font-medium text-gray-700">
                                    Facebook ID
                                </label>
                                <input
                                    type="text"
                                    id="messengerId"
                                    name="messengerId"
                                    placeholder="Facebook ID"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.messengerId}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="alternateContact" className="block text-sm font-medium text-gray-700">
                                    Official Contact
                                </label>
                                <input
                                    type="text"
                                    id="alternateContact"
                                    name="alternateContact"
                                    placeholder="Official Contact"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.alternateContact}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Information Section */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-700">Location Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2 mb-4">
                                {selectedHotspots?.map(hotspotName => (
                                    <div
                                        key={hotspotName}
                                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        <span>{hotspotName}</span>
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500 hover:text-red-700"
                                            onClick={() => handleHotspotDelete(hotspotName)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label htmlFor="hotspot" className="block text-sm font-medium text-gray-700">
                                    Hotspot
                                </label>
                                <select
                                    id="hotspot"
                                    name="hotspot"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value=""
                                    onChange={handleHotspotSelect}
                                >
                                    <option value="">Select Hotspot</option>
                                    {hotspot.map(h => (
                                        <option key={h.id} value={h.name}>
                                            {h.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                    Region
                                </label>
                                <select
                                    id="region"
                                    name="region"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.region}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Region</option>
                                    {regions.map(region => (
                                        <option key={region} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                                    Division
                                </label>
                                <select
                                    id="division"
                                    name="division"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.division}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Division</option>
                                    {divisions.map(division => (
                                        <option key={division} value={division}>
                                            {division}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                                    District
                                </label>
                                <select
                                    id="district"
                                    name="district"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.district}
                                    onChange={handleChange}
                                >
                                    <option value="">Select District</option>
                                    {districts.map(district => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="upazila" className="block text-sm font-medium text-gray-700">
                                    Upazila
                                </label>
                                <select
                                    id="upazila"
                                    name="upazila"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.upazila}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Upazila</option>
                                    {upazilas.map(upazila => (
                                        <option key={upazila} value={upazila}>
                                            {upazila}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="union" className="block text-sm font-medium text-gray-700">
                                    Union
                                </label>
                                <select
                                    id="union"
                                    name="union"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.union}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Union</option>
                                    {unions.map(union => (
                                        <option key={union} value={union}>
                                            {union}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="block" className="block text-sm font-medium text-gray-700">
                                    Block
                                </label>
                                <select
                                    id="block"
                                    name="block"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.block}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Block</option>
                                    {block.map(b => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div>
                                    <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        id="lat"
                                        name="lat"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.lat}
                                        placeholder="Latitude"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lan" className="block text-sm font-medium text-gray-700">
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        id="lan"
                                        name="lan"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.lan}
                                        placeholder="Longitude"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lan" className="block text-sm font-medium text-gray-700">
                                        Get Location
                                    </label>
                                    <button
                                        type="button"
                                        onClick={getLocation}
                                        className="flex justify-center items-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
                                    >
                                        <MdGpsFixed className="text-2xl text-blue-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Farming Information Section */}
                    {authUser.role === "SAAO" && 
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-700">Farming Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="landType" className="block text-sm font-medium text-gray-700">
                                        Land Type
                                    </label>
                                    <select
                                        id="landType"
                                        name="landType"
                                        className="w-full h-11 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.landType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Land Type</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="plantingMethod" className="block text-sm font-medium text-gray-700">
                                        Planting Method
                                    </label>
                                    <select
                                        id="plantingMethod"
                                        name="plantingMethod"
                                        className="w-full h-11 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.plantingMethod}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Planting Method</option>
                                        <option value="directSeeding">Direct Seeding</option>
                                        <option value="transplanting">Transplanting</option>
                                    </select>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="majorCrops" className="block text-sm font-medium text-gray-700">
                                        Major Crops
                                    </label>
                                    <select
                                        id="majorCrops"
                                        name="majorCrops"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value=""
                                        onChange={handleCropSelect}
                                    >
                                        <option value="">Select Major Crops</option>
                                        <option value="rice">Rice</option>
                                        <option value="wheat">Wheat</option>
                                        <option value="maize">Maize</option>
                                        <option value="vegetables">Vegetables</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="majorCrops" className="block text-sm font-medium text-gray-700">
                                        Selected Major Crops
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedMajorCrop.map(crop => (
                                            <div key={crop} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                <span>{crop}</span>
                                                <button
                                                    type="button"
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                    onClick={() => handleCropDelete(crop)}
                                                >
                                                    <MdDeleteForever />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {isOtherMajorCropOpen && (
                                    <div className="col-span-2 flex gap-2">
                                        <div className="flex-1">
                                            <label htmlFor="otherMajorCrop" className="block text-sm font-medium text-gray-700">
                                                Other Crop
                                            </label>
                                            <input
                                                type="text"
                                                id="otherMajorCrop"
                                                name="otherMajorCrop"
                                                placeholder="Enter Other Crop"
                                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={selectedMajorCropOthers}
                                                onChange={(e) => setSelectedMajorCropOthers(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 sr-only">
                                                Add Crop
                                            </label>
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                                onClick={handleAddOtherCrop}
                                            >
                                                Add Crop
                                            </button>
                                        </div>
                                    </div>
                                )}



                                {/* Transplanting Time Section */}
                                <div className="space-y-4 col-span-2">
                                    <h5 className="text-sm font-bold text-gray-700">Transplanting Period</h5>
                                    {transplantingDates.map((opt, index) => (
                                        <div key={opt.value} className="flex items-center gap-4">
                                            <span className="w-12 font-medium">{seasonOptions.find(o => o.value === opt.value)?.label || opt.value}</span>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <div>
                                                    <label htmlFor={`transplantingFrom-${opt.value}`} className="block text-sm font-medium text-gray-700">
                                                        From
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id={`transplantingFrom-${opt.value}`}
                                                        value={opt.fromDate}
                                                        onChange={(e) => handleTransplantingDateChange(index, 'fromDate', e.target.value)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`transplantingTo-${opt.value}`} className="block text-sm font-medium text-gray-700">
                                                        To
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id={`transplantingTo-${opt.value}`}
                                                        value={opt.toDate}
                                                        onChange={(e) => handleTransplantingDateChange(index, 'toDate', e.target.value)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* PI Time Section */}
                                <div className="space-y-4 col-span-2">
                                    <h5 className="text-sm font-bold text-gray-700">PI Period</h5>
                                    {piTimes.map((opt, index) => (
                                        <div key={opt.value} className="flex items-center gap-4">
                                            <span className="w-12 font-medium">{seasonOptions.find(o => o.value === opt.value)?.label || opt.value}</span>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <div>
                                                    <label htmlFor={`piTimeFrom-${opt.value}`} className="block text-sm font-medium text-gray-700">
                                                        From
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id={`piTimeFrom-${opt.value}`}
                                                        value={opt.fromDate}
                                                        onChange={(e) => handlePiTimeChange(index, 'fromDate', e.target.value)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`piTimeTo-${opt.value}`} className="block text-sm font-medium text-gray-700">
                                                        To
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id={`piTimeTo-${opt.value}`}
                                                        value={opt.toDate}
                                                        onChange={(e) => handlePiTimeChange(index, 'toDate', e.target.value)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Season for Flowering Date Section */}
                                <div className="space-y-4 col-span-2">
                                    <h5 className="text-sm font-bold text-gray-700">Flowering Period</h5>
                                    {floweringDates.map((opt, index) => (
                                        <div key={opt.value} className="flex items-center gap-4">
                                            <span className="w-12 font-medium">{seasonOptions.find(o => o.value === opt.value)?.label || opt.value}</span>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <div>
                                                    <label htmlFor={`floweringFrom-${opt.value}`} className="block text-sm font-medium text-gray-700">
                                                        From
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id={`floweringFrom-${opt.value}`}
                                                        value={opt.fromDate}
                                                        onChange={(e) => handleFloweringDateChange(index, 'fromDate', e.target.value)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`floweringTo-${opt.value}`} className="block text-sm font-medium text-gray-700">
                                                        To
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id={`floweringTo-${opt.value}`}
                                                        value={opt.toDate}
                                                        onChange={(e) => handleFloweringDateChange(index, 'toDate', e.target.value)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Expected Harvest Period Section */}
                                <div className="space-y-4 col-span-2">
                                    <h5 className="text-sm font-bold text-gray-700">Expected Harvest Period</h5>
                                    {expectedHarvestPeriods.map((opt, index) => (
                                        <div key={opt.value} className="flex items-center gap-4">
                                            <span className="w-12 font-medium capitalize">{seasonOptions.find(o => o.value === opt.value)?.label || opt.value}</span>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <div>
                                                    <label htmlFor={`harvestFrom-${opt.value}`} className="block text-sm font-medium text-gray-700">
                                                        From
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id={`harvestFrom-${opt.value}`}
                                                        value={opt.fromDate}
                                                        onChange={(e) => handleExpectedHarvestDateChange(index, 'fromDate', e.target.value)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`harvestTo-${opt.value}`} className="block text-sm font-medium text-gray-700">
                                                        To
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id={`harvestTo-${opt.value}`}
                                                        value={opt.toDate}
                                                        onChange={(e) => handleExpectedHarvestDateChange(index, 'toDate', e.target.value)}
                                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Season Wise Dominant Varieties Section */}
                                <div className="space-y-4 col-span-2">
                                    <h5 className="text-sm  text-gray-700 font-bold">Season Wise Dominant Varieties</h5>
                                    {selectedSeasonVarieties.map((opt, index) => (
                                        <div key={opt.value} className="flex items-center gap-4">
                                            <span className="w-12 font-medium">{seasonOptions.find(o => o.value === opt.value)?.label || opt.value}</span>
                                            <div className="flex-1">

                                                <input
                                                    type="text"
                                                    id={`seasonVariety-${opt.value}`}
                                                    placeholder="Enter variety"
                                                    value={opt.input}
                                                    onChange={(e) => handleSeasonVarietyInputChange(index, e.target.value)}
                                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="irrigationPractices" className="block text-sm font-medium text-gray-700">
                                        Irrigation Practices
                                    </label>
                                    <select
                                        id="irrigationPractices"
                                        name="irrigationPractices"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.irrigationPractices}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Irrigation Practices</option>
                                        <option value="AWD">AWD</option>
                                        <option value="continuousFlooding">Continuous Flooding</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>

                                {formData.irrigationPractices === "others" && (
                                    <div>
                                        <label htmlFor="irrigationPracticesOthers" className="block text-sm font-medium text-gray-700">
                                            Other Irrigation Practices
                                        </label>
                                        <input
                                            type="text"
                                            id="irrigationPracticesOthers"
                                            name="irrigationPracticesOthers"
                                            placeholder="Other Irrigation Practices"
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={irrigationPracticesOthers}
                                            onChange={(e) => setIrrigationPracticesOthers(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="irrigationSourceType" className="block text-sm font-medium text-gray-700">
                                        Water Source
                                    </label>
                                    <select
                                        id="irrigationSourceType"
                                        name="irrigationSourceType"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.irrigationSourceType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Water Source</option>
                                        <option value="surface">Surface_LLP</option>
                                        <option value="GroundWaterShallow">Ground Water_Shallow</option>
                                        <option value="GroundWaterDeep">Ground Water_Deep</option>
                                    </select>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="soilType" className="block text-sm font-medium text-gray-700">
                                        Soil Type
                                    </label>
                                    <select
                                        id="soilType"
                                        name="soilType"
                                        className="w-full p-3 h-11 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                </div>

                                {formData.soilType === "others" && (
                                    <div>
                                        <label htmlFor="otherSoilType" className="block text-sm font-medium text-gray-700">
                                            Other Soil Type
                                        </label>
                                        <input
                                            type="text"
                                            id="otherSoilType"
                                            name="otherSoilType"
                                            placeholder="Other Soil Type"
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={otherSoilType}
                                            onChange={(e) => setOtherSoilType(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="croppingPattern" className="block text-sm font-medium text-gray-700">
                                        Cropping Pattern
                                    </label>
                                    <input
                                        type="text"
                                        id="croppingPattern"
                                        name="croppingPattern"
                                        placeholder="Cropping Pattern"
                                        className="w-full h-11 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.croppingPattern}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">

                                    <label htmlFor="climateExtremes" className="block text-sm font-medium text-gray-700">
                                        Major Climate Extremes
                                    </label>
                                    <select
                                        id="climateExtremes"
                                        name="climateExtremes"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value=""
                                        onChange={handleClimateExtremeSelect}
                                    >
                                        <option value="">Select Major Climate Extremes</option>
                                        {climateExtremeOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="soilType" className="block text-sm font-medium text-gray-700">
                                        Selected Major Climate Extremes
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedClimateExtremes.map(extreme => (
                                            <div key={extreme} className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                <span>{extreme}</span>
                                                <button
                                                    type="button"
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                    onClick={() => handleClimateExtremeDelete(extreme)}
                                                >
                                                    <MdDeleteForever />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="totalCultivatedArea" className="block text-sm font-medium text-gray-700">
                                        Total Cultivated Area (ha)
                                    </label>
                                    <input
                                        type="text"
                                        id="totalCultivatedArea"
                                        name="totalCultivatedArea"
                                        placeholder="Total Cultivated Area (ha)"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.totalCultivatedArea}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="numberOfFarmers" className="block text-sm font-medium text-gray-700">
                                        Number of Farmers
                                    </label>
                                    <input
                                        type="text"
                                        id="numberOfFarmers"
                                        name="numberOfFarmers"
                                        placeholder="Number of Farmers"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.numberOfFarmers}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="communityInformation" className="block text-sm font-medium text-gray-700">
                                        Community Information
                                    </label>
                                    <select
                                        id="communityInformation"
                                        name="communityInformation"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.communityInformation}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Community Information</option>
                                        <option value="Farmer Group">Farmer Group</option>
                                        <option value="Farmer Field School">Farmer Field School</option>
                                        <option value="Agromet School">Agromet School</option>
                                        <option value="None">None</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {formData.communityInformation === "Other" && (
                                    <div>
                                        <label htmlFor="farmerGroupName" className="block text-sm font-medium text-gray-700">
                                            Farmer Group Name
                                        </label>
                                        <input
                                            type="text"
                                            id="farmerGroupName"
                                            name="farmerGroupName"
                                            placeholder="Farmer Group Name"
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.farmerGroupName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    {/* Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleExportPDF}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            PDF
                        </button>
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            CSV
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;