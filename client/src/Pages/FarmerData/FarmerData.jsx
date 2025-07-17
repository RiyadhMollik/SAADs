import { useState } from "react";

const FarmerData = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    irrigation: [],
    fertilizer: [],
    herbicide: [],
    pesticide: [],
    fungicide: [],
    other: {},
  });
  const [selectedUser, setSelectedUser] = useState("");
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
      other: { ...prev.other, [field]: value },
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
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
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
      [category]: [...prev[category], entry],
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
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  // Handling save button click
  const handleSave = () => {
    console.log("Selected User:", selectedUser);
    console.log("Form Data:", formData);
  };

  // Sample users for the dropdown
  const users = [
    { id: "", name: "ব্যবহারকারী নির্বাচন করুন" },
    { id: "user1", name: "কৃষক ১" },
    { id: "user2", name: "কৃষক ২" },
    { id: "user3", name: "কৃষক ৩" },
  ];

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

  // Rendering multi-entry section
  const renderMultiEntrySection = (category, tabIndex) => {
    if (
      (category === "irrigation" && tabIndex !== 0) ||
      (category === "fertilizer" && tabIndex !== 5) ||
      (category === "herbicide" && tabIndex !== 3) ||
      (category === "pesticide" && tabIndex !== 7) ||
      (category === "fungicide" && tabIndex !== 8)
    ) {
      return null;
    }

    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold mb-2 font-nikosh">
            {headlines[tabIndex] === "বীজতলা তৈরিতে সেচ প্রদানের খরচ (টাকা)" ? " সেচ ব্যবস্থাপনা" : headlines[tabIndex]  } - নতুন তথ্য যোগ করুন
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
        {formData[category].length > 0 && (
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
                  {formData[category].map((entry, index) => (
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

  // Rendering the component
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4 font-nikosh">
        কৃষি তথ্য ফর্ম
      </h1>

      {/* User selection dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 font-nikosh">
          ব্যবহারকারী নির্বাচন করুন
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-nikosh"
          value={selectedUser}
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
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
              value={formData.other[field] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={getInputType(field) === "text" ? `` : ""}
            />
          </div>
        ))}
        {renderMultiEntrySection("irrigation", 0)}
        {renderMultiEntrySection("fertilizer", 5)}
        {renderMultiEntrySection("herbicide", 3)}
        {renderMultiEntrySection("pesticide", 7)}
        {renderMultiEntrySection("fungicide", 8)}
        {/* Save button */}
        <label className="block text-sm font-medium text-gray-700 mb-1 font-nikosh">
          বীজতলা তৈরি ও ব্যবস্থাপনায়
 মোট খরচ (টাকা)
        </label>
        <input
          type="number"
          disabled
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 font-nikosh focus:ring-blue-500"
          
        />
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