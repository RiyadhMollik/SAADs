import React, { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

// Set global Highcharts language options
Highcharts.setOptions({
    lang: {
        rangeSelectorZoom: "Granularity",
    },
});

const AAPLStockChart = () => {
    const [chartOptions, setChartOptions] = useState(null);
    const chartRef = useRef(null);
    const [location, setLocation] = useState("BBRRI HQ Gazipur");
    const [parameter, setParameter] = useState("Solar Radiation");

    // Mock data for solar radiation
    const generateMockData = () => {
        const data = [];
        const startDate = new Date("2025-07-01").getTime();
        for (let i = 0; i < 30; i++) {
            const date = startDate + i * 24 * 60 * 60 * 1000;
            const value = Math.random() * 1000; // Random solar radiation value (0-1000)
            data.push([date, value]);
        }
        return data;
    };

    useEffect(() => {
        const data = generateMockData();
        setChartOptions({
            chart: {
                height: 500,
                backgroundColor: "transparent",
            },
            rangeSelector: {
                allButtonsEnabled: true,
                buttons: [
                    {
                        type: "month",
                        count: 1,
                        text: "Day",
                        dataGrouping: {
                            forced: true,
                            units: [["day", [1]]],
                        },
                    },
                    {
                        type: "week",
                        count: 1,
                        text: "Week",
                        dataGrouping: {
                            forced: true,
                            units: [["week", [1]]],
                        },
                    },
                    {
                        type: "month",
                        count: 1,
                        text: "Month",
                        dataGrouping: {
                            forced: true,
                            units: [["month", [1]]],
                        },
                    },
                    {
                        type: "month",
                        count: 3,
                        text: "3 Month",
                        dataGrouping: {
                            forced: true,
                            units: [["month", [1]]],
                        },
                    },
                    {
                        type: "month",
                        count: 6,
                        text: "6 Month",
                        dataGrouping: {
                            forced: true,
                            units: [["month", [1]]],
                        },
                    },
                    {
                        type: "year",
                        count: 1,
                        text: "1 Year",
                        dataGrouping: {
                            forced: true,
                            units: [["year", [1]]],
                        },
                    },
                ],
                buttonTheme: {
                    width: 60,
                    style: { color: "#333" },
                    hover: { backgroundColor: "#f0f0f0" },
                },
                selected: 2,
            },
            title: {
                text: `${parameter} at ${location}`,
                style: { color: "#1a202c", fontSize: "18px" },
            },
            subtitle: {
                text: "Simulated data for demonstration",
                style: { color: "#718096" },
            },
            navigator: {
                enabled: true,
                outlineColor: "#e2e8f0",
                maskFill: "rgba(102, 133, 194, 0.2)",
                series: {
                    color: "#2b6cb0",
                    lineWidth: 1,
                },
            },
            exporting: {
                enabled: true,
                buttons: {
                    contextButton: {
                        menuItems: [
                            "viewFullscreen",
                            "printChart",
                            "downloadPNG",
                            "downloadJPEG",
                            "downloadSVG",
                        ],
                    },
                },
            },
            series: [
                {
                    name: parameter,
                    data,
                    color: "#2b6cb0",
                    tooltip: {
                        valueDecimals: 2,
                    },
                    marker: {
                        enabled: null,
                        radius: 3,
                        lineWidth: 1,
                        lineColor: "#edf2f7",
                    },
                },
            ],
        });
    }, [location, parameter]);

    const handleShow = () => {
        // Trigger chart update (already handled by useEffect)
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <div className="w-full p-4 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Location
                        </label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="BBRRI HQ Gazipur">BBRRI HQ Gazipur</option>
                            <option value="Gopalgonj sadar(BRRI)">Gopalgonj sadar(BRRI)</option>
                            <option value="BRRI Kushtia">BRRI Kushtia</option>
                            <option value="Rice research institute ,Rajshahi">Rice research institute ,Rajshahi</option>
                            <option value="Rice Research Institute , Comilla">Rice Research Institute , Comilla</option>
                            <option value="Rice Research Institute,Rangpur">Rice Research Institute,Rangpur</option>
                            <option value="DAE-BRRI Sirajganj">DAE-BRRI Sirajganj</option>
                            <option value="DAE-BRRI Barishal">DAE-BRRI Barishal</option>
                            <option value="DAE-BRRI Satkhira Sadar">DAE-BRRI Satkhira Sadar</option>
                            <option value="DAE-BRRI Sonagazi Feni">DAE-BRRI Sonagazi Feni</option>
                            <option value="DAE-BRRI Gazipur">DAE-BRRI Gazipur</option>
                            <option value="Rice Research Institute - Habiganj">Rice Research Institute - Habiganj</option>
                            <option value="Bangladesh Rice Research Institute (BRRI), Bhanga, Faridpur">Bangladesh Rice Research Institute (BRRI), Bhanga, Faridpur</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Parameter
                        </label>
                        <select
                            value={parameter}
                            onChange={(e) => setParameter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Rainfall">Rainfall</option>
                            <option value="Temperature">Temperature</option>
                            <option value="Relative Humidity">Relative Humidity</option>
                            <option value="Relative Humidity Morning">Relative Humidity Morning</option>
                            <option value="Wind Speed">Wind Speed</option>
                            <option value="Maximum Temperature">Maximum Temperature</option>
                            <option value="Minimum Temperature">Minimum Temperature</option>
                            <option value="Soil Moisture">Soil Moisture</option>
                            <option value="Solar Radiation">Solar Radiation</option>
                            <option value="Sunshine">Sunshine</option>
                            <option value="Cloud">Cloud</option>
                            <option value="Relative Humidity Evening">Relative Humidity Evening</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleShow}
                            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Show
                        </button>
                    </div>
                </div>
                {chartOptions ? (
                    <div className="w-full">
                        <HighchartsReact
                            highcharts={Highcharts}
                            constructorType="stockChart"
                            options={chartOptions}
                            ref={chartRef}
                        />
                    </div>
                ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Loading chart...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AAPLStockChart;