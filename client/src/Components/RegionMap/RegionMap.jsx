import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import booleanIntersects from "@turf/boolean-intersects";
import { feature as turfFeature } from "@turf/helpers";
import Advisory from "../Advisory/Advisory";

// Zone Colors
const zoneColors = {
  "Mid Western Zone": "#f44145",
  "Mid-Eastern Zone": "#8dc252",
  "Jamuna Floodplain": "#16a35e",
  "Hill Tracts": "#fa9c2a",
  "Haor": "#82b1ff",
  "Coastal": "#3342ff",
  "Barind and Dry": "#fbc614",
};

// District to Zone Mapping
const districtZones = {
  Barguna: "Coastal",
  Barisal: "Coastal",
  Bhola: "Coastal",
  Jhalokati: "Coastal",
  Patuakhali: "Coastal",
  Pirojpur: "Coastal",
  Bandarban: "Hill Tracts",
  Brahamanbaria: "Mid-Eastern Zone",
  Chandpur: "Mid-Eastern Zone",
  Chittagong: "Hill Tracts",
  "Cox's Bazar": "Hill Tracts",
  Comilla: "Mid-Eastern Zone",
  Feni: "Hill Tracts",
  Khagrachhari: "Hill Tracts",
  Lakshmipur: "Mid-Eastern Zone",
  Noakhali: "Mid-Eastern Zone",
  Rangamati: "Hill Tracts",
  Dhaka: "Mid-Eastern Zone",
  Faridpur: "Mid-Eastern Zone",
  Gazipur: "Mid-Eastern Zone",
  Gopalganj: "Mid-Eastern Zone",
  Kishoreganj: "Haor",
  Madaripur: "Mid-Eastern Zone",
  Manikganj: "Mid-Eastern Zone",
  Munshiganj: "Mid-Eastern Zone",
  Narayanganj: "Mid-Eastern Zone",
  Narsingdi: "Mid-Eastern Zone",
  Rajbari: "Mid-Eastern Zone",
  Shariatpur: "Mid-Eastern Zone",
  Tangail: "Jamuna Floodplain",
  Bagerhat: "Mid Western Zone",
  Chuadanga: "Mid Western Zone",
  Jessore: "Mid Western Zone",
  Jhenaidah: "Mid Western Zone",
  Khulna: "Mid Western Zone",
  Kushtia: "Mid Western Zone",
  Magura: "Mid Western Zone",
  Meherpur: "Mid Western Zone",
  Narail: "Mid Western Zone",
  Satkhira: "Mid Western Zone",
  Jamalpur: "Jamuna Floodplain",
  Mymensingh: "Jamuna Floodplain",
  Netrakona: "Haor",
  Sherpur: "Jamuna Floodplain",
  Bogra: "Barind and Dry",
  Joypurhat: "Barind and Dry",
  Naogaon: "Barind and Dry",
  Natore: "Barind and Dry",
  Nawabganj: "Barind and Dry",
  Pabna: "Barind and Dry",
  Rajshahi: "Barind and Dry",
  Sirajganj: "Jamuna Floodplain",
  Dinajpur: "Barind and Dry",
  Gaibandha: "Jamuna Floodplain",
  Kurigram: "Jamuna Floodplain",
  Lalmonirhat: "Jamuna Floodplain",
  Nilphamari: "Jamuna Floodplain",
  Panchagarh: "Barind and Dry",
  Rangpur: "Jamuna Floodplain",
  Thakurgaon: "Barind and Dry",
  Habiganj: "Haor",
  Maulvibazar: "Haor",
  Sunamganj: "Haor",
  Sylhet: "Haor",
};

// Utility: Fit entire GeoJSON on map
const FitBounds = ({ geoData }) => {
  const map = useMap();
  useEffect(() => {
    if (geoData) {
      const bounds = L.geoJSON(geoData).getBounds();
      map.fitBounds(bounds);
    }
  }, [geoData, map]);
  return null;
};

// Utility: Fit specific district
const FitToDistrict = ({ feature }) => {
  const map = useMap();
  useEffect(() => {
    if (feature) {
      const bounds = L.geoJSON(feature).getBounds();
      map.fitBounds(bounds);
    }
  }, [feature, map]);
  return null;
};

// Random pastel color
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 75%)`;
};

const RegionMap = () => {
  const [districtData, setDistrictData] = useState(null); // ADM2
  const [upazilaData, setUpazilaData] = useState(null); // ADM3
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selecteddistrictName, setSelecteddistrictName] = useState(null);
  const [upazilasInDistrict, setUpazilasInDistrict] = useState([]);

  useEffect(() => {
    // Fetch district GeoJSON
    fetch("/geoBoundaries-BGD-ADM2_simplified.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Total Districts Loaded:", data.features.length);
        console.log("Sample District Properties:", data.features[0].properties);
        setDistrictData(data);
      })
      .catch((error) => console.error("Error loading district data:", error));

    // Fetch upazila GeoJSON
    fetch("/geoBoundaries-BGD-ADM3_simplified.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Total Upazilas Loaded:", data.features.length);
        console.log("Sample Upazila Properties:", data.features.slice(0, 3).map(f => f.properties));
        setUpazilaData(data);
      })
      .catch((error) => console.error("Error loading upazila data:", error));
  }, []);

  const onEachDistrict = (feature, layer) => {
    const districtName = feature.properties.shapeName;
    const zone = districtZones[districtName];
    const fillColor = zoneColors[zone] || "#ccc";

    layer.setStyle({
      fillColor,
      fillOpacity: 0.7,
      color: "black",
      weight: 1,
    });

    layer.bindPopup(`<b>${districtName}</b><br/>Zone: ${zone || "Unknown"}`);

    layer.on("click", () => {
      setSelectedDistrict(feature);

      if (upazilaData) {
        const districtPolygon = turfFeature(feature.geometry);
        const matchedUpazilas = upazilaData.features.filter((upz) => {
          try {
            const upazilaFeature = turfFeature(upz.geometry);
            return booleanIntersects(upazilaFeature, districtPolygon);
          } catch (error) {
            console.error(`Error processing upazila ${upz.properties.shapeName}:`, error);
            return false;
          }
        });

        console.log(`Upazilas for ${districtName}:`, matchedUpazilas.length, matchedUpazilas.map((upz) => upz.properties.shapeName));
        setUpazilasInDistrict(matchedUpazilas);
        setSelecteddistrictName(districtName);
      }
    });
  };

  return (
    <div className="flex gap-5">
      <div className="h-[600px] w-1/2 rounded border relative">
        <MapContainer
          bounds={[[20.5, 87], [27.5, 93]]}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution="© BRRI Agromet Lab"
            opacity={0.5}
          />
          {/* All Districts */}
          {districtData && !selectedDistrict && (
            <>
              <GeoJSON data={districtData} onEachFeature={onEachDistrict} />
              <FitBounds geoData={districtData} />
            </>
          )}
          {/* Selected District & Its Upazilas */}
          {selectedDistrict && (
            <>
              <GeoJSON
                data={selectedDistrict}
                style={(feature) => {
                  const districtName = feature.properties.shapeName;
                  const zone = districtZones[districtName];
                  return {
                    fillColor: zoneColors[zone] || "#ccc",
                    fillOpacity: 0.5,
                    color: "black",
                    weight: 2,
                  };
                }}
              />
              <FitToDistrict feature={selectedDistrict} />

              {/* Show all upazilas in selected district */}
              <GeoJSON
                data={{ type: "FeatureCollection", features: upazilasInDistrict }}
                style={() => ({
                  fillColor: getRandomColor(),
                  fillOpacity: 0.7,
                  color: "#444",
                  weight: 1,
                })}
                onEachFeature={(feature, layer) => {
                  layer.bindPopup(`<b>${feature.properties.shapeName}</b>`);
                }}
              />
            </>
          )}
        </MapContainer>

        {/* Back button */}
        {selectedDistrict && (
          <button
            onClick={() => {
              setSelectedDistrict(null);
              setUpazilasInDistrict([]);
            }}
            className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow border"
          >
            Back to All Districts
          </button>
        )}
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-sm space-y-1 max-h-60 overflow-y-auto">
          <div><strong>Legend:</strong></div>
          {Object.entries(zoneColors).map(([zone, color]) => (
            <div key={zone} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ background: color }} />
              <span>{zone}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2">
        <Advisory upazilasInDistrict={upazilasInDistrict} selecteddistrictName={selecteddistrictName}/>
      </div>
    </div>
  );
};

export default RegionMap;