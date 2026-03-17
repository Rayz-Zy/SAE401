import React from 'react';
import { User, Mail, Shield, ArrowLeft } from 'lucide-react';
import './Profile.css';

export default function Profile({ user, onBack }) {
  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
      </div>

      <div className="profile-content-wrapper">
        <h1 className="profile-title-outside">Mon Profil</h1>
        <div className="profile-card">
          
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <div className="profile-name-info">
              <h2>{user.firstName} {user.lastName}</h2>
              <span className="profile-badge">{user.roles?.[0] === 'GUEST' ? 'Invité' : 'Utilisateur'}</span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <div className="detail-icon">
                <User size={20} />
              </div>
              <div className="detail-content">
                <label>Prénom</label>
                <span>{user.firstName}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <User size={20} />
              </div>
              <div className="detail-content">
                <label>Nom</label>
                <span>{user.lastName}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Mail size={20} />
              </div>
              <div className="detail-content">
                <label>Adresse Email</label>
                <span>{user.user}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Shield size={20} />
              </div>
              <div className="detail-content">
                <label>Rôle</label>
                <span>{user.roles?.[0] || 'Utilisateur'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-footer">
          <p>Ce compte est rattaché à l'application DataSense.</p>
        </div>
      </div>
    </div>
  );
}
