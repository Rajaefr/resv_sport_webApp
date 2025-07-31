"use client"

import { AlertCircle, Clock, XCircle, CheckCircle, Bell } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Groupe Piscine A",
    message: "Capacité à 95% pour demain",
    icon: Clock,
    time: "Il y a 5 min",
  },
  {
    id: 2,
    type: "error",
    title: "Salle C001-2",
    message: "Maintenance programmée",
    icon: XCircle,
    time: "Il y a 10 min",
  },
  {
    id: 3,
    type: "success",
    title: "Sauvegarde",
    message: "Sauvegarde automatique réussie",
    icon: CheckCircle,
    time: "Il y a 15 min",
  },
  {
    id: 4,
    type: "warning",
    title: "Salle B205",
    message: "Équipement défaillant signalé",
    icon: AlertCircle,
    time: "Il y a 20 min",
  },
  {
    id: 5,
    type: "success",
    title: "Validation",
    message: "15 nouvelles réservations validées",
    icon: CheckCircle,
    time: "Il y a 30 min",
  },
]

export function SystemAlerts() {
  return (
    <div className="bg-white rounded-3 shadow-sm h-100">
      <div className="p-3 border-bottom">
        <div className="d-flex align-items-center justify-content-between mb-0">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-2"
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#f0fdf4",
              }}
            >
              <AlertCircle size={18} style={{ color: "#16a34a" }} />
            </div>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: "#16a34a", fontSize: "1rem" }}>
                Alertes Système
              </h6>
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                Notifications en temps réel
              </small>
            </div>
          </div>
          <span
            className="badge rounded-pill d-flex align-items-center gap-1"
            style={{ backgroundColor: "#16a34a", color: "white", fontSize: "0.75rem" }}
          >
            {alerts.length}
          </span>
        </div>
      </div>

      <div className="p-3">
        <div className="d-flex flex-column gap-2" style={{ maxHeight: "320px", overflowY: "auto" }}>
          {alerts.map((alert) => {
            const Icon = alert.icon
            const alertStyles = {
              warning: {
                borderColor: "#eab308",
                backgroundColor: "#fffbeb",
                iconColor: "#eab308",
              },
              error: {
                borderColor: "#dc2626",
                backgroundColor: "#fef2f2",
                iconColor: "#dc2626",
              },
              success: {
                borderColor: "#16a34a",
                backgroundColor: "#f0fdf4",
                iconColor: "#16a34a",
              },
            }[alert.type]

            return (
              <div
                key={alert.id}
                className="position-relative p-3 rounded-3 border-start border-3"
                style={{
                  borderLeftColor: alertStyles.borderColor,
                  backgroundColor: alertStyles.backgroundColor,
                }}
              >
                <button
                  className="btn-close btn-sm position-absolute top-0 end-0 mt-2 me-2"
                  style={{ fontSize: "0.6rem" }}
                ></button>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: alertStyles.backgroundColor,
                      border: `1px solid ${alertStyles.borderColor}`,
                    }}
                  >
                    <Icon size={16} style={{ color: alertStyles.iconColor }} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-semibold mb-1" style={{ color: "#374151", fontSize: "0.85rem" }}>
                      {alert.title}
                    </h6>
                    <p className="mb-2 text-muted" style={{ fontSize: "0.8rem" }}>
                      {alert.message}
                    </p>
                    <small className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "0.7rem" }}>
                      <Clock size={12} style={{ color: "#6b7280" }} />
                      {alert.time}
                    </small>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="d-grid gap-2 mt-3 pt-3 border-top">
          <button
            className="btn btn-sm border-0 d-flex align-items-center justify-content-center gap-2"
            style={{
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
              fontSize: "0.8rem",
            }}
          >
            <Bell size={14} />
            Voir toutes les alertes
          </button>
        </div>
      </div>
    </div>
  )
}
