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

const BarChart = ({ etiquettes, donnees, titre, libelle, couleur, additionalDatasets = [] }) => {
  const data = {
    labels: etiquettes,
    datasets: [
      {
        label: libelle,
        data: donnees,
        backgroundColor: couleur || 'rgba(52, 152, 219, 0.7)',
        borderRadius: 8,
      },
      ...additionalDatasets.map(ds => ({
        ...ds,
        borderRadius: 8,
      }))
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        onClick: () => {},
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: !!titre,
        text: titre,
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;
