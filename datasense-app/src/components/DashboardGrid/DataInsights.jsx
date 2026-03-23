import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function DataInsights({ stats }) {
  if (!stats || !stats.length) return null;

  const insights = [];
  const latest = stats[stats.length - 1];
  const previous = stats.length > 1 ? stats[stats.length - 2] : null;
  const year = latest.anneePublication || 2023;

  // Insight: Housing Vacancy
  const vacancy = parseFloat(latest.tauxDeLogementsVacants);
  if (vacancy > 10) {
    insights.push({
      text: `Logements vacants (${year}) : ${vacancy}%`,
      icon: <Info size={14} color="#e67e22" />
    });
  }

  // Insight: Population Trend
  if (previous) {
    const popDiff = latest.nombreHabitants - previous.nombreHabitants;
    const prevYear = previous.anneePublication || year - 1;
    if (popDiff > 0) {
      insights.push({
        text: `Pop. (${prevYear} ➝ ${year}) : +${popDiff.toLocaleString()} hab.`,
        icon: <TrendingUp size={14} color="#27ae60" />
      });
    } else if (popDiff < 0) {
      insights.push({
        text: `Pop. (${prevYear} ➝ ${year}) : -${Math.abs(popDiff).toLocaleString()} hab.`,
        icon: <TrendingDown size={14} color="#e74c3c" />
      });
    }
  }

  // Insight: Poverty Rate
  const poverty = parseFloat(latest.tauxPauvrete);
  if (poverty > 15) {
    insights.push({
      text: `Taux de pauvreté (${year}) : ${poverty}%`,
      icon: <Lightbulb size={14} color="#f1c40f" />
    });
  }

  // Insight: Logements Sociaux
  const social = parseFloat(latest.tauxLogementsSociaux);
  if (social < 10) {
    insights.push({
      text: `Parc social faible (${year}) : ${social}%`,
      icon: <Info size={14} color="#e74c3c" />
    });
  } else if (social > 20) {
    insights.push({
      text: `Parc social fort (${year}) : ${social}%`,
      icon: <Info size={14} color="#27ae60" />
    });
  }

  // Insight: Passoires thermiques
  const energivores = parseFloat(latest.parcSocialTauxLogementsEnergivores);
  if (energivores > 15) {
    insights.push({
      text: `Énergivores (${year}) : ${energivores}%`,
      icon: <Info size={14} color="#e74c3c" />
    });
  }

  // We show up to 3 insights
  const displayedInsights = insights.slice(0, 3);

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
