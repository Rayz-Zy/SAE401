import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function DataInsights({ stats }) {
  if (!stats || !stats.length) return null;

  const generateInsights = () => {
    const insights = [];
    const latest = stats[stats.length - 1];
    const previous = stats.length > 1 ? stats[stats.length - 2] : null;

    // Insight: Housing Vacancy
    const vacancy = parseFloat(latest.tauxDeLogementsVacants);
    if (vacancy > 10) {
      insights.push({
        type: 'warning',
        text: `Taux de vacance élevé (${vacancy}%). C'est au-dessus de la moyenne nationale recommandée.`,
        icon: <Info size={18} color="#e67e22" />
      });
    }

    // Insight: Population Trend
    if (previous) {
      const popDiff = latest.nombreHabitants - previous.nombreHabitants;
      if (popDiff > 0) {
        insights.push({
          type: 'positive',
          text: `La population a augmenté de ${popDiff.toLocaleString()} habitants par rapport à l'année précédente.`,
          icon: <TrendingUp size={18} color="#27ae60" />
        });
      } else if (popDiff < 0) {
        insights.push({
          type: 'negative',
          text: `Baisse de la population de ${Math.abs(popDiff).toLocaleString()} habitants.`,
          icon: <TrendingDown size={18} color="#e74c3c" />
        });
      }
    }

    // Insight: Poverty Rate
    const poverty = parseFloat(latest.tauxPauvrete);
    if (poverty > 15) {
      insights.push({
        type: 'info',
        text: `Attention : Taux de pauvreté de ${poverty}%. Un suivi social renforcé pourrait être nécessaire.`,
        icon: <Lightbulb size={18} color="#f1c40f" />
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (insights.length === 0) return (
    <div className="dashboard-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#95a5a6', fontSize: '0.9rem' }}>Pas d'insights particuliers pour cette période.</p>
    </div>
  );

  return (
    <div className="dashboard-card" style={{ padding: '24px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.1rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Lightbulb size={20} color="#f1c40f" />
        Insights Flash
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {insights.map((insight, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: '#f8f9fa', borderRadius: '12px', fontSize: '0.9rem', lineHeight: '1.4' }}>
            <div style={{ marginTop: '2px' }}>{insight.icon}</div>
            <span style={{ color: '#34495e' }}>{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
