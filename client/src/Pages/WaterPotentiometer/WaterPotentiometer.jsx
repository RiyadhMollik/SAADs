import { useState } from "react";
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ReactApexChart from "react-apexcharts";
const jsonData1 = [
    { date: "2023-01-01", value: 20 },
    { date: "2023-01-02", value: 25 },
    { date: "2023-01-03", value: 30 },
    { date: "2023-01-04", value: 22 },
    { date: "2023-01-05", value: 28 },
];
const jsonData2 = [
    { date: "2023-01-01", value: 18 },
    { date: "2023-01-02", value: 23 },
    { date: "2023-01-03", value: 26 },
    { date: "2023-01-04", value: 20 },
    { date: "2023-01-05", value: 25 },
];
const jsonData3 = [
    { date: "2023-01-01", value: 15 },
    { date: "2023-01-02", value: 19 },
    { date: "2023-01-03", value: 21 },
    { date: "2023-01-04", value: 17 },
    { date: "2023-01-05", value: 23 },
];

// Convert JSON data to series format
const seriesData1 = jsonData1.map((item) => ({
    x: item.date,
    y: item.value,
}));
const seriesData2 = jsonData2.map((item) => ({
    x: item.date,
    y: item.value,
}));
const seriesData3 = jsonData3.map((item) => ({
    x: item.date,
    y: item.value,
}));
const WaterPotentiometer = () => {
    const chartData = {
        series: [
            {
                name: "Temperature",
                data: seriesData1,
            },
            {
                name: "Humidity",
                data: seriesData2,
            },
            {
                name: "Soil Moisture",
                data: seriesData3,
            },
        ],
        options: {
            chart: {
                id: "temperature-chart",
                type: "line",
                height: 500,
            },
            colors: ["#f70404", "#0077b6", "#06d6a0"],
            stroke: {
                curve: "smooth",
                width: 4,
            },
            markers: {
                size: 8,
                strokeColor: "#fff",
                strokeWidth: 2,
                hover: {
                    size: 7,
                    sizeOffset: 3,
                },
            },
            xaxis: {
                type: "datetime",
                categories: jsonData1.map((item) => item.date),
                labels: {
                    rotate: 0,
                    style: {
                        fontSize: "12px",
                    },
                },
                title: {
                    text: "Date",
                    style: {
                        fontSize: "14px",
                        fontWeight: "bold",
                    },
                },
            },
            yaxis: {
                title: {
                    text: "Values",
                    style: {
                        fontSize: "14px",
                        fontWeight: "bold",
                    },
                },
            },
            tooltip: {
                x: {
                    format: "yyyy-MM-dd",
                },
            },
            legend: {
                position: "top",
                horizontalAlign: "center",
            },
        },
    };
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputClick = () => {
        setShowDatePicker((prev) => !prev);
    };

    const handleDateChange = (item) => {
        setState([item.selection]);
        setShowDatePicker(false); // Close date picker after selection
    };
    const fields = [
        { serial: 1, field: "Field A", deviceId: "Device 101", date: "2024-12-01", waterRequirement: 15, forecast: "High", pump: "On", waterBalance: "Low" },
        { serial: 2, field: "Field B", deviceId: "Device 102", date: "2024-12-02", waterRequirement: 20, forecast: "Low", pump: "Off", waterBalance: "High" },
        { serial: 3, field: "Field C", deviceId: "Device 103", date: "2024-12-03", waterRequirement: 18, forecast: "Medium", pump: "On", waterBalance: "Medium" },
        { serial: 4, field: "Field D", deviceId: "Device 104", date: "2024-12-04", waterRequirement: 22, forecast: "High", pump: "Off", waterBalance: "Low" },
        { serial: 5, field: "Field E", deviceId: "Device 105", date: "2024-12-05", waterRequirement: 17, forecast: "Low", pump: "On", waterBalance: "High" },
    ];

    const [selectedField, setSelectedField] = useState("");
    const [selectedDevice, setSelectedDevice] = useState("");

    const filteredFields = fields.filter(
        (item) =>
            (selectedField === "" || item.field === selectedField) &&
            (selectedDevice === "" || item.deviceId === selectedDevice)
    );

    return (
        <div style={{  height: "100vh", flexDirection: "row", backgroundColor: "#f9fafb" }}>
            {/* Main Content */}
            <div style={{ flexGrow: 1, padding: "25px", paddingTop: "80px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "15px", color: "#1f4e3b" }}>
                    Welcome to the Intelligent Irrigation and Nutrient Management System WaterPotentiometer
                </h2>
                <p style={{ fontSize: "16px", color: "#555" }}>
                    This is where you can manage all your irrigation and nutrient requirements.
                </p>

                {/* Filters */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <div>
                        <label htmlFor="fieldFilter" style={{ marginRight: "5px" }}>Field:</label>
                        <select
                            id="fieldFilter"
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                            style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                        >
                            <option value="">All</option>
                            {[...new Set(fields.map((field) => field.field))].map((field) => (
                                <option key={field} value={field}>
                                    {field}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="deviceFilter" style={{ marginRight: "5px" }}>Device:</label>
                        <select
                            id="deviceFilter"
                            value={selectedDevice}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                            style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                        >
                            <option value="">All</option>
                            {[...new Set(fields.map((field) => field.deviceId))].map((device) => (
                                <option key={device} value={device}>
                                    {device}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="deviceFilter" style={{ marginRight: "5px" }}>Method:</label>
                        <select
                            id="deviceFilter"
                            value={selectedDevice}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                            style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                        >
                            <option value="">All</option>
                            {[...new Set(fields.map((field) => field.deviceId))].map((device) => (
                                <option key={device} value={device}>
                                    {device}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className=" ">
                        <label htmlFor="deviceFilter" style={{ marginRight: "5px" }}>Date Range:</label>
                        <input
                            value={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
                            type="text"
                            readOnly
                            placeholder="Search..."
                            className="search-input border  rounded w-full text-center"
                            onClick={handleInputClick}
                        />
                    </div>
                </div>
                {showDatePicker && (
                    <div className="absolute z-[1000] bg-white shadow-lg">
                        <DateRangePicker
                            onChange={handleDateChange}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={2}
                            ranges={state}
                            direction="horizontal"
                        />
                    </div>
                )}
                {/* Card with the fields */}
                <div>
                    <div
                        className="card shadow-sm"
                        style={{
                            background: "#ffffff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <div className="card-header bg-dark text-white">
                            <h5 className="card-title mb-0">Irrigation Field Information</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Serial</th>
                                        <th>Field</th>
                                        <th>Device ID</th>
                                        <th>Date</th>
                                        <th>Water Requirement (cm)</th>
                                        <th>Weather Forecast</th>
                                        <th>Pump</th>
                                        <th>Water Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFields.map((field) => (
                                        <tr key={field.serial}>
                                            <td>{field.serial}</td>
                                            <td>{field.field}</td>
                                            <td>{field.deviceId}</td>
                                            <td>{field.date}</td>
                                            <td>{field.waterRequirement}</td>
                                            <td>{field.forecast}</td>
                                            <td>{field.pump}</td>
                                            <td>{field.waterBalance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredFields.length === 0 && (
                                <p style={{ textAlign: "center", marginTop: "10px" }}>No data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div id="wrapper" className="relative bg-white p-4 shadow-md rounded-md">
                <div className='flex '>
                    <div>
                        <h1 className='font-semibold text-xl ml-3'>Temperature</h1>
                        <h1 className='font-semibold ml-4'>Unit: °C</h1>
                    </div>
                </div>
                <div className="chart h-[500px] flex gap-14 mt-5" id="chart-line">
                    <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={450} width={800} />
                </div>
            </div>
        </div>
    );
};

export default WaterPotentiometer;
