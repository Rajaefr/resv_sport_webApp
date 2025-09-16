"use client"
import { useState } from "react"
import {
  Search,
  Filter,
  Download,
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
} from "lucide-react"

const reservationsPiscine = [
  {
    id: "P001",
    user: "Ahmed Benali",
    userType: "Collaborateur",
    matricule: "12345A",
    email: "ahmed.benali@ocp.ma",
    groupe: "A1-1",
    bassin: "Grand Bassin",
    date: "2024-01-15",
    heureDebut: "14:00",
    heureFin: "15:00",
    participants: 4,
    status: "acceptee",
    dateCreation: "2024-01-10",
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
    user: "Fatima Zahra Alami",
    userType: "Collaboratrice",
    matricule: "67890B",
    email: "fatima.zahra@ocp.ma",
    groupe: "A1-2",
    bassin: "Petit Bassin",
    date: "2024-01-15",
    heureDebut: "16:00",
    heureFin: "17:00",
    participants: 1,
    status: "en_attente",
    dateCreation: "2024-01-12",
    commentaire: "Séance aquagym",
    participantsList: [{ nom: "Fatima Zahra", prenom: "Alami", type: "Collaboratrice", groupe: "A1-2" }],
  },
  {
    id: "P003",
    user: "Mohamed Alami",
    userType: "Retraité",
    matricule: "54321C",
    email: "mohamed.alami@ocp.ma",
    groupe: "A2-1",
    bassin: "Grand Bassin",
    date: "2024-01-16",
    heureDebut: "10:00",
    heureFin: "11:30",
    participants: 5,
    status: "refusee",
    dateCreation: "2024-01-11",
    commentaire: "Formation plongée débutant",
    participantsList: [
      { nom: "Mohamed", prenom: "Alami", type: "Retraité", groupe: "A2-1" },
      { nom: "Khadija", prenom: "Alami", type: "Conjoint", groupe: "A2-1" },
      { nom: "Yassine", prenom: "Alami", type: "Enfant", age: 10, groupe: "A2-2" },
      { nom: "Salma", prenom: "Alami", type: "Enfant", age: 14, groupe: "A2-2" },
      { nom: "Ali", prenom: "Alami", type: "Enfant", age: 16, groupe: "A2-2" },
    ],
  },
  {
    id: "P004",
    user: "Khadija Mansouri",
    userType: "Retraitée",
    matricule: "98765D",
    email: "khadija.mansouri@ocp.ma",
    groupe: "A2-2",
    bassin: "Petit Bassin",
    date: "2024-01-16",
    heureDebut: "18:00",
    heureFin: "19:00",
    participants: 2,
    status: "en_attente",
    dateCreation: "2024-01-13",
    commentaire: "Natation libre",
    participantsList: [
      { nom: "Khadija", prenom: "Mansouri", type: "Retraitée", groupe: "A2-2" },
      { nom: "Abdellah", prenom: "Mansouri", type: "Conjoint", groupe: "A2-2" },
    ],
  },
  {
    id: "P005",
    user: "Youssef Idrissi",
    userType: "Collaborateur",
    matricule: "11223E",
    email: "youssef.idrissi@ocp.ma",
    groupe: "A1-3",
    bassin: "Grand Bassin",
    date: "2024-01-17",
    heureDebut: "08:00",
    heureFin: "09:00",
    participants: 4,
    status: "acceptee",
    dateCreation: "2024-01-14",
    commentaire: "Entraînement matinal",
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

  // Formulaire nouvelle réservation
  const [step, setStep] = useState(0)
  const [reserveForSelf, setReserveForSelf] = useState(false)
  const [addSpouses, setAddSpouses] = useState(false)
  const [addChildren, setAddChildren] = useState(false)
  const [userType, setUserType] = useState<"collaborateur" | "retraite">("collaborateur")
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
    groupe: "",
    bassin: "",
    date: "",
    heureDebut: "",
    heureFin: "",
    participants: 0,
    commentaire: "",
  })

  // État pour la gestion des groupes par participant
  const [participantGroups, setParticipantGroups] = useState<{ [key: string]: string }>({})

  const filteredReservations = reservationsPiscine.filter((reservation) => {
    const matchesSearch =
      reservation.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.groupe.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    const matchesDate = !dateFilter || reservation.date === dateFilter
    const matchesGroupe = !groupeFilter || reservation.groupe.toLowerCase().includes(groupeFilter.toLowerCase())
    return matchesSearch && matchesStatus && matchesDate && matchesGroupe
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
      console.log("Suppression de la réservation:", id)
      alert("Réservation supprimée avec succès")
    }
  }

  const openEditModal = (reservation: any) => {
    setSelectedReservation(reservation)
    setEditForm({
      user: reservation.user,
      email: reservation.email,
      groupe: reservation.groupe,
      bassin: reservation.bassin,
      date: reservation.date,
      heureDebut: reservation.heureDebut,
      heureFin: reservation.heureFin,
      participants: reservation.participants,
      commentaire: reservation.commentaire,
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
            <button className="btn-header btn-secondary">
              <Download size={18} />
              <span>Exporter</span>
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
            <div className="stat-value">{reservationsPiscine.filter((r) => r.status === "acceptee").length}</div>
            <div className="stat-label">Acceptées</div>
          </div>
          <div className="stat-trend">+5%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reservationsPiscine.filter((r) => r.status === "en_attente").length}</div>
            <div className="stat-label">En Attente</div>
          </div>
          <div className="stat-trend">-2%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reservationsPiscine.reduce((sum, r) => sum + r.participants, 0)}</div>
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
              placeholder="Rechercher par nom, matricule ou groupe..."
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
          <div className="table-actions">
            <button className="btn-table-action">
              <Download size={16} />
            </button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Type & Matricule</th>
                <th>Groupe & Bassin</th>
                <th>Date & Heure</th>
                <th>Participants</th>
                <th>Statut</th>
                <th>Commentaire</th>
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
                        <UserCheck size={14} />
                        <span>{reservation.userType}</span>
                      </div>
                      <div className="matricule">#{reservation.matricule}</div>
                    </div>
                  </td>
                  <td>
                    <div className="location-cell">
                      <div className="location-primary">{reservation.groupe}</div>
                      <div className="location-secondary">{reservation.bassin}</div>
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
                  <td >{getStatusBadge(reservation.status)}</td>
                  <td>
                    <div className="comment-cell">{reservation.commentaire}</div>
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

      {/* Modals - Garder la même structure mais avec les nouveaux styles */}
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
                      <span className="info-label">Groupe</span>
                      <span className="info-value">{selectedReservation.groupe}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Bassin</span>
                      <span className="info-value">{selectedReservation.bassin}</span>
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
                    <div className="info-item " >
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

      {/* Modal Édition */}
      {showEditModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Edit size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Modifier la réservation</h3>
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
                  <label className="form-label">Utilisateur</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.user}
                    onChange={(e) => setEditForm({ ...editForm, user: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Groupe</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.groupe}
                    onChange={(e) => setEditForm({ ...editForm, groupe: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bassin</label>
                  <select
                    className="form-select"
                    value={editForm.bassin}
                    onChange={(e) => setEditForm({ ...editForm, bassin: e.target.value })}
                  >
                    <option value="Grand Bassin">Grand Bassin</option>
                    <option value="Petit Bassin">Petit Bassin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Heure début</label>
                  <input
                    type="time"
                    className="form-input"
                    value={editForm.heureDebut}
                    onChange={(e) => setEditForm({ ...editForm, heureDebut: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Heure fin</label>
                  <input
                    type="time"
                    className="form-input"
                    value={editForm.heureFin}
                    onChange={(e) => setEditForm({ ...editForm, heureFin: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre de participants</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.participants}
                    onChange={(e) => setEditForm({ ...editForm, participants: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Commentaire</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={editForm.commentaire}
                    onChange={(e) => setEditForm({ ...editForm, commentaire: e.target.value })}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal btn-secondary" onClick={() => setShowEditModal(false)}>
                Annuler
              </button>
              <button className="btn-modal btn-primary" onClick={handleEditReservation}>
                Sauvegarder
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
              <div className="alert-warning">
                <strong>Note:</strong> Les adultes (collaborateurs/retraités/conjoints) sont affectés aux groupes
                adultes, tandis que les enfants sont affectés aux groupes enfants ou mixtes selon leur âge.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal btn-secondary" onClick={() => setShowGroupModal(false)}>
                Annuler
              </button>
              <button className="btn-modal btn-primary" onClick={handleGroupAssignment}>
                Sauvegarder les affectations
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <p className="step-description">Veuillez remplir les informations requises</p>
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
                              className="form-input"
                              value={selfInfo.cne}
                              onChange={(e) => setSelfInfo({ ...selfInfo, cne: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              {userType === "retraite" ? "Numéro RCAR *" : "Matricule *"}
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              value={selfInfo.matricule}
                              onChange={(e) => setSelfInfo({ ...selfInfo, matricule: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                              type="email"
                              className="form-input"
                              value={selfInfo.email}
                              onChange={(e) => setSelfInfo({ ...selfInfo, email: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Téléphone</label>
                            <input
                              type="tel"
                              className="form-input"
                              value={selfInfo.telephone}
                              onChange={(e) => setSelfInfo({ ...selfInfo, telephone: e.target.value })}
                            />
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {addChildren && userType === "collaborateur" && (
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
                      <h5 className="summary-title">Réservation Piscine</h5>
                    </div>
                    <div className="summary-body">
                      {reserveForSelf && (
                        <div className="summary-item">
                          <User size={16} className="summary-icon" />
                          <span className="summary-text">
                            <strong>{userType === "retraite" ? "Retraité" : "Collaborateur"}:</strong> {selfInfo.prenom}{" "}
                            {selfInfo.nom} (CNE: {selfInfo.cne})
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
                                <strong>Conjoint:</strong> {spouse.prenom} {spouse.nom} (CNE: {spouse.cne})
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
                                <strong>Enfant:</strong> {child.prenom} {child.nom} (
                                {child.sexe === "M" ? "Garçon" : "Fille"}, {child.dateNaissance})
                              </span>
                            </div>
                          ))}
                    </div>
                  </div>
                  <div className="alert-info">
                    Cette demande sera soumise à validation administrative. L'affectation aux groupes sera effectuée
                    selon le type de participant : adultes dans les groupes adultes, enfants dans les groupes enfants.
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
                  onClick={() => setStep(step + 1)}
                  disabled={
                    step === 0
                      ? !(reserveForSelf || addSpouses || addChildren)
                      : step === 1
                        ? !selfInfo.nom || !selfInfo.prenom || !selfInfo.cne || !selfInfo.matricule || !selfInfo.email
                        : false
                  }
                >
                  Continuer
                </button>
              ) : (
                <button
                  className="btn-modal btn-primary"
                  onClick={() => {
                    const participants = []
                    if (reserveForSelf) {
                      participants.push({
                        nom: selfInfo.nom,
                        prenom: selfInfo.prenom,
                        type: userType === "retraite" ? "Retraité" : "Collaborateur",
                      })
                    }
                    if (addSpouses) {
                      spouses.forEach((s) => {
                        if (s.nom && s.prenom) {
                          participants.push({
                            nom: s.nom,
                            prenom: s.prenom,
                            type: "Conjoint",
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
                    setSelfInfo({ nom: "", prenom: "", cne: "", matricule: "", email: "", telephone: "" })
                    setSpouses([{ nom: "", prenom: "", cne: "" }])
                    setChildren([{ nom: "", prenom: "", dateNaissance: "", sexe: "M" }])
                  }}
                >
                  Soumettre
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reservations-piscine-container {
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
