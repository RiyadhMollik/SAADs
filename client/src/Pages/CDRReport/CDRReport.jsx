import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import dayjs from 'dayjs';
import axios from 'axios';
import Papa from 'papaparse';

const CDRReport = () => {
  const [cdrData, setCdrData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for demonstration - replace with actual API call
  const sampleData = [
    { id: 1, date: '2024-01-01', source: '+8801712345678', destination: '+8801812345678', status: 'ANSWERED', duration: '120', address: 'Dhaka, Bangladesh', ring_group: 'Group A', account_code: 'ACC001' },
    { id: 2, date: '2024-01-01', source: '+8801723456789', destination: '+8801823456789', status: 'NO ANSWER', duration: '0', address: 'Chittagong, Bangladesh', ring_group: 'Group B', account_code: 'ACC002' },
    { id: 3, date: '2024-01-02', source: '+8801734567890', destination: '+8801834567890', status: 'ANSWERED', duration: '180', address: 'Sylhet, Bangladesh', ring_group: 'Group A', account_code: 'ACC003' },
    { id: 4, date: '2024-01-02', source: '+8801745678901', destination: '+8801845678901', status: 'BUSY', duration: '0', address: 'Rajshahi, Bangladesh', ring_group: 'Group C', account_code: 'ACC004' },
    { id: 5, date: '2024-01-03', source: '+8801756789012', destination: '+8801856789012', status: 'ANSWERED', duration: '90', address: 'Khulna, Bangladesh', ring_group: 'Group B', account_code: 'ACC005' },
    { id: 6, date: '2024-01-03', source: '+8801767890123', destination: '+8801867890123', status: 'NO ANSWER', duration: '0', address: 'Barisal, Bangladesh', ring_group: 'Group A', account_code: 'ACC006' },
    { id: 7, date: '2024-01-04', source: '+8801778901234', destination: '+8801878901234', status: 'ANSWERED', duration: '240', address: 'Rangpur, Bangladesh', ring_group: 'Group C', account_code: 'ACC007' },
    { id: 8, date: '2024-01-04', source: '+8801789012345', destination: '+8801889012345', status: 'BUSY', duration: '0', address: 'Mymensingh, Bangladesh', ring_group: 'Group B', account_code: 'ACC008' },
  ];

  useEffect(() => {
    fetchCdrData();
  }, []);

  const fetchCdrData = async () => {
    try {
      setLoading(true);
      const startDate = dayjs(dateRange[0].startDate).format('YYYY-MM-DD');
      const endDate = dayjs(dateRange[0].endDate).format('YYYY-MM-DD');
      
      const response = await axios.get(`https://iinms.brri.gov.bd/api/cdr/report`, {
        params: {
          startDate,
          endDate,
          status: selectedFilter !== 'all' ? selectedFilter : '',
          limit: 1000
        }
      });

      if (response.data.success) {
        setCdrData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        // Fallback to sample data if API fails
        setCdrData(sampleData);
        setFilteredData(sampleData);
      }
    } catch (error) {
      console.error('Error fetching CDR data:', error);
      // Fallback to sample data
      setCdrData(sampleData);
      setFilteredData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = filteredData.map(item => ({
      Date: dayjs(item.date).format('YYYY-MM-DD HH:mm:ss'),
      Source: item.source,
      Destination: item.destination,
      Status: item.status,
      Duration: item.duration,
      Address: item.address,
      'Ring Group': item.ring_group,
      'Account Code': item.account_code,
      'Unique ID': item.uniqueid,
      'User Field': item.user_field,
      Name: item.name
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cdr_report_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    filterData();
  }, [cdrData, searchTerm]);

  useEffect(() => {
    fetchCdrData();
  }, [dateRange, selectedFilter]);

  const filterData = () => {
    let filtered = [...cdrData];

    // Search filter only (date and status are handled by API)
    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.source && item.source.includes(searchTerm)) ||
        (item.destination && item.destination.includes(searchTerm)) ||
        (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.ring_group && item.ring_group.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredData(filtered);
  };

  // Chart data preparation
  const getStatusDistribution = () => {
    const statusCount = {};
    filteredData.forEach(item => {
      statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([status, count]) => ({ name: status, value: count }));
  };

  const getDestinationTrend = () => {
    const dailyCount = {};
    filteredData.forEach(item => {
      const date = dayjs(item.date).format('YYYY-MM-DD');
      dailyCount[date] = (dailyCount[date] || 0) + 1;
    });
    return Object.entries(dailyCount).map(([date, count]) => ({ date, count }));
  };

  const getDurationHistogram = () => {
    const durationRanges = {
      '0-30s': 0,
      '31-60s': 0,
      '61-120s': 0,
      '121-300s': 0,
      '300s+': 0
    };

    filteredData.forEach(item => {
      const duration = parseInt(item.duration || 0);
      if (isNaN(duration)) {
        durationRanges['0-30s']++; // Default to 0-30s for invalid durations
      } else if (duration <= 30) {
        durationRanges['0-30s']++;
      } else if (duration <= 60) {
        durationRanges['31-60s']++;
      } else if (duration <= 120) {
        durationRanges['61-120s']++;
      } else if (duration <= 300) {
        durationRanges['121-300s']++;
      } else {
        durationRanges['300s+']++;
      }
    });

    return Object.entries(durationRanges).map(([range, count]) => ({ range, count }));
  };

  const getAddressDistribution = () => {
    const addressCount = {};
    filteredData.forEach(item => {
      if (item.address && typeof item.address === 'string') {
        const city = item.address.split(',')[0];
        addressCount[city] = (addressCount[city] || 0) + 1;
      } else {
        // Handle null/undefined addresses
        addressCount['Unknown'] = (addressCount['Unknown'] || 0) + 1;
      }
    });
    return Object.entries(addressCount).map(([city, count]) => ({ city, count }));
  };

  const getStatistics = () => {
    const totalCalls = filteredData.length;
    const answeredCalls = filteredData.filter(item => item.status === 'ANSWERED').length;
    const noAnswerCalls = filteredData.filter(item => item.status === 'NO ANSWER').length;
    const busyCalls = filteredData.filter(item => item.status === 'BUSY').length;
    const totalDuration = filteredData.reduce((sum, item) => {
      const duration = parseInt(item.duration || 0);
      return sum + (isNaN(duration) ? 0 : duration);
    }, 0);
    const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
    const successRate = totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0;

    return {
      totalCalls,
      answeredCalls,
      noAnswerCalls,
      busyCalls,
      totalDuration,
      avgDuration,
      successRate
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const pieChartOptions = {
    chart: {
      type: 'pie',
    },
    labels: getStatusDistribution().map(item => item.name),
    colors: COLORS,
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 350
    },
    series: [{
      name: 'Calls',
      data: getDestinationTrend().map(item => item.count)
    }],
    xaxis: {
      categories: getDestinationTrend().map(item => item.date)
    },
    colors: ['#0088FE'],
    stroke: {
      curve: 'smooth',
      width: 3
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CDR Data Report</h1>
          <p className="text-gray-600">Comprehensive analysis of Call Detail Records with interactive visualizations</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <input
                type="text"
                value={`${dayjs(dateRange[0].startDate).format('MMM DD, YYYY')} - ${dayjs(dateRange[0].endDate).format('MMM DD, YYYY')}`}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                readOnly
              />
              {showDatePicker && (
                <div className="absolute z-10 mt-1">
                  <DateRangePicker
                    ranges={dateRange}
                    onChange={item => setDateRange([item.selection])}
                    onClose={() => setShowDatePicker(false)}
                  />
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="ANSWERED">Answered</option>
                <option value="NO ANSWER">No Answer</option>
                <option value="BUSY">Busy</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by source, destination, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Summary Stats */}
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-600 font-medium">Total Records</p>
              <p className="text-2xl font-bold text-blue-800">{filteredData.length}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={fetchCdrData}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Statistics Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Total Calls</h4>
                <p className="text-2xl font-bold text-blue-600">{getStatistics().totalCalls}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Answered</h4>
                <p className="text-2xl font-bold text-green-600">{getStatistics().answeredCalls}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">No Answer</h4>
                <p className="text-2xl font-bold text-yellow-600">{getStatistics().noAnswerCalls}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Busy</h4>
                <p className="text-2xl font-bold text-red-600">{getStatistics().busyCalls}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Success Rate</h4>
                <p className="text-2xl font-bold text-purple-600">{getStatistics().successRate}%</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Avg Duration</h4>
                <p className="text-2xl font-bold text-indigo-600">{getStatistics().avgDuration}s</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Total Duration</h4>
                <p className="text-2xl font-bold text-orange-600">{Math.round(getStatistics().totalDuration / 60)}m</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Status Distribution Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Call Status Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getStatusDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Call Volume Trend Line Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Call Volume Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getDestinationTrend()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#0088FE" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Duration Histogram */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Call Duration Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getDurationHistogram()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Address Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Calls by Location</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getAddressDistribution()} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="city" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">CDR Data Table</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ring Group</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {item.date ? dayjs(item.date).format('MMM DD, YYYY') : 'N/A'}
                         </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.source || 'N/A'}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.destination || 'N/A'}</td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                             item.status === 'ANSWERED' ? 'bg-green-100 text-green-800' :
                             item.status === 'NO ANSWER' ? 'bg-yellow-100 text-yellow-800' :
                             item.status === 'BUSY' ? 'bg-red-100 text-red-800' :
                             'bg-gray-100 text-gray-800'
                           }`}>
                             {item.status || 'UNKNOWN'}
                           </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.duration || 0}s</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.address || 'N/A'}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ring_group || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CDRReport; 