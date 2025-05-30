import { useState, useEffect, useMemo, useRef } from "react";
import { FaPen } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";

const Block = () => {
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [data, setData] = useState({});
  const [selectedHotspot, setSelectedHotspot] = useState("");
  const [region, setRegion] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [union, setUnion] = useState("");
  const [block, setBlock] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [searchRegion, setSearchRegion] = useState("");
  const [filteredRegions, setFilteredRegions] = useState();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [searchDistrict, setSearchDistrict] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [searchUpazila, setSearchUpazila] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState();
  const [selectedUpazila, setSelectedUpazila] = useState(null);
  const [showUpazilaDropdown, setShowUpazilaDropdown] = useState(false);
  const [searchUnion, setSearchUnion] = useState("");
  const [filteredUnions, setFilteredUnions] = useState();
  const [selectedUnion, setSelectedUnion] = useState(null);
  const [showUnionDropdown, setShowUnionDropdown] = useState(false);

  const regionInputRef = useRef(null);
  const districtInputRef = useRef(null);
  const upazilaInputRef = useRef(null);
  const unionInputRef = useRef(null);
  // Fetch blocks from the backend
  const fetchBlocks = async () => {
    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/bloks/blocks");
      const data = await response.json();
      setRoles(data.reverse());
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/data");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  }
  // Fetch blocks when the component mounts
  useEffect(() => {
    fetchBlocks();
    fetchData();
  }, []);

  const openAddRoleModal = () => {
    setIsEditMode(false);
    setEditRoleId(null);
    setModalVisible(true);

    // Reset all state variables to empty values when adding a new role
    setSelectedHotspot('');
    setRegion('');
    setDivision('');
    setDistrict('');
    setUpazila('');
    setUnion('');
    setBlock('');
    setLatitude('');
    setLongitude('');
  };


  const openEditRoleModal = (id) => {
    const roleToEdit = roles.find((role) => role.id === id);
    if (roleToEdit) {
      setIsEditMode(true); // Set to Edit mode
      setEditRoleId(id); // Set the ID of the role being edited

      // Prepopulate the form with the role data
      setModalVisible(true);
      setSelectedHotspot(roleToEdit.hotspot);
      setSelectedRegion(roleToEdit.region);
      setSearchRegion(roleToEdit.region);
      setDivision(roleToEdit.division);
      setSearchDistrict(roleToEdit.district);
      setSelectedDistrict(roleToEdit.district);
      setSearchUpazila(roleToEdit.upazila);
      setSelectedUpazila(roleToEdit.upazila);
      setSearchUnion(roleToEdit.union);
      setSelectedUnion(roleToEdit.union);
      setBlock(roleToEdit.block);
      setLatitude(roleToEdit.latitude);
      setLongitude(roleToEdit.longitude);
    }
  };


  const saveRole = async () => {
    
    if (isEditMode) {
      // Update existing block
      try {
        const response = await fetch(`https://iinms.brri.gov.bd/api/bloks/blocks/${editRoleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block, latitude, longitude, hotspot: selectedHotspot, region: selectedRegion, division, district: selectedDistrict, upazila: selectedUpazila, union: selectedUnion }),
        });
        const updatedRole = await response.json();
        setRoles((prevRoles) =>
          prevRoles.map((role) => (role.id === editRoleId ? updatedRole : role))
        );
      } catch (error) {
        console.error("Error updating block:", error);
      }
    } else {
      // Add new block
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/bloks/blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ block, latitude, longitude, hotspot: selectedHotspot, region: selectedRegion, division, district: selectedDistrict, upazila: selectedUpazila, union: selectedUnion }),
        });
        const newBlock = await response.json();
        fetchBlocks();
      } catch (error) {
        console.error("Error adding block:", error);
      }
    }

    setModalVisible(false);
  };

  const deleteRole = async (id) => {
    try {
      await fetch(`https://iinms.brri.gov.bd/api/bloks/blocks/${id}`, {
        method: "DELETE",
      });
      setRoles(roles.filter((role) => role.id !== id));
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  };
  useEffect(() => {
    if (searchRegion) {
      setFilteredRegions(
        data.regions.filter((region) =>
          region.name.toLowerCase().includes(searchRegion.toLowerCase())
        )
      );
    } else {
      setFilteredRegions(data?.regions?.slice(0, 5)); // Show first 5 if no search
    }
  }, [searchRegion, data.regions]);
  useEffect(() => {
    if (searchDistrict) {
      setFilteredDistricts(
        data.districts.filter((district) =>
          district.name.toLowerCase().includes(searchDistrict.toLowerCase())
        )
      );
    } else {
      setFilteredDistricts(data?.districts?.slice(0, 5)); // Show first 5 if no search
    }
  }, [searchDistrict, data.districts]);
  useEffect(() => {
    if (searchUpazila) {
      setFilteredUpazilas(
        data.upazilas.filter((upazila) =>
          upazila.name.toLowerCase().includes(searchUpazila.toLowerCase())
        )
      );
    } else {
      setFilteredUpazilas(data?.upazilas?.slice(0, 5)); // Show first 5 if no search
    }
  }, [searchUpazila, data.upazilas]);

  useEffect(() => {
    if (searchUnion) {
      setFilteredUnions(
        data.unions.filter((union) =>
          union.name.toLowerCase().includes(searchUnion.toLowerCase())
        )
      );
    } else {
      setFilteredUnions(data?.unions?.slice(0, 5)); // Show first 5 if no search
    }
  }, [searchUnion, data.unions]);

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        regionInputRef.current &&
        !regionInputRef.current.contains(event.target)
      ) {
        setShowRegionDropdown(false);
      }
      if (
        districtInputRef.current &&
        !districtInputRef.current.contains(event.target)
      ) {
        setShowDistrictDropdown(false);
      }
      if (
        upazilaInputRef.current &&
        !upazilaInputRef.current.contains(event.target)
      ) {
        setShowUpazilaDropdown(false);
      }
      if (
        unionInputRef.current &&
        !unionInputRef.current.contains(event.target)
      ) {
        setShowUnionDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div >
        <div className="p-6 bg-gray-50 min-h-screen w-full">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">Block List</h1>
            <div className="flex justify-end mb-4">
              <button
                onClick={openAddRoleModal}
                className="bg-slate-600 text-white px-6 py-2 rounded shadow hover:shadow-lg transition duration-300"
              >
                Add Block
              </button>
            </div>
          </div>

          <div className="max-w-[160vh]  overflow-x-scroll max-h-screen overflow-y-scroll">
            <table className="w-full border-collapse bg-white rounded shadow-lg ">
              <thead className="bg-slate-700 text-white">
                <tr>
                  <th className="border-b px-6 py-3 text-left">#</th>
                  <th className="border-b px-6 py-3 text-left">Block</th>
                  <th className="border-b px-6 py-3 text-left">Hotspot</th>
                  <th className="border-b px-6 py-3 text-left">Region</th>
                  <th className="border-b px-6 py-3 text-left">Division</th>
                  <th className="border-b px-6 py-3 text-left">District</th>
                  <th className="border-b px-6 py-3 text-left">Upazila</th>
                  <th className="border-b px-6 py-3 text-left">Union</th>
                  <th className="border-b px-6 py-3 text-left">Latitude</th>
                  <th className="border-b px-6 py-3 text-left">Longitude</th>
                  <th className="border-b px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr key={role.id} className="hover:bg-gray-100">
                    <td className="border-b px-6 py-3 w-24">{index + 1}</td>
                    <td className="border-b px-6 py-3">{role.block}</td>
                    <td className="border-b px-6 py-3">{role.hotspot}</td>
                    <td className="border-b px-6 py-3">{role.region}</td>
                    <td className="border-b px-6 py-3">{role.division}</td>
                    <td className="border-b px-6 py-3">{role.district}</td>
                    <td className="border-b px-6 py-3">{role.upazila}</td>
                    <td className="border-b px-6 py-3">{role.union}</td>
                    <td className="border-b px-6 py-3">{role.latitude}</td>
                    <td className="border-b px-6 py-3">{role.longitude}</td>
                    <td className="border-b px-6 py-3 h-full flex gap-4">
                      <button
                        onClick={() => openEditRoleModal(role.id)}
                        className="text-slate-600 hover:underline"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => deleteRole(role.id)}
                        className="hover:underline text-red-500"
                      >
                        <BiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* Modal */}
          {modalVisible && (
            <div className="fixed z-[9999] inset-0 bg-black bg-opacity-50 flex items-center  justify-center">
              <div className="bg-white rounded-lg shadow-lg w-full md:w-1/3 lg:w-1/3 p-6 relative max-h-[650px]  overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-center text-black">
                  {isEditMode ? "Edit Block" : "Add Block"}
                </h2>
                <label className="block mb-2 font-medium">Hotspot</label>
                <select
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  value={selectedHotspot}
                  onChange={(e) => setSelectedHotspot(e.target.value)}
                >
                  <option value="">Select Hotspot</option>
                  {data?.hotspots?.map((hotspot) => (
                    <option key={hotspot.id} value={hotspot.name}>
                      {hotspot.name}
                    </option>
                  ))}
                </select>
                <div className="mb-4 relative" ref={regionInputRef}>
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-1"
                    placeholder="Search region"
                    value={searchRegion}
                    onFocus={() => setShowRegionDropdown(true)}
                    onChange={(e) => setSearchRegion(e.target.value)}
                  />
                  {showRegionDropdown && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow-lg max-h-40 overflow-y-auto">
                      {filteredRegions.map((region, index) => (
                        <li
                          key={index}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedRegion?.name === region.name ? "bg-gray-200" : ""
                            }`}
                          onClick={() => {
                            setSelectedRegion(region.name);
                            setSearchRegion(region.name);
                            setShowRegionDropdown(false);
                          }}
                        >
                          {region.name}
                        </li>
                      ))}
                      {filteredRegions.length === 0 && (
                        <li className="px-3 py-2 text-gray-500">No regions found</li>
                      )}
                    </ul>
                  )}
                </div>
                {/* Division */}
                <label className="block mb-2 font-medium">Division</label>
                <select
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                >
                  <option value="">Select Division</option>
                  {data.divisions.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {/* District */}
                <div className="mb-4 relative" ref={districtInputRef}>
                  <label className="block text-sm font-medium mb-1">District</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-1"
                    placeholder="Search district"
                    value={searchDistrict}
                    onFocus={() => setShowDistrictDropdown(true)}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                  />
                  {showDistrictDropdown && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow-lg max-h-40 overflow-y-auto">
                      {filteredDistricts?.map((district, index) => (
                        <li
                          key={index}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedDistrict?.name === district.name ? "bg-gray-200" : ""
                            }`}
                          onClick={() => {
                            setSelectedDistrict(district.name);
                            setSearchDistrict(district.name);
                            setShowDistrictDropdown(false);
                          }}
                        >
                          {district.name}
                        </li>
                      ))}
                      {filteredDistricts?.length === 0 && (
                        <li className="px-3 py-2 text-gray-500">No regions found</li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Upazila */}
                <div className="mb-4 relative" ref={upazilaInputRef}>
                  <label className="block text-sm font-medium mb-1">Upazila</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-1"
                    placeholder="Search Upazila"
                    value={searchUpazila}
                    onFocus={() => setShowUpazilaDropdown(true)}
                    onChange={(e) => setSearchUpazila(e.target.value)}
                  />
                  {showUpazilaDropdown && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow-lg max-h-40 overflow-y-auto">
                      {filteredUpazilas?.map((upazila, index) => (
                        <li
                          key={index}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedUpazila?.name === upazila.name ? "bg-gray-200" : ""
                            }`}
                          onClick={() => {
                            setSelectedUpazila(upazila.name);
                            setSearchUpazila(upazila.name);
                            setShowUpazilaDropdown(false);
                          }}
                        >
                          {upazila.name}
                        </li>
                      ))}
                      {filteredUpazilas?.length === 0 && (
                        <li className="px-3 py-2 text-gray-500">No regions found</li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Union */}
                <div className="mb-4 relative" ref={unionInputRef}>
                  <label className="block text-sm font-medium mb-1">Union</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-1"
                    placeholder="Search Union"
                    value={searchUnion}
                    onFocus={() => setShowUnionDropdown(true)}
                    onChange={(e) => setSearchUnion(e.target.value)}
                  />
                  {showUnionDropdown && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow-lg max-h-40 overflow-y-auto">
                      {filteredUnions?.map((union, index) => (
                        <li
                          key={index}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedUnion?.name === union.name ? "bg-gray-200" : ""
                            }`}
                          onClick={() => {
                            setSelectedUnion(union.name);
                            setSearchUnion(union.name);
                            setShowUnionDropdown(false);
                          }}
                        >
                          {union.name}
                        </li>
                      ))}
                      {filteredUnions?.length === 0 && (
                        <li className="px-3 py-2 text-gray-500">No regions found</li>
                      )}
                    </ul>
                  )}
                </div>
                <label className="block mb-2 font-medium">Block </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  placeholder="Enter Block name"
                />
                <label className="block mb-2 font-medium">Latitude</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  placeholder="Enter Latitude"
                />
                <label className="block mb-2 font-medium">Longitude</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2"
                  placeholder="Enter Longitude"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setModalVisible(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveRole}
                    className="bg-slate-600 text-white px-4 py-2 rounded shadow hover:shadow-lg transition duration-300"
                  >
                    Save
                  </button>
                </div>
                <button
                  onClick={() => setModalVisible(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Block;
