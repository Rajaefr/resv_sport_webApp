import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth } from './firebase';
import { apiService } from './apiService';

export interface AuthUser {
  id: string;
  firebaseUid: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  department?: string;
  matricule?: string;
  telephone?: string;
  role: 'USER' | 'ADMIN' | 'GESTIONNAIRE' | 'CONSULTEUR';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: AuthUser | null;
  token?: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private authStateListener: (() => void) | null = null;

  // Écouter les changements d'état d'authentification
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateListener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Utilisateur connecté - récupérer le token
        const token = await user.getIdToken();
        localStorage.setItem('firebaseToken', token);
        
        // Vérifier/créer le profil utilisateur dans notre backend
        try {
          const response = await apiService.post('/auth/verify-token', { token });
          if (response.success) {
            this.currentUser = response.data.user;
            localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du profil:', error);
        }
      } else {
        // Utilisateur déconnecté
        this.currentUser = null;
        localStorage.removeItem('firebaseToken');
        localStorage.removeItem('userProfile');
      }
      
      callback(user);
    });
    
    return this.authStateListener;
  }

  // Connexion avec email/mot de passe
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // Utilisateur admin de test - connexion directe sans Firebase
      if (email === 'admin@ocp.ma' && password === 'admin123') {
        const testAdminUser: AuthUser = {
          id: 'test-admin-001',
          firebaseUid: 'test-firebase-uid',
          firstName: 'Admin',
          lastName: 'Test',
          email: 'admin@ocp.ma',
          username: 'admin.test',
          department: 'IT',
          matricule: 'ADM001',
          telephone: '+212600000000',
          role: 'ADMIN',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        // Simuler un token pour les tests
        const testToken = 'test-admin-token-' + Date.now();
        
        // Nettoyer les anciennes données
        localStorage.clear();
        
        this.currentUser = testAdminUser;
        localStorage.setItem('firebaseToken', testToken);
        localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
        
        console.log('✅ Connexion admin de test réussie');
        
        return {
          success: true,
          user: this.currentUser,
          token: testToken
        };
      }

      // Utilisateur consulteur de test - pour contourner Firebase
      if (email === 'test@ocp.ma' && password === 'test123') {
        const testUser: AuthUser = {
          id: 'test-user-001',
          firebaseUid: 'test-firebase-uid-user',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@ocp.ma',
          username: 'test.user',
          department: 'Test',
          matricule: 'TST001',
          telephone: '+212600000001',
          role: 'CONSULTEUR',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        const testToken = 'test-user-token-' + Date.now();
        
        localStorage.clear();
        this.currentUser = testUser;
        localStorage.setItem('firebaseToken', testToken);
        localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
        
        console.log('✅ Connexion utilisateur de test réussie');
        
        return {
          success: true,
          user: this.currentUser,
          token: testToken
        };
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Récupérer le token Firebase
      const token = await user.getIdToken();
      
      // Vérifier avec notre backend
      const response = await apiService.post('/auth/verify-token', { token });
      
      if (response.success) {
        this.currentUser = response.data.user;
        
        // Vérifier que l'utilisateur a les permissions pour accéder à l'admin
        if (!this.hasAdminAccess()) {
          await this.signOut(); // Déconnecter l'utilisateur
          return {
            success: false,
            message: 'Accès refusé. Seuls les administrateurs, gestionnaires et consulteurs peuvent accéder à cette interface.'
          };
        }
        
        localStorage.setItem('firebaseToken', token);
        localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
        
        return {
          success: true,
          user: this.currentUser,
          token
        };
      } else {
        throw new Error(response.message || 'Erreur de connexion');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }

  // Inscription avec email/mot de passe
  async signUp(email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    department?: string;
    matricule?: string;
    telephone?: string;
  }): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Mettre à jour le profil Firebase
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      
      // Récupérer le token
      const token = await user.getIdToken();
      
      // Créer le profil dans notre backend
      const profileData = {
        token,
        firstName: userData.firstName,
        lastName: userData.lastName,
        department: userData.department,
        matricule: userData.matricule,
        telephone: userData.telephone
      };
      
      const response = await apiService.post('/auth/register', profileData);
      
      if (response.success) {
        this.currentUser = response.data.user;
        localStorage.setItem('firebaseToken', token);
        localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
        
        return {
          success: true,
          user: this.currentUser,
          token
        };
      } else {
        throw new Error(response.message || 'Erreur lors de la création du profil');
      }
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }

  // Déconnexion
  async signOut(): Promise<AuthResult> {
    try {
      // Informer le backend de la déconnexion
      const token = localStorage.getItem('firebaseToken');
      if (token) {
        try {
          await apiService.post('/auth/logout', { token });
        } catch (error) {
          console.log('Erreur lors de la déconnexion backend:', error);
        }
      }
      
      // Déconnexion Firebase
      await signOut(auth);
      
      // Nettoyer le stockage local
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('userProfile');
      this.currentUser = null;
      
      return { success: true };
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }

  // Réinitialiser le mot de passe
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Email de réinitialisation envoyé'
      };
    } catch (error: any) {
      console.error('Erreur de réinitialisation:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }

  // Récupérer le token actuel
  async getCurrentToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true); // Force refresh
        localStorage.setItem('firebaseToken', token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Vérifier le token avec le backend et synchroniser le profil
  async verifyToken(): Promise<AuthUser | null> {
    try {
      const token = await this.getCurrentToken();
      if (!token) {
        this.currentUser = null;
        localStorage.removeItem('userProfile');
        return null;
      }

      const response = await apiService.post('/auth/verify-token', { token });

      if (response.success) {
        this.currentUser = response.data.user;
        localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
        return this.currentUser;
      } else {
        this.currentUser = null;
        localStorage.removeItem('userProfile');
        localStorage.removeItem('firebaseToken');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      this.currentUser = null;
      localStorage.removeItem('userProfile');
      localStorage.removeItem('firebaseToken');
      return null;
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!auth.currentUser && !!this.currentUser;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  // Vérifier si l'utilisateur est gestionnaire ou admin
  isGestionnaire(): boolean {
    return this.hasRole('GESTIONNAIRE') || this.hasRole('ADMIN');
  }

  // Vérifier si l'utilisateur a accès à l'interface d'administration
  hasAdminAccess(): boolean {
    if (!this.currentUser) return false;
    const allowedRoles = ['ADMIN', 'GESTIONNAIRE', 'CONSULTEUR'];
    return allowedRoles.includes(this.currentUser.role);
  }

  // Vérifier les permissions spécifiques par fonctionnalité selon vos règles
  
  // GESTION DES UTILISATEURS - Admin uniquement
  canManageUsers(): boolean {
    return this.hasRole('ADMIN');
  }

  // GESTION DES GROUPES - Admin et Gestionnaire
  canManageGroups(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('GESTIONNAIRE');
  }

  // GESTION DES CODES DISCIPLINES - Admin et Gestionnaire
  canManageDisciplineCodes(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('GESTIONNAIRE');
  }

  // CRÉATION DE RÉSERVATIONS - Admin et Gestionnaire
  canCreateReservations(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('GESTIONNAIRE');
  }

  // MODIFICATION/SUPPRESSION RÉSERVATIONS - Admin et Gestionnaire
  canModifyReservations(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('GESTIONNAIRE');
  }

  // CONSULTATION RÉSERVATIONS - Tous les rôles
  canViewReservations(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('GESTIONNAIRE') || this.hasRole('CONSULTEUR');
  }

  // CONSULTATION CODES DISCIPLINES - Tous les rôles
  canViewDisciplineCodes(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('GESTIONNAIRE') || this.hasRole('CONSULTEUR');
  }

  // CONSULTATION GROUPES - Tous les rôles
  canViewGroups(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('GESTIONNAIRE') || this.hasRole('CONSULTEUR');
  }

  // STATISTIQUES - Admin uniquement
  canViewStatistics(): boolean {
    return this.hasRole('ADMIN');
  }

  // IMPORT/EXPORT - Admin uniquement
  canImportExport(): boolean {
    return this.hasRole('ADMIN');
  }

  // EXPORT DE DONNÉES - Admin uniquement
  canExportData(): boolean {
    return this.hasRole('ADMIN');
  }

  // GESTION DES RAPPORTS - Admin uniquement
  canViewReports(): boolean {
    return this.hasRole('ADMIN');
  }

  // ACCÈS COMPLET ADMIN - Toutes les fonctionnalités
  hasFullAccess(): boolean {
    return this.hasRole('ADMIN');
  }

  // GESTION DES PARAMÈTRES SYSTÈME - Admin uniquement
  canManageSystemSettings(): boolean {
    return this.hasRole('ADMIN');
  }

  // GESTION DES PAIEMENTS - Admin et Gestionnaire
  canManagePayments(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('GESTIONNAIRE');
  }

  // VALIDATION DES RÉSERVATIONS - Admin et Gestionnaire
  canValidateReservations(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('GESTIONNAIRE');
  }

  // Mettre à jour le profil utilisateur
  async updateUserProfile(profileData: Partial<AuthUser>): Promise<AuthResult> {
    try {
      const token = await this.getCurrentToken();
      if (!token) throw new Error('Token non disponible');
      
      const response = await apiService.put('/auth/profile', profileData);
      
      if (response.success) {
        this.currentUser = response.data.user;
        localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
        return {
          success: true,
          user: this.currentUser
        };
      } else {
        throw new Error(response.message || 'Erreur de mise à jour');
      }
    } catch (error: any) {
      console.error('Erreur de mise à jour du profil:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }

  // Récupérer le profil depuis le stockage local
  getStoredProfile(): AuthUser | null {
    try {
      const profileData = localStorage.getItem('userProfile');
      if (profileData) {
        this.currentUser = JSON.parse(profileData);
        return this.currentUser;
      }
      
      // Si aucun profil stocké, créer un utilisateur admin de test par défaut
      const defaultAdminUser: AuthUser = {
        id: 'default-admin-001',
        firebaseUid: 'default-firebase-uid',
        firstName: 'Admin',
        lastName: 'Default',
        email: 'admin@ocp.ma',
        username: 'admin.default',
        department: 'IT',
        matricule: 'ADM001',
        telephone: '+212600000000',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      const defaultToken = 'test-admin-token-default-' + Date.now();
      
      this.currentUser = defaultAdminUser;
      localStorage.setItem('firebaseToken', defaultToken);
      localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
      
      console.log('✅ Utilisateur admin par défaut créé pour les tests');
      
      return this.currentUser;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil stocké:', error);
      return null;
    }
  }

  // Convertir les erreurs Firebase en messages lisibles
  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Aucun utilisateur trouvé avec cet email';
      case 'auth/wrong-password':
        return 'Mot de passe incorrect';
      case 'auth/email-already-in-use':
        return 'Cet email est déjà utilisé';
      case 'auth/weak-password':
        return 'Le mot de passe doit contenir au moins 6 caractères';
      case 'auth/invalid-email':
        return 'Format d\'email invalide';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Réessayez plus tard';
      case 'auth/network-request-failed':
        return 'Erreur de connexion réseau';
      case 'auth/requires-recent-login':
        return 'Veuillez vous reconnecter pour effectuer cette action';
      default:
        return error.message || 'Une erreur est survenue';
    }
  }

  // Nettoyer les listeners
  cleanup(): void {
    if (this.authStateListener) {
      this.authStateListener();
    }
  }
}

export const authService = new AuthService();
