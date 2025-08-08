'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Building, ArrowLeft, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import type { RegisterFormProps } from '@/lib/types';

export default function RegisterForm({ onBack }: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
          password: formData.password,
          department: formData.department,
          matricule: formData.matricule,
          telephone: formData.telephone,
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
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
      <div className="welcome-auth-header">
        <h2 className="welcome-auth-main-title">Créer un compte</h2>
        <p className="welcome-auth-sub-title">Rejoignez la communauté OCP Sport</p>
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
            <div className="form-group-custom">
              <label htmlFor="firstName" className="form-label-custom">
                <User size={16} className="me-2" />
                <span>Prénom</span>
              </label>
              <input
                id="firstName"
                type="text"
                className="form-control form-input-custom"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group-custom">
              <label htmlFor="lastName" className="form-label-custom">
                <User size={16} className="me-2" />
                <span>Nom</span>
              </label>
              <input
                id="lastName"
                type="text"
                className="form-control form-input-custom"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group-custom">
          <label htmlFor="email" className="form-label-custom">
            <Mail size={16} className="me-2" />
            <span>Email</span>
          </label>
          <input
            id="email"
            type="email"
            className="form-control form-input-custom"
            placeholder="votre.email@ocp.ma"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="form-group-custom">
              <label htmlFor="department" className="form-label-custom">
                <Building size={16} className="me-2" />
                <span>Département</span>
              </label>
              <input
                id="department"
                type="text"
                className="form-control form-input-custom"
                placeholder="IT, RH, Finance..."
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group-custom">
              <label htmlFor="matricule" className="form-label-custom">
                <span>Matricule</span>
              </label>
              <input
                id="matricule"
                type="text"
                className="form-control form-input-custom"
                placeholder="12345"
                value={formData.matricule}
                onChange={(e) => handleInputChange("matricule", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group-custom">
          <label htmlFor="telephone" className="form-label-custom">
            <Phone size={16} className="me-2" />
            <span>Téléphone</span>
          </label>
          <input
            id="telephone"
            type="tel"
            className="form-control form-input-custom"
            placeholder="+212 6 XX XX XX XX"
            value={formData.telephone}
            onChange={(e) => handleInputChange("telephone", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="form-group-custom">
              <label htmlFor="password" className="form-label-custom">
                <Lock size={16} className="me-2" />
                <span>Mot de passe</span>
              </label>
              <input
                id="password"
                type="password"
                className="form-control form-input-custom"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group-custom">
              <label htmlFor="confirmPassword" className="form-label-custom">
                <Lock size={16} className="me-2" />
                <span>Confirmer</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control form-input-custom"
                placeholder="Confirmer"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
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

      <div className="d-flex align-items-center justify-content-center pt-3 mt-4 border-top border-gray-200">
        <button
          type="button"
          className="btn-ocp-link p-0 small fw-medium d-flex align-items-center"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft size={14} className="me-1" />
          <span>Retour</span>
        </button>
      </div>
    </div>
  );
}
