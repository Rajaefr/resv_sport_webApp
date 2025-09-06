// Validation simple sans zod pour éviter les dépendances supplémentaires
export interface ValidationResult {
  success: boolean;
  error?: string;
}

export function validateLogin(data: any): ValidationResult {
  if (!data.email || typeof data.email !== 'string') {
    return { success: false, error: 'Email requis' };
  }
  
  if (!data.email.includes('@')) {
    return { success: false, error: 'Email invalide' };
  }
  
  if (!data.password || typeof data.password !== 'string') {
    return { success: false, error: 'Mot de passe requis' };
  }
  
  return { success: true };
}

export function validateRegister(data: any): ValidationResult {
  if (!data.firstName || data.firstName.length < 2) {
    return { success: false, error: 'Le prénom doit contenir au moins 2 caractères' };
  }
  
  if (!data.lastName || data.lastName.length < 2) {
    return { success: false, error: 'Le nom doit contenir au moins 2 caractères' };
  }
  
  if (!data.email || !data.email.includes('@')) {
    return { success: false, error: 'Email invalide' };
  }
  
  // Temporarily allow all email domains for development
  // if (!data.email.endsWith('@ocp.ma')) {
  //   return { success: false, error: 'Seules les adresses email OCP sont autorisées' };
  // }
  
  // Removed username validation as it's no longer collected from the form
  // if (!data.username || data.username.length < 3) {
  //   return { success: false, error: "Le nom d'utilisateur doit contenir au moins 3 caractères" };
  // }
  
  if (!data.password || data.password.length < 8) {
    return { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  
  if (!data.department) {
    return { success: false, error: 'Département requis' };
  }
  
  if (!data.matricule) {
    return { success: false, error: 'Matricule requis' };
  }

  if (data.telephone && typeof data.telephone !== 'string') {
    return { success: false, error: 'Numéro de téléphone invalide' };
  }
  
  return { success: true };
}

export function validateForgotPassword(data: any): ValidationResult {
  if (!data.email || !data.email.includes('@')) {
    return { success: false, error: 'Email invalide' };
  }
  
  return { success: true };
}

export function validateEmail(email: string): boolean {
  return email.includes('@') && email.length > 0;
}
