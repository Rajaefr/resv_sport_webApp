"use client"
import { useState } from "react"
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
} from "lucide-react"

// Codes disciplines avec montants
const disciplineCodes = {
  "C001-1": { name: "Adultes Musculation", price: 80 },
  "C001-2": { name: "Enfants Musculation", price: 50 },
  "C058-1": { name: "Adultes Gym", price: 100 },
  "C058-2": { name: "Enfants Gym", price: 60 },
  "C058-3": { name: "Adultes Gym & Swim", price: 150 },
  "C058-4": { name: "Enfants Gym & Swim", price: 90 },
  "C025-1": { name: "Adultes Fitness", price: 120 },
  "C025-2": { name: "Enfants Fitness", price: 70 },
}

const reservationsSport = [
  {
    id: "S001",
    user: "Hassan Benjelloun",
    userType: "Collaborateur",
    matricule: "33445A",
    email: "hassan.benjelloun@ocp.ma",
    salle: "C001-1",
    activite: "Football",
    date: "2024-01-15",
    heureDebut: "14:00",
    heureFin: "16:00",
    participants: 5, // Réajusté
    status: "acceptee",
    dateCreation: "2024-01-10",
    commentaire: "Match inter-services",
    equipement: "Ballons, chasubles",
    paymentStatus: "Payé",
    totalAmount: 400, // 5 * 80 DH (C001-1)
    paidAmount: 400,
    participantsList: [
      { nom: "Hassan", prenom: "Benjelloun", type: "Collaborateur", disciplineCode: "C001-1", paid: true, amount: 80 },
      { nom: "Fatima", prenom: "Benjelloun", type: "Conjoint", disciplineCode: "C001-1", paid: true, amount: 80 },
      { nom: "Ahmed", prenom: "Benjelloun", type: "Enfant", disciplineCode: "C001-2", paid: true, amount: 50 },
      { nom: "Sara", prenom: "Benjelloun", type: "Enfant", disciplineCode: "C001-2", paid: true, amount: 50 },
      { nom: "Omar", prenom: "Benjelloun", type: "Enfant Adulte", disciplineCode: "C001-1", paid: true, amount: 80 },
    ],
  },
  {
    id: "S002",
    user: "Aicha Benali",
    userType: "Collaboratrice",
    matricule: "55667B",
    email: "aicha.benali@ocp.ma",
    salle: "C058-2",
    activite: "Volleyball",
    date: "2024-01-15",
    heureDebut: "18:00",
    heureFin: "19:30",
    participants: 4, // Réajusté
    status: "en_attente",
    dateCreation: "2024-01-12",
    commentaire: "Tournoi féminin",
    equipement: "Filet, ballons",
    paymentStatus: "Partiel",
    totalAmount: 220, // Calculé selon les participants
    paidAmount: 110,
    participantsList: [
      { nom: "Aicha", prenom: "Benali", type: "Collaboratrice", disciplineCode: "C058-1", paid: true, amount: 100 },
      { nom: "Rachid", prenom: "Benali", type: "Conjoint", disciplineCode: "C058-1", paid: false, amount: 100 },
      { nom: "Sara", prenom: "Benali", type: "Enfant", disciplineCode: "C058-2", paid: true, amount: 60 },
      { nom: "Lina", prenom: "Benali", type: "Enfant", disciplineCode: "C058-2", paid: false, amount: 60 },
    ],
  },
  {
    id: "S003",
    user: "Omar Tazi",
    userType: "Retraité",
    matricule: "987654321012",
    email: "omar.tazi@ocp.ma",
    salle: "C003-1",
    activite: "Basketball",
    date: "2024-01-16",
    heureDebut: "16:00",
    heureFin: "18:00",
    participants: 10,
    status: "refusee",
    dateCreation: "2024-01-11",
    commentaire: "Entraînement équipe",
    equipement: "Ballons",
    paymentStatus: "En attente",
    totalAmount: 800, // 10 * 80 DH
    paidAmount: 0,
    participantsList: [
      { nom: "Omar", prenom: "Tazi", type: "Retraité", disciplineCode: "C001-1", paid: false, amount: 80 },
      { nom: "Fatima", prenom: "Tazi", type: "Conjoint", disciplineCode: "C001-1", paid: false, amount: 80 },
      { nom: "Ahmed", prenom: "Benkirane", type: "Retraité", disciplineCode: "C001-1", paid: false, amount: 80 },
    ],
  },
  {
    id: "S004",
    user: "Nadia Alaoui",
    userType: "Collaboratrice",
    matricule: "99001D",
    email: "nadia.alaoui@ocp.ma",
    salle: "C001-2",
    activite: "Badminton",
    date: "2024-01-16",
    heureDebut: "19:00",
    heureFin: "20:30",
    participants: 4,
    status: "en_attente",
    dateCreation: "2024-01-13",
    commentaire: "Double mixte",
    equipement: "Raquettes, volants",
    paymentStatus: "En attente",
    totalAmount: 200, // 4 * 50 DH (C001-2)
    paidAmount: 0,
    participantsList: [
      { nom: "Nadia", prenom: "Alaoui", type: "Titulaire", disciplineCode: "C001-2", paid: false, amount: 50 },
      { nom: "Rachid", prenom: "Alaoui", type: "Conjoint", disciplineCode: "C001-2", paid: false, amount: 50 },
      { nom: "Sara", prenom: "Alaoui", type: "Enfant", disciplineCode: "C001-2", paid: false, amount: 50 },
      { nom: "Omar", prenom: "Alaoui", type: "Enfant", disciplineCode: "C001-2", paid: false, amount: 50 },
    ],
  },
  {
    id: "S005",
    user: "Rachid Benkirane",
    userType: "Collaborateur",
    matricule: "22334E",
    email: "rachid.benkirane@ocp.ma",
    salle: "C058-1",
    activite: "Tennis de table",
    date: "2024-01-17",
    heureDebut: "12:00",
    heureFin: "13:00",
    participants: 6,
    status: "acceptee",
    dateCreation: "2024-01-14",
    commentaire: "Pause déjeuner",
    equipement: "Raquettes, balles",
    paymentStatus: "Partiel",
    totalAmount: 600, // 6 * 100 DH (C058-1)
    paidAmount: 400,
    participantsList: [
      { nom: "Rachid", prenom: "Benkirane", type: "Titulaire", disciplineCode: "C058-1", paid: true, amount: 100 },
      { nom: "Fatima", prenom: "Benkirane", type: "Conjoint", disciplineCode: "C058-1", paid: true, amount: 100 },
      { nom: "Ahmed", prenom: "Benkirane", type: "Enfant Adulte", disciplineCode: "C058-1", paid: true, amount: 100 },
      { nom: "Sara", prenom: "Benkirane", type: "Enfant Adulte", disciplineCode: "C058-1", paid: true, amount: 100 },
      { nom: "Omar", prenom: "Mansouri", type: "Collaborateur", disciplineCode: "C058-1", paid: false, amount: 100 },
      { nom: "Youssef", prenom: "Idrissi", type: "Collaborateur", disciplineCode: "C058-1", paid: false, amount: 100 },
    ],
  },
]

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
    <span className={`status-badge-enhanced ${config.className}`}>
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
    <span className={`payment-badge-enhanced ${config.className}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  )
}

export function ReservationsSport() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [paymentNotes, setPaymentNotes] = useState("")
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showNewReservationModal, setShowNewReservationModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Ajouter les états pour l'édition après les états existants :
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

  // Formulaire nouvelle réservation - inspiré du code client salle
  const [step, setStep] = useState(0)
  const [reserveForSelf, setReserveForSelf] = useState(false)
  const [addSpouses, setAddSpouses, setAddChildren, setAddAdultChildren] = useState(false)
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

  const filteredReservations = reservationsSport.filter((reservation) => {
    const matchesSearch =
      reservation.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.salle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.activite.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    const matchesPayment = paymentFilter === "all" || reservation.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  const handleDeleteReservation = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      console.log("Suppression de la réservation:", id)
      alert("Réservation supprimée avec succès")
    }
  }

  const handleNewReservationSubmit = () => {
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

    console.log("Nouvelle réservation:", {
      user: `${selfInfo.prenom} ${selfInfo.nom}`,
      userType: userType === "retraite" ? "Retraité" : "Collaborateur",
      matricule: selfInfo.matricule,
      participants: participants.length,
      participantsList: participants,
    })

    alert("Réservation créée avec succès")
    setShowNewReservationModal(false)
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

  // Ajouter la fonction pour ouvrir le modal d'édition :
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

  // Ajouter la fonction de sauvegarde :
  const handleEditReservation = () => {
    if (selectedReservation) {
      console.log("Modification réservation:", editForm)
      alert(`Réservation ${editForm.user} modifiée avec succès`)
      setShowEditModal(false)
    }
  }

  return (
    <div className="reservations-sport-page">
      {/* Header */}
      <div className="page-header-enhanced">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <Dumbbell size={28} className="title-icon" />
              Réservations Salles de Sport
            </h1>
            <p className="page-subtitle">
              Gestion des réservations et paiements par discipline • {filteredReservations.length} réservations
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline-secondary">
            <Download size={16} className="me-1" />
            Exporter
          </button>
          <button className="btn btn-primary" onClick={() => setShowNewReservationModal(true)}>
            <Plus size={16} className="me-1" />
            Nouvelle Réservation
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards-row">
        <div className="stat-card-mini">
          <div className="stat-icon-mini sport">
            <Dumbbell size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">32</div>
            <div className="stat-label-mini">Aujourd'hui</div>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini success">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">{reservationsSport.filter((r) => r.status === "acceptee").length}</div>
            <div className="stat-label-mini">Acceptées</div>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini warning">
            <Clock size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">{reservationsSport.filter((r) => r.status === "en_attente").length}</div>
            <div className="stat-label-mini">En Attente</div>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini payment">
            <DollarSign size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">{reservationsSport.reduce((sum, r) => sum + r.paidAmount, 0)} DH</div>
            <div className="stat-label-mini">Encaissé</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, salle ou activité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
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
          <button className="btn btn-outline-secondary btn-sm">
            <Filter size={16} className="me-1" />
            Plus de filtres
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container-enhanced">
        <div className="table-responsive">
          <table className="table-enhanced">
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
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="table-row-enhanced">
                  <td>
                    <div className="user-cell-enhanced">
                      <div className="user-avatar-enhanced sport">
                        {reservation.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="user-info-enhanced">
                        <div className="user-name-enhanced">{reservation.user}</div>
                        <div className="user-details-enhanced">{reservation.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="type-cell">
                      <div className="type-primary">
                        <UserCheck size={14} className="me-1" />
                        {reservation.userType}
                      </div>
                      <div className="type-secondary">#{reservation.matricule}</div>
                    </div>
                  </td>
                  <td>
                    <div className="location-cell">
                      <div className="location-primary">
                        <MapPin size={14} />
                        {reservation.salle}
                      </div>
                      <div className="location-secondary">{reservation.activite}</div>
                    </div>
                  </td>
                  <td>
                    <div className="datetime-cell-enhanced">
                      <div className="date-enhanced">
                        <Calendar size={14} />
                        {reservation.date}
                      </div>
                      <div className="time-enhanced">
                        <Clock size={14} />
                        {reservation.heureDebut} - {reservation.heureFin}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="participants-badge sport">
                      <Users size={14} />
                      {reservation.participants}
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
                    <div className="actions-cell-enhanced">
                      <button
                        className="action-btn-enhanced view"
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setShowDetailsModal(true)
                        }}
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </button>
                      {/* Modifier le bouton d'édition pour utiliser la nouvelle fonction : */}
                      <button
                        className="action-btn-enhanced edit"
                        onClick={() => openEditModal(reservation)}
                        title="Éditer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn-enhanced payment"
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
                        className="action-btn-enhanced delete"
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
      <div className="pagination-section">
        <div className="pagination-info">Affichage de {filteredReservations.length} réservations</div>
        <div className="pagination-controls">
          <button className="btn btn-outline-secondary btn-sm">Précédent</button>
          <span className="pagination-current">1</span>
          <button className="btn btn-outline-secondary btn-sm">Suivant</button>
        </div>
      </div>

      {/* Modal Détails */}
      {showDetailsModal && selectedReservation && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Dumbbell className="me-2" size={20} />
                  Détails de la Réservation - {selectedReservation.user}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informations Générales</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Nom complet:</strong>
                          </td>
                          <td>{selectedReservation.user}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Type:</strong>
                          </td>
                          <td>{selectedReservation.userType}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Matricule:</strong>
                          </td>
                          <td>{selectedReservation.matricule}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email:</strong>
                          </td>
                          <td>{selectedReservation.email}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Salle:</strong>
                          </td>
                          <td>{selectedReservation.salle}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Activité:</strong>
                          </td>
                          <td>{selectedReservation.activite}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Date:</strong>
                          </td>
                          <td>{selectedReservation.date}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Horaire:</strong>
                          </td>
                          <td>
                            {selectedReservation.heureDebut} - {selectedReservation.heureFin}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Statut:</strong>
                          </td>
                          <td>{getStatusBadge(selectedReservation.status)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>Paiement & Participants</h6>
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Statut paiement:</span>
                          {getPaymentStatusBadge(selectedReservation.paymentStatus)}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Montant total:</span>
                          <strong>{selectedReservation.totalAmount} DH</strong>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Montant payé:</span>
                          <strong className="text-success">{selectedReservation.paidAmount} DH</strong>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>Reste à payer:</span>
                          <strong className="text-danger">
                            {selectedReservation.totalAmount - selectedReservation.paidAmount} DH
                          </strong>
                        </div>
                      </div>
                    </div>

                    <h6 className="mt-3">Participants par catégorie</h6>
                    <div className="row">
                      <div className="col-md-4">
                        <h6 className="text-primary">Collaborateur/Retraité</h6>
                        {selectedReservation.participantsList
                          ?.filter(
                            (p) => p.type === "Collaborateur" || p.type === "Collaboratrice" || p.type === "Retraité",
                          )
                          .map((participant, idx) => (
                            <div key={idx} className="mb-2">
                              <strong>
                                {participant.prenom} {participant.nom}
                              </strong>
                              <br />
                              <small>
                                {participant.disciplineCode} • {participant.amount} DH •{" "}
                                {participant.paid ? "Payé" : "Non payé"}
                              </small>
                            </div>
                          ))}
                      </div>
                      <div className="col-md-4">
                        <h6 className="text-success">Conjoints</h6>
                        {selectedReservation.participantsList
                          ?.filter((p) => p.type === "Conjoint")
                          .map((participant, idx) => (
                            <div key={idx} className="mb-2">
                              <strong>
                                {participant.prenom} {participant.nom}
                              </strong>
                              <br />
                              <small>
                                {participant.disciplineCode} • {participant.amount} DH •{" "}
                                {participant.paid ? "Payé" : "Non payé"}
                              </small>
                            </div>
                          ))}
                      </div>
                      <div className="col-md-4">
                        <h6 className="text-warning">Enfants</h6>
                        {selectedReservation.participantsList
                          ?.filter((p) => p.type === "Enfant" || p.type === "Enfant Adulte")
                          .map((participant, idx) => (
                            <div key={idx} className="mb-2">
                              <strong>
                                {participant.prenom} {participant.nom}
                              </strong>
                              <br />
                              <small>
                                {participant.type} • {participant.disciplineCode} • {participant.amount} DH •{" "}
                                {participant.paid ? "Payé" : "Non payé"}
                              </small>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                {selectedReservation.commentaire && (
                  <div className="mt-3">
                    <h6>Commentaire</h6>
                    <p className="text-muted">{selectedReservation.commentaire}</p>
                  </div>
                )}
                {selectedReservation.equipement && (
                  <div className="mt-3">
                    <h6>Équipement</h6>
                    <p className="text-muted">{selectedReservation.equipement}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestion des Paiements */}
      {showPaymentModal && selectedReservation && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <CreditCard className="me-2" size={20} />
                  Gestion des Paiements - {selectedReservation.user}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <strong>Gestion des paiements par membre</strong>
                  <br />
                  Cochez les participants qui ont effectué leur paiement.
                </div>

                {selectedReservation.participantsList?.map((participant: any, idx: number) => (
                  <div key={idx} className="card mb-3">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <h6 className="card-title mb-1">
                            {participant.prenom} {participant.nom}
                          </h6>
                          <small className="text-muted">
                            {participant.type} • {participant.disciplineCode} • {participant.amount} DH
                          </small>
                        </div>
                        <div className="col-md-6 text-end">
                          <div className="form-check form-switch d-inline-block">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultChecked={participant.paid}
                              onChange={(e) => {
                                // Logic to update payment status
                                console.log(`Participant ${participant.nom} payment status:`, e.target.checked)
                              }}
                            />
                            <label className="form-check-label">{participant.paid ? "Payé" : "Non payé"}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="card bg-light">
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-4">
                        <h6>Montant Total</h6>
                        <h4 className="text-primary">{selectedReservation.totalAmount} DH</h4>
                      </div>
                      <div className="col-md-4">
                        <h6>Montant Payé</h6>
                        <h4 className="text-success">{selectedReservation.paidAmount} DH</h4>
                      </div>
                      <div className="col-md-4">
                        <h6>Reste à Payer</h6>
                        <h4 className="text-danger">
                          {selectedReservation.totalAmount - selectedReservation.paidAmount} DH
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">Notes de paiement</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Ajouter des notes sur les paiements..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    alert("Paiements mis à jour avec succès")
                    setShowPaymentModal(false)
                  }}
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition */}
      {showEditModal && selectedReservation && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Edit className="me-2" size={20} />
                  Modifier la réservation - {selectedReservation.user}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Utilisateur</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.user}
                    onChange={(e) => setEditForm({ ...editForm, user: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Salle</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.salle}
                        onChange={(e) => setEditForm({ ...editForm, salle: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Activité</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.activite}
                        onChange={(e) => setEditForm({ ...editForm, activite: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Heure début</label>
                      <input
                        type="time"
                        className="form-control"
                        value={editForm.heureDebut}
                        onChange={(e) => setEditForm({ ...editForm, heureDebut: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Heure fin</label>
                      <input
                        type="time"
                        className="form-control"
                        value={editForm.heureFin}
                        onChange={(e) => setEditForm({ ...editForm, heureFin: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre de participants</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.participants}
                    onChange={(e) => setEditForm({ ...editForm, participants: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Équipement</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.equipement}
                    onChange={(e) => setEditForm({ ...editForm, equipement: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Commentaire</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={editForm.commentaire}
                    onChange={(e) => setEditForm({ ...editForm, commentaire: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Annuler
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditReservation}>
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Réservation */}
      {showNewReservationModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Plus className="me-2" size={20} />
                  Nouvelle Réservation Salle de Sport
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowNewReservationModal(false)}></button>
              </div>
              <div className="modal-body">
                {step === 0 && (
                  <div>
                    <h6>Étape 1/3 - Sélection des participants</h6>
                    <p className="text-muted">Qui souhaitez-vous inclure dans cette réservation ?</p>

                    <div className="alert alert-info">
                      <strong>Type de compte:</strong>
                      <div className="form-check form-check-inline ms-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="userType"
                          value="collaborateur"
                          checked={userType === "collaborateur"}
                          onChange={(e) => setUserType(e.target.value as "collaborateur" | "retraite")}
                        />
                        <label className="form-check-label">Collaborateur</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="userType"
                          value="retraite"
                          checked={userType === "retraite"}
                          onChange={(e) => setUserType(e.target.value as "collaborateur" | "retraite")}
                        />
                        <label className="form-check-label">Retraité</label>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className={`card ${reserveForSelf ? "border-primary" : ""}`}>
                          <div className="card-body">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={reserveForSelf}
                                onChange={(e) => setReserveForSelf(e.target.checked)}
                              />
                              <label className="form-check-label">
                                <strong>Moi-même</strong>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className={`card ${addSpouses ? "border-primary" : ""}`}>
                          <div className="card-body">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={addSpouses}
                                onChange={(e) => setAddSpouses(e.target.checked)}
                              />
                              <label className="form-check-label">
                                <strong>Conjoints (max. 2)</strong>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {userType === "collaborateur" && (
                        <>
                          <div className="col-md-6 mb-3">
                            <div className={`card ${addChildren ? "border-primary" : ""}`}>
                              <div className="card-body">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={addChildren}
                                    onChange={(e) => setAddChildren(e.target.checked)}
                                  />
                                  <label className="form-check-label">
                                    <strong>Enfants 4-18 ans (max. 5)</strong>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className={`card ${addAdultChildren ? "border-primary" : ""}`}>
                              <div className="card-body">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={addAdultChildren}
                                    onChange={(e) => setAddAdultChildren(e.target.checked)}
                                  />
                                  <label className="form-check-label">
                                    <strong>Enfants adultes 18-25 ans (max. 5)</strong>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {userType === "retraite" && (
                      <div className="alert alert-warning">
                        <strong>Information:</strong> En tant que retraité, vous pouvez réserver pour vous-même et vos
                        conjoints uniquement.
                      </div>
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h6>Étape 2/3 - Informations des participants</h6>
                    <p className="text-muted">Veuillez remplir les informations et choisir les disciplines</p>

                    {reserveForSelf && (
                      <div className="card mb-3">
                        <div className="card-header">
                          <h6 className="mb-0">Mes informations</h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Nom *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={selfInfo.nom}
                                  onChange={(e) => setSelfInfo({ ...selfInfo, nom: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Prénom *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={selfInfo.prenom}
                                  onChange={(e) => setSelfInfo({ ...selfInfo, prenom: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">CNE *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={selfInfo.cne}
                                  onChange={(e) => setSelfInfo({ ...selfInfo, cne: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  {userType === "retraite" ? "Numéro RCAR *" : "Matricule *"}
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={selfInfo.matricule}
                                  onChange={(e) => setSelfInfo({ ...selfInfo, matricule: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Email *</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  value={selfInfo.email}
                                  onChange={(e) => setSelfInfo({ ...selfInfo, email: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Téléphone</label>
                                <input
                                  type="tel"
                                  className="form-control"
                                  value={selfInfo.telephone}
                                  onChange={(e) => setSelfInfo({ ...selfInfo, telephone: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Code de discipline *</label>
                            <select
                              className="form-select"
                              value={selfInfo.disciplineCode}
                              onChange={(e) => setSelfInfo({ ...selfInfo, disciplineCode: e.target.value })}
                            >
                              <option value="">Sélectionner une discipline</option>
                              {Object.entries(disciplineCodes).map(([code, info]) => (
                                <option key={code} value={code}>
                                  {code} - {info.name} ({info.price} DH)
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {addSpouses && (
                      <div className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">Conjoints</h6>
                          {spouses.length < 2 && (
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addSpouse}>
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                        <div className="card-body">
                          {spouses.map((spouse, index) => (
                            <div key={index} className="border rounded p-3 mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6>Conjoint {index + 1}</h6>
                                {spouses.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeSpouse(index)}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                              <div className="row">
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <label className="form-label">Nom *</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={spouse.nom}
                                      onChange={(e) => {
                                        const updated = [...spouses]
                                        updated[index].nom = e.target.value
                                        setSpouses(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <label className="form-label">Prénom *</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={spouse.prenom}
                                      onChange={(e) => {
                                        const updated = [...spouses]
                                        updated[index].prenom = e.target.value
                                        setSpouses(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <label className="form-label">CNE *</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={spouse.cne}
                                      onChange={(e) => {
                                        const updated = [...spouses]
                                        updated[index].cne = e.target.value
                                        setSpouses(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <label className="form-label">Code discipline *</label>
                                    <select
                                      className="form-select"
                                      value={spouse.disciplineCode}
                                      onChange={(e) => {
                                        const updated = [...spouses]
                                        updated[index].disciplineCode = e.target.value
                                        setSpouses(updated)
                                      }}
                                    >
                                      <option value="">Sélectionner</option>
                                      {Object.entries(disciplineCodes).map(([code, info]) => (
                                        <option key={code} value={code}>
                                          {code} - {info.name} ({info.price} DH)
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {addChildren && userType === "collaborateur" && (
                      <div className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">Enfants (4-18 ans)</h6>
                          {children.length < 5 && (
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addChild}>
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                        <div className="card-body">
                          {children.map((child, index) => (
                            <div key={index} className="border rounded p-3 mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6>Enfant {index + 1}</h6>
                                {children.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeChild(index)}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                              <div className="row">
                                <div className="col-md-2">
                                  <div className="mb-3">
                                    <label className="form-label">Nom *</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={child.nom}
                                      onChange={(e) => {
                                        const updated = [...children]
                                        updated[index].nom = e.target.value
                                        setChildren(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="mb-3">
                                    <label className="form-label">Prénom *</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={child.prenom}
                                      onChange={(e) => {
                                        const updated = [...children]
                                        updated[index].prenom = e.target.value
                                        setChildren(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="mb-3">
                                    <label className="form-label">Date naissance *</label>
                                    <input
                                      type="date"
                                      className="form-control"
                                      value={child.dateNaissance}
                                      onChange={(e) => {
                                        const updated = [...children]
                                        updated[index].dateNaissance = e.target.value
                                        setChildren(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="mb-3">
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
                                <div className="col-md-4">
                                  <div className="mb-3">
                                    <label className="form-label">Code discipline *</label>
                                    <select
                                      className="form-select"
                                      value={child.disciplineCode}
                                      onChange={(e) => {
                                        const updated = [...children]
                                        updated[index].disciplineCode = e.target.value
                                        setChildren(updated)
                                      }}
                                    >
                                      <option value="">Sélectionner</option>
                                      {Object.entries(disciplineCodes)
                                        .filter(([code]) => code.includes("-2")) // Codes enfants
                                        .map(([code, info]) => (
                                          <option key={code} value={code}>
                                            {code} - {info.name} ({info.price} DH)
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              {child.nom &&
                                child.prenom &&
                                child.dateNaissance &&
                                !isAgeBetween4And18(child.dateNaissance) && (
                                  <div className="alert alert-warning">
                                    <small>L'enfant doit avoir entre 4 et 18 ans pour les salles de sport</small>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {addAdultChildren && userType === "collaborateur" && (
                      <div className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">Enfants adultes (18-25 ans)</h6>
                          {adultChildren.length < 5 && (
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addAdultChild}>
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                        <div className="card-body">
                          {adultChildren.map((adultChild, index) => (
                            <div key={index} className="border rounded p-3 mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6>Enfant adulte {index + 1}</h6>
                                {adultChildren.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeAdultChild(index)}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                              <div className="row">
                                <div className="col-md-2">
                                  <div className="mb-3">
                                    <label className="form-label">Nom *</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={adultChild.nom}
                                      onChange={(e) => {
                                        const updated = [...adultChildren]
                                        updated[index].nom = e.target.value
                                        setAdultChildren(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="mb-3">
                                    <label className="form-label">Prénom *</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={adultChild.prenom}
                                      onChange={(e) => {
                                        const updated = [...adultChildren]
                                        updated[index].prenom = e.target.value
                                        setAdultChildren(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="mb-3">
                                    <label className="form-label">CNE *</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={adultChild.cne}
                                      onChange={(e) => {
                                        const updated = [...adultChildren]
                                        updated[index].cne = e.target.value
                                        setAdultChildren(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="mb-3">
                                    <label className="form-label">Date naissance *</label>
                                    <input
                                      type="date"
                                      className="form-control"
                                      value={adultChild.dateNaissance}
                                      onChange={(e) => {
                                        const updated = [...adultChildren]
                                        updated[index].dateNaissance = e.target.value
                                        setAdultChildren(updated)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="mb-3">
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
                                </div>
                                <div className="col-md-2">
                                  <div className="mb-3">
                                    <label className="form-label">Code discipline *</label>
                                    <select
                                      className="form-select"
                                      value={adultChild.disciplineCode}
                                      onChange={(e) => {
                                        const updated = [...adultChildren]
                                        updated[index].disciplineCode = e.target.value
                                        setAdultChildren(updated)
                                      }}
                                    >
                                      <option value="">Sélectionner</option>
                                      {Object.entries(disciplineCodes)
                                        .filter(([code]) => code.includes("-1")) // Codes adultes
                                        .map(([code, info]) => (
                                          <option key={code} value={code}>
                                            {code} - {info.name} ({info.price} DH)
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              {adultChild.nom &&
                                adultChild.prenom &&
                                adultChild.dateNaissance &&
                                !isAgeBetween18And25(adultChild.dateNaissance) && (
                                  <div className="alert alert-warning">
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

                {step === 2 && (
                  <div>
                    <h6>Étape 3/3 - Récapitulatif</h6>
                    <p className="text-muted">Vérifiez les informations avant de soumettre</p>

                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Réservation Salle de Sport</h6>
                      </div>
                      <div className="card-body">
                        {reserveForSelf && (
                          <div className="d-flex align-items-center mb-2">
                            <Users size={16} className="me-2" />
                            <span>
                              {selfInfo.prenom} {selfInfo.nom} (CNE: {selfInfo.cne}) - {selfInfo.disciplineCode}
                            </span>
                          </div>
                        )}
                        {addSpouses &&
                          spouses
                            .filter((s) => s.nom.trim() && s.prenom.trim())
                            .map((spouse, index) => (
                              <div key={index} className="d-flex align-items-center mb-2">
                                <Users size={16} className="me-2" />
                                <span>
                                  {spouse.prenom} {spouse.nom} (CNE: {spouse.cne}) - {spouse.disciplineCode}
                                </span>
                              </div>
                            ))}
                        {addChildren &&
                          userType === "collaborateur" &&
                          children
                            .filter((c) => c.nom.trim() && c.prenom.trim())
                            .map((child, index) => (
                              <div key={index} className="d-flex align-items-center mb-2">
                                <Users size={16} className="me-2" />
                                <span>
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
                              <div key={index} className="d-flex align-items-center mb-2">
                                <Users size={16} className="me-2" />
                                <span>
                                  {adultChild.prenom} {adultChild.nom} ({adultChild.sexe === "M" ? "Homme" : "Femme"},{" "}
                                  {adultChild.dateNaissance}) - CNE: {adultChild.cne} - {adultChild.disciplineCode}
                                </span>
                              </div>
                            ))}
                      </div>
                    </div>

                    <div className="alert alert-info mt-3">
                      Cette demande sera soumise à validation administrative. Les détails de paiement seront communiqués
                      après acceptation.
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {step > 0 && (
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                    Précédent
                  </button>
                )}
                {step < 2 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep(step + 1)}
                    disabled={
                      step === 0
                        ? !(reserveForSelf || addSpouses || addChildren || addAdultChildren)
                        : step === 1
                          ? !selfInfo.nom ||
                            !selfInfo.prenom ||
                            !selfInfo.cne ||
                            !selfInfo.matricule ||
                            !selfInfo.email ||
                            !selfInfo.disciplineCode
                          : false
                    }
                  >
                    Continuer
                  </button>
                ) : (
                  <button type="button" className="btn btn-success" onClick={handleNewReservationSubmit}>
                    Soumettre
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reservations-sport-page {
          padding: 20px;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .page-header-enhanced {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .page-title {
          display: flex;
          align-items: center;
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .title-icon {
          margin-right: 12px;
          color: #e67e22;
        }

        .page-subtitle {
          color: #7f8c8d;
          margin: 5px 0 0 0;
          font-size: 14px;
        }

        .stats-cards-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card-mini {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon-mini {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon-mini.sport {
          background: linear-gradient(135deg, #e67e22, #d35400);
        }
        .stat-icon-mini.success {
          background: linear-gradient(135deg, #27ae60, #229954);
        }
        .stat-icon-mini.warning {
          background: linear-gradient(135deg, #f39c12, #e67e22);
        }
        .stat-icon-mini.payment {
          background: linear-gradient(135deg, #8e44ad, #7d3c98);
        }

        .stat-value-mini {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
        }

        .stat-label-mini {
          font-size: 12px;
          color: #7f8c8d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filters-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .search-box {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 45px;
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #e67e22;
        }

        .filter-select {
          padding: 12px 16px;
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          background: white;
          min-width: 150px;
        }

        .table-container-enhanced {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 30px;
        }

        .table-enhanced {
          width: 100%;
          margin: 0;
        }

        .table-enhanced th {
          background: #f8f9fa;
          padding: 16px;
          font-weight: 600;
          color: #2c3e50;
          border: none;
          font-size: 14px;
        }

        .table-enhanced td {
          padding: 16px;
          border-top: 1px solid #ecf0f1;
          vertical-align: middle;
        }

        .table-row-enhanced:hover {
          background-color: #f8f9fa;
        }

        .user-cell-enhanced {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-enhanced {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .user-avatar-enhanced.sport {
          background: linear-gradient(135deg, #e67e22, #d35400);
        }

        .user-name-enhanced {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 2px;
        }

        .user-details-enhanced {
          font-size: 12px;
          color: #7f8c8d;
        }

        .type-cell {
          text-align: center;
        }

        .type-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .type-secondary {
          font-size: 12px;
          color: #7f8c8d;
        }

        .location-cell {
          text-align: center;
        }

        .location-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .location-secondary {
          font-size: 12px;
          color: #7f8c8d;
        }

        .datetime-cell-enhanced {
          text-align: center;
        }

        .date-enhanced,
        .time-enhanced {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .participants-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
          width: fit-content;
          margin: 0 auto;
        }

        .participants-badge.sport {
          background: #fdf2e9;
          color: #e67e22;
        }

        .status-badge-enhanced {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
        }

        .status-badge-enhanced.status-success {
          background: #d5f4e6;
          color: #27ae60;
        }

        .status-badge-enhanced.status-warning {
          background: #fef9e7;
          color: #f39c12;
        }

        .status-badge-enhanced.status-danger {
          background: #fadbd8;
          color: #e74c3c;
        }

        .payment-cell {
          text-align: center;
        }

        .payment-badge-enhanced {
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

        .payment-badge-enhanced.payment-success {
          background: #d5f4e6;
          color: #27ae60;
        }

        .payment-badge-enhanced.payment-warning {
          background: #fef9e7;
          color: #f39c12;
        }

        .payment-badge-enhanced.payment-danger {
          background: #fadbd8;
          color: #e74c3c;
        }

        .payment-amount {
          font-size: 11px;
          color: #7f8c8d;
          font-weight: 600;
        }

        .actions-cell-enhanced {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .action-btn-enhanced {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-btn-enhanced.view {
          background: #e8f4fd;
          color: #2980b9;
        }

        .action-btn-enhanced.view:hover {
          background: #2980b9;
          color: white;
        }

        .action-btn-enhanced.edit {
          background: #fef9e7;
          color: #f39c12;
        }

        .action-btn-enhanced.edit:hover {
          background: #f39c12;
          color: white;
        }

        .action-btn-enhanced.payment {
          background: #f4e8fd;
          color: #8e44ad;
        }

        .action-btn-enhanced.payment:hover {
          background: #8e44ad;
          color: white;
        }

        .action-btn-enhanced.delete {
          background: #fadbd8;
          color: #e74c3c;
        }

        .action-btn-enhanced.delete:hover {
          background: #e74c3c;
          color: white;
        }

        .pagination-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .pagination-info {
          color: #7f8c8d;
          font-size: 14px;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pagination-current {
          padding: 8px 12px;
          background: #e67e22;
          color: white;
          border-radius: 6px;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
