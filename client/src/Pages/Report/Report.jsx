import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController } from 'chart.js';

// Register the necessary components including LineController
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController // Add LineController to the registration
);

const Report = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [activeTab, setActiveTab] = useState('table'); // "table" or "graph"
    const [SAAOList, setSAAOList] = useState([]);
    const chartRef = useRef(null); // Reference to the chart
    const chartInstanceRef = useRef(null); // To store the chart instance
    const [selectedOption, setSelectedOption] = useState(""); // For storing selected option
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // To toggle the dropdown
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    // Fetch SAAO list
    const fetchSAAOs = async () => {
        try {
            const response = await fetch("https://iinms.brri.gov.bd/api/farmers/farmers/role/saao");
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setSAAOList(data.data);
            } else {
                throw new Error("Failed to fetch SAAOs");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchSAAOs();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/stats/${selectedOption?.id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setData(data);
                } else {
                    throw new Error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchData();
    }, [selectedOption, refresh]);


    console.log(selectedOption);

    // Filter options based on search term
    const filteredOptions = SAAOList.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) || option.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        setSelectedOption(option);
        setSearchTerm(option.name + " - " + option.mobileNumber);
        setIsDropdownOpen(false);
        setData([]);
        setRefresh(!refresh);
    };

    // Sample data for the table


    // Sorting the table data
    const sortedData = [...data].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.age - b.age;
        }
        return b.age - a.age;
    });

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    const lebels = data.map((item) => item.date);
    const values = data.map((item) => item.totalEntries);
    // Graph data (simple example using Chart.js)
    const chartData = {
        labels: lebels,
        datasets: [
            {
                label: 'Total Entries',
                data: values,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    // Destroy the previous chart when switching tabs or unmounting
    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy(); // Destroy the existing chart
            }
        };
    }, [activeTab]);

    // Create chart when the graph tab is active
    useEffect(() => {
        if (activeTab === 'graph' && chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy(); // Destroy previous chart instance if exists
            }

            chartInstanceRef.current = new ChartJS(chartRef.current, {
                type: 'line', // Chart type
                data: chartData, // Chart data
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Entries',
                            },
                        },
                    },
                },
            });
        }

        return () => {
            // Cleanup chart when unmounting or switching tabs
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [activeTab]);

    return (
        <div className="container mx-auto p-4">
            <div className='flex flex-col md:flex-row lg:flex-row gap-5  justify-center items-center'>
                <div className="relative w-full md:w-1/3 lg:w-1/3 mt-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown on click
                    />
                    {/* Dropdown list */}
                    {isDropdownOpen && (
                        <div className="absolute top-10 w-full max-h-60 overflow-y-auto border border-gray-300 bg-white rounded-md shadow-lg">
                            {filteredOptions.length === 0 ? (
                                <div className="p-2 text-gray-500">No results found</div>
                            ) : (
                                filteredOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSelect(option)} // Set option on click
                                        className="cursor-pointer p-2 hover:bg-gray-200"
                                    >
                                        {option.name} - {option.mobileNumber}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4 w-full md:w-2/3 lg:w-2/3 ">
                    <div className=' w-full'>
                        <label className="block mb-1 font-medium">Start Date</label>
                        <input
                            type="date"
                            // value={startDateTime}
                            // onChange={(e) => setStartDateTime(e.target.value)}
                            className="border px-3 py-2 rounded w-full"
                        />
                    </div>
                    <div className=' w-full'>
                        <label className="block mb-1 font-medium">End Date</label>
                        <input
                            type="date"
                            // value={endDateTime}
                            // onChange={(e) => setEndDateTime(e.target.value)}
                            className="border px-3 py-2 rounded w-full"
                        />
                    </div>
                    <button
                        // onClick={fetchTemperatureData}
                        className="self-end w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Filter
                    </button>
                </div>
            </div>
            {/* Input field as the first option */}


            {/* Tab Buttons */}
            <div className="flex mb-4 w-full">
                <button
                    className={`px-4 w-full py-2 ${activeTab === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('table')}
                >
                    Table
                </button>
                <button
                    className={`px-4 w-full py-2 ${activeTab === 'graph' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('graph')}
                >
                    Graph
                </button>
            </div>

            {/* Table Tab */}
            {activeTab === 'table' && (
                <div>
                    {/* Table */}
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Date</th>
                                <th className="px-4 py-2 border">Total Entries
                                    <button onClick={toggleSortOrder} className="ml-2">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((item) => (
                                <tr key={item.id} className='text-center'>
                                    <td className="px-4 py-2 border">{item.date}</td>
                                    <td className="px-4 py-2 border">{item.totalEntries}</td>
                                </tr>
                            ))}
                            <tr className='text-center bg-slate-200'>
                                <td className="px-4 py-2 border">TOTAL</td>
                                <td className="px-4 py-2 border">{sortedData.reduce((sum, item) => sum + item.totalEntries, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            {/* Graph Tab */}
            {activeTab === 'graph' && (
                <div className="mt-4">
                    <canvas ref={chartRef} />
                </div>
            )}
        </div>
    );
};

export default Report;
