'use client';

import React, { useState } from 'react';
import LoginForm from '@/components/login';
import RegisterForm from '@/components/register';
import ForgotPasswordForm from './auth/forgot-password-form';

type AuthView = 'login' | 'register' | 'forgot-password';

export default function AuthContainer() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm 
            onForgotPassword={() => setCurrentView('forgot-password')}
          />
        );
      case 'register':
        return (
          <RegisterForm 
            onBack={() => setCurrentView('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm 
            onBack={() => setCurrentView('login')}
          />
        );
      default:
        return <LoginForm onForgotPassword={() => setCurrentView('forgot-password')} />;
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* Header avec logo OCP */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success rounded-circle mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <span className="text-white fw-bold fs-3">OCP</span>
              </div>
              <h1 className="h3 text-dark mb-1">OCP Sport</h1>
              <p className="text-muted">Plateforme de gestion sportive</p>
            </div>

            {/* Navigation tabs */}
            {currentView !== 'forgot-password' && (
              <div className="row justify-content-center mb-4">
                <div className="col-md-6 col-lg-4">
                  <ul className="nav nav-pills nav-justified" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${currentView === 'login' ? 'active' : ''}`}
                        onClick={() => setCurrentView('login')}
                        type="button"
                      >
                        Connexion
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${currentView === 'register' ? 'active' : ''}`}
                        onClick={() => setCurrentView('register')}
                        type="button"
                      >
                        Inscription
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Contenu principal */}
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </div>
  );
}
