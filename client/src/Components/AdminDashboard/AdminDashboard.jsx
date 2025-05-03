import MapboxExample from "../Map/map";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="text-red-600 text-xl font-bold mb-4">Admin/DD</header>
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Interactive Map */}
        <div className="md:col-span-2 border-2 border-green-600 p-4 max-h-[500px] overflow-hidden">
          <h2 className="text-lg font-semibold mb-2">Interactive Map of Bangladesh</h2>
          <p className="text-gray-600 mb-4">
            Explore the regions of Bangladesh for better insights into irrigation and nutrient management systems.
          </p>
          {/* Embedded Google Map */}
         <MapboxExample />
        </div>

        {/* Device Status */}
        <div className="border-2 border-green-600 p-4">
          <h2 className="text-lg font-semibold mb-4">Device Status under ...Block</h2>
          <p className="mb-2">Devices Communicating:</p>
          <p className="mb-2">Devices Offline:</p>
          <p className="mb-2">Total Devices:</p>
          <p className="mb-2">Total Farmers:</p>
          <p className="mb-2">Last Updated:</p>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
