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
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ChartComponent = ({ data, locationType }) => {
  const chartRef = useRef(null);

  const maxCount =
    data.length > 0 ? Math.ceil(Math.max(...data.map((item) => item.count)) / 10) * 10 : 90;

  const chartData = {
    labels: data.map((item) => item[locationType] || 'Unknown'),
    datasets: [
      {
        type: 'bar',
        label: 'Number of Farmers',
        data: data.map((item) => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        type: 'line',
        label: 'Trend Line',
        data: data.map((item) => item.count),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.4, // Smooth the line
        pointRadius: 3,
      },
    ],
  };

  const options = {
    indexAxis: 'x',
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: locationType.charAt(0).toUpperCase() + locationType.slice(1),
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        max: maxCount,
        title: {
          display: true,
          text: 'Number of Farmers',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
      title: {
        display: true,
        text: `Farmer Distribution by ${locationType.charAt(0).toUpperCase() + locationType.slice(1)}`,
        font: {
          size: 22,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        color: '#333',
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold"></h2>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PNG
        </button>
      </div>
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
