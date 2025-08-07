export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string; // Username remains in User interface, will be generated
  password: string;
  department: string;
  matricule?: string;
  employeeId?: string;
  role: 'user' | 'admin' | 'gestionnaire' | 'consulteur';
  telephone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  domain?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  // username: string; // Removed from RegisterRequest as it's no longer sent by frontend
  password: string;
  department: string;
  matricule: string;
  telephone?: string;
}

export interface LdapUserInfo {
  employeeId?: string;
  username: string;
  email: string;
  department?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginFormProps {
  onForgotPassword?: () => void;
}

export interface RegisterFormProps {
  onBack?: () => void;
}

export interface ForgotPasswordFormProps {
  onBack?: () => void;
}
