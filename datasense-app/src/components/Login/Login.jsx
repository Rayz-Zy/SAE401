import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Loader2, UserPlus, User } from 'lucide-react';
import './Login.css';
import logo from '../../assets/logo.svg';

export default function Login({ onLoginSuccess, onSkip }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (isRegisterMode && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    const endpoint = isRegisterMode ? 'register' : 'login';

    try {
      const body = isRegisterMode 
        ? { email, password, firstName, lastName }
        : { email, password };

      const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegisterMode) {
          setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
          setIsRegisterMode(false);
          setPassword('');
          setConfirmPassword('');
        } else {
          onLoginSuccess(data);
        }
      } else {
        setError(data.message || (isRegisterMode ? 'Erreur lors de l\'inscription' : 'Identifiants invalides'));
      }
    } catch (_err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side: Authentication Form */}
        <div className="login-form-side">
          <div className="login-card-content">
            <h1>{isRegisterMode ? 'Inscription' : 'Connexion'}</h1>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="login-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="login-success">
                  <AlertCircle size={18} />
                  <span>{success}</span>
                </div>
              )}

              {isRegisterMode && (
                <div className="name-row">
                  <div className="input-group" style={{ flex: 1 }}>
                    <label htmlFor="lastName">Nom</label>
                    <div className="input-wrapper">
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Dupont"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={isRegisterMode}
                      />
                    </div>
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label htmlFor="firstName">Prénom</label>
                    <div className="input-wrapper">
                      <input
                        id="firstName"
                        type="text"
                        placeholder="Jean"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={isRegisterMode}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {isRegisterMode && (
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <div className="input-wrapper">
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="spinner" size={20} />
                ) : (
                  isRegisterMode ? 'S\'inscrire' : 'Se connecter'
                )}
              </button>

              
              <div className="login-divider">
                <span>OU</span>
              </div>

              <button type="button" className="mode-toggle-button" onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
                setSuccess(null);
              }}>
                {isRegisterMode ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer une session'}
              </button>

              {!isRegisterMode && (
                <button type="button" className="skip-button" onClick={onSkip} disabled={isLoading}>
                  Continuer sans se connecter
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Side: Branding Content */}
        <div className="login-brand-side">
          <img src={logo} alt="DataSense Branding" className="brand-logo" />
        </div>
      </div>
    </div>
  );
}
