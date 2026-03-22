import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function DataInsights({ stats }) {
  if (!stats || !stats.length) return null;

  const insights = [];
  const latest = stats[stats.length - 1];
  const previous = stats.length > 1 ? stats[stats.length - 2] : null;

  // Insight: Housing Vacancy
  const vacancy = parseFloat(latest.tauxDeLogementsVacants);
  if (vacancy > 10) {
    insights.push({
      text: `Vacance : ${vacancy}% (Elevé)`,
      icon: <Info size={14} color="#e67e22" />
    });
  }

  // Insight: Population Trend
  if (previous) {
    const popDiff = latest.nombreHabitants - previous.nombreHabitants;
    if (popDiff > 0) {
      insights.push({
        text: `Pop. : +${popDiff.toLocaleString()} hab.`,
        icon: <TrendingUp size={14} color="#27ae60" />
      });
    } else if (popDiff < 0) {
      insights.push({
        text: `Pop. : -${Math.abs(popDiff).toLocaleString()} hab.`,
        icon: <TrendingDown size={14} color="#e74c3c" />
      });
    }
  }

  // Insight: Poverty Rate
  const poverty = parseFloat(latest.tauxPauvrete);
  if (poverty > 15) {
    insights.push({
      text: `Pauvreté : ${poverty}%`,
      icon: <Lightbulb size={14} color="#f1c40f" />
    });
  }

  // We only show the first 2 insights to keep it compact
  const displayedInsights = insights.slice(0, 2);

  if (displayedInsights.length === 0) return <span>Aucun insight.</span>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
      {displayedInsights.map((insight, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>{insight.icon}</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#2c3e50' }}>{insight.text}</span>
        </div>
      ))}
    </div>
  );
}
