import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

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

/**
 * Mixed Chart component combining Bar and Line datasets.
 * Features dual Y-axes for different scales.
 */
const MixedChart = ({ etiquettes, donneesBar, donneesLine, libelleBar, libelleLine, titre, couleurBar = 'rgba(52, 152, 219, 0.7)', couleurLine = 'rgba(231, 76, 60, 1)' }) => {
  const data = {
    labels: etiquettes,
    datasets: [
      {
        type: 'bar',
        label: libelleBar,
        data: donneesBar,
        backgroundColor: couleurBar,
        borderRadius: 6,
        yAxisID: 'y',
        order: 2, // Higher order renders behind
      },
      {
        type: 'line',
        label: libelleLine,
        data: donneesLine,
        borderColor: couleurLine,
        backgroundColor: couleurLine.replace('1)', '0.1)'),
        borderWidth: 4, // More prominent line
        pointRadius: 6, // Larger points
        pointBackgroundColor: couleurLine,
        tension: 0.4,
        yAxisID: 'y1',
        order: 1, // Lower order renders on top
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
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
      tooltip: {
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: libelleBar,
          font: {
            size: 11
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: libelleLine,
          font: {
            size: 11
          }
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
        ticks: {
           callback: function(value) {
             return value + '%';
           }
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
    <div style={{ height: '350px', width: '100%' }}>
      <Chart type='bar' data={data} options={options} />
    </div>
  );
};

export default MixedChart;
