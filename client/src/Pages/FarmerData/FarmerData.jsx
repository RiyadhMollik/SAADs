import { useState, useEffect } from "react";
import { useAuthContext } from "../../Components/context/AuthProvider";

const FarmerData = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    0: {
      irrigation: [],
      other: {},
    },
    1: {
      other: {},
    },
    2: {
      other: {},
    },
    3: {
      herbicide: [],
      other: {},
    },
    4: {
      other: {},
    },
    5: {
      fertilizer: [],
      other: {},
    },
    6: {
      other: {},
    },
    7: {
      pesticide: [],
      other: {},
    },
    8: {
      fungicide: [],
      other: {},
    },
    9: {
      other: {},
    },
    10: {
      other: {},
    },
    11: {
      other: {},
    },
  });
  const [selectedUser, setSelectedUser] = useState("");
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const { authUser, loadingUser } = useAuthContext();

  // Fetch farmers from API
  const fetchFarmers = async (url) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setFarmers(data.data || []);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  };
  // Check if farmer data exists and show modal accordingly
  const checkExistingFarmerData = async () => {
    if (!authUser?.id) return;

    try {
      const response = await fetch(`https://iinms.brri.gov.bd/api/wabas/saao/${authUser.id}`);
      const data = await response.json();

      if (data.success && data.data && data.data.length >= 3) {
        // Data exists for 3 or more farmers, don't show modal
        setShowFarmerModal(false);
        // Load the first 3 farmers' data
        const existingFarmers = data.data.slice(0, 3);
        setSelectedFarmers(existingFarmers.map(item => ({
          id: item.farmerId,
          name: item.farmerName || "Unknown Farmer",
          phone: item.phone || "",
          village: item.village || ""
        })));
      } else {
        // No data or less than 3 farmers, show modal
        setShowFarmerModal(true);
      }
    } catch (error) {
      console.error("Error checking existing farmer data:", error);
      // If error, show modal to be safe
      setShowFarmerModal(true);
    }
  };

  // Fetch farmers when component mounts
  useEffect(() => {
    if (authUser?.role?.toLowerCase() === "saao" && authUser?.id) {
      console.log("saaoId:", authUser.id);
      const url = `https://iinms.brri.gov.bd/api/farmers/farmers/role/farmer?page=${page}&limit=${rowsPerPage}&saaoId=${authUser?.id}&search=${searchText}`;
      fetchFarmers(url);
    }
    else if (authUser?.role?.toLowerCase() !== "saao") {
      console.log("without saaoId");
      const url = `https://iinms.brri.gov.bd/api/farmers/farmers/role/farmer?page=${page}&limit=${rowsPerPage}&search=${searchText}`;
      fetchFarmers(url);
    }
  }, [page, rowsPerPage, authUser?.role, searchText, authUser?.id]);

  // Check existing data when authUser is available
  useEffect(() => {
    if (authUser?.id && !loadingUser) {
      checkExistingFarmerData();
    }
  }, [authUser?.id, loadingUser]);

  const [tempEntry, setTempEntry] = useState({
    irrigation: { date: "", cost: "" },
    fertilizer: { date: "", name: "", amount: "", cost: "" },
    herbicide: { date: "", name: "", amount: "", cost: "" },
    pesticide: { date: "", name: "", amount: "", cost: "" },
    fungicide: { date: "", name: "", amount: "", cost: "" },
  });

  // Handling input changes for single-entry fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        other: { ...prev[activeTab].other, [field]: value },
      },
    }));
  };

  // Handling input changes for multi-entry fields
  const handleTempEntryChange = (category, field, value) => {
    setTempEntry((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  // Handling user selection
  // Handle user selection and load existing data
  const handleUserChange = async (e) => {
    const farmerId = e.target.value;
    setSelectedUser(farmerId);

    if (farmerId) {
      try {
        setLoading(true); // Add loading state
        const response = await fetch(`https://iinms.brri.gov.bd/api/wabas/${farmerId}?saaoId=${authUser.id}`);
        const data = await response.json();

        console.log("API Response:", data); // Debug log

        if (data.success && data.data) {
          // Ensure the formData has the correct structure
          const loadedFormData = data.data.formData || {};

          // Merge with default structure to ensure all tabs exist
          const defaultStructure = {
            0: { irrigation: [], other: {} },
            1: { other: {} },
            2: { other: {} },
            3: { herbicide: [], other: {} },
            4: { other: {} },
            5: { fertilizer: [], other: {} },
            6: { other: {} },
            7: { pesticide: [], other: {} },
            8: { fungicide: [], other: {} },
            9: { other: {} },
            10: { other: {} },
            11: { other: {} }
          };

          // Merge loaded data with default structure
          const mergedFormData = {};
          for (let i = 0; i <= 11; i++) {
            mergedFormData[i] = {
              ...defaultStructure[i],
              ...loadedFormData[i]
            };
          }

          setFormData(mergedFormData);
          console.log("Loaded and merged form data:", mergedFormData);
        } else {
          // Initialize with blank data if no existing data
          setFormData({
            0: { irrigation: [], other: {} },
            1: { other: {} },
            2: { other: {} },
            3: { herbicide: [], other: {} },
            4: { other: {} },
            5: { fertilizer: [], other: {} },
            6: { other: {} },
            7: { pesticide: [], other: {} },
            8: { fungicide: [], other: {} },
            9: { other: {} },
            10: { other: {} },
            11: { other: {} }
          });
        }
      } catch (error) {
        console.error("Error loading farmer data:", error);
        alert("কৃষকের ডেটা লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    } else {
      // Reset form when no farmer is selected
      setFormData({
        0: { irrigation: [], other: {} },
        1: { other: {} },
        2: { other: {} },
        3: { herbicide: [], other: {} },
        4: { other: {} },
        5: { fertilizer: [], other: {} },
        6: { other: {} },
        7: { pesticide: [], other: {} },
        8: { fungicide: [], other: {} },
        9: { other: {} },
        10: { other: {} },
        11: { other: {} }
      });
    }
  };

  // Adding a new entry for a multi-entry category
  const addEntry = (category) => {
    const entry = tempEntry[category];
    const isComplete = Object.values(entry).every((value) => value.trim() !== "");
    if (!isComplete) {
      alert("সকল ক্ষেত্র পূরণ করুন!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [category]: [...(prev[activeTab][category] || []), entry],
      },
    }));
    setTempEntry((prev) => ({
      ...prev,
      [category]:
        category === "irrigation"
          ? { date: "", cost: "" }
          : { date: "", name: "", amount: "", cost: "" },
    }));
  };

  // Removing an entry from a multi-entry category
  const removeEntry = (category, index) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [category]: prev[activeTab][category].filter((_, i) => i !== index),
      },
    }));
  };

  // Handling save button click
  const handleSave = async () => {
    if (!selectedUser) {
      alert("অনুগ্রহ করে একজন কৃষক নির্বাচন করুন");
      return;
    }

    try {
      const response = await fetch(`https://iinms.brri.gov.bd/api/wabas/${selectedUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          saaoId: authUser.id,
          formData: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        alert("ডেটা সফলভাবে সংরক্ষিত হয়েছে");
        console.log("Data saved successfully for farmer:", selectedUser);
      } else {
        alert("ডেটা সংরক্ষণ করতে সমস্যা হয়েছে");
        console.error("Error saving data:", data.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("ডেটা সংরক্ষণ করতে সমস্যা হয়েছে");
    }
  };

  // Handle farmer selection (select exactly 3 farmers)
  const handleFarmerSelect = (farmer) => {
    if (selectedFarmers.length >= 3) {
      alert("আপনি ৩ জন কৃষক নির্বাচন করেছেন। আরও নির্বাচন করতে চাইলে আগে একজন সরিয়ে নিন।");
      return;
    }

    if (selectedFarmers.find(f => f.id === farmer.id)) {
      alert("এই কৃষক ইতিমধ্যে নির্বাচিত হয়েছে");
      return;
    }

    setSelectedFarmers(prev => [...prev, farmer]);
  };

  // Remove selected farmer
  const removeSelectedFarmer = (farmerId) => {
    setSelectedFarmers(prev => prev.filter(f => f.id !== farmerId));
    if (selectedUser === farmerId) {
      setSelectedUser("");
    }
  };

  // Continue with selected farmers
  const handleContinue = async () => {
    if (selectedFarmers.length !== 3) {
      alert("আপনি অবশ্যই ৩ জন কৃষক নির্বাচন করতে হবে");
      return;
    }

    try {
      // Create blank data entries for all 3 farmers
      const blankDataPromises = selectedFarmers.map(farmer =>
        fetch('https://iinms.brri.gov.bd/api/wabas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            farmerId: farmer.id,
            saaoId: authUser.id,
            formData: {
              0: { irrigation: [], other: {} },
              1: { other: {} },
              2: { other: {} },
              3: { herbicide: [], other: {} },
              4: { other: {} },
              5: { fertilizer: [], other: {} },
              6: { other: {} },
              7: { pesticide: [], other: {} },
              8: { fungicide: [], other: {} },
              9: { other: {} },
              10: { other: {} },
              11: { other: {} }
            }
          })
        })
      );

      await Promise.all(blankDataPromises);
      console.log("Blank data created for all farmers");
      setShowFarmerModal(false);
    } catch (error) {
      console.error("Error creating blank data:", error);
      alert("ডেটা সেভ করতে সমস্যা হয়েছে");
    }
  };

  // Handle change farmer selection
  const handleChangeFarmerSelection = () => {
    setShowFarmerModal(true);
    setSelectedFarmers([]);
    setSelectedUser("");
  };

  // Defining headlines (tabs)
  const headlines = [
    "বীজতলা তৈরি ও ব্যবস্থাপনা",
    "বীজতলা তৈরিতে ব্যবহৃত শ্রমিক (সংখ্যা)",
    "জমি তৈরি ব্যবস্থাপনা পদ্ধতি",
    "আগাছানাশক ব্যবস্থাপনা",
    "আগাছা ব্যবস্থাপনা",
    "সার ব্যবস্থাপনা",
    "সেচ ব্যবস্থাপনা",
    "কীটনাশক ব্যবস্থাপনা",
    "ছত্রাকনাশক ব্যবস্থাপনা",
    "ফসল কর্তন",
    "ফসল ঝাড়াই ও মাড়াই",
    "জাতের নাম",
  ];

  const fields = [
    [
      "জাতের নাম",
      "বীজতলায় বীজ বপণ (তারিখ)",
      "বীজের পরিমান (কেজি)",
      "বীজতলার জমির পরিমান (শতাংশ)",
      "বীজের মূল্য (টাকা)",
      // Irrigation fields handled separately
      "বীজতলা তৈরিতে ব্যবহৃত যন্ত্রের নাম",
      "বীজতলা তৈরিতে ব্যবহৃত যন্ত্রের ভাড়া (টাকা)",
      "বীজতলা তৈরিতে ব্যবহৃত যন্ত্রের তেলের পরিমান (লি)",
      "তেলের মূল্য (টাকা)",
      // Fertilizer fields handled separately
      // Herbicide fields handled separately
      // Pesticide fields handled separately
      // Fungicide fields handled separately
      // "মোট খরচ (টাকা)",
    ],
    [
      "তারিখ",
      "শ্রম ঘন্টা (মিনিট)",
      "সেচ প্রদানে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "আগাছা দমনে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
    ],
    [
      "তারিখ",
      "জমি তৈরিতে সেচের সময় (মিনিট) (কন্টাক্ট)",
      "জমি তৈরিতে পানির পরিমান (মিমি)",
      "চাষে ব্যবহৃত যন্ত্রের নাম",
      "চাষে ব্যবহৃত যন্ত্রের ভাড়া (টাকা)",
      "চাষে ব্যবহৃত যন্ত্রের তেলের পরিমান (লিটার)",
      "যন্ত্রের তেলের মূল্য (টাকা)",
      "চাষের সংখ্যা",
      "জমি তৈরিতে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
      "শ্রমিক মুজুরি (জনপ্রতি)",
      "মোট শ্রমিক (সংখ্যা)",
      "মোট শ্রম ঘন্টা (মিনিট)",
      "মোট খরচ (টাকা)",
    ],
    [
      // Herbicide fields handled separately
      "আগাছানাশক প্রয়োগে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "মোট শ্রম ঘন্টা (মিনিট)",
      "শ্রমিক মুজুরি (জনপ্রতি)",
      "মোট শ্রমিক (সংখ্যা)",
      "মোট খরচ (টাকা)",
    ],
    [
      "আগাছা দমনের তারিখ",
      "আগাছা দমনে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
      "মোট শ্রমিক (সংখ্যা)",
      "মোট শ্রম ঘন্টা (মিনিট)",
      "শ্রমিক মুজুরি (জনপ্রতি)",
      "মোট খরচ (টাকা)",
    ],
    [
      // Fertilizer fields handled separately
      "সার প্রয়োগে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
      "মোট শ্রমিক (সংখ্যা)",
      "মোট শ্রম ঘন্টা (মিনিট)",
      "মোট খরচ (টাকা)",
    ],
    [
      "সেচ প্রদানের তারিখ (সিজিন চুক্তি ২০০০/-)",
      "সেচ প্রদানের সময় (মি)",
      "সেচ প্রদানে পানির পরিমান (মিমি)",
      "সেচ প্রদানে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "সেচ যন্ত্রের ভাড়া (টাকা)",
      "সেচ প্রদানে তেলের পরিমান (লিটার)",
      "মোট খরচ (টাকা)",
      "শ্রম ঘন্টা (মিনিট)",
      "মোট শ্রমিক (সংখ্যা)",
    ],
    [
      "পোকার নাম",
      "জাতের নাম",
      "পোকার পরিমান (%)",
      // Pesticide fields handled separately
      "কীটনাশক প্রয়োগে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
    ],
    [
      "রোগের নাম",
      "জাতের নাম",
      "রোগের পরিমান (%)",
      // Fungicide fields handled separately
      "ছত্রাকনাশক প্রয়োগে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
    ],
    [
      "তারিখ",
      "ফসল কর্তনে ব্যবহৃত যন্ত্রের নাম",
      "ফসল কর্তনে ব্যবহৃত যন্ত্রের ভাড়া (টাকা)",
      "ফসল কর্তনে ব্যবহৃত যন্ত্রের তেলের পরিমান (লিটার)",
      "যন্ত্রের তেলের মূল্য (টাকা)",
      "ফসল কর্তনে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
      "শ্রমিক মুজুরি (জনপ্রতি)",
      "মোট খরচ (টাকা)",
    ],
    [
      "তারিখ",
      "ফসল ঝাড়াই ও মাড়াই-এ ব্যবহৃত যন্ত্রের নাম",
      "ফসল ঝাড়াই ও মাড়াই-এ ব্যবহৃত যন্ত্রের ভাড়া (টাকা)",
      "ফসল ঝাড়াই ও মাড়াই-এ ব্যবহৃত যন্ত্রের তেলের পরিমান (লিটার)",
      "যন্ত্রের তেলের মূল্য (টাকা)",
      "ফসল ঝাড়াই ও মাড়াই-এ ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
      "শ্রমিক মুজুরি (জনপ্রতি)",
      "মোট খরচ (টাকা)",
    ],
    [
      "ব্যবস্থাপনা পদ্ধতি",
      "রেপ্লিকেশন",
      "সিডিং ডেট",
      "ট্রান্সপ্লান্টিং ডেট",
      "৮০% ফ্লাওয়ারিং ডেট",
      "ফিজিওলোজি ম্যাচুরিটি ডেট",
      "হারভেস্ট ডেট",
      "প্লান্ট হাইট",
      "টিলার নম্বর/হিল",
      "পেনিকেল নম্বর/হিল",
      "ইল্ড (গ্রাম/১০মি২)",
      "এমসি (%)",
      "ইল্ড (গ্রাম/১০মি২) এট ১৪% এমসি",
      "ইল্ড (টন/হে)",
      "গড় ফলন (ট/হে)",
      "গ্রেইন/পেনিকেল",
      "১০০০ গ্রেইন ওয়েট",
      "জিডি",
    ],
  ];

  // Multi-entry field configurations
  const multiEntryFields = {
    irrigation: [
      { label: "বীজতলা তৈরিতে সেচ প্রদানের তারিখ", key: "date", type: "date" },
      { label: "বীজতলা তৈরিতে সেচ প্রদানের খরচ (টাকা)", key: "cost", type: "text" },
    ],
    fertilizer: [
      { label: "তারিখ", key: "date", type: "date" },
      { label: "সারের নাম", key: "name", type: "text" },
      { label: "সারের পরিমান (কেজি)", key: "amount", type: "text" },
      { label: "সারের মূল্য (টাকা)", key: "cost", type: "text" },
    ],
    herbicide: [
      { label: "তারিখ", key: "date", type: "date" },
      { label: "আগাছানাশকের নাম", key: "name", type: "text" },
      { label: "আগাছানাশকের পরিমান (গ্রাম)", key: "amount", type: "text" },
      { label: "আগাছানাশকের মূল্য (টাকা)", key: "cost", type: "text" },
    ],
    pesticide: [
      { label: "তারিখ", key: "date", type: "date" },
      { label: "কীটনাশকের নাম", key: "name", type: "text" },
      { label: "কীটনাশকের পরিমান (গ্রাম)", key: "amount", type: "text" },
      { label: "কীটনাশকের মূল্য (টাকা)", key: "cost", type: "text" },
    ],
    fungicide: [
      { label: "তারিখ", key: "date", type: "date" },
      { label: "ছত্রাকনাশকের নাম", key: "name", type: "text" },
      { label: "ছত্রাকনাশকের পরিমান (গ্রাম)", key: "amount", type: "text" },
      { label: "ছত্রাকনাশকের মূল্য (টাকা)", key: "cost", type: "text" },
    ],
  };

  // Function to determine input type based on field label
  const getInputType = (field) => {
    return field.includes("তারিখ") ? "date" : "text";
  };

  // Function to calculate total cost for a specific tab
  const calculateTabTotalCost = (tabIndex) => {
    const tabData = formData[tabIndex];
    if (!tabData) return 0;

    let totalCost = 0;

    // Calculate cost from single-entry fields (other object)
    if (tabData.other) {
      Object.entries(tabData.other).forEach(([field, value]) => {
        if (field.includes("খরচ") || field.includes("মূল্য") || field.includes("ভাড়া") || field.includes("মুজুরি")) {
          const numValue = parseFloat(value) || 0;
          totalCost += numValue;
        }
      });
    }

    // Calculate cost from multi-entry arrays
    const multiEntryCategories = ['irrigation', 'fertilizer', 'herbicide', 'pesticide', 'fungicide'];
    multiEntryCategories.forEach(category => {
      if (tabData[category] && Array.isArray(tabData[category])) {
        tabData[category].forEach(entry => {
          if (entry.cost) {
            const numValue = parseFloat(entry.cost) || 0;
            totalCost += numValue;
          }
        });
      }
    });

    return totalCost;
  };
  const convertToBanglaNumber = (number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().split('').map(d => banglaDigits[parseInt(d)] ?? d).join('');
  };

  const banglaMonths = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];

  const formatBanglaDate = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return (
      convertToBanglaNumber(day) +
      " " +
      banglaMonths[parseInt(month, 10) - 1] +
      " " +
      convertToBanglaNumber(year)
    );
  };

  const renderMultiEntrySection = (category, tabIndex) => {

    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold mb-2 font-nikosh">
            {headlines[tabIndex]} - নতুন তথ্য যোগ করুন
          </h3>
          <button
            className="mt-2  bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-nikosh"
            onClick={() => addEntry(category)}
          >
            {/* তথ্য যোগ করুন */}
            যোগ করুন
          </button>
        </div>
        {multiEntryFields[category].map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 font-nikosh">
              {field.label}
            </label>
            <input
              type={field.type}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 font-nikosh focus:ring-blue-500"
              value={tempEntry[category][field.key]}
              onChange={(e) =>
                handleTempEntryChange(category, field.key, e.target.value)
              }
              placeholder={field.type === "text" ? `` : ""}
            />
          </div>
        ))}
        {formData[activeTab][category] && formData[activeTab][category].length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2 font-nikosh">
              প্রদত্ত তথ্যসমূহ
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm font-nikosh">
                <thead>
                  <tr className="bg-gray-100">
                    {multiEntryFields[category].map((field) => (
                      <th
                        key={field.key}
                        className="border border-gray-300 px-3 py-2 text-left"
                      >
                        {field.label}
                      </th>
                    ))}
                    <th className="border border-gray-300 px-3 py-2 text-left">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {formData[activeTab][category].map((entry, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      {multiEntryFields[category].map((field) => (
                        <td
                          key={field.key}
                          className="border border-gray-200 px-3 py-1"
                        >
                          {entry[field.key] || ""}
                        </td>
                      ))}
                      <td className="border border-gray-200 px-3 py-1">
                        <button
                          className="text-red-500 hover:text-red-700 font-nikosh"
                          onClick={() => removeEntry(category, index)}
                        >
                          মুছুন
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    );
  };

  // Farmer Selection Modal
  const FarmerSelectionModal = () => {
    if (!showFarmerModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-nikosh text-center">কৃষক নির্বাচন করুন (৩ জন বাধ্যতামূলক)</h2>
          </div>

          {/* Selected Farmers Display */}
          {selectedFarmers.length > 0 && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold font-nikosh mb-2">নির্বাচিত কৃষক ({selectedFarmers.length}/3):</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {selectedFarmers.map((farmer) => (
                  <div key={farmer.id} className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="font-nikosh text-sm">{farmer.name || farmer.farmerName}</span>
                    <button
                      onClick={() => removeSelectedFarmer(farmer.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="কৃষকের নাম অনুসন্ধান করুন..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-nikosh"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 font-nikosh">কৃষকদের তথ্য লোড হচ্ছে...</p>
            </div>
          )}

          {/* Farmers List */}
          {!loading && farmers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmers.slice(0, 3).map((farmer) => {
                const isSelected = selectedFarmers.find(f => f.id === farmer.id);
                return (
                  <div
                    key={farmer.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                      }`}
                    onClick={() => handleFarmerSelect(farmer)}
                  >
                    <h3 className="font-semibold font-nikosh text-lg mb-2">
                      {farmer.name || farmer.farmerName || "নাম নেই"}
                    </h3>
                    <p className="text-gray-600 font-nikosh text-sm">
                      ID: {farmer.id}
                    </p>
                    {farmer.phone && (
                      <p className="text-gray-600 font-nikosh text-sm">
                        ফোন: {farmer.phone}
                      </p>
                    )}
                    {farmer.village && (
                      <p className="text-gray-600 font-nikosh text-sm">
                        গ্রাম: {farmer.village}
                      </p>
                    )}
                    {isSelected && (
                      <div className="mt-2 text-green-600 font-nikosh text-sm">
                        ✓ নির্বাচিত
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* No Farmers Found */}
          {!loading && farmers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 font-nikosh">কোন কৃষক পাওয়া যায়নি</p>
            </div>
          )}

          {/* Pagination */}
          {farmers.length > 3 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 disabled:opacity-50 font-nikosh"
              >
                আগের পাতা
              </button>
              <span className="px-4 py-2 font-nikosh">পাতা {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2 font-nikosh"
              >
                পরের পাতা
              </button>
            </div>
          )}

          {/* Continue Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={selectedFarmers.length !== 3}
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-nikosh"
            >
              নির্বাচিত কৃষকদের সাথে চালিয়ে যান ({selectedFarmers.length}/3)
            </button>
          </div>

          {/* Warning Message */}
          {selectedFarmers.length !== 3 && (
            <div className="mt-4 text-center">
              <p className="text-red-600 font-nikosh text-sm">
                ⚠️ আপনাকে অবশ্যই ৩ জন কৃষক নির্বাচন করতে হবে
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Rendering the component
  return (
    <div className="container mx-auto p-4">
      {/* Farmer Selection Modal */}
      <FarmerSelectionModal />
      <h1 className="text-2xl font-bold text-center mb-4 font-nikosh">
        কৃষি তথ্য ফর্ম
      </h1>

      {/* Selected Farmers Dropdown */}
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 font-nikosh">
            নির্বাচিত কৃষক ({selectedFarmers.length}/3)
          </label>
          <button
            onClick={() => setShowFarmerModal(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-nikosh"
          >
            পরিবর্তন করুন
          </button>
        </div>

        {selectedFarmers.length > 0 ? (
          <div className="space-y-2">
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-nikosh"
              value={selectedUser}
  onChange={handleUserChange}
            >
              <option value="">কৃষক নির্বাচন করুন</option>
              {selectedFarmers.map((farmer) => (
                <option key={farmer.id} value={farmer.id}>
                  {farmer.name || farmer.farmerName || "নাম নেই"} - {farmer.id}
                </option>
              ))}
            </select>

            {selectedUser && (() => {
              const selectedFarmer = selectedFarmers.find(f => f.id === selectedUser);
              return selectedFarmer ? (
                <div className="mt-2 p-2 bg-white rounded border">
                  <p className="font-semibold font-nikosh text-sm">
                    নির্বাচিত: {selectedFarmer.name || selectedFarmer.farmerName}
                  </p>
                  {selectedFarmer.phone && (
                    <p className="text-gray-600 font-nikosh text-xs">
                      ফোন: {selectedFarmer.phone}
                    </p>
                  )}
                  {selectedFarmer.village && (
                    <p className="text-gray-600 font-nikosh text-xs">
                      গ্রাম: {selectedFarmer.village}
                    </p>
                  )}
                </div>
              ) : null;
            })()}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="font-nikosh text-gray-500 mb-2">কোন কৃষক নির্বাচন করা হয়নি</p>
            <button
              onClick={() => setShowFarmerModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-nikosh"
            >
              কৃষক নির্বাচন করুন
            </button>
          </div>
        )}
      </div>

      {/* Rendering tabs */}
      <div className="flex flex-wrap border-b border-gray-200">
        {headlines.map((headline, index) => (
          <button
            key={index}
            className={`py-2 px-4 text-sm font-medium font-nikosh ${activeTab === index
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
              }`}
            onClick={() => setActiveTab(index)}
          >
            {headline}
          </button>
        ))}
      </div>

      {/* Rendering input fields for the active tab */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        {fields[activeTab].map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 font-nikosh">
              {field}
            </label>
            <input
              type={getInputType(field)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 font-nikosh focus:ring-blue-500"
              value={(formData[activeTab]?.other && formData[activeTab].other[field]) || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={getInputType(field) === "text" ? `` : ""}
            />
          </div>
        ))}
        {/* Show all multi-entry sections on first tab */}
        {activeTab === 0 && (
          <>
            {renderMultiEntrySection("irrigation", 0)}
            {renderMultiEntrySection("fertilizer", 5)}
            {renderMultiEntrySection("herbicide", 3)}
            {renderMultiEntrySection("pesticide", 7)}
            {renderMultiEntrySection("fungicide", 8)}
          </>
        )}
        {activeTab === 5 && renderMultiEntrySection("fertilizer", 5)}
        {activeTab === 3 && renderMultiEntrySection("herbicide", 3)}
        {activeTab === 7 && renderMultiEntrySection("pesticide", 7)}
        {activeTab === 8 && renderMultiEntrySection("fungicide", 8)}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-nikosh">
            {headlines[activeTab]} - মোট খরচ (টাকা)
          </label>
          <input
            type="number"
            disabled
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 font-nikosh focus:ring-blue-500 bg-gray-100"
            value={calculateTabTotalCost(activeTab)}
            placeholder="মোট খরচ গণনা করা হবে..."
          />
        </div>
        <button
          className="mt-4 font-nikosh w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSave}
        >
          সংরক্ষণ করুন
        </button>
      </div>
    </div>
  );
};

export default FarmerData;