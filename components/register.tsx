'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Building, ArrowLeft, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import type { RegisterFormProps } from '@/lib/types';

export default function RegisterPage({ onBack }: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // username: "", // Removed from state
    password: "",
    confirmPassword: "",
    department: "",
    matricule: "",
    telephone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          // username: formData.username, // Removed from payload
          password: formData.password,
          department: formData.department,
          matricule: formData.matricule,
          telephone: formData.telephone,
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Stocker le token dans les cookies pour le middleware
        // Retiré 'secure' pour le développement local (HTTP)
        document.cookie = `authToken=${data.token}; path=/; max-age=86400; samesite=Lax`;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));

        setSuccess("Compte créé avec succès ! Redirection...");

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error('Erreur inscription:', err);
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
        <h2 className="h4 fw-bold text-dark mb-2">Créer un compte</h2>
        <p className="text-muted small">Rejoignez la communauté OCP Sport</p>
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
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label d-flex align-items-center text-dark fw-medium small">
              <User size={16} className="me-2" />
              <span>Prénom</span>
            </label>
            <input
              type="text"
              className="form-control form-input-ocp"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label d-flex align-items-center text-dark fw-medium small">
              <User size={16} className="me-2" />
              <span>Nom</span>
            </label>
            <input
              type="text"
              className="form-control form-input-ocp"
              placeholder="Nom"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label d-flex align-items-center text-dark fw-medium small">
            <Mail size={16} className="me-2" />
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

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label d-flex align-items-center text-dark fw-medium small">
              <Building size={16} className="me-2" />
              <span>Département</span>
            </label>
            <input
              type="text"
              className="form-control form-input-ocp"
              placeholder="IT, RH, Finance..."
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label d-flex align-items-center text-dark fw-medium small">
              <span>Matricule</span>
            </label>
            <input
              type="text"
              className="form-control form-input-ocp"
              placeholder="12345"
              value={formData.matricule}
              onChange={(e) => handleInputChange("matricule", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label d-flex align-items-center text-dark fw-medium small">
            <Phone size={16} className="me-2" />
            <span>Téléphone</span>
          </label>
          <input
            type="tel"
            className="form-control form-input-ocp"
            placeholder="+212 6 XX XX XX XX"
            value={formData.telephone}
            onChange={(e) => handleInputChange("telephone", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label d-flex align-items-center text-dark fw-medium small">
              <Lock size={16} className="me-2" />
              <span>Mot de passe</span>
            </label>
            <input
              type="password"
              className="form-control form-input-ocp"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label d-flex align-items-center text-dark fw-medium small">
              <Lock size={16} className="me-2" />
              <span>Confirmer</span>
            </label>
            <input
              type="password"
              className="form-control form-input-ocp"
              placeholder="Confirmer"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              disabled={isLoading}
              required
            />
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
              <span>Création...</span>
            </>
          ) : (
            <>
              <User size={16} className="me-2" />
              <span>Créer le compte</span>
            </>
          )}
        </button>
      </form>

      <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top">
        <button
          type="button"
          className="btn-ocp-link p-0 small fw-medium d-flex align-items-center"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft size={14} className="me-1" />
          <span>Retour</span>
        </button>
        <small className="text-muted">
          Support IT disponible
        </small>
      </div>
    </div>
  );
}
