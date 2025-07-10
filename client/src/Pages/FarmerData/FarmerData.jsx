import { useState } from "react";

const FarmerData = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [selectedUser, setSelectedUser] = useState("");

  // Handling input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handling user selection
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
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
    { id: "user3", name: "কৃষক ৩" }
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
    "জাতের নাম"
  ];

  // Defining input fields for each headline
  const fields = [
    [
      "তারিখ",
      "বীজের পরিমান (কেজি)",
      "বীজের মূল্য (টাকা)",
      "বীজতলা তৈরিতে সেচের পরিমান (মিমি)",
      "বীজতলা তৈরিতে ব্যবহৃত যন্ত্রের নাম",
      "বীজতলা তৈরিতে ব্যবহৃত যন্ত্রের ভাড়া (টাকা)",
      "বীজতলা তৈরিতে ব্যবহৃত যন্ত্রের তেলের পরিমান (লি)",
      "তেলের মূল্য (টাকা)"
    ],
    [
      "তারিখ",
      "শ্রম ঘন্টা (মিনিট)",
      "সেচ প্রদানে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "আগাছা দমনে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)"
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
      "মোট খরচ (টাকা)"
    ],
    [
      "আগাছানাশক প্রয়োগের তারিখ",
      "আগাছানাশকের নাম",
      "আগাছানাশক প্রয়োগের পরিমান (গ্রাম)",
      "আগাছানাশকের মূল্য (টাকা)",
      "আগাছানাশক প্রয়োগে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "মোট শ্রম ঘন্টা (মিনিট)",
      "শ্রমিক মুজুরি (জনপ্রতি)",
      "মোট শ্রমিক (সংখ্যা)",
      "মোট খরচ (টাকা)"
    ],
    [
      "আগাছা দমনের তারিখ",
      "আগাছা দমনে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
      "মোট শ্রমিক (সংখ্যা)",
      "মোট শ্রম ঘন্টা (মিনিট)",
      "শ্রমিক মুজুরি (জনপ্রতি)",
      "মোট খরচ (টাকা)"
    ],
    [
      "সার প্রয়োগের তারিখ",
      "সারের নাম",
      "সার প্রয়োগের পরিমান (কেজি)",
      "সারের মূল্য (টাকা)",
      "সার প্রয়োগে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)",
      "মোট শ্রমিক (সংখ্যা)",
      "মোট শ্রম ঘন্টা (মিনিট)",
      "মোট খরচ (টাকা)"
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
      "মোট শ্রমিক (সংখ্যা)"
    ],
    [
      "পোকার নাম",
      "জাতের নাম",
      "পোকার পরিমান (%)",
      "কীটনাশকের নাম",
      "কীটনাশক প্রয়োগের তারিখ",
      "কীটনাশক প্রয়োগের পরিমান (গ্রাম)",
      "প্রয়োগকৃত কীটনাশকের মূল্য (টাকা)",
      "কীটনাশক প্রয়োগে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)"
    ],
    [
      "রোগের নাম",
      "জাতের নাম",
      "রোগের পরিমান (%)",
      "ছত্রাকনাশকের নাম",
      "ছত্রাকনাশক প্রয়োগের তারিখ",
      "ছত্রাকনাশক প্রয়োগের পরিমান (গ্রাম)",
      "প্রয়োগকৃত ছত্রাকনাশকের মূল্য (টাকা)",
      "ছত্রাকনাশক প্রয়োগে ব্যবহৃত শ্রমিক (সংখ্যা)",
      "শ্রম ঘন্টা (মিনিট)"
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
      "মোট খরচ (টাকা)"
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
      "মোট খরচ (টাকা)"
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
      "জিডি"
    ]
  ];

  // Rendering the component
  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold text-center mb-4 font-nikosh">কৃষি তথ্য ফর্ম</h1>

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
          {users.map(user => (
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
            className={`py-2 px-4 text-sm font-medium font-nikosh ${
              activeTab === index
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
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 font-nikosh focus:ring-blue-500"
              value={formData[field] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={`প্রবেশ করান ${field}`}
            />
          </div>
        ))}
        {/* Save button */}
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSave}
        >
          সংরক্ষণ করুন
        </button>
      </div>
    </div>
  );
};

export default FarmerData;