import ReactApexChart from 'react-apexcharts';
import TemperatureTable from '../TemperatureTable/TemperatureTable';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns'
import { useState } from 'react';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import dayjs from 'dayjs';

// Sample JSON data
const jsonData = [
  { date: '2023-01-01', value: 20 },
  { date: '2023-01-02', value: 25 },
  { date: '2023-01-03', value: 30 },
  { date: '2023-01-04', value: 22 },
  { date: '2023-01-05', value: 28 },
];
// Convert JSON data to series format
const seriesData = jsonData.map((item) => ({
  x: item.date,
  y: item.value,
}));

const ApexChart = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputClick = () => {
    setShowDatePicker((prev) => !prev);
  };

  const handleDateChange = (item) => {
    setState([item.selection]);
    setShowDatePicker(false); // Close date picker after selection
  };
  const chartData = {
    series: [
      {
        name: 'Temperature',
        data: seriesData,
      },
    ],
    options: {
      chart: {
        id: 'temperature-chart',
        type: 'line',
        height: 500,
      },
      colors: ['#f70404'],
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      markers: {
        size: 8,
        colors: ['#f70404'],
        strokeColor: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
          sizeOffset: 3,
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          rotate: 0,
          style: {
            fontSize: '12px',
          },
          formatter: function (value) {
            // Use dayjs to format the date
            return dayjs(value).format('YYYY-MM-DD');
          },
        },
        title: {
          text: ' ',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
        },
      },

      yaxis: {
        title: {
          text: 'Temperature (°C)',
          offsetX: -7,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px',
          },
        },
      },
      tooltip: {
        x: {
          format: 'yyyy-MM-dd',
        },
      },
    },
  };
  const chartData1 = {
    series: [
      {
        name: 'Temperature',
        data: seriesData,
      },
    ],
    options: {
      chart: {
        id: 'temperature-chart',
        type: 'line',
        height: 500,
      },
      colors: ['#008FFB'],
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      markers: {
        size: 8,
        colors: ['#008FFB'],
        strokeColor: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
          sizeOffset: 3,
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          rotate: 0,
          style: {
            fontSize: '12px',
          },
          formatter: function (value) {
            // Use dayjs to format the date
            return dayjs(value).format('YYYY-MM-DD');
          },
        },
        title: {
          text: ' ',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Water Level (cm)',
          offsetX: -7,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px',
          },
        },
      },
      tooltip: {
        x: {
          format: 'yyyy-MM-dd',
        },
      },
    },
  };
  const chartData2 = {
    series: [
      {
        name: 'Temperature',
        data: seriesData,
      },
    ],
    options: {
      chart: {
        id: 'temperature-chart',
        type: 'line',
        height: 500,
      },
      colors: ['#bcad98'],
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      markers: {
        size: 8,
        colors: ['#bcad98'],
        strokeColor: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
          sizeOffset: 3,
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          rotate: 0,
          style: {
            fontSize: '12px',
          },
          formatter: function (value) {
            // Use dayjs to format the date
            return dayjs(value).format('YYYY-MM-DD');
          },
        },
        title: {
          text: ' ',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
        },
      },

      yaxis: {
        title: {
          text: 'Soil Moisture (%)',
          offsetX: -7,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px',
          },
        },
      },
      tooltip: {
        x: {
          format: 'yyyy-MM-dd',
        },
      },
    },
  };

  return (
    <div>
      <div id="wrapper" className="relative bg-white p-4 shadow-md rounded-md">
        <div className='flex '>
          <div>
            <h1 className='font-semibold text-xl ml-3'>Temperature</h1>
            <h1 className='font-semibold ml-4'>Unit: °C</h1>
          </div>
          <div className=" ml-[465px]">
            <input
              value={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
              type="text"
              readOnly
              placeholder="Search..."
              className="search-input border p-2 rounded w-full text-center"
              onClick={handleInputClick}
            />
          </div>
        </div>
        {showDatePicker && (
          <div className="absolute z-[1000] bg-white shadow-lg">
            <DateRangePicker
              onChange={handleDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={state}
              direction="horizontal"
            />
          </div>
        )}
        <div className="chart h-[500px] flex gap-14 mt-5" id="chart-line">
          <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={450} width={800} />
          <div>
            <h1 className="text-center text-lg font-semibold mt-[-10px]  mb-4">Daily Temperature (°C)</h1>
            <TemperatureTable />
          </div>
        </div>
      </div>
      <div id="wrapper" className="bg-white p-4 shadow-md rounded-md mt-5">
        <div className='flex '>
          <div>
            <h1 className='font-semibold text-xl ml-3'>Water Level </h1>
            <h1 className='font-semibold ml-3'>Unit: cm</h1>
          </div>
          <div className=" ml-[480px]">
            <input
              value={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
              type="text"
              readOnly
              placeholder="Search..."
              className="search-input border p-2 rounded w-full text-center"
              onClick={handleInputClick}
            />
          </div>
        </div>
        {showDatePicker && (
          <div className="absolute z-[1000] bg-white shadow-lg">
            <DateRangePicker
              onChange={handleDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={state}
              direction="horizontal"
            />
          </div>
        )}
        <div className="chart h-[500px] flex gap-14 mt-5" id="chart-line">
          <ReactApexChart options={chartData1.options} series={chartData1.series} type="line" height={450} width={800} />
          <div>
            <h1 className="text-center text-lg font-semibold mt-[-10px]  mb-4">Water Level (cm) </h1>
            <TemperatureTable />
          </div>
        </div>
      </div>
      <div id="wrapper" className="bg-white p-4 shadow-md rounded-md mt-5">
        <div className='flex '>
          <div>
            <h1 className='font-semibold text-xl ml-3'>Soil Moisture </h1>
            <h1 className='font-semibold ml-3'>Unit: %</h1>
          </div>
          <div className=" ml-[465px]">
            <input
              value={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
              type="text"
              readOnly
              placeholder="Search..."
              className="search-input border p-2 rounded w-full text-center"
              onClick={handleInputClick}
            />
          </div>
        </div>
        {showDatePicker && (
          <div className="absolute z-[1000] bg-white shadow-lg">
            <DateRangePicker
              onChange={handleDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={state}
              direction="horizontal"
            />
          </div>
        )}
        <div className="chart h-[500px] flex gap-14 mt-5" id="chart-line">
          <ReactApexChart options={chartData2.options} series={chartData2.series} type="line" height={450} width={800} />
          <div>
            <h1 className="text-center text-lg font-semibold mt-[-10px]  mb-4">Soil Moisture (%) </h1>
            <TemperatureTable />
          </div>
        </div>
      </div>
      <div id="wrapper" className="bg-white p-4 shadow-md rounded-md mt-5">
        <div className='flex '>
          <div>
            <h1 className='font-semibold text-xl ml-3'>Soil Temperature </h1>
            <h1 className='font-semibold ml-3'>Unit: oC</h1>
          </div>
          <div className=" ml-[465px]">
            <input
              value={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
              type="text"
              readOnly
              placeholder="Search..."
              className="search-input border p-2 rounded w-full text-center"
              onClick={handleInputClick}
            />
          </div>
        </div>
        {showDatePicker && (
          <div className="absolute z-[1000] bg-white shadow-lg">
            <DateRangePicker
              onChange={handleDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={state}
              direction="horizontal"
            />
          </div>
        )}
        <div className="chart h-[500px] flex gap-14 mt-5" id="chart-line">
          <ReactApexChart options={chartData2.options} series={chartData2.series} type="line" height={450} width={800} />
          <div>
            <h1 className="text-center text-lg font-semibold mt-[-10px]  mb-4">Soil Temperature(oC) </h1>
            <TemperatureTable />
          </div>
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
