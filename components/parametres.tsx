"use client"

import { useState } from "react"
import {
  Settings,
  User,
  Shield,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Info,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
} from "lucide-react"
import "../styles/parametres.css"
import "../styles/parametres.css"

// Données utilisateur actuelles (simulées)
const currentUser = {
  id: "U001",
  nom: "ocp",
  prenom: "admin",
  matricule: "12345A",
  email: "aadmin@ocp.ma",
  telephone: "+212 6 12 34 56 78",
  dateInscription: "2023-01-15",
  role: "admin",
  derniereConnexion: "2024-01-14",
  adresse: "123 Rue Mohammed V, Casablanca",
  poste: "Gestionnaire Principal",
  dateEmbauche: "2020-01-15",
}

interface ParametreSection {
  id: string
  title: string
  icon: any
  description: string
}

const sections: ParametreSection[] = [
  {
    id: "profile",
    title: "Profil Utilisateur",
    icon: User,
    description: "Informations personnelles et préférences",
  },
  {
    id: "security",
    title: "Sécurité",
    icon: Shield,
    description: "Mot de passe et authentification",
  },
]

export default function ParametresPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // États pour le profil
  const [profileData, setProfileData] = useState({
    nom: currentUser.nom,
    prenom: currentUser.prenom,
    matricule: currentUser.matricule,
    email: currentUser.email,
    telephone: currentUser.telephone,
    adresse: currentUser.adresse,
    poste: currentUser.poste,
    dateEmbauche: currentUser.dateEmbauche,
  })

  // États pour la sécurité
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,
  })

  const handleSave = () => {
    // Simulation de sauvegarde
    console.log("Sauvegarde des paramètres...")
    setHasChanges(false)
    alert("Paramètres sauvegardés avec succès !")
  }

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
      // Réinitialisation des paramètres
      setProfileData({
        nom: currentUser.nom,
        prenom: currentUser.prenom,
        matricule: currentUser.matricule,
        email: currentUser.email,
        telephone: currentUser.telephone,
        adresse: currentUser.adresse,
        poste: currentUser.poste,
        dateEmbauche: currentUser.dateEmbauche,
      })
      setSecuritySettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorAuth: false,
        sessionTimeout: "30",
        loginAlerts: true,
      })
      setHasChanges(false)
      alert("Paramètres réinitialisés !")
    }
  }

  const renderProfileSection = () => (
    <div className="section-content">
      <div className="section-header">
        <h3 className="section-title">Informations Personnelles</h3>
        <p className="section-description">Gérez vos informations de profil et préférences personnelles</p>
      </div>

      {/* Carte utilisateur actuel */}
      <div className="user-card">
        <div className="user-avatar-large">
          {currentUser.prenom[0]}
          {currentUser.nom.split(" ")[0][0]}
        </div>
        <div className="user-info-card">
          <h4 className="user-name-large">
            {currentUser.prenom} {currentUser.nom}
          </h4>
          <p className="user-role">
            #{currentUser.matricule} • {currentUser.role}
          </p>
          <div className="user-meta">
            <div className="meta-item">
              <Calendar size={14} />
              <span>Inscrit le {currentUser.dateInscription}</span>
            </div>
            <div className="meta-item">
              <Info size={14} />
              <span>Dernière connexion: {currentUser.derniereConnexion}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <User size={16} />
            Nom complet *
          </label>
          <input
            type="text"
            className="form-input"
            value={profileData.nom}
            onChange={(e) => {
              setProfileData({ ...profileData, nom: e.target.value })
              setHasChanges(true)
            }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <User size={16} />
            Prénom *
          </label>
          <input
            type="text"
            className="form-input"
            value={profileData.prenom}
            onChange={(e) => {
              setProfileData({ ...profileData, prenom: e.target.value })
              setHasChanges(true)
            }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <Info size={16} />
            Matricule *
          </label>
          <input
            type="text"
            className="form-input"
            value={profileData.matricule}
            onChange={(e) => {
              setProfileData({ ...profileData, matricule: e.target.value })
              setHasChanges(true)
            }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <Mail size={16} />
            Email *
          </label>
          <input
            type="email"
            className="form-input"
            value={profileData.email}
            onChange={(e) => {
              setProfileData({ ...profileData, email: e.target.value })
              setHasChanges(true)
            }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <Phone size={16} />
            Téléphone
          </label>
          <input
            type="tel"
            className="form-input"
            value={profileData.telephone}
            onChange={(e) => {
              setProfileData({ ...profileData, telephone: e.target.value })
              setHasChanges(true)
            }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <Briefcase size={16} />
            Poste
          </label>
          <input
            type="text"
            className="form-input"
            value={profileData.poste}
            onChange={(e) => {
              setProfileData({ ...profileData, poste: e.target.value })
              setHasChanges(true)
            }}
          />
        </div>
        <div className="form-group form-group-full">
          <label className="form-label">
            <MapPin size={16} />
            Adresse
          </label>
          <input
            type="text"
            className="form-input"
            value={profileData.adresse}
            onChange={(e) => {
              setProfileData({ ...profileData, adresse: e.target.value })
              setHasChanges(true)
            }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <Calendar size={16} />
            Date d'embauche
          </label>
          <input
            type="date"
            className="form-input"
            value={profileData.dateEmbauche}
            onChange={(e) => {
              setProfileData({ ...profileData, dateEmbauche: e.target.value })
              setHasChanges(true)
            }}
          />
        </div>
      </div>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="section-content">
      <div className="section-header">
        <h3 className="section-title">Sécurité & Authentification</h3>
        <p className="section-description">Gérez votre mot de passe et les paramètres de sécurité</p>
      </div>

      <div className="security-sections">
        <div className="security-group">
          <h4 className="group-title">
            <Shield size={20} />
            Changer le Mot de Passe
          </h4>
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label className="form-label">Mot de passe actuel *</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={securitySettings.currentPassword}
                  onChange={(e) => {
                    setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })
                    setHasChanges(true)
                  }}
                  placeholder="Entrez votre mot de passe actuel"
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nouveau mot de passe *</label>
              <input
                type="password"
                className="form-input"
                value={securitySettings.newPassword}
                onChange={(e) => {
                  setSecuritySettings({ ...securitySettings, newPassword: e.target.value })
                  setHasChanges(true)
                }}
                placeholder="Nouveau mot de passe"
              />
              <div className="password-requirements">
                <small>• Au moins 8 caractères</small>
                <small>• Une majuscule et une minuscule</small>
                <small>• Un chiffre et un caractère spécial</small>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe *</label>
              <input
                type="password"
                className="form-input"
                value={securitySettings.confirmPassword}
                onChange={(e) => {
                  setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })
                  setHasChanges(true)
                }}
                placeholder="Confirmez le nouveau mot de passe"
              />
              {securitySettings.newPassword &&
                securitySettings.confirmPassword &&
                securitySettings.newPassword !== securitySettings.confirmPassword && (
                  <div className="password-error">Les mots de passe ne correspondent pas</div>
                )}
            </div>
          </div>
        </div>

        <div className="security-group">
          <h4 className="group-title">
            <Settings size={20} />
            Paramètres de Sécurité
          </h4>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <Shield size={20} />
                <div>
                  <div className="setting-name">Authentification à deux facteurs</div>
                  <div className="setting-desc">Sécurité renforcée avec code SMS ou email</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => {
                    setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })
                    setHasChanges(true)
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <Info size={20} />
                <div>
                  <div className="setting-name">Alertes de Connexion</div>
                  <div className="setting-desc">Être notifié des nouvelles connexions</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.loginAlerts}
                  onChange={(e) => {
                    setSecuritySettings({ ...securitySettings, loginAlerts: e.target.checked })
                    setHasChanges(true)
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Délai d'expiration de session</label>
            <select
              className="form-select"
              value={securitySettings.sessionTimeout}
              onChange={(e) => {
                setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })
                setHasChanges(true)
              }}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 heure</option>
              <option value="120">2 heures</option>
              <option value="480">8 heures</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection()
      case "security":
        return renderSecuritySection()
      default:
        return renderProfileSection()
    }
  }

  return (
    <div className="parametres-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <Settings size={28} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Paramètres</h1>
              <p className="page-subtitle">Configuration de votre profil et sécurité</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-header btn-secondary" onClick={handleReset}>
              <RefreshCw size={18} />
              <span>Réinitialiser</span>
            </button>
            <button className="btn-header btn-primary" onClick={handleSave} disabled={!hasChanges}>
              <Save size={18} />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Changes Indicator */}
      {hasChanges && (
        <div className="changes-indicator">
          <Info size={16} />
          <span>Vous avez des modifications non sauvegardées</span>
          <button className="btn-save-changes" onClick={handleSave}>
            Sauvegarder maintenant
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="parametres-layout">
        {/* Sidebar */}
        <div className="parametres-sidebar">
          <div className="sidebar-content">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  className={`sidebar-item ${activeSection === section.id ? "active" : ""}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="sidebar-icon">
                    <Icon size={20} />
                  </div>
                  <div className="sidebar-text">
                    <div className="sidebar-title">{section.title}</div>
                    <div className="sidebar-description">{section.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="parametres-content">
          <div className="content-wrapper">{renderSectionContent()}</div>
        </div>
      </div>
    </div>
  )
}
