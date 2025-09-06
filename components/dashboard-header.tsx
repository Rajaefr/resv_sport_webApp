'use client';

import { User, Bell, Settings, Menu, Download, FileText } from 'lucide-react' // Import Menu icon
import { LogoutButton } from "./logout-button"
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ExportService from '../lib/exportService';
import { useState } from 'react';

interface DashboardHeaderProps {
onToggleSidebar: () => void;
user: {
  firstName: string;
  lastName: string;
  role: string;
};
}

export function DashboardHeader({ onToggleSidebar, user }: DashboardHeaderProps) {
const router = useRouter();
const [isExporting, setIsExporting] = useState(false);

// Fournir des valeurs par défaut pour les propriétés de l'utilisateur
// Ceci est une mesure défensive pour éviter les erreurs si 'user' est null/undefined
const currentUser = user || { firstName: '', lastName: '', role: '' };

const handleExportPDF = async () => {
  setIsExporting(true);
  try {
    const result = await ExportService.exportDashboardStatsToPDF();
    if (result.success) {
      alert('Export PDF réussi !');
    } else {
      alert(`Erreur: ${result.message}`);
    }
  } catch (error) {
    alert('Erreur lors de l\'export PDF');
  } finally {
    setIsExporting(false);
  }
};

// This handleLogout is redundant if LogoutButton handles it, but keeping for safety
const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    router.push('/');
  }
};

return (
  <header className="bg-white shadow-lg border-bottom mb-4 p-3 rounded-3"
    style={{
      borderRadius: '1rem',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
      padding: '1.25rem 1.5rem', // Ce padding gérera l'espacement interne
    }}
  >
    {/* Ancien: <div className="container-fluid"> */}
      <div className="row align-items-center py-2 gx-0"> {/* Ajout de gx-0 ici */}
        {/* Left Section */}
        <div className="col-md-8">
          <div className="d-flex align-items-center">
            {/* Sidebar Toggle Button */}
            <button
              className="btn btn-light btn-sm rounded-circle p-1 border-0 me-3 d-lg-none" // Visible only on smaller screens
              onClick={onToggleSidebar}
              style={{
                backgroundColor: "#f0fdf4",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0ffe0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
            >
              <Menu size={20} style={{ color: "#16a34a" }} />
            </button>

            <div className="me-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "55px", // Légèrement plus grand
                  height: "55px", // Légèrement plus grand
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #16a34a",
                  boxShadow: '0 4px 10px rgba(22, 163, 74, 0.1)', // Ombre subtile
                  position: "relative", // AJOUTEZ CETTE LIGNE
                  marginBottom: "0.5rem", // Espace entre le logo et le titre
                  marginLeft: "1.5rem", // Espace entre le logo et le titre
                }}
              >
                <Image
                  src="/images/logo.png"
                  alt="OCP Sport Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <div>
              <h1 className="h5 mb-0 fw-bold text-dark">
                Dashboard
                <span className="ms-2" style={{ color: "#16a34a" }}>
                  OCP Sport
                </span>
              </h1>
              <p className="text-muted mb-0" style={{ fontSize: "0.8rem", opacity: 0.8 }}> {/* Légèrement plus grand et plus opaque */}
                Vue d'ensemble des activités sportives •{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </div>
        {/* Right Section */}
        <div className="col-md-4">
          <div className="d-flex align-items-center justify-content-end gap-3"> {/* Augmenter le gap */}
            {/* Export Statistics Button */}
            <button
              className="btn btn-light btn-sm rounded-circle p-1 border-0"
              onClick={handleExportPDF}
              disabled={isExporting}
              title="Exporter les statistiques en PDF"
              style={{
                backgroundColor: "#f0fdf4",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                opacity: isExporting ? 0.6 : 1
              }}
              onMouseEnter={(e) => !isExporting && (e.currentTarget.style.backgroundColor = "#e0ffe0")}
              onMouseLeave={(e) => !isExporting && (e.currentTarget.style.backgroundColor = "#f0fdf4")}
            >
              {isExporting ? (
                <div className="spinner-border spinner-border-sm" role="status" style={{ width: "16px", height: "16px", color: "#16a34a" }}>
                  <span className="visually-hidden">Chargement...</span>
                </div>
              ) : (
                <FileText size={18} style={{ color: "#16a34a" }} />
              )}
            </button>
            {/* Notifications */}
            <div className="position-relative">
              <button
                className="btn btn-light btn-sm rounded-circle p-1 position-relative border-0"
                style={{
                  backgroundColor: "#f0fdf4",
                  width: "38px", // Plus grand
                  height: "38px", // Plus grand
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0ffe0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
              >
                <Bell size={18} style={{ color: "#16a34a" }} /> {/* Icône plus grande */}
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{
                    fontSize: "0.6rem", // Plus grand
                    backgroundColor: "#16a34a",
                    color: "white",
                    padding: '0.3em 0.6em', // Ajuster le padding
                    minWidth: '20px', // Assurer une taille minimale
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.3)' // Bordure pour le contraste
                  }}
                >
                  3
                </span>
              </button>
            </div>
            {/* Settings */}
            <button
              className="btn btn-light btn-sm rounded-circle p-1 border-0"
              style={{
                backgroundColor: "#f0fdf4",
                width: "38px", // Plus grand
                height: "38px", // Plus grand
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0ffe0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
            >
              <Settings size={18} style={{ color: "#16a34a" }} /> {/* Icône plus grande */}
            </button>
            {/* User Profile */}
            <div className="dropdown">
              <button
                className="btn btn-light d-flex align-items-center gap-2 dropdown-toggle border-0 py-2 px-3" // Plus de padding
                type="button"
                data-bs-toggle="dropdown"
                style={{
                  backgroundColor: "#f0fdf4",
                  borderRadius: '2rem', // Plus arrondi
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0ffe0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
              >
                <div
                  className="text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "32px", // Plus grand
                    height: "32px", // Plus grand
                    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)', // Ombre pour l'avatar
                  }}
                >
                  <User size={16} /> {/* Icône plus grande */}
                </div>
                <div className="text-start d-none d-md-block">
                  <div className="fw-semibold" style={{ color: "#16a34a", fontSize: "0.85rem" }}> {/* Légèrement plus grand */}
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}> {/* Légèrement plus grand */}
                    {currentUser.role}
                  </div>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="/settings">
                    <Settings size={16} className="me-2" />
                    Paramètres
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <LogoutButton
                    variant="ghost"
                    size="sm"
                    className="dropdown-item w-100 text-start"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    {/* Ancien: </div> */}
  </header>
);
}
