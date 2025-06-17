import React, { useContext, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import { FilePlus, FileMinus, User, Car, Truck, AlertTriangle, CheckCircle, BarChart2, Users, UserPlus, Tractor, AlertCircle, FileText, Leaf, Newspaper, Microscope, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../../Components/context/AuthProvider';
import { use } from 'react';

const Dashboard = () => {
  const { rolePermission } = useContext(AuthContext);
  const [data, setData] = useState({});
  const [value, onChange] = useState(new Date());
  const formattedDate = value.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://iinms.brri.gov.bd/api/farmers/user-stats');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [])
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center mb-8">
        <div className='bg-white rounded-lg px-4 py-3 shadow-lg w-full min-h-[330px]'>
          <p className="text-lg font-semibold mb-4">Quick Links</p>
          <ul className="grid grid-cols-3 gap-4 text-xs text-center">

            {
              rolePermission['AD List'] && (
                <li className="bg-gray-100 rounded-lg py-4">
                  <a href="/ad-registration" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                    <FilePlus size={20} />
                    <p>AD Registration</p>
                  </a>
                </li>
              )
            }
            {
              rolePermission['DD List'] && (
                <li className="bg-gray-100 rounded-lg py-4">
                  <a href="/admin-registration" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                    <FilePlus size={20} />
                    <p>DD Registration</p>
                  </a>
                </li>
              )
            }
            {
              rolePermission['UAO List'] && (
                <li className="bg-gray-100 rounded-lg py-4">
                  <a href="/uao-registration" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                    <FilePlus size={20} />
                    <p>UAO Registration</p>
                  </a>
                </li>
              )
            }
            {
              rolePermission['SAAO List'] && (
                <li className="bg-gray-100 rounded-lg py-4">
                  <a href="/saao-registration" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                    <FilePlus size={20} />
                    <p>SAAO Registration</p>
                  </a>
                </li>
              )
            }
            {
              rolePermission['Farmer List'] && (
                <li className="bg-gray-100 rounded-lg py-4">
                  <a href="/farmer-registration" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                    <FilePlus size={20} />
                    <p>Add Farmer </p>
                  </a>
                </li>
              )
            }
            {
              rolePermission['Journalist List'] && (
                <li className="bg-gray-100 rounded-lg py-4">
                  <a href="/journalists-registration" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                    <FilePlus size={20} />
                    <p>Add Journalist </p>
                  </a>
                </li>
              )
            }
            {
              rolePermission['Report'] && (
                <li className="bg-gray-100 rounded-lg py-4">
                  <a href="/report" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                    <BarChart2 size={20} />
                    <p>Report</p>
                  </a>
                </li>
              )
            }
            {
              rolePermission['Feedback'] && (
                <li className="bg-gray-100 rounded-lg py-4">
                  <a href="/send-feedback" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                    <AlertTriangle size={20} />
                    <p>Feedback</p>
                  </a>
                </li>
              )
            }
            <li className="bg-gray-100 rounded-lg py-4">
              <a href="/about" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                <FileMinus size={20} />
                <p>About</p>
              </a>
            </li>
          </ul>
        </div>
        <div className="calendar-wrapper h-full">
          <Calendar
            onChange={onChange}
            value={value}
            calendarType="gregory"
            tileClassName={({ date, view }) =>
              value.toDateString() === date.toDateString() ? 'selected-tile' : null
            }
          />
        </div>
      </div>

      {/* Dashboard Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <UserPlus className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">{data?.totalRegistration}</p>
          <p className="text-sm text-gray-500">Total Registration</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Car className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">{data?.totalSAAO}</p>
          <p className="text-sm text-gray-500">Total SAAO</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Tractor className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">{data?.totalFarmer}</p>
          <p className="text-sm text-gray-500">Total Farmer</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
          <p className="text-2xl font-bold text-red-500">{data?.totalFeedback}</p>
          <p className="text-sm text-gray-500">Total Feedback</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <User className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">{data?.totalUAO}</p>
          <p className="text-sm text-gray-500">Total UAO</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <ShieldCheck className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">{data?.totalDD}</p>
          <p className="text-sm text-gray-500">Total DD</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <User className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">{data?.totalAD || 0}</p>
          <p className="text-sm text-gray-500">Total AD</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Microscope className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">{data?.totalScientists || 0}</p>
          <p className="text-sm text-gray-500">Total Scientists</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Newspaper className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">{data?.totalJournalists || 0}</p>
          <p className="text-sm text-gray-500">Total Journalists</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Leaf className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">{data?.totalProgressiveFarmer || 0}</p>
          <p className="text-sm text-gray-500">Total Progressive Farmer</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

