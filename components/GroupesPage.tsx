"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  Waves,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Save,
  MapPin,
} from "lucide-react"

interface Groupe {
  code: string
  horaires: string
  participantsCount: number
  capacite: number
  isBlocked: boolean
  bassin: string
  type: string
}

const groupesData: Groupe[] = [
  {
    code: "A1-1",
    horaires: "Lundi 14:00-16:00, Mercredi 08:00-10:00",
    participantsCount: 12,
    capacite: 15,
    isBlocked: false,
    bassin: "Grand Bassin",
    type: "Adultes",
  },
  {
    code: "A1-2",
    horaires: "Mardi 10:00-12:00, Jeudi 14:00-16:00",
    participantsCount: 8,
    capacite: 10,
    isBlocked: true,
    bassin: "Petit Bassin",
    type: "Enfants",
  },
  {
    code: "A1-3",
    horaires: "Vendredi 08:00-10:00, Samedi 16:00-18:00",
    participantsCount: 10,
    capacite: 15,
    isBlocked: false,
    bassin: "Grand Bassin",
    type: "Adultes",
  },
  {
    code: "A2-1",
    horaires: "Lundi 16:00-18:00, Mercredi 10:00-12:00",
    participantsCount: 14,
    capacite: 15,
    isBlocked: false,
    bassin: "Grand Bassin",
    type: "Retraités",
  },
  {
    code: "A2-2",
    horaires: "Mardi 14:00-16:00, Jeudi 16:00-18:00",
    participantsCount: 6,
    capacite: 10,
    isBlocked: false,
    bassin: "Petit Bassin",
    type: "Mixte",
  },
  {
    code: "B1-1",
    horaires: "Vendredi 10:00-12:00",
    participantsCount: 3,
    capacite: 12,
    isBlocked: false,
    bassin: "Petit Bassin",
    type: "Enfants",
  },
]

const getStatusBadge = (isBlocked: boolean) => {
  const config = isBlocked
    ? {
        icon: XCircle,
        label: "Bloqué",
        className: "status-danger",
      }
    : {
        icon: CheckCircle,
        label: "Ouvert",
        className: "status-success",
      }

  const Icon = config.icon
  return (
    <span className={`status-badge ${config.className}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  )
}

const getOccupationBadge = (participants: number, capacite: number) => {
  const percent = Math.round((participants / capacite) * 100)
  let className = "occupation-low"
  if (percent >= 90) {
    className = "occupation-high"
  } else if (percent >= 70) {
    className = "occupation-medium"
  }

  return (
    <span className={`occupation-badge ${className}`}>
      <Users size={12} />
      <span>{percent}%</span>
    </span>
  )
}

export function GroupesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedGroupe, setSelectedGroupe] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showNewGroupeModal, setShowNewGroupeModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // État pour le formulaire de nouveau groupe
  const [newGroupe, setNewGroupe] = useState({
    code: "",
    type: "",
    bassin: "",
    capacite: "",
    horaires: "",
    isBlocked: false,
    description: "",
  })

  // État pour le formulaire d'édition
  const [editForm, setEditForm] = useState({
    code: "",
    type: "",
    bassin: "",
    capacite: "",
    horaires: "",
    isBlocked: false,
    description: "",
  })

  const filteredGroupes = groupesData.filter((groupe) => {
    const matchesSearch =
      groupe.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      groupe.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      groupe.bassin.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && !groupe.isBlocked) ||
      (statusFilter === "blocked" && groupe.isBlocked)
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "adultes" && groupe.type === "Adultes") ||
      (typeFilter === "enfants" && groupe.type === "Enfants") ||
      (typeFilter === "retraites" && groupe.type === "Retraités") ||
      (typeFilter === "mixte" && groupe.type === "Mixte")
    return matchesSearch && matchesStatus && matchesType
  })

  // Pagination
  const totalPages = Math.ceil(filteredGroupes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentGroupes = filteredGroupes.slice(startIndex, endIndex)

  const clearAdvancedFilters = () => {
    setTypeFilter("all")
    setShowAdvancedFilters(false)
  }

  const handleSubmitNewGroupe = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newGroupe.code || !newGroupe.type || !newGroupe.bassin || !newGroupe.capacite) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const codeExists = groupesData.some((g) => g.code === newGroupe.code)
    if (codeExists) {
      alert("Ce code de groupe existe déjà")
      return
    }

    console.log("Nouveau groupe créé:", newGroupe)
    alert("Groupe créé avec succès !")

    setNewGroupe({
      code: "",
      type: "",
      bassin: "",
      capacite: "",
      horaires: "",
      isBlocked: false,
      description: "",
    })

    setShowNewGroupeModal(false)
  }

  const handleDeleteGroupe = (code: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      console.log("Suppression du groupe:", code)
      alert("Groupe supprimé avec succès")
    }
  }

  const openEditModal = (groupe: any) => {
    setSelectedGroupe(groupe)
    setEditForm({
      code: groupe.code,
      type: groupe.type,
      bassin: groupe.bassin,
      capacite: groupe.capacite.toString(),
      horaires: groupe.horaires,
      isBlocked: groupe.isBlocked,
      description: "",
    })
    setShowEditModal(true)
  }

  const handleEditGroupe = () => {
    if (selectedGroupe) {
      console.log("Modification groupe:", editForm)
      alert(`Groupe ${editForm.code} modifié avec succès`)
      setShowEditModal(false)
    }
  }

  const totalGroupes = groupesData.length
  const openGroupes = groupesData.filter((g) => !g.isBlocked).length
  const totalParticipants = groupesData.reduce((sum, g) => sum + g.participantsCount, 0)
  const totalCapacite = groupesData.reduce((sum, g) => sum + g.capacite, 0)

  return (
    <div className="groupes-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <Waves size={28} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Groupes Piscine</h1>
              <p className="page-subtitle">
                Gestion des groupes et horaires de natation • {filteredGroupes.length} groupes
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-header btn-secondary">
              <Download size={18} />
              <span>Exporter</span>
            </button>
            <button className="btn-header btn-primary" onClick={() => setShowNewGroupeModal(true)}>
              <Plus size={18} />
              <span>Nouveau Groupe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Waves size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalGroupes}</div>
            <div className="stat-label">Total Groupes</div>
          </div>
          <div className="stat-trend">+8%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{openGroupes}</div>
            <div className="stat-label">Ouverts</div>
          </div>
          <div className="stat-trend">+12%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalParticipants}</div>
            <div className="stat-label">Participants</div>
          </div>
          <div className="stat-trend">+15%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{Math.round((totalParticipants / totalCapacite) * 100)}%</div>
            <div className="stat-label">Occupation</div>
          </div>
          <div className="stat-trend">+5%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="search-wrapper">
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par code, type ou bassin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="filters-controls">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">Tous les statuts</option>
            <option value="open">Ouverts</option>
            <option value="blocked">Bloqués</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
            <option value="all">Tous les types</option>
            <option value="adultes">Adultes</option>
            <option value="enfants">Enfants</option>
            <option value="retraites">Retraités</option>
            <option value="mixte">Mixte</option>
          </select>
          <button className="btn-filter" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Filter size={16} />
            <span>Filtres avancés</span>
            <ChevronDown size={16} className={`chevron ${showAdvancedFilters ? "rotated" : ""}`} />
          </button>
          {typeFilter !== "all" && (
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
              <label className="filter-label">Bassin</label>
              <select className="filter-input">
                <option value="">Tous les bassins</option>
                <option value="grand">Grand Bassin</option>
                <option value="petit">Petit Bassin</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Occupation</label>
              <select className="filter-input">
                <option value="">Toutes les occupations</option>
                <option value="low">Moins de 70%</option>
                <option value="medium">70-90%</option>
                <option value="high">Plus de 90%</option>
              </select>
            </div>
            <div className="filter-results">
              <span className="results-text">{filteredGroupes.length} résultat(s) trouvé(s)</span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Liste des Groupes Piscine</h3>
        </div>
        <div className="table-wrapper">
          <table className="groupes-table">
            <thead>
              <tr>
                <th>Code Groupe</th>
                <th>Type & Bassin</th>
                <th>Horaires</th>
                <th>Participants</th>
                <th>Occupation</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentGroupes.map((groupe) => (
                <tr key={groupe.code} className="table-row">
                  <td>
                    <div className="code-cell">
                      <span className="code-badge">{groupe.code}</span>
                    </div>
                  </td>
                  <td>
                    <div className="type-cell">
                      <div className="type-primary">{groupe.type}</div>
                      <div className="type-secondary">
                        <MapPin size={12} />
                        <span>{groupe.bassin}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="horaires-cell">
                      <Clock size={14} />
                      <span>{groupe.horaires}</span>
                    </div>
                  </td>
                  <td>
                    <div className="participants-badge">
                      <Users size={14} />
                      <span>
                        {groupe.participantsCount}/{groupe.capacite}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="occupation-cell">
                      {getOccupationBadge(groupe.participantsCount, groupe.capacite)}
                    </div>
                  </td>
                  <td>{getStatusBadge(groupe.isBlocked)}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="action-btn action-view"
                        onClick={() => {
                          setSelectedGroupe(groupe)
                          setShowDetailsModal(true)
                        }}
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="action-btn action-edit" onClick={() => openEditModal(groupe)} title="Éditer">
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn action-delete"
                        onClick={() => handleDeleteGroupe(groupe.code)}
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
          Affichage de {startIndex + 1} à {Math.min(endIndex, filteredGroupes.length)} sur {filteredGroupes.length}{" "}
          groupes
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
      {showDetailsModal && selectedGroupe && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Waves size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Détails du Groupe</h3>
                  <p className="modal-subtitle">{selectedGroupe.code}</p>
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
                      <span className="info-label">Code</span>
                      <span className="info-value">{selectedGroupe.code}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Type</span>
                      <span className="info-value">{selectedGroupe.type}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Bassin</span>
                      <span className="info-value">{selectedGroupe.bassin}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Capacité</span>
                      <span className="info-value">{selectedGroupe.capacite} personnes</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Participants</span>
                      <span className="info-value">{selectedGroupe.participantsCount}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Statut</span>
                      <span className="info-value">{getStatusBadge(selectedGroupe.isBlocked)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Horaires</span>
                      <span className="info-value">{selectedGroupe.horaires}</span>
                    </div>
                  </div>
                </div>
                <div className="details-section">
                  <h4 className="section-title">Statistiques</h4>
                  <div className="stats-summary">
                    <div className="stat-item">
                      <span className="stat-label">Taux d'occupation</span>
                      <span className="stat-value">
                        {Math.round((selectedGroupe.participantsCount / selectedGroupe.capacite) * 100)}%
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Places disponibles</span>
                      <span className="stat-value">{selectedGroupe.capacite - selectedGroupe.participantsCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Séances par semaine</span>
                      <span className="stat-value">{selectedGroupe.horaires.split(",").length} séance(s)</span>
                    </div>
                  </div>
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

      {/* Modal Nouveau Groupe */}
      {showNewGroupeModal && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Nouveau Groupe</h3>
                  <p className="modal-subtitle">Créer un nouveau groupe de natation</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowNewGroupeModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitNewGroupe}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Code du groupe *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: A1-4"
                      value={newGroupe.code}
                      onChange={(e) => setNewGroupe({ ...newGroupe, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capacité *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ex: 15"
                      value={newGroupe.capacite}
                      onChange={(e) => setNewGroupe({ ...newGroupe, capacite: e.target.value })}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type de groupe *</label>
                    <select
                      className="form-select"
                      value={newGroupe.type}
                      onChange={(e) => setNewGroupe({ ...newGroupe, type: e.target.value })}
                      required
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Adultes">Adultes</option>
                      <option value="Enfants">Enfants</option>
                      <option value="Retraités">Retraités</option>
                      <option value="Mixte">Mixte</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bassin *</label>
                    <select
                      className="form-select"
                      value={newGroupe.bassin}
                      onChange={(e) => setNewGroupe({ ...newGroupe, bassin: e.target.value })}
                      required
                    >
                      <option value="">Sélectionner un bassin</option>
                      <option value="Grand Bassin">Grand Bassin</option>
                      <option value="Petit Bassin">Petit Bassin</option>
                    </select>
                  </div>
                  <div className="form-group form-group-full">
                    <label className="form-label">Horaires *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Lundi 14:00-16:00, Mercredi 08:00-10:00"
                      value={newGroupe.horaires}
                      onChange={(e) => setNewGroupe({ ...newGroupe, horaires: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="Description du groupe..."
                      value={newGroupe.description}
                      onChange={(e) => setNewGroupe({ ...newGroupe, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="form-group form-group-full">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={newGroupe.isBlocked}
                        onChange={(e) => setNewGroupe({ ...newGroupe, isBlocked: e.target.checked })}
                      />
                      <label className="form-check-label">Groupe bloqué</label>
                    </div>
                  </div>
                </div>
                <div className="alert-info">
                  <strong>Information :</strong> Une fois créé, le groupe sera disponible pour les inscriptions selon
                  son statut.
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-modal btn-secondary" onClick={() => setShowNewGroupeModal(false)}>
                Annuler
              </button>
              <button type="submit" className="btn-modal btn-primary" onClick={handleSubmitNewGroupe}>
                <Save size={16} />
                Créer le groupe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition */}
      {showEditModal && selectedGroupe && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Edit size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Modifier le Groupe</h3>
                  <p className="modal-subtitle">{selectedGroupe.code}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Code du groupe *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacité *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.capacite}
                    onChange={(e) => setEditForm({ ...editForm, capacite: e.target.value })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Type de groupe *</label>
                  <select
                    className="form-select"
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  >
                    <option value="Adultes">Adultes</option>
                    <option value="Enfants">Enfants</option>
                    <option value="Retraités">Retraités</option>
                    <option value="Mixte">Mixte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Bassin *</label>
                  <select
                    className="form-select"
                    value={editForm.bassin}
                    onChange={(e) => setEditForm({ ...editForm, bassin: e.target.value })}
                  >
                    <option value="Grand Bassin">Grand Bassin</option>
                    <option value="Petit Bassin">Petit Bassin</option>
                  </select>
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Horaires *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.horaires}
                    onChange={(e) => setEditForm({ ...editForm, horaires: e.target.value })}
                  />
                </div>
                <div className="form-group form-group-full">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={editForm.isBlocked}
                      onChange={(e) => setEditForm({ ...editForm, isBlocked: e.target.checked })}
                    />
                    <label className="form-check-label">Groupe bloqué</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal btn-secondary" onClick={() => setShowEditModal(false)}>
                Annuler
              </button>
              <button className="btn-modal btn-primary" onClick={handleEditGroupe}>
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles CSS identiques aux autres pages */}
      <style jsx>{`
        .groupes-container {
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

        .table-wrapper {
          overflow-x: auto;
        }

        .groupes-table {
          width: 100%;
          border-collapse: collapse;
        }

        .groupes-table th {
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #374151;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .groupes-table td {
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

        .code-cell {
          text-align: center;
        }

        .code-badge {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          color: #16a34a;
          padding: 6px 12px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 12px;
        }

        .type-cell {
          text-align: left;
        }

        .type-primary {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .type-secondary {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
        }

        .horaires-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #374151;
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

        .occupation-cell {
          text-align: center;
        }

        .occupation-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
          margin: 0 auto;
        }

        .occupation-low {
          background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
          color: #22543d;
        }

        .occupation-medium {
          background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%);
          color: #c05621;
        }

        .occupation-high {
          background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
          color: #c53030;
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

        .status-danger {
          background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
          color: #991b1b;
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

        .stats-summary {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-label {
          font-weight: 500;
          color: #4a5568;
          font-size: 14px;
        }

        .stat-value {
          font-weight: 600;
          color: #16a34a;
          font-size: 14px;
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
          display: flex;
          align-items: center;
          gap: 8px;
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

        .form-check {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-check-input {
          width: 18px;
          height: 18px;
          accent-color: #16a34a;
        }

        .form-check-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        /* Alerts */
        .alert-info {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 12px;
          margin-top: 20px;
          color: #0369a1;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .groupes-container {
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

          .groupes-table {
            min-width: 800px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
