import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent';

function FieldMonitoringReports() {
  const [hotspot, setHotspot] = useState([]);
  const [selectedHotspots, setSelectedHotspots] = useState([]);
  const [regions, setRegions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    region: '',
    division: '',
    district: '',
    upazila: '',
    union: '',
    startDate: '',
    endDate: '',
  });

  const API_URL = 'https://iinms.brri.gov.bd/api';

  // Handle hotspot selection
  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedHotspots.includes(selectedValue)) {
      const updatedHotspots = [...selectedHotspots, selectedValue];
      setSelectedHotspots(updatedHotspots);
    }
  };

  // Handle hotspot deletion
  const handleDelete = (valueToDelete) => {
    const updatedHotspot = selectedHotspots.filter((value) => value !== valueToDelete);
    setSelectedHotspots(updatedHotspot);
  };

  // Fetch block counts
  useEffect(() => {
    const { startDate, endDate, upazila, union , district } = formData;
    if (!startDate || !endDate || (!upazila && !union  && !district)) return;

    const fetchBlockCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/reports/block-wise-counts`, {
          params: {
            startDate,
            endDate,
            ...(upazila && { upazila }),
            ...(union && { union }),
            ...(district && { district }),
          },
        });
        setChartData(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch block counts');
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockCounts();
  }, [formData.startDate, formData.endDate, formData.upazila, formData.union, selectedHotspots , formData.district]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const res = await fetch(`${API_URL}/hotspots`);
        const data = await res.json();
        setHotspot(data.reverse());
      } catch (error) {
        console.error('Error fetching hotspots:', error);
      }
    };
    fetchHotspots();
  }, []);

  useEffect(() => {
    if (!selectedHotspots.length) return;
    const fetchRegions = async () => {
      try {
        const res = await fetch(`${API_URL}/data/regions?hotspot=${selectedHotspots.join(',')}`);
        const data = await res.json();
        setRegions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error('Error fetching region data:', error);
      }
    };
    fetchRegions();
  }, [selectedHotspots]);

  useEffect(() => {
    const { region } = formData;
    if (!region || !selectedHotspots.length) return;
    const fetchDivisions = async () => {
      try {
        const res = await fetch(`${API_URL}/data/divisions?region=${region}&hotspot=${selectedHotspots.join(',')}`);
        const data = await res.json();
        setDivisions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error('Error fetching division data:', error);
      }
    };
    fetchDivisions();
  }, [formData.region, selectedHotspots]);

  useEffect(() => {
    const { division, region } = formData;
    if (!division || !region || !selectedHotspots.length) return;
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`${API_URL}/data/districts?division=${division}&region=${region}&hotspot=${selectedHotspots.join(',')}`);
        const data = await res.json();
        setDistricts(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error('Error fetching district data:', error);
      }
    };
    fetchDistricts();
  }, [formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    const { district, division, region } = formData;
    if (!district || !division || !region || !selectedHotspots.length) return;
    const fetchUpazilas = async () => {
      try {
        const res = await fetch(`${API_URL}/data/upazilas?district=${district}&division=${division}&region=${region}&hotspot=${selectedHotspots.join(',')}`);
        const data = await res.json();
        setUpazilas(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error('Error fetching upazila data:', error);
      }
    };
    fetchUpazilas();
  }, [formData.district, formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    const { upazila, district, division, region } = formData;
    if (!upazila || !district || !division || !region || !selectedHotspots.length) return;
    const fetchUnions = async () => {
      try {
        const res = await fetch(`${API_URL}/data/unions?upazila=${upazila}&district=${district}&division=${division}&region=${region}&hotspot=${selectedHotspots.join(',')}`);
        const data = await res.json();
        setUnions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error('Error fetching union data:', error);
      }
    };
    fetchUnions();
  }, [formData.upazila, formData.district, formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    const { union, upazila, district, division, region } = formData;
    if (!union || !upazila || !district || !division || !region || !selectedHotspots.length) return;
    const fetchBlocks = async () => {
      try {
        const res = await fetch(`${API_URL}/data/blocks?union=${union}&upazila=${upazila}&district=${district}&division=${division}&region=${region}&hotspot=${selectedHotspots.join(',')}`);
        const data = await res.json();
        setBlocks(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error('Error fetching block data:', error);
      }
    };
    fetchBlocks();
  }, [formData.union, formData.upazila, formData.district, formData.division, formData.region, selectedHotspots]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

     
          {/* Start Date */}
          <div className="flex-1 ">
            <label htmlFor="startDate" className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="w-full border border-gray-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-12"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* End Date */}
          <div className="flex-1 ">
            <label htmlFor="endDate" className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="w-full border border-gray-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-12"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        {/* Hotspot Selector */}
        <div className="">
          <label htmlFor="hotspot" className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Hotspots
          </label>
          <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
            <select
              id="hotspot"
              value={selectedHotspots}
              className="w-full border border-gray-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-12"
              
              onChange={handleSelect}
            >
              <option value="">Select a Hotspot</option>
              {hotspot.map((hotspot) => (
                <option key={hotspot.id} value={hotspot.name}>
                  {hotspot.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Filters */}
        {[{
          id: 'region',
          label: 'Region',
          options: regions
        }, {
          id: 'division',
          label: 'Division',
          options: divisions
        }, {
          id: 'district',
          label: 'District',
          options: districts
        }, {
          id: 'upazila',
          label: 'Upazila',
          options: upazilas
        }, {
          id: 'union',
          label: 'Union',
          options: unions
        }].map(({ id, label, options }) => (
          <div key={id} className="col-span-1">
            <label htmlFor={id} className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {label}
            </label>
            <select
              id={id}
              className="w-full border border-gray-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-12"
              value={formData[id]}
              onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
            >
              <option value="">Select {label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>


      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        <ChartComponent data={chartData} locationType="block" />
      </div>
    </div>
  );
}

export default FieldMonitoringReports;
