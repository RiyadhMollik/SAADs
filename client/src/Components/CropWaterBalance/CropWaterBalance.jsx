const tables = [
  {
    title: "Farmer",
    columns: ["UUID", "SN", "Field No", "Field Name", "Device ID", "Date", "Water Requirement (cm)", "RF (cm)", "Pump (cm)"]
  },
  {
    title: "SAAO",
    columns: ["UUID", "SN", "Block", "Farmer", "Field No", "Field Name", "Device ID", "Date", "Water Requirement (cm)", "RF (cm)", "Pump (cm)"]
  },
  {
    title: "UAO",
    columns: ["UUID", "SN", "Upazilla", "Block", "Farmer", "Field No", "Field Name", "Device ID", "Date", "Water Requirement (cm)", "RF (cm)", "Pump (cm)"]
  },
  {
    title: "Admin (Table and Graph)",
    columns: ["UUID", "SN", "Division", "District", "Upazilla", "Block", "Farmer", "Field No", "Field Name", "Device ID", "Date", "Water Requirement (cm)", "RF (cm)", "Pump (cm)"]
  },
  {
    title: "Super Admin",
    columns: ["UUID", "SN", "AEZ", "Hotspot", "CRA", "Region", "Division", "District", "Upazilla", "Block", "Farmer", "Field No", "Field Name", "Device ID", "Date", "Water Requirement (cm)", "RF (cm)", "Pump (cm)"]
  }
];

const CropWaterBalance = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Crop-Water Balance</h1>
      <div className="space-y-8 ">
        {tables.map((table, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">{table.title}</h2>
            <div className="overflow-x-auto max-w-[160vh]">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-600 text-white">
                    {table.columns.map((col, idx) => (
                      <th key={idx} className="border border-gray-300 px-4 py-2 text-center">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-100 text-center">
                    {table.columns.map((_, idx) => (
                      <td key={idx} className="border border-gray-300 px-4 py-2">-</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropWaterBalance;