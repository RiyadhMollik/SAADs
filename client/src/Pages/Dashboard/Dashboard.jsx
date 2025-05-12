import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import { FilePlus, FileMinus, User, Car, Truck, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const [value, onChange] = useState(new Date());
  const formattedDate = value.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-8">
        <div className='bg-white rounded-lg px-4 py-3 shadow-lg w-full min-h-[330px]'>
          <p className="text-lg font-semibold mb-4">Quick Links</p>
          <ul className="grid grid-cols-3 gap-4 text-xs">
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
          <User className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">1</p>
          <p className="text-sm text-gray-500">Total Requisition</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <FilePlus className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">0</p>
          <p className="text-sm text-gray-500">New Requisition</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Car className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">43</p>
          <p className="text-sm text-gray-500">Available Vehicles</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Truck className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">44</p>
          <p className="text-sm text-gray-500">Total Vehicles</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <AlertTriangle className="mx-auto mb-2 text-red-500" size={32} />
          <p className="text-2xl font-bold text-red-500">0</p>
          <p className="text-sm text-gray-500">Emergency</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <FileMinus className="mx-auto mb-2 text-red-500" size={32} />
          <p className="text-2xl font-bold text-red-500">0</p>
          <p className="text-sm text-gray-500">Declined Requisition</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <User className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">0</p>
          <p className="text-sm text-gray-500">Available Drivers</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <User className="mx-auto mb-2 text-teal-500" size={32} />
          <p className="text-2xl font-bold text-teal-500">0</p>
          <p className="text-sm text-gray-500">Total Drivers</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

