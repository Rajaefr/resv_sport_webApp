"use client"

import { useState } from "react"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Trash2,
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  Users,
  DollarSign,
  Settings,
} from "lucide-react"

interface Notification {
  id: string
  type: "warning" | "success" | "info" | "error"
  title: string
  message: string
  time: string
  category: "payment" | "occupation" | "system" | "user"
  isRead: boolean
  priority: "high" | "medium" | "low"
}

const notificationsData: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Occupation faible",
    message: "3 groupes ont un taux d'occupation inférieur à 50%",
    time: "Il y a 2 heures",
    category: "occupation",
    isRead: false,
    priority: "high",
  },
  {
    id: "2",
    type: "success",
    title: "Objectif atteint",
    message: "Objectif mensuel de revenus atteint à 105%",
    time: "Il y a 1 jour",
    category: "payment",
    isRead: true,
    priority: "medium",
  },
  {
    id: "3",
    type: "info",
    title: "Nouvelles inscriptions",
    message: "15 nouveaux participants inscrits cette semaine",
    time: "Il y a 3 jours",
    category: "user",
    isRead: false,
    priority: "low",
  },
  {
    id: "4",
    type: "error",
    title: "Paiement en retard",
    message: "12 participants ont des paiements en retard de plus de 30 jours",
    time: "Il y a 4 heures",
    category: "payment",
    isRead: false,
    priority: "high",
  },
  {
    id: "5",
    type: "warning",
    title: "Capacité maximale",
    message: "Le groupe A1-1 a atteint sa capacité maximale",
    time: "Il y a 6 heures",
    category: "occupation",
    isRead: true,
    priority: "medium",
  },
  {
    id: "6",
    type: "info",
    title: "Maintenance programmée",
    message: "Maintenance du système prévue dimanche de 2h à 4h",
    time: "Il y a 1 jour",
    category: "system",
    isRead: false,
    priority: "low",
  },
  {
    id: "7",
    type: "success",
    title: "Nouveau record",
    message: "Record de participation atteint avec 195 participants actifs",
    time: "Il y a 2 jours",
    category: "user",
    isRead: true,
    priority: "medium",
  },
  {
    id: "8",
    type: "warning",
    title: "Stock équipement",
    message: "Stock de matériel de natation faible (moins de 10 unités)",
    time: "Il y a 3 jours",
    category: "system",
    isRead: false,
    priority: "medium",
  },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter
    const matchesRead = !showOnlyUnread || !notification.isRead
    return matchesSearch && matchesType && matchesCategory && matchesRead
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={20} />
      case "success":
        return <CheckCircle size={20} />
      case "error":
        return <AlertCircle size={20} />
      case "info":
      default:
        return <Info size={20} />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "payment":
        return <DollarSign size={16} />
      case "occupation":
        return <Users size={16} />
      case "user":
        return <Users size={16} />
      case "system":
      default:
        return <Settings size={16} />
    }
  }

  const handleDeleteNotification = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette notification ?")) {
      setNotifications(notifications.filter((n) => n.id !== id))
      setSelectedNotifications(selectedNotifications.filter((selectedId) => selectedId !== id))
    }
  }

  const handleDeleteAll = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer toutes les notifications ?")) {
      setNotifications([])
      setSelectedNotifications([])
    }
  }

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) return
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedNotifications.length} notification(s) ?`)) {
      setNotifications(notifications.filter((n) => !selectedNotifications.includes(n.id)))
      setSelectedNotifications([])
    }
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const handleSelectNotification = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedNotifications([...selectedNotifications, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const highPriorityCount = notifications.filter((n) => n.priority === "high" && !n.isRead).length

  return (
    <div className="notifications-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <Bell size={28} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Centre de Notifications</h1>
              <p className="page-subtitle">
                Gestion des alertes et notifications • {filteredNotifications.length} notifications
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-header btn-secondary" onClick={handleMarkAllAsRead}>
              <CheckCircle size={18} />
              <span>Tout marquer lu</span>
            </button>
            <button className="btn-header btn-secondary">
              <RefreshCw size={18} />
              <span>Actualiser</span>
            </button>
            <button className="btn-header btn-primary">
              <Download size={18} />
              <span>Exporter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Bell size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{notifications.length}</div>
            <div className="stat-label">Total Notifications</div>
          </div>
          <div className="stat-trend">Aujourd'hui</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{unreadCount}</div>
            <div className="stat-label">Non lues</div>
          </div>
          <div className="stat-trend">À traiter</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{highPriorityCount}</div>
            <div className="stat-label">Priorité haute</div>
          </div>
          <div className="stat-trend">Urgent</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Trash2 size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{selectedNotifications.length}</div>
            <div className="stat-label">Sélectionnées</div>
          </div>
          <div className="stat-trend">Actions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="search-wrapper">
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher dans les notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="filters-controls">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
            <option value="all">Tous les types</option>
            <option value="warning">Avertissements</option>
            <option value="success">Succès</option>
            <option value="error">Erreurs</option>
            <option value="info">Informations</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="filter-select">
            <option value="all">Toutes les catégories</option>
            <option value="payment">Paiements</option>
            <option value="occupation">Occupation</option>
            <option value="user">Utilisateurs</option>
            <option value="system">Système</option>
          </select>
          <label className="checkbox-filter">
            <input type="checkbox" checked={showOnlyUnread} onChange={(e) => setShowOnlyUnread(e.target.checked)} />
            <span>Non lues uniquement</span>
          </label>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="actions-left">
          <label className="select-all-checkbox">
            <input
              type="checkbox"
              checked={
                selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0
              }
              onChange={handleSelectAll}
            />
            <span>Tout sélectionner ({filteredNotifications.length})</span>
          </label>
        </div>
        <div className="actions-right">
          {selectedNotifications.length > 0 && (
            <button className="btn-action btn-danger" onClick={handleDeleteSelected}>
              <Trash2 size={16} />
              <span>Supprimer sélection ({selectedNotifications.length})</span>
            </button>
          )}
          <button className="btn-action btn-danger-outline" onClick={handleDeleteAll}>
            <Trash2 size={16} />
            <span>Supprimer tout</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h3>Aucune notification</h3>
            <p>Aucune notification ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.type} ${!notification.isRead ? "unread" : ""} ${
                selectedNotifications.includes(notification.id) ? "selected" : ""
              }`}
            >
              <div className="notification-checkbox">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => handleSelectNotification(notification.id)}
                />
              </div>
              <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-title-row">
                    <h4 className="notification-title">{notification.title}</h4>
                    <div className="notification-meta">
                      <div className="notification-category">
                        {getCategoryIcon(notification.category)}
                        <span>{notification.category}</span>
                      </div>
                      <div className={`notification-priority priority-${notification.priority}`}>
                        {notification.priority}
                      </div>
                    </div>
                  </div>
                  {!notification.isRead && <div className="unread-indicator"></div>}
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-footer">
                  <div className="notification-time">
                    <Clock size={14} />
                    <span>{notification.time}</span>
                  </div>
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="notification-btn btn-mark-read"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Marquer comme lu
                      </button>
                    )}
                    <button
                      className="notification-btn btn-delete"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Styles CSS */}
      <style jsx>{`
        .notifications-container {
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

        .btn-secondary {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
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

        .checkbox-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
        }

        .checkbox-filter input {
          accent-color: #16a34a;
        }

        /* Actions Bar */
        .actions-bar {
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .select-all-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          font-weight: 500;
        }

        .select-all-checkbox input {
          accent-color: #16a34a;
        }

        .actions-right {
          display: flex;
          gap: 12px;
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }

        .btn-danger-outline {
          background: white;
          color: #dc2626;
          border: 1px solid #dc2626;
        }

        .btn-danger-outline:hover {
          background: #dc2626;
          color: white;
        }

        /* Notifications List */
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notification-item {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          display: flex;
          gap: 16px;
          transition: all 0.3s ease;
          position: relative;
        }

        .notification-item.unread {
          border-left: 4px solid #16a34a;
          background: #f9fafb;
        }

        .notification-item.selected {
          border-color: #16a34a;
          box-shadow: 0 4px 16px rgba(22, 163, 74, 0.15);
        }

        .notification-item.warning {
          border-left-color: #f59e0b;
        }

        .notification-item.success {
          border-left-color: #16a34a;
        }

        .notification-item.error {
          border-left-color: #dc2626;
        }

        .notification-item.info {
          border-left-color: #3b82f6;
        }

        .notification-checkbox {
          display: flex;
          align-items: flex-start;
          padding-top: 2px;
        }

        .notification-checkbox input {
          accent-color: #16a34a;
        }

        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .notification-item.warning .notification-icon {
          background: #fef3c7;
          color: #f59e0b;
        }

        .notification-item.success .notification-icon {
          background: #dcfce7;
          color: #16a34a;
        }

        .notification-item.error .notification-icon {
          background: #fecaca;
          color: #dc2626;
        }

        .notification-item.info .notification-icon {
          background: #dbeafe;
          color: #3b82f6;
        }

        .notification-content {
          flex: 1;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .notification-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }

        .notification-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .notification-meta {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .notification-category {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .notification-priority {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 8px;
          text-transform: uppercase;
        }

        .priority-high {
          background: #fecaca;
          color: #dc2626;
        }

        .priority-medium {
          background: #fef3c7;
          color: #f59e0b;
        }

        .priority-low {
          background: #dbeafe;
          color: #3b82f6;
        }

        .unread-indicator {
          width: 8px;
          height: 8px;
          background: #16a34a;
          border-radius: 50%;
          margin-left: 8px;
        }

        .notification-message {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 12px 0;
          line-height: 1.5;
        }

        .notification-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #9ca3af;
        }

        .notification-actions {
          display: flex;
          gap: 8px;
        }

        .notification-btn {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-mark-read {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .btn-mark-read:hover {
          background: #dcfce7;
        }

        .btn-delete {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .btn-delete:hover {
          background: #dc2626;
          color: white;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 16px 0 8px 0;
          color: #374151;
        }

        .empty-state p {
          font-size: 14px;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .notifications-container {
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
            grid-template-columns: 1fr 1fr;
          }

          .filters-container {
            flex-direction: column;
            gap: 16px;
          }

          .filters-controls {
            width: 100%;
            justify-content: space-between;
          }

          .actions-bar {
            flex-direction: column;
            gap: 16px;
          }

          .notification-item {
            padding: 16px;
          }

          .notification-title-row {
            flex-direction: column;
            gap: 8px;
          }

          .notification-meta {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  )
}
