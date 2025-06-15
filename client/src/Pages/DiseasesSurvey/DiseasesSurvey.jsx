import { useState } from "react";
import { FaAd, FaBars, FaEdit, FaLocationArrow, FaTrash } from "react-icons/fa";
import { ChevronsUpDown } from "lucide-react";
import { Parser } from "@json2csv/plainjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '/logo.png';
import { MdMyLocation } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";

const Modal = ({ isOpen, onClose, onSave, initialData, isEdit }) => {
    const [formData, setFormData] = useState(
        initialData || {
            year: '',
            lat: '',
            lan: '',
            season: '',
            dateSurvey: '',
            datePlanting: '',
            ageSeedling: '',
            growthDuration: '',
            surveySite: '',
            fieldArea: '',
            variety: '',
            growthStage: '',
            temperature: '',
            rainfall: '',
            relativeHumidity: '',
            diseaseEntries: [{ diseaseName: '', diseaseSeverity: '', remarks: '', diseasesIncident: '', diseasesIncidentRemarks: '' }],
        }
    );

    const [errors, setErrors] = useState({});
    const [gpsError, setGpsError] = useState('');
    const [isGpsLoading, setIsGpsLoading] = useState(false);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedEntries = [...formData.diseaseEntries];
        updatedEntries[index] = { ...updatedEntries[index], [name]: value };

        if (name === 'diseaseSeverity') {
            let remark = '';
            if (value === '') remark = '';
            else if (value >= '1' && value <= '3') remark = 'Light Symptoms';
            else if (value >= '4' && value <= '6') remark = 'Moderate Damage';
            else if (value >= '7' && value <= '9') remark = 'Severe Damage';
            updatedEntries[index].remarks = remark;
        }

        if (name === 'diseasesIncident') {
            let incidentRemark = '';
            if (value === '') incidentRemark = '';
            else if (value >= '0' && value <= '20') incidentRemark = 'Low';
            else if (value > '20' && value <= '40') incidentRemark = 'Moderate';
            else if (value > '40') incidentRemark = 'Severe';
            updatedEntries[index].diseasesIncidentRemarks = incidentRemark;
        }

        setFormData({ ...formData, diseaseEntries: updatedEntries });
    };

    const handleMainChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setGpsError('Geolocation is not supported by this browser.');
            return;
        }

        setIsGpsLoading(true);
        setGpsError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormData({
                    ...formData,
                    lat: latitude.toFixed(6),
                    lan: longitude.toFixed(6),
                });
                setIsGpsLoading(false);
            },
            (error) => {
                let errorMessage = 'Failed to get location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permission to access location was denied.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'The request to get location timed out.';
                        break;
                }
                setGpsError(errorMessage);
                setIsGpsLoading(false);
            }
        );
    };

    const addEntry = () => {
        setFormData({
            ...formData,
            diseaseEntries: [
                ...formData.diseaseEntries,
                { diseaseName: '', diseaseSeverity: '', remarks: '', diseasesIncident: '', diseasesIncidentRemarks: '' },
            ],
        });
    };

    const removeEntry = (index) => {
        const updatedEntries = formData.diseaseEntries.filter((_, i) => i !== index);
        setFormData({ ...formData, diseaseEntries: updatedEntries });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.year) newErrors.year = 'Year is required';
        if (!formData.season) newErrors.season = 'Season is required';
        if (!formData.dateSurvey) newErrors.dateSurvey = 'Survey Date is required';
        if (!formData.datePlanting) newErrors.datePlanting = 'Planting Date is required';
        if (!formData.surveySite) newErrors.surveySite = 'Survey Site is required';
        if (!formData.variety) newErrors.variety = 'Variety is required';
        if (!formData.growthStage) newErrors.growthStage = 'Growth Stage is required';
        formData.diseaseEntries.forEach((entry, index) => {
            if (entry.diseaseName && !entry.diseaseSeverity) {
                newErrors[`diseaseSeverity_${index}`] = 'Severity is required if Disease is selected';
            }
            if (entry.diseaseName && !entry.diseasesIncident) {
                newErrors[`diseasesIncident_${index}`] = 'Incident is required if Disease is selected';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        onSave(formData, isEdit);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFormData({
            year: '',
            lat: '',
            lan: '',
            season: '',
            dateSurvey: '',
            datePlanting: '',
            ageSeedling: '',
            growthDuration: '',
            surveySite: '',
            fieldArea: '',
            variety: '',
            growthStage: '',
            temperature: '',
            rainfall: '',
            relativeHumidity: '',
            diseaseEntries: [{ diseaseName: '', diseaseSeverity: '', remarks: '', diseasesIncident: '', diseasesIncidentRemarks: '' }],
        });
        setErrors({});
        setGpsError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999999] p-2 sm:p-4 md:p-6 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white px-4 sm:px-6 py-8 sm:py-10 rounded-lg shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-6">{isEdit ? 'Edit Data' : 'Add New Data'}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Year */}
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleMainChange}
                            placeholder="Year"
                            className={`p-2 border w-full rounded ${errors.year ? 'border-red-500' : ''}`}
                        />
                        {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                    </div>

                    {/* Latitude & Longitude + GPS Button */}
                    <div className="col-span-2 md:col-span-1 lg:col-span-1">
                        <div className="flex flex-col md:flex-row lg:flex-row gap-2">
                            <div>
                                <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                <input
                                    id="lat"
                                    name="lat"
                                    value={formData.lat}
                                    onChange={handleMainChange}
                                    placeholder="Latitude"
                                    className="p-2 border w-full rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="lan" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                <input
                                    id="lan"
                                    name="lan"
                                    value={formData.lan}
                                    onChange={handleMainChange}
                                    placeholder="Longitude"
                                    className="p-2 border w-full rounded"
                                />
                            </div>
                            <div className="flex items-center mt-5">
                                <button
                                    onClick={handleGetLocation}
                                    disabled={isGpsLoading}
                                    className={`p-2 bg-text-500  rounded w-full hover:bg-text-600 ${isGpsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    type="button"
                                >
                                    {isGpsLoading ? 'Fetching...' : <MdMyLocation className="mx-auto" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Season */}
                    <div>
                        <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                        <select
                            id="season"
                            name="season"
                            value={formData.season}
                            onChange={handleMainChange}
                            className={`p-2 border w-full rounded ${errors.season ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select Season</option>
                            <option value="Aus">Aus</option>
                            <option value="Aman">Aman</option>
                            <option value="Boro">Boro</option>
                        </select>
                        {errors.season && <p className="text-red-500 text-sm mt-1">{errors.season}</p>}
                    </div>

                    {/* Survey Date */}
                    <div>
                        <label htmlFor="dateSurvey" className="block text-sm font-medium text-gray-700 mb-1">Survey Date</label>
                        <input
                            id="dateSurvey"
                            name="dateSurvey"
                            value={formData.dateSurvey}
                            onChange={handleMainChange}
                            type="date"
                            className={`p-2 border w-full rounded ${errors.dateSurvey ? 'border-red-500' : ''}`}
                        />
                        {errors.dateSurvey && <p className="text-red-500 text-sm mt-1">{errors.dateSurvey}</p>}
                    </div>

                    {/* Planting Date */}
                    <div>
                        <label htmlFor="datePlanting" className="block text-sm font-medium text-gray-700 mb-1">Planting Date</label>
                        <input
                            id="datePlanting"
                            name="datePlanting"
                            value={formData.datePlanting}
                            onChange={handleMainChange}
                            type="date"
                            className={`p-2 border w-full rounded ${errors.datePlanting ? 'border-red-500' : ''}`}
                        />
                        {errors.datePlanting && <p className="text-red-500 text-sm mt-1">{errors.datePlanting}</p>}
                    </div>

                    {/* Age of Seedling */}
                    <div>
                        <label htmlFor="ageSeedling" className="block text-sm font-medium text-gray-700 mb-1">Age of Seedling (days)</label>
                        <input
                            id="ageSeedling"
                            name="ageSeedling"
                            value={formData.ageSeedling}
                            onChange={handleMainChange}
                            placeholder="Age of Seedling"
                            className="p-2 border w-full rounded"
                        />
                    </div>

                    {/* Growth Duration */}
                    <div>
                        <label htmlFor="growthDuration" className="block text-sm font-medium text-gray-700 mb-1">Growth Duration (days)</label>
                        <input
                            id="growthDuration"
                            name="growthDuration"
                            value={formData.growthDuration}
                            onChange={handleMainChange}
                            placeholder="Growth Duration"
                            className="p-2 border w-full rounded"
                        />
                    </div>

                    {/* Survey Site */}
                    <div>
                        <label htmlFor="surveySite" className="block text-sm font-medium text-gray-700 mb-1">Survey Site</label>
                        <select
                            id="surveySite"
                            name="surveySite"
                            value={formData.surveySite}
                            onChange={handleMainChange}
                            className={`p-2 border w-full rounded ${errors.surveySite ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select Site</option>
                            <option value="Trial">Trial</option>
                            <option value="Farmers Field">Farmers Field</option>
                            <option value="Demonstration">Demonstration</option>
                        </select>
                        {errors.surveySite && <p className="text-red-500 text-sm mt-1">{errors.surveySite}</p>}
                    </div>
                    <div>
                        <label htmlFor="fieldArea" className="block text-sm font-medium text-gray-700 mb-1">Field Area (Decimal)</label>
                        <input
                            id="fieldArea"
                            name="fieldArea"
                            value={formData.fieldArea}
                            onChange={handleMainChange}
                            placeholder="Field Area"
                            className="p-2 border w-full rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="variety" className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                        <input
                            id="variety"
                            name="variety"
                            value={formData.variety}
                            onChange={handleMainChange}
                            placeholder="Variety"
                            className={`p-2 border w-full rounded ${errors.variety ? 'border-red-500' : ''}`}
                        />
                        {errors.variety && <p className="text-red-500 text-sm mt-1">{errors.variety}</p>}
                    </div>
                    <div>
                        <label htmlFor="growthStage" className="block text-sm font-medium text-gray-700 mb-1">Growth Stage</label>
                        <select
                            id="growthStage"
                            name="growthStage"
                            value={formData.growthStage}
                            onChange={handleMainChange}
                            className={`p-2 border w-full rounded ${errors.growthStage ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select Stage</option>
                            {["Germination", "Seedling Stage", "Tillering", "Maximum Tillering", "PI", "Booting", "Heading", "Flowering", "Milk stage", "Soft dough", "Hard dough", "Maturity"].map(stage => (
                                <option key={stage} value={stage}>{stage}</option>
                            ))}
                        </select>
                        {errors.growthStage && <p className="text-red-500 text-sm mt-1">{errors.growthStage}</p>}
                    </div>
                    <div>
                        <label htmlFor="minTemperature" className="block text-sm font-medium text-gray-700 mb-1">Min Temperature (°C)</label>
                        <input
                            id="minTemperature"
                            name="minTemperature"
                            value={formData.minTemperature}
                            onChange={handleMainChange}
                            placeholder="MinTemperature"
                            className="p-2 border w-full rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="maxTemperature" className="block text-sm font-medium text-gray-700 mb-1">Max Temperature (°C)</label>
                        <input
                            id="maxTemperature"
                            name="maxTemperature"
                            value={formData.maxTemperature}
                            onChange={handleMainChange}
                            placeholder="Max Temperature"
                            className="p-2 border w-full rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="avgTemperature" className="block text-sm font-medium text-gray-700 mb-1">Avg Temperature (°C)</label>
                        <input
                            id="avgTemperature"
                            name="avgTemperature"
                            value={formData.avgTemperature}
                            onChange={handleMainChange}
                            placeholder="Avg Temperature"
                            className="p-2 border w-full rounded"
                        />
                    </div>

                    <div>
                        <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm)</label>
                        <input
                            id="rainfall"
                            name="rainfall"
                            value={formData.rainfall}
                            onChange={handleMainChange}
                            placeholder="Rainfall"
                            className="p-2 border w-full rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="relativeHumidity" className="block text-sm font-medium text-gray-700 mb-1">Relative Humidity (%)</label>
                        <input
                            id="relativeHumidity"
                            name="relativeHumidity"
                            value={formData.relativeHumidity}
                            onChange={handleMainChange}
                            placeholder="Relative Humidity"
                            className="p-2 border w-full rounded"
                        />
                    </div>
                </div>
                <div className="mt-3 ">
                    <div className="flex justify-between mt-2">
                        <h2 className="text-lg font-semibold mb-3">Disease Entries</h2>
                        <button
                            onClick={addEntry}
                            className="w-full sm:w-auto px-4 py-2 text-2xl font-bold text-black rounded hover:text-black"
                            type="button"
                        >
                            <IoIosAdd />

                        </button>
                    </div>
                    {formData.diseaseEntries.map((entry, index) => (
                        <div key={index} className="border p-4 rounded mb-4 mt-3">
                            <h3 className="text-sm font-semibold mb-3">Disease Entry {index + 1}</h3>
                            <div className="flex flex-col md:flex-row lg:flex-row gap-2">
                                <select
                                    name="diseaseName"
                                    value={entry.diseaseName}
                                    onChange={(e) => handleChange(e, index)}
                                    className="p-2 border rounded"
                                >
                                    <option value="">Select Disease</option>
                                    {["Leaf Blast", "Neck Blast", "BLB", "Sheath Blight", "Brown spot", "Tungro", "False smut", "Bakane", "Sheath Rot", "Stem Rot"].map(disease => (
                                        <option key={disease} value={disease}>{disease}</option>
                                    ))}
                                </select>

                                <select
                                    name="diseaseSeverity"
                                    value={entry.diseaseSeverity}
                                    onChange={(e) => handleChange(e, index)}
                                    className={`p-2 border rounded ${errors[`diseaseSeverity_${index}`] ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Severity</option>
                                    {[...Array(9)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>

                                <input
                                    name="remarks"
                                    value={entry.remarks}
                                    readOnly
                                    placeholder="Remarks"
                                    className="p-2 border bg-gray-100 rounded"
                                />

                                <input
                                    name="diseasesIncident"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={entry.diseasesIncident}
                                    onChange={(e) => handleChange(e, index)}
                                    placeholder="Incident %"
                                    className={`p-2 border rounded ${errors[`diseasesIncident_${index}`] ? 'border-red-500' : ''}`}
                                />

                                <input
                                    name="diseasesIncidentRemarks"
                                    value={entry.diseasesIncidentRemarks}
                                    readOnly
                                    placeholder="Incident Remarks"
                                    className="p-2 border bg-gray-100 rounded"
                                />

                                <button
                                    onClick={() => removeEntry(index)}
                                    type="button"
                                    className="text-red-500 rounded p-2 hover:text-red-600"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                </div>
            </div>
        </div>
    );
};

const DiseasesSurvey = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const initialColumns = [
        { name: "Year", visible: true },
        { name: "Latitude", visible: true },
        { name: "Longitude", visible: true },
        { name: "Season", visible: true },
        { name: "Date of Survey", visible: true },
        { name: "Date of Planting", visible: true },
        { name: "Age of Seedling", visible: true },
        { name: "Growth Duration", visible: true },
        { name: "Survey Site", visible: true },
        { name: "Field Area (Decimal)", visible: true },
        { name: "Variety", visible: true },
        { name: "Growth Stage", visible: true },
        { name: "Temperature (°C)", visible: true },
        { name: "Rainfall (mm)", visible: true },
        { name: "Relative Humidity (%)", visible: true },
        { name: "Diseases", visible: true },
        { name: "Action", visible: true },
    ];

    const [columns, setColumns] = useState(initialColumns);

    const columnKeyMap = {
        Year: "year",
        Latitude: "lat",
        Longitude: "lan",
        Season: "season",
        "Date of Survey": "dateSurvey",
        "Date of Planting": "datePlanting",
        "Age of Seedling": "ageSeedling",
        "Growth Duration": "growthDuration",
        "Survey Site": "surveySite",
        "Field Area (Decimal)": "fieldArea",
        Variety: "variety",
        "Growth Stage": "growthStage",
        "Temperature (°C)": "temperature",
        "Rainfall (mm)": "rainfall",
        "Relative Humidity (%)": "relativeHumidity",
        Diseases: "diseaseEntries",
    };

    const filteredData = data.filter((row) =>
        Object.values(row)
            .filter((value) => typeof value !== 'object')
            .some((value) =>
                value.toString().toLowerCase().includes(searchText.toLowerCase())
            ) ||
        row.diseaseEntries.some((entry) =>
            entry.diseaseName.toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const key = columnKeyMap[sortConfig.key];
        let valueA = key === "diseaseEntries"
            ? a[key].map((e) => e.diseaseName).join(', ')
            : a[key] || '';
        let valueB = key === "diseaseEntries"
            ? b[key].map((e) => e.diseaseName).join(', ')
            : b[key] || '';

        if (sortConfig.key === 'Year' || sortConfig.key === 'Age of Seedling' || sortConfig.key === 'Growth Duration' ||
            sortConfig.key === 'Field Area (Decimal)' || sortConfig.key === 'Temperature (°C)' || sortConfig.key === 'Rainfall (mm)' ||
            sortConfig.key === 'Relative Humidity (%)') {
            valueA = Number(valueA) || 0;
            valueB = Number(valueB) || 0;
        }

        if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedData = sortedData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleAddData = (newData, isEdit) => {
        if (isEdit && editIndex !== null) {
            const updatedData = [...data];
            updatedData[editIndex] = newData;
            setData(updatedData);
            setEditIndex(null);
        } else {
            setData([...data, { ...newData, id: data.length + 1 }]);
        }
        setIsModalOpen(false);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setIsModalOpen(true);
    };

    const handleDelete = (index) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return;
        setData(data.filter((_, i) => i !== index));
        if (page > Math.ceil((data.length - 1) / rowsPerPage)) {
            setPage(page - 1 || 1);
        }
    };

    const handleSort = (columnName) => {
        setSortConfig((prev) => ({
            key: columnName,
            direction: prev.key === columnName && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const toggleColumnModal = () => setIsColumnModalOpen(!isColumnModalOpen);

    const handleColumnToggle = (columnName) => {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.name === columnName ? { ...col, visible: !col.visible } : col
            )
        );
    };

    const handleCopy = async () => {
        try {
            const visibleColumns = columns.filter((col) => col.visible && col.name !== "Action");
            const header = visibleColumns.map((col) => col.name).join("\t");
            const rows = paginatedData.map((row) =>
                visibleColumns
                    .map((col) => {
                        if (col.name === "Diseases") {
                            return row.diseaseEntries
                                .map((entry) =>
                                    `${entry.diseaseName} (Severity: ${entry.diseaseSeverity}, Incident: ${entry.diseasesIncident}%)`
                                )
                                .join('; ');
                        }
                        const key = columnKeyMap[col.name];
                        return row[key] || '';
                    })
                    .join("\t")
            );
            const text = `${header}\n${rows.join("\n")}`;
            await navigator.clipboard.writeText(text);
            alert("Table data copied to clipboard!");
        } catch (error) {
            console.error("Copy failed:", error);
            alert("Failed to copy data to clipboard. Please try again.");
        }
    };

    const handleExportCSV = () => {
        try {
            const visibleColumns = columns.filter((col) => col.visible && col.name !== "Action");
            const fields = visibleColumns.map((col) => ({
                label: col.name,
                value: col.name.toLowerCase().replace(/\s+/g, ''),
            }));

            const csvData = paginatedData.map((row) => {
                const rowData = {};
                visibleColumns.forEach((col) => {
                    const keyAlias = col.name.toLowerCase().replace(/\s+/g, '');
                    if (col.name === "Diseases") {
                        rowData[keyAlias] = row.diseaseEntries
                            .map((entry) =>
                                `${entry.diseaseName} (Severity: ${entry.diseaseSeverity}, Incident: ${entry.diseasesIncident}%)`
                            )
                            .join('; ');
                    } else {
                        const key = columnKeyMap[col.name];
                        rowData[keyAlias] = row[key] || '';
                    }
                });
                return rowData;
            });

            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(csvData);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "disease_survey.csv";
            link.click();
        } catch (error) {
            console.error("CSV export failed:", error);
            alert("Failed to export CSV. Please try again.");
        }
    };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 12;

            doc.setFont(undefined, "normal");
            doc.setFontSize(12);

            // Header
            doc.addImage(logo, 'PNG', margin, 16, 15, 15);
            doc.setFontSize(12);
            doc.setTextColor(50);
            doc.setFont("helvetica", "bold");
            doc.text("Bangladesh Rice Research Institute (BRRI)", margin + 18, 15);
            doc.setFontSize(10);
            doc.setTextColor(100);
            const date = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            };
            const formattedDate = date.toLocaleString('en-US', options);
            doc.setFont(undefined, "normal");
            doc.text(formattedDate, pageWidth - margin, 35, { align: "right" });
            doc.setFontSize(10);
            doc.setTextColor(50);
            doc.text("Gazipur-1701", margin + 18, 20);
            doc.setFont("helvetica", "bold");
            doc.text("Contact Agromet Lab", margin + 18, 25);
            doc.setFont(undefined, "normal");
            doc.text("Email: info.brriagromet@gmail.com", margin + 18, 30);
            doc.text("Mobile: 09644300300", margin + 18, 35);
            // Prepare table data
            const visibleColumns = columns.filter((col) => col.visible && col.name !== "Action");
            const headers = visibleColumns.map((col) => col.name);
            const tableData = paginatedData.map((row) =>
                visibleColumns.map((col) => {
                    if (col.name === "Diseases") {
                        return row.diseaseEntries
                            .map((entry) =>
                                `${entry.diseaseName} (Severity: ${entry.diseaseSeverity}, Incident: ${entry.diseasesIncident}%)`
                            )
                            .join('; ');
                    }
                    const key = columnKeyMap[col.name];
                    return row[key] || '';
                })
            );
            // Table
            autoTable(doc, {
                startY: 40,
                head: [headers],
                body: tableData,
                theme: 'grid',
                styles: {
                    font: "helvetica",
                    fontSize: 8,
                    cellPadding: 2,
                    textColor: [50, 50, 50],
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245],
                },
                margin: { top: 45, left: margin, right: margin, bottom: 20 },
                didDrawPage: (data) => {
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(100);
                    doc.text(
                        `Page ${data.pageNumber} of ${pageCount}`,
                        pageWidth / 2,
                        pageHeight - 12,
                        { align: "center" }
                    );
                    doc.text(
                        "© 2025 Smart Agro-Advisory Dissemination System.",
                        margin,
                        pageHeight - 6
                    );
                    doc.text(
                        "Generated by: Admin",
                        pageWidth - margin,
                        pageHeight - 6,
                        { align: "right" }
                    );
                },
            });

            doc.save("disease_survey.pdf");
        } catch (error) {
            console.error("PDF export failed:", error);
            alert("Failed to export PDF. Please try again.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <main className="p-6">
                <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold">Disease Survey Data</h1>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => {
                                setEditIndex(null);
                                setIsModalOpen(true);
                            }}
                        >
                            + Add Data
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full space-y-3 md:space-y-0">
                        <input
                            type="text"
                            placeholder="Search by Year, Season, Site, Variety, or Disease"
                            className="border rounded px-4 py-2 w-full md:w-1/2 lg:w-1/3"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className="flex flex-wrap justify-between md:justify-end space-x-2">
                            <input
                                type="number"
                                className="border rounded px-4 py-2"
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(parseInt(e.target.value) || 10)}
                                min={1}
                                placeholder="Rows per page"
                            />
                            <button
                                className="border px-4 py-2 rounded hover:bg-gray-100"
                                onClick={handleCopy}
                            >
                                Copy
                            </button>
                            <button
                                className="border px-4 py-2 rounded hover:bg-gray-100"
                                onClick={handleExportCSV}
                            >
                                CSV
                            </button>
                            <button
                                className="border px-4 py-2 rounded hover:bg-gray-100"
                                onClick={handleExportPDF}
                            >
                                PDF
                            </button>
                            <button
                                className="border px-4 py-2 rounded hover:bg-gray-100 flex items-center justify-center"
                                onClick={toggleColumnModal}
                            >
                                <FaBars className="text-lg" />
                            </button>
                        </div>
                    </div>

                    <div className="max-w-[150vh] overflow-x-scroll overflow-auto max-h-[500px] custom-scrollbar">
                        <table className="table-fixed w-full mt-4 border rounded">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gray-50 text-sm border-b">
                                    {columns
                                        .filter((col) => col.visible)
                                        .map((col, index) => (
                                            <th
                                                key={col.name}
                                                className={`border px-4 py-2 cursor-pointer ${index === 0 ? "sticky left-0 bg-gray-50" : ""}`}
                                                style={{ width: index === 0 ? "50px" : "150px" }}
                                                onClick={() => handleSort(col.name)}
                                            >
                                                <p className="flex items-center justify-between">
                                                    {col.name}
                                                    <ChevronsUpDown size={14} />
                                                    {sortConfig.key === col.name && (
                                                        <span className="ml-1">
                                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </p>
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((row, index) => (
                                    <tr className="text-sm" key={row.id || index} style={{ height: "50px" }}>
                                        {columns
                                            .filter((col) => col.visible)
                                            .map((col, colIndex) => (
                                                <td
                                                    key={col.name}
                                                    className={`border px-4 py-2 ${colIndex === 0 ? "sticky left-0" : ""} ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                                    style={{ width: colIndex === 0 ? "50px" : "150px" }}
                                                >
                                                    {col.name === "Year" && row.year}
                                                    {col.name === "Latitude" && row.lat}
                                                    {col.name === "Longitude" && row.lan}
                                                    {col.name === "Season" && row.season}
                                                    {col.name === "Date of Survey" && row.dateSurvey}
                                                    {col.name === "Date of Planting" && row.datePlanting}
                                                    {col.name === "Age of Seedling" && row.ageSeedling}
                                                    {col.name === "Growth Duration" && row.growthDuration}
                                                    {col.name === "Survey Site" && row.surveySite}
                                                    {col.name === "Field Area (Decimal)" && row.fieldArea}
                                                    {col.name === "Variety" && row.variety}
                                                    {col.name === "Growth Stage" && row.growthStage}
                                                    {col.name === "Temperature (°C)" && row.temperature}
                                                    {col.name === "Rainfall (mm)" && row.rainfall}
                                                    {col.name === "Relative Humidity (%)" && row.relativeHumidity}
                                                    {col.name === "Diseases" && (
                                                        <div>
                                                            {row.diseaseEntries.map((entry, i) => (
                                                                <div key={i}>
                                                                    {entry.diseaseName} (Severity: {entry.diseaseSeverity}, Incident: {entry.diseasesIncident}%)
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {col.name === "Action" && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                                onClick={() => handleEdit((page - 1) * rowsPerPage + index)}
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                                onClick={() => handleDelete((page - 1) * rowsPerPage + index)}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center w-full mt-5 md:hidden lg:hidden">
                        <label className="mr-2 w-1/2">Jump to page:</label>
                        <input
                            type="number"
                            value={page}
                            onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                            className="px-2 py-1 border rounded border-gray-300 w-1/2"
                        />
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
                        >
                            Previous
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <div className="hidden md:block lg:block text-sm">
                            <label className="mr-2">Jump to page:</label>
                            <input
                                type="number"
                                value={page}
                                onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                                className="px-2 py-1 border rounded border-gray-300"
                            />
                        </div>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {isColumnModalOpen && (
                    <div
                        className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-end"
                        onClick={toggleColumnModal}
                    >
                        <div
                            className="bg-white rounded shadow-lg w-full md:w-1/4 lg:w-1/5 py-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ul className="space-y-2 max-h-[50vh] overflow-y-scroll">
                                {columns.map((col) => (
                                    <li
                                        key={col.name}
                                        className={`flex items-center cursor-pointer px-3 space-x-2 ${col.visible ? "bg-gray-200 p-1 px-3" : ""}`}
                                        onClick={() => handleColumnToggle(col.name)}
                                    >
                                        <span>{col.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditIndex(null);
                    }}
                    onSave={handleAddData}
                    initialData={editIndex !== null ? data[editIndex] : null}
                    isEdit={editIndex !== null}
                />
            </main>
        </div>
    );
};

export default DiseasesSurvey;