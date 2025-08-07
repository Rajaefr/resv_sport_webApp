# Système d'Authentification OCP Sport

## Vue d'ensemble

Le système d'authentification d'OCP Sport utilise **LDAP (Lightweight Directory Access Protocol)** pour l'authentification des utilisateurs. Cette approche permet une intégration transparente avec l'infrastructure existante d'OCP.

## Architecture

### Composants Principaux

1. **Pages d'Authentification**
   - `/auth/login` - Page de connexion
   - `/auth/forgot-password` - Mot de passe oublié
   - `/auth/reset-password` - Réinitialisation du mot de passe

2. **APIs d'Authentification**
   - `/api/auth/login` - Authentification LDAP
   - `/api/auth/forgot-password` - Envoi d'email de réinitialisation
   - `/api/auth/logout` - Déconnexion

3. **Protection des Routes**
   - `middleware.ts` - Protection côté serveur
   - `AuthGuard` - Protection côté client

## Configuration

### Variables d'Environnement

Créez un fichier `.env.local` basé sur `env.example` :

```bash
# Configuration LDAP
LDAP_URL=ldap://ldap.ocp.ma:389
LDAP_BASE_DN=dc=ocp,dc=ma
LDAP_BIND_DN=cn=admin,dc=ocp,dc=ma
LDAP_BIND_PASSWORD=your_ldap_password

# Configuration JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Configuration Email
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your_email@ocp.ma
SMTP_PASSWORD=your_email_password

# Mode de développement
NODE_ENV=development
```

### Configuration LDAP

Le système supporte plusieurs domaines OCP :
- `ocp.ma` - Domaine principal
- `ocpgroup.ma` - Domaine groupe
- `test.ocp.ma` - Domaine de test

## Utilisation

### Connexion

1. **Accès à la page de connexion** : `/auth/login`
2. **Sélection du domaine** : Choisir le domaine LDAP approprié
3. **Saisie des identifiants** : Nom d'utilisateur et mot de passe
4. **Authentification** : Le système vérifie les identifiants via LDAP

### Mode Développement

En mode développement (`NODE_ENV=development`), le système utilise des identifiants simulés :

```
Username: admin
Password: admin123
```

### Mode Production

En production, le système se connecte au serveur LDAP réel d'OCP.

## Sécurité

### Protection des Routes

- **Middleware** : Vérification automatique des tokens sur toutes les routes protégées
- **AuthGuard** : Protection côté client avec redirection automatique
- **Tokens JWT** : Stockage sécurisé des sessions

### Gestion des Sessions

- **Expiration** : Tokens valides 24h par défaut
- **Stockage** : LocalStorage côté client
- **Validation** : Vérification automatique de l'expiration

## Fonctionnalités

### Authentification LDAP

```typescript
// Exemple d'authentification
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "user.name",
    password: "password",
    domain: "ocp.ma"
  })
})
```

### Mot de Passe Oublié

1. L'utilisateur saisit son email
2. Le système vérifie que l'email appartient au domaine OCP
3. Un email de réinitialisation est envoyé
4. L'utilisateur clique sur le lien pour réinitialiser

### Déconnexion

```typescript
// Utilisation du composant LogoutButton
<LogoutButton variant="default" size="md" />
```

## Intégration

### Dans les Composants

```typescript
import { AuthGuard } from "@/components/auth-guard"
import { LogoutButton } from "@/components/logout-button"

// Protection d'une page
<AuthGuard>
  <YourProtectedComponent />
</AuthGuard>

// Bouton de déconnexion
<LogoutButton />
```

### Vérification d'Authentification

```typescript
// Vérifier si l'utilisateur est connecté
const token = localStorage.getItem("authToken")
const user = localStorage.getItem("user")

if (token && user) {
  // Utilisateur authentifié
} else {
  // Rediriger vers la connexion
}
```

## Déploiement

### Prérequis

1. **Serveur LDAP** : Configuration du serveur LDAP OCP
2. **Variables d'environnement** : Configuration des variables sensibles
3. **Service d'email** : Configuration SMTP pour les mails de réinitialisation

### Étapes de Déploiement

1. **Configuration LDAP**
   ```bash
   # Vérifier la connectivité LDAP
   ldapsearch -H ldap://ldap.ocp.ma:389 -D "cn=admin,dc=ocp,dc=ma" -w password -b "dc=ocp,dc=ma"
   ```

2. **Configuration Email**
   ```bash
   # Tester l'envoi d'email
   npm run test:email
   ```

3. **Déploiement**
   ```bash
   npm run build
   npm start
   ```

## Dépannage

### Problèmes Courants

1. **Erreur de connexion LDAP**
   - Vérifier l'URL et les paramètres LDAP
   - Vérifier les permissions de l'utilisateur bind

2. **Token expiré**
   - Le système redirige automatiquement vers la connexion
   - Vérifier la configuration JWT_EXPIRES_IN

3. **Email non reçu**
   - Vérifier la configuration SMTP
   - Vérifier les logs d'erreur

### Logs

```bash
# Logs d'authentification
tail -f logs/auth.log

# Logs LDAP
tail -f logs/ldap.log
```

## Support

Pour toute question ou problème lié à l'authentification, contactez l'équipe IT OCP. 