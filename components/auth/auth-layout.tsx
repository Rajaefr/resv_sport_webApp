'use client';

import React from 'react';
import { Trophy, Calendar, Users, Target, Shield, Sparkles, Award } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="welcome-split-layout">
      {/* Left Section: Marketing/Brand */}
      <div className="welcome-marketing-section">
        <div className="welcome-marketing-content">
          
          <h1 className="welcome-title">
            OCP Sport
          </h1>
          <p className="welcome-subtitle">
            Votre plateforme complète pour la gestion sportive moderne.
            Réservez, gérez et excellez dans vos activités sportives.
          </p>

          <div className="welcome-feature-grid">
            <div className="welcome-feature-card">
              <div className="welcome-feature-icon-wrapper">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <h6 className="welcome-feature-title">Réservations</h6>
                <small className="welcome-feature-description">Installations sportives</small>
              </div>
            </div>
            <div className="welcome-feature-card">
              <div className="welcome-feature-icon-wrapper">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h6 className="welcome-feature-title">Équipes</h6>
                <small className="welcome-feature-description">Gestion complète</small>
              </div>
            </div>
            <div className="welcome-feature-card">
              <div className="welcome-feature-icon-wrapper">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <h6 className="welcome-feature-title">Performance</h6>
                <small className="welcome-feature-description">Suivi détaillé</small>
              </div>
            </div>
            <div className="welcome-feature-card">
              <div className="welcome-feature-icon-wrapper">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h6 className="welcome-feature-title">Sécurité</h6>
                <small className="welcome-feature-description">Authentification</small>
              </div>
            </div>
          </div>

          <div className="welcome-security-badge">
            <Sparkles size={18} className="me-2" />
            <span>Plateforme certifiée et sécurisée</span>
          </div>
        </div>
      </div>

      {/* Right Section: Auth Forms */}
      <div className="welcome-auth-section">
        <div className="welcome-auth-card">
          {children}
        </div>
      </div>
    </div>
  );
}
