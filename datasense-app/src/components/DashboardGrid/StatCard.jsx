import React from 'react';
import './StatCard.css';

const StatCard = ({ libelle, valeur, unite, annee, icone, couleur }) => {
    // Formate les grands nombres avec des espaces
    const formater_valeur = (val) => {
        if (typeof val !== 'number') return val;
        return new Intl.NumberFormat('fr-FR').format(val);
    };

    return (
        <div className="stat-card" style={{ borderLeft: `4px solid ${couleur || '#3498db'}` }}>
            <div className="stat-card-content">
                <div className="stat-card-header">
                    <span className="stat-card-label">{libelle}</span>
                    {annee && <span className="stat-card-year">{annee}</span>}
                </div>
                <div className="stat-card-body">
                    <span className="stat-card-value">{formater_valeur(valeur)}</span>
                    {unite && <span className="stat-card-unit">{unite}</span>}
                </div>
            </div>
            {icone && <div className="stat-card-icon" style={{ color: couleur }}>{icone}</div>}
        </div>
    );
};

export default StatCard;
