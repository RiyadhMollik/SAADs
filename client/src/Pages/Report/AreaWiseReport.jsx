import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent';

function AreaWiseReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationType, setLocationType] = useState('upazila');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const locationTypes = ['upazila', 'district', 'division', 'region', 'hotspot'];

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate) return; 
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://iinms.brri.gov.bd/api/reports/area-wise-counts', {
          params: { startDate, endDate, locationType },
        });
        console.log(response);
        
        setChartData(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate, locationType]);

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row mb-4 gap-2">
        <div className="flex flex-col w-full sm:w-1/2">
          <label className="text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            className="border p-2 rounded-md shadow-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]} 
          />
        </div>
        <div className="flex flex-col w-full sm:w-1/2">
          <label className="text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            className="border p-2 rounded-md shadow-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]} 
            min={startDate}
          />
        </div>
        <div className="flex flex-col w-full sm:w-1/2">
          <label className="text-sm text-gray-600 mb-1">Location Type</label>
          <select
            className="border p-2 rounded-md shadow-md"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
          >
            {locationTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ChartComponent data={chartData} locationType={locationType} />
    </div>
  );
}

export default AreaWiseReport;