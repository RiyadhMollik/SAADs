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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    ChartDataLabels
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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
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
                const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/stats/${selectedOption.id}?startDate=${startDate}&endDate=${endDate}`);
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

    const handleFilter = () => {
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            alert('Start date cannot be after end date');
            return;
        }
        setRefresh(!refresh);
    };

    const sortedData = [...data].sort((a, b) => sortOrder === 'asc' ? a.age - b.age : b.age - a.age);
    const toggleSortOrder = () => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

    const labels = data.map(item => item.date);
    const values = data.map(item => item.totalEntries);

    const calculateStepSize = (values) => {
        if (!values.length) return 1;
        const max = Math.max(...values);
        return Math.ceil(max / 5);
    };

    const chartData = {
        labels,
        datasets: [
            {
                label: '',
                data: values,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                tension: 0.3,
                pointBackgroundColor: 'rgba(75,192,192,1)',
                pointRadius: 3,
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
                ticks: {
                    font: { size: 10 },
                    stepSize: calculateStepSize(values),
                    beginAtZero: true,
                },
                grid: {
                    drawTicks: true,
                },
            },
        },
        plugins: {
            legend: { display: false },
            datalabels: {
                display: false,
                anchor: 'end',
                align: 'start',
                offset: 6,
                font: {
                    size: 12,
                    weight: 'bold'
                },
                color: '#333',
                formatter: (value) => value
            }
        },
    };

    useEffect(() => {
        if (activeTab === 'graph' && chartRef.current) {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
            chartInstanceRef.current = new ChartJS(chartRef.current, {
                type: 'line',
                data: chartData,
                options: chartOptions,
                plugins: [ChartDataLabels]
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

    const handleExportCSV = () => {
        try {
            const headers = ['Date', 'Total Entries'];
            const csvData = sortedData.map(item => [
                item.date || '-',
                item.totalEntries || 0
            ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','));

            csvData.push([
                'TOTAL',
                sortedData.reduce((sum, item) => sum + item.totalEntries, 0)
            ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','));

            const csvContent = [
                headers.map(header => `"${header}"`).join(','),
                ...csvData
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'saao_report.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('CSV export failed:', error);
            alert('Failed to export CSV. Please try again.');
        }
    };

    const handleExportPDF = async () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 12;

            // Preload the logo image as base64
            let logoBase64 = null;
            try {
                const response = await fetch('/logo.png');
                if (!response.ok) throw new Error('Failed to fetch logo');
                const blob = await response.blob();
                logoBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error){
                console.warn('Failed to load logo image:', error);
                // Proceed without the logo
            }

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            const date = new Date();
            const formattedDate = date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            const headers = ['Date', 'Total Entries'];
            const tableData = sortedData.map(item => [
                item.date || '-',
                item.totalEntries || 0
            ]);

            tableData.push([
                'TOTAL',
                sortedData.reduce((sum, item) => sum + item.totalEntries, 0)
            ]);

            const equalWidth = (pageWidth - margin * 2) / headers.length;
            const columnStyles = headers.reduce((styles, _, i) => {
                styles[i] = { cellWidth: equalWidth };
                return styles;
            }, {});

            autoTable(doc, {
                startY: 40,
                head: [headers],
                body: tableData,
                theme: 'grid',
                styles: {
                    font: "helvetica",
                    fontSize: 8,
                    cellPadding: 2,
                    textColor: [50, 50, 50],
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245],
                },
                columnStyles,
                margin: { top: 40, left: margin, right: margin, bottom: 20 },
                didDrawPage: (data) => {
                    // Add logo only if successfully loaded
                    if (logoBase64) {
                        try {
                            doc.addImage(logoBase64, 'PNG', margin, 16, 15, 15);
                        } catch (imgError) {
                            console.warn('Failed to add logo to PDF:', imgError);
                        }
                    }
                    doc.setFontSize(12);
                    doc.setTextColor(50);
                    doc.setFont("helvetica", "bold");
                    doc.text("Bangladesh Rice Research Institute (BRRI)", margin + (logoBase64 ? 18 : 0), 15);
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text("Gazipur-1701", margin + (logoBase64 ? 18 : 0), 20);
                    doc.text("Contact Agromet Lab", margin + (logoBase64 ? 18 : 0), 25);
                    doc.setFontSize(10);
                    doc.setTextColor(50);
                    doc.setFont("helvetica", "normal");
                    doc.text("Email: info.brriagromet@gmail.com", margin + (logoBase64 ? 18 : 0), 30);
                    doc.text("Mobile: 09644300300", margin + (logoBase64 ? 18 : 0), 35);
                    doc.text(formattedDate, pageWidth - margin, 35, { align: "right" });

                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(100);
                    doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 12, { align: "center" });
                    doc.text("© 2025 Smart Agro-Advisory Dissemination System.", margin, pageHeight - 6);
                },
            });

            doc.save("saao_report.pdf");
        } catch (error) {
            console.error("PDF export failed:", error);
            alert("Failed to export PDF. Please try again.");
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

                {/* Date Filter and Export Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-full">
                        <label className="text-xs font-medium">Start Date</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded text-sm"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-medium">End Date</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded text-sm"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 sm:gap-4 w-full sm:w-auto mt-6 sm:mt-0">
                        <button
                            onClick={handleFilter}
                            className="w-full mt-6 sm:w-auto bg-[#166534] hover:bg-green-700 text-white px-4 py-2 h-10 rounded text-sm"
                            aria-label="Apply date filter"
                        >
                            Filter
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="w-full mt-6 sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-10 rounded text-sm"
                            aria-label="Export table to CSV"
                        >
                             CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="w-full mt-6 sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 h-10 rounded text-sm"
                            aria-label="Export table to PDF"
                        >
                           PDF
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border rounded overflow-hidden">
                    <button
                        className={`flex-1 py-2 font-semibold text-sm ${activeTab === 'table' ? 'bg-slate-600 text-white' : 'bg-gray-100'}`}
                        onClick={() => setActiveTab('table')}
                    >
                        Table
                    </button>
                    <button
                        className={`flex-1 py-2 font-semibold text-sm ${activeTab === 'graph' ? 'bg-slate-600 text-white' : 'bg-gray-100'}`}
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
                    <div className="mt-4 sm:mt-6 rounded shadow-md">
                        <div className="flex justify-between items-center mb-4 px-4">
                            <h3 className="text-base sm:text-lg font-bold text-gray-700">Entries Over Time</h3>
                            <button
                                onClick={downloadChart}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-sm"
                                aria-label="Download chart as PNG"
                            >
                                Download
                            </button>
                        </div>
                        <div className="h-64 sm:h-80 p-2">
                            <canvas ref={chartRef} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;