'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('DashboardPage: useEffect triggered'); // Added log
    // Vérifier l'authentification
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');

    if (!token || !userInfo) {
      console.log('DashboardPage: No token or user info found, redirecting to /'); // Added log
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      console.log('DashboardPage: User info parsed successfully', parsedUser); // Added log
    } catch (error) {
      console.error('Erreur parsing user info:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

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

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            OCP Sport
          </a>
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-white"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.firstName} {user.lastName}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Profil
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Tableau de bord</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informations personnelles</h6>
                    <ul className="list-unstyled">
                      <li><strong>Nom :</strong> {user.firstName} {user.lastName}</li>
                      <li><strong>Email :</strong> {user.email}</li>
                      <li><strong>Département :</strong> {user.department}</li>
                      <li><strong>Rôle :</strong> {user.role}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Actions rapides</h6>
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-success">
                        Voir mon profil
                      </button>
                      <button className="btn btn-outline-success">
                        Mes activités
                      </button>
                      <button className="btn btn-outline-success">
                        Paramètres
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
