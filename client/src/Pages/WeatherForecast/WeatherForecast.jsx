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
import Barchart from "../../Components/Barchart/Barchart";
import { use } from "react";



const RainfallChart = () => {
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch(
          "https://iinms.brri.gov.bd/api/weather/temperature?lat=21.1&lon=88.1"
        );
        const data = await response.json();

        if (data.temperature) {
          const formattedData = Object.entries(data.temperature).map(
            ([date, temp]) => ({
              date: new Date(date).toLocaleDateString("en-US"),
              Temperature: parseFloat(temp.toFixed(3)),
            })
          );

          setTemperatureData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTemperatureData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row lg:flex-row gap-5">
      <div className="w-full md:w-2/3 lg:w-2/3  mb-6">
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
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/3 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Temperature (°C)</th>
            </tr>
          </thead>
          <tbody>
            {temperatureData.map((entry, index) => (
              <tr key={index} className="border">
                <td className="py-2 px-4 border">{entry.date}</td>
                <td className="py-2 px-4 border">{entry.Temperature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const SoilChart = () => {
  const [soilMoistureData, setSoilMoistureData] = useState([]);

  useEffect(() => {
    const fetchSoilMoistureData = async () => {
      try {
        const response = await fetch(
          "https://iinms.brri.gov.bd/api/weather/soil-moisture?lat=21.1&lon=88.1"
        );
        const data = await response.json();

        if (data.soil_moisture) {
          const formattedData = Object.entries(data.soil_moisture).map(
            ([date, moisture]) => ({
              date: new Date(date).toLocaleDateString("en-US"),
              SoilMoisture: parseFloat(moisture.toFixed(3)),
            })
          );

          setSoilMoistureData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching soil moisture data:", error);
      }
    };

    fetchSoilMoistureData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row lg:flex-row w-full p-4 gap-5">
      <div className="w-full md:w-2/3 lg:w-2/3  mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={soilMoistureData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="SoilMoisture"
              stroke="#b5ae9b"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/3 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Soil Moisture (%)</th>
            </tr>
          </thead>
          <tbody>
            {soilMoistureData.map((entry, index) => (
              <tr key={index} className="border">
                <td className="py-2 px-4 border">{entry.date}</td>
                <td className="py-2 px-4 border">{entry.SoilMoisture}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Sunshine = () => {
  const [sunshineData, setSunshineData] = useState([]);

  useEffect(() => {
    const fetchSunshineData = async () => {
      try {
        const response = await fetch(
          "https://iinms.brri.gov.bd/api/sunshine?lat=22.1785&lon=90.7101"
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const formattedData = data.map((item) => ({
            date: `${item.year}-${item.month}-${item.day}`,
            predictedSunshine: item.predictedSunshine,
          }));

          setSunshineData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching sunshine data:", error);
      }
    };

    fetchSunshineData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row lg:flex-row w-full p-4 gap-5">
      <div className="w-full md:w-2/3 lg:w-2/3 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sunshineData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="predictedSunshine"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/3 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Predicted Sunshine (hours)</th>
            </tr>
          </thead>
          <tbody>
            {sunshineData.map((entry, index) => (
              <tr key={index} className="border">
                <td className="py-2 px-4 border">{entry.date}</td>
                <td className="py-2 px-4 border">{entry.predictedSunshine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const HumidityChart = () => {
  const [humidityData, setHumidityData] = useState([]);

  useEffect(() => {
    const fetchHumidity = async () => {
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/weather/humidity?lat=21.1&lon=88.1");
        const data = await response.json();
        if (data.humidity) {
          const formattedData = Object.entries(data.humidity).map(([date, value]) => ({
            date,
            Humidity: parseFloat(value.toFixed(3)), // Formatting to 3 decimal places
          }));
          setHumidityData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching humidity data:", error);
      }
    };

    fetchHumidity();
  }, []);

  return (
    <div className="flex flex-col md:flex-row lg:flex-row w-full p-4 gap-5">
      <div className="w-full md:w-2/3 lg:w-2/3 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={humidityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Humidity" stroke="#0cebfb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/3 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {humidityData.map((entry, index) => (
              <tr key={index} className="border">
                <td className="py-2 px-4 border">{entry.date}</td>
                <td className="py-2 px-4 border">{entry.Humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function WeatherForecast() {
  const [hotsopt, setHotspot] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState("");
  const [region, setRegion] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [division, setDivision] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [district, setDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [upazila, setUpazila] = useState([]);
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [union, setUnion] = useState([]);
  const [selectedUnion, setSelectedUnion] = useState("");
  const [block, setBlock] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("");

  useEffect(() => {
    const fetchHotspot = async () => {
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/data/hotspots");
        const data = await response.json();
        setHotspot(data);
      } catch (error) {
        console.error("Error fetching hotspot data:", error);
      }
    };
    fetchHotspot();
  }, []);

  useEffect(() => {
    if (!selectedHotspot) return; // Prevent unnecessary API calls

    const fetchRegion = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/regions?hotspot=${selectedHotspot}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch region data");
        }
        const data = await response.json();
        setRegion(data);
      } catch (error) {
        console.error("Error fetching region data:", error);
      }
    };

    fetchRegion();
  }, [selectedHotspot]);

  useEffect(() => {
    if (!selectedRegion || !selectedHotspot) return; // Prevent unnecessary API calls 

    const fetchDivision = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/divisions?region=${selectedRegion}&hotspot=${selectedHotspot}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch division data");
        }
        const data = await response.json();
        setDivision(data);
      } catch (error) {
        console.error("Error fetching division data:", error);
      }
    };

    fetchDivision();
  }, [selectedRegion, selectedHotspot]);

  useEffect(() => {
    if (!selectedDivision || !selectedRegion || !selectedHotspot) return; // Prevent unnecessary API calls

    const fetchDistrict = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/districts?division=${selectedDivision}&region=${selectedRegion}&hotspot=${selectedHotspot}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch district data");
        }
        const data = await response.json();
        setDistrict(data);
      } catch (error) {
        console.error("Error fetching district data:", error);
      }
    };

    fetchDistrict();
  }, [selectedDivision, selectedRegion, selectedHotspot]);

  useEffect(() => {
    if (!selectedDistrict || !selectedDivision || !selectedRegion || !selectedHotspot) return; // Prevent unnecessary API calls

    const fetchUpazila = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/upazilas?district=${selectedDistrict}&division=${selectedDivision}&region=${selectedRegion}&hotspot=${selectedHotspot}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch upazila data");
        }
        const data = await response.json();
        setUpazila(data);
      } catch (error) {
        console.error("Error fetching upazila data:", error);
      }
    };

    fetchUpazila();
  }, [selectedDistrict, selectedDivision, selectedRegion, selectedHotspot]);

  useEffect(() => {
    if (!selectedUpazila || !selectedDistrict || !selectedDivision || !selectedRegion || !selectedHotspot) return; // Prevent unnecessary API calls

    const fetchUnion = async () => {
      try {
        const response = await fetch(`https://iinms.brri.gov.bd/api/data/unions?upazila=${selectedUpazila}&district=${selectedDistrict}&division=${selectedDivision}&region=${selectedRegion}&hotspot=${selectedHotspot}`);
        if (!response.ok) {
          throw new Error("Failed to fetch union data");
        }
        const data = await response.json();
        setUnion(data);
      } catch (error) {
        console.error("Error fetching union data:", error);
      }
    };

    fetchUnion();
  }, [selectedUpazila, selectedDistrict, selectedDivision, selectedRegion, selectedHotspot]);
  useEffect(() => {
    if (!selectedUnion || !selectedUpazila || !selectedDistrict || !selectedDivision || !selectedRegion || !selectedHotspot) return; // Prevent unnecessary API calls

    const fetchBlock = async () => {
      try {
        const response = await fetch(`https://iinms.brri.gov.bd/api/data/blocks?union=${selectedUnion}&upazila=${selectedUpazila}&district=${selectedDistrict}&division=${selectedDivision}&region=${selectedRegion}&hotspot=${selectedHotspot}`);
        if (!response.ok) {
          throw new Error("Failed to fetch block data");
        }
        const data = await response.json();
        setBlock(data);
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };

    fetchBlock();
  }, [selectedUnion, selectedUpazila, selectedDistrict, selectedDivision, selectedRegion, selectedHotspot]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 min-w-full">
      {/* Location Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
        <select
          onChange={(e) => setSelectedHotspot(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">Select Hotspot</option>
          {hotsopt.map((hotspot) => (

            <option key={hotspot} value={hotspot}>
              {hotspot}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">Select Region</option>
          {region.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">Select Division</option>
          {division.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">Select District</option>
          {district.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedUpazila(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">Select Upazila</option>
          {upazila.map((upazila) => (
            <option key={upazila} value={upazila}>
              {upazila}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedUnion(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">Select Union</option>
          {union.map((union) => (
            <option key={union} value={union}>
              {union}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">Select Block</option>
          {block.map((block) => (
            <option key={block} value={block}>
              {block}
            </option>
          ))}
        </select>
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        <div className="bg-white shadow rounded-lg p-4">
          <Barchart />
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Temperature (°C)</h2>
          <div className="p-14">
            <RainfallChart />
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Relative Humidity (%)</h2>
          <div className="p-14">
            <HumidityChart />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Sunshine (hr)</h2>
          <div className="p-14">
            <Sunshine />
          </div>
        </div>
        {/* <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Wind Speed (km/hr)</h2>
          <div className="p-14">
            <SoilChart />
          </div>
        </div> */}

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Soil Moisture (%)</h2>
          <div className="p-14">
            <SoilChart />
          </div>
        </div>
        {/* <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Water Requirement (mm)</h2>
          <div className="p-14">
            <SoilChart />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default WeatherForecast;
