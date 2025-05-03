import { useState } from "react";
import { MdDriveFolderUpload } from "react-icons/md";

const sampleData = [
    {
        id: 1,
        name: "John Doe",
        designation: "Researcher",
        organization: "BRRI",
        address: "Dhaka, Bangladesh",
        email: "johndoe@example.com",
        mobile: "+880123456789",
        dataDuration: "2024-03-01",
        location: "Dhaka",
        weatherParameter: "Temperature",
        file: "report.pdf",
    },
];

const CISTable = () => {
    const [data, setData] = useState(sampleData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleUploadClick = () => {
        setIsModalOpen(true);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = () => {
        console.log("File Uploaded:", selectedFile);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
    };

    return (
        <div className="min-h-screen flex justify-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-4">
                    Climate Data Requests
                </h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-green-800 text-white">
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Designation</th>
                            <th className="border border-gray-300 px-4 py-2">Organization</th>
                            <th className="border border-gray-300 px-4 py-2">Address</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Mobile</th>
                            <th className="border border-gray-300 px-4 py-2">Data Duration</th>
                            <th className="border border-gray-300 px-4 py-2">Location</th>
                            <th className="border border-gray-300 px-4 py-2">Weather Parameter</th>
                            <th className="border border-gray-300 px-4 py-2">Attachment</th>
                            <th className="border border-gray-300 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id} className="text-center border-t border-gray-300">
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td className="border border-gray-300 px-4 py-2">-</td>
                                <td
                                    className="border border-gray-300 px-4 py-4 text-center flex justify-center cursor-pointer text-lg"
                                    onClick={handleUploadClick}
                                >
                                    <MdDriveFolderUpload />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Upload File</h3>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="mb-4 border p-2 w-full" 
                        />
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={handleCancel} 
                                className="px-4 py-2 bg-gray-300 rounded-md"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                className="px-4 py-2 bg-green-600 text-white rounded-md"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CISTable;