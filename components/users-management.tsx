"use client"
import { useState } from "react"
import { Search, Filter, Download, Plus, Eye, Edit, Trash2, Users, Mail, Phone, Shield, Crown, Settings, BookOpen, Save, X } from 'lucide-react'

const usersData = [
  {
    id: "U001",
    nom: "Ahmed Benali",
    prenom: "Ahmed",
    matricule: "12345A",
    email: "ahmed.benali@ocp.ma",
    telephone: "+212 6 12 34 56 78",
    dateInscription: "2023-01-15",
    role: "gestionnaire",
    derniereConnexion: "2024-01-14",
  },
  {
    id: "U002",
    nom: "Fatima Zahra",
    prenom: "Fatima",
    matricule: "67890B",
    email: "fatima.zahra@ocp.ma",
    telephone: "+212 6 23 45 67 89",
    dateInscription: "2023-02-20",
    role: "admin",
    derniereConnexion: "2024-01-15",
  },
  {
    id: "U003",
    nom: "Mohamed Alami",
    prenom: "Mohamed",
    matricule: "54321C",
    email: "mohamed.alami@ocp.ma",
    telephone: "+212 6 34 56 78 90",
    dateInscription: "2023-03-10",
    role: "consulteur",
    derniereConnexion: "2024-01-10",
  },
  {
    id: "U004",
    nom: "Khadija Mansouri",
    prenom: "Khadija",
    matricule: "98765D",
    email: "khadija.mansouri@ocp.ma",
    telephone: "+212 6 45 67 89 01",
    dateInscription: "2023-04-05",
    role: "consulteur",
    derniereConnexion: "2024-01-13",
  },
  {
    id: "U005",
    nom: "Youssef Idrissi",
    prenom: "Youssef",
    matricule: "11223E",
    email: "youssef.idrissi@ocp.ma",
    telephone: "+212 6 56 78 90 12",
    dateInscription: "2023-05-12",
    role: "admin", // Changé de "chef" à "admin"
    derniereConnexion: "2024-01-15",
  },
  {
    id: "U006",
    nom: "Sara Bennani",
    prenom: "Sara",
    matricule: "33445F",
    email: "sara.bennani@ocp.ma",
    telephone: "+212 6 67 89 01 23",
    dateInscription: "2023-06-18",
    role: "gestionnaire",
    derniereConnexion: "2024-01-15",
  },
]

const getRoleBadge = (role: string) => {
  const roleConfig = {
    admin: {
      icon: Crown,
      label: "Chef/Administrateur",
      className: "role-admin",
      description: "Gestion complète des utilisateurs, droits et données",
    },
    gestionnaire: {
      icon: Shield,
      label: "Gestionnaire",
      className: "role-gestionnaire",
      description: "Gestion des réservations, groupes et paiements",
    },
    consulteur: {
      icon: BookOpen,
      label: "Consulteur",
      className: "role-consulteur",
      description: "Consultation uniquement",
    },
  }
  const config = roleConfig[role as keyof typeof roleConfig]
  if (!config) return null
  const Icon = config.icon
  return (
    <span className={`role-badge ${config.className}`} title={config.description}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  )
}

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [newRole, setNewRole] = useState("")

  // États pour l'édition
  const [editForm, setEditForm] = useState({
    nom: "",
    prenom: "",
    matricule: "",
    email: "",
    telephone: "",
  })

  // États pour nouveau utilisateur
  const [newUserForm, setNewUserForm] = useState({
    nom: "",
    prenom: "",
    matricule: "",
    email: "",
    telephone: "",
    role: "consulteur",
  })

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleDeleteUser = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      console.log("Suppression de l'utilisateur:", id)
      alert("Utilisateur supprimé avec succès")
    }
  }

  const handleEditUser = () => {
    if (selectedUser) {
      console.log("Modification utilisateur:", editForm)
      alert(`Utilisateur ${editForm.nom} modifié avec succès`)
      setShowEditModal(false)
    }
  }

  const handleChangeRole = () => {
    if (selectedUser && newRole) {
      console.log(`Changement de rôle pour ${selectedUser.nom}: ${selectedUser.role} → ${newRole}`)
      alert(`Rôle mis à jour avec succès pour ${selectedUser.nom}`)
      setShowRoleModal(false)
      setNewRole("")
    }
  }

  const handleCreateUser = () => {
    console.log("Création nouvel utilisateur:", newUserForm)
    alert(`Utilisateur ${newUserForm.nom} créé avec succès`)
    setShowNewUserModal(false)
    setNewUserForm({
      nom: "",
      prenom: "",
      matricule: "",
      email: "",
      telephone: "",
      role: "consulteur",
    })
  }

  const openEditModal = (user: any) => {
    setSelectedUser(user)
    setEditForm({
      nom: user.nom,
      prenom: user.prenom,
      matricule: user.matricule,
      email: user.email,
      telephone: user.telephone,
    })
    setShowEditModal(true)
  }

  const getRoleStats = () => {
    const stats = {
      admin: usersData.filter((u) => u.role === "admin").length,
      gestionnaire: usersData.filter((u) => u.role === "gestionnaire").length,
      consulteur: usersData.filter((u) => u.role === "consulteur").length,
    }
    return stats
  }

  const roleStats = getRoleStats()

  return (
    <div className="users-management-page">
      {/* Header */}
      <div className="page-header-enhanced">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <Users size={28} className="title-icon" />
              Gestion des Utilisateurs
            </h1>
            <p className="page-subtitle">
              Administration des comptes et gestion des droits • {filteredUsers.length} utilisateurs
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline-secondary">
            <Download size={16} className="me-1" />
            Exporter
          </button>
          <button className="btn btn-primary" onClick={() => setShowNewUserModal(true)}>
            <Plus size={16} className="me-1" />
            Nouvel Utilisateur
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards-row">
        <div className="stat-card-mini">
          <div className="stat-icon-mini users">
            <Users size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">{usersData.length}</div>
            <div className="stat-label-mini">Total</div>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini admin">
            <Crown size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">{roleStats.admin}</div>
            <div className="stat-label-mini">Chef/Admins</div>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini gestionnaire">
            <Shield size={20} />
          </div>
          <div className="stat-content-mini">
            <div className="stat-value-mini">{roleStats.gestionnaire}</div>
            <div className="stat-label-mini">Gestionnaires</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, matricule ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="filter-select">
            <option value="all">Tous les rôles</option>
            <option value="admin">Chef/Administrateurs</option>
            <option value="gestionnaire">Gestionnaires</option>
            <option value="consulteur">Consulteurs</option>
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
                <th>Contact</th>
                <th>Rôle & Permissions</th>
                <th>Inscription</th>
                <th>Dernière Connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row-enhanced">
                  <td>
                    <div className="user-cell-enhanced">
                      <div className="user-avatar-enhanced">
                        {user.prenom[0]}
                        {user.nom.split(" ")[0][0]}
                      </div>
                      <div className="user-info-enhanced">
                        <div className="user-name-enhanced">
                          {user.prenom} {user.nom}
                        </div>
                        <div className="user-details-enhanced">#{user.matricule}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div className="contact-item">
                        <Mail size={14} />
                        {user.email}
                      </div>
                      <div className="contact-item">
                        <Phone size={14} />
                        {user.telephone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="role-cell">
                      {getRoleBadge(user.role)}
                      <button
                        className="btn btn-sm btn-outline-primary mt-1"
                        onClick={() => {
                          setSelectedUser(user)
                          setNewRole(user.role)
                          setShowRoleModal(true)
                        }}
                        title="Changer le rôle"
                      >
                        <Settings size={12} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">{user.dateInscription}</div>
                  </td>
                  <td>
                    <div className="date-cell">{user.derniereConnexion}</div>
                  </td>
                  <td>
                    <div className="actions-cell-enhanced">
                      <button
                        className="action-btn-enhanced view"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowDetailsModal(true)
                        }}
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="action-btn-enhanced edit" onClick={() => openEditModal(user)} title="Éditer">
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn-enhanced delete"
                        onClick={() => handleDeleteUser(user.id)}
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
        <div className="pagination-info">Affichage de {filteredUsers.length} utilisateurs</div>
        <div className="pagination-controls">
          <button className="btn btn-outline-secondary btn-sm">Précédent</button>
          <span className="pagination-current">1</span>
          <button className="btn btn-outline-secondary btn-sm">Suivant</button>
        </div>
      </div>

      {/* Modal Détails */}
      {showDetailsModal && selectedUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Users className="me-2" size={20} />
                  Détails de l'utilisateur - {selectedUser.nom}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informations Personnelles</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Nom complet:</strong>
                          </td>
                          <td>
                            {selectedUser.prenom} {selectedUser.nom}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Matricule:</strong>
                          </td>
                          <td>{selectedUser.matricule}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email:</strong>
                          </td>
                          <td>{selectedUser.email}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Téléphone:</strong>
                          </td>
                          <td>{selectedUser.telephone}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Date d'inscription:</strong>
                          </td>
                          <td>{selectedUser.dateInscription}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Dernière connexion:</strong>
                          </td>
                          <td>{selectedUser.derniereConnexion}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>Rôle & Permissions</h6>
                    <div className="mb-3">
                      <strong>Rôle:</strong> {getRoleBadge(selectedUser.role)}
                    </div>

                    <h6 className="mt-4">Permissions</h6>
                    <div className="permissions-list">
                      {selectedUser.role === "admin" && (
                        <>
                          <div className="permission-item">
                            <Crown size={14} className="me-2 text-warning" />
                            Modification des informations utilisateurs
                          </div>
                          <div className="permission-item">
                            <Settings size={14} className="me-2 text-warning" />
                            Gestion des droits et rôles
                          </div>
                          <div className="permission-item">
                            <Settings size={14} className="me-2 text-primary" />
                            Gestion complète des réservations
                          </div>
                          <div className="permission-item">
                            <Users size={14} className="me-2 text-primary" />
                            Gestion des utilisateurs et données
                          </div>
                          <div className="permission-item">
                            <Shield size={14} className="me-2 text-primary" />
                            Gestion des groupes et paiements
                          </div>
                        </>
                      )}
                      {selectedUser.role === "gestionnaire" && (
                        <>
                          <div className="permission-item">
                            <Shield size={14} className="me-2 text-success" />
                            Ajout et modification des réservations
                          </div>
                          <div className="permission-item">
                            <Users size={14} className="me-2 text-success" />
                            Gestion des groupes
                          </div>
                          <div className="permission-item">
                            <Settings size={14} className="me-2 text-success" />
                            Gestion des paiements
                          </div>
                        </>
                      )}
                      {selectedUser.role === "consulteur" && (
                        <div className="permission-item">
                          <BookOpen size={14} className="me-2 text-info" />
                          Consultation des données uniquement
                        </div>
                      )}
                    </div>
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
      {showEditModal && selectedUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Edit className="me-2" size={20} />
                  Modifier l'utilisateur - {selectedUser.nom}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nom *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.nom}
                        onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Prénom *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.prenom}
                        onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Matricule *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.matricule}
                    onChange={(e) => setEditForm({ ...editForm, matricule: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={editForm.telephone}
                    onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  <X size={16} className="me-1" />
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditUser}
                  disabled={!editForm.nom || !editForm.prenom || !editForm.matricule || !editForm.email}
                >
                  <Save size={16} className="me-1" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Changement de Rôle */}
      {showRoleModal && selectedUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Settings className="me-2" size={20} />
                  Changer le rôle - {selectedUser.nom}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowRoleModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <strong>Rôle actuel:</strong> {getRoleBadge(selectedUser.role)}
                </div>

                <div className="mb-3">
                  <label className="form-label">Nouveau rôle</label>
                  <select className="form-select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    <option value="consulteur">Consulteur - Consultation uniquement</option>
                    <option value="gestionnaire">Gestionnaire - Gestion réservations, groupes, paiements</option>
                    <option value="admin">Chef/Administrateur - Gestion complète + utilisateurs et droits</option>
                  </select>
                </div>

                <div className="permissions-preview">
                  <h6>Permissions du nouveau rôle:</h6>
                  <div className="permissions-list">
                    {newRole === "admin" && (
                      <>
                        <div className="permission-item">
                          <Crown size={14} className="me-2 text-warning" />
                          Modification des informations utilisateurs
                        </div>
                        <div className="permission-item">
                          <Settings size={14} className="me-2 text-warning" />
                          Gestion des droits et rôles
                        </div>
                        <div className="permission-item">
                          <Settings size={14} className="me-2 text-primary" />
                          Gestion complète des réservations
                        </div>
                        <div className="permission-item">
                          <Users size={14} className="me-2 text-primary" />
                          Gestion des utilisateurs et données
                        </div>
                        <div className="permission-item">
                          <Shield size={14} className="me-2 text-primary" />
                          Gestion des groupes et paiements
                        </div>
                      </>
                    )}
                    {newRole === "gestionnaire" && (
                      <>
                        <div className="permission-item">
                          <Shield size={14} className="me-2 text-success" />
                          Ajout et modification des réservations
                        </div>
                        <div className="permission-item">
                          <Users size={14} className="me-2 text-success" />
                          Gestion des groupes
                        </div>
                        <div className="permission-item">
                          <Settings size={14} className="me-2 text-success" />
                          Gestion des paiements
                        </div>
                      </>
                    )}
                    {newRole === "consulteur" && (
                      <div className="permission-item">
                        <BookOpen size={14} className="me-2 text-info" />
                        Consultation des données uniquement
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleChangeRole}
                  disabled={!newRole || newRole === selectedUser.role}
                >
                  Confirmer le changement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvel Utilisateur */}
      {showNewUserModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Plus className="me-2" size={20} />
                  Nouvel Utilisateur
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowNewUserModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nom *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUserForm.nom}
                        onChange={(e) => setNewUserForm({ ...newUserForm, nom: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Prénom *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUserForm.prenom}
                        onChange={(e) => setNewUserForm({ ...newUserForm, prenom: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Matricule *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUserForm.matricule}
                    onChange={(e) => setNewUserForm({ ...newUserForm, matricule: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={newUserForm.telephone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, telephone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rôle *</label>
                  <select
                    className="form-select"
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  >
                    <option value="consulteur">Consulteur</option>
                    <option value="gestionnaire">Gestionnaire</option>
                    <option value="admin">Chef/Administrateur</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewUserModal(false)}>
                  <X size={16} className="me-1" />
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleCreateUser}
                  disabled={!newUserForm.nom || !newUserForm.prenom || !newUserForm.matricule || !newUserForm.email}
                >
                  <Save size={16} className="me-1" />
                  Créer l'utilisateur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .users-management-page {
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

        .stat-icon-mini.users {
          background: linear-gradient(135deg, #3498db, #2980b9);
        }
        .stat-icon-mini.admin {
          background: linear-gradient(135deg, #f39c12, #e67e22);
        }
        .stat-icon-mini.chef {
          background: linear-gradient(135deg, #2980b9, #1f4e79);
        }
        .stat-icon-mini.gestionnaire {
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

        .contact-cell {
          font-size: 13px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
          color: #2c3e50;
        }

        .role-cell {
          text-align: center;
        }

        .role-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
          margin: 0 auto 8px auto;
        }

        .role-badge.role-admin {
          background: #fef9e7;
          color: #f39c12;
        }

        .role-badge.role-chef {
          background: #e8f4fd;
          color: #2980b9;
        }

        .role-badge.role-gestionnaire {
          background: #f4e8fd;
          color: #8e44ad;
        }

        .role-badge.role-consulteur {
          background: #e8f8f5;
          color: #27ae60;
        }

        .date-cell {
          text-align: center;
          font-size: 13px;
          color: #2c3e50;
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

        .permissions-list {
          margin-top: 10px;
        }

        .permission-item {
          display: flex;
          align-items: center;
          padding: 8px 0;
          font-size: 13px;
          color: #2c3e50;
        }

        .permissions-preview {
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
      `}</style>
    </div>
  )
}
