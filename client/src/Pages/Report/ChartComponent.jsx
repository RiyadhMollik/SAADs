import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data, locationType }) => {
  // Calculate max value for y-axis (rounded up to nearest 10)
  const maxCount = data.length > 0 ? Math.ceil(Math.max(...data.map(item => item.count)) / 10) * 10 : 90;

  const chartData = {
    labels: data.map(item => item[locationType] || 'Unknown'),
    datasets: [
      {
        label: `Number of Farmers by ${locationType.charAt(0).toUpperCase() + locationType.slice(1)}`,
        data: data.map(item => item.count),
        backgroundColor: [
          'rgba(255, 182, 193, 0.8)', // Light Pink
          'rgba(255, 218, 185, 0.8)', // Peach
          'rgba(255, 228, 181, 0.8)', // Light Orange
          'rgba(173, 216, 230, 0.8)', // Light Cyan
          'rgba(135, 206, 235, 0.8)', // Sky Blue
          'rgba(147, 112, 219, 0.8)', // Medium Purple
          'rgba(211, 211, 211, 0.8)', // Light Gray
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: maxCount,
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
      title: {
        display: true,
        text: `Farmer Distribution by ${locationType.charAt(0).toUpperCase() + locationType.slice(1)}`,
        font: {
          size: 24,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;