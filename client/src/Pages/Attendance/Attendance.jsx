import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaMapMarkerAlt, FaClock, FaUsers, FaCalendar, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import MapPicker from '../../Components/MapPicker/MapPicker';
import { useAuthContext } from '../../Components/context/AuthProvider';

const Attendance = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [attendanceData, setAttendanceData] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const { authUser, loadingUser } = useAuthContext();
    // Form state for creating meeting
    const [meetingForm, setMeetingForm] = useState({
        title: '',
        description: '',
        meetingDate: '',
        startTime: '',
        endTime: '',
        locationLat: '',
        locationLng: '',
        locationName: '',
    });

    const API_BASE_URL = 'https://iinms.brri.gov.bd/api';

    // Get current location
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Unable to get your location');
                }
            );
        } else {
            toast.error('Geolocation is not supported by this browser');
        }
    };

    // Fetch meetings
    const fetchMeetings = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/meetings?search=${searchTerm}&status=${filterStatus}`);
            setMeetings(response.data.data);
        } catch (error) {
            console.error('Error fetching meetings:', error);
            toast.error('Failed to fetch meetings');
        } finally {
            setLoading(false);
        }
    };

    // Create meeting
    const createMeeting = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/meetings`, meetingForm);
            toast.success('Meeting created successfully');
            setShowCreateModal(false);
            setMeetingForm({
                title: '',
                description: '',
                meetingDate: '',
                startTime: '',
                endTime: '',
                locationLat: '',
                locationLng: '',
                locationName: '',
            });
            fetchMeetings();
        } catch (error) {
            console.error('Error creating meeting:', error);
            toast.error(error.response?.data?.message || 'Failed to create meeting');
        }
    };

    // Mark attendance
    const markAttendance = async (meetingId) => {
        if (!currentLocation) {
            getCurrentLocation();
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/meetings/${meetingId}/attendance`, {
                userId: authUser.id, // This should come from user context
                checkInLat: currentLocation.lat,
                checkInLng: currentLocation.lng,
            });

            toast.success('Attendance marked successfully');
            fetchMeetingAttendance(meetingId);
        } catch (error) {
            console.error('Error marking attendance:', error);
            toast.error(error.response?.data?.message || 'Failed to mark attendance');
        }
    };

    // Fetch meeting attendance
    const fetchMeetingAttendance = async (meetingId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/meetings/${meetingId}/attendance-report`);
            setAttendanceData(response.data.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            toast.error('Failed to fetch attendance data');
        }
    };

    // View meeting details and attendance
    const viewMeeting = async (meeting) => {
        setSelectedMeeting(meeting);
        await fetchMeetingAttendance(meeting.id);
        setShowAttendanceModal(true);
    };

    // Delete meeting
    const deleteMeeting = async (meetingId) => {
        if (window.confirm('Are you sure you want to delete this meeting?')) {
            try {
                await axios.delete(`${API_BASE_URL}/meetings/${meetingId}`);
                toast.success('Meeting deleted successfully');
                fetchMeetings();
            } catch (error) {
                console.error('Error deleting meeting:', error);
                toast.error('Failed to delete meeting');
            }
        }
    };

    // Set location from map picker
    const setLocationFromMap = (lat, lng) => {
        setMeetingForm(prev => ({
            ...prev,
            locationLat: lat,
            locationLng: lng,
        }));
    };

    useEffect(() => {
        fetchMeetings();
        getCurrentLocation();
    }, [searchTerm, filterStatus]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Meeting Attendance</h1>
                        <p className="text-gray-600 mt-2">Manage meetings and track attendance for Agromet Scientists</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FaPlus /> Create Meeting
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search meetings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Meetings List */}
                <div className="bg-white rounded-lg shadow-sm">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading meetings...</p>
                        </div>
                    ) : meetings.length === 0 ? (
                        <div className="p-8 text-center">
                            <FaCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No meetings found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Meeting Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {meetings.map((meeting) => (
                                        <tr key={meeting.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{meeting.title}</div>
                                                    <div className="text-sm text-gray-500">{meeting.description}</div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Created by: {meeting.creator?.name || 'Unknown'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <FaCalendar className="text-gray-400" />
                                                        {formatDate(meeting.meetingDate)}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <FaClock className="text-gray-400" />
                                                        {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <FaMapMarkerAlt className="text-gray-400" />
                                                        {meeting.locationName || 'Location not specified'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {meeting.locationLat}, {meeting.locationLng}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(meeting.status)}`}>
                                                    {meeting.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => viewMeeting(meeting)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => markAttendance(meeting.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Mark Attendance"
                                                    >
                                                        <FaUsers />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMeeting(meeting.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete Meeting"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Meeting Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-9999999999">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mt-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Create New Meeting</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={createMeeting}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Meeting Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={meetingForm.title}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location Name
                                    </label>
                                    <input
                                        type="text"
                                        value={meetingForm.locationName}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, locationName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Meeting Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={meetingForm.meetingDate}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, meetingDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={meetingForm.startTime}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, startTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={meetingForm.endTime}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, endTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <MapPicker
                                        onLocationSelect={setLocationFromMap}
                                        initialLat={meetingForm.locationLat}
                                        initialLng={meetingForm.locationLng}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={meetingForm.description}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Meeting
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Attendance Modal */}
            {showAttendanceModal && selectedMeeting && attendanceData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Meeting Attendance</h2>
                            <button
                                onClick={() => setShowAttendanceModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Meeting Details */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold mb-2">{selectedMeeting.title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Date:</span> {formatDate(selectedMeeting.meetingDate)}
                                </div>
                                <div>
                                    <span className="font-medium">Time:</span> {formatTime(selectedMeeting.startTime)} - {formatTime(selectedMeeting.endTime)}
                                </div>
                                <div>
                                    <span className="font-medium">Location:</span> {selectedMeeting.locationName}
                                </div>
                            </div>
                        </div>

                        {/* Attendance Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-green-100 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-600">{attendanceData.summary.totalPresent}</div>
                                <div className="text-sm text-green-700">Present</div>
                            </div>
                            <div className="bg-yellow-100 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-yellow-600">{attendanceData.summary.totalLate}</div>
                                <div className="text-sm text-yellow-700">Late</div>
                            </div>
                            <div className="bg-red-100 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-red-600">{attendanceData.summary.totalAbsent}</div>
                                <div className="text-sm text-red-700">Absent</div>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">{attendanceData.summary.attendanceRate}%</div>
                                <div className="text-sm text-blue-700">Attendance Rate</div>
                            </div>
                        </div>

                        {/* Attendance Details */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Present ({attendanceData.attendance.filter(a => a.status === 'present').length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {attendanceData.attendance
                                    .filter(a => a.status === 'present')
                                    .map((attendance) => (
                                        <div key={attendance.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                            <div className="font-medium text-green-800">{attendance.User.name}</div>
                                            <div className="text-sm text-green-600">
                                                Check-in: {new Date(attendance.checkInTime).toLocaleTimeString()}
                                            </div>
                                            <div className="text-xs text-green-500">
                                                Distance: {attendance.distance}m
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <h4 className="text-lg font-semibold">Late ({attendanceData.attendance.filter(a => a.status === 'late').length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {attendanceData.attendance
                                    .filter(a => a.status === 'late')
                                    .map((attendance) => (
                                        <div key={attendance.id} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                            <div className="font-medium text-yellow-800">{attendance.User.name}</div>
                                            <div className="text-sm text-yellow-600">
                                                Check-in: {new Date(attendance.checkInTime).toLocaleTimeString()}
                                            </div>
                                            <div className="text-xs text-yellow-500">
                                                Distance: {attendance.distance}m
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <h4 className="text-lg font-semibold">Absent ({attendanceData.absentUsers.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {attendanceData.absentUsers.map((user) => (
                                    <div key={user.id} className="bg-red-50 p-3 rounded-lg border border-red-200">
                                        <div className="font-medium text-red-800">{user.name}</div>
                                        <div className="text-sm text-red-600">{user.mobileNumber}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance; 