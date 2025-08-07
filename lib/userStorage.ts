import fs from 'fs';
import path from 'path';
import type { User } from './types';
import { hashPassword } from './auth';

const STORAGE_FILE = path.join(process.cwd(), 'temp-users.json');

export function loadUsers(): User[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
  }
  return [];
}

export function saveUsers(users: User[]): void {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
    throw new Error('Erreur lors de la sauvegarde');
  }
}

export async function addUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const users = loadUsers();
  
  // Check for existing user by email (username is now generated)
  const existingUser = users.find((u) => u.email === userData.email);
  
  if (existingUser) {
    throw new Error("Un utilisateur avec cet email existe déjà");
  }

  const hashedPassword = await hashPassword(userData.password);
  const now = new Date().toISOString();
  
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}`,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
    role: userData.role || 'consulteur', 
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function findUserByEmail(email: string): User | null {
  const users = loadUsers();
  return users.find((u) => u.email === email) || null;
}

export function findUserByUsername(username: string): User | null {
  const users = loadUsers();
  return users.find((u) => u.username === username) || null;
}

export function userExists(username: string, email: string): boolean {
  const users = loadUsers();
  // For new registrations, we primarily check email uniqueness.
  // If username is generated, we might need to ensure its uniqueness too,
  // but for simplicity, we'll assume email is the main unique identifier for registration.
  return users.some((u) => u.email === email); // Only check email for existence during registration
}
