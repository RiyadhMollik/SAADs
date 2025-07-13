import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data, locationType }) => {
  const chartRef = useRef(null);

  // Calculate max value and steps for evenly spaced Y-axis
  const maxValue = data.length > 0 ? Math.max(...data.map((item) => item.count)) : 0;
  const divisions = 5; // You can set this to 6 if preferred
  const stepSize = Math.ceil(maxValue / divisions);
  const suggestedMax = stepSize * divisions;

  const chartData = {
    labels: data.map((item) => item[locationType] || 'Unknown'),
    datasets: [
      {
        type: 'bar',
        label: 'Number of Farmers',
        data: data.map((item) => item.count),
        backgroundColor: '#2caffe',
        borderColor: '#2caffe',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: suggestedMax,
        ticks: {
          stepSize: stepSize,
          count: divisions + 1,
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Number of Farmers',
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value}`;
          },
        },
      },
      title: {
        display: true,
        text: `Number of Farmers by ${locationType.charAt(0).toUpperCase() + locationType.slice(1)}`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        color: '#333',
      },
      datalabels: {
        display: false,
      },
    },
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'farmer-distribution-chart.png';
    link.href = chartRef.current.toBase64Image();
    link.click();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-lg sm:text-xl font-semibold"></h2>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Download
        </button>
      </div>
      <div className="h-64 sm:h-96">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ChartComponent;
