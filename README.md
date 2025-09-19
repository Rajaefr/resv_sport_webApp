# OCP Admin - Application Web de Gestion

Application web d'administration pour le système de réservations sportives OCP (Office Chérifien des Phosphates).

## Applications Liées

- **Application Mobile** : [OCP Réservations Mobile](https://github.com/Rajaefr/reserv_sportive_app-mobile)


## Technologies Utilisées

### Frontend
- **Next.js 15.5.3** - Framework React avec SSR/SSG
- **React 18** - Bibliothèque UI moderne
- **TypeScript 5.0** - Typage statique
- **Radix UI** - Composants accessibles (40+ composants)

### Authentification & Sécurité
- **Firebase 12.1.0** - Authentification et backend-as-a-service
- **JWT (Jose)** - Gestion des tokens
- **bcryptjs** - Hachage des mots de passe

### Données & Visualisation
- **Recharts 2.15.4** - Graphiques et statistiques
- **jsPDF + autotable** - Génération de rapports PDF
- **XLSX** - Import/export Excel
- **React Hook Form + Zod** - Validation des formulaires

## Architecture

```
ocp-admin/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Tableau de bord
│   ├── reservations/      # Gestion réservations
│   ├── users/            # Gestion utilisateurs
│   └── api/              # Routes API
├── components/           # Composants React
│   ├── auth/            # Authentification
│   ├── ui/              # Composants UI réutilisables
│   └── *.tsx            # Composants métier
├── lib/                 # Utilitaires et services
├── contexts/           # Contextes React
└── public/             # Assets statiques
```

## Système de Rôles

- **ADMIN** - Accès complet au système
- **GESTIONNAIRE** - Gestion des réservations et groupes
- **CONSULTEUR** - Consultation uniquement
- **USER** - Utilisateur standard

## Fonctionnalités Principales

### Dashboard
- Statistiques en temps réel
- Graphiques de performance
- Alertes système
- Réservations récentes

### Gestion Réservations
- **Piscine** : Groupes, horaires, participants
- **Sport** : Disciplines, équipements, tarifs
- Approbation/Refus des demandes
- Gestion des paiements

### Administration
- Gestion des utilisateurs et rôles
- Codes disciplines sportives
- Groupes piscine (horaires, capacités)
- Paramètres système

### Rapports
- Export PDF/Excel
- Statistiques détaillées
- Historique des réservations
- Rapports financiers

## 🛠Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Base de données (SQLite/PostgreSQL)

### Configuration
1. **Cloner le projet**
```bash
git clone https://github.com/Rajaefr/resv_sportt_webApp.git
cd resv_sportt_webApp
```

2. **Installer les dépendances**
```bash
# Frontend
cd ocp-admin
npm install

# Backend
cd ../backend-unified
npm install
```

3. **Configuration environnement**
```bash
# Backend
cp .env.example .env
# Configurer DATABASE_URL, FIREBASE_CONFIG, etc.

# Frontend
cp .env.local.example .env.local
# Configurer NEXT_PUBLIC_API_URL, NEXT_PUBLIC_FIREBASE_CONFIG
```

4. **Base de données**
```bash
cd backend-unified
npx prisma migrate dev
npx prisma generate
npm run seed
```

5. **Démarrage**
```bash
# Backend (Terminal 1)
cd backend-unified
npm run dev

# Frontend (Terminal 2)
cd ocp-admin
npm run dev
```

## 🔧 Scripts Disponibles

### Frontend (ocp-admin)
```bash
npm run dev      # Développement
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Analyse du code
```

### Backend (backend-unified)
```bash
npm run dev         # Développement avec nodemon
npm run start       # Production
npm run migrate     # Migrations Prisma
npm run seed        # Données de test
npm run studio      # Interface Prisma Studio
```

## Accès Application

- **URL Développement** : http://localhost:3000
- **API Backend** : http://localhost:8000/api

### Comptes de Test
- **Admin** : admin@ocp.ma / admin123
- **Gestionnaire** : gestionnaire@ocp.ma / gest123
- **Consulteur** : consulteur@ocp.ma / cons123

## Intégration Mobile

Cette application web fonctionne en tandem avec l'[application mobile OCP](https://github.com/Rajaefr/reserv_sportive_app-mobile) :

- **API partagée** : Même backend unifié
- **Authentification synchronisée** : Firebase Auth
- **Données temps réel** : Synchronisation automatique
- **Rôles cohérents** : Système RBAC unifié

## Sécurité

- **Authentification Firebase** multi-facteurs
- **Validation stricte** des données (Zod + Joi)
- **Protection CSRF/XSS** avec Helmet
- **Rate limiting** anti-DDoS
- **Chiffrement bcrypt** des mots de passe
- **Tokens JWT** sécurisés

## Monitoring

- **Logging Winston** avec niveaux
- **Métriques de performance** intégrées
- **Alertes système** automatiques
- **Audit trail** des actions admin

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Support

- **Email** : admin@ocp.ma
- **Issues** : [GitHub Issues](https://github.com/Rajaefr/resv_sportt_webApp/issues)
- **Documentation** : [Wiki du projet](https://github.com/Rajaefr/resv_sportt_webApp/wiki)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé pour OCP - Office Chérifien des Phosphates**
