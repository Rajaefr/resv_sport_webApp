'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react';
import type { ForgotPasswordFormProps } from '@/lib/types'; // Import the interface

export default function ForgotPasswordPage({ onBack }: ForgotPasswordFormProps) {
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
      <div className="text-center mb-4">
        <h2 className="h4 fw-bold text-dark mb-2">Récupération</h2>
        <p className="text-muted small">
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
        <div className="mb-3">
          <label className="form-label d-flex align-items-center text-dark fw-medium small">
            <Mail size={16} className="me-2" />
            <span>Adresse email</span>
          </label>
          <input
            type="email"
            className="form-control form-input-ocp"
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

      <div className="d-flex align-items-center justify-content-center pt-3 mt-3 border-top">
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
