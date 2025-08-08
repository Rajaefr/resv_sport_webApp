'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Building, AlertCircle, CheckCircle } from 'lucide-react';
import type { LoginFormProps } from '@/lib/types'; // Import the interface

export default function LoginPage({ onForgotPassword }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    domain: "ocp.ma"
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
        // Stocker le token dans les cookies pour le middleware
        // Retiré 'secure' pour le développement local (HTTP)
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
      <div className="text-center mb-4">
        <h2 className="h4 fw-bold text-dark mb-2">Bienvenue</h2>
        <p className="text-muted small">Connectez-vous à votre espace OCP Sport</p>
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
            <Building size={16} className="me-2" />
            <span>Domaine</span>
          </label>
          <select
            className="form-select form-input-ocp"
            value={formData.domain}
            onChange={(e) => handleInputChange("domain", e.target.value)}
            disabled={isLoading}
          >
            <option value="ocp.ma">ocp.ma</option>
            <option value="ocpgroup.ma">ocpgroup.ma</option>
            <option value="test.ocp.ma">test.ocp.ma</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label d-flex align-items-center text-dark fw-medium small">
            <User size={16} className="me-2" />
            <span>Email</span>
          </label>
          <input
            type="email"
            className="form-control form-input-ocp"
            placeholder="votre.email@ocp.ma"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label d-flex align-items-center text-dark fw-medium small">
            <Lock size={16} className="me-2" />
            <span>Mot de passe</span>
          </label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control form-input-ocp pe-5"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              style={{ border: 'none', background: 'none', zIndex: 10 }}
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

      <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top">
        <button
          type="button"
          className="btn-ocp-link p-0 small fw-medium"
          onClick={onForgotPassword}
          disabled={isLoading}
        >
          Mot de passe oublié ?
        </button>
        <small className="text-muted">
          Support IT disponible
        </small>
      </div>
    </div>
  );
}
