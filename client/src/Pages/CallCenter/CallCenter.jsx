import React from "react";

const callData = [
  {
    serial: 1,
    time: "2025-06-06 21:28:37",
    destination: "GP (017)",
    rate: 0.4,
    dialedNumber: "01761855655",
    duration: "0:33",
    amount: 0.2530,
  },
  {
    serial: 2,
    time: "2025-06-06 11:08:37",
    destination: "GP (017)",
    rate: 0.4,
    dialedNumber: "01761855655",
    duration: "1:46",
    amount: 0.8127,
  },
  {
    serial: 3,
    time: "2025-06-06 11:05:41",
    destination: "GP (017)",
    rate: 0.4,
    dialedNumber: "01710489025",
    duration: "2:01",
    amount: 0.9277,
  },
];

function CallCenter() {
  // Calculate total duration and amount
  const totalDuration = callData.reduce((acc, cur) => {
    // Convert duration "m:ss" to seconds
    const [m, s] = cur.duration.split(":").map(Number);
    return acc + m * 60 + s;
  }, 0);

  // Convert total seconds back to "h:mm:ss" or "m:ss"
  const formatDuration = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  const totalAmount = callData.reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Call Center Log
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="p-3 border border-gray-300">Serial</th>
                <th className="p-3 border border-gray-300">Time</th>
                <th className="p-3 border border-gray-300">Destination</th>
                <th className="p-3 border border-gray-300">Rate (৳)</th>
                <th className="p-3 border border-gray-300">Dialed Number</th>
                <th className="p-3 border border-gray-300">Duration</th>
                <th className="p-3 border border-gray-300">Amount (৳)</th>
              </tr>
            </thead>
            <tbody>
              {callData.map((call) => (
                <tr
                  key={call.serial}
                  className="hover:bg-gray-50 even:bg-gray-100 transition-colors"
                >
                  <td className="p-3 border border-gray-300">{call.serial}</td>
                  <td className="p-3 border border-gray-300">{call.time}</td>
                  <td className="p-3 border border-gray-300">{call.destination}</td>
                  <td className="p-3 border border-gray-300">{call.rate.toFixed(2)}</td>
                  <td className="p-3 border border-gray-300">{call.dialedNumber}</td>
                  <td className="p-3 border border-gray-300">{call.duration}</td>
                  <td className="p-3 border border-gray-300">{call.amount.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-300 font-semibold text-gray-900">
                <td className="p-3 border border-gray-400" colSpan={5}>
                  Total
                </td>
                <td className="p-3 border border-gray-400">{formatDuration(totalDuration)}</td>
                <td className="p-3 border border-gray-400">{totalAmount.toFixed(4)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CallCenter;
