import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCrosshairs } from 'react-icons/fa';

const MapPicker = ({ onLocationSelect, initialLat, initialLng }) => {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: initialLat || 23.8103, // Default to Dhaka coordinates
    lng: initialLng || 90.4125,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get current location
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setSelectedLocation({ lat: latitude, lng: longitude });
          onLocationSelect(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          alert('Unable to get your location. Please select manually.');
        }
      );
    } else {
      setLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Handle map click
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click coordinates to lat/lng (simplified)
    const lat = 23.8103 + (y - rect.height / 2) * 0.001;
    const lng = 90.4125 + (x - rect.width / 2) * 0.001;
    
    setSelectedLocation({ lat, lng });
    onLocationSelect(lat, lng);
  };

  // Handle manual input
  const handleLatChange = (e) => {
    const lat = parseFloat(e.target.value);
    if (!isNaN(lat)) {
      setSelectedLocation(prev => ({ ...prev, lat }));
      onLocationSelect(lat, selectedLocation.lng);
    }
  };

  const handleLngChange = (e) => {
    const lng = parseFloat(e.target.value);
    if (!isNaN(lng)) {
      setSelectedLocation(prev => ({ ...prev, lng }));
      onLocationSelect(selectedLocation.lat, lng);
    }
  };

  useEffect(() => {
    if (initialLat && initialLng) {
      setSelectedLocation({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Meeting Location</h3>
        <button
          onClick={getCurrentLocation}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <FaCrosshairs />
          {loading ? 'Getting Location...' : 'Use My Location'}
        </button>
      </div>

      {/* Simple Map Representation */}
      <div className="relative">
        <div
          className="w-full h-64 bg-gray-200 border-2 border-gray-300 rounded-lg cursor-crosshair relative overflow-hidden"
          onClick={handleMapClick}
        >
          {/* Grid lines for reference */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-gray-300 opacity-20"></div>
            ))}
          </div>
          
          {/* Selected location marker */}
          <div
            className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <FaMapMarkerAlt className="text-white text-xs" />
          </div>

          {/* Current location marker (if available) */}
          {currentLocation && (
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: '50%',
                top: '50%',
              }}
            >
              <div className="w-full h-full bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-600 text-center">
          Click on the map to select location • Drag to move around
        </div>
      </div>

      {/* Manual coordinates input */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={selectedLocation.lat}
            onChange={handleLatChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="23.8103"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={selectedLocation.lng}
            onChange={handleLngChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="90.4125"
          />
        </div>
      </div>

      {/* Location preview */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">
          <strong>Selected Location:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
        </div>
        {currentLocation && (
          <div className="text-sm text-blue-600 mt-1">
            <strong>Your Location:</strong> {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPicker; 