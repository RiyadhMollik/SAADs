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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const chartRef = useRef(null);
    const [location, setLocation] = useState("");
    const [parameter, setParameter] = useState("");
    const [stations, setStations] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [data, setData] = useState([]);

    // Helper function to safely parse date
    const parseDate = (dateString) => {
        if (!dateString) return null;
        
        try {
            // Handle different date formats
            let date;
            if (typeof dateString === 'string') {
                // Try parsing as ISO string first
                date = new Date(dateString);
                
                // If invalid, try parsing as MySQL datetime format
                if (isNaN(date.getTime())) {
                    date = new Date(dateString.replace(' ', 'T'));
                }
            } else if (dateString instanceof Date) {
                date = dateString;
            } else {
                return null;
            }
            
            // Check if the date is valid
            if (isNaN(date.getTime())) {
                console.warn('Invalid date:', dateString);
                return null;
            }
            
            return date.getTime();
        } catch (error) {
            console.warn('Error parsing date:', dateString, error);
            return null;
        }
    };

    // Helper function to safely parse numeric value
    const parseValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    };

    // Fetch stations from API
    const fetchStations = async () => {
        try {
            const response = await fetch('https://iinms.brri.gov.bd/api/research-measures/stations');
            if (!response.ok) {
                throw new Error('Failed to fetch stations');
            }
            const stationsData = await response.json();
            setStations(stationsData);
            if (stationsData.length > 0 && !location) {
                setLocation(stationsData[0].station_id);
            }
        } catch (error) {
            console.error('Error fetching stations:', error);
            setError('Failed to load stations');
        }
    };

    // Fetch parameters from API
    const fetchParameters = async () => {
        try {
            const response = await fetch('https://iinms.brri.gov.bd/api/research-measures/parameters');
            if (!response.ok) {
                throw new Error('Failed to fetch parameters');
            }
            const parametersData = await response.json();
            setParameters(parametersData);
            if (parametersData.length > 0 && !parameter) {
                setParameter(parametersData[0].measure);
            }
        } catch (error) {
            console.error('Error fetching parameters:', error);
            setError('Failed to load parameters');
        }
    };

    // Fetch data for specific station and parameter
    const fetchData = async (stationId, measure) => {
        if (!stationId || !measure) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`https://iinms.brri.gov.bd/api/research-measures/station/${stationId}/parameter/${encodeURIComponent(measure)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const measuresData = await response.json();
            
            // Transform data for Highcharts with proper validation
            const chartData = measuresData
                .map(item => {
                    const timestamp = parseDate(item.date_value);
                    const value = parseValue(item.last_value);
                    
                    // Only include data points with valid timestamp and value
                    if (timestamp !== null && value !== null) {
                        return [timestamp, value];
                    }
                    return null;
                })
                .filter(item => item !== null) // Remove invalid data points
                .sort((a, b) => a[0] - b[0]); // Sort by timestamp
            
            console.log('Processed chart data:', chartData);
            setData(chartData);
            
            if (chartData.length === 0) {
                setError('No valid data available for the selected criteria');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load chart data');
        } finally {
            setLoading(false);
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        fetchStations();
        fetchParameters();
    }, []);

    // Fetch data when location or parameter changes
    useEffect(() => {
        if (location && parameter) {
            fetchData(location, parameter);
        }
    }, [location, parameter]);

    // Update chart options when data changes
    useEffect(() => {
        if (data.length > 0) {
            const selectedStation = stations.find(s => s.station_id === location);
            const stationName = selectedStation ? selectedStation.station_name : location;
            
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
                    text: `${parameter} at ${stationName}`,
                    style: { color: "#1a202c", fontSize: "18px" },
                },
                subtitle: {
                    text: `Data from ${data.length} measurements`,
                    style: { color: "#718096" },
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        format: '{value:%Y-%m-%d}'
                    }
                },
                yAxis: {
                    title: {
                        text: parameter
                    }
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
                            xDateFormat: '%Y-%m-%d %H:%M'
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
        }
    }, [data, location, parameter, stations]);

    const handleShow = () => {
        if (location && parameter) {
            fetchData(location, parameter);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                <div className="w-full p-4 bg-white rounded-lg shadow-lg">
                    <div className="text-center text-red-600">
                        <p className="text-lg font-semibold">Error</p>
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                                disabled={loading}
                            >
                                <option value="">Select a station...</option>
                                {stations.map((station) => (
                                    <option key={station.station_id} value={station.station_id}>
                                        {station.station_name}
                                    </option>
                                ))}
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
                                disabled={loading}
                            >
                                <option value="">Select a parameter...</option>
                                {parameters.map((param) => (
                                    <option key={param.measure} value={param.measure}>
                                        {param.measure}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleShow}
                                disabled={loading || !location || !parameter}
                                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Loading...' : 'Show'}
                            </button>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p className="text-gray-500">Loading chart data...</p>
                            </div>
                        </div>
                    ) : chartOptions && data.length > 0 ? (
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
                            <p className="text-gray-500">
                                {!location || !parameter 
                                    ? 'Please select a location and parameter to view data' 
                                    : 'No data available for the selected criteria'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
    );
};

export default AAPLStockChart;