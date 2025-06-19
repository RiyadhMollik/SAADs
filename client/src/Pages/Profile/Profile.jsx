import { useEffect, useState } from "react";
import { FaBars, FaEdit, FaLocationArrow, FaTrash } from "react-icons/fa";
import { ChevronsUpDown } from "lucide-react";
import { useAuthContext } from "../../Components/context/AuthProvider";
import { MdDeleteForever, MdGpsFixed } from "react-icons/md";

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
    const [selectedClimetExtreams, setSelectedClimetExtreams] = useState([]);
    const [isOtherMajorCropOpen, setIsOtherMajorCropOpen] = useState(false);
    const [selectedMajorCropOthers, setSelectedMajorCropOthers] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptions2, setSelectedOptions2] = useState([]);
    const [transplantingDates, setTransplantingDates] = useState([]);
    const [floweringDates, setFloweringDates] = useState([]);
    const [expectedHarvestPeriods, setExpectedHarvestPeriods] = useState([]);

    const harvestOptions = [
        { label: "Aus", value: "aus" },
        { label: "Aman", value: "aman" },
        { label: "Boro", value: "boro" },
    ];

    const handleExpectedHarvestSelect = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !expectedHarvestPeriods.find(item => item.value === selectedValue)) {
            setExpectedHarvestPeriods((prev) => [
                ...prev,
                { value: selectedValue, date: "" }
            ]);
        }
    };

    const handleExpectedHarvestDateChange = (date, index) => {
        const updated = [...expectedHarvestPeriods];
        updated[index].date = date;
        setExpectedHarvestPeriods(updated);
    };

    const removeExpectedHarvestOption = (index) => {
        const updated = [...expectedHarvestPeriods];
        updated.splice(index, 1);
        setExpectedHarvestPeriods(updated);
    };
    const floweringOptions = [
        { label: "Aus", value: "Aus" },
        { label: "Aman", value: "Aman" },
        { label: "Boro", value: "Boro" },
    ];

    const handleFloweringSelect = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !floweringDates.find(item => item.value === selectedValue)) {
            setFloweringDates((prev) => [
                ...prev,
                { value: selectedValue, date: "" }
            ]);
        }
    };
    const handleFloweringDateChange = (date, index) => {
        const updatedFloweringDates = [...floweringDates];
        updatedFloweringDates[index].date = date;
        setFloweringDates(updatedFloweringDates);
    };

    const removeFloweringDateOption = (index) => {
        const updatedFloweringDates = [...floweringDates];
        updatedFloweringDates.splice(index, 1);
        setFloweringDates(updatedFloweringDates);
    };


    const transplantingOptions = [
        { label: "Aus", value: "Aus" },
        { label: "Aman", value: "Aman" },
        { label: "Boro", value: "Boro" },
    ];
    const options = [
        { label: "Aus", value: "Aus" },
        { label: "Aman", value: "Aman" },
        { label: "Boro", value: "Boro" },
    ];
    const handleTransplantingSelect = (e) => {
        const selectedValue = e.target.value;
        if (!transplantingDates.find((item) => item.value === selectedValue)) {
            setTransplantingDates((prev) => [
                ...prev,
                { value: selectedValue, date: "" },
            ]);
        }
    };
    const handleDateChange = (dateValue, index) => {
        const updated = [...transplantingDates];
        updated[index].date = dateValue;
        setTransplantingDates(updated);
    };
    const removeDateOption = (index) => {
        const updated = [...transplantingDates];
        updated.splice(index, 1);
        setTransplantingDates(updated);
    };



    const handleInputChange = (value, index) => {
        const updated = [...selectedOptions];
        updated[index].input = value;
        setSelectedOptions(updated);
    };
    const removeOption = (index) => {
        const updated = [...selectedOptions];
        updated.splice(index, 1);
        setSelectedOptions(updated);
    };
    const handleInputChange2 = (value, index) => {
        const updated = [...selectedOptions];
        updated[index].input = value;
        setSelectedOptions2(updated);
    };
    const removeOption2 = (index) => {
        const updated = [...selectedOptions];
        updated.splice(index, 1);
        setSelectedOptions2(updated);
    };
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
        hotspot: [],
        majorCrops: "",
        irrigationPractices: "",
        plantingMethod: "",
        croppingPattern: "",
        riceVarieties: "",
        soilType: "",
        role: "saao",
    });
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
                setFormData((prev) => ({
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
                    setFormData((prev) => ({
                        ...prev,
                        lat: position.coords.latitude.toFixed(6),
                        lan: position.coords.longitude.toFixed(6),
                    }));
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        if (authUser) {
            setFormData(authUser.RegistedUser);
            setSelectedHotspots(authUser.RegistedUser.hotspot || []);
            setSelectedMajorCrop(authUser.RegistedUser?.majorCrops?.split(",") || []);
            setSelectedId(authUser.RegistedUser.id);
            setSelectedOptions(authUser.RegistedUser.seasonWiseDominantVarieties || []);
            setTransplantingDates(authUser.RegistedUser.transplantingDates || []);
            setFloweringDates(authUser.RegistedUser.floweringDates || []);
            setExpectedHarvestPeriods(authUser.RegistedUser.expectedHarvestPeriods || []);


        }
    }, [authUser])
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

    const API_URL = "https://iinms.brri.gov.bd/api/hotspots";
    const fetchRoles = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch hotspots");
            const data = await response.json();
            setHotspot(data.reverse());
        } catch (error) {
            console.error("Error fetching hotspots:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

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

    useEffect(() => {
        fetchSAAOs();
    }, [page, rowsPerPage, searchText]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !selectedHotspots.includes(selectedValue)) {
            const updatedHotspots = [...selectedHotspots, selectedValue];
            setSelectedHotspots(updatedHotspots);
            setFormData({ ...formData, hotspot: updatedHotspots });
        }
    };

    const handleDelete = (valueToDelete) => {
        const updatedHotspots = selectedHotspots.filter((value) => value !== valueToDelete);
        setSelectedHotspots(updatedHotspots);
        setFormData({ ...formData, hotspot: updatedHotspots });
    };

    const handleSelectCrop = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === "others") {
            setIsOtherMajorCropOpen(true);
            return;
        }
        if (selectedValue && !selectedMajorCrop.includes(selectedValue)) {
            const updatedSelectedMajorCrop = [...selectedMajorCrop, selectedValue];
            setSelectedMajorCrop(updatedSelectedMajorCrop);
            setFormData({ ...formData, majorCrops: updatedSelectedMajorCrop.join(', ') });
        }
    };
    const handleSelectClimetExtreams = (e) => {
        const selectedValue = e.target.value;
        
        if (selectedValue && !selectedClimetExtreams.includes(selectedValue)) {
            const updatedSelectedMajorCrop = [...selectedClimetExtreams, selectedValue];
            setSelectedClimetExtreams(updatedSelectedMajorCrop);
            setFormData({ ...formData, majorCrops: updatedSelectedMajorCrop.join(', ') });
        }
    };

    const handleDeleteCrop = (valueToDelete) => {
        const updatedSelectedMajorCrop = selectedMajorCrop.filter((value) => value !== valueToDelete);
        setSelectedMajorCrop(updatedSelectedMajorCrop);
        setFormData({ ...formData, majorCrops: updatedSelectedMajorCrop.join(', ') });
    };

    const handleAddCrop = () => {
        if (selectedMajorCropOthers && !selectedMajorCrop.includes(selectedMajorCropOthers)) {
            const updatedSelectedMajorCrop = [...selectedMajorCrop, selectedMajorCropOthers];
            setSelectedMajorCrop(updatedSelectedMajorCrop);
            setFormData({ ...formData, majorCrops: updatedSelectedMajorCrop.join(', ') });
        }
        setIsOtherMajorCropOpen(false);
        setSelectedMajorCropOthers("");
    };

    const registerSAAO = async () => {
        if (formData.mobileNumber.length !== 11) {
            alert("Mobile number must be 11 digits long.");
            return;
        }
        const submissionData = {
            ...formData,
            transplantingDates,
            floweringDates,
            expectedHarvestPeriods,
            seasonWiseDominantVarieties: selectedOptions,
            hotspot: selectedHotspots,
            majorCrops: selectedMajorCrop.join(', '),
            soilType: formData.soilType === "others" ? otherSoilType : formData.soilType,
            irrigationPractices: formData.irrigationPractices === "others" ? irrigationPracticesOthers : formData.irrigationPractices,
        };
        try {
            const method = "PUT";
            const url = `https://iinms.brri.gov.bd/api/farmers/farmers/${selectedId}`;
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });
            if (response.ok) {
                setIsEdit(false);
                fetchSAAOs();
                resetForm();
                alert("SAAO registered successfully!");
                window.location.reload();
            } else {
                throw new Error("Failed to save SAAO");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to save SAAO. Please try again.");
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
        setOtherSoilType("");
        setIrrigationPracticesOthers("");
        setIsOtherMajorCropOpen(false);
        setSelectedMajorCropOthers("");
        setCurrentStep(1);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className=" bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <form className="space-y-6">
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
                            <input
                                type="text"
                                name="name"
                                placeholder="SAAO's Name"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="fatherName"
                                placeholder="Father's Name"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.fatherName}
                                onChange={handleChange}
                            />
                            <select
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
                            <input
                                type="text"
                                name="mobileNumber"
                                placeholder="Mobile Number"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="whatsappNumber"
                                placeholder="WhatsApp Number"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.whatsappNumber}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="messengerId"
                                placeholder="Facebook ID"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.messengerId}
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="alternateContact"
                                placeholder="Official Contact"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.alternateContact}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-700">Location Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Selected Hotspots */}
                            <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2 mb-4">
                                {selectedHotspots.map((hotspotName) => (
                                    <div
                                        key={hotspotName}
                                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        <span>{hotspotName}</span>
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500 hover:text-red-700"
                                            onClick={() => handleDelete(hotspotName)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Dropdowns */}
                            <select
                                name="hotspot"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                            {/* Latitude, Longitude, GPS */}
                            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                <input
                                    type="text"
                                    name="lat"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.lat}
                                    placeholder="Latitude"
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="lan"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.lan}
                                    placeholder="Longitude"
                                    onChange={handleChange}
                                    required
                                />
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

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-700">Farming Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                name="landType"
                                className="w-full h-11 mt-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.landType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Land Type</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <div>
                                <div className=" flex flex-wrap gap-2 mb-4">
                                    {selectedMajorCrop.map((crop) => (
                                        <div key={crop} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                            <span>{crop}</span>
                                            <button
                                                type="button"
                                                className="ml-2 text-red-500 hover:text-red-700"
                                                onClick={() => handleDeleteCrop(crop)}
                                            >
                                                <MdDeleteForever />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <select
                                    name="majorCrops"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            </div>
                            {isOtherMajorCropOpen && (
                                <div className="col-span-2 flex gap-2">
                                    <input
                                        type="text"
                                        name="otherMajorCrop"
                                        placeholder="Enter Other Crop"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedMajorCropOthers}
                                        onChange={(e) => setSelectedMajorCropOthers(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                        onClick={handleAddCrop}
                                    >
                                        Add Crop
                                    </button>
                                </div>
                            )}
                            <select
                                name="plantingMethod"
                                className="w-full p-3 h-11 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.plantingMethod}
                                onChange={handleChange}
                            >
                                <option value="">Select Planting Method</option>
                                <option value="directSeeding">Direct Seeding</option>
                                <option value="transplanting">Transplanting</option>
                            </select>

                            <div className="space-y-4">
                                <select
                                    onChange={handleTransplantingSelect}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Transplanting Time</option>
                                    {transplantingOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {transplantingDates.map((opt, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <span className="w-11">{transplantingOptions.find(o => o.value === opt.value)?.label}</span>
                                        <input
                                            type="date"
                                            value={opt.date}
                                            onChange={(e) => handleDateChange(e.target.value, index)}
                                            className="p-2 border rounded w-full max-w-xs"
                                        />
                                        <button
                                            onClick={() => removeDateOption(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <MdDeleteForever />

                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <select
                                    onChange={handleFloweringSelect}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Season for Flowering Date</option>
                                    {floweringOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                {floweringDates.map((item, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <span className="w-11 font-medium">
                                            {floweringOptions.find(o => o.value === item.value)?.label}
                                        </span>
                                        <input
                                            type="date"
                                            value={item.date}
                                            onChange={(e) => handleFloweringDateChange(e.target.value, index)}
                                            className="p-2 border rounded w-full max-w-xs"
                                        />
                                        <button
                                            onClick={() => removeFloweringDateOption(index)}
                                            className="text-red-500 hover:text-red-700 text-xl"
                                            title="Remove"
                                        >
                                            <MdDeleteForever />

                                        </button>

                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <select
                                    onChange={handleExpectedHarvestSelect}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Expected Harvest Period</option>
                                    {harvestOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {expectedHarvestPeriods.map((item, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <span className="w-11 font-medium capitalize">
                                            {harvestOptions.find(o => o.value === item.value)?.label}
                                        </span>
                                        <input
                                            type="date"
                                            value={item.date}
                                            onChange={(e) => handleExpectedHarvestDateChange(e.target.value, index)}
                                            className="p-2 border rounded w-full max-w-xs"
                                        />
                                        <button
                                            onClick={() => removeExpectedHarvestOption(index)}
                                            className="text-red-500 hover:text-red-700 text-xl"
                                            title="Remove"
                                        ><MdDeleteForever />

                                        </button>
                                    </div>
                                ))}
                            </div>
                            <select
                                name="irrigationPractices"
                                className="w-full p-3 h-11 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.irrigationPractices}
                                onChange={handleChange}
                            >
                                <option value="">Select Irrigation Practices</option>
                                <option value="AWD">AWD</option>
                                <option value="continuousFlooding">Continuous Flooding</option>
                                <option value="others">Others</option>
                            </select>
                            {formData.irrigationPractices === "others" && (
                                <input
                                    type="text"
                                    name="irrigationPracticesOthers"
                                    placeholder="Other Irrigation Practices"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={irrigationPracticesOthers}
                                    onChange={(e) => setIrrigationPracticesOthers(e.target.value)}
                                />
                            )}
                            <select
                                name="irrigationSourceType"
                                className="w-full p-3 h-11 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.irrigationSourceType}
                                onChange={handleChange}
                            >
                                <option value="">Select Water Source</option>
                                <option value="surface">Surface_LLP</option>
                                <option value="GroundWaterShallow">Ground Water_Shallow</option>
                                <option value="GroundWaterDeep">Ground Water_Deep</option>
                            </select>
                            <select
                                name="soilType"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={otherSoilType}
                                    onChange={(e) => setOtherSoilType(e.target.value)}
                                />
                            )}
                            <div className="space-y-4">
                                <select
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Season Wise Dominant Varieties</option>
                                    {options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {selectedOptions2.map((opt, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <span className="w-11">{options.find(o => o.value === opt.value)?.label}</span>
                                        <input
                                            type="text"
                                            placeholder="Your input"
                                            value={opt.input}
                                            onChange={(e) => handleInputChange2(e.target.value, index)}
                                            className="flex-1 p-2 border rounded"
                                        />
                                        <button
                                            onClick={() => removeOption2(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <MdDeleteForever />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="text"
                                name="croppingPattern"
                                placeholder="Cropping Pattern"
                                className="w-full p-3 h-11 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.croppingPattern}
                                onChange={handleChange}
                            />
                            <select
                                name="majorCrops"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value=""
                                onChange={handleSelectCrop}
                            >
                                <option value="">Select Major Climate Extremes</option>
                                <option value="Flash Flood">Flash Flood</option>
                                <option value="River Flood">River Flood</option>
                                <option value="Urban Flood">Urban Flood</option>
                                <option value="Tidal Surge">Tidal Surge</option>
                                <option value="Heat Wave">Heat Wave</option>
                                <option value="Cold Wave">Cold Wave</option>
                                <option value="Cyclone">Cyclone</option>
                                <option value="Tornado">Tornado</option>
                                <option value="Drought">Drought</option>
                                <option value="Hailstorm">Hailstorm</option>
                                <option value="Lightning">Lightning</option>
                                <option value="Landslide">Landslide</option>
                                <option value="Salinity Intrusion">Salinity Intrusion</option>
                                <option value="Sea Level Rise">Sea Level Rise</option>
                            </select>
                            <input
                                type="text"
                                name="riceVarieties"
                                placeholder="Dominant Rice Varieties"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.riceVarieties}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="totalCultivatedArea"
                                placeholder="Total Cultivated Area (ha)"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.totalCultivatedArea}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="numberOfFarmers"
                                placeholder="Number of Farmers"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.numberOfFarmers}
                                onChange={handleChange}
                            />
                            <select
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
                            {
                                formData.communityInformation === "Other" && (
                                    <input
                                        type="text"
                                        name="farmerGroupName"
                                        placeholder="Farmer Group Name"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.farmerGroupName}
                                        onChange={handleChange}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={registerSAAO}
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile
