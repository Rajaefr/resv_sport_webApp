'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Building, AlertCircle, CheckCircle } from 'lucide-react';
import type { LoginFormProps } from '@/lib/types';

export default function LoginForm({ onForgotPassword, onRegisterClick }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        document.cookie = `authToken=${data.token}; path=/; max-age=86400; samesite=Lax`;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));

        setSuccess("Connexion réussie ! Redirection...");

        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError(data.message || "Erreur de connexion");
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <div className="p-0">
      <div className="welcome-auth-header">
        <h2 className="welcome-auth-main-title">Bienvenue</h2>
        <p className="welcome-auth-sub-title">Connectez-vous à votre espace OCP Sport</p>
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
            <User size={16} className="me-2" />
            <span>Email</span>
          </label>
          <input
            id="email"
            type="email"
             autoComplete="off"
            className="form-control form-input-custom"
            placeholder="votre.email@ocp.ma"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group-custom">
          <label htmlFor="password" className="form-label-custom">
            <Lock size={16} className="me-2" />
            <span>Mot de passe</span>
          </label>
          <div className="position-relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password" 
              className="form-control form-input-custom password-toggle"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
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
              <span>Connexion...</span>
            </>
          ) : (
            <>
              <Lock size={16} className="me-2" />
              <span>Se connecter</span>
            </>
          )}
        </button>
      </form>

      <div className="d-flex align-items-center justify-content-between pt-3 mt-4 border-top border-gray-200">
        <button
          type="button"
          className="btn-ocp-link p-0 small fw-medium"
          onClick={onForgotPassword}
          disabled={isLoading}
        >
          Mot de passe oublié ?
        </button>
        <button
          type="button"
          className="btn-ocp-link p-0 small fw-medium"
          onClick={onRegisterClick}
          disabled={isLoading}
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}
