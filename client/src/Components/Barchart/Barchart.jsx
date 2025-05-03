import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

export default function Barchart() {
  const [rainfallData, setRainfallData] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    fetch('https://iinms.brri.gov.bd/api/weather/rainfall?lat=21.1&lon=88.1')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const formattedDates = Object.keys(data.rainfall).map((date) => {
          return new Date(date).toLocaleDateString('en-US');
        });

        const values = Object.values(data.rainfall).map(value => parseFloat(value.toFixed(3)));

        setDates(formattedDates);
        setRainfallData(values);
      })
      .catch((error) => console.error('Error fetching rainfall data:', error));
  }, []);

  const options = {
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 0,
      },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: rainfallData,
        type: 'bar',
        itemStyle: {
          color: '#73C0DE',
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Rainfall (mm)</h2>
      <div className='flex flex-col md:flex-row lg:flex-row'>
        <div className='w-full md:w-2/3 lg:w-2/3'>
          <ReactECharts option={options} style={{ height: 400, width: '100%' }} />
        </div>
        {/* Rainfall Data Table */}
        <div className='w-full md:w-1/3 lg:w-1/3'>
          <table className="w-full mt-6 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Rainfall (mm)</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((date, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{date}</td>
                  <td className="border border-gray-300 px-4 py-2">{rainfallData[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
