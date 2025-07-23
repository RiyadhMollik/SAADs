import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { FaWhatsapp, FaEnvelope, FaFacebookMessenger, FaSms, FaPhone } from "react-icons/fa";

const AdvisoryPage = () => {
    const data = [
        { name: "Jan", minTemp: 13, maxTemp: 28, rainfall: 10 },
        { name: "Feb", minTemp: 16, maxTemp: 31, rainfall: 20 },
        { name: "Mar", minTemp: 20, maxTemp: 34, rainfall: 60 },
        { name: "Apr", minTemp: 24, maxTemp: 36, rainfall: 110 },
        { name: "May", minTemp: 26, maxTemp: 37, rainfall: 200 },
        { name: "Jun", minTemp: 27, maxTemp: 36, rainfall: 400 },
        { name: "Jul", minTemp: 27, maxTemp: 35, rainfall: 500 },
        { name: "Aug", minTemp: 27, maxTemp: 35, rainfall: 450 },
        { name: "Sep", minTemp: 26, maxTemp: 34, rainfall: 350 },
        { name: "Oct", minTemp: 24, maxTemp: 33, rainfall: 180 },
        { name: "Nov", minTemp: 20, maxTemp: 31, rainfall: 50 },
        { name: "Dec", minTemp: 15, maxTemp: 29, rainfall: 10 },
    ];
    const contentRef = useRef();
    const [isSending, setIsSending] = useState(false);
    const [recipients, setRecipients] = useState(["mollik15-5096@diu.edu.bd"]);
    const [activeTab, setActiveTab] = useState("whatsapp");
    const [selectedRole, setSelectedRole] = useState("AD");
    const [journalistsList, setJournalistsList] = useState([]);
    const [selectedJournalists, setSelectedJournalists] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalFarmers: 0,
        limit: 10,
    });

    const tabs = [
        { id: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp /> },
        { id: "email", label: "Email", icon: <FaEnvelope /> },
        { id: "messenger", label: "Messenger", icon: <FaFacebookMessenger /> },
        { id: "sms", label: "SMS", icon: <FaSms /> },
        { id: "call", label: "Call", icon: <FaPhone /> },
    ];

    const roles = ["AD", "DD", "UAO", "SAAO", "Farmer", "Scientist", "Journalists"];

    // Fetch journalists when Journalists role is selected
    const fetchJournalists = async () => {
        try {
            const response = await fetch(
                `https://iinms.brri.gov.bd/api/farmers/farmers/role/Journalists?page=${page}&limit=${rowsPerPage}&search=${searchText}`
            );
            if (response.ok) {
                const data = await response.json();
                setJournalistsList(data.data);
                setPagination({
                    currentPage: data.pagination.currentPage,
                    totalPages: data.pagination.totalPages,
                    totalFarmers: data.pagination.totalFarmers,
                    limit: data.pagination.limit,
                });
                // Initially select all journalists
                const allJournalistEmails = data.data.map((j) => j.email);
                const allJournalistIds = data.data.map((j) => j.id);
                setSelectedJournalists(allJournalistIds);
                setRecipients([...new Set([...recipients, ...allJournalistEmails])]);
            } else {
                throw new Error("Failed to fetch Journalists");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to fetch journalists data.");
        }
    };

    // Trigger fetch when role changes to Journalists or pagination/search changes
    useEffect(() => {
        if (selectedRole === "Journalists") {
            fetchJournalists();
        } else {
            setJournalistsList([]);
            setSelectedJournalists([]);
            setRecipients(["mollik15-5096@diu.edu.bd"]); // Reset recipients
        }
    }, [selectedRole, page, rowsPerPage, searchText]);

    // Handle journalist selection
    const handleJournalistSelection = (journalist) => {
        const isSelected = selectedJournalists.includes(journalist.id);
        let updatedSelected;
        let updatedRecipients;
        if (isSelected) {
            updatedSelected = selectedJournalists.filter((id) => id !== journalist.id);
            updatedRecipients = recipients.filter((email) => email !== journalist.email);
        } else {
            updatedSelected = [...selectedJournalists, journalist.id];
            updatedRecipients = [...recipients, journalist.email];
        }
        setSelectedJournalists(updatedSelected);
        setRecipients([...new Set(updatedRecipients)]);
    };

    // Handle select all journalists
    const handleSelectAll = () => {
        if (selectedJournalists.length === journalistsList.length) {
            setSelectedJournalists([]);
            setRecipients(["mollik15-5096@diu.edu.bd"]);
        } else {
            const allIds = journalistsList.map((j) => j.id);
            const allEmails = journalistsList.map((j) => j.email);
            setSelectedJournalists(allIds);
            setRecipients([...new Set([...recipients, ...allEmails])]);
        }
    };

    // Preload images to ensure they are rendered in the canvas
    const preloadImages = () => {
        const images = contentRef.current.querySelectorAll("img");
        const promises = Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        });
        return Promise.all(promises);
    };

    const handleSendEmail = async () => {
        try {
            setIsSending(true);
            const content = contentRef.current;
            if (!content) {
                throw new Error("Content reference is not available.");
            }
            await preloadImages();

            const canvas = await html2canvas(content, {
                scale: 2,
                useCORS: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: content.scrollWidth,
                windowHeight: content.scrollHeight,
            });

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = imgHeight;
            let position = 0;
            while (heightLeft > 0) {
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
                position -= pdfHeight;
                if (heightLeft > 0) {
                    pdf.addPage();
                }
            }
            const pdfBlob = pdf.output("blob");
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            await new Promise((resolve, reject) => {
                reader.onloadend = () => resolve();
                reader.onerror = reject;
            });

            const base64data = reader.result.split(",")[1];

            const response = await fetch("https://iinms.brri.gov.bd/api/email/send-advisory-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: recipients,
                    subject: "সাপ্তাহিক কৃষি নির্দেশিকা– জুন ২০২৫",
                    // pdfBase64: base64data,
                    // fileName: "advisory_june_2025.pdf",
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const result = await response.json();
            alert(result.message || "Email sent successfully!");
        } catch (error) {
            console.error("Error sending email:", error);
            alert(`Failed to send email: ${error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-[150vh]">
            <button
                onClick={handleSendEmail}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isSending}
            >
                {isSending ? "Sending..." : "Send Email"}
            </button>
            <div className="flex gap-5">
                <div className="p-6 w-1/3 max-w-[900px] mx-auto bg-white text-black border border-gray-300 shadow rounded">
                    <h1 className="text-center font-bold text-xl border-b border-black p-2 mb-4">
                        সাপ্তাহিক কৃষি নির্দেশিকা
                    </h1>

                    {/* Tabs */}
                    <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
                        <div className="flex gap-2 flex-wrap">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-1 px-4 py-2 rounded border ${activeTab === tab.id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Select Role */}
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full"
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Journalists List */}
                    {selectedRole === "Journalists" && (
                        <div className="mt-4 p-4 border rounded bg-gray-50">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search journalists..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedJournalists.length === journalistsList.length && journalistsList.length > 0}
                                    onChange={handleSelectAll}
                                    className="mr-2"
                                />
                                <span>Select All</span>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto">
                                {journalistsList.map((journalist) => (
                                    <div key={journalist.id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedJournalists.includes(journalist.id)}
                                            onChange={() => handleJournalistSelection(journalist)}
                                            className="mr-2"
                                        />
                                        <span>
                                            ID: {journalist.id} - Name: {journalist.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={page === pagination.totalPages}
                                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Placeholder content for selected tab */}
                    {selectedRole !== "Journalists" && (
                        <div className="mt-4 p-4 border rounded bg-gray-50 text-center">
                            <p className="text-lg font-medium">Selected Tab: {activeTab}</p>
                            <p className="text-sm">Selected Role: {selectedRole}</p>
                        </div>
                    )}
                </div>
                <div
                    className="p-8 w-full max-w-[900px] mx-auto bg-white text-gray-900 rounded-lg shadow-lg"
                    ref={contentRef}
                >
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                        <h1 className="text-center font-extrabold text-2xl font-nikos bg-indigo-600 text-white py-3 tracking-wide">
                            সাপ্তাহিক কৃষি নির্দেশিকা
                        </h1>

                        <div className="grid grid-cols-3 items-center border-b border-gray-300 px-6 py-4 bg-indigo-50">
                            <div className="flex justify-center">
                                <img
                                    src="https://iinms.brri.gov.bd/assets/brri-BRGqZdpM.png"
                                    alt="Logo"
                                    className="h-14"
                                    crossOrigin="anonymous"
                                />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold font-nikos text-lg leading-tight text-indigo-900">
                                    এগ্রোমেট ল্যাব <br /> বাংলাদেশ ধান গবেষণা ইনস্টিটিউট
                                </p>
                            </div>
                            <div className="text-right text-sm space-y-1 font-nikos text-indigo-700">
                                <p>
                                    <strong>বুলেটিন নম্বর:</strong> ০০০১
                                </p>
                                <p>
                                    <strong>প্রকাশের তারিখ:</strong> ২৫ জুন ২০২৫
                                </p>
                            </div>
                        </div>

                        <div className="p-6 text-center border-b font-nikos border-gray-300 text-indigo-800 text-base font-semibold leading-relaxed bg-indigo-100">
                            <p>২০২৫ সালের জুন মাসের জন্য পরামর্শ বুলেটিন; হাওর</p>
                            <p className="mt-1 font-normal">
                                “সিলেট, সুনামগঞ্জ, নেত্রকোনা, কিশোরগঞ্জ, হবিগঞ্জ, মৌলভীবাজার”
                            </p>
                        </div>

                        <div className="px-6 font-nikos pt-6 pb-2 text-left text-indigo-900 font-semibold tracking-wide text-sm">
                            আবহাওয়া:
                        </div>
                        <div className="px-6 mx-6 font-nikos">
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                                    <XAxis dataKey="name" tick={{ fill: '#4f46e5' }} />
                                    <YAxis yAxisId="left" tick={{ fill: '#4f46e5' }} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#ef4444' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '6px' }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="rainfall" fill="#4f46e5" name="বর্ষা (মিমি)" />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="maxTemp"
                                        stroke="#ef4444"
                                        name="সর্বোচ্চ তাপমাত্রা (°C)"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="minTemp"
                                        stroke="#f59e0b"
                                        name="সর্বনিম্ন তাপমাত্রা (°C)"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="p-6 text-gray-800 text-sm">
                            <p className="font-semibold mb-3 text-lg border-b font-nikos border-indigo-300 pb-1">
                                সাপ্তাহিক কৃষি নির্দেশিকা:
                            </p>
                            <table className="w-full border-collapse border border-indigo-300 text-sm">
                                <thead>
                                    <tr className="bg-indigo-100 text-indigo-900">
                                        <th className="border border-indigo-300 p-3 font-nikos text-left w-1/4">ধরন</th>
                                        <th className="border border-indigo-300 p-3 font-nikos text-left">পরামর্শ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border border-indigo-300 hover:bg-indigo-50 transition-colors duration-200">
                                        <td className="border font-nikos border-indigo-300 p-3 align-top font-semibold text-indigo-700">
                                            কৃষি
                                        </td>
                                        <td className="border border-indigo-300 p-3">
                                            <ul className="list-disc list-inside space-y-2 font-nikos leading-relaxed">
                                                <li>ফসলের রোগবালাই নিয়মিত নিরীক্ষণ করুন এবং প্রয়োজনীয় প্রতিকার গ্রহণ করুন।</li>
                                                <li>পর্যাপ্ত সেচ নিশ্চিত করুন, বিশেষ করে শুষ্ক মৌসুমে সতর্ক থাকুন।</li>
                                                <li>সার ও কীটনাশক ব্যবহারে সতর্কতা অবলম্বন করুন।</li>
                                                <li>মাঠ পরিদর্শন করে আগাম বৃষ্টিপাত ও আবহাওয়ার পূর্বাভাস অনুযায়ী ব্যবস্থা নিন।</li>
                                                <li>ফসলের ভালো ফলনের জন্য মাটির পরীক্ষা করে প্রয়োজনীয় সারের পরিমাণ নির্ধারণ করুন।</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="text-xs p-6 text-justify text-green-700 border-t font-nikos border-green-200">
                            এই নির্দেশিকা সর্বশেষ তথ্য ও পূর্বাভাসের ওপর ভিত্তি করে তৈরি করা হয়েছে।
                            যথাসম্ভব এর সঠিকতা নিশ্চিত করার চেষ্টা করা হয়েছে, তবে স্থানীয় পরিস্থিতি বিবেচনা করে পদক্ষেপ নেওয়া উচিত।
                        </div>
                        <div className="p-4 font-nikos text-xs text-center text-indigo-700 bg-indigo-50 font-semibold tracking-wide">
                            প্রযুক্তিগত সহায়তা প্রদান করেছে বিএআরআরআই-এর এগ্রোমেট ল্যাব
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdvisoryPage;