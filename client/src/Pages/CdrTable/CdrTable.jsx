import React, { useEffect, useState, useRef } from 'react';
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaFileCsv,
  FaFilePdf,
} from 'react-icons/fa';
import { Parser } from '@json2csv/plainjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '/logo.png'; // Ensure the logo is available in your project
import bookAntiqua from './book-antiqua.ttf';
const CdrTable = () => {
  const [cdrData, setCdrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    destination: '',
    status: '',
    source: '',
    location: '',
    problem: '',
    startDate: '',
    endDate: '',
  });
  const tableRef = useRef(null);

  const columns = [
    { name: 'Date', visible: true },
    { name: 'Source', visible: true },
    { name: 'Ring Group', visible: true },
    { name: 'Destination', visible: true },
    { name: 'Src. Channel', visible: true },
    { name: 'Account Code', visible: true },
    { name: 'Dst. Channel', visible: true },
    { name: 'Status', visible: true },
    { name: 'Duration', visible: true },
    { name: 'Location', visible: true },
    { name: 'Problem', visible: true },
  ];

  const columnKeyMap = {
    'Date': 'date',
    'Source': 'source',
    'Ring Group': 'ring_group',
    'Destination': 'destination',
    'Src. Channel': 'src_channel',
    'Account Code': 'account_code',
    'Dst. Channel': 'dst_channel',
    'Status': 'status',
    'Duration': 'duration',
    'Location': 'name',
    'Problem': 'address',
  };

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters,
      });
      const res = await fetch(`https://iinms.brri.gov.bd/api/cdr?${params}`);
      const result = await res.json();
      setCdrData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to fetch CDR data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (id, field, value) => {
    setCdrData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    try {
      await fetch(`https://iinms.brri.gov.bd/api/cdr/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchData(newPage);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData(1);
  };

  const handleExportCSV = () => {
    try {
      const visibleColumns = columns.filter((col) => col.visible);

      const fields = visibleColumns.map((col) => ({
        label: col.name,
        value: col.name.toLowerCase().replace(/\s+/g, ''),
      }));

      const data = cdrData.map((row, index) => {
        const rowData = {};
        visibleColumns.forEach((col) => {
          const keyAlias = col.name.toLowerCase().replace(/\s+/g, '');
          const actualKey = columnKeyMap[col.name];
          if (col.name === 'Date') {
            rowData[keyAlias] = new Date(row.date).toLocaleString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
          } else {
            rowData[keyAlias] = actualKey ? row[actualKey] || '' : '';
          }
        });
        return rowData;
      });

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'call_history.csv';
      link.click();
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
      const loadFont = async (url) => {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        return base64;
      };

      const bookAntiquaBase64 = await loadFont(bookAntiqua);

      // Register the font with jsPDF
      doc.addFileToVFS("Book-Antiqua.ttf", bookAntiquaBase64);
      doc.addFont("Book-Antiqua.ttf", "BookAntiqua", "normal");
      doc.setFont("BookAntiqua", "normal");
      doc.setFontSize(12);

      const visibleColumns = columns.filter((col) => col.visible);

      const headers = visibleColumns.map((col) => col.name);

      const data = cdrData.map((row) =>
        visibleColumns.map((col) => {
          const key = columnKeyMap[col.name];
          if (col.name === 'Date') {
            return new Date(row.date).toLocaleString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
          }
          return key ? row[key] || '' : '';
        })
      );
      autoTable(doc, {
        startY: 40,
        head: [headers],
        body: data,
        theme: 'grid',
        styles: {
          font: "BookAntiqua",
          fontSize: 5,
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
        margin: { top: 40, left: margin, right: margin, bottom: 20 },
        didDrawPage: (data) => {
          doc.addImage(logo, 'PNG', margin, 15, 15, 15);
          doc.setFontSize(10);
          doc.setTextColor(50);
          doc.setFont("BookAntiqua", 'bold');
          doc.text('Agrometeorology, Crop Modeling and Climate Change Research Laboratory (Agromet Lab)', margin + 18, 15);
          doc.text('Bangladesh Rice Research Institute (BRRI), Gazipur-1701', margin + 18, 20);
          doc.setFontSize(10);
          doc.setTextColor(50);
          doc.setFont("BookAntiqua", 'normal');
          doc.text('Email: info.brriagromet@gmail.com', margin + 18, 25);
          doc.text('Hotline: 09644300300', margin + 18, 35);
          doc.text('Website: iras.brri.gov.bd', margin + 18, 30);
          
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
          doc.setFont("BookAntiqua", 'normal');
          doc.text(formattedDate, pageWidth - margin, 35, { align: 'right' });

          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
          doc.text('© 2025 Smart Agro-Advisory Dissemination System.', margin, pageHeight - 6);
          doc.text('Generated by: Admin', pageWidth - margin, pageHeight - 6, { align: 'right' });
        },
      });

      doc.save('call_history.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'answered':
        return 'bg-green-100 text-green-800';
      case 'no answer':
        return 'bg-red-100 text-red-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Call History Dashboard</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleExportCSV}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
              title="Export to CSV"
            >
              <FaFileCsv size={20} className="mr-1" /> CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center"
              title="Export to PDF"
            >
              <FaFilePdf size={20} className="mr-1" /> PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="text"
              name="destination"
              value={filters.destination}
              onChange={handleFilterChange}
              placeholder="Destination"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="text"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              placeholder="Status"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="text"
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              placeholder="Source"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="text"
              name="problem"
              value={filters.problem}
              onChange={handleFilterChange}
              placeholder="Problem"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        ) : cdrData.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No call data found.</p>
        ) : (
          <div className="overflow-x-auto" ref={tableRef}>
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-indigo-600 text-white text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Ring Group</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Src. Channel</th>
                  <th className="px-4 py-3">Account Code</th>
                  <th className="px-4 py-3">Dst. Channel</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Problem</th>
                </tr>
              </thead>
              <tbody>
                {cdrData.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(row.date).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">{row.source}</td>
                    <td className="px-4 py-3">{row.ring_group || '-'}</td>
                    <td className="px-4 py-3">{row.destination}</td>
                    <td className="px-4 py-3">{row.src_channel}</td>
                    <td className="px-4 py-3">{row.account_code}</td>
                    <td className="px-4 py-3">{row.dst_channel}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          row.status || ''
                        )}`}
                      >
                        {row.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row.duration}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={row.name || ''}
                        onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={row.address || ''}
                        onChange={(e) => handleInputChange(row.id, 'address', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-4 text-gray-700">
          <button
            aria-label="First Page"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
            onClick={() => handlePageChange(1)}
            disabled={pagination.page <= 1}
          >
            <FaAngleDoubleLeft size={20} />
          </button>
          <button
            aria-label="Previous Page"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <FaAngleLeft size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <span>Page</span>
            <input
              type="number"
              className="w-16 text-center p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={pagination.page}
              min={1}
              max={pagination.totalPages}
              onChange={(e) => handlePageChange(Number(e.target.value))}
            />
            <span>of {pagination.totalPages}</span>
          </div>
          <button
            aria-label="Next Page"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <FaAngleRight size={20} />
          </button>
          <button
            aria-label="Last Page"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <FaAngleDoubleRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CdrTable;