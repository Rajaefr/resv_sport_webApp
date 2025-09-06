'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'GESTIONNAIRE' | 'CONSULTEUR';
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackPath = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      if (requiredRole && !hasRole(requiredRole) && !hasRole('ADMIN')) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router, fallbackPath, hasRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && !hasRole(requiredRole) && !hasRole('ADMIN')) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
