'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService, AuthUser, AuthResult } from '../lib/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
  register: (email: string, password: string, userData: any) => Promise<AuthResult>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  refreshToken: () => Promise<string | null>;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isGestionnaire: () => boolean;
  // Permissions spécifiques selon les règles définies
  canManageUsers: () => boolean;
  canManageGroups: () => boolean;
  canManageDisciplineCodes: () => boolean;
  canCreateReservations: () => boolean;
  canModifyReservations: () => boolean;
  canViewReservations: () => boolean;
  canViewDisciplineCodes: () => boolean;
  canViewGroups: () => boolean;
  canViewStatistics: () => boolean;
  canImportExport: () => boolean;
  canManagePayments: () => boolean;
  canValidateReservations: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialiser l'état d'authentification
    initializeAuth();

    // Écouter les changements d'état d'authentification
    const unsubscribe = authService.onAuthStateChange((firebaseUser: User | null) => {
      // Forcer la re-synchronisation du profil utilisateur
      const profile = authService.getStoredProfile();
      if (firebaseUser && profile) {
        setUser(profile); // Forcer la mise à jour
        setIsAuthenticated(true);
      } else if (firebaseUser) {
        // Si l'utilisateur Firebase existe mais que le profil n'est pas encore là, on attend
        authService.verifyToken().then((syncedProfile: AuthUser | null) => {
          if (syncedProfile) {
            setUser(syncedProfile);
            setIsAuthenticated(true);
          }
        });
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
      authService.cleanup();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      // Vérifier s'il y a un profil stocké
      const storedProfile = authService.getStoredProfile();
      if (storedProfile) {
        setUser(storedProfile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await authService.signIn(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      return result;
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await authService.signOut();
      if (result.success) {
        setUser(null);
        setIsAuthenticated(false);
      }
      return result;
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await authService.signUp(email, password, userData);
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      return result;
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<AuthUser>): Promise<AuthResult> => {
    try {
      const result = await authService.updateUserProfile(profileData);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } catch (error: any) {
      console.error('Erreur de mise à jour du profil:', error);
      return { success: false, message: error.message };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      return await authService.resetPassword(email);
    } catch (error: any) {
      console.error('Erreur de réinitialisation:', error);
      return { success: false, message: error.message };
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      return await authService.getCurrentToken();
    } catch (error) {
      console.error('Erreur de rafraîchissement du token:', error);
      return null;
    }
  };

  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  const isGestionnaire = (): boolean => {
    return authService.isGestionnaire();
  };

  const canManageUsers = (): boolean => {
    return authService.canManageUsers();
  };

  const canManageGroups = (): boolean => {
    return authService.canManageGroups();
  };

  const canManageDisciplineCodes = (): boolean => {
    return authService.canManageDisciplineCodes();
  };

  const canCreateReservations = (): boolean => {
    return authService.canCreateReservations();
  };

  const canViewStatistics = (): boolean => {
    return authService.canViewStatistics();
  };

  const canModifyReservations = (): boolean => {
    return authService.canModifyReservations();
  };

  const canViewReservations = (): boolean => {
    return authService.canViewReservations();
  };

  const canViewDisciplineCodes = (): boolean => {
    return authService.canViewDisciplineCodes();
  };

  const canViewGroups = (): boolean => {
    return authService.canViewGroups();
  };

  const canImportExport = (): boolean => {
    return authService.canImportExport();
  };

  const canManagePayments = (): boolean => {
    return authService.canManagePayments();
  };

  const canValidateReservations = (): boolean => {
    return authService.canValidateReservations();
  };

  const canExportData = (): boolean => {
    return authService.canExportData();
  };

  const canViewReports = (): boolean => {
    return authService.canViewReports();
  };

  const hasFullAccess = (): boolean => {
    return authService.hasFullAccess();
  };

  const canManageSystemSettings = (): boolean => {
    return authService.canManageSystemSettings();
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    resetPassword,
    refreshToken,
    hasRole,
    isAdmin,
    isGestionnaire,
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
    canValidateReservations,
    canExportData,
    canViewReports,
    hasFullAccess,
    canManageSystemSettings,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
