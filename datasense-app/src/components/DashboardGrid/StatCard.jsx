import React from 'react';
import './StatCard.css';

/**
 * Composant de présentation pour afficher une statistique clé (KPI).
 * Reçoit les données formatées et les affiche avec une unité et une icône.
 * 
 * @param {string} libelle - Le titre de la statistique (ex: "Population")
 * @param {number} valeur - Le chiffre à afficher
 * @param {string} unite - L'unité associée (ex: "hab.", "%")
 * @param {number} annee - L'année de référence du donnée
 * @param {ReactNode} icone - L'icône Lucide à afficher
 * @param {string} couleur - La couleur thématique de la carte
 */
const StatCard = ({ libelle, valeur, unite, annee, icone, couleur, isRef = false }) => {
    // Formate les grands nombres avec des espaces pour la lisibilité
    const est_nombre = typeof valeur === 'number';
    
    const formater_valeur = (val) => {
        if (!est_nombre) return val;
        return new Intl.NumberFormat('fr-FR').format(val);
    };

    return (
        <div className={`stat-card ${isRef ? 'ref-card' : ''}`} style={{ borderLeft: `4px solid ${couleur || '#3498db'}` }}>
            <div className="stat-card-content" style={{ width: '100%' }}>
                <div className="stat-card-header">
                    <span className="stat-card-label">{libelle}</span>
                    {annee && <span className="stat-card-year">{annee}</span>}
                </div>
                <div className="stat-card-body" style={{ display: 'flex', flexDirection: est_nombre ? 'row' : 'column', alignItems: est_nombre ? 'baseline' : 'flex-start' }}>
                    <span className={est_nombre ? "stat-card-value" : "stat-card-text"}>
                        {formater_valeur(valeur)}
                    </span>
                    {unite && <span className="stat-card-unit">{unite}</span>}
                </div>
            </div>
            {icone && <div className="stat-card-icon" style={{ color: couleur }}>{icone}</div>}
        </div>
    );
};

export default StatCard;
