// src/components/BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ dataSet1, dataSet2, dataSet3, labels, title }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Données 1',
        data: dataSet1,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Données 2',
        data: dataSet2,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      ...(dataSet3 ? [{
        label: 'Données 3',
        data: dataSet3,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }] : []),
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
