'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Lock } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: 'canManageUsers' | 'canManageGroups' | 'canManageDisciplineCodes' | 'canCreateReservations' | 'canModifyReservations' | 'canViewReservations' | 'canViewDisciplineCodes' | 'canViewGroups' | 'canViewStatistics' | 'canImportExport' | 'canManagePayments' | 'canValidateReservations';
  role?: 'ADMIN' | 'GESTIONNAIRE' | 'CONSULTEUR';
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  role,
  fallback,
  showMessage = true
}) => {
  const { 
    hasRole, 
    canManageUsers, 
    canManageGroups, 
    canManageDisciplineCodes, 
    canCreateReservations, 
    canModifyReservations, 
    canViewReservations,
    canViewDisciplineCodes,
    canViewGroups,
    canViewStatistics, 
    canImportExport,
    canManagePayments,
    canValidateReservations
  } = useAuth();

  // Vérifier les permissions
  let hasPermission = true;

  if (role) {
    hasPermission = hasRole(role);
  }

  if (permission) {
    switch (permission) {
      case 'canManageUsers':
        hasPermission = canManageUsers();
        break;
      case 'canManageGroups':
        hasPermission = canManageGroups();
        break;
      case 'canManageDisciplineCodes':
        hasPermission = canManageDisciplineCodes();
        break;
      case 'canCreateReservations':
        hasPermission = canCreateReservations();
        break;
      case 'canModifyReservations':
        hasPermission = canModifyReservations();
        break;
      case 'canViewReservations':
        hasPermission = canViewReservations();
        break;
      case 'canViewDisciplineCodes':
        hasPermission = canViewDisciplineCodes();
        break;
      case 'canViewGroups':
        hasPermission = canViewGroups();
        break;
      case 'canViewStatistics':
        hasPermission = canViewStatistics();
        break;
      case 'canImportExport':
        hasPermission = canImportExport();
        break;
      case 'canManagePayments':
        hasPermission = canManagePayments();
        break;
      case 'canValidateReservations':
        hasPermission = canValidateReservations();
        break;
      default:
        hasPermission = true;
    }
  }

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showMessage) {
      return (
        <div className="alert alert-danger d-flex align-items-center m-4" role="alert">
          <Lock className="me-2" size={16} />
          <div>
            Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité.
          </div>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
};

export default PermissionGuard;
