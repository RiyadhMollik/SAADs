
const Farmer = () => {
  const metrics = [
    {
      title: "Battery Charging Current",
      value: "0.23",
      icon: "🔋",
      bgColor: "bg-lime-400",
    },
    {
      title: "Battery Voltage",
      value: "13.55",
      icon: "⚡",
      bgColor: "bg-green-500",
    },
    {
      title: "Solar Voltage",
      value: "13.88",
      icon: "🌞",
      bgColor: "bg-blue-500",
    },
    {
      title: "Device Current",
      value: "0.04",
      icon: "🔌",
      bgColor: "bg-amber-800",
    },
  ];

  return (
    <div className="min-h-fit flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Main Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Metrics Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            Last Updated: <span className="font-normal">01/10/2024 12:08 AM</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg flex flex-col items-center text-white ${metric.bgColor}`}
              >
                <div className="text-3xl">{metric.icon}</div>
                <p className="mt-2 text-sm font-medium">{metric.title}</p>
                <p className="mt-2 text-xl font-bold">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Device Status Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Device Status</h2>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Devices Communicating:</span>
              <span className="text-green-500 font-bold">15</span>
            </li>
            <li className="flex justify-between">
              <span>Devices Offline:</span>
              <span className="text-red-500 font-bold">5</span>
            </li>
            <li className="flex justify-between">
              <span>Total Devices:</span>
              <span className="font-bold">20</span>
            </li>
            <li className="flex justify-between">
              <span>Last Updated:</span>
              <span className="font-bold">Just Now</span>
            </li>
          </ul>
          <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg w-full hover:bg-green-700">
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default Farmer;
