import { useContext, useState } from "react";
import { AuthContext } from "../../Components/context/AuthProvider";

const CIS = () => {
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        organization: "",
        address: "",
        email: "",
        mobile: "",
        dataDuration: "",
        location: "",
        weatherParameter: "",
        file: null,
    });

    const { authUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authUser || !authUser.id) {
            alert("You must be logged in to submit the form.");
            return;
        }

        const submissionData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            submissionData.append(key, value);
        });
        submissionData.append("userId", authUser.id);

        try {
            const response = await fetch("https://iinms.brri.gov.bd/api/feedback", {
                method: "POST",
                body: submissionData,
            });

            if (!response.ok) {
                throw new Error("Failed to submit the form. Please try again.");
            }

            alert("Form submitted successfully!");
            setFormData({
                name: "",
                designation: "",
                organization: "",
                address: "",
                email: "",
                mobile: "",
                dataDuration: "",
                location: "",
                weatherParameter: "",
                file: null,
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
        }
    };

    return (
        <div className="min-h-screen flex justify-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full ">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-4">
                    Climate Information Services by BRRI Agromet Lab
                </h2>
                <h2 className="text-xl font-bold text-center text-black mb-4">
                    Historical Climate Data Requisition
                </h2>
                <form onSubmit={handleSubmit} className="space-y-7 mt-5">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <label className="block text-gray-700 font-medium">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-gray-700 font-medium">Designation</label>
                            <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-gray-700 font-medium">Organization</label>
                            <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-gray-700 font-medium">Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Mobile</label>
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Data Duration</label>
                            <input type="date" name="dataDuration" value={formData.dataDuration} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-[5px]" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Location</label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            >
                                <option value="Dhaka">Dhaka</option>
                                <option value="Chattogram">Chattogram</option>
                                <option value="Khulna">Khulna</option>
                                <option value="Rajshahi">Rajshahi</option>
                                <option value="Barishal">Barishal</option>
                                <option value="Sylhet">Sylhet</option>
                                <option value="Rangpur">Rangpur</option>
                                <option value="Mymensingh">Mymensingh</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Weather Parameter</label>
                            <select
                                name="weatherParameter"
                                value={formData.weatherParameter}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            >
                                <option value="Temperature">Temperature</option>
                                <option value="Humidity">Humidity</option>
                                <option value="Rainfall">Rainfall</option>
                                <option value="Wind Speed">Wind Speed</option>
                                <option value="Air Pressure">Air Pressure</option>
                            </select>
                        </div>

                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Attachment</label>
                        <input type="file" className="w-full  border border-gray-300 rounded cursor-pointer" onChange={handleFileChange} />
                        <p className="text-gray-500 text-sm mt-1">{formData.file ? formData.file.name : "No file chosen"}</p>
                    </div>

                    <button type="submit" className="w-full  bg-green-800 text-white font-medium py-2 px-4 rounded hover:bg-green-700">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CIS;
