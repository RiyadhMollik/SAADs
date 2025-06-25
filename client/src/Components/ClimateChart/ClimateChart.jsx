import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const ClimateChart = () => {
  useEffect(() => {
    const ctx = document.getElementById('climateChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: 'Rainfall',
            data: [10, 20, 30, 50, 100, 300, 350, 200, 150, 80, 20, 10],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Max Temperature',
            data: [25, 27, 30, 32, 33, 35, 34, 33, 32, 30, 28, 26],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
            type: 'line',
            fill: false
          },
          {
            label: 'Min Temperature',
            data: [15, 16, 18, 20, 22, 24, 25, 24, 23, 21, 18, 16],
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderWidth: 1,
            type: 'line',
            fill: false
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, []);

  return <canvas id="climateChart" width="400" height="200"></canvas>;
};

export default ClimateChart;