import { useEffect, useState } from "react";
import { FaBatteryFull } from "react-icons/fa";

const Station = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        fetch('https://iinms.brri.gov.bd/api/aws/stations')
            .then(response => response.json())
            .then(data => setStations(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const stateColors = {
        Online: 'bg-green-400',
        Delay: 'bg-blue-400',
        Warning: 'bg-yellow-400',
        Preamble: 'bg-orange-400',
        Alarm: 'bg-red-400',
        Maintenance: 'bg-gray-400',
        Offline: 'bg-gray-900',
        'Manual Offline': 'bg-gray-600'
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="px-6 py-4 bg-[#166534]">
                        <h2 className="text-2xl font-bold text-white">Weather Stations</h2>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 bg-white rounded-lg p-4 shadow">
                        {Object.keys(stateColors).map(state => (
                            <div key={state} className="flex items-center">
                                <span className={`inline-block w-3 h-3 rounded-full ${stateColors[state]} mr-2`}></span>
                                <span>{state}</span>
                            </div>
                        ))}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                                    <th className="py-3 px-6 text-left">State</th>
                                    <th className="py-3 px-6 text-left">ID</th>
                                    <th className="py-3 px-6 text-left">Station</th>
                                    <th className="py-3 px-6 text-left">Type</th>
                                    <th className="py-3 px-6 text-left">Network</th>
                                    <th className="py-3 px-6 text-left">Owner</th>
                                    <th className="py-3 px-6 text-left">Power Save</th>
                                    <th className="py-3 px-6 text-left">Latest Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stations.map(station => (
                                    <tr
                                        key={station.id}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="py-4 px-6">
                                            <span className={`inline-block w-3 h-3 rounded-full ${stateColors[station.state] || 'bg-gray-400'}`}></span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-700">{station.id}</td>
                                        <td className="py-4 px-6 text-gray-700">{station.station_name}</td>
                                        <td className="py-4 px-6 text-gray-700">{station.type}</td>
                                        <td className="py-4 px-6 text-gray-700">{station.network}</td>
                                        <td className="py-4 px-6 text-gray-700">{station.owner}</td>
                                        <td className="py-4 px-6">
                                            <span className=" text-green-400"><FaBatteryFull /></span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-700">{station.latest_data}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Station;