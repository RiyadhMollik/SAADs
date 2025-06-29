import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '/logo.png';
function SaaoUserReport() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedHotspot, setSelectedHotspot] = useState('');
    const API_URL = 'https://iinms.brri.gov.bd/api';

    // Fetch data
    useEffect(() => {
        const fetchUserCounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/reports/saao-user-counts`);
                setData(response.data.data || []);
                setFilteredData(response.data.data || []);
                setTotalCount(response.data.totalFarmerCount || 0);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch user counts');
                setData([]);
                setFilteredData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUserCounts();
    }, []);

    // Search functionality
    useEffect(() => {
        let result = [...data];

        // Apply search
        if (searchTerm) {
            result = result.filter(user =>
                Object.values(user).some(val =>
                    val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Apply hotspot filter
        if (selectedHotspot) {
            result = result.filter(user => {
                const hotspotList = Array.isArray(user.hotspot)
                    ? user.hotspot
                    : typeof user.hotspot === 'string'
                        ? (() => {
                            try {
                                return JSON.parse(user.hotspot);
                            } catch {
                                return [];
                            }
                        })()
                        : [];

                return hotspotList.includes(selectedHotspot);
            });
        }

        setFilteredData(result);
    }, [searchTerm, selectedHotspot, data]);

    // Sort functionality
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...filteredData].sort((a, b) => {
            const aValue = a[key] || '';
            const bValue = b[key] || '';

            if (key === 'farmerCount') {
                return direction === 'asc'
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            }

            return direction === 'asc'
                ? aValue.toString().localeCompare(bValue.toString())
                : bValue.toString().localeCompare(aValue.toString());
        });

        setFilteredData(sortedData);
    };

    // Get unique hotspots
    const uniqueHotspots = [
        ...new Set(
            data
                .flatMap(user => {
                    if (Array.isArray(user.hotspot)) return user.hotspot;
                    if (typeof user.hotspot === 'string') {
                        try {
                            return JSON.parse(user.hotspot);
                        } catch {
                            return [];
                        }
                    }
                    return [];
                })
                .filter(Boolean)
        )
    ];


    // PDF export
    const handleExportPDF = () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 12;

            doc.setFont(undefined, "normal");
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

            // Prepare table data
            const headers = [
                '#', 'Name', 'Role', 'Mobile Number', 'Farmer Count',
                'Region', 'Block', 'Union', 'Upazila', 'District', 'Division', 'Hotspot'
            ];
            const tableData = filteredData.map((user, index) => [
                index + 1,
                user.name || '',
                user.role || '',
                user.mobileNumber || '',
                user.farmerCount || 0,
                user.region || '-',
                user.block || '-',
                user.union || '-',
                user.upazila || '-',
                user.district || '-',
                user.division || '-',
                user.hotspot || '-'
            ]);

            // Calculate equal column width
            const equalWidth = (pageWidth - margin * 2) / headers.length;
            const columnStyles = headers.reduce((styles, _, i) => {
                styles[i] = { cellWidth: equalWidth };
                return styles;
            }, {});

            // Generate table
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
                    // Header (repeated on every page)
                    doc.addImage(logo, 'PNG', margin, 16, 15, 15);
                    doc.setFontSize(12);
                    doc.setTextColor(50);
                    doc.setFont("helvetica", "bold");
                    doc.text("Bangladesh Rice Research Institute (BRRI)", margin + 18, 15);
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text("Gazipur-1701", margin + 18, 20);
                    doc.text("Contact Agromet Lab", margin + 18, 25);
                    doc.setFontSize(10);
                    doc.setTextColor(50);
                    doc.setFont(undefined, "normal");
                    doc.text("Email: info.brriagromet@gmail.com", margin + 18, 30);
                    doc.text("Mobile: 09644300300", margin + 18, 35);
                    doc.text(formattedDate, pageWidth - margin, 35, { align: "right" });

                    // Footer
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(100);
                    doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 12, { align: "center" });
                    doc.text("© 2025 Smart Agro-Advisory Dissemination System.", margin, pageHeight - 6);
                },
            });

            doc.save("saao-user-report.pdf");
        } catch (error) {
            console.error("PDF export failed:", error);
            alert("Failed to export PDF. Please try again.");
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">SAAO User Report</h1>
                <button
                    onClick={handleExportPDF}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Export to PDF
                </button>
            </div>
            {/* Search and Filter */}
            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded w-full max-w-md"
                />
                <select
                    value={selectedHotspot}
                    onChange={(e) => setSelectedHotspot(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">All Hotspots</option>
                    {uniqueHotspots.map((hotspot) => (
                        <option key={hotspot} value={hotspot}>
                            {hotspot}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="overflow-x-auto">
                <table className="w-full bg-white border rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 border-b text-sm">
                            {['#', 'name', 'role', 'mobileNumber', 'farmerCount', 'region', 'block', 'union', 'upazila', 'district', 'division', 'hotspot'].map((key, index) => (
                                <th
                                    key={key}
                                    className="p-3 text-left cursor-pointer"
                                    onClick={() => key !== '#' && handleSort(key)}
                                >
                                    {key === '#' ? '#' : key.charAt(0).toUpperCase() + key.slice(1)}
                                    {sortConfig.key === key && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((user, index) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50 text-sm">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">{user.mobileNumber}</td>
                                    <td className="p-3">{user.farmerCount}</td>
                                    <td className="p-3">{user.region || '-'}</td>
                                    <td className="p-3">{user.block || '-'}</td>
                                    <td className="p-3">{user.union || '-'}</td>
                                    <td className="p-3">{user.upazila || '-'}</td>
                                    <td className="p-3">{user.district || '-'}</td>
                                    <td className="p-3">{user.division || '-'}</td>
                                    <td className="p-3">
                                        {
                                            (() => {
                                                try {
                                                    const h = Array.isArray(user.hotspot)
                                                        ? user.hotspot
                                                        : typeof user.hotspot === 'string'
                                                            ? JSON.parse(user.hotspot)
                                                            : [];
                                                    return h.length ? h.join(', ') : '-';
                                                } catch (e) {
                                                    return '-';
                                                }
                                            })()
                                        }
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="p-3 text-center">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SaaoUserReport;