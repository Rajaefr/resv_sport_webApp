'use client';

import React, { useState } from 'react';
import { Calendar, Users, Trophy, Shield, Sparkles, Target, Award } from 'lucide-react';
import LoginPage from '@/components/login';
import RegisterPage from '@/components/register';
import ForgotPasswordPage from '@/components/forgot-password';

type AuthTab = 'login' | 'register' | 'forgot';

export default function WelcomePage() {
const [activeTab, setActiveTab] = useState<AuthTab>('login');

return (
  <div 
    className="min-vh-100 d-flex align-items-center position-relative overflow-hidden py-5"
    style={{
      background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
    }}
  >
    {/* Éléments décoratifs fixes */}
    <div className="position-absolute w-100 h-100 overflow-hidden">
      <div 
        className="position-absolute rounded-circle"
        style={{
          width: '400px',
          height: '400px',
          background: 'rgba(187, 247, 208, 0.17)',
          top: '-200px',
          right: '-200px',
          animation: 'float 6s ease-in-out infinite'
        }}
      ></div>
      <div 
        className="position-absolute rounded-circle"
        style={{
          width: '300px',
          height: '300px',
          background: 'rgba(187, 247, 208, 0.22)',
          bottom: '-150px',
          left: '-150px',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '-2s'
        }}
      ></div>
      <div 
        className="position-absolute rounded-circle"
        style={{
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          top: '30%',
          left: '10%',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '-4s'
        }}
      ></div>
    </div>

    <div className="container position-relative" style={{ zIndex: 10 }}>
      <div className="row align-items-center g-5">
        {/* Côté gauche - Contenu de marque FIXE */}
        <div className="col-lg-6 text-white">
          <div className="mb-5">
            <div className="d-flex align-items-center mb-4">
              <div 
                className="me-3 p-3 rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  width: '60px',
                  height: '60px'
                }}
              >
                <Trophy size={32} className="text-white" />
              </div>
              <h1 className="display-3 fw-bold text-white mb-0">
                OCP Sport
              </h1>
            </div>
            
            <p className="lead text-light mb-0" style={{ lineHeight: '1.6' }}>
              Votre plateforme complète pour la gestion sportive moderne. 
              Réservez, gérez et excellez dans vos activités sportives.
            </p>
          </div>
          
          {/* Cartes de fonctionnalités fixes */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div 
                className="d-flex align-items-center p-3 rounded-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <div 
                  className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    width: '45px',
                    height: '45px'
                  }}
                >
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <h6 className="fw-semibold text-white mb-1">Réservations</h6>
                  <small className="text-light opacity-75">Installations sportives</small>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div 
                className="d-flex align-items-center p-3 rounded-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <div 
                  className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    width: '45px',
                    height: '45px'
                  }}
                >
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h6 className="fw-semibold text-white mb-1">Équipes</h6>
                  <small className="text-light opacity-75">Gestion complète</small>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div 
                className="d-flex align-items-center p-3 rounded-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <div 
                  className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    width: '45px',
                    height: '45px'
                  }}
                >
                  <Target size={24} className="text-white" />
                </div>
                <div>
                  <h6 className="fw-semibold text-white mb-1">Performance</h6>
                  <small className="text-light opacity-75">Suivi détaillé</small>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div 
                className="d-flex align-items-center p-3 rounded-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <div 
                  className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    width: '45px',
                    height: '45px'
                  }}
                >
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <h6 className="fw-semibold text-white mb-1">Sécurité</h6>
                  <small className="text-light opacity-75">Authentification</small>
                </div>
              </div>
            </div>
          </div>

          {/* Badge de certification fixe */}
          <div 
            className="d-flex align-items-center text-light p-3 rounded-3"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Sparkles size={20} className="me-2" />
            <small>Plateforme certifiée et sécurisée</small>
          </div>
        </div>

        {/* Côté droit - Formulaire d'authentification */}
        <div className="col-lg-6">
          <div style={{ maxWidth: '450px' }} className="mx-auto">
            <div 
              className="card shadow-lg border-0"
              style={{
                borderRadius: '1.5rem',
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Navigation par onglets élégante */}
              {activeTab !== 'forgot' && (
                <div 
                  className="card-header border-0 p-4"
                  style={{
                    borderRadius: '1.5rem 1.5rem 0 0',
                    background: "linear-gradient(135deg, #16a34acb 0%, #22c55ed2 100%)"
                  }}
                >
                  <div 
                    className="position-relative d-flex"
                    style={{
                      backgroundColor: '#f1f3f4',
                      borderRadius: '1rem',
                      padding: '0.25rem',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* Indicateur de sélection animé */}
                    <div
                      className="position-absolute"
                      style={{
                        top: '0.25rem',
                        left: activeTab === 'login' ? '0.25rem' : '50%',
                        width: 'calc(50% - 0.25rem)',
                        height: 'calc(100% - 0.5rem)',
                        backgroundColor: '#0fa646ff',
                        borderRadius: '0.75rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 12px rgba(34, 150, 5, 0.3)'
                      }}
                    />
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="btn flex-fill fw-semibold py-3 position-relative"
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: activeTab === 'login' ? 'white' : '#6c757d',
                        borderRadius: '0.75rem',
                        transition: 'all 0.3s ease',
                        fontSize: '1rem',
                        zIndex: 1
                      }}
                    >
                      Connexion
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="btn flex-fill fw-semibold py-3 position-relative"
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: activeTab === 'register' ? 'white' : '#6c757d',
                        borderRadius: '0.75rem',
                        transition: 'all 0.3s ease',
                        fontSize: '1rem',
                        zIndex: 1
                      }}
                    >
                      Inscription
                    </button>
                  </div>
                </div>
              )}

              {/* Contenu du formulaire */}
              <div className="card-body p-5">
                {activeTab === 'login' && (
                  <LoginPage onForgotPassword={() => setActiveTab('forgot')} />
                )}
                {activeTab === 'register' && (
                  <RegisterPage onBack={() => setActiveTab('login')} />
                )}
                {activeTab === 'forgot' && (
                  <ForgotPasswordPage onBack={() => setActiveTab('login')} />
                )}
              </div>
            </div>

            {/* Décoration du bas */}
            <div className="text-center mt-4">
              <p className="text-light small d-flex align-items-center justify-content-center">
                <Award size={16} className="me-2" />
                <span>Plateforme OCP - Excellence Sportive</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .form-check-input:checked {
        background-color: #0fa646ff;
        border-color: #0fa646ff;
      }
      
      .form-check-input:focus {
        border-color: #0fa646ff;
        box-shadow: 0 0 0 0.2rem rgba(5, 150, 105, 0.25);
      }
    `}</style>
  </div>
);
}
