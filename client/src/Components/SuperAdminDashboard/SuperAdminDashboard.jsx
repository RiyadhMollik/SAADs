import MapboxExample from "../Map/map";


const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      {/* Filters and Main Content */}
      <div className="grid grid-cols-12 gap-4">
        {/* Dropdown Filters */}
        
        {/* Interactive Map and Status Section */}
        <div className="col-span-12 md:col-span-12 grid grid-cols-12 gap-4">
          {/* Map */}
          <div className="col-span-12 lg:col-span-8 bg-white shadow rounded p-4 max-h-[500px] overflow-hidden">
            <h2 className="text-lg font-bold mb-2">Interactive Map of Bangladesh</h2>
            
              <MapboxExample/>
  
          </div>

          {/* Device Status */}
          <div className="col-span-12 lg:col-span-4 bg-white shadow rounded p-4">
            <h2 className="text-lg font-bold mb-4">Device Status under ... Block</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-semibold">Devices Communicating:</span> 0
              </li>
              <li>
                <span className="font-semibold">Devices Offline:</span> 0
              </li>
              <li>
                <span className="font-semibold">Total Devices:</span> 0
              </li>
              <li>
                <span className="font-semibold">Total Farmers:</span> 0
              </li>
              <li>
                <span className="font-semibold">Last Updated:</span> N/A
              </li>
            </ul>
          </div>

          {/* Graph Section */}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
