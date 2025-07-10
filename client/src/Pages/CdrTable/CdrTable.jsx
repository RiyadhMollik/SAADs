import React, { useEffect, useState } from 'react';

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
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📞 Call History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Source</th>
                <th className="p-2 border">Destination</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Address</th>
              </tr>
            </thead>
            <tbody>
              {cdrData.map((row) => (
                <tr key={row.id} className="text-sm border-t">
                  <td className="p-2 border">{new Date(row.date).toLocaleString()}</td>
                  <td className="p-2 border">{row.source}</td>
                  <td className="p-2 border">{row.destination}</td>
                  <td className="p-2 border">{row.status}</td>
                  <td className="p-2 border">{row.duration}</td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      className="border px-2 py-1 w-full rounded"
                      value={row.name || ''}
                      onChange={(e) =>
                        handleInputChange(row.id, 'name', e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      className="border px-2 py-1 w-full rounded"
                      value={row.address || ''}
                      onChange={(e) =>
                        handleInputChange(row.id, 'address', e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={pagination.page <= 1}
          onClick={() => fetchData(pagination.page - 1)}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => fetchData(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CdrTable;
