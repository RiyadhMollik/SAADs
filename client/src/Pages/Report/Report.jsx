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

    // Fetch SAAO list
    const fetchSAAOs = async () => {
        try {
            const response = await fetch("https://iinms.brri.gov.bd/api/farmers/farmers/role/saao");
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setSAAOList(data);
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

    // Filter options based on search term
    const filteredOptions = SAAOList.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) || option.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        setSelectedOption(option.name);
        setSearchTerm(option.name + " - " + option.mobileNumber); 
        setIsDropdownOpen(false); 
    };

    // Sample data for the table
    const data = [
        { id: 1, name: 'John Doe', age: 28 },
        { id: 2, name: 'Jane Smith', age: 34 },
        { id: 3, name: 'Alice Johnson', age: 25 },
        { id: 4, name: 'Bob Brown', age: 40 },
    ];

    // Dynamic search filtering
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting the table data
    const sortedData = [...filteredData].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.age - b.age;
        }
        return b.age - a.age;
    });

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Graph data (simple example using Chart.js)
    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Monthly Growth',
                data: [65, 59, 80, 81, 56],
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
                                text: 'Months',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Growth',
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
            {/* Input field as the first option */}
            <div className="relative w-full mb-10">
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
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Data
                                    <button onClick={toggleSortOrder} className="ml-2">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2 border">{item.name}</td>
                                    <td className="px-4 py-2 border">{item.age}</td>
                                </tr>
                            ))}
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
