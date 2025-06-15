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

const ChartComponent = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
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
        max: 90,
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
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Monthly Data Histogram</h1>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartComponent;