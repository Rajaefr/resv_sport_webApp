"use client"
import { useState } from "react"
import { Search, Filter, Download, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Waves, Calendar, Users, UserCheck, User, Heart, Baby } from 'lucide-react'

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
    <span className={`status-badge-enhanced ${config.className}`}>
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
      return <Baby size={14} />
    default:
      return <User size={14} />
  }
}

export function ReservationsPiscine() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [showNewReservationModal, setShowNewReservationModal] = useState(false)

  // Formulaire nouvelle réservation - inspiré du code client piscine
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
    return matchesSearch && matchesStatus
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
  }

  const addSpouse = () => {
    if (spouses.length < 2) {
      setSpouses([...spouses, { nom: "", prenom: "", cne: "" }])
    }
  }

  const removeSpouse = (index: number) => {
    setSpouses(spouses.filter((_, i) => i !== index))
  }

  const addChild = () => {
    if (children.length < 5 && userType === "collaborateur") {
      setChildren([...children, { nom: "", prenom: "", dateNaissance: "", sexe: "M" }])
    }
  }

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index))
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
    // Initialiser les groupes actuels pour chaque participant
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
      return groupes.filter(g => g.type === "enfant" || g.type === "mixte")
    } else {
      return groupes.filter(g => g.type === "adulte" || g.type === "mixte")
    }
  }

  return (
    <div className="reservations-piscine-page">
      {/* Header */}
      <div className="page-header-enhanced">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <Waves size={28} className="title-icon" />
              Réservations Piscine
            </h1>
            <p className="page-subtitle">
              Gestion des réservations des bassins de natation • {filteredReservations.length} réservations
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
          <div className="stat-icon-mini piscine">
            <Waves size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">15</div>
            <div className="stat-label-mini">Aujourd'hui</div>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini success">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">{reservationsPiscine.filter((r) => r.status === "acceptee").length}</div>
            <div className="stat-label-mini">Acceptées</div>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini warning">
            <Clock size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">{reservationsPiscine.filter((r) => r.status === "en_attente").length}</div>
            <div className="stat-label-mini">En Attente</div>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini users">
            <Users size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">{reservationsPiscine.reduce((sum, r) => sum + r.participants, 0)}</div>
            <div className="stat-label-mini">Participants</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, matricule ou groupe..."
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
                <th>Groupe & Bassin</th>
                <th>Date & Heure</th>
                <th>Participants</th>
                <th>Statut</th>
                <th>Commentaire</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="table-row-enhanced">
                  <td>
                    <div className="user-cell-enhanced">
                      <div className="user-avatar-enhanced">
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
                      <div className="location-primary">{reservation.groupe}</div>
                      <div className="location-secondary">{reservation.bassin}</div>
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
                    <div className="participants-badge">
                      <Users size={14} />
                      {reservation.participants}
                    </div>
                  </td>
                  <td>{getStatusBadge(reservation.status)}</td>
                  <td>
                    <div className="comment-cell">{reservation.commentaire}</div>
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
                      <button
                        className="action-btn-enhanced edit"
                        onClick={() => openEditModal(reservation)}
                        title="Éditer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn-enhanced group"
                        onClick={() => openGroupModal(reservation)}
                        title="Gérer groupes"
                      >
                        <Users size={16} />
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
                  <Waves className="me-2" size={20} />
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
                            <strong>Groupe:</strong>
                          </td>
                          <td>{selectedReservation.groupe}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Bassin:</strong>
                          </td>
                          <td>{selectedReservation.bassin}</td>
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
                        <tr>
                          <td>
                            <strong>Participants:</strong>
                          </td>
                          <td>{selectedReservation.participants}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>Commentaire</h6>
                    <p className="text-muted">{selectedReservation.commentaire}</p>
                    <h6 className="mt-3">Date de création</h6>
                    <p className="text-muted">{selectedReservation.dateCreation}</p>

                    <h6 className="mt-3">Liste des Participants par Catégorie</h6>
                    {selectedReservation.participantsList && (
                      <div>
                        {/* Collaborateurs/Retraités */}
                        {selectedReservation.participantsList
                          .filter((p) => p.type === "Collaborateur" || p.type === "Collaboratrice" || p.type === "Retraité" || p.type === "Retraitée")
                          .map((p, index) => (
                            <div key={`collab-${index}`} className="participant-item">
                              {getParticipantIcon(p.type)}
                              <strong>{p.type}:</strong> {p.prenom} {p.nom}
                              <span className="participant-group">Groupe: {p.groupe}</span>
                            </div>
                          ))}
                        
                        {/* Conjoints */}
                        {selectedReservation.participantsList
                          .filter((p) => p.type === "Conjoint")
                          .map((p, index) => (
                            <div key={`conjoint-${index}`} className="participant-item">
                              {getParticipantIcon(p.type)}
                              <strong>Conjoint:</strong> {p.prenom} {p.nom}
                              <span className="participant-group">Groupe: {p.groupe}</span>
                            </div>
                          ))}
                        
                        {/* Enfants */}
                        {selectedReservation.participantsList
                          .filter((p) => p.type === "Enfant")
                          .map((p, index) => (
                            <div key={`enfant-${index}`} className="participant-item">
                              {getParticipantIcon(p.type)}
                              <strong>Enfant:</strong> {p.prenom} {p.nom} ({p.age} ans)
                              <span className="participant-group">Groupe: {p.groupe}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
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
                      <label className="form-label">Groupe</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.groupe}
                        onChange={(e) => setEditForm({ ...editForm, groupe: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
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

      {/* Modal Gestion des Groupes par Participant */}
      {showGroupModal && selectedReservation && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Users className="me-2" size={20} />
                  Gestion des Groupes par Participant - {selectedReservation.user}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowGroupModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <strong>Affectation aux groupes</strong>
                  <br />
                  Sélectionnez le groupe approprié pour chaque participant selon son type.
                </div>

                {selectedReservation.participantsList && (
                  <div className="participants-group-assignment">
                    {/* Collaborateurs/Retraités */}
                    <div className="participant-category mb-4">
                      <h6 className="category-title">
                        <User size={16} className="me-2" />
                        Collaborateurs / Retraités
                      </h6>
                      {selectedReservation.participantsList
                        .filter((p) => p.type === "Collaborateur" || p.type === "Collaboratrice" || p.type === "Retraité" || p.type === "Retraitée")
                        .map((participant, index) => (
                          <div key={`adult-${index}`} className="participant-assignment-card">
                            <div className="participant-info">
                              <div className="participant-name">
                                {getParticipantIcon(participant.type)}
                                {participant.prenom} {participant.nom}
                              </div>
                              <div className="participant-type">{participant.type}</div>
                            </div>
                            <div className="group-selection">
                              <label className="form-label">Groupe assigné:</label>
                              <select
                                className="form-select"
                                value={participantGroups[`${participant.type}-${index}`] || participant.groupe}
                                onChange={(e) => setParticipantGroups({
                                  ...participantGroups,
                                  [`${participant.type}-${index}`]: e.target.value
                                })}
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
                      <div className="participant-category mb-4">
                        <h6 className="category-title">
                          <Heart size={16} className="me-2" />
                          Conjoints
                        </h6>
                        {selectedReservation.participantsList
                          .filter((p) => p.type === "Conjoint")
                          .map((participant, index) => (
                            <div key={`spouse-${index}`} className="participant-assignment-card">
                              <div className="participant-info">
                                <div className="participant-name">
                                  {getParticipantIcon(participant.type)}
                                  {participant.prenom} {participant.nom}
                                </div>
                                <div className="participant-type">{participant.type}</div>
                              </div>
                              <div className="group-selection">
                                <label className="form-label">Groupe assigné:</label>
                                <select
                                  className="form-select"
                                  value={participantGroups[`${participant.type}-${index}`] || participant.groupe}
                                  onChange={(e) => setParticipantGroups({
                                    ...participantGroups,
                                    [`${participant.type}-${index}`]: e.target.value
                                  })}
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
                      <div className="participant-category mb-4">
                        <h6 className="category-title">
                          <Baby size={16} className="me-2" />
                          Enfants
                        </h6>
                        {selectedReservation.participantsList
                          .filter((p) => p.type === "Enfant")
                          .map((participant, index) => (
                            <div key={`child-${index}`} className="participant-assignment-card">
                              <div className="participant-info">
                                <div className="participant-name">
                                  {getParticipantIcon(participant.type)}
                                  {participant.prenom} {participant.nom}
                                </div>
                                <div className="participant-type">{participant.type} ({participant.age} ans)</div>
                              </div>
                              <div className="group-selection">
                                <label className="form-label">Groupe assigné:</label>
                                <select
                                  className="form-select"
                                  value={participantGroups[`${participant.type}-${index}`] || participant.groupe}
                                  onChange={(e) => setParticipantGroups({
                                    ...participantGroups,
                                    [`${participant.type}-${index}`]: e.target.value
                                  })}
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

                <div className="alert alert-warning mt-3">
                  <strong>Note:</strong> Les adultes (collaborateurs/retraités/conjoints) sont affectés aux groupes adultes, 
                  tandis que les enfants sont affectés aux groupes enfants ou mixtes selon leur âge.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowGroupModal(false)}>
                  Annuler
                </button>
                <button type="button" className="btn btn-primary" onClick={handleGroupAssignment}>
                  Sauvegarder les affectations
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
                  Nouvelle Réservation Piscine
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
                                  <strong>Enfants 6-18 ans (max. 5)</strong>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
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
                    <p className="text-muted">Veuillez remplir les informations requises</p>

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
                                <div className="col-md-4">
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
                                <div className="col-md-4">
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
                                <div className="col-md-4">
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
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {addChildren && userType === "collaborateur" && (
                      <div className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">Enfants (6-18 ans)</h6>
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
                                <div className="col-md-3">
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
                                <div className="col-md-3">
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
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <label className="form-label">Date de naissance *</label>
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
                                <div className="col-md-3">
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
                              </div>
                              {child.nom &&
                                child.prenom &&
                                child.dateNaissance &&
                                !isAgeBetween6And18(child.dateNaissance) && (
                                  <div className="alert alert-warning">
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

                {step === 2 && (
                  <div>
                    <h6>Étape 3/3 - Récapitulatif</h6>
                    <p className="text-muted">Vérifiez les informations avant de soumettre</p>

                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Réservation Piscine</h6>
                      </div>
                      <div className="card-body">
                        {reserveForSelf && (
                          <div className="d-flex align-items-center mb-2">
                            <User size={16} className="me-2" />
                            <span>
                              <strong>{userType === "retraite" ? "Retraité" : "Collaborateur"}:</strong> {selfInfo.prenom} {selfInfo.nom} (CNE: {selfInfo.cne})
                            </span>
                          </div>
                        )}
                        {addSpouses &&
                          spouses
                            .filter((s) => s.nom.trim() && s.prenom.trim())
                            .map((spouse, index) => (
                              <div key={index} className="d-flex align-items-center mb-2">
                                <Heart size={16} className="me-2" />
                                <span>
                                  <strong>Conjoint:</strong> {spouse.prenom} {spouse.nom} (CNE: {spouse.cne})
                                </span>
                              </div>
                            ))}
                        {addChildren &&
                          userType === "collaborateur" &&
                          children
                            .filter((c) => c.nom.trim() && c.prenom.trim())
                            .map((child, index) => (
                              <div key={index} className="d-flex align-items-center mb-2">
                                <Baby size={16} className="me-2" />
                                <span>
                                  <strong>Enfant:</strong> {child.prenom} {child.nom} ({child.sexe === "M" ? "Garçon" : "Fille"},{" "}
                                  {child.dateNaissance})
                                </span>
                              </div>
                            ))}
                      </div>
                    </div>

                    <div className="alert alert-info mt-3">
                      Cette demande sera soumise à validation administrative. L'affectation aux groupes sera effectuée 
                      selon le type de participant : adultes dans les groupes adultes, enfants dans les groupes enfants.
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
                        ? !(reserveForSelf || addSpouses || addChildren)
                        : step === 1
                          ? !selfInfo.nom || !selfInfo.prenom || !selfInfo.cne || !selfInfo.matricule || !selfInfo.email
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
        .reservations-piscine-page {
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
          color: #3498db;
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

        .stat-icon-mini.piscine {
          background: linear-gradient(135deg, #3498db, #2980b9);
        }
        .stat-icon-mini.success {
          background: linear-gradient(135deg, #27ae60, #229954);
        }
        .stat-icon-mini.warning {
          background: linear-gradient(135deg, #f39c12, #e67e22);
        }
        .stat-icon-mini.users {
          background: linear-gradient(135deg, #9b59b6, #8e44ad);
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
          border-color: #3498db;
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
          background: linear-gradient(135deg, #3498db, #2980b9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
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
          background: #e8f4fd;
          color: #3498db;
          font-weight: 600;
          font-size: 13px;
          width: fit-content;
          margin: 0 auto;
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

        .comment-cell {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          color: #7f8c8d;
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

        .action-btn-enhanced.group {
          background: #f4e8fd;
          color: #8e44ad;
        }

        .action-btn-enhanced.group:hover {
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
          background: #3498db;
          color: white;
          border-radius: 6px;
          font-weight: 600;
        }

        .participant-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .participant-group {
          margin-left: auto;
          font-size: 12px;
          color: #6c757d;
          background: #e9ecef;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .participants-group-assignment {
          max-height: 500px;
          overflow-y: auto;
        }

        .participant-category {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 15px;
          background: #f8f9fa;
        }

        .category-title {
          display: flex;
          align-items: center;
          color: #495057;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .participant-assignment-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .participant-info {
          flex: 1;
        }

        .participant-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #495057;
          margin-bottom: 4px;
        }

        .participant-type {
          font-size: 12px;
          color: #6c757d;
        }

        .group-selection {
          flex: 1;
          margin-left: 20px;
        }

        .group-selection .form-label {
          font-size: 12px;
          margin-bottom: 4px;
        }

        .group-selection .form-select {
          font-size: 13px;
        }
      `}</style>
    </div>
  )
}
