'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react';
import type { ForgotPasswordFormProps } from '@/lib/types';

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(data.message);
      } else {
        setError(data.message || "Erreur lors de l'envoi");
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) setError("");
  };

  return (
    <div className="p-0">
      <div className="welcome-auth-header">
        <h2 className="welcome-auth-main-title">Récupération</h2>
        <p className="welcome-auth-sub-title">
          Entrez votre email pour recevoir les instructions
        </p>
      </div>

      {error && (
        <div className="alert-ocp-danger d-flex align-items-center py-2 mb-3" role="alert">
          <AlertCircle size={16} className="text-danger me-2 flex-shrink-0" />
          <span className="small fw-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="alert-ocp-success d-flex align-items-center py-2 mb-3" role="alert">
          <CheckCircle size={16} className="text-success me-2 flex-shrink-0" />
          <span className="small fw-medium">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group-custom">
          <label htmlFor="email" className="form-label-custom">
            <Mail size={16} className="me-2" />
            <span>Adresse email</span>
          </label>
          <input
            id="email"
            type="email"
            className="form-control form-input-custom"
            placeholder="votre.email@ocp.ma"
            value={email}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-ocp-primary w-100 py-3 d-flex align-items-center justify-content-center fw-bold rounded-pill mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Envoi...</span>
            </>
          ) : (
            <>
              <Send size={16} className="me-2" />
              <span>Envoyer les instructions</span>
            </>
          )}
        </button>
      </form>

      <div className="d-flex align-items-center justify-content-center pt-3 mt-4 border-top border-gray-200">
        <button
          type="button"
          className="btn-ocp-link p-0 small fw-medium d-flex align-items-center"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft size={14} className="me-1" />
          <span>Retour à la connexion</span>
        </button>
      </div>
    </div>
  );
}
