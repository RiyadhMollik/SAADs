import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function SaaoUserReport() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedHotspot, setSelectedHotspot] = useState('');
    const [roles, setRoles] = useState([]);
    const API_URL = 'https://iinms.brri.gov.bd/api';
    const [totalWitnNid , setTotalWitnNid] = useState(0);
    const [totalWithoutNid , setTotalWithoutNid] = useState(0);
    // Fetch all hotspots
    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${API_URL}/hotspots`);
            const data = response.data.reverse();
            setRoles(data);
        } catch (error) {
            console.error("Error fetching hotspots:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);
    useEffect(() => {
        const fetchUserCounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams();
                if (selectedHotspot) queryParams.append('hotspot', selectedHotspot);

                const response = await axios.get(`${API_URL}/reports/saao-user-counts?${queryParams}`);
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
    }, [selectedHotspot]);

    useEffect(() => {
        let result = [...data];

        if (searchTerm) {
            result = result.filter(user =>
                Object.values(user).some(val =>
                    val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        setFilteredData(result);
        const total = result.reduce((sum, item) => sum + item.farmerCount, 0);
        const totalWithoutNid = result.reduce((sum, item) => sum + item.withoutNationalIdCount, 0);
        const totalwithNid = result.reduce((sum, item) => sum + item.withNationalIdCount, 0);
        setTotalWitnNid(totalwithNid);
        setTotalWithoutNid(totalWithoutNid);
        setTotalCount(total);
    }, [searchTerm, data]);

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

    const handleExportCSV = () => {
        try {
            const headers = [
                'ID', 'Name', 'Role', 'Hotspot', 'Region', 'Division', 'District',
                'Upazila', 'Union', 'Block', 'Mobile Number', 'Total Farmer', 'With Nid', 'Without Nid'
            ];

            const csvData = filteredData.map(user => {
                const hotspot = Array.isArray(user.hotspot)
                    ? user.hotspot.join(', ')
                    : typeof user.hotspot === 'string'
                        ? (() => {
                            try {
                                return JSON.parse(user.hotspot).join(', ');
                            } catch {
                                return user.hotspot || '-';
                            }
                        })()
                        : '-';

                return [
                    user.id || '-',
                    user.name || '-',
                    user.role || '-',
                    hotspot,
                    user.region || '-',
                    user.division || '-',
                    user.district || '-',
                    user.upazila || '-',
                    user.union || '-',
                    user.block || '-',
                    user.mobileNumber || '-',
                    user.farmerCount || 0,
                    user.withNationalIdCount || 0,
                    user.withoutNationalIdCount || 0
                ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',');
            });

            csvData.push([
                '', '', '', '', '', '', '', '', '', '', 'Total:', totalCount , totalWitnNid, totalWithoutNid
            ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','));

            const csvContent = [
                headers.map(header => `"${header}"`).join(','),
                ...csvData
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'saao-user-report.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("CSV export failed:", error);
            alert("Failed to export CSV. Please try again.");
        }
    };

    const handleExportPDF = async () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 12;

            let logoBase64 = null;
            try {
                const response = await fetch('/logo.png');
                const blob = await response.blob();
                logoBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.warn('Failed to load logo image:', error);
            }

            doc.setFont(undefined, "normal");
            doc.setFontSize(12);
            const date = new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            const headers = [
                'ID', 'Name', 'Role', 'Hotspot', 'Region', 'Division', 'District',
                'Upazila', 'Union', 'Block', 'Mobile Number', 'Total Farmer', 'With Nid', 'Without Nid'
            ];

            const tableData = filteredData.map((user, index) => [
                index + 1,
                user.name || '-',
                user.role || '-',
                (() => {
                    try {
                        const h = Array.isArray(user.hotspot)
                            ? user.hotspot
                            : typeof user.hotspot === 'string'
                                ? JSON.parse(user.hotspot)
                                : [];
                        return h.length ? h.join(', ') : '-';
                    } catch {
                        return '-';
                    }
                })(),
                user.region || '-',
                user.division || '-',
                user.district || '-',
                user.upazila || '-',
                user.union || '-',
                user.block || '-',
                user.mobileNumber || '-',
                user.farmerCount || 0,
                user.withNationalIdCount || 0,
                user.withoutNationalIdCount || 0
            ]);

            tableData.push(['', '', '', '', '', '', '', '', '', 'Total:', totalCount , totalWitnNid, totalWithoutNid]);

            const equalWidth = (pageWidth - margin * 2) / headers.length;
            const columnStyles = headers.reduce((acc, _, i) => {
                acc[i] = { cellWidth: equalWidth };
                return acc;
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
                    if (logoBase64) {
                        try {
                            doc.addImage(logoBase64, 'PNG', margin, 16, 15, 15);
                        } catch (err) {
                            console.warn('Logo rendering failed:', err);
                        }
                    }

                    doc.setFontSize(12);
                    doc.setTextColor(50);
                    doc.setFont("helvetica", "bold");
                    doc.text("Bangladesh Rice Research Institute (BRRI)", margin + 18, 15);
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text("Gazipur-1701", margin + 18, 20);
                    doc.text("Contact Agromet Lab", margin + 18, 25);
                    doc.setFont(undefined, "normal");
                    doc.setTextColor(50);
                    doc.text("Email: info.brriagromet@gmail.com", margin + 18, 30);
                    doc.text("Mobile: 09644300300", margin + 18, 35);
                    doc.text(date, pageWidth - margin, 35, { align: "right" });

                    doc.setFontSize(8);
                    doc.setTextColor(100);
                    doc.text(`Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`, pageWidth / 2, pageHeight - 12, { align: "center" });
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
        <div className="p-2 sm:p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2 sm:mb-4 gap-2 sm:gap-4">
                <h1 className="text-lg sm:text-2xl font-bold">SAAO User Report</h1>
            </div>

            <div className="mb-2 sm:mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center md:justify-between">
                <div className='flex gap-2 sm:gap-4'>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-1 sm:p-2 border rounded w-full sm:max-w-md text-sm sm:text-base"
                    />
                    <select
                        value={selectedHotspot}
                        onChange={(e) => setSelectedHotspot(e.target.value)}
                        className="p-1 sm:p-2 border rounded text-sm sm:text-base"
                    >
                        <option value="">Hotspots</option>
                        {roles.map(h => (
                            <option key={h.id} value={h.name}>{h.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 sm:gap-4">
                    <button
                        onClick={handleExportCSV}
                        className="p-1 sm:p-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
                    >
                        CSV
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="p-1 sm:p-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm sm:text-base"
                    >
                        PDF
                    </button>
                </div>
            </div>

            {loading && <p className="text-gray-500 text-sm">Loading...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="overflow-x-auto">
                <table className="w-full bg-white border rounded-lg shadow-md text-sm sm:text-base">
                    <thead>
                        <tr className="bg-slate-600 text-white border-b capitalize">
                            {['id', 'name', 'role', 'hotspot', 'region', 'division', 'district', 'upazila', 'union', 'block', 'mobileNumber', 'farmerCount', 'withNationalIdCount', 'withoutNationalIdCount'].map((key) => (
                                <th
                                    key={key}
                                    className="p-1 sm:p-3 text-left cursor-pointer"
                                    onClick={() => key !== 'id' && handleSort(key)}
                                >
                                    {key === 'id' ? 'ID' :
                                        key === 'farmerCount' ? 'Total Farmer' :
                                            key === 'withNationalIdCount' ? 'With National ID' :
                                                key === 'withoutNationalIdCount' ? 'Without National ID' :
                                            key.charAt(0).toUpperCase() + key.slice(1)}
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
                            <>
                                {filteredData.map((user, index) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="p-1 sm:p-3">{index + 1}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.name || '-'}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.role || '-'}</td>
                                        <td className="p-1 sm:p-3 capitalize">
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
                                        <td className="p-1 sm:p-3 capitalize">{user.region || '-'}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.division || '-'}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.district || '-'}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.upazila || '-'}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.union || '-'}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.block || '-'}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.mobileNumber || '-'}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.farmerCount || 0}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.withNationalIdCount || 0}</td>
                                        <td className="p-1 sm:p-3 capitalize">{user.withoutNationalIdCount || 0}</td>
                                    </tr>
                                ))}
                                <tr className="border-t font-bold bg-slate-600 text-white">
                                    <td colSpan="11" className="p-1 sm:p-3 text-right">Total:</td>
                                    <td className="p-1 sm:p-3">{totalCount}</td>
                                    <td className="p-1 sm:p-3">{totalWitnNid}</td>
                                    <td className="p-1 sm:p-3">{totalWithoutNid}</td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan="12" className="p-1 sm:p-3 text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SaaoUserReport;
