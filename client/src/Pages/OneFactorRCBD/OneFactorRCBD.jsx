import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Papa from "papaparse";

export default function OneFactorRCBD() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState({
    treatmentOptions: [],
    replicationOptions: [],
    testOptions: [],
  });
  const [anovaResult, setAnovaResult] = useState("");

  // Handle file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      Papa.parse(uploadedFile, {
        complete: (result) => {
          const columnNames = result.meta.fields || [];
          setColumns({
            treatmentOptions: columnNames,
            replicationOptions: columnNames,
            testOptions: columnNames,
          });
        },
        header: true,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://iinms.brri.gov.bd/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (data.result) {
        setAnovaResult(data.result);
      } else {
        setAnovaResult("Error processing data");
      }
    } catch (error) {
      setAnovaResult("Failed to connect to the server");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">ONE FACTOR RCBD</h1>
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 border p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Research Form</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Upload CSV</label>
              <input type="file" onChange={handleFileUpload} className="w-full border px-2 py-[5px] rounded" />
            </div>

            <div>
              <label className="block font-medium">Replication</label>
              <select className="w-full border p-2 rounded">
                <option>Select Replication</option>
                {columns.replicationOptions.map((column, index) => (
                  <option key={index} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium">Treatment</label>
              <select className="w-full border p-2 rounded">
                <option>Select Treatment</option>
                {columns.treatmentOptions.map((column, index) => (
                  <option key={index} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium">Variables</label>
              <select className="w-full border p-2 rounded">
                <option>Select Variables</option>
                {columns.testOptions.map((column, index) => (
                  <option key={index} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Multiple Comparison Test</label>
              <select className="w-full border p-2 rounded">
                <option>Select Multiple Comparison Test</option>
                {columns.testOptions.map((column, index) => (
                  <option key={index} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                SUBMIT
              </button>
            </div>
          </div>

          {anovaResult && <AnovaTable anovaResult={anovaResult} />}
        </div>

        <div className="w-full md:w-1/3 border p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Tutorial</h2>
          <div className="flex justify-center">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube Tutorial"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-4 flex flex-col space-y-2">
            <a href="#" className="text-green-600 hover:underline">
              Input File
            </a>
            <a href="#" className="text-green-600 hover:underline">
              Output Report
            </a>
            <a href="#" className="text-green-600 hover:underline">
              Methodology
            </a>
          </div>
          <div className="mt-6 flex justify-end rounded-[50px]">
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <FaWhatsapp />
              <span>Need Help?</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


const AnovaTable = ({ anovaResult }) => {
  if (!anovaResult) return null;

  // Function to parse ANOVA results
  const parseAnovaResults = (resultText) => {
    const lines = resultText.split("\n").filter((line) => line.trim() !== "");
    const headers = lines[0].split(/\s+/);
    const data = lines.slice(1).map((line) => line.split(/\s+/));

    return { headers, data };
  };

  const { headers, data } = parseAnovaResults(anovaResult);

  return (
    <div className="mt-6 p-4 border rounded bg-white shadow">
      <h3 className="font-bold mb-4 text-lg">ANOVA Results</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {headers.map((header, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};