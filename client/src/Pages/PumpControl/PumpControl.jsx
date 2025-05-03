import { useState } from "react";

export default function PumpControl() {
  const [isAuto, setIsAuto] = useState(false);
  const [isOn, setIsOn] = useState(false);

  const handleToggleAuto = async () => {
    const endpoint = isAuto ? "/pump/auto-off" : "/pump/auto-on";
    await fetch(`https://iinms.brri.gov.bd${endpoint}`, { method: "POST" });
    setIsAuto(!isAuto);
  };

  const handleTogglePump = async () => {
    const endpoint = isOn ? "/pump/stop" : "/pump/start";
    await fetch(`https://iinms.brri.gov.bd${endpoint}`, { method: "POST" });
    setIsOn(!isOn);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Motor Control</h1>
        <img
          src="/image.png" // Replace with actual image URL
          alt="Pump"
          className="mx-auto mb-6 w-60 h-60"
        />

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Switch Method</span>
          <div className="flex items-center space-x-2">
            <span>Manual</span>
            <button
              onClick={handleToggleAuto}
              className={`${isAuto ? "bg-blue-500" : "bg-gray-300"} relative inline-flex items-center h-6 rounded-full w-11 transition`}
            >
              <span
                className={`${isAuto ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full transition`}
              />
            </button>
            <span>Auto</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Switch Motor</span>
          <div className="flex items-center space-x-2">
            <span>Off</span>
            <button
              onClick={handleTogglePump}
              className={`${isOn ? "bg-green-500" : "bg-gray-300"} relative inline-flex items-center h-6 rounded-full w-11 transition`}
            >
              <span
                className={`${isOn ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full transition`}
              />
            </button>
            <span>On</span>
          </div>
        </div>
      </div>
    </div>
  );
}
