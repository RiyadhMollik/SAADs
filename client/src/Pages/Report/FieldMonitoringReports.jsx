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
    date: '',
  });

  const API_URL = 'https://iinms.brri.gov.bd/api';

  // Handle hotspot selection
  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedHotspots.includes(selectedValue)) {
      const updatedHotspots = [...selectedHotspots, selectedValue];
      setSelectedHotspots(updatedHotspots);
      setFormData({ ...formData, hotspot: updatedHotspots });
    }
  };

  // Handle hotspot deletion
  const handleDelete = (valueToDelete) => {
    const updatedHotspot = selectedHotspots.filter((value) => value !== valueToDelete);
    setSelectedHotspots(updatedHotspot);
    setFormData({ ...formData, hotspot: updatedHotspot });
  };

  // Fetch block counts
  useEffect(() => {
    const fetchBlockCounts = async () => {
      const { date, upazila, union, hotspot } = formData;
      if (!date || (!upazila && !union)) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/reports/block-wise-counts`, {
          params: {
            date,
            ...(upazila && { upazila }),
            ...(union && { union }),
            ...(hotspot && hotspot.length > 0 && { hotspots: hotspot.join(',') }),
          },
        });
        console.log(response);
        
        setChartData(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch block counts');
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockCounts();
  }, [formData.date, formData.upazila, formData.union, formData.hotspot]);

  // Fetch hotspots
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

  // Fetch regions
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

  // Fetch divisions
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

  // Fetch districts
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

  // Fetch upazilas
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

  // Fetch unions
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

  // Fetch blocks
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
      <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4">
        <input
          type="date"
          className="border w-full p-2 rounded-md shadow-md h-10"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          max={new Date().toISOString().split('T')[0]} // Prevent future dates
        />
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedHotspots.map((hotspotName) => (
              <div key={hotspotName} className="flex items-center bg-gray-200 p-1 rounded">
                <span>{hotspotName}</span>
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleDelete(hotspotName)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <select
            name="hotspot"
            className="border w-full p-2 rounded-md shadow-md h-10"
            value=""
            onChange={handleSelect}
          >
            <option value="">Select Hotspot</option>
            {hotspot?.map((hotspot) => (
              <option key={hotspot.id} value={hotspot.name}>
                {hotspot.name}
              </option>
            ))}
          </select>
        </div>
        <select
          className="border w-full p-2 rounded-md shadow-md h-10"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <select
          className="border w-full p-2 rounded-md shadow-md h-10"
          value={formData.division}
          onChange={(e) => setFormData({ ...formData, division: e.target.value })}
        >
          <option value="">Select Division</option>
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
        <select
          className="border w-full p-2 rounded-md shadow-md h-10"
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <select
          className="border w-full p-2 rounded-md shadow-md h-10"
          value={formData.upazila}
          onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
        >
          <option value="">Select Upazila</option>
          {upazilas.map((upazila) => (
            <option key={upazila} value={upazila}>
              {upazila}
            </option>
          ))}
        </select>
        <select
          className="border w-full p-2 rounded-md shadow-md h-10"
          value={formData.union}
          onChange={(e) => setFormData({ ...formData, union: e.target.value })}
        >
          <option value="">Select Union</option>
          {unions.map((union) => (
            <option key={union} value={union}>
              {union}
            </option>
          ))}
        </select>
      </div>
      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-4">
        <ChartComponent data={chartData} locationType="block" />
      </div>
    </div>
  );
}

export default FieldMonitoringReports;