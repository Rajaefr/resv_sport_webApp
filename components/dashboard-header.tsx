'use client';

import { User, Menu } from 'lucide-react' 
import { LogoutButton } from "./logout-button"
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

// Fournir des valeurs par défaut pour les propriétés de l'utilisateur
// Ceci est une mesure défensive pour éviter les erreurs si 'user' est null/undefined
const currentUser = user || { firstName: '', lastName: '', role: '' };

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
      padding: '1.25rem 1.5rem', 
    }}
  >
      <div className="row align-items-center py-2 gx-0"> 
        {/* Left Section */}
        <div className="col-md-8">
          <div className="d-flex align-items-center">
            {/* Sidebar Toggle Button */}
            <button
              className="btn btn-light btn-sm rounded-circle p-1 border-0 me-3 d-lg-none" 
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
                  width: "55px", 
                  height: "55px", 
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #16a34a",
                  boxShadow: '0 4px 10px rgba(22, 163, 74, 0.1)', 
                  position: "relative", 
                  marginBottom: "0.5rem", 
                  marginLeft: "1.5rem", 
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
              <p className="text-muted mb-0" style={{ fontSize: "0.8rem", opacity: 0.8 }}> 
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
          <div className="d-flex align-items-center justify-content-end gap-3"> 
            {/* User Profile */}
            <div className="dropdown">
              <button
                className="btn btn-light d-flex align-items-center gap-2 dropdown-toggle border-0 py-2 px-3" 
                type="button"
                data-bs-toggle="dropdown"
                style={{
                  backgroundColor: "#f0fdf4",
                  borderRadius: '2rem', 
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0ffe0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
              >
                <div
                  className="text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "32px", 
                    height: "32px", 
                    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)', 
                  }}
                >
                  <User size={16} /> 
                </div>
                <div className="text-start d-none d-md-block">
                  <div className="fw-semibold" style={{ color: "#16a34a", fontSize: "0.85rem" }}> 
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}> 
                    {currentUser.role}
                  </div>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
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
  </header>
);
}
