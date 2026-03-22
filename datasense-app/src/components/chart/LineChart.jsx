import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Composant pour afficher un graphique d'évolution temporel (Line Chart).
 * Utilise la bibliothèque Chart.js via react-chartjs-2.
 * 
 * @param {Array} etiquettes - Les labels de l'axe X (les années)
 * @param {Array} donnees - Les valeurs de l'axe Y (les chiffres)
 * @param {string} titre - Le titre affiché au-dessus du graphique
 * @param {string} libelle - Le texte affiché dans la légende
 * @param {string} couleur - La couleur de la ligne et du remplissage
 */
const LineChart = ({ etiquettes, donnees, titre, libelle, couleur = 'rgba(54, 162, 235, 1)', additionalDatasets = [], fill = false }) => {
  // Préparation de l'objet de données formaté pour Chart.js
  const donnees_graphique = {
    labels: etiquettes,
    datasets: [
      {
        label: libelle || titre,
        data: donnees,
        borderColor: couleur,
        backgroundColor: couleur.replace('1)', '0.1)'),
        fill: fill,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
      ...additionalDatasets.map(ds => ({
        ...ds,
        fill: fill,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3,
      }))
    ],
  };

  const options_graphique = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: !!titre,
        text: titre,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
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
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line data={donnees_graphique} options={options_graphique} />
    </div>
  );
};

export default LineChart;
