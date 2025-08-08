'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 992;
    }
    return false;
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const publicRoutes = [
    "/welcome",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');

    if (!token || !userInfo) {
      if (!isPublicRoute) {
        router.push('/welcome');
      }
      setIsLoadingAuth(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(userInfo);
      if (parsedUser && parsedUser.firstName && parsedUser.lastName && parsedUser.role) {
        setUser(parsedUser);
      } else {
        console.error('Informations utilisateur incomplètes ou invalides dans localStorage:', parsedUser);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        if (!isPublicRoute) {
          router.push('/welcome');
        }
      }
    } catch (error) {
      console.error('Erreur de parsing des informations utilisateur depuis localStorage:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      if (!isPublicRoute) {
        router.push('/welcome');
      }
    } finally {
      setIsLoadingAuth(false);
    }
  }, [router, pathname, isPublicRoute]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  if (isLoadingAuth) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user && !isPublicRoute) {
    return null;
  }

  return (
    <>
      {isPublicRoute ? (
        children
      ) : (
        <div className={clsx("dashboard-wrapper", { "sidebar-open": isSidebarOpen })}>
          <AppSidebar onToggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
          <div className="main-content-wrapper">
            {user && user.firstName && user.lastName && user.role ? (
              <DashboardHeader onToggleSidebar={toggleSidebar} user={user} />
            ) : (
              <div className="p-4 text-center text-danger">
                Erreur: Informations utilisateur incomplètes. Veuillez vous reconnecter.
              </div>
            )}
            <main className="main-content main-content-scroll">
              {/* Changed main-container to container-fluid for better Bootstrap grid compatibility */}
              <div className="container-fluid">
                {children}
              </div>
            </main>
          </div>
          {isSidebarOpen && window.innerWidth < 992 && (
            <div
              className="sidebar-overlay d-lg-none"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              }}
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
      )}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        async
      />
    </>
  );
}
