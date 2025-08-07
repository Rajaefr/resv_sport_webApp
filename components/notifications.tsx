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
    <div>
      {/* Barre de recherche moderne */}
      <div className="search-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher dans les notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Filtres modernes */}
      <div className="filters-section">
        <button
          className={`filter-button ${typeFilter === "all" ? "active" : ""}`}
          onClick={() => setTypeFilter("all")}
        >
          Toutes
        </button>
        <button
          className={`filter-button ${typeFilter === "warning" ? "active" : ""}`}
          onClick={() => setTypeFilter("warning")}
        >
          Avertissements
        </button>
        <button
          className={`filter-button ${typeFilter === "success" ? "active" : ""}`}
          onClick={() => setTypeFilter("success")}
        >
          Succès
        </button>
        <button
          className={`filter-button ${typeFilter === "error" ? "active" : ""}`}
          onClick={() => setTypeFilter("error")}
        >
          Erreurs
        </button>
        <button
          className={`filter-button ${showOnlyUnread ? "active" : ""}`}
          onClick={() => setShowOnlyUnread(!showOnlyUnread)}
        >
          Non lues ({unreadCount})
        </button>
      </div>

      {/* Actions en lot */}
      {selectedNotifications.length > 0 && (
        <div className="bulk-actions">
          <button className="action-button" onClick={handleDeleteSelected}>
            <Trash2 size={16} />
            Supprimer ({selectedNotifications.length})
          </button>
          <button className="action-button" onClick={handleMarkAllAsRead}>
            <CheckCircle size={16} />
            Marquer comme lu
          </button>
        </div>
      )}

      {/* Liste des notifications */}
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell className="empty-icon" />
            <h3 className="empty-title">Aucune notification</h3>
            <p className="empty-message">
              {searchTerm || typeFilter !== "all" || showOnlyUnread
                ? "Aucune notification ne correspond à vos critères de recherche."
                : "Vous n'avez aucune notification pour le moment."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${!notification.isRead ? "unread" : ""}`}
            >
              <div className="notification-header">
                <h3 className="notification-title">{notification.title}</h3>
                <span className="notification-time">{notification.time}</span>
              </div>
              
              <div className="notification-content">
                <div className={`notification-icon ${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-details">
                  <p className="notification-message">{notification.message}</p>
                  
                  <div className="notification-category">
                    {getCategoryIcon(notification.category)}
                    {notification.category}
                  </div>
                  
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="action-button"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckCircle size={14} />
                        Marquer lu
                      </button>
                    )}
                    
                    <button
                      className="action-button delete"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <Trash2 size={14} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination moderne */}
      {filteredNotifications.length > 10 && (
        <div className="pagination">
          <button className="pagination-button">Précédent</button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button">2</button>
          <button className="pagination-button">3</button>
          <button className="pagination-button">Suivant</button>
        </div>
      )}
    </div>
  )
}
