"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  FileText,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Save,
} from "lucide-react"

interface Discipline {
  code: string
  nom: string
  participantsCount: number
  paidCount: number
  isActive: boolean
  price: number
}

const disciplinesData: Discipline[] = [
  { code: "C001-1", nom: "Adultes Musculation", participantsCount: 25, paidCount: 20, isActive: true, price: 80 },
  { code: "C001-2", nom: "Enfants Musculation", participantsCount: 15, paidCount: 12, isActive: true, price: 50 },
  { code: "C058-1", nom: "Adultes Gym", participantsCount: 30, paidCount: 25, isActive: true, price: 100 },
  { code: "C058-2", nom: "Enfants Gym", participantsCount: 18, paidCount: 10, isActive: false, price: 60 },
  { code: "C058-3", nom: "Adultes Gym & Swim", participantsCount: 12, paidCount: 12, isActive: true, price: 150 },
  { code: "C058-4", nom: "Enfants Gym & Swim", participantsCount: 8, paidCount: 6, isActive: true, price: 90 },
  { code: "C025-1", nom: "Adultes Fitness", participantsCount: 22, paidCount: 18, isActive: true, price: 120 },
  { code: "C025-2", nom: "Enfants Fitness", participantsCount: 10, paidCount: 8, isActive: false, price: 70 },
]

const getStatusBadge = (isActive: boolean) => {
  const config = isActive
    ? {
        icon: CheckCircle,
        label: "Actif",
        className: "status-success",
      }
    : {
        icon: XCircle,
        label: "Inactif",
        className: "status-danger",
      }

  const Icon = config.icon
  return (
    <span className={`status-badge ${config.className}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  )
}

const getPaymentBadge = (paid: number, total: number) => {
  const percent = Math.round((paid / total) * 100)
  let className = "payment-danger"
  if (percent === 100) {
    className = "payment-success"
  } else if (percent >= 50) {
    className = "payment-warning"
  }

  return (
    <span className={`payment-badge ${className}`}>
      <DollarSign size={12} />
      <span>
        {percent}% ({paid}/{total})
      </span>
    </span>
  )
}

export function DisciplinesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedDiscipline, setSelectedDiscipline] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showNewDisciplineModal, setShowNewDisciplineModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // État pour le formulaire de nouvelle discipline
  const [newDiscipline, setNewDiscipline] = useState({
    code: "",
    nom: "",
    price: "",
    isActive: true,
    description: "",
    capaciteMax: "",
    ageMin: "",
    ageMax: "",
    dureeSeance: "",
    frequenceHebdo: "",
  })

  // État pour le formulaire d'édition
  const [editForm, setEditForm] = useState({
    code: "",
    nom: "",
    price: "",
    isActive: true,
    description: "",
    capaciteMax: "",
    ageMin: "",
    ageMax: "",
    dureeSeance: "",
    frequenceHebdo: "",
  })

  const filteredDisciplines = disciplinesData.filter((discipline) => {
    const matchesSearch =
      discipline.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discipline.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && discipline.isActive) ||
      (statusFilter === "inactive" && !discipline.isActive)
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && discipline.price < 80) ||
      (priceFilter === "medium" && discipline.price >= 80 && discipline.price < 120) ||
      (priceFilter === "high" && discipline.price >= 120)
    return matchesSearch && matchesStatus && matchesPrice
  })

  // Pagination
  const totalPages = Math.ceil(filteredDisciplines.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDisciplines = filteredDisciplines.slice(startIndex, endIndex)

  const clearAdvancedFilters = () => {
    setPriceFilter("all")
    setShowAdvancedFilters(false)
  }

  const handleSubmitNewDiscipline = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newDiscipline.code || !newDiscipline.nom || !newDiscipline.price) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const codeExists = disciplinesData.some((d) => d.code === newDiscipline.code)
    if (codeExists) {
      alert("Ce code de discipline existe déjà")
      return
    }

    console.log("Nouvelle discipline créée:", newDiscipline)
    alert("Discipline créée avec succès !")

    setNewDiscipline({
      code: "",
      nom: "",
      price: "",
      isActive: true,
      description: "",
      capaciteMax: "",
      ageMin: "",
      ageMax: "",
      dureeSeance: "",
      frequenceHebdo: "",
    })

    setShowNewDisciplineModal(false)
  }

  const handleDeleteDiscipline = (code: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette discipline ?")) {
      console.log("Suppression de la discipline:", code)
      alert("Discipline supprimée avec succès")
    }
  }

  const openEditModal = (discipline: any) => {
    setSelectedDiscipline(discipline)
    setEditForm({
      code: discipline.code,
      nom: discipline.nom,
      price: discipline.price.toString(),
      isActive: discipline.isActive,
      description: "",
      capaciteMax: "",
      ageMin: "",
      ageMax: "",
      dureeSeance: "",
      frequenceHebdo: "",
    })
    setShowEditModal(true)
  }

  const handleEditDiscipline = () => {
    if (selectedDiscipline) {
      console.log("Modification discipline:", editForm)
      alert(`Discipline ${editForm.nom} modifiée avec succès`)
      setShowEditModal(false)
    }
  }

  const totalParticipants = disciplinesData.reduce((sum, d) => sum + d.participantsCount, 0)
  const totalPaid = disciplinesData.reduce((sum, d) => sum + d.paidCount, 0)
  const activeDisciplines = disciplinesData.filter((d) => d.isActive).length
  const totalRevenue = disciplinesData.reduce((sum, d) => sum + d.paidCount * d.price, 0)

  return (
    <div className="disciplines-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <FileText size={28} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Codes de Discipline</h1>
              <p className="page-subtitle">
                Gestion des disciplines sportives et tarification • {filteredDisciplines.length} disciplines
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-header btn-secondary">
              <Download size={18} />
              <span>Exporter</span>
            </button>
            <button className="btn-header btn-primary" onClick={() => setShowNewDisciplineModal(true)}>
              <Plus size={18} />
              <span>Nouvelle Discipline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{disciplinesData.length}</div>
            <div className="stat-label">Total Disciplines</div>
          </div>
          <div className="stat-trend">+12%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{activeDisciplines}</div>
            <div className="stat-label">Actives</div>
          </div>
          <div className="stat-trend">+5%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalParticipants}</div>
            <div className="stat-label">Participants</div>
          </div>
          <div className="stat-trend">+8%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalRevenue} DH</div>
            <div className="stat-label">Revenus</div>
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
              placeholder="Rechercher par code ou nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="filters-controls">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>
          <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="filter-select">
            <option value="all">Tous les prix</option>
            <option value="low">Moins de 80 DH</option>
            <option value="medium">80-120 DH</option>
            <option value="high">Plus de 120 DH</option>
          </select>
          <button className="btn-filter" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Filter size={16} />
            <span>Filtres avancés</span>
            <ChevronDown size={16} className={`chevron ${showAdvancedFilters ? "rotated" : ""}`} />
          </button>
          {priceFilter !== "all" && (
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
              <label className="filter-label">Catégorie</label>
              <select className="filter-input">
                <option value="">Toutes les catégories</option>
                <option value="musculation">Musculation</option>
                <option value="gym">Gym</option>
                <option value="fitness">Fitness</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Tranche d'âge</label>
              <select className="filter-input">
                <option value="">Tous les âges</option>
                <option value="adultes">Adultes</option>
                <option value="enfants">Enfants</option>
              </select>
            </div>
            <div className="filter-results">
              <span className="results-text">{filteredDisciplines.length} résultat(s) trouvé(s)</span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Liste des Disciplines</h3>
        </div>
        <div className="table-wrapper">
          <table className="disciplines-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom de la Discipline</th>
                <th>Prix</th>
                <th>Participants</th>
                <th>% Paiement</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDisciplines.map((discipline) => (
                <tr key={discipline.code} className="table-row">
                  <td>
                    <div className="code-cell">
                      <span className="code-badge">{discipline.code}</span>
                    </div>
                  </td>
                  <td>
                    <div className="name-cell">
                      <div className="discipline-name">{discipline.nom}</div>
                    </div>
                  </td>
                  <td>
                    <div className="price-cell">
                      <span className="price-value">{discipline.price} DH</span>
                    </div>
                  </td>
                  <td>
                    <div className="participants-badge">
                      <Users size={14} />
                      <span>{discipline.participantsCount}</span>
                    </div>
                  </td>
                  <td>
                    <div className="payment-cell">
                      {getPaymentBadge(discipline.paidCount, discipline.participantsCount)}
                    </div>
                  </td>
                  <td>{getStatusBadge(discipline.isActive)}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="action-btn action-view"
                        onClick={() => {
                          setSelectedDiscipline(discipline)
                          setShowDetailsModal(true)
                        }}
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn action-edit"
                        onClick={() => openEditModal(discipline)}
                        title="Éditer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn action-delete"
                        onClick={() => handleDeleteDiscipline(discipline.code)}
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
          Affichage de {startIndex + 1} à {Math.min(endIndex, filteredDisciplines.length)} sur{" "}
          {filteredDisciplines.length} disciplines
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
      {showDetailsModal && selectedDiscipline && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Détails de la Discipline</h3>
                  <p className="modal-subtitle">{selectedDiscipline.nom}</p>
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
                      <span className="info-value">{selectedDiscipline.code}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Nom</span>
                      <span className="info-value">{selectedDiscipline.nom}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Prix</span>
                      <span className="info-value">{selectedDiscipline.price} DH</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Statut</span>
                      <span className="info-value">{getStatusBadge(selectedDiscipline.isActive)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Participants</span>
                      <span className="info-value">{selectedDiscipline.participantsCount}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Participants payés</span>
                      <span className="info-value">{selectedDiscipline.paidCount}</span>
                    </div>
                  </div>
                </div>
                <div className="details-section">
                  <h4 className="section-title">Statistiques</h4>
                  <div className="stats-summary">
                    <div className="stat-item">
                      <span className="stat-label">Taux de paiement</span>
                      <span className="stat-value">
                        {Math.round((selectedDiscipline.paidCount / selectedDiscipline.participantsCount) * 100)}%
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Revenus générés</span>
                      <span className="stat-value">{selectedDiscipline.paidCount * selectedDiscipline.price} DH</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Revenus potentiels</span>
                      <span className="stat-value">
                        {selectedDiscipline.participantsCount * selectedDiscipline.price} DH
                      </span>
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

      {/* Modal Nouvelle Discipline */}
      {showNewDisciplineModal && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Nouvelle Discipline</h3>
                  <p className="modal-subtitle">Créer un nouveau code de discipline</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowNewDisciplineModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitNewDiscipline}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Code de discipline *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: C001-3"
                      value={newDiscipline.code}
                      onChange={(e) => setNewDiscipline({ ...newDiscipline, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prix (DH) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ex: 100"
                      value={newDiscipline.price}
                      onChange={(e) => setNewDiscipline({ ...newDiscipline, price: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <label className="form-label">Nom de la discipline *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Adultes Natation"
                      value={newDiscipline.nom}
                      onChange={(e) => setNewDiscipline({ ...newDiscipline, nom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="Description détaillée de la discipline..."
                      value={newDiscipline.description}
                      onChange={(e) => setNewDiscipline({ ...newDiscipline, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capacité maximale</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ex: 30"
                      value={newDiscipline.capaciteMax}
                      onChange={(e) => setNewDiscipline({ ...newDiscipline, capaciteMax: e.target.value })}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Âge minimum</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ex: 18"
                      value={newDiscipline.ageMin}
                      onChange={(e) => setNewDiscipline({ ...newDiscipline, ageMin: e.target.value })}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Âge maximum</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ex: 65"
                      value={newDiscipline.ageMax}
                      onChange={(e) => setNewDiscipline({ ...newDiscipline, ageMax: e.target.value })}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Durée séance (minutes)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ex: 60"
                      value={newDiscipline.dureeSeance}
                      onChange={(e) => setNewDiscipline({ ...newDiscipline, dureeSeance: e.target.value })}
                      min="15"
                      step="15"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fréquence hebdomadaire</label>
                    <select
                      className="form-select"
                      value={newDiscipline.frequenceHebdo}
                      onChange={(e) => setNewDiscipline({ ...newDiscipline, frequenceHebdo: e.target.value })}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="1">1 fois par semaine</option>
                      <option value="2">2 fois par semaine</option>
                      <option value="3">3 fois par semaine</option>
                      <option value="4">4 fois par semaine</option>
                      <option value="5">5 fois par semaine</option>
                      <option value="libre">Accès libre</option>
                    </select>
                  </div>
                  <div className="form-group form-group-full">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={newDiscipline.isActive}
                        onChange={(e) => setNewDiscipline({ ...newDiscipline, isActive: e.target.checked })}
                      />
                      <label className="form-check-label">Discipline active</label>
                    </div>
                  </div>
                </div>
                <div className="alert-info">
                  <strong>Information :</strong> Une fois créée, la discipline sera disponible pour les inscriptions
                  selon son statut.
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-modal btn-secondary"
                onClick={() => setShowNewDisciplineModal(false)}
              >
                Annuler
              </button>
              <button type="submit" className="btn-modal btn-primary" onClick={handleSubmitNewDiscipline}>
                <Save size={16} />
                Créer la discipline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition */}
      {showEditModal && selectedDiscipline && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  <Edit size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Modifier la Discipline</h3>
                  <p className="modal-subtitle">{selectedDiscipline.nom}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Code de discipline *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prix (DH) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Nom de la discipline *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.nom}
                    onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                  />
                </div>
                <div className="form-group form-group-full">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={editForm.isActive}
                      onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    />
                    <label className="form-check-label">Discipline active</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal btn-secondary" onClick={() => setShowEditModal(false)}>
                Annuler
              </button>
              <button className="btn-modal btn-primary" onClick={handleEditDiscipline}>
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles CSS identiques à la page sport */}
      <style jsx>{`
        .disciplines-container {
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

        .disciplines-table {
          width: 100%;
          border-collapse: collapse;
        }

        .disciplines-table th {
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #374151;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .disciplines-table td {
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

        .name-cell {
          text-align: left;
        }

        .discipline-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .price-cell {
          text-align: center;
        }

        .price-value {
          font-weight: 700;
          color: #16a34a;
          font-size: 14px;
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
          margin: 0 auto;
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
          .disciplines-container {
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

          .disciplines-table {
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
