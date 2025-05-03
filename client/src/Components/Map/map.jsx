import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const address = [
    {
      "point_no": "01",
      "location_name": "Dhaka Airport",
      "latitude": 23.8431,
      "longitude": 90.3975,
      "distance": "350"
    },
    {
      "point_no": "02",
      "location_name": "Cox's Bazar",
      "latitude": 21.4514,
      "longitude": 92.0198,
      "distance": "350"
    },
    {
      "point_no": "03",
      "location_name": "Sylhet",
      "latitude": 24.8943,
      "longitude": 91.8687,
      "distance": "350"
    },
    {
      "point_no": "04",
      "location_name": "Chittagong Port",
      "latitude": 22.3556,
      "longitude": 91.7832,
      "distance": "350"
    },
    {
      "point_no": "05",
      "location_name": "Rajshahi",
      "latitude": 24.3744,
      "longitude": 88.6047,
      "distance": "350"
    },
    {
      "point_no": "06",
      "location_name": "Khulna",
      "latitude": 22.8456,
      "longitude": 89.5403,
      "distance": "350"
    },
    {
      "point_no": "07",
      "location_name": "Barisal",
      "latitude": 22.7010,
      "longitude": 90.3500,
      "distance": "350"
    },
    {
      "point_no": "08",
      "location_name": "Rangpur",
      "latitude": 25.7465,
      "longitude": 89.2752,
      "distance": "350"
    },
    {
      "point_no": "09",
      "location_name": "Mymensingh",
      "latitude": 24.7475,
      "longitude": 90.4114,
      "distance": "350"
    },
    {
      "point_no": "10",
      "location_name": "Comilla",
      "latitude": 23.4644,
      "longitude": 91.1775,
      "distance": "350"
    }
  ];
  

const MapboxExample = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicml5YWRoMTgxMCIsImEiOiJjbHVmdzZtNXUwbm1tMmxvZXgxbTZkZTBzIn0.ZKL7nnBAQryksHFvmNl3YQ';

    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, // Use the reference for the container
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [91.97106489520495, 22.46018927786971], // Default center
      zoom: 6
    });
    // Loop through the address array and add markers
    address.forEach(location => {
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([location.longitude, location.latitude]) // Set longitude and latitude
        .setPopup(new mapboxgl.Popup().setText(location.location_name)) // Set popup with location name
        .addTo(mapRef.current);
    });
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Clean up map on unmount
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '100vh' }} // Ensure proper height
    />
  );
};

export default MapboxExample;
