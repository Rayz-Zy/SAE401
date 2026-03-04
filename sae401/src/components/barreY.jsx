import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

class BarChartY extends Component {
  render() {
    const data = {
      labels: ['A', 'B', 'C'],
      datasets: [{
        label: 'Données',
        data: [this.props.var1, this.props.var2, this.props.var3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }]
    };

    const options = {
      indexAxis: 'y', // Inverse les axes : x devient vertical
      scales: {
        x: { beginAtZero: true },
      }
    };

    return <Bar data={data} options={options} />;
  }
}

export default BarChartY;