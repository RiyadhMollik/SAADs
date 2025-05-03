import React from "react";

const SoilDashboard = () => {
  const metrics = [
    {
      title: "PH",
      value: "0.00",
      unit: "",
      icon: "💧", // Replace with an actual SVG/icon component for better design
      bgColor: "bg-green-400",
    },
    {
      title: "Moisture",
      value: "0.00%",
      unit: "%",
      icon: "🌊",
      bgColor: "bg-green-500",
    },
    {
      title: "Soil Temp",
      value: "0.00",
      unit: "°C",
      icon: "🌡️",
      bgColor: "bg-green-600",
    },
    {
      title: "Conductivity",
      value: "0",
      unit: "µS/cm",
      icon: "⚡",
      bgColor: "bg-green-700",
    },
  ];

  return (
    <div className="min-h-fit flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Soil Device <span className="text-gray-500">01</span>{" "}
          <span className="text-gray-400">Soil Device 02 Soil Device 03</span>
        </h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg flex flex-col items-center text-white ${metric.bgColor}`}
          >
            <div className="text-3xl mb-2">{metric.icon}</div>
            <p className="text-lg font-medium">{metric.title}</p>
            <p className="text-2xl font-bold mt-2">
              {metric.value} <span className="text-base font-normal">{metric.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoilDashboard;
