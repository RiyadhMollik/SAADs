import React, { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController
);

const Report = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [activeTab, setActiveTab] = useState('table');
    const [SAAOList, setSAAOList] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const fetchSAAOs = async () => {
        try {
            const response = await fetch('https://iinms.brri.gov.bd/api/farmers/farmers/role/saao');
            if (response.ok) {
                const result = await response.json();
                setSAAOList(result.data);
            } else throw new Error('Failed to fetch SAAOs');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchSAAOs();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedOption?.id) return;
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/stats/${selectedOption.id}`);
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else throw new Error('Failed to fetch data');
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, [selectedOption, refresh]);

    const filteredOptions = SAAOList.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        setSelectedOption(option);
        setSearchTerm(`${option.name} - ${option.mobileNumber}`);
        setIsDropdownOpen(false);
        setData([]);
        setRefresh(!refresh);
    };

    const sortedData = [...data].sort((a, b) => sortOrder === 'asc' ? a.age - b.age : b.age - a.age);
    const toggleSortOrder = () => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

    const labels = data.map(item => item.date);
    const values = data.map(item => item.totalEntries);

    const chartData = {
        labels,
        datasets: [
            {
                label: '',
                data: values,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.3,
                pointBackgroundColor: 'rgba(75,192,192,1)',
                pointRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { 
                title: { display: true, text: 'Date', font: { size: 12 } },
                ticks: { font: { size: 10 }, maxRotation: 90, minRotation: 90 }
            },
            y: { 
                title: { display: true, text: 'Number of Farmers', font: { size: 12 } },
                ticks: { font: { size: 10 } }
            },
        },
        plugins: {
            legend: { display: false },
        },
    };

    useEffect(() => {
        if (activeTab === 'graph' && chartRef.current) {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
            chartInstanceRef.current = new ChartJS(chartRef.current, {
                type: 'line',
                data: chartData,
                options: chartOptions,
            });
        }

        return () => {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        };
    }, [activeTab, data]);

    const downloadChart = () => {
        if (chartInstanceRef.current) {
            const link = document.createElement('a');
            link.download = 'saao_report_chart.png';
            link.href = chartInstanceRef.current.toBase64Image();
            link.click();
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 bg-white shadow rounded-lg max-w-4xl">
            <div className="flex flex-col gap-4 sm:gap-6">
                {/* Search Dropdown */}
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search SAAO by name or mobile..."
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={() => setIsDropdownOpen(true)}
                    />
                    {isDropdownOpen && (
                        <div className="absolute top-10 left-0 right-0 bg-white shadow-lg border rounded max-h-60 overflow-y-auto z-10">
                            {filteredOptions.length === 0 ? (
                                <div className="p-3 text-gray-500 text-sm">No results found</div>
                            ) : (
                                filteredOptions.map((option, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelect(option)}
                                        className="p-3 hover:bg-blue-100 cursor-pointer text-sm truncate"
                                    >
                                        {option.name} - {option.mobileNumber}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Date Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full">
                        <label className="text-xs font-medium">Start Date</label>
                        <input type="date" className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-medium">End Date</label>
                        <input type="date" className="w-full p-2 border rounded text-sm" />
                    </div>
                    <button className="w-full sm:w-auto bg-[#166534] hover:bg-green-700 text-white px-4 py-2 h-10 mt-6 rounded text-sm">
                        Filter
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border rounded overflow-hidden">
                    <button
                        className={`flex-1 py-2 font-semibold text-sm ${activeTab === 'table' ? 'bg-slate-600  text-white' : 'bg-gray-100'}`}
                        onClick={() => setActiveTab('table')}
                    >
                        Table
                    </button>
                    <button
                        className={`flex-1 py-2 font-semibold text-sm ${activeTab === 'graph' ? 'bg-slate-600  text-white' : 'bg-gray-100'}`}
                        onClick={() => setActiveTab('graph')}
                    >
                        Graph
                    </button>
                </div>

                {/* Table Tab */}
                {activeTab === 'table' && (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border border-collapse text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-2 sm:px-4 py-2 border">Date</th>
                                    <th className="px-2 sm:px-4 py-2 border">
                                        Total Entries
                                        <button onClick={toggleSortOrder} className="ml-1 sm:ml-2 text-xs text-blue-500">
                                            {sortOrder === 'asc' ? '▲' : '▼'}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((item, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="px-2 sm:px-4 py-2 border">{item.date}</td>
                                        <td className="px-2 sm:px-4 py-2 border">{item.totalEntries}</td>
                                    </tr>
                                ))}
                                <tr className="text-center bg-blue-100 font-semibold">
                                    <td className="px-2 sm:px-4 py-2 border">TOTAL</td>
                                    <td className="px-2 sm:px-4 py-2 border">
                                        {sortedData.reduce((sum, item) => sum + item.totalEntries, 0)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Graph Tab */}
                {activeTab === 'graph' && (
                    <div className="mt-4 sm:mt-6  rounded shadow-md">
                        <div className="flex justify-between items-center mb-4 px-4">
                            <h3 className="text-base sm:text-lg font-bold text-gray-700">Entries Over Time</h3>
                            <button
                                onClick={downloadChart}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-sm"
                            >
                                Download
                            </button>
                        </div>
                        <div className="h-64 sm:h-80">
                            <canvas ref={chartRef} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;