import { useContext, useState } from "react";
import { AuthContext } from "../../Components/context/AuthProvider";

const FeedbackForm = () => {
  const [category, setCategory] = useState("select");
  const [feedback, setFeedback] = useState("");
  const [file, setFile] = useState(null);
  const { authUser } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure user is authenticated
    if (!authUser || !authUser.id) {
      alert("You must be logged in to submit feedback.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", authUser.id); // Send UserId from AuthContext
    formData.append("note", feedback);
    formData.append("remarks", category);
    if (file) {
      formData.append("file", file); // Include file if provided
    }

    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/feedback", {
        method: "POST",
        body: formData,
      },
    
    );

      if (!response.ok) {
        throw new Error("Failed to submit feedback. Please try again.");
      }

      alert("Feedback submitted successfully!");
      // Reset form fields
      setFeedback("");
      setCategory("select");
      setFile(null);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback.");
    }
  };

  return (
    <div className="max-w-[150vh] min-h-screen w-full flex justify-center bg-gray-100 p-8">
      <div className="w-full  bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-green-800 mb-6">
          Feedback to System Administrator
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Category Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="select">Select</option>
                <option value="General">General</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* File Attachment */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Attachment</label>
              <input
                type="file"
                className="block w-full text-sm  px-4 py-2 text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                onChange={handleFileChange}
              />
              <p className="text-gray-500 text-sm mt-2">
                {file ? file.name : "No file chosen"}
              </p>
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Note</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              rows="5"
              placeholder="Write to us..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-green-800 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
