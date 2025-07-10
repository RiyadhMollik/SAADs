import React, { useEffect, useState } from 'react';
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from 'react-icons/fa';

const CdrTable = () => {
  const [cdrData, setCdrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`https://iinms.brri.gov.bd/api/cdr?page=${page}&limit=10`);
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

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'answered':
        return 'bg-green-100 text-green-700';
      case 'no answer':
        return 'bg-red-100 text-red-700';
      case 'busy':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Call History</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        ) : cdrData.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No call data found.</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="bg-purple-700 text-white text-xs uppercase">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Ring Group</th>
                <th className="px-3 py-2">Destination</th>
                <th className="px-3 py-2">Src. Channel</th>
                <th className="px-3 py-2">Account Code</th>
                <th className="px-3 py-2">Dst. Channel</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Duration</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {cdrData.map((row) => (
                <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(row.date).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="px-3 py-2">{row.source}</td>
                  <td className="px-3 py-2">{row.ring_group || '-'}</td>
                  <td className="px-3 py-2">{row.destination}</td>
                  <td className="px-3 py-2">{row.src_channel}</td>
                  <td className="px-3 py-2">{row.account_code}</td>
                  <td className="px-3 py-2">{row.dst_channel}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClass(
                        row.status || ''
                      )}`}
                    >
                      {row.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2">{row.duration}</td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                      value={row.name || ''}
                      onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                      value={row.address || ''}
                      onChange={(e) => handleInputChange(row.id, 'address', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Custom Pagination UI */}
        <div className="flex justify-center items-center mt-4 space-x-2 text-gray-700">
          <button
            aria-label="First Page"
            className="disabled:opacity-30"
            onClick={() => handlePageChange(1)}
            disabled={pagination.page <= 1}
          >
            <FaAngleDoubleLeft size={18} />
          </button>
          <button
            aria-label="Previous Page"
            className="disabled:opacity-30"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <FaAngleLeft size={18} />
          </button>
          <span>Page</span>
          <input
            type="number"
            className="w-12 text-center border rounded"
            value={pagination.page}
            min={1}
            max={pagination.totalPages}
            onChange={(e) => handlePageChange(Number(e.target.value))}
          />
          <span>of {pagination.totalPages}</span>
          <button
            aria-label="Next Page"
            className="disabled:opacity-30"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <FaAngleRight size={18} />
          </button>
          <button
            aria-label="Last Page"
            className="disabled:opacity-30"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <FaAngleDoubleRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CdrTable;
