"use client"
import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,

  Trash2,
  Users,
  Mail,
  Phone,
  Shield,
  Crown,
  Settings,
  BookOpen,
  Save,
  X,
} from "lucide-react"

const usersData = [
  {
    id: "U001",
    nom: "Ahmed",
    prenom: "Ahmed",
    matricule: "12345A",
    email: "ahmed@ocp.ma",
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
    nom: "Mohamed",
    prenom: "Mohamed",
    matricule: "54321C",
    email: "mohamed@ocp.ma",
    telephone: "+212 6 34 56 78 90",
    dateInscription: "2023-03-10",
    role: "consulteur",
    derniereConnexion: "2024-01-10",
  },
  {
    id: "U004",
    nom: "Khadija Ahmed",
    prenom: "Khadija",
    matricule: "98765D",
    email: "khadija.Ahmed@ocp.ma",
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
    role: "admin",
    derniereConnexion: "2024-01-15",
  },
  {
    id: "U006",
    nom: "Sara",
    prenom: "Sara",
    matricule: "33445F",
    email: "sara@ocp.ma",
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
 
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [newRole, setNewRole] = useState("")

 

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

    

      {/* Modal Changement de Rôle */}
      {showRoleModal && selectedUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Settings className="ms-2" size={20} />
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
          padding: 24px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          min-height: 100vh;
        }

        .page-header-enhanced {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 24px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
        }

        .page-title {
          display: flex;
          align-items: center;
          font-size: 24px;
          font-weight: 700;
          color: #16a34a;
          margin: 0;
        }

        .title-icon {
          margin-right: 12px;
          color: #16a34a;
        }

        .page-subtitle {
          color: #6b7280;
          margin: 5px 0 0 0;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
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

        .btn-outline-secondary {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .btn-outline-secondary:hover {
          background: #dcfce7;
          border-color: #86efac;
        }

        .btn-success {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          color: white;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .stats-cards-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card-mini {
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .stat-card-mini:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(22, 163, 74, 0.15);
        }

        .stat-icon-mini {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon-mini.users {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .stat-icon-mini.admin {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .stat-icon-mini.gestionnaire {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .stat-value-mini {
          font-size: 20px;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 2px;
        }

        .stat-label-mini {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .filters-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          margin-bottom: 24px;
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

        .filter-controls {
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
          min-width: 150px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .table-container-enhanced {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .table-enhanced {
          width: 100%;
          margin: 0;
          border-collapse: collapse;
        }

        .table-enhanced th {
          background: #f9fafb;
          padding: 16px 20px;
          font-weight: 600;
          color: #374151;
          border: none;
          font-size: 13px;
          text-align: left;
        }

        .table-enhanced td {
          padding: 16px 20px;
          border-top: 1px solid #f3f4f6;
          vertical-align: middle;
        }

        .table-row-enhanced {
          transition: all 0.3s ease;
        }

        .table-row-enhanced:hover {
          background-color: #f9fafb;
        }

        .user-cell-enhanced {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-enhanced {
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

        .user-name-enhanced {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2px;
          font-size: 14px;
        }

        .user-details-enhanced {
          font-size: 12px;
          color: #6b7280;
        }

        .contact-cell {
          font-size: 13px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
          color: #374151;
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
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }

        .role-badge.role-gestionnaire {
          background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
          color: #7c3aed;
        }

        .role-badge.role-consulteur {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #166534;
        }

        .btn-outline-primary {
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
          font-size: 12px;
          padding: 4px 8px;
        }

        .btn-outline-primary:hover {
          background: #0369a1;
          color: white;
        }

        .date-cell {
          text-align: center;
          font-size: 13px;
          color: #374151;
        }

        .actions-cell-enhanced {
          display: flex;
          gap: 6px;
          justify-content: center;
        }

        .action-btn-enhanced {
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

        .action-btn-enhanced.view {
          background: #e0f2fe;
          color: #0369a1;
        }

        .action-btn-enhanced.view:hover {
          background: #0369a1;
          color: white;
          transform: scale(1.1);
        }

     

      

        .action-btn-enhanced.delete {
          background: #fecaca;
          color: #dc2626;
        }

        .action-btn-enhanced.delete:hover {
          background: #dc2626;
          color: white;
          transform: scale(1.1);
        }

        .pagination-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
        }

        .pagination-info {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pagination-current {
          padding: 8px 12px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          color: white;
          border-radius: 6px;
          font-weight: 600;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        /* Modal Styles */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1050;
        }

        .modal-dialog {
          position: relative;
          width: auto;
          margin: 1.75rem auto;
          max-width: 500px;
        }

        .modal-lg {
          max-width: 800px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-close {
          width: 32px;
          height: 32px;
          border: none;
          background: #f3f4f6;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
        }

        .btn-close::before,
        .btn-close::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 2px;
          background: #6b7280;
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .btn-close::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .btn-close:hover {
          background: #e5e7eb;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 13px;
          margin-bottom: 6px;
          display: block;
        }

        .form-control,
        .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          transition: all 0.3s ease;
        }

        .form-control:focus,
        .form-select:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .mb-3 {
          margin-bottom: 1rem;
        }

        .me-1 {
          margin-right: 0.25rem;
        }

        .me-2 {
          margin-right: 0.5rem;
        }

        .mt-1 {
          margin-top: 0.25rem;
        }

        .mt-4 {
          margin-top: 1.5rem;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -0.75rem;
        }

        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding: 0 0.75rem;
        }

        .table {
          width: 100%;
          margin-bottom: 1rem;
          color: #212529;
          border-collapse: collapse;
        }

        .table-sm td {
          padding: 0.5rem;
          border-top: 1px solid #dee2e6;
        }

        .alert {
          padding: 12px 16px;
          margin-bottom: 1rem;
          border: 1px solid transparent;
          border-radius: 8px;
        }

        .alert-info {
          color: #0c5460;
          background-color: #d1ecf1;
          border-color: #bee5eb;
        }

        .permissions-list {
          margin-top: 10px;
        }

        .permission-item {
          display: flex;
          align-items: center;
          padding: 8px 0;
          font-size: 13px;
          color: #374151;
        }

        .permissions-preview {
          margin-top: 20px;
          padding: 15px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .text-warning {
          color: #f59e0b !important;
        }

        .text-primary {
          color: #3b82f6 !important;
        }

        .text-success {
          color: #10b981 !important;
        }

        .text-info {
          color: #06b6d4 !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .users-management-page {
            padding: 16px;
          }

          .page-header-enhanced {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .header-actions {
            width: 100%;
            justify-content: center;
          }

          .stats-cards-row {
            grid-template-columns: 1fr;
          }

          .filters-section {
            flex-direction: column;
            gap: 16px;
          }

          .filter-controls {
            width: 100%;
            justify-content: space-between;
          }

          .pagination-section {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }

          .modal-dialog {
            margin: 1rem;
            max-width: calc(100% - 2rem);
          }
        }
      `}</style>
    </div>
  )
}
