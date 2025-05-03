
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import TemperatureTable from "../../Components/TemperatureTable/TemperatureTable";
const RainfallChart = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/stats/temperature");
        const data = await response.json();
        setSelectedDate(data.average)
        if (Array.isArray(data.last20)) {
          const formattedData = data.last20.map(({ timestamp, temperature }) => ({
            date: new Date(timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            Temperature: temperature,
          }));
          console.log(formattedData);

          setTemperatureData(formattedData.reverse());
        }
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTemperatureData();
  }, []);
  return (
    <div className="md:h-96 lg:h-96 flex flex-col md:flex-row lg:flex-row gap-5 md:gap-0 lg:gap-0">
      <div className="w-full h-64 md:h-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={temperatureData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Temperature"
              stroke="#f10c0c"
              strokeWidth={2}
              fill="#f10c0c"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="max-w-full  lg:w-1/3 md:w-1/3">

        <div className="overflow-x-auto border border-gray-300 rounded-lg max-h-[365px] custom-scrollbar">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border-b font-montserrat font-extralight">Date</th>
                <th className="px-4 py-2 border-b font-montserrat font-extralight">Avg</th>
              </tr>
            </thead>
            <tbody>
              {selectedDate?.map((data, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 border-b font-montserrat font-extralight">{data.date}</td>
                  <td className="px-4 py-2 border-b font-montserrat font-extralight">{((data.min_temperature + data.max_temperature) / 2).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const SoilMoisture = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/stats/soil-moisture");
        const data = await response.json();
        console.log(data);
        setSelectedDate(data.average)
        if (Array.isArray(data.last20)) {
          const formattedData = data.last20.map(({ timestamp, soil_moisture }) => ({
            date: new Date(timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            SoilMoisture: soil_moisture,
          }));

          setTemperatureData(formattedData.reverse());
        }
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTemperatureData();
  }, []);

  return (
    <div className="min-h-96 md:h-96 lg:h-96 flex flex-col md:flex-row lg:flex-row gap-5 md:gap-0 lg:gap-0">
      <div className="w-full h-64 md:h-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={temperatureData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="SoilMoisture"
              stroke="#bcad98"
              strokeWidth={2}
              fill="#bcad98"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-1/3 lg:w-1/3">
        <div className="overflow-x-auto border border-gray-300 rounded-lg max-h-[365px] custom-scrollbar">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border-b font-montserrat font-extralight">Date</th>
                <th className="px-4 py-2 border-b font-montserrat font-extralight">Avg</th>
              </tr>
            </thead>
            <tbody>
              {(selectedDate ?? []).map((data, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2 border-b font-montserrat font-extralight">{data.date}</td>
                  <td className="px-4 py-2 border-b font-montserrat font-extralight">
                    {data.min_soil_moisture !== undefined && data.max_soil_moisture !== undefined
                      ? ((data.min_soil_moisture + data.max_soil_moisture) / 2).toFixed(2)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};
const WaterLevel = () => {
  const [waterLevelData, setWaterLevelData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const fetchWaterLevelData = async () => {
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/stats/water-level");
        const data = await response.json();
        console.log(data);
        setSelectedDate(data.average)
        if (Array.isArray(data.last20)) {
          const formattedData = data.last20.map(({ timestamp, water_level }) => ({
            date: new Date(timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            WaterLevel: water_level,
          }));

          setWaterLevelData(formattedData.reverse());
        }
      } catch (error) {
        console.error("Error fetching water level data:", error);
      }
    };

    fetchWaterLevelData();
  }, []);

  return (
    <div className="md:h-96 lg:h-96 flex flex-col md:flex-row lg:flex-row gap-5 md:gap-0 lg:gap-0">
      <div className="w-full h-64 md:h-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={waterLevelData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="WaterLevel"
              stroke="#008FFB"
              strokeWidth={2}
              fill="#008FFB"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="max-w-full  lg:w-1/3 md:w-1/3">

        <div className="overflow-x-auto border border-gray-300 rounded-lg max-h-[365px] custom-scrollbar">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border-b font-montserrat font-extralight">Date</th>
                <th className="px-4 py-2 border-b font-montserrat font-extralight">Avg</th>
              </tr>
            </thead>
            <tbody>
              {selectedDate?.map((data, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 border-b font-montserrat font-extralight">{data.date}</td>
                  <td className="px-4 py-2 border-b font-montserrat font-extralight">{((data.min_water_level + data.max_water_level) / 2).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function Protentiometer() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="space-y-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-montserrat font-extralight mb-4">Soil Moisture (%)</h2>
          <div className="md:p-14 lg:p-14">
            <SoilMoisture />
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg mb-4 font-montserrat font-extralight">Water Level (cm)</h2>
          <div className="md:p-14 lg:p-14">
            <WaterLevel />
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg  mb-4 font-montserrat font-extralight">Soil Temperature (oC)</h2>
          <div className="md:p-14 lg:p-14">
            <RainfallChart />
          </div>
        </div>
      </div>


    </div>
  )
}

export default Protentiometer