import React, { useState, useEffect } from 'react';

const WeatherStation = () => {
  const [measures, setMeasures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetch('https://iinms.brri.gov.bd/api/aws/measures')
      .then(response => response.json())
      .then(data => setMeasures(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedMeasures = [...measures].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setMeasures(sortedMeasures);
  };

  const filteredMeasures = measures.filter(m =>
    m.station_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.station_id?.toString().includes(searchTerm) ||
    m.measure?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Weather Station Dashboard</h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by station name, ID, or measure..."
            className="w-full max-w-md p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-200 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  {['id', 'station_id', 'station_name', 'state', 'type', 'power_save', 'latest_data', 'measure', 'trend', 'delta_h', 'unit', 'date_value', 'alarm', 'last_value'].map((key) => (
                    <th key={key} className="px-6 py-4 cursor-pointer hover:bg-gray-300 transition-colors" onClick={() => handleSort(key)}>
                      <div className="flex items-center">
                        {key.replace('_', ' ')}
                        <span className="ml-2">
                          {sortConfig.key === key ? (
                            sortConfig.direction === 'asc' ? '↑' : '↓'
                          ) : '↕'}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMeasures.map((m) => (
                  <tr key={m.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{m.id}</td>
                    <td className="px-6 py-4">{m.station_id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{m.station_name}</td>
                    <td className="px-6 py-4">{m.state}</td>
                    <td className="px-6 py-4">{m.type}</td>
                    {/* <td className="px-6 py-4">{m.network}</td>
                    <td className="px-6 py-4">{m.owner || '-'}</td> */}
                    <td className="px-6 py-4">{m.power_save}</td>
                    <td className="px-6 py-4">{m.latest_data}</td>
                    <td className="px-6 py-4">{m.measure}</td>
                    <td className="px-6 py-4">
                      {m.trend === '▲' ? (
                        <span className="text-red-500 font-bold">▲</span>
                      ) : m.trend === '▼' ? (
                        <span className="text-green-500 font-bold">▼</span>
                      ) : m.trend === '→' ? (
                        <span className="text-gray-500 font-bold">→</span>
                      ) : (
                        m.trend || '-'
                      )}
                    </td>
                    <td className="px-6 py-4">{m.delta_h || '-'}</td>
                    <td className="px-6 py-4">{m.unit}</td>
                    <td className="px-6 py-4">{m.date_value || '-'}</td>
                    <td className="px-6 py-4">{m.alarm || '-'}</td>
                    <td className="px-6 py-4">{m.last_value || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherStation;