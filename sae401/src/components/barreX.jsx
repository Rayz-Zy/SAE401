import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

class BarChartX extends Component {
  render() {
    const unemploymentData = [6.0, 5.9, 5.4];
    const povertyData = [10.3, 10.5, 10.5];

    const data = {
      labels: ['2021', '2022', '2023'],
      datasets: [
        {
          label: 'Taux de chômage en Ain (%)',
          data: unemploymentData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y',
        },
        {
          label: 'Taux de pauvreté en Ain (%)',
          data: povertyData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1',
        }
      ]
    };

    const options = {
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Taux de chômage (%)',
            color: 'rgba(255, 99, 132, 1)',
          },
          ticks: {
            color: 'rgba(255, 99, 132, 1)',
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Taux de pauvreté (%)',
            color: 'rgba(54, 162, 235, 1)',
          },
          ticks: {
            color: 'rgba(54, 162, 235, 1)',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: 'Indicateurs sociaux en Ain'
        }
      }
    };

    return <Line data={data} options={options} />;
  }
}

export default BarChartX;