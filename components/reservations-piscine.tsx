"use client"
import { useState } from "react"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Waves,
  Calendar,
  Users,
  UserCheck,
  User,
  Heart,
  Baby,
  ChevronDown,
  X,
  Download,
  Loader2
} from "lucide-react"
import ExportService from '@/lib/exportService'
import { toast } from 'react-hot-toast'

const reservationsPiscine = [
  {
    id: "P001",
    user: "Ahmed Maaroufi",
    userType: "Collaborateur",
    matricule: "12345A",
    email: "ahmed.benali@ocp.ma",
    date: "2025-08-15",
    heureDebut: "14:00",
    participants: 4,
    status: "acceptee",
    dateCreation: "2025-07-10",
    commentaire: "Réservation pour famille",
    participantsList: [
      { nom: "Ahmed", prenom: "Benali", type: "Collaborateur", groupe: "A1-1" },
      { nom: "Fatima", prenom: "Benali", type: "Conjoint", groupe: "A1-1" },
      { nom: "Sara", prenom: "Benali", type: "Enfant", age: 12, groupe: "A1-2" },
      { nom: "Omar", prenom: "Benali", type: "Enfant", age: 8, groupe: "A1-2" },
    ],
  },
  {
    id: "P002",
    user: "Fatima Zahra Reda",
    userType: "Collaboratrice",
    matricule: "67890B",
    email: "fatima.zahra@ocp.ma",
    date: "2025-07-15",
    heureCreation: "16:00",
    participants: 1,
    status: "en_attente",
    dateCreation: "2025-07-12",
    participantsList: [{ nom: "Fatima Zahra", prenom: "Reda", type: "Collaboratrice", groupe: "A1-2" }],
  },
  {
    id: "P003",
    user: "Mohamed reda",
    userType: "Retraité",
    matricule: "54321C",
    email: "mohamed.reda@ocp.ma",
    date: "2025-07-16",
    heureCreation: "10:00",
    participants: 5,
    status: "refusee",
    dateCreation: "2025-07-11",
    participantsList: [
      { nom: "Mohamed", prenom: "Reda", type: "Retraité", groupe: "A2-1" },
      { nom: "Khadija", prenom: "Reda", type: "Conjoint", groupe: "A2-1" },
      { nom: "Yassine", prenom: "Reda", type: "Enfant", age: 10, groupe: "A2-2" },
      { nom: "Salma", prenom: "Reda", type: "Enfant", age: 14, groupe: "A2-2" },
      { nom: "Ali", prenom: "Reda", type: "Enfant", age: 16, groupe: "A2-2" },
    ],
  },
  {
    id: "P004",
    user: "Khadija Riad",
    userType: "Retraitée",
    matricule: "98765D",
    email: "khadija.Riad@ocp.ma",
    date: "2025-07-16",
    heureCreation: "18:00",
    participants: 2,
    status: "en_attente",
    dateCreation: "2025-07-13",
    participantsList: [
      { nom: "Khadija", prenom: "Riad", type: "Retraitée", groupe: "A2-2" },
      { nom: "Abdellah", prenom: "Riad", type: "Conjoint", groupe: "A2-2" },
    ],
  },
  {
    id: "P005",
    user: "Youssef Idrissi",
    userType: "Collaborateur",
    matricule: "11223E",
    email: "youssef.idrissi@ocp.ma",
    date: "2025-08-17",
    heureCreation: "08:00",
    participants: 4,
    status: "acceptee",
    dateCreation: "2025-08-14",
    participantsList: [
      { nom: "Youssef", prenom: "Idrissi", type: "Collaborateur", groupe: "A1-3" },
      { nom: "Leila", prenom: "Idrissi", type: "Conjoint", groupe: "A1-3" },
      { nom: "Amine", prenom: "Idrissi", type: "Enfant", age: 7, groupe: "A1-4" },
      { nom: "Nadia", prenom: "Idrissi", type: "Enfant", age: 11, groupe: "A1-4" },
    ],
  },
]

const groupes = [
  { id: "A1-1", nom: "Groupe A1-1 - Adultes", bassin: "Grand Bassin", capacite: 15, membres: 12, type: "adulte" },
  { id: "A1-2", nom: "Groupe A1-2 - Enfants", bassin: "Petit Bassin", capacite: 10, membres: 8, type: "enfant" },
  { id: "A1-3", nom: "Groupe A1-3 - Adultes", bassin: "Grand Bassin", capacite: 15, membres: 10, type: "adulte" },
  { id: "A1-4", nom: "Groupe A1-4 - Enfants", bassin: "Petit Bassin", capacite: 12, membres: 6, type: "enfant" },
  { id: "A2-1", nom: "Groupe A2-1 - Retraités", bassin: "Grand Bassin", capacite: 15, membres: 14, type: "adulte" },
  { id: "A2-2", nom: "Groupe A2-2 - Mixte", bassin: "Petit Bassin", capacite: 10, membres: 6, type: "mixte" },
]

// Simulation des données de l'utilisateur connecté (admin)
const currentUser = {
  id: "ADMIN001",
  nom: "Benali",
  prenom: "Ahmed",
  matricule: "ADMIN001",
  email: "ahmed.admin@ocp.ma",
  type: "Admin",
  telephone: "+212 6 12 34 56 78"
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    acceptee: {
      icon: CheckCircle,
      label: "Acceptée",
      className: "status-success",
    },
    refusee: {
      icon: XCircle,
      label: "Refusée",
      className: "status-danger",
    },
    en_attente: {
      icon: Clock,
      label: "En Attente",
      className: "status-warning",
    },
  }
  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null
  const Icon = config.icon
  return (
    <span className={`status-badge ${config.className}`}>
      <span>{config.label}</span>
    </span>
  )
}

const getParticipantIcon = (type: string) => {
  switch (type) {
    case "Collaborateur":
    case "Collaboratrice":
    case "Retraité":
    case "Retraitée":
      return <User size={14} />
    case "Conjoint":
      return <Heart size={14} />
    case "Enfant":
      return <Baby size={14} />
    default:
      return <User size={14} />
  }
}

export function ReservationsPiscine() {
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [groupeFilter, setGroupeFilter] = useState("")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [showNewReservationModal, setShowNewReservationModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // État pour les réservations (maintenant modifiable)
  const [reservations, setReservations] = useState(reservationsPiscine)

  // Formulaire nouvelle réservation
  const [step, setStep] = useState(0)
  const [reserveForSelf, setReserveForSelf] = useState(false)
  const [addSpouses, setAddSpouses] = useState(false)
  const [addChildren, setAddChildren] = useState(false)
  const [userType, setUserType] = useState<"collaborateur" | "retraite">("collaborateur")
  
  // Informations du titulaire (celui qui apparaîtra sur le tableau)
  const [titulaireInfo, setTitulaireInfo] = useState({
    nom: "",
    prenom: "",
    cne: "",
    matricule: "",
    email: "",
    telephone: "",
    type: "collaborateur" as "collaborateur" | "retraite"
  })
  
  // Informations des participants
  const [selfInfo, setSelfInfo] = useState({
    nom: "",
    prenom: "",
    cne: "",
    matricule: "",
    email: "",
    telephone: "",
  })
  const [spouses, setSpouses] = useState([{ nom: "", prenom: "", cne: "" }])
  const [children, setChildren] = useState([{ nom: "", prenom: "", dateNaissance: "", sexe: "M" }])
  const [editForm, setEditForm] = useState({
    user: "",
    email: "",
    date: "",
    heureCreation: "",
    participants: 0,
  })

  // État pour la gestion des groupes par participant
  const [participantGroups, setParticipantGroups] = useState<{ [key: string]: string }>({})

  // États pour les erreurs de validation
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  // Fonctions de validation
  const validateMatricule = (matricule: string, isRetraite: boolean = false) => {
    if (isRetraite) {
      // Pour RCAR : minimum 5 caractères
      if (matricule.length < 5) {
        return "Le numéro RCAR doit contenir au moins 5 caractères"
      }
    } else {
      // Pour matricule : entre 3 et 5 caractères
      if (matricule.length < 3 || matricule.length > 5) {
        return "Le matricule doit contenir entre 3 et 5 caractères"
      }
    }
    return ""
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Format d'email invalide"
    }
    return ""
  }

  const validateTelephone = (telephone: string) => {
    // Format marocain : +212xxxxxxxxx (10 chiffres après +212)
    const phoneRegex = /^\+212[0-9]{9}$/
    if (!phoneRegex.test(telephone)) {
      return "Le téléphone doit être au format +212xxxxxxxxx (9 chiffres après +212)"
    }
    return ""
  }

  const validateCNE = (cne: string) => {
    if (cne.length !== 6) {
      return "Le CNE doit contenir exactement 6 caractères"
    }
    return ""
  }

  // Fonction pour valider un objet d'informations
  const validatePersonInfo = (info: any, isRetraite: boolean = false, prefix: string = "") => {
    const errors: { [key: string]: string } = {}
    
    if (info.matricule) {
      const matriculeError = validateMatricule(info.matricule, isRetraite)
      if (matriculeError) {
        errors[`${prefix}matricule`] = matriculeError
      }
    }
    
    if (info.email) {
      const emailError = validateEmail(info.email)
      if (emailError) {
        errors[`${prefix}email`] = emailError
      }
    }
    
    if (info.telephone) {
      const telephoneError = validateTelephone(info.telephone)
      if (telephoneError) {
        errors[`${prefix}telephone`] = telephoneError
      }
    }
    
    if (info.cne) {
      const cneError = validateCNE(info.cne)
      if (cneError) {
        errors[`${prefix}cne`] = cneError
      }
    }
    
    return errors
  }

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    const matchesDate = !dateFilter || reservation.date === dateFilter
    return matchesSearch && matchesStatus && matchesDate
  })

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReservations = filteredReservations.slice(startIndex, endIndex)

  const clearAdvancedFilters = () => {
    setDateFilter("")
    setGroupeFilter("")
    setShowAdvancedFilters(false)
  }

  const handleDeleteReservation = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      setReservations(reservations.filter(res => res.id !== id))
      alert("Réservation supprimée avec succès")
    }
  }

  const openEditModal = (reservation: any) => {
    setSelectedReservation(reservation)
    setShowEditModal(true)
  }

  const handleEditReservation = () => {
    if (selectedReservation) {
      console.log("Modification réservation:", editForm)
      alert(`Réservation ${editForm.user} modifiée avec succès`)
      setShowEditModal(false)
    }
  }

  const openGroupModal = (reservation: any) => {
    setSelectedReservation(reservation)
    const currentGroups: { [key: string]: string } = {}
    if (reservation.participantsList) {
      reservation.participantsList.forEach((participant: any, index: number) => {
        currentGroups[`${participant.type}-${index}`] = participant.groupe || ""
      })
    }
    setParticipantGroups(currentGroups)
    setShowGroupModal(true)
  }

  const handleGroupAssignment = () => {
    if (!selectedReservation) return

    // Mettre à jour la réservation sélectionnée avec les nouveaux groupes
    const updatedParticipantsList = selectedReservation.participantsList.map((participant: any, index: number) => {
      const groupKey = `${participant.type}-${index}`
      const newGroup = participantGroups[groupKey]
      
      return {
        ...participant,
        groupe: newGroup || participant.groupe
      }
    })

    // Créer une nouvelle réservation mise à jour
    const updatedReservation = {
      ...selectedReservation,
      participantsList: updatedParticipantsList
    }

    // Mettre à jour l'état global des réservations
    setReservations(prevReservations => 
      prevReservations.map(reservation => 
        reservation.id === selectedReservation.id ? updatedReservation : reservation
      )
    )

    // Mettre à jour la réservation sélectionnée pour les détails
    setSelectedReservation(updatedReservation)

    console.log("Affectation aux groupes:", participantGroups)
    alert("Affectation aux groupes mise à jour avec succès")
    setShowGroupModal(false)
  }

  const getAvailableGroupsForParticipant = (participantType: string) => {
    if (participantType === "Enfant") {
      return groupes.filter((g) => g.type === "enfant" || g.type === "mixte")
    } else {
      return groupes.filter((g) => g.type === "adulte" || g.type === "mixte")
    }
  }

  const isAgeBetween6And18 = (dateStr: string) => {
    if (!dateStr) return false
    const today = new Date()
    const birthDate = new Date(dateStr)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    let actualAge = age
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      actualAge--
    }
    return actualAge > 6 && actualAge < 18
  }

  // Fonction pour générer un nouvel ID de réservation
  const generateNewReservationId = () => {
    const maxId = Math.max(...reservations.map(r => parseInt(r.id.substring(1))))
    return `P${String(maxId + 1).padStart(3, '0')}`
  }

  // Fonction pour déterminer qui est le titulaire
  const getTitulaire = () => {
    if (reserveForSelf) {
      // Si l'admin se réserve lui-même, utiliser ses informations saisies dans le formulaire
      return {
        nom: selfInfo.nom,
        prenom: selfInfo.prenom,
        matricule: selfInfo.matricule,
        email: selfInfo.email,
        type: userType === "collaborateur" ? "Collaborateur" : "Retraité"
      }
    } else {
      // Sinon, utiliser les informations du titulaire saisi
      return {
        nom: titulaireInfo.nom,
        prenom: titulaireInfo.prenom,
        matricule: titulaireInfo.matricule,
        email: titulaireInfo.email,
        type: titulaireInfo.type === "collaborateur" ? "Collaborateur" : "Retraité"
      }
    }
  }

  // Fonction pour soumettre une nouvelle réservation
  const handleSubmitNewReservation = () => {
    // Validation des données
    if (!reserveForSelf && !addSpouses && !addChildren) {
      alert("Veuillez sélectionner au moins un type de participant")
      return
    }

    // Validation du titulaire si l'admin ne se réserve pas lui-même
    if (!reserveForSelf && (!titulaireInfo.nom || !titulaireInfo.prenom || !titulaireInfo.matricule || !titulaireInfo.email)) {
      alert("Veuillez remplir toutes les informations du titulaire")
      return
    }

    // Validation des informations personnelles si l'admin se réserve lui-même
    if (reserveForSelf && (!selfInfo.nom || !selfInfo.prenom || !selfInfo.matricule || !selfInfo.email)) {
      alert("Veuillez remplir toutes vos informations personnelles")
      return
    }

    // Validation des formats pour le titulaire
    if (!reserveForSelf) {
      const titulaireErrors = validatePersonInfo(titulaireInfo, titulaireInfo.type === "retraite", "titulaire_")
      if (Object.keys(titulaireErrors).length > 0) {
        const errorMessages = Object.values(titulaireErrors).join("\n")
        alert(`Erreurs dans les informations du titulaire:\n${errorMessages}`)
        setValidationErrors(prev => ({ ...prev, ...titulaireErrors }))
        return
      }
    }

    // Validation des formats pour les informations personnelles
    if (reserveForSelf) {
      const selfErrors = validatePersonInfo(selfInfo, userType === "retraite", "self_")
      if (Object.keys(selfErrors).length > 0) {
        const errorMessages = Object.values(selfErrors).join("\n")
        alert(`Erreurs dans vos informations personnelles:\n${errorMessages}`)
        setValidationErrors(prev => ({ ...prev, ...selfErrors }))
        return
      }
    }

    // Construction de la liste des participants
    const participantsList = []
    let totalParticipants = 0

    // Ajouter l'utilisateur lui-même s'il est sélectionné
    if (reserveForSelf && selfInfo.nom && selfInfo.prenom) {
      participantsList.push({
        nom: selfInfo.nom,
        prenom: selfInfo.prenom,
        type: userType === "collaborateur" ? "Collaborateur" : "Retraité",
        groupe: "A1-1" // Groupe par défaut, peut être modifié après
      })
      totalParticipants++
    }

    // Ajouter les conjoints
    if (addSpouses) {
      spouses.forEach(spouse => {
        if (spouse.nom && spouse.prenom) {
          participantsList.push({
            nom: spouse.nom,
            prenom: spouse.prenom,
            type: "Conjoint",
            groupe: "A1-1" // Groupe par défaut
          })
          totalParticipants++
        }
      })
    }

    // Ajouter les enfants
    if (addChildren && (reserveForSelf ? userType === "collaborateur" : titulaireInfo.type === "collaborateur")) {
      children.forEach(child => {
        if (child.nom && child.prenom && child.dateNaissance && isAgeBetween6And18(child.dateNaissance)) {
          const today = new Date()
          const birthDate = new Date(child.dateNaissance)
          const age = today.getFullYear() - birthDate.getFullYear()
          participantsList.push({
            nom: child.nom,
            prenom: child.prenom,
            type: "Enfant",
            age: age,
            groupe: "A1-2" // Groupe par défaut pour enfants
          })
          totalParticipants++
        }
      })
    }

    if (totalParticipants === 0) {
      alert("Aucun participant valide trouvé")
      return
    }

    // Obtenir les informations du titulaire
    const titulaire = getTitulaire()

    // Création de la nouvelle réservation avec les données du titulaire
    const now = new Date()
    const newReservation = {
      id: generateNewReservationId(),
      user: `${titulaire.prenom} ${titulaire.nom}`, // Nom du titulaire
      userType: titulaire.type,
      matricule: titulaire.matricule,
      email: titulaire.email,
      date: now.toISOString().split('T')[0], // Date actuelle
      heureDebut: now.toTimeString().split(' ')[0].substring(0, 5), // Heure actuelle
      participants: totalParticipants,
      status: "en_attente", // Statut par défaut
      dateCreation: now.toISOString().split('T')[0], // Date de création automatique
      commentaire: reserveForSelf 
        ? `Réservation personnelle pour ${totalParticipants} participant(s)`
        : `Réservation créée par l'admin pour le titulaire ${titulaire.prenom} ${titulaire.nom} - ${totalParticipants} participant(s)`,
      participantsList: participantsList
    }

    // Ajouter la nouvelle réservation à la liste
    setReservations([newReservation, ...reservations])

    // Réinitialiser le formulaire
    resetNewReservationForm()
    setShowNewReservationModal(false)
    
    alert(`Nouvelle réservation créée avec succès! `)
  }

  // Fonction pour réinitialiser le formulaire
  const resetNewReservationForm = () => {
    setStep(0)
    setReserveForSelf(false)
    setAddSpouses(false)
    setAddChildren(false)
    setUserType("collaborateur")
    setTitulaireInfo({
      nom: "",
      prenom: "",
      cne: "",
      matricule: "",
      email: "",
      telephone: "",
      type: "collaborateur"
    })
    setSelfInfo({
      nom: "",
      prenom: "",
      cne: "",
      matricule: "",
      email: "",
      telephone: "",
    })
    setSpouses([{ nom: "", prenom: "", cne: "" }])
    setChildren([{ nom: "", prenom: "", dateNaissance: "", sexe: "M" }])
  }

  // Fonction pour passer à l'étape suivante
  const handleNextStep = () => {
    if (step === 0) {
      // Validation de l'étape 0
      if (!reserveForSelf && !addSpouses && !addChildren) {
        alert("Veuillez sélectionner au moins un type de participant")
        return
      }
      
      // Si l'admin ne se réserve pas lui-même, aller à l'étape de saisie du titulaire
      if (!reserveForSelf) {
        setStep(1) // Étape titulaire
      } else {
        setStep(2) // Étape participants directement
      }
    } else if (step === 1) {
      // Validation du titulaire
      if (!titulaireInfo.nom || !titulaireInfo.prenom || !titulaireInfo.matricule || !titulaireInfo.email) {
        alert("Veuillez remplir toutes les informations du titulaire")
        return
      }
      
      // Validation des formats pour le titulaire
      const titulaireErrors = validatePersonInfo(titulaireInfo, titulaireInfo.type === "retraite", "titulaire_")
      if (Object.keys(titulaireErrors).length > 0) {
        const errorMessages = Object.values(titulaireErrors).join("\n")
        alert(`Erreurs dans les informations du titulaire:\n${errorMessages}`)
        setValidationErrors(prev => ({ ...prev, ...titulaireErrors }))
        return
      }
      
      setStep(2) // Étape participants
    } else if (step === 2) {
      // Validation des informations personnelles si l'admin se réserve lui-même
      if (reserveForSelf) {
        if (!selfInfo.nom || !selfInfo.prenom || !selfInfo.matricule || !selfInfo.email) {
          alert("Veuillez remplir toutes vos informations personnelles")
          return
        }
        
        // Validation des formats pour les informations personnelles
        const selfErrors = validatePersonInfo(selfInfo, userType === "retraite", "self_")
        if (Object.keys(selfErrors).length > 0) {
          const errorMessages = Object.values(selfErrors).join("\n")
          alert(`Erreurs dans vos informations personnelles:\n${errorMessages}`)
          setValidationErrors(prev => ({ ...prev, ...selfErrors }))
          return
        }
      }
      
      setStep(3) // Étape récapitulatif
    }
  }

  // Fonction pour revenir à l'étape précédente
  const handlePreviousStep = () => {
    if (step === 1) {
      setStep(0)
    } else if (step === 2) {
      if (!reserveForSelf) {
        setStep(1) // Retour à l'étape titulaire
      } else {
        setStep(0) // Retour à l'étape sélection
      }
    } else if (step === 3) {
      setStep(2)
    }
  }

  return (
    <div className="reservations-piscine-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <Waves size={28} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Réservations Piscine</h1>
              <p className="page-subtitle">
                Gestion des réservations des bassins de natation • {filteredReservations.length} réservations
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-header btn-secondary" onClick={handleExportReservations}
      disabled={isExporting}>
             {isExporting ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <Download size={16} />
      )}
              <span>Exporter-Excel </span>
            </button>
            <button className="btn-header btn-primary" onClick={() => setShowNewReservationModal(true)}>
              <Plus size={18} />
              <span>Nouvelle Réservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Version minimisée */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Waves size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">15</div>
            <div className="stat-label">Aujourd'hui</div>
          </div>
          <div className="stat-trend">+12%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reservations.filter((r) => r.status === "acceptee").length}</div>
            <div className="stat-label">Acceptées</div>
          </div>
          <div className="stat-trend">+5%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reservations.filter((r) => r.status === "en_attente").length}</div>
            <div className="stat-label">En Attente</div>
          </div>
          <div className="stat-trend">-2%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reservations.reduce((sum, r) => sum + r.participants, 0)}</div>
            <div className="stat-label">Participants</div>
          </div>
          <div className="stat-trend">+8%</div>
        </div>
      </div>

      {/* Filters améliorés */}
      <div className="filters-container">
        <div className="search-wrapper">
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom, matricule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="filters-controls">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">Tous les statuts</option>
            <option value="acceptee">Acceptées</option>
            <option value="en_attente">En Attente</option>
            <option value="refusee">Refusées</option>
          </select>
          <button className="btn-filter" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Filter size={16} />
            <span>Filtres avancés</span>
            <ChevronDown size={16} className={`chevron ${showAdvancedFilters ? "rotated" : ""}`} />
          </button>
          {(dateFilter || groupeFilter) && (
            <button className="btn-clear-filters" onClick={clearAdvancedFilters}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filtres avancés */}
      {showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="advanced-filters-grid">
            <div className="filter-group">
              <label className="filter-label">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Groupe</label>
              <input
                type="text"
                placeholder="Filtrer par groupe..."
                value={groupeFilter}
                onChange={(e) => setGroupeFilter(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-results">
              <span className="results-text">{filteredReservations.length} résultat(s) trouvé(s)</span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Liste des Réservations</h3>
          
        </div>
        <div className="table-wrapper">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Titulaire</th>
                <th>Type & Matricule</th>
                <th>Date & Heure</th>
                <th>Participants</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation) => (
                <tr key={reservation.id} className="table-row">
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {reservation.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{reservation.user}</div>
                        <div className="user-email">{reservation.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="type-cell">
                      <div className="type-badge">
                        <UserCheck size={12} />
                        <span>{reservation.userType}</span>
                      </div>
                      <div className="matricule">{reservation.matricule}</div>
                    </div>
                  </td>
                  <td>
                    <div className="datetime-cell">
                      <div className="date-info">
                        <Calendar size={12} />
                        <span>{reservation.date}</span>
                      </div>
                      <div className="time-info">
                        <Clock size={12} />
                        <span>
                          {reservation.heureDebut || reservation.heureCreation} 
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="participants-badge">
                      <Users size={14} />
                      <span>{reservation.participants}</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(reservation.status)}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="action-btn action-view"
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setShowDetailsModal(true)
                        }}
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn action-group"
                        onClick={() => openGroupModal(reservation)}
                        title="Gérer groupes"
                      >
                        <Users size={16} />
                      </button>
                      <button
                        className="action-btn action-delete"
                        onClick={() => handleDeleteReservation(reservation.id)}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination améliorée */}
      <div className="pagination-container">
        <div className="pagination-info">
          Affichage de {startIndex + 1} à {Math.min(endIndex, filteredReservations.length)} sur{" "}
          {filteredReservations.length} réservations
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Modal Nouvelle Réservation */}
      {showNewReservationModal && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Nouvelle Réservation Piscine</h3>
                  <p className="modal-subtitle">
                    Étape {step + 1} sur 4 - Admin: {currentUser.prenom} {currentUser.nom}
                  </p>
                </div>
              </div>
              <button className="modal-close" onClick={() => {
                resetNewReservationForm()
                setShowNewReservationModal(false)
              }}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {/* Étape 0 - Sélection des participants */}
              {step === 0 && (
                <div className="step-container">
                  <div className="step-header">
                    <h4 className="step-title">Sélection des participants</h4>
                    <p className="step-description">Qui participera à cette réservation ?</p>
                  </div>
                  <div className="participants-selection-grid">
                    <div className={`selection-card ${reserveForSelf ? "selected" : ""}`}>
                      <label className="selection-card-label">
                        <input
                          type="checkbox"
                          checked={reserveForSelf}
                          onChange={(e) => setReserveForSelf(e.target.checked)}
                          className="selection-checkbox"
                        />
                        <div className="selection-card-content">
                          <User size={24} className="selection-icon" />
                          <h6 className="selection-title">Moi-même</h6>
                          <p className="selection-description">Je participe à cette réservation</p>
                        </div>
                      </label>
                    </div>
                    <div className={`selection-card ${addSpouses ? "selected" : ""}`}>
                      <label className="selection-card-label">
                        <input
                          type="checkbox"
                          checked={addSpouses}
                          onChange={(e) => setAddSpouses(e.target.checked)}
                          className="selection-checkbox"
                        />
                        <div className="selection-card-content">
                          <Heart size={24} className="selection-icon" />
                          <h6 className="selection-title">Conjoints</h6>
                          <p className="selection-description">Maximum 2 conjoints</p>
                        </div>
                      </label>
                    </div>
                    <div className={`selection-card ${addChildren ? "selected" : ""}`}>
                      <label className="selection-card-label">
                        <input
                          type="checkbox"
                          checked={addChildren}
                          onChange={(e) => setAddChildren(e.target.checked)}
                          className="selection-checkbox"
                        />
                        <div className="selection-card-content">
                          <Baby size={24} className="selection-icon" />
                          <h6 className="selection-title">Enfants 6-18 ans</h6>
                          <p className="selection-description">Maximum 5 enfants</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  {!reserveForSelf && (addSpouses || addChildren) && (
                    <div className="alert-info">
                      <strong>Information:</strong> Vous créez une réservation pour des conjoints/enfants. 
                      À l'étape suivante, vous devrez spécifier le titulaire (collaborateur/retraité) responsable de cette réservation.
                    </div>
                  )}
                </div>
              )}

              {/* Étape 1 - Informations du titulaire (si admin ne se réserve pas lui-même) */}
              {step === 1 && !reserveForSelf && (
                <div className="step-container">
                  <div className="step-header">
                    <h4 className="step-title">Informations du titulaire</h4>
                    <p className="step-description">Qui est le titulaire responsable de cette réservation ?</p>
                  </div>
                  <div className="alert-info">
                    <strong>Important:</strong> Le titulaire est la personne (collaborateur/retraité) sous le nom de laquelle 
                    la réservation apparaîtra dans le tableau. Cette personne est responsable de la réservation.
                  </div>
                  <div className="info-card">
                    <div className="info-card-header">
                      <h5 className="info-card-title">Informations du titulaire</h5>
                    </div>
                    <div className="info-card-body">
                      <div className="user-type-selection">
                        <h5 className="selection-title">Type de titulaire</h5>
                        <div className="radio-group">
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="titulaire-collaborateur"
                              name="titulaireType"
                              value="collaborateur"
                              checked={titulaireInfo.type === "collaborateur"}
                              onChange={(e) => setTitulaireInfo({...titulaireInfo, type: e.target.value as "collaborateur" | "retraite"})}
                            />
                            <label htmlFor="titulaire-collaborateur" className="radio-label">
                              Collaborateur
                            </label>
                          </div>
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="titulaire-retraite"
                              name="titulaireType"
                              value="retraite"
                              checked={titulaireInfo.type === "retraite"}
                              onChange={(e) => setTitulaireInfo({...titulaireInfo, type: e.target.value as "collaborateur" | "retraite"})}
                            />
                            <label htmlFor="titulaire-retraite" className="radio-label">
                              Retraité
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Nom *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={titulaireInfo.nom}
                            onChange={(e) => setTitulaireInfo({ ...titulaireInfo, nom: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Prénom *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={titulaireInfo.prenom}
                            onChange={(e) => setTitulaireInfo({ ...titulaireInfo, prenom: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CNE</label>
                          <input
                            type="text"
                            className={`form-input ${validationErrors['titulaire_cne'] ? 'form-input-error' : ''}`}
                            value={titulaireInfo.cne}
                            onChange={(e) => {
                              setTitulaireInfo({ ...titulaireInfo, cne: e.target.value })
                              if (e.target.value) {
                                const error = validateCNE(e.target.value)
                                setValidationErrors(prev => ({
                                  ...prev,
                                  titulaire_cne: error
                                }))
                              } else {
                                setValidationErrors(prev => {
                                  const newErrors = { ...prev }
                                  delete newErrors.titulaire_cne
                                  return newErrors
                                })
                              }
                            }}
                          />
                          {validationErrors['titulaire_cne'] && (
                            <span className="error-message">{validationErrors['titulaire_cne']}</span>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            {titulaireInfo.type === "retraite" ? "Numéro RCAR *" : "Matricule *"}
                          </label>
                          <input
                            type="text"
                            className={`form-input ${validationErrors['titulaire_matricule'] ? 'form-input-error' : ''}`}
                            value={titulaireInfo.matricule}
                            onChange={(e) => {
                              setTitulaireInfo({ ...titulaireInfo, matricule: e.target.value })
                              if (e.target.value) {
                                const error = validateMatricule(e.target.value, titulaireInfo.type === "retraite")
                                setValidationErrors(prev => ({
                                  ...prev,
                                  titulaire_matricule: error
                                }))
                              } else {
                                setValidationErrors(prev => {
                                  const newErrors = { ...prev }
                                  delete newErrors.titulaire_matricule
                                  return newErrors
                                })
                              }
                            }}
                          />
                          {validationErrors['titulaire_matricule'] && (
                            <span className="error-message">{validationErrors['titulaire_matricule']}</span>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Email *</label>
                          <input
                            type="email"
                            className={`form-input ${validationErrors['titulaire_email'] ? 'form-input-error' : ''}`}
                            value={titulaireInfo.email}
                            onChange={(e) => {
                              setTitulaireInfo({ ...titulaireInfo, email: e.target.value })
                              if (e.target.value) {
                                const error = validateEmail(e.target.value)
                                setValidationErrors(prev => ({
                                  ...prev,
                                  titulaire_email: error
                                }))
                              } else {
                                setValidationErrors(prev => {
                                  const newErrors = { ...prev }
                                  delete newErrors.titulaire_email
                                  return newErrors
                                })
                              }
                            }}
                          />
                          {validationErrors['titulaire_email'] && (
                            <span className="error-message">{validationErrors['titulaire_email']}</span>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="tel"
                            className={`form-input ${validationErrors['titulaire_telephone'] ? 'form-input-error' : ''}`}
                            value={titulaireInfo.telephone}
                            onChange={(e) => {
                              setTitulaireInfo({ ...titulaireInfo, telephone: e.target.value })
                              if (e.target.value) {
                                const error = validateTelephone(e.target.value)
                                setValidationErrors(prev => ({
                                  ...prev,
                                  titulaire_telephone: error
                                }))
                              } else {
                                setValidationErrors(prev => {
                                  const newErrors = { ...prev }
                                  delete newErrors.titulaire_telephone
                                  return newErrors
                                })
                              }
                            }}
                          />
                          {validationErrors['titulaire_telephone'] && (
                            <span className="error-message">{validationErrors['titulaire_telephone']}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2 - Informations des participants */}
              {step === 2 && (
                <div className="step-container">
                  <div className="step-header">
                    <h4 className="step-title">Informations des participants</h4>
                    <p className="step-description">Veuillez remplir les informations des participants</p>
                  </div>
                  {reserveForSelf && (
                    <div className="info-card">
                      <div className="info-card-header">
                        <h5 className="info-card-title">Mes informations (Titulaire)</h5>
                      </div>
                      <div className="info-card-body">
                        <div className="user-type-selection">
                          <h5 className="selection-title">Mon type</h5>
                          <div className="radio-group">
                            <div className="radio-option">
                              <input
                                type="radio"
                                id="collaborateur"
                                name="userType"
                                value="collaborateur"
                                checked={userType === "collaborateur"}
                                onChange={(e) => setUserType(e.target.value as "collaborateur" | "retraite")}
                              />
                              <label htmlFor="collaborateur" className="radio-label">
                                Collaborateur
                              </label>
                            </div>
                            <div className="radio-option">
                              <input
                                type="radio"
                                id="retraite"
                                name="userType"
                                value="retraite"
                                checked={userType === "retraite"}
                                onChange={(e) => setUserType(e.target.value as "collaborateur" | "retraite")}
                              />
                              <label htmlFor="retraite" className="radio-label">
                                Retraité
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="form-label">Nom *</label>
                            <input
                              type="text"
                              className="form-input"
                              value={selfInfo.nom}
                              onChange={(e) => setSelfInfo({ ...selfInfo, nom: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Prénom *</label>
                            <input
                              type="text"
                              className="form-input"
                              value={selfInfo.prenom}
                              onChange={(e) => setSelfInfo({ ...selfInfo, prenom: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">CNE</label>
                            <input
                              type="text"
                              className={`form-input ${validationErrors['self_cne'] ? 'form-input-error' : ''}`}
                              value={selfInfo.cne}
                              onChange={(e) => {
                                setSelfInfo({ ...selfInfo, cne: e.target.value })
                                if (e.target.value) {
                                  const error = validateCNE(e.target.value)
                                  setValidationErrors(prev => ({
                                    ...prev,
                                    self_cne: error
                                  }))
                                } else {
                                  setValidationErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.self_cne
                                    return newErrors
                                  })
                                }
                              }}
                            />
                            {validationErrors['self_cne'] && (
                              <span className="error-message">{validationErrors['self_cne']}</span>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              {userType === "retraite" ? "Numéro RCAR *" : "Matricule *"}
                            </label>
                            <input
                              type="text"
                              className={`form-input ${validationErrors['self_matricule'] ? 'form-input-error' : ''}`}
                              value={selfInfo.matricule}
                              onChange={(e) => {
                                setSelfInfo({ ...selfInfo, matricule: e.target.value })
                                if (e.target.value) {
                                  const error = validateMatricule(e.target.value, userType === "retraite")
                                  setValidationErrors(prev => ({
                                    ...prev,
                                    self_matricule: error
                                  }))
                                } else {
                                  setValidationErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.self_matricule
                                    return newErrors
                                  })
                                }
                              }}
                            />
                            {validationErrors['self_matricule'] && (
                              <span className="error-message">{validationErrors['self_matricule']}</span>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                              type="email"
                              className={`form-input ${validationErrors['self_email'] ? 'form-input-error' : ''}`}
                              value={selfInfo.email}
                              onChange={(e) => {
                                setSelfInfo({ ...selfInfo, email: e.target.value })
                                if (e.target.value) {
                                  const error = validateEmail(e.target.value)
                                  setValidationErrors(prev => ({
                                    ...prev,
                                    self_email: error
                                  }))
                                } else {
                                  setValidationErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.self_email
                                    return newErrors
                                  })
                                }
                              }}
                            />
                            {validationErrors['self_email'] && (
                              <span className="error-message">{validationErrors['self_email']}</span>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="form-label">Téléphone</label>
                            <input
                              type="tel"
                              className={`form-input ${validationErrors['self_telephone'] ? 'form-input-error' : ''}`}
                              value={selfInfo.telephone}
                              onChange={(e) => {
                                setSelfInfo({ ...selfInfo, telephone: e.target.value })
                                if (e.target.value) {
                                  const error = validateTelephone(e.target.value)
                                  setValidationErrors(prev => ({
                                    ...prev,
                                    self_telephone: error
                                  }))
                                } else {
                                  setValidationErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.self_telephone
                                    return newErrors
                                  })
                                }
                              }}
                            />
                            {validationErrors['self_telephone'] && (
                              <span className="error-message">{validationErrors['self_telephone']}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {addSpouses && (
                    <div className="info-card">
                      <div className="info-card-header">
                        <h5 className="info-card-title">Conjoints</h5>
                        {spouses.length < 2 && (
                          <button
                            type="button"
                            className="btn-add-item"
                            onClick={() => {
                              if (spouses.length < 2) {
                                setSpouses([...spouses, { nom: "", prenom: "", cne: "" }])
                              }
                            }}
                          >
                            <Plus size={16} />
                            <span>Ajouter</span>
                          </button>
                        )}
                      </div>
                      <div className="info-card-body">
                        {spouses.map((spouse, index) => (
                          <div key={index} className="spouse-form">
                            <div className="spouse-header">
                              <h6 className="spouse-title">Conjoint {index + 1}</h6>
                              {spouses.length > 1 && (
                                <button
                                  type="button"
                                  className="btn-remove-item"
                                  onClick={() => setSpouses(spouses.filter((_, i) => i !== index))}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                            <div className="form-grid">
                              <div className="form-group">
                                <label className="form-label">Nom *</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={spouse.nom}
                                  onChange={(e) => {
                                    const updated = [...spouses]
                                    updated[index].nom = e.target.value
                                    setSpouses(updated)
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Prénom *</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={spouse.prenom}
                                  onChange={(e) => {
                                    const updated = [...spouses]
                                    updated[index].prenom = e.target.value
                                    setSpouses(updated)
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">CNE</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={spouse.cne}
                                  onChange={(e) => {
                                    const updated = [...spouses]
                                    updated[index].cne = e.target.value
                                    setSpouses(updated)
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {addChildren && (reserveForSelf ? userType === "collaborateur" : titulaireInfo.type === "collaborateur") && (
                    <div className="info-card">
                      <div className="info-card-header">
                        <h5 className="info-card-title">Enfants (6-18 ans)</h5>
                        {children.length < 5 && (
                          <button
                            type="button"
                            className="btn-add-item"
                            onClick={() => {
                              if (children.length < 5) {
                                setChildren([...children, { nom: "", prenom: "", dateNaissance: "", sexe: "M" }])
                              }
                            }}
                          >
                            <Plus size={16} />
                            <span>Ajouter</span>
                          </button>
                        )}
                      </div>
                      <div className="info-card-body">
                        {children.map((child, index) => (
                          <div key={index} className="child-form">
                            <div className="child-header">
                              <h6 className="child-title">Enfant {index + 1}</h6>
                              {children.length > 1 && (
                                <button
                                  type="button"
                                  className="btn-remove-item"
                                  onClick={() => setChildren(children.filter((_, i) => i !== index))}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                            <div className="form-grid">
                              <div className="form-group">
                                <label className="form-label">Nom *</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={child.nom}
                                  onChange={(e) => {
                                    const updated = [...children]
                                    updated[index].nom = e.target.value
                                    setChildren(updated)
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Prénom *</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={child.prenom}
                                  onChange={(e) => {
                                    const updated = [...children]
                                    updated[index].prenom = e.target.value
                                    setChildren(updated)
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Date de naissance *</label>
                                <input
                                  type="date"
                                  className="form-input"
                                  value={child.dateNaissance}
                                  onChange={(e) => {
                                    const updated = [...children]
                                    updated[index].dateNaissance = e.target.value
                                    setChildren(updated)
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Sexe *</label>
                                <select
                                  className="form-select"
                                  value={child.sexe}
                                  onChange={(e) => {
                                    const updated = [...children]
                                    updated[index].sexe = e.target.value
                                    setChildren(updated)
                                  }}
                                >
                                  <option value="M">Masculin</option>
                                  <option value="F">Féminin</option>
                                </select>
                              </div>
                            </div>
                            {child.nom &&
                              child.prenom &&
                              child.dateNaissance &&
                              !isAgeBetween6And18(child.dateNaissance) && (
                                <div className="alert-warning">
                                  <small>L'enfant doit avoir entre 6 et 18 ans pour la piscine</small>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {addChildren && (reserveForSelf ? userType === "retraite" : titulaireInfo.type === "retraite") && (
                    <div className="alert-info">
                      <strong>Information:</strong> Les retraités ne peuvent pas ajouter d'enfants à leurs réservations.
                    </div>
                  )}
                </div>
              )}

              {/* Étape 3 - Récapitulatif */}
              {step === 3 && (
                <div className="step-container">
                  <div className="step-header">
                    <h4 className="step-title">Récapitulatif</h4>
                    <p className="step-description">Vérifiez les informations avant de créer la réservation</p>
                  </div>
                  <div className="summary-card">
                    <div className="summary-header">
                      <h5 className="summary-title">Réservation Piscine</h5>
                    </div>
                    <div className="summary-body">
                      <div className="summary-item">
                        <User size={16} className="summary-icon" />
                        <span className="summary-text">
                          <strong>Titulaire:</strong> {reserveForSelf 
                            ? `${selfInfo.prenom} ${selfInfo.nom} (${userType === "collaborateur" ? "Collaborateur" : "Retraité"})`
                            : `${titulaireInfo.prenom} ${titulaireInfo.nom} (${titulaireInfo.type === "collaborateur" ? "Collaborateur" : "Retraité"})`
                          }
                        </span>
                      </div>
                      <div className="summary-item">
                        <Calendar size={16} className="summary-icon" />
                        <span className="summary-text">
                          <strong>Date et heure:</strong> {new Date().toLocaleString('fr-FR')} (automatique)
                        </span>
                      </div>
                      <div className="summary-item">
                        <User size={16} className="summary-icon" />
                        <span className="summary-text">
                          <strong>Créée par:</strong> {currentUser.prenom} {currentUser.nom} (Admin)
                        </span>
                      </div>
                      {reserveForSelf && selfInfo.nom && selfInfo.prenom && (
                        <div className="summary-item">
                          <User size={16} className="summary-icon" />
                          <span className="summary-text">
                            <strong>Participant:</strong> {selfInfo.prenom} {selfInfo.nom} ({userType === "retraite" ? "Retraité" : "Collaborateur"})
                          </span>
                        </div>
                      )}
                      {addSpouses &&
                        spouses
                          .filter((s) => s.nom.trim() && s.prenom.trim())
                          .map((spouse, index) => (
                            <div key={index} className="summary-item">
                              <Heart size={16} className="summary-icon" />
                              <span className="summary-text">
                                <strong>Conjoint:</strong> {spouse.prenom} {spouse.nom}
                              </span>
                            </div>
                          ))}
                      {addChildren &&
                        (reserveForSelf ? userType === "collaborateur" : titulaireInfo.type === "collaborateur") &&
                        children
                          .filter((c) => c.nom.trim() && c.prenom.trim() && isAgeBetween6And18(c.dateNaissance))
                          .map((child, index) => (
                            <div key={index} className="summary-item">
                              <Baby size={16} className="summary-icon" />
                              <span className="summary-text">
                                <strong>Enfant:</strong> {child.prenom} {child.nom} (
                                {new Date().getFullYear() - new Date(child.dateNaissance).getFullYear()} ans)
                              </span>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {step > 0 && (
                <button className="btn-modal btn-secondary" onClick={handlePreviousStep}>
                  Précédent
                </button>
              )}
              <button className="btn-modal btn-secondary" onClick={() => {
                resetNewReservationForm()
                setShowNewReservationModal(false)
              }}>
                Annuler
              </button>
              {step < 3 ? (
                <button
                  className="btn-modal btn-primary"
                  onClick={handleNextStep}
                >
                  Suivant
                </button>
              ) : (
                <button
                  className="btn-modal btn-primary"
                  onClick={handleSubmitNewReservation}
                >
                  Créer la réservation
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals existants - Détails, Groupes, etc. */}
      {showDetailsModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Waves size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Détails de la Réservation</h3>
                  <p className="modal-subtitle">{selectedReservation.user}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="details-section">
                  <h4 className="section-title">Informations du Titulaire</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Nom complet</span>
                      <span className="info-value">{selectedReservation.user}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Type</span>
                      <span className="info-value">{selectedReservation.userType}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Matricule</span>
                      <span className="info-value">{selectedReservation.matricule}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{selectedReservation.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date</span>
                      <span className="info-value">{selectedReservation.date}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Horaire</span>
                      <span className="info-value">
                        {selectedReservation.heureDebut || selectedReservation.heureCreation} 
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Statut</span>
                      <span className="info-value">{getStatusBadge(selectedReservation.status)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Participants</span>
                      <span className="info-value">{selectedReservation.participants}</span>
                    </div>
                  </div>
                </div>
                <div className="details-section">
                  <h4 className="section-title">Participants par Catégorie</h4>
                  <div className="participants-container">
                    {/* Collaborateurs/Retraités */}
                    <div className="participant-category">
                      <h5 className="category-title">
                        <User size={16} />
                        Collaborateurs / Retraités
                      </h5>
                      {selectedReservation.participantsList
                        ?.filter(
                          (p) =>
                            p.type === "Collaborateur" ||
                            p.type === "Collaboratrice" ||
                            p.type === "Retraité" ||
                            p.type === "Retraitée",
                        )
                        .map((p, index) => (
                          <div key={`collab-${index}`} className="participant-item">
                            <div className="participant-icon">{getParticipantIcon(p.type)}</div>
                            <div className="participant-info">
                              <span className="participant-name">
                                {p.prenom} {p.nom}
                              </span>
                              <span className="participant-type">{p.type}</span>
                              <span className="participant-group">Groupe: {p.groupe}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                    {/* Conjoints */}
                    {selectedReservation.participantsList?.some((p) => p.type === "Conjoint") && (
                      <div className="participant-category">
                        <h5 className="category-title">
                          <Heart size={16} />
                          Conjoints
                        </h5>
                        {selectedReservation.participantsList
                          ?.filter((p) => p.type === "Conjoint")
                          .map((p, index) => (
                            <div key={`conjoint-${index}`} className="participant-item">
                              <div className="participant-icon">{getParticipantIcon(p.type)}</div>
                              <div className="participant-info">
                                <span className="participant-name">
                                  {p.prenom} {p.nom}
                                </span>
                                <span className="participant-type">{p.type}</span>
                                <span className="participant-group">Groupe: {p.groupe}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                    {/* Enfants */}
                    {selectedReservation.participantsList?.some((p) => p.type === "Enfant") && (
                      <div className="participant-category">
                        <h5 className="category-title">
                          <Baby size={16} />
                          Enfants
                        </h5>
                        {selectedReservation.participantsList
                          ?.filter((p) => p.type === "Enfant")
                          .map((p, index) => (
                            <div key={`enfant-${index}`} className="participant-item">
                              <div className="participant-icon">{getParticipantIcon(p.type)}</div>
                              <div className="participant-info">
                                <span className="participant-name">
                                  {p.prenom} {p.nom}
                                </span>
                                <span className="participant-type">
                                  {p.type} ({p.age} ans)
                                </span>
                                <span className="participant-group">Groupe: {p.groupe}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  {selectedReservation.commentaire && (
                    <div className="comment-section">
                      <h6 className="comment-title">Commentaire</h6>
                      <p className="comment-text">{selectedReservation.commentaire}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestion des Groupes */}
      {showGroupModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Gestion des Groupes par Participant</h3>
                  <p className="modal-subtitle">{selectedReservation.user}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowGroupModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="alert-info">
                <strong>Affectation aux groupes</strong>
                <br />
                Sélectionnez le groupe approprié pour chaque participant selon son type.
              </div>
              {selectedReservation.participantsList && (
                <div className="participants-group-assignment">
                  {/* Collaborateurs/Retraités */}
                  <div className="participant-category">
                    <h6 className="category-title">
                      <User size={16} />
                      Collaborateurs / Retraités
                    </h6>
                    {selectedReservation.participantsList
                      .filter(
                        (p) =>
                          p.type === "Collaborateur" ||
                          p.type === "Collaboratrice" ||
                          p.type === "Retraité" ||
                          p.type === "Retraitée",
                      )
                      .map((participant, index) => (
                        <div key={`adult-${index}`} className="participant-assignment-card">
                          <div className="participant-info-assignment">
                            <div className="participant-name-assignment">
                              {getParticipantIcon(participant.type)}
                              {participant.prenom} {participant.nom}
                            </div>
                            <div className="participant-type-assignment">{participant.type}</div>
                          </div>
                          <div className="group-selection">
                            <label className="form-label">Groupe assigné:</label>
                            <select
                              className="form-select"
                              value={participantGroups[`${participant.type}-${index}`] || participant.groupe}
                              onChange={(e) =>
                                setParticipantGroups({
                                  ...participantGroups,
                                  [`${participant.type}-${index}`]: e.target.value,
                                })
                              }
                            >
                              {getAvailableGroupsForParticipant(participant.type).map((groupe) => (
                                <option key={groupe.id} value={groupe.id}>
                                  {groupe.nom} ({groupe.membres}/{groupe.capacite})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* Conjoints */}
                  {selectedReservation.participantsList.some((p) => p.type === "Conjoint") && (
                    <div className="participant-category">
                      <h6 className="category-title">
                        <Heart size={16} />
                        Conjoints
                      </h6>
                      {selectedReservation.participantsList
                        .filter((p) => p.type === "Conjoint")
                        .map((participant, index) => (
                          <div key={`spouse-${index}`} className="participant-assignment-card">
                            <div className="participant-info-assignment">
                              <div className="participant-name-assignment">
                                {getParticipantIcon(participant.type)}
                                {participant.prenom} {participant.nom}
                              </div>
                              <div className="participant-type-assignment">{participant.type}</div>
                            </div>
                            <div className="group-selection">
                              <label className="form-label">Groupe assigné:</label>
                              <select
                                className="form-select"
                                value={participantGroups[`${participant.type}-${index}`] || participant.groupe}
                                onChange={(e) =>
                                  setParticipantGroups({
                                    ...participantGroups,
                                    [`${participant.type}-${index}`]: e.target.value,
                                  })
                                }
                              >
                                {getAvailableGroupsForParticipant(participant.type).map((groupe) => (
                                  <option key={groupe.id} value={groupe.id}>
                                    {groupe.nom} ({groupe.membres}/{groupe.capacite})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  {/* Enfants */}
                  {selectedReservation.participantsList.some((p) => p.type === "Enfant") && (
                    <div className="participant-category">
                      <h6 className="category-title">
                        <Baby size={16} />
                        Enfants
                      </h6>
                      {selectedReservation.participantsList
                        .filter((p) => p.type === "Enfant")
                        .map((participant, index) => (
                          <div key={`child-${index}`} className="participant-assignment-card">
                            <div className="participant-info-assignment">
                              <div className="participant-name-assignment">
                                {getParticipantIcon(participant.type)}
                                {participant.prenom} {participant.nom}
                              </div>
                              <div className="participant-type-assignment">
                                {participant.type} ({participant.age} ans)
                              </div>
                            </div>
                            <div className="group-selection">
                              <label className="form-label">Groupe assigné:</label>
                              <select
                                className="form-select"
                                value={participantGroups[`${participant.type}-${index}`] || participant.groupe}
                                onChange={(e) =>
                                  setParticipantGroups({
                                    ...participantGroups,
                                    [`${participant.type}-${index}`]: e.target.value,
                                  })
                                }
                              >
                                {getAvailableGroupsForParticipant(participant.type).map((groupe) => (
                                  <option key={groupe.id} value={groupe.id}>
                                    {groupe.nom} ({groupe.membres}/{groupe.capacite})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-modal btn-secondary" onClick={() => setShowGroupModal(false)}>
                Annuler
              </button>
              <button className="btn-modal btn-primary" onClick={handleGroupAssignment}>
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reservations-piscine-container {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* Header */
        .page-header {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(22, 163, 74, 0.1);
          border: 1px solid #bbf7d0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .page-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.4);
        }

        .btn-secondary {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .btn-secondary:hover {
          background: #dcfce7;
          border-color: #86efac;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(22, 163, 74, 0.15);
        }

        .stat-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 2px;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-trend {
          font-size: 11px;
          font-weight: 600;
          color: #16a34a;
          background: #f0fdf4;
          padding: 2px 6px;
          border-radius: 4px;
        }

      
        /* Filters */
        .filters-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .search-wrapper {
          flex: 1;
        }

        .search-input-container {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: #f9fafb;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #16a34a;
          background: white;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .filters-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .filter-select {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          color: #374151;
          min-width: 140px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .btn-filter {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-filter:hover {
          background: #dcfce7;
          border-color: #86efac;
        }

        .chevron {
          transition: transform 0.3s ease;
        }

        .chevron.rotated {
          transform: rotate(180deg);
        }

        .btn-clear-filters {
          width: 36px;
          height: 36px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-clear-filters:hover {
          background: #dc2626;
          color: white;
        }

        /* Advanced Filters */
        .advanced-filters {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
        }

        .advanced-filters-grid {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 20px;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }

        .filter-input {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: #f9fafb;
          transition: all 0.3s ease;
        }

        .filter-input:focus {
          outline: none;
          border-color: #16a34a;
          background: white;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .results-text {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        /* Table */
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
        }

        .table-title {
          font-size: 18px;
          font-weight: 700;
          color: #16a34a;
          margin: 0;
        }

        .table-actions {
          display: flex;
          gap: 8px;
        }

        .btn-table-action {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          background: #f0fdf4;
          color: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-table-action:hover {
          background: #dcfce7;
          transform: scale(1.05);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .reservations-table {
          width: 100%;
          border-collapse: collapse;
        }

        .reservations-table th {
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #374151;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .reservations-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }

        .table-row {
          transition: all 0.3s ease;
        }

        .table-row:hover {
          background: #f9fafb;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
        }

        .user-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .user-email {
          font-size: 12px;
          color: #6b7280;
        }

        .type-cell {
          text-align: center;
        }

        .type-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 4px 8px;
          background: #f3f4f6;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }

        .matricule {
          font-size: 10px;
          color: #9ca3af;
          font-weight: 500;
        }

        .location-cell {
          text-align: center;
        }

        .location-primary {
          font-weight: 600;
          color: #1f2937;
          font-size: 13px;
          margin-bottom: 2px;
        }

        .location-secondary {
          font-size: 11px;
          color: #6b7280;
        }

        .datetime-cell {
          text-align: center;
        }

        .date-info,
        .time-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 12px;
          color: #374151;
          margin-bottom: 2px;
        }

        .participants-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          color: white;
          border-radius: 16px;
          font-weight: 600;
          font-size: 12px;
          width: fit-content;
          margin: 0 auto;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 8px;
          font-weight: 500;
          width: nowrap;
         
        }

        .status-success {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #166534;
        }

        .status-warning {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }

        .status-danger {
          background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
          color: #991b1b;
        }

        .comment-cell {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          color: #6b7280;
        }

        .actions-cell {
          display: flex;
          gap: 6px;
          justify-content: center;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-view {
          background: #e0f2fe;
          color: #0369a1;
        }

        .action-view:hover {
          background: #0369a1;
          color: white;
          transform: scale(1.1);
        }

        .action-edit {
          background: #fef3c7;
          color: #d97706;
        }

        .action-edit:hover {
          background: #d97706;
          color: white;
          transform: scale(1.1);
        }

        .action-group {
          background: #f0fdf4;
          color: #16a34a;
        }

        .action-group:hover {
          background: #16a34a;
          color: white;
          transform: scale(1.1);
        }

        .action-delete {
          background: #fecaca;
          color: #dc2626;
        }

        .action-delete:hover {
          background: #dc2626;
          color: white;
          transform: scale(1.1);
        }

        /* Pagination */
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
        }

        .pagination-info {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pagination-btn {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #16a34a;
          color: #16a34a;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-numbers {
          display: flex;
          gap: 4px;
        }

        .pagination-number {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          background: transparent;
          color: #6b7280;
        }

        .pagination-number.active {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          color: white;
        }

        .pagination-number:not(.active):hover {
          background: #f3f4f6;
          color: #374151;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .modal-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          max-height: 90vh;
          overflow-y: auto;
          width: 100%;
          max-width: 800px;
        }

        .modal-large {
          max-width: 1000px;
        }

        .modal-header {
          padding: 24px 24px 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 2px 0;
        }

        .modal-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          border: none;
          background: #f3f4f6;
          border-radius: 8px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .modal-body {
          padding: 24px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .details-section {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        .info-grid {
          display: grid;
          gap: 12px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 600;
          color: #374151;
          font-size: 13px;
        }

        .info-value {
          font-weight: 500;
          color: #1f2937;
          font-size: 13px;
        }

        .participants-container {
          display: grid;
          gap: 16px;
        }

        .participant-category {
          background: white;
          border-radius: 10px;
          padding: 16px;
          border: 1px solid #e5e7eb;
        }

        .category-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .participant-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #f9fafb;
          border-radius: 6px;
          margin-bottom: 6px;
        }

        .participant-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .participant-info {
          flex: 1;
        }

        .participant-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 13px;
          display: block;
          margin-bottom: 2px;
        }

        .participant-type {
          font-size: 11px;
          color: #6b7280;
          display: block;
          margin-bottom: 2px;
        }

        .participant-group {
          font-size: 10px;
          color: #9ca3af;
          background: #e5e7eb;
          padding: 1px 4px;
          border-radius: 3px;
          display: inline-block;
        }

        .comment-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .comment-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .comment-text {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
        }

        .modal-footer {
          padding: 20px 24px 24px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-modal {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-modal.btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-modal.btn-secondary:hover {
          background: #e5e7eb;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .reservations-piscine-container {
            padding: 16px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .header-actions {
            width: 100%;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filters-container {
            flex-direction: column;
            gap: 16px;
          }

          .filters-controls {
            width: 100%;
            justify-content: space-between;
          }

          .advanced-filters-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .pagination-container {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .table-wrapper {
            overflow-x: scroll;
          }

          .reservations-table {
            min-width: 800px;
          }
        }

        /* Formulaires */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group-full {
          grid-column: 1 / -1;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 13px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        /* Alerts */
        .alert-info {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          color: #0369a1;
          font-size: 14px;
        }

        .alert-warning {
          background: #fefce8;
          border: 1px solid #fde047;
          border-radius: 8px;
          padding: 12px;
          margin-top: 8px;
          color: #a16207;
          font-size: 14px;
        }

        /* Étapes du formulaire */
        .step-container {
          max-width: 100%;
        }

        .step-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .step-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 6px 0;
        }

        .step-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .user-type-selection {
          margin-bottom: 24px;
        }

        .selection-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .radio-group {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .radio-option input[type='radio'] {
          width: 18px;
          height: 18px;
          accent-color: #16a34a;
        }

        .radio-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .participants-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .selection-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          background: white;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .selection-card.selected {
          border-color: #16a34a;
          background: #f0fdf4;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.1);
        }

        .selection-card:hover {
          border-color: #cbd5e0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .selection-card-label {
          display: block;
          cursor: pointer;
        }

        .selection-checkbox {
          display: none;
        }

        .selection-card-content {
          text-align: center;
        }

        .selection-icon {
          color: #16a34a;
          margin-bottom: 12px;
        }

        .selection-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 6px 0;
        }

        .selection-description {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .info-card {
          background: #f9fafb;
          border-radius: 12px;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .info-card-header {
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .info-card-body {
          padding: 20px;
        }

        .btn-add-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-add-item:hover {
          background: #dcfce7;
          border-color: #86efac;
        }

        .spouse-form,
        .child-form {
          background: white;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 12px;
          border: 1px solid #e5e7eb;
        }

        .spouse-header,
        .child-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .spouse-title,
        .child-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .btn-remove-item {
          width: 28px;
          height: 28px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-remove-item:hover {
          background: #dc2626;
          color: white;
        }

        .summary-card {
          background: #f9fafb;
          border-radius: 12px;
          overflow: hidden;
        }

        .summary-header {
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .summary-body {
          padding: 20px;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: white;
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .summary-icon {
          color: #16a34a;
        }

        .summary-text {
          font-size: 13px;
          color: #374151;
        }

        /* Gestion des groupes */
        .participants-group-assignment {
          max-height: 400px;
          overflow-y: auto;
        }

        .participant-assignment-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .participant-info-assignment {
          flex: 1;
        }

        .participant-name-assignment {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2px;
          font-size: 13px;
        }

        .participant-type-assignment {
          font-size: 11px;
          color: #6b7280;
        }

        .group-selection {
          flex: 1;
          margin-left: 16px;
        }

        .group-selection .form-label {
          font-size: 11px;
          margin-bottom: 4px;
        }

        .group-selection .form-select {
          font-size: 12px;
          padding: 6px 8px;
        }

        .btn-modal.btn-primary {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          color: white;
          border: none;
        }

        .btn-modal.btn-primary:hover {
          background: linear-gradient(135deg, #15803d 0%, #16a34a 100%);
        }

        .btn-modal.btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
`}</style>
    </div>
  )
}

