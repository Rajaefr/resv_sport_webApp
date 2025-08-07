import { generateToken, verifyToken } from '@/lib/jwt'; // Import from unified JWT file
import type { User } from './types';

// Clé secrète pour les JWT (À REMPLACER PAR UNE VARIABLE D'ENVIRONNEMENT FORTE EN PRODUCTION !)
// La variable JWT_SECRET_STRING n'est plus nécessaire ici, elle est gérée dans lib/jwt.ts
console.log('JWT_SECRET (at top of lib/auth.ts):', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED - Using default fallback!');

// Simulation de hashage (à remplacer par bcrypt en production)
export async function hashPassword(password: string): Promise<string> {
  // En développement, on retourne le mot de passe tel quel
  // En production, utilisez bcrypt
  return password;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // En développement, comparaison simple
  // En production, utilisez bcrypt.compare
  return password === hashedPassword;
}

// Re-export generateToken and verifyToken from jwt.ts
export { generateToken, verifyToken };

export function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

// --- Fonction de test interne pour le JWT ---
async function selfTestAuthJwt() { // Renommé pour éviter la confusion avec le self-test de jwt.ts
  console.log('--- Running Auth JWT Self-Test (lib/auth.ts) ---');
  const testPayload = { userId: 'test-user', email: 'test@example.com', role: 'tester' };
  try {
    const testToken = await generateToken(testPayload as any); // Utilise la fonction generateToken exportée
    console.log('Auth Self-Test (lib/auth.ts): Generated test token:', testToken);
    const decodedTest = await verifyToken(testToken); // Utilise la fonction verifyToken exportée
    console.log('Auth Self-Test (lib/auth.ts): Token successfully verified.');
  } catch (e) {
    console.error('Auth Self-Test (lib/auth.ts): An error occurred during self-test:', e);
  }
  console.log('--- Auth JWT Self-Test (lib/auth.ts) Finished ---');
}

// Exécuter le self-test au démarrage du module (uniquement en dev)
if (process.env.NODE_ENV === 'development') {
  selfTestAuthJwt();
}
