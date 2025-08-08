'use client';

import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Info, Clock, Trash2, Search, Download, RefreshCw, AlertCircle, Users, DollarSign, Settings, Plus, Eye } from 'lucide-react';

interface Notification {
  id: string;
  type: "warning" | "success" | "info" | "error";
  title: string;
  message: string;
  time: string;
  category: "payment" | "occupation" | "system" | "user";
  isRead: boolean;
  priority: "high" | "medium" | "low";
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
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter;
    const matchesRead = !showOnlyUnread || !notification.isRead;
    return matchesSearch && matchesType && matchesCategory && matchesRead;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={20} />;
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "info":
      default:
        return <Info size={20} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "payment":
        return <DollarSign size={16} />;
      case "occupation":
        return <Users size={16} />;
      case "user":
        return <Users size={16} />;
      case "system":
      default:
        return <Settings size={16} />;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "priority-urgent";
      case "medium":
        return "priority-high"; // Using high for medium to match existing styles
      case "low":
      default:
        return "priority-low";
    }
  };

  const handleDeleteNotification = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette notification ?")) {
      setNotifications(notifications.filter((n) => n.id !== id));
      setSelectedNotifications(selectedNotifications.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDeleteAll = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer toutes les notifications ?")) {
      setNotifications([]);
      setSelectedNotifications([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) return;
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedNotifications.length} notification(s) ?`)) {
      setNotifications(notifications.filter((n) => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleSelectNotification = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  // New handler for double-clicking type filter buttons
  const handleTypeFilterClick = (type: string) => {
    if (typeFilter === type) {
      setTypeFilter("all"); // Deactivate if already active
    } else {
      setTypeFilter(type); // Activate
    }
  };

  // New handler for double-clicking category filter buttons
  const handleCategoryFilterClick = (category: string) => {
    if (categoryFilter === category) {
      setCategoryFilter("all"); // Deactivate if already active
    } else {
      setCategoryFilter(category); // Activate
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const highPriorityCount = notifications.filter((n) => n.priority === "high" && !n.isRead).length;

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="page-header-enhanced">
        <div className="header-title-section">
          <h1 className="page-title">
            <Bell size={32} className="title-icon" />
            Notifications
          </h1>
          <p className="page-subtitle">Gérez toutes vos alertes et messages système.</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-outline-success d-flex align-items-center gap-2"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle size={18} />
            Marquer tout lu
          </button>
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={handleDeleteAll}
            disabled={notifications.length === 0}
          >
            <Trash2 size={18} />
            Supprimer tout
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section-new mb-4">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher dans les notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons-group">
          <button
            className={`filter-button ${typeFilter === "all" ? "active" : ""}`}
            onClick={() => handleTypeFilterClick("all")}
          >
            Tous les types
          </button>
          <button
            className={`filter-button ${typeFilter === "warning" ? "active" : ""}`}
            onClick={() => handleTypeFilterClick("warning")}
          >
            Avertissements
          </button>
          <button
            className={`filter-button ${typeFilter === "success" ? "active" : ""}`}
            onClick={() => handleTypeFilterClick("success")}
          >
            Succès
          </button>
          <button
            className={`filter-button ${typeFilter === "error" ? "active" : ""}`}
            onClick={() => handleTypeFilterClick("error")}
          >
            Erreurs
          </button>
          <button
            className={`filter-button ${typeFilter === "info" ? "active" : ""}`}
            onClick={() => handleTypeFilterClick("info")}
          >
            Infos
          </button>
        </div>
        <div className="filter-buttons-group">
          <button
            className={`filter-button ${categoryFilter === "all" ? "active" : ""}`}
            onClick={() => handleCategoryFilterClick("all")}
          >
            Toutes les catégories
          </button>
          <button
            className={`filter-button ${categoryFilter === "payment" ? "active" : ""}`}
            onClick={() => handleCategoryFilterClick("payment")}
          >
            Paiement
          </button>
          <button
            className={`filter-button ${categoryFilter === "occupation" ? "active" : ""}`}
            onClick={() => handleCategoryFilterClick("occupation")}
          >
            Occupation
          </button>
          <button
            className={`filter-button ${categoryFilter === "system" ? "active" : ""}`}
            onClick={() => handleCategoryFilterClick("system")}
          >
            Système
          </button>
          <button
            className={`filter-button ${categoryFilter === "user" ? "active" : ""}`}
            onClick={() => handleCategoryFilterClick("user")}
          >
            Utilisateur
          </button>
        </div>
        <div className="form-check form-switch ms-auto d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="showUnreadSwitch"
            checked={showOnlyUnread}
            onChange={() => setShowOnlyUnread(!showOnlyUnread)}
          />
          <label className="form-check-label text-muted small ms-2" htmlFor="showUnreadSwitch">
            Non lues ({unreadCount})
          </label>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="d-flex justify-content-end gap-2 mb-4">
          <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" onClick={handleDeleteSelected}>
            <Trash2 size={16} />
            Supprimer ({selectedNotifications.length})
          </button>
          <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-2" onClick={() => {
            selectedNotifications.forEach(id => handleMarkAsRead(id));
            setSelectedNotifications([]); // Clear selection after action
          }}>
            <CheckCircle size={16} />
            Marquer comme lu
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
        {filteredNotifications.length === 0 ? (
          <div className="col-12 text-center py-5">
            <Bell size={64} className="text-muted mb-3" />
            <h3 className="h5 text-dark mb-2">Aucune notification</h3>
            <p className="text-muted">
              {searchTerm || typeFilter !== "all" || showOnlyUnread || categoryFilter !== "all"
                ? "Aucune notification ne correspond à vos critères de recherche."
                : "Vous n'avez aucune notification pour le moment."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div className="col" key={notification.id}>
              <div
                className={`validation-card h-100 ${!notification.isRead ? "border-success" : ""} ${notification.priority === "high" ? "urgent" : ""}`}
              >
                <div className="form-check position-absolute top-0 end-0 m-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`checkbox-${notification.id}`}
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                  />
                  <label className="form-check-label" htmlFor={`checkbox-${notification.id}`} />
                </div>

                <div className="validation-card-header">
                  <div className="request-info">
                    <div className={`stat-icon-mini ${notification.type}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <h5 className="mb-0 fw-bold text-dark">{notification.title}</h5>
                  </div>
                  <span className={`priority-badge ${getPriorityClass(notification.priority)}`}>
                    {notification.priority === "high" && <AlertTriangle size={14} />}
                    {notification.priority === "medium" && <Clock size={14} />}
                    {notification.priority === "low" && <Info size={14} />}
                    {notification.priority}
                  </span>
                </div>

                <div className="validation-card-body">
                  <p className="text-muted mb-3">{notification.message}</p>
                  <div className="detail-row mb-2">
                    <span className="detail-label">Catégorie:</span>
                    <span className="detail-value">
                      {getCategoryIcon(notification.category)}
                      {notification.category}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Reçue:</span>
                    <span className="detail-value">
                      <Clock size={16} />
                      {notification.time}
                    </span>
                  </div>
                </div>

                <div className="validation-card-actions">
                  {!notification.isRead && (
                    <button
                      className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <CheckCircle size={14} />
                      Lu
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredNotifications.length > 0 && ( // Show pagination only if there are notifications
        <div className="pagination-section">
          <div className="pagination-info">
            Affichage de {filteredNotifications.length} notifications
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li className="page-item disabled">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
