import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const DoughnutChart = ({ etiquettes, donnees, titre, couleurs }) => {
  const data = {
    labels: etiquettes,
    datasets: [
      {
        data: donnees,
        backgroundColor: couleurs || [
          '#3498db',
          '#e67e22',
          '#95a5a6',
          '#9b59b6',
          '#2ecc71'
        ],
        borderWidth: 0,
        hoverOffset: 10
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        onClick: () => {},
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      title: {
        display: !!titre,
        text: titre,
        font: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold'
        },
        padding: {
          bottom: 10
        }
      },
    },
  };

  return (
    <div style={{ height: '250px', width: '100%' }}>
      <Doughnut options={options} data={data} />
    </div>
  );
};

export default DoughnutChart;
