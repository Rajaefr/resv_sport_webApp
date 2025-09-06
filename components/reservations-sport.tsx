"use client"
import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  Dumbbell,
  DollarSign,
  CheckCircle,
  CreditCard,
  XCircle,
  Eye,
  Plus,
  Edit,
  Trash2,
  Download,
  UserCheck,
  MapPin,
  ChevronDown,
  X,
  User,
  Heart,
  Baby,
  Loader2,
} from "lucide-react"
import { apiService } from "../lib/apiService"
import ExportService from '../lib/exportService';

// Helper function to filter discipline codes by type
const filterDisciplineCodes = (codes: any[], type: 'adult' | 'child') => {
  return codes.filter(code => {
    if (type === 'adult') {
      return code.nom.includes('Adultes') || code.type === 'mixte';
    } else {
      return code.nom.includes('Enfants') || code.type === 'mixte';
    }
  });
};


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
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  )
}

const getPaymentStatusBadge = (status: string) => {
  const statusConfig = {
    Payé: {
      icon: CheckCircle,
      label: "Payé",
      className: "payment-success",
    },
    Partiel: {
      icon: Clock,
      label: "Partiel",
      className: "payment-warning",
    },
    "En attente": {
      icon: XCircle,
      label: "En attente",
      className: "payment-danger",
    },
  }
  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null
  const Icon = config.icon
  return (
    <span className={`payment-badge ${config.className}`}>
      <Icon size={12} />
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
    case "Enfant Adulte":
      return <Baby size={14} />
    default:
      return <User size={14} />
  }
}

export function ReservationsSport() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [paymentNotes, setPaymentNotes] = useState("")
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showNewReservationModal, setShowNewReservationModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  
  // API state
  const [reservations, setReservations] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  const [availableDisciplines, setAvailableDisciplines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Formulaire nouvelle réservation
  const [step, setStep] = useState(0)
  const [reserveForSelf, setReserveForSelf] = useState(false)
  const [addSpouses, setAddSpouses] = useState(false)
  const [addChildren, setAddChildren] = useState(false)
  const [addAdultChildren, setAddAdultChildren] = useState(false)
  const [userType, setUserType] = useState<"collaborateur" | "retraite">("collaborateur")
  const [selfInfo, setSelfInfo] = useState({
    nom: "",
    prenom: "",
    cne: "",
    matricule: "",
    email: "",
    telephone: "",
    disciplineCode: "",
  })
  const [spouses, setSpouses] = useState([{ nom: "", prenom: "", cne: "", disciplineCode: "" }])
  const [children, setChildren] = useState([{ nom: "", prenom: "", dateNaissance: "", sexe: "M", disciplineCode: "" }])
  const [adultChildren, setAdultChildren] = useState([
    { nom: "", prenom: "", dateNaissance: "", sexe: "M", cne: "", disciplineCode: "" },
  ])
  const [editForm, setEditForm] = useState({
    user: "",
    email: "",
    salle: "",
    activite: "",
    date: "",
    heureDebut: "",
    heureFin: "",
    participants: 0,
    commentaire: "",
    equipement: "",
  })

  // Validation state
  const [validationErrors, setValidationErrors] = useState<any>({})
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  // Charger les codes de discipline depuis l'API
  const loadDisciplineCodes = async () => {
    try {
      const response = await apiService.getDisciplineCodes()
      if (response.success) {
        setAvailableDisciplines(response.data?.disciplineCodes || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des codes de discipline:', error)
    }
  }

  // Load reservations from API
  const loadReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getSportReservations()
      
      if (response.success) {
        // Mapper les données avec les nouveaux champs bénéficiaire
        const mappedReservations = response.data?.items?.map((res: any) => ({
          id: res.id,
          user: res.beneficiaryName || res.user || 'Bénéficiaire',
          userType: res.beneficiaryType || res.userType || 'Utilisateur',
          matricule: res.beneficiaryMatricule || res.matricule || 'N/A',
          email: res.beneficiaryEmail || res.email || 'N/A',
          salle: res.salle || 'Salle Sport',
          activite: res.activite || 'Activité',
          date: new Date(res.date).toISOString().split('T')[0],
          heureDebut: res.heureDebut || '09:00',
          heureFin: res.heureFin || '10:00',
          participants: res.participants || 1,
          status: res.status === 'APPROVED' ? 'acceptee' : 
                  res.status === 'PENDING' ? 'en_attente' : 'refusee',
          paymentStatus: res.paymentStatus === 'PAID' ? 'Payé' : 
                        res.paymentStatus === 'PARTIAL' ? 'Partiel' : 'En attente',
          totalAmount: res.totalAmount || 0,
          paidAmount: res.paidAmount || 0,
          commentaire: res.commentaire || '',
          equipement: res.equipement || '',
          participantsList: res.participants_list || []
        })) || []
        setReservations(mappedReservations)
      } else {
        setError("Erreur lors du chargement des réservations")
        setReservations([])
      }
    } catch (err: any) {
      console.error("Erreur:", err)
      setError(err.message || "Erreur lors du chargement")
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
    loadDisciplineCodes()
  }, [])

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.salle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.activite?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    const matchesPayment = paymentFilter === "all" || reservation.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReservations = filteredReservations.slice(startIndex, endIndex)

  const clearAdvancedFilters = () => {
    setPaymentFilter("all")
    setShowAdvancedFilters(false)
  }

  // Validation functions
  const validateFields = () => {
    const errors: any = {}
    if (selfInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selfInfo.email)) {
      errors.email = "Format d'email invalide"
    }
    if (selfInfo.telephone && !/^[0-9+\-\s()]+$/.test(selfInfo.telephone)) {
      errors.telephone = "Le téléphone ne doit contenir que des chiffres, espaces, +, -, ()"
    }
    if (selfInfo.matricule && (selfInfo.matricule.length < 3 || selfInfo.matricule.length > 5)) {
      errors.matricule = "Le matricule doit contenir entre 3 et 5 caractères"
    }
    if (selfInfo.cne && selfInfo.cne.length !== 6) {
      errors.cne = "Le CNE doit contenir exactement 6 caractères"
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const areAllFieldsFilled = () => {
    return selfInfo.nom && selfInfo.prenom && selfInfo.cne && selfInfo.matricule && selfInfo.email && selfInfo.telephone && selfInfo.disciplineCode
  }

  const handleDeleteReservation = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      try {
        const response = await apiService.deleteSportReservation(id)
        if (response.success) {
          alert("Réservation supprimée avec succès")
          loadReservations() // Reload data
        } else {
          alert("Erreur lors de la suppression")
        }
      } catch (error) {
        console.error("Erreur:", error)
        alert("Erreur lors de la suppression")
      }
    }
  }

  const handleApproveReservation = async (id: string) => {
    try {
      const response = await apiService.updateSportReservation(id, { status: "APPROVED" })
      if (response.success) {
        alert("Réservation approuvée avec succès")
        loadReservations() // Reload data
      } else {
        alert("Erreur lors de l'approbation")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de l'approbation")
    }
  }

  const handleRejectReservation = async (id: string) => {
    try {
      const response = await apiService.updateSportReservation(id, { status: "REJECTED" })
      if (response.success) {
        alert("Réservation refusée avec succès")
        loadReservations() // Reload data
      } else {
        alert("Erreur lors du refus")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors du refus")
    }
  }

  const handleExportReservations = async () => {
    setIsExporting(true);
    try {
      const result = await ExportService.exportSportReservationsToExcel();
      if (result.success) {
        alert('Export Excel des réservations sport réussi !');
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      alert('Erreur lors de l\'export des réservations');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNewReservationSubmit = async () => {
    const participants = []
    if (reserveForSelf) {
      participants.push({
        nom: selfInfo.nom,
        prenom: selfInfo.prenom,
        type: userType === "retraite" ? "Retraité" : "Titulaire",
        disciplineCode: selfInfo.disciplineCode,
      })
    }
    if (addSpouses) {
      spouses.forEach((s) => {
        if (s.nom && s.prenom) {
          participants.push({
            nom: s.nom,
            prenom: s.prenom,
            type: "Conjoint",
            disciplineCode: s.disciplineCode,
          })
        }
      })
    }
    if (addChildren && userType === "collaborateur") {
      children.forEach((c) => {
        if (c.nom && c.prenom) {
          participants.push({
            nom: c.nom,
            prenom: c.prenom,
            type: "Enfant",
            disciplineCode: c.disciplineCode,
          })
        }
      })
    }
    if (addAdultChildren && userType === "collaborateur") {
      adultChildren.forEach((ac) => {
        if (ac.nom && ac.prenom) {
          participants.push({
            nom: ac.nom,
            prenom: ac.prenom,
            type: "Enfant Adulte",
            disciplineCode: ac.disciplineCode,
          })
        }
      })
    }

    try {
      const reservationData = {
        // Données pour le backend unifié
        activityId: "sport-default", // À adapter selon vos activités
        salle: "Salle Sport",
        activite: "Activité Sportive",
        date: new Date().toISOString().split('T')[0],
        heureDebut: "09:00",
        heureFin: "10:00",
        participants: participants.map(p => ({
          nom: p.nom,
          prenom: p.prenom,
          cne: p.cne || '',
          type: p.type,
          disciplineCode: p.disciplineCode || 'C001-1',
          amount: 100, // Montant par défaut
          matricule: p.type === 'Titulaire' ? selfInfo.matricule : undefined,
          email: p.type === 'Titulaire' ? selfInfo.email : undefined
        })),
        commentaire: "Réservation créée par admin",
        equipement: "Standard"
      }
      
      const response = await apiService.createSportReservation(reservationData)
      if (response.success) {
        alert("Réservation créée avec succès")
        setShowNewReservationModal(false)
        loadReservations() // Reload data
        // Reset form
        setStep(0)
        setReserveForSelf(false)
        setAddSpouses(false)
        setAddChildren(false)
        setAddAdultChildren(false)
        setSelfInfo({ nom: "", prenom: "", cne: "", matricule: "", email: "", telephone: "", disciplineCode: "" })
        setSpouses([{ nom: "", prenom: "", cne: "", disciplineCode: "" }])
        setChildren([{ nom: "", prenom: "", dateNaissance: "", sexe: "M", disciplineCode: "" }])
        setAdultChildren([{ nom: "", prenom: "", dateNaissance: "", sexe: "M", cne: "", disciplineCode: "" }])
      } else {
        alert("Erreur lors de la création de la réservation")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de la création de la réservation")
    }
  }

  const addSpouse = () => {
    if (spouses.length < 2) {
      setSpouses([...spouses, { nom: "", prenom: "", cne: "", disciplineCode: "" }])
    }
  }

  const removeSpouse = (index: number) => {
    setSpouses(spouses.filter((_, i) => i !== index))
  }

  const addChild = () => {
    if (children.length < 5 && userType === "collaborateur") {
      setChildren([...children, { nom: "", prenom: "", dateNaissance: "", sexe: "M", disciplineCode: "" }])
    }
  }

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index))
  }

  const addAdultChild = () => {
    if (adultChildren.length < 5 && userType === "collaborateur") {
      setAdultChildren([
        ...adultChildren,
        { nom: "", prenom: "", dateNaissance: "", sexe: "M", cne: "", disciplineCode: "" },
      ])
    }
  }

  const removeAdultChild = (index: number) => {
    setAdultChildren(adultChildren.filter((_, i) => i !== index))
  }

  const isAgeBetween4And18 = (dateStr: string) => {
    if (!dateStr) return false
    const today = new Date()
    const birthDate = new Date(dateStr)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    let actualAge = age
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      actualAge--
    }
    return actualAge > 4 && actualAge < 18
  }

  const isAgeBetween18And25 = (dateStr: string) => {
    if (!dateStr) return false
    const today = new Date()
    const birthDate = new Date(dateStr)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    let actualAge = age
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      actualAge--
    }
    return actualAge >= 18 && actualAge <= 25
  }

  const openEditModal = (reservation: any) => {
    setSelectedReservation(reservation)
    setEditForm({
      user: reservation.user,
      email: reservation.email,
      salle: reservation.salle,
      activite: reservation.activite,
      date: reservation.date,
      heureDebut: reservation.heureDebut,
      heureFin: reservation.heureFin,
      participants: reservation.participants,
      commentaire: reservation.commentaire,
      equipement: reservation.equipement,
    })
    setShowEditModal(true)
  }

  const handleEditReservation = () => {
    if (selectedReservation) {
      console.log("Modification réservation:", editForm)
      alert(`Réservation ${editForm.user} modifiée avec succès`)
      setShowEditModal(false)
    }
  }

  return (
    <div className="reservations-sport-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <Dumbbell size={28} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Réservations Salles de Sport</h1>
              <p className="page-subtitle">
                Gestion des réservations et paiements par discipline • {filteredReservations.length} réservations
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn-header btn-secondary"
              onClick={handleExportReservations}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Export...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Exporter Excel</span>
                </>
              )}
            </button>
            <button className="btn-header btn-primary" onClick={() => setShowNewReservationModal(true)}>
              <Plus size={18} />
              <span>Nouvelle Réservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Dumbbell size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">32</div>
            <div className="stat-label">Aujourd'hui</div>
          </div>
          <div className="stat-trend">+15%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reservations.filter((r) => r.status === "acceptee").length}</div>
            <div className="stat-label">Acceptées</div>
          </div>
          <div className="stat-trend">+8%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reservations.filter((r) => r.status === "en_attente").length}</div>
            <div className="stat-label">En Attente</div>
          </div>
          <div className="stat-trend">-3%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reservations.reduce((sum, r) => sum + (r.paidAmount || 0), 0)} DH</div>
            <div className="stat-label">Encaissé</div>
          </div>
          <div className="stat-trend">+22%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="search-wrapper">
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom, salle ou activité..."
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
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="filter-select">
            <option value="all">Tous les paiements</option>
            <option value="Payé">Payé</option>
            <option value="Partiel">Partiel</option>
            <option value="En attente">En attente</option>
          </select>
          <button className="btn-filter" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Filter size={16} />
            <span>Filtres avancés</span>
            <ChevronDown size={16} className={`chevron ${showAdvancedFilters ? "rotated" : ""}`} />
          </button>
          {paymentFilter !== "all" && (
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
              <label className="filter-label">Salle</label>
              <select className="filter-input">
                <option value="">Toutes les salles</option>
                <option value="C001-1">C001-1 - Adultes Musculation</option>
                <option value="C001-2">C001-2 - Enfants Musculation</option>
                <option value="C058-1">C058-1 - Adultes Gym</option>
                <option value="C058-2">C058-2 - Enfants Gym</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Activité</label>
              <input type="text" placeholder="Filtrer par activité..." className="filter-input" />
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
          <h3 className="table-title">Liste des Réservations Sport</h3>
         
        </div>
        <div className="table-wrapper">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Type & Matricule</th>
                <th>Salle & Activité</th>
                <th>Date & Heure</th>
                <th>Participants</th>
                <th>Statut Réservation</th>
                <th>Paiement</th>
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
                          .map((n: string) => n[0])
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
                        <UserCheck size={14} />
                        <span>{reservation.userType}</span>
                      </div>
                      <div className="matricule">#{reservation.matricule}</div>
                    </div>
                  </td>
                  <td>
                    <div className="location-cell">
                      <div className="location-primary">
                       
                        <span>{reservation.salle}</span>
                      </div>
                      <div className="location-secondary">{reservation.activite}</div>
                    </div>
                  </td>
                  <td>
                    <div className="datetime-cell">
                      <div className="date-info">
                        <Calendar size={14} />
                        <span>{reservation.date}</span>
                      </div>
                      <div className="time-info">
                        <Clock size={14} />
                        <span>
                          {reservation.heureDebut} - {reservation.heureFin}
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
                    <div className="payment-cell">
                      {getPaymentStatusBadge(reservation.paymentStatus)}
                      <div className="payment-amount">
                        {reservation.paidAmount}/{reservation.totalAmount} DH
                      </div>
                    </div>
                  </td>
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
                        className="action-btn action-edit"
                        onClick={() => openEditModal(reservation)}
                        title="Éditer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn action-payment"
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setPaymentNotes("")
                          setShowPaymentModal(true)
                        }}
                        title="Gérer paiements"
                      >
                        <CreditCard size={16} />
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

      {/* Pagination */}
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

      {/* Modal Détails */}
      {showDetailsModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Dumbbell size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Détails de la Réservation Sport</h3>
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
                  <h4 className="section-title">Informations Générales</h4>
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
                      <span className="info-label">Salle</span>
                      <span className="info-value">{selectedReservation.salle}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Activité</span>
                      <span className="info-value">{selectedReservation.activite}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date</span>
                      <span className="info-value">{selectedReservation.date}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Horaire</span>
                      <span className="info-value">
                        {selectedReservation.heureDebut} - {selectedReservation.heureFin}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Statut</span>
                      <span className="info-value">{getStatusBadge(selectedReservation.status)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Équipement</span>
                      <span className="info-value">{selectedReservation.equipement}</span>
                    </div>
                  </div>
                </div>
                <div className="details-section">
                  <h4 className="section-title">Paiement & Participants</h4>
                  <div className="payment-summary">
                    <div className="payment-item">
                      <span className="payment-label">Statut paiement</span>
                      <span className="payment-value">{getPaymentStatusBadge(selectedReservation.paymentStatus)}</span>
                    </div>
                    <div className="payment-item">
                      <span className="payment-label">Montant total</span>
                      <span className="payment-value total-amount">{selectedReservation.totalAmount} DH</span>
                    </div>
                    <div className="payment-item">
                      <span className="payment-label">Montant payé</span>
                      <span className="payment-value paid-amount">{selectedReservation.paidAmount} DH</span>
                    </div>
                    <div className="payment-item">
                      <span className="payment-label">Reste à payer</span>
                      <span className="payment-value remaining-amount">
                        {selectedReservation.totalAmount - selectedReservation.paidAmount} DH
                      </span>
                    </div>
                  </div>
                  <h5 className="participants-title">Participants par catégorie</h5>
                  <div className="participants-container">
                    {/* Collaborateurs/Retraités */}
                    <div className="participant-category">
                      <h6 className="category-title">
                        <User size={16} />
                        Collaborateurs / Retraités
                      </h6>
                      {selectedReservation.participantsList
                        ?.filter(
                          (p: any) => p.type === "Collaborateur" || p.type === "Collaboratrice" || p.type === "Retraité",
                        )
                        .map((participant: any, idx: number) => (
                          <div key={idx} className="participant-item">
                            <div className="participant-icon">{getParticipantIcon(participant.type)}</div>
                            <div className="participant-info">
                              <span className="participant-name">
                                {participant.prenom} {participant.nom}
                              </span>
                              <span className="participant-type">{participant.type}</span>
                              <span className="participant-details">
                                {participant.disciplineCode} • {participant.amount} DH •{" "}
                                <span className={`payment-status ${participant.paid ? "paid" : "unpaid"}`}>
                                  {participant.paid ? "Payé" : "Non payé"}
                                </span>
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    {/* Conjoints */}
                    {selectedReservation.participantsList?.some((p: any) => p.type === "Conjoint") && (
                      <div className="participant-category">
                        <h6 className="category-title">
                          <Heart size={16} />
                          Conjoints
                        </h6>
                        {selectedReservation.participantsList
                          ?.filter((p: any) => p.type === "Conjoint")
                          .map((participant: any, idx: number) => (
                            <div key={idx} className="participant-item">
                              <div className="participant-icon">{getParticipantIcon(participant.type)}</div>
                              <div className="participant-info">
                                <span className="participant-name">
                                  {participant.prenom} {participant.nom}
                                </span>
                                <span className="participant-type">{participant.type}</span>
                                <span className="participant-details">
                                  {participant.disciplineCode} • {participant.amount} DH •{" "}
                                  <span className={`payment-status ${participant.paid ? "paid" : "unpaid"}`}>
                                    {participant.paid ? "Payé" : "Non payé"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                    {/* Enfants */}
                    {selectedReservation.participantsList?.some(
                      (p: any) => p.type === "Enfant" || p.type === "Enfant Adulte",
                    ) && (
                      <div className="participant-category">
                        <h6 className="category-title">
                          <Baby size={16} />
                          Enfants
                        </h6>
                        {selectedReservation.participantsList
                          ?.filter((p: any) => p.type === "Enfant" || p.type === "Enfant Adulte")
                          .map((participant: any, idx: number) => (
                            <div key={idx} className="participant-item">
                              <div className="participant-icon">{getParticipantIcon(participant.type)}</div>
                              <div className="participant-info">
                                <span className="participant-name">
                                  {participant.prenom} {participant.nom}
                                </span>
                                <span className="participant-type">{participant.type}</span>
                                <span className="participant-details">
                                  {participant.disciplineCode} • {participant.amount} DH •{" "}
                                  <span className={`payment-status ${participant.paid ? "paid" : "unpaid"}`}>
                                    {participant.paid ? "Payé" : "Non payé"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  {selectedReservation.commentaire && (
                    <div className="comment-section">
                      <h5 className="comment-title">Commentaire</h5>
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

      {/* Modal Gestion des Paiements */}
      {showPaymentModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Gestion des Paiements</h3>
                  <p className="modal-subtitle">{selectedReservation.user}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="alert-info">
                <strong>Gestion des paiements par membre</strong>
                <br />
                Cochez les participants qui ont effectué leur paiement.
              </div>
              {selectedReservation.participantsList?.map((participant: any, idx: number) => (
                <div key={idx} className="payment-participant-card">
                  <div className="payment-participant-info">
                    <h6 className="payment-participant-name">
                      {participant.prenom} {participant.nom}
                    </h6>
                    <div className="payment-participant-details">
                      {participant.type} • {participant.disciplineCode} • {participant.amount} DH
                    </div>
                  </div>
                  <div className="payment-participant-status">
                    <label className="payment-switch">
                      <input
                        type="checkbox"
                        defaultChecked={participant.paid}
                        data-participant={idx}
                        onChange={(e) => {
                          console.log(`Participant ${participant.nom} payment status:`, e.target.checked)
                        }}
                      />
                      <span className="payment-switch-slider"></span>
                      <span className="payment-switch-label">{participant.paid ? "Payé" : "Non payé"}</span>
                    </label>
                  </div>
                </div>
              ))}
              <div className="payment-summary-card">
                <div className="payment-summary-grid">
                  <div className="payment-summary-item">
                    <h6 className="payment-summary-label">Montant Total</h6>
                    <div className="payment-summary-value total">{selectedReservation.totalAmount} DH</div>
                  </div>
                  <div className="payment-summary-item">
                    <h6 className="payment-summary-label">Montant Payé</h6>
                    <div className="payment-summary-value paid">{selectedReservation.paidAmount} DH</div>
                  </div>
                  <div className="payment-summary-item">
                    <h6 className="payment-summary-label">Reste à Payer</h6>
                    <div className="payment-summary-value remaining">
                      {selectedReservation.totalAmount - selectedReservation.paidAmount} DH
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes de paiement</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Ajouter des notes sur les paiements..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal btn-secondary" onClick={() => setShowPaymentModal(false)}>
                Annuler
              </button>
              <button
                className="btn-modal btn-primary"
                onClick={async () => {
                  try {
                    const paymentUpdates = selectedReservation.participantsList?.map((p: any, idx: number) => ({
                      participantId: p.id,
                      paid: document.querySelector(`input[data-participant="${idx}"]`)?.checked || p.paid
                    }))
                    
                    const response = await apiService.updatePaymentStatus(selectedReservation.id, {
                      payments: paymentUpdates,
                      notes: paymentNotes
                    })
                    
                    if (response.success) {
                      await loadReservations()
                      alert("Paiements mis à jour avec succès")
                      setShowPaymentModal(false)
                    } else {
                      alert("Erreur lors de la mise à jour des paiements")
                    }
                  } catch (error) {
                    console.error('Erreur paiements:', error)
                    alert("Erreur lors de la mise à jour des paiements")
                  }
                }}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition Réservation */}
      {showEditModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Edit size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Modifier la Réservation</h3>
                  <p className="modal-subtitle">{selectedReservation.user}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nom complet *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.user}
                    onChange={(e) => setEditForm({ ...editForm, user: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Salle *</label>
                  <select
                    className="form-select"
                    value={editForm.salle}
                    onChange={(e) => setEditForm({ ...editForm, salle: e.target.value })}
                  >
                    <option value="">Sélectionner une salle</option>
                    <option value="C001-1">C001-1 - Adultes Musculation</option>
                    <option value="C001-2">C001-2 - Enfants Musculation</option>
                    <option value="C058-1">C058-1 - Adultes Gym</option>
                    <option value="C058-2">C058-2 - Enfants Gym</option>
                    <option value="C058-3">C058-3 - Adultes Gym & Swim</option>
                    <option value="C058-4">C058-4 - Enfants Gym & Swim</option>
                    <option value="C025-1">C025-1 - Adultes Fitness</option>
                    <option value="C025-2">C025-2 - Enfants Fitness</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Activité *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.activite}
                    onChange={(e) => setEditForm({ ...editForm, activite: e.target.value })}
                    placeholder="Ex: Football, Volleyball, etc."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Heure début *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={editForm.heureDebut}
                    onChange={(e) => setEditForm({ ...editForm, heureDebut: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Heure fin *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={editForm.heureFin}
                    onChange={(e) => setEditForm({ ...editForm, heureFin: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre de participants *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.participants}
                    onChange={(e) => setEditForm({ ...editForm, participants: Number.parseInt(e.target.value) || 0 })}
                    min="1"
                    max="20"
                  />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Équipement nécessaire</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.equipement}
                    onChange={(e) => setEditForm({ ...editForm, equipement: e.target.value })}
                    placeholder="Ex: Ballons, chasubles, filets..."
                  />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Commentaire</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={editForm.commentaire}
                    onChange={(e) => setEditForm({ ...editForm, commentaire: e.target.value })}
                    placeholder="Informations supplémentaires..."
                  />
                </div>
              </div>
              <div className="alert-info">
                <strong>Note :</strong> Les modifications seront soumises à validation administrative.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal btn-secondary" onClick={() => setShowEditModal(false)}>
                Annuler
              </button>
              <button
                className="btn-modal btn-primary"
                onClick={handleEditReservation}
                disabled={!editForm.user || !editForm.email || !editForm.salle || !editForm.activite || !editForm.date}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Réservation Sport */}
      {showNewReservationModal && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Nouvelle Réservation Salle de Sport</h3>
                  <p className="modal-subtitle">Étape {step + 1} sur 3</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowNewReservationModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {/* Étape 1 - Sélection des participants */}
              {step === 0 && (
                <div className="step-container">
                  <div className="step-header">
                    <h4 className="step-title">Sélection des participants</h4>
                    <p className="step-description">Qui souhaitez-vous inclure dans cette réservation ?</p>
                  </div>
                  <div className="user-type-selection">
                    <h5 className="selection-title">Type de compte:</h5>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="userType"
                          value="collaborateur"
                          checked={userType === "collaborateur"}
                          onChange={(e) => setUserType(e.target.value as "collaborateur" | "retraite")}
                        />
                        <span className="radio-label">Collaborateur</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="userType"
                          value="retraite"
                          checked={userType === "retraite"}
                          onChange={(e) => setUserType(e.target.value as "collaborateur" | "retraite")}
                        />
                        <span className="radio-label">Retraité</span>
                      </label>
                    </div>
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
                          <p className="selection-description">Inclure ma participation</p>
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
                    {userType === "collaborateur" && (
                      <>
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
                              <h6 className="selection-title">Enfants 4-18 ans</h6>
                              <p className="selection-description">Maximum 5 enfants</p>
                            </div>
                          </label>
                        </div>
                        <div className={`selection-card ${addAdultChildren ? "selected" : ""}`}>
                          <label className="selection-card-label">
                            <input
                              type="checkbox"
                              checked={addAdultChildren}
                              onChange={(e) => setAddAdultChildren(e.target.checked)}
                              className="selection-checkbox"
                            />
                            <div className="selection-card-content">
                              <Users size={24} className="selection-icon" />
                              <h6 className="selection-title">Enfants adultes 18-25 ans</h6>
                              <p className="selection-description">Maximum 5 enfants adultes</p>
                            </div>
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                  {userType === "retraite" && (
                    <div className="alert-info">
                      <strong>Information:</strong> En tant que retraité, vous pouvez réserver pour vous-même et vos
                      conjoints uniquement.
                    </div>
                  )}
                </div>
              )}
              {/* Étape 2 - Informations des participants */}
              {step === 1 && (
                <div className="step-container">
                  <div className="step-header">
                    <h4 className="step-title">Informations des participants</h4>
                    <p className="step-description">Veuillez remplir les informations et choisir les disciplines</p>
                  </div>
                  {reserveForSelf && (
                    <div className="info-card">
                      <div className="info-card-header">
                        <h5 className="info-card-title">Mes informations</h5>
                      </div>
                      <div className="info-card-body">
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
                            <label className="form-label">CNE *</label>
                            <input
                              type="text"
                              className={`form-input ${showValidationErrors && validationErrors.cne ? 'error' : ''}`}
                              value={selfInfo.cne}
                              onChange={(e) => setSelfInfo({ ...selfInfo, cne: e.target.value })}
                            />
                            {showValidationErrors && validationErrors.cne && (
                              <div className="error-message">{validationErrors.cne}</div>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              {userType === "retraite" ? "Numéro RCAR *" : "Matricule *"}
                            </label>
                            <input
                              type="text"
                              className={`form-input ${showValidationErrors && validationErrors.matricule ? 'error' : ''}`}
                              value={selfInfo.matricule}
                              onChange={(e) => setSelfInfo({ ...selfInfo, matricule: e.target.value })}
                            />
                            {showValidationErrors && validationErrors.matricule && (
                              <div className="error-message">{validationErrors.matricule}</div>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                              type="email"
                              className={`form-input ${showValidationErrors && validationErrors.email ? 'error' : ''}`}
                              value={selfInfo.email}
                              onChange={(e) => setSelfInfo({ ...selfInfo, email: e.target.value })}
                            />
                            {showValidationErrors && validationErrors.email && (
                              <div className="error-message">{validationErrors.email}</div>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="form-label">Téléphone</label>
                            <input
                              type="tel"
                              className={`form-input ${showValidationErrors && validationErrors.telephone ? 'error' : ''}`}
                              value={selfInfo.telephone}
                              onChange={(e) => setSelfInfo({ ...selfInfo, telephone: e.target.value })}
                            />
                            {showValidationErrors && validationErrors.telephone && (
                              <div className="error-message">{validationErrors.telephone}</div>
                            )}
                          </div>
                          <div className="form-group form-group-full">
                            <label className="form-label">Code de discipline *</label>
                            <select
                              className="form-select"
                              value={selfInfo.disciplineCode}
                              onChange={(e) =>
                                setSelfInfo({ ...selfInfo, disciplineCode: e.target.value })
                              }
                              required
                            >
                              <option value="">Sélectionner</option>
                              {filterDisciplineCodes(availableDisciplines, 'adult').map((discipline) => (
                                <option key={discipline.code} value={discipline.code}>
                                  {discipline.code} - {discipline.nom} ({discipline.price} DH)
                                </option>
                              ))}
                            </select>
                            {!selfInfo.disciplineCode && (
                              <div className="form-error">Veuillez sélectionner une discipline</div>
                            )}
                            {!selfInfo.disciplineCode && (
                              <div className="form-error">Veuillez sélectionner une discipline</div>
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
                          <button type="button" className="btn-add-item" onClick={addSpouse}>
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
                                <button type="button" className="btn-remove-item" onClick={() => removeSpouse(index)}>
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
                                <label className="form-label">CNE *</label>
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
                              <div className="form-group">
                                <label className="form-label">Code discipline *</label>
                                <select
                                  className="form-select"
                                  value={spouse.disciplineCode}
                                  onChange={(e) => {
                                    const updated = [...spouses]
                                    updated[index].disciplineCode = e.target.value
                                    setSpouses(updated)
                                  }}
                                  required
                                >
                                  <option value="">Sélectionner</option>
                                  {filterDisciplineCodes(availableDisciplines, 'adult').map((discipline) => (
                                    <option key={discipline.code} value={discipline.code}>
                                      {discipline.code} - {discipline.nom} ({discipline.price} DH)
                                    </option>
                                  ))}
                                </select>
                                {!spouse.disciplineCode && (
                                  <div className="form-error">Veuillez sélectionner une discipline</div>
                                )}
                              </div>
                            </div>
                            {spouse.nom &&
                              spouse.prenom &&
                              spouse.cne &&
                              !spouse.disciplineCode && (
                                <div className="alert-warning">
                                  <small>Veuillez sélectionner une discipline pour le conjoint</small>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {addChildren && userType === "collaborateur" && (
                    <div className="info-card">
                      <div className="info-card-header">
                        <h5 className="info-card-title">Enfants (4-18 ans)</h5>
                        {children.length < 5 && (
                          <button type="button" className="btn-add-item" onClick={addChild}>
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
                                <button type="button" className="btn-remove-item" onClick={() => removeChild(index)}>
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
                                <label className="form-label">Date naissance *</label>
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
                              <div className="form-group">
                                <label className="form-label">Code discipline *</label>
                                <select
                                  className="form-select"
                                  value={child.disciplineCode}
                                  onChange={(e) => {
                                    const updated = [...children]
                                    updated[index].disciplineCode = e.target.value
                                    setChildren(updated)
                                  }}
                                  required
                                >
                                  <option value="">Sélectionner</option>
                                  {filterDisciplineCodes(availableDisciplines, 'child').map((discipline) => (
                                    <option key={discipline.code} value={discipline.code}>
                                      {discipline.code} - {discipline.nom} ({discipline.price} DH)
                                    </option>
                                  ))}
                                </select>
                                {!child.disciplineCode && (
                                  <div className="form-error">Veuillez sélectionner une discipline</div>
                                )}
                              </div>
                            </div>
                            {child.nom &&
                              child.prenom &&
                              child.dateNaissance &&
                              !isAgeBetween4And18(child.dateNaissance) && (
                                <div className="alert-warning">
                                  <small>L'enfant doit avoir entre 4 et 18 ans pour les salles de sport</small>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {addAdultChildren && userType === "collaborateur" && (
                    <div className="info-card">
                      <div className="info-card-header">
                        <h5 className="info-card-title">Enfants adultes (18-25 ans)</h5>
                        {adultChildren.length < 5 && (
                          <button type="button" className="btn-add-item" onClick={addAdultChild}>
                            <Plus size={16} />
                            <span>Ajouter</span>
                          </button>
                        )}
                      </div>
                      <div className="info-card-body">
                        {adultChildren.map((adultChild, index) => (
                          <div key={index} className="child-form">
                            <div className="child-header">
                              <h6 className="child-title">Enfant adulte {index + 1}</h6>
                              {adultChildren.length > 1 && (
                                <button
                                  type="button"
                                  className="btn-remove-item"
                                  onClick={() => removeAdultChild(index)}
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
                                  value={adultChild.nom}
                                  onChange={(e) => {
                                    const updated = [...adultChildren]
                                    updated[index].nom = e.target.value
                                    setAdultChildren(updated)
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Prénom *</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={adultChild.prenom}
                                  onChange={(e) => {
                                    const updated = [...adultChildren]
                                    updated[index].prenom = e.target.value
                                    setAdultChildren(updated)
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">CNE *</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={adultChild.cne}
                                  onChange={(e) => {
                                    const updated = [...adultChildren]
                                    updated[index].cne = e.target.value
                                    setAdultChildren(updated)
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Date naissance *</label>
                                <input
                                  type="date"
                                  className="form-input"
                                  value={adultChild.dateNaissance}
                                  onChange={(e) => {
                                    const updated = [...adultChildren]
                                    updated[index].dateNaissance = e.target.value
                                    setAdultChildren(updated)
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Sexe *</label>
                                <select
                                  className="form-select"
                                  value={adultChild.sexe}
                                  onChange={(e) => {
                                    const updated = [...adultChildren]
                                    updated[index].sexe = e.target.value
                                    setAdultChildren(updated)
                                  }}
                                >
                                  <option value="M">Masculin</option>
                                  <option value="F">Féminin</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label className="form-label">Code discipline *</label>
                                <select
                                  className="form-select"
                                  value={adultChild.disciplineCode}
                                  onChange={(e) => {
                                    const updated = [...adultChildren]
                                    updated[index].disciplineCode = e.target.value
                                    setAdultChildren(updated)
                                  }}
                                  required
                                >
                                  <option value="">Sélectionner</option>
                                  {filterDisciplineCodes(availableDisciplines, 'adult').map((discipline) => (
                                    <option key={discipline.code} value={discipline.code}>
                                      {discipline.code} - {discipline.nom} ({discipline.price} DH)
                                    </option>
                                  ))}
                                </select>
                                {!adultChild.disciplineCode && (
                                  <div className="form-error">Veuillez sélectionner une discipline</div>
                                )}
                              </div>
                            </div>
                            {adultChild.nom &&
                              adultChild.prenom &&
                              adultChild.dateNaissance &&
                              !isAgeBetween18And25(adultChild.dateNaissance) && (
                                <div className="alert-warning">
                                  <small>L'enfant adulte doit avoir entre 18 et 25 ans</small>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Étape 3 - Récapitulatif */}
              {step === 2 && (
                <div className="step-container">
                  <div className="step-header">
                    <h4 className="step-title">Récapitulatif</h4>
                    <p className="step-description">Vérifiez les informations avant de soumettre</p>
                  </div>
                  <div className="summary-card">
                    <div className="summary-header">
                      <h5 className="summary-title">Réservation Salle de Sport</h5>
                    </div>
                    <div className="summary-body">
                      {reserveForSelf && (
                        <div className="summary-item">
                          <User size={16} className="summary-icon" />
                          <span className="summary-text">
                            {selfInfo.prenom} {selfInfo.nom} (CNE: {selfInfo.cne}) - {selfInfo.disciplineCode}
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
                                {spouse.prenom} {spouse.nom} (CNE: {spouse.cne}) - {spouse.disciplineCode}
                              </span>
                            </div>
                          ))}
                      {addChildren &&
                        userType === "collaborateur" &&
                        children
                          .filter((c) => c.nom.trim() && c.prenom.trim())
                          .map((child, index) => (
                            <div key={index} className="summary-item">
                              <Baby size={16} className="summary-icon" />
                              <span className="summary-text">
                                {child.prenom} {child.nom} ({child.sexe === "M" ? "Garçon" : "Fille"},{" "}
                                {child.dateNaissance}) - {child.disciplineCode}
                              </span>
                            </div>
                          ))}
                      {addAdultChildren &&
                        userType === "collaborateur" &&
                        adultChildren
                          .filter((ac) => ac.nom.trim() && ac.prenom.trim())
                          .map((adultChild, index) => (
                            <div key={index} className="summary-item">
                              <Users size={16} className="summary-icon" />
                              <span className="summary-text">
                                {adultChild.prenom} {adultChild.nom} ({adultChild.sexe === "M" ? "Homme" : "Femme"},{" "}
                                {adultChild.dateNaissance}) - CNE: {adultChild.cne} - {adultChild.disciplineCode}
                              </span>
                            </div>
                          ))}
                    </div>
                  </div>
                  <div className="alert-info">
                    Cette demande sera soumise à validation administrative. Les détails de paiement seront communiqués
                    après acceptation.
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {step > 0 && (
                <button className="btn-modal btn-secondary" onClick={() => setStep(step - 1)}>
                  Précédent
                </button>
              )}
              {step < 2 ? (
                <button
                  className="btn-modal btn-primary"
                  onClick={() => {
                    if (step === 1) {
                      // Show validation errors and check if fields are valid
                      setShowValidationErrors(true)
                      if (!validateFields()) {
                        return // Don't proceed if validation fails
                      }
                    }
                    setStep(step + 1)
                  }}
                  disabled={
                    step === 0
                      ? !(reserveForSelf || addSpouses || addChildren || addAdultChildren)
                      : step === 1
                        ? !areAllFieldsFilled()
                        : false
                  }
                >
                  Continuer
                </button>
              ) : (
                <button className="btn-modal btn-primary" onClick={handleNewReservationSubmit}>
                  Soumettre
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styles CSS avec thème vert de la piscine */}
      <style jsx>{`
        .reservations-sport-container {
          padding: 24px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          min-height: 100vh;
        }

        /* Header */
        .page-header {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.08);
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
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #16a34a;
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
          padding: 10px 20px;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
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

        .payment-cell {
          text-align: center;
        }

        .payment-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
          margin: 0 auto 4px auto;
        }

        .payment-success {
          background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
          color: #22543d;
        }

        .payment-warning {
          background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%);
          color: #c05621;
        }

        .payment-danger {
          background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
          color: #c53030;
        }

        .payment-amount {
          font-size: 11px;
          color: #718096;
          font-weight: 600;
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

        .action-payment {
          background: #f3e8ff;
          color: #805ad5;
        }

        .action-payment:hover {
          background: #805ad5;
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

        .payment-summary {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
        }

        .payment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .payment-item:last-child {
          border-bottom: none;
        }

        .payment-label {
          font-weight: 500;
          color: #4a5568;
          font-size: 14px;
        }

        .payment-value {
          font-weight: 600;
          font-size: 14px;
        }

        .total-amount {
          color: #2b6cb0;
        }

        .paid-amount {
          color: #38a169;
        }

        .remaining-amount {
          color: #e53e3e;
        }

        .participants-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a202c;
          margin: 20px 0 16px 0;
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

        .participant-details {
          font-size: 12px;
          color: #718096;
          display: block;
          margin-top: 4px;
        }

        .payment-status.paid {
          color: #38a169;
          font-weight: 600;
        }

        .payment-status.unpaid {
          color: #e53e3e;
          font-weight: 600;
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

        .btn-modal.btn-primary {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          color: white;
        }

        .btn-modal.btn-primary:hover {
          background: linear-gradient(135deg, #15803d 0%, #16a34a 100%);
        }

        .btn-modal.btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Gestion des paiements */
        .payment-participant-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .payment-participant-info {
          flex: 1;
        }

        .payment-participant-name {
          font-size: 16px;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 8px 0;
        }

        .payment-participant-details {
          font-size: 14px;
          color: #718096;
        }

        .payment-participant-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .payment-switch {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .payment-switch input[type='checkbox'] {
          display: none;
        }

        .payment-switch-slider {
          width: 48px;
          height: 24px;
          background: #e2e8f0;
          border-radius: 24px;
          position: relative;
          transition: all 0.3s ease;
        }

        .payment-switch-slider::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .payment-switch input[type='checkbox']:checked + .payment-switch-slider {
          background: #38a169;
        }

        .payment-switch input[type='checkbox']:checked + .payment-switch-slider::before {
          transform: translateX(24px);
        }

        .payment-switch-label {
          font-weight: 500;
          color: #4a5568;
        }

        .payment-summary-card {
          background: #f7fafc;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }

        .payment-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          text-align: center;
        }

        .payment-summary-item {
          background: white;
          padding: 16px;
          border-radius: 8px;
        }

        .payment-summary-label {
          font-size: 14px;
          color: #718096;
          margin: 0 0 8px 0;
        }

        .payment-summary-value {
          font-size: 20px;
          font-weight: 700;
        }

        .payment-summary-value.total {
          color: #2b6cb0;
        }

        .payment-summary-value.paid {
          color: #38a169;
        }

        .payment-summary-value.remaining {
          color: #e53e3e;
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

        .form-input.error {
          border-color: #dc2626;
          background-color: #fef2f2;
        }

        .error-message {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 500;
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

        /* Responsive */
        @media (max-width: 768px) {
          .reservations-sport-container {
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

          .participants-selection-grid {
            grid-template-columns: 1fr;
          }

          .radio-group {
            flex-direction: column;
            align-items: center;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .payment-summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
