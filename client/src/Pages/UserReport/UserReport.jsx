import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import dayjs from 'dayjs';
import axios from 'axios';
import Papa from 'papaparse';

const UserReport = () => {
  const [userData, setUserData] = useState([]);
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
  const [selectedSaao, setSelectedSaao] = useState('all');
  const [saaos, setSaaos] = useState([]);
  const [loadingSaaos, setLoadingSaaos] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchSaaos();
  }, []);

  const fetchSaaos = async () => {
    try {
      setLoadingSaaos(true);
      const response = await axios.get('https://iinms.brri.gov.bd/api/wabas/report/saaos');
      if (response.data.success) {
        setSaaos(response.data.data);
      } else {
        console.error('Failed to fetch SAAOs:', response.data.message);
        setSaaos([]);
      }
    } catch (error) {
      console.error('Error fetching SAAOs:', error);
      setSaaos([]);
    } finally {
      setLoadingSaaos(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const startDate = dayjs(dateRange[0].startDate).format('YYYY-MM-DD');
      const endDate = dayjs(dateRange[0].endDate).format('YYYY-MM-DD');
      
      const response = await axios.get(`https://iinms.brri.gov.bd/api/wabas/report/user-data`, {
        params: {
          startDate,
          endDate,
          saaoId: selectedSaao !== 'all' ? selectedSaao : '',
          limit: 1000
        }
      });

      if (response.data.success) {
        setUserData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        console.error('Failed to fetch user data:', response.data.message);
        setUserData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = filteredData.map(item => ({
      'Farmer ID': item.farmerId,
      'Farmer Name': item.farmerName,
      'Phone': item.phone,
      'Village': item.village,
      'SAAO ID': item.saaoId,
      'Created Date': dayjs(item.createdAt).format('YYYY-MM-DD'),
      'Updated Date': dayjs(item.updatedAt).format('YYYY-MM-DD'),
      'Irrigation Methods': getIrrigationMethods(item.formData),
      'Fertilizers Used': getFertilizersUsed(item.formData),
      'Pesticides Used': getPesticidesUsed(item.formData),
      'Fungicides Used': getFungicidesUsed(item.formData),
      'Herbicides Used': getHerbicidesUsed(item.formData)
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `user_report_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    filterData();
  }, [userData, searchTerm, selectedSaao]);

  useEffect(() => {
    fetchUserData();
  }, [dateRange, selectedFilter]);

  const filterData = () => {
    let filtered = [...userData];

    // SAAO filter
    if (selectedSaao !== 'all') {
      filtered = filtered.filter(item => item.saaoId == selectedSaao);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.farmerName && item.farmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.phone && item.phone.includes(searchTerm)) ||
        (item.village && item.village.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredData(filtered);
  };

  // Helper functions for data extraction
  const getIrrigationMethods = (formData) => {
    return formData[0]?.irrigation?.join(', ') || 'None';
  };

  const getFertilizersUsed = (formData) => {
    return formData[5]?.fertilizer?.join(', ') || 'None';
  };

  const getPesticidesUsed = (formData) => {
    return formData[7]?.pesticide?.join(', ') || 'None';
  };

  const getFungicidesUsed = (formData) => {
    return formData[8]?.fungicide?.join(', ') || 'None';
  };

  const getHerbicidesUsed = (formData) => {
    return formData[3]?.herbicide?.join(', ') || 'None';
  };

  // Chart data preparation
  const getVillageDistribution = () => {
    const villageCount = {};
    filteredData.forEach(item => {
      const village = item.village || 'Unknown';
      villageCount[village] = (villageCount[village] || 0) + 1;
    });
    return Object.entries(villageCount).map(([village, count]) => ({ village, count }));
  };

  const getSaaoDistribution = () => {
    const saaoCount = {};
    filteredData.forEach(item => {
      const saaoName = saaos.find(s => s.id == item.saaoId)?.name || `SAAO ${item.saaoId}`;
      saaoCount[saaoName] = (saaoCount[saaoName] || 0) + 1;
    });
    return Object.entries(saaoCount).map(([saaoName, count]) => ({ saaoName, count }));
  };

  const getSubmissionTrend = () => {
    const dailyCount = {};
    filteredData.forEach(item => {
      const date = dayjs(item.createdAt).format('YYYY-MM-DD');
      dailyCount[date] = (dailyCount[date] || 0) + 1;
    });
    return Object.entries(dailyCount).map(([date, count]) => ({ date, count }));
  };

  const getFormCompletionStats = () => {
    const stats = {
      totalUsers: filteredData.length,
      withIrrigation: filteredData.filter(item => getIrrigationMethods(item.formData) !== 'None').length,
      withFertilizers: filteredData.filter(item => getFertilizersUsed(item.formData) !== 'None').length,
      withPesticides: filteredData.filter(item => getPesticidesUsed(item.formData) !== 'None').length,
      withFungicides: filteredData.filter(item => getFungicidesUsed(item.formData) !== 'None').length,
      withHerbicides: filteredData.filter(item => getHerbicidesUsed(item.formData) !== 'None').length
    };

    stats.avgCompletionRate = Math.round(
      ((stats.withIrrigation + stats.withFertilizers + stats.withPesticides + 
        stats.withFungicides + stats.withHerbicides) / (stats.totalUsers * 5)) * 100
    );

    return stats;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Data Report</h1>
          <p className="text-gray-600">Comprehensive analysis of all users and their submitted farming data</p>
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

                         {/* SAAO Filter */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">SAAO</label>
               <select
                 value={selectedSaao}
                 onChange={(e) => setSelectedSaao(e.target.value)}
                 disabled={loadingSaaos}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
               >
                 <option value="all">
                   {loadingSaaos ? 'Loading SAAOs...' : 'All SAAOs'}
                 </option>
                 {!loadingSaaos && saaos.length > 0 ? (
                   saaos.map(saao => (
                     <option key={saao.id} value={saao.id}>{saao.name}</option>
                   ))
                 ) : !loadingSaaos && saaos.length === 0 ? (
                   <option value="" disabled>No SAAOs available</option>
                 ) : null}
               </select>
             </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by farmer name, phone, village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Summary Stats */}
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-blue-800">{filteredData.length}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={fetchUserData}
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
        ) : filteredData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
              <p className="text-gray-500">No user data found for the selected criteria.</p>
              <button
                onClick={fetchUserData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Total Users</h4>
                <p className="text-2xl font-bold text-blue-600">{getFormCompletionStats().totalUsers}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Irrigation</h4>
                <p className="text-2xl font-bold text-green-600">{getFormCompletionStats().withIrrigation}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Fertilizers</h4>
                <p className="text-2xl font-bold text-yellow-600">{getFormCompletionStats().withFertilizers}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Pesticides</h4>
                <p className="text-2xl font-bold text-red-600">{getFormCompletionStats().withPesticides}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Fungicides</h4>
                <p className="text-2xl font-bold text-purple-600">{getFormCompletionStats().withFungicides}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Herbicides</h4>
                <p className="text-2xl font-bold text-indigo-600">{getFormCompletionStats().withHerbicides}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
                <p className="text-2xl font-bold text-orange-600">{getFormCompletionStats().avgCompletionRate}%</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Village Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Village</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getVillageDistribution()} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="village" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Submission Trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily User Registration Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getSubmissionTrend()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#00C49F" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* SAAO Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by SAAO</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getSaaoDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ saaoName, percent }) => `${saaoName} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {getSaaoDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Form Completion Rate */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Completion Analysis</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { category: 'Irrigation', count: getFormCompletionStats().withIrrigation },
                      { category: 'Fertilizers', count: getFormCompletionStats().withFertilizers },
                      { category: 'Pesticides', count: getFormCompletionStats().withPesticides },
                      { category: 'Fungicides', count: getFormCompletionStats().withFungicides },
                      { category: 'Herbicides', count: getFormCompletionStats().withHerbicides }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Data Table</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAAO</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Irrigation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fertilizers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesticides</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.farmerId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.farmerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.village}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {saaos.find(s => s.id == item.saaoId)?.name || `SAAO ${item.saaoId}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getIrrigationMethods(item.formData) !== 'None' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getIrrigationMethods(item.formData)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getFertilizersUsed(item.formData) !== 'None' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getFertilizersUsed(item.formData)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getPesticidesUsed(item.formData) !== 'None' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getPesticidesUsed(item.formData)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.updatedAt ? dayjs(item.updatedAt).format('MMM DD, YYYY') : 'N/A'}
                        </td>
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

export default UserReport; 