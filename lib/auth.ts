import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Configuration LDAP
const LDAP_CONFIG = {
  url: process.env.LDAP_URL || "ldap://localhost:389",
  baseDN: process.env.LDAP_BASE_DN || "dc=ocp,dc=ma",
  bindDN: process.env.LDAP_BIND_DN || "cn=admin,dc=ocp,dc=ma",
  bindPassword: process.env.LDAP_BIND_PASSWORD || "admin123",
  userSearchBase: process.env.LDAP_USER_SEARCH_BASE || "ou=users,dc=ocp,dc=ma",
  groupSearchBase: process.env.LDAP_GROUP_SEARCH_BASE || "ou=groups,dc=ocp,dc=ma",
}

// Interface utilisateur
interface User {
  id: string
  matricule: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  role: "admin" | "gestionnaire" | "consulteur"
  department?: string
  isActive: boolean
  ldapDN?: string
}

// Simulation base de données utilisateurs (à remplacer par vraie DB)
const users: User[] = [
  {
    id: "1",
    matricule: "12345A",
    nom: "Benali",
    prenom: "Ahmed",
    email: "ahmed.benali@ocp.ma",
    telephone: "+212 6 12 34 56 78",
    role: "admin",
    department: "IT",
    isActive: true,
    ldapDN: "cn=ahmed.benali,ou=users,dc=ocp,dc=ma",
  },
  {
    id: "2",
    matricule: "67890B",
    nom: "Zahra",
    prenom: "Fatima",
    email: "fatima.zahra@ocp.ma",
    telephone: "+212 6 23 45 67 89",
    role: "gestionnaire",
    department: "RH",
    isActive: true,
    ldapDN: "cn=fatima.zahra,ou=users,dc=ocp,dc=ma",
  },
]

// Fonction d'authentification LDAP
async function authenticateLDAP(matricule: string, password: string): Promise<User | null> {
  try {
    // Simulation de l'authentification LDAP
    // Dans un vrai environnement, utiliser une bibliothèque comme 'ldapjs'

    console.log(`Tentative d'authentification LDAP pour: ${matricule}`)

    // Rechercher l'utilisateur dans la base locale d'abord
    const user = users.find((u) => u.matricule === matricule && u.isActive)

    if (!user) {
      console.log("Utilisateur non trouvé dans la base locale")
      return null
    }

    // Simulation de la vérification LDAP
    // En réalité, on ferait une connexion LDAP ici
    if (password === "password123") {
      // Simulation
      console.log("Authentification LDAP réussie")
      return user
    }

    console.log("Échec de l'authentification LDAP")
    return null
  } catch (error) {
    console.error("Erreur LDAP:", error)
    return null
  }
}

// Fonction pour créer un utilisateur dans LDAP
async function createUserInLDAP(userData: Omit<User, "id" | "ldapDN">): Promise<User | null> {
  try {
    // Simulation de création dans LDAP
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      ldapDN: `cn=${userData.prenom.toLowerCase()}.${userData.nom.toLowerCase()},ou=users,dc=ocp,dc=ma`,
      isActive: true,
    }

    // Ajouter à la base locale (simulation)
    users.push(newUser)

    console.log("Utilisateur créé dans LDAP:", newUser.ldapDN)
    return newUser
  } catch (error) {
    console.error("Erreur création LDAP:", error)
    return null
  }
}

// Configuration NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        matricule: { label: "Matricule", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.matricule || !credentials?.password) {
          return null
        }

        const user = await authenticateLDAP(credentials.matricule, credentials.password)

        if (user) {
          return {
            id: user.id,
            name: `${user.prenom} ${user.nom}`,
            email: user.email,
            matricule: user.matricule,
            role: user.role,
            department: user.department,
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 heures
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.matricule = user.matricule
        token.role = user.role
        token.department = user.department
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.matricule = token.matricule as string
        session.user.role = token.role as string
        session.user.department = token.department as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}

// Fonctions utilitaires
export async function getUserByMatricule(matricule: string): Promise<User | null> {
  return users.find((u) => u.matricule === matricule) || null
}

export async function createUser(userData: Omit<User, "id" | "ldapDN">): Promise<User | null> {
  return await createUserInLDAP(userData)
}

export async function updateUserRole(matricule: string, newRole: User["role"]): Promise<boolean> {
  const userIndex = users.findIndex((u) => u.matricule === matricule)
  if (userIndex !== -1) {
    users[userIndex].role = newRole
    console.log(`Rôle mis à jour pour ${matricule}: ${newRole}`)
    return true
  }
  return false
}

export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const permissions = {
    admin: ["read", "write", "delete", "manage_users", "manage_roles"],
    gestionnaire: ["read", "write", "manage_reservations", "manage_payments"],
    consulteur: ["read"],
  }

  return permissions[userRole as keyof typeof permissions]?.includes(requiredPermission) || false
}
