import { useEffect, useState } from "react";

const FeedbackTable = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch feedback data from API
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/feedback");
        if (!response.ok) {
          throw new Error("Failed to fetch feedback data.");
        }
        const data = await response.json();
        setFeedbackData(data);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedback();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(feedbackData.length / rowsPerPage);
  const displayedData = feedbackData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Feedback</h1>
      <div className=" w-full overflow-x-scroll ">
        <table className="border border-gray-300 bg-white w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Note</th>
              <th className="px-4 py-2 border">Datetime</th>
              <th className="px-4 py-2 border">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 border">{item.id}</td>
                <td className="px-4 py-2 border">{item?.User?.name}</td>
                <td className="px-4 py-2 border">{item.note}</td>
                <td className="px-4 py-2 border">{item.datetime}</td>
                <td className="px-4 py-2 border">{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex  justify-center items-center mt-4 gap-3">
        {/* Rows Per Page Selector */}
        <div className="flex items-center ">
          <div>
            <label htmlFor="rows" className="mr-2">
              Show:
            </label>
            <select
              id="rows"
              className="border rounded px-2 py-1"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex space-x-1">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-2 py-1 border rounded ${currentPage === index + 1 ? "bg-gray-300" : ""
                }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1} 
            </button>
          ))}
          <button
            className="px-2 py-1 border rounded"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTable;
