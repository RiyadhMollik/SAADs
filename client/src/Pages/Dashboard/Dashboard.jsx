import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import { FilePlus, FileMinus, User, Car, Truck, AlertTriangle, CheckCircle, BarChart2, Users, UserPlus, Tractor, AlertCircle, FileText } from 'lucide-react';

const Dashboard = () => {
  const [value, onChange] = useState(new Date());
  const formattedDate = value.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center mb-8">
        <div className='bg-white rounded-lg px-4 py-3 shadow-lg w-full min-h-[330px]'>
          <p className="text-lg font-semibold mb-4">Quick Links</p>
          <ul className="grid grid-cols-3 gap-4 text-xs text-center">
            <li className="bg-gray-100 rounded-lg py-4">
              <a href="#" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                <FilePlus size={20} />
                <p>AD Registration</p>
              </a>
            </li>
            <li className="bg-gray-100 rounded-lg py-4">
              <a href="#" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                <FilePlus size={20} />
                <p>DD Registration</p>
              </a>
            </li>
            <li className="bg-gray-100 rounded-lg py-4">
              <a href="#" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                <FilePlus size={20} />
                <p>UAO Registration</p>
              </a>
            </li>
            <li className="bg-gray-100 rounded-lg py-4">
              <a href="#" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                <FilePlus size={20} />
                <p>SAAO Registration</p>
              </a>
            </li>
            <li className="bg-gray-100 rounded-lg py-4">
              <a href="#" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                <FilePlus size={20} />
                <p>Farmer Registration</p>
              </a>
            </li>
            <li className="bg-gray-100 rounded-lg py-4">
              <a href="#" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                <BarChart2 size={20} />
                <p>Report</p>
              </a>
            </li>
            <li className="bg-gray-100 rounded-lg py-4">
              <a href="#" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
                <AlertTriangle size={20} />
                <p>Feedback</p>
              </a>
            </li>
            <li className="bg-gray-100 rounded-lg py-4">
              <a href="#" className="flex flex-col justify-center items-center gap-2 text-teal-500 hover:text-teal-700">
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
          <p className="text-2xl font-bold text-teal-500">1</p>
          <p className="text-sm text-gray-500">Total Registration</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <FilePlus className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">0</p>
          <p className="text-sm text-gray-500">New Registration</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Car className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">43</p>
          <p className="text-sm text-gray-500">Total SAAO</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Tractor className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">44</p>
          <p className="text-sm text-gray-500">Total Farmer</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
          <p className="text-2xl font-bold text-red-500">0</p>
          <p className="text-sm text-gray-500">Total Feedback</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <FileText className="mx-auto mb-2 text-red-500" size={32} />
          <p className="text-2xl font-bold text-red-500">0</p>
          <p className="text-sm text-gray-500">Active SAAO</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <User className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">0</p>
          <p className="text-sm text-gray-500">Total UAO</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Users className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">0</p>
          <p className="text-sm text-gray-500">Total DD</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

