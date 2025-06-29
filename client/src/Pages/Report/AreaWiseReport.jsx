import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent';

function AreaWiseReport() {
  const [date, setDate] = useState('');
  const [locationType, setLocationType] = useState('upazila');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const locationTypes = ['upazila', 'district', 'division', 'region', 'hotspot'];

  // Fetch data when date or locationType changes
  useEffect(() => {
    const fetchData = async () => {
      if (!date) return; // Skip fetch if no date is selected
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://iinms.brri.gov.bd/api/reports/area-wise-counts', {
          params: { date, locationType },
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
  }, [date, locationType]);

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row mb-4">
        <input
          type="date"
          className="mr-2 mb-2 sm:mb-0 border w-full sm:w-1/2 p-2 rounded-md shadow-md"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]} // Prevent future dates
        />
        <select
          className="border w-full sm:w-1/2 p-2 rounded-md shadow-md"
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
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ChartComponent data={chartData} locationType={locationType} />
    </div>
  );
}

export default AreaWiseReport;