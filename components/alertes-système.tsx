"use client"

import { AlertCircle, Clock, XCircle } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Groupe Piscine A",
    message: "Capacité à 95% pour demain",
    icon: Clock,
  },
  {
    id: 2,
    type: "error",
    title: "Salle C001-2",
    message: "Maintenance programmée",
    icon: XCircle,
  },
]

export function SystemAlerts() {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-transparent border-0">
        <h5 className="card-title fw-bold mb-1 d-flex align-items-center gap-2">
          <AlertCircle size={20} className="text-warning" />
          Alertes Système
        </h5>
      </div>
      <div className="card-body">
        <div className="alerts-container">
          {alerts.map((alert) => {
            const Icon = alert.icon
            return (
              <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                <div className="d-flex align-items-start gap-3">
                  <Icon size={20} className={`alert-icon-${alert.type}`} />
                  <div>
                    <p className={`fw-medium mb-1 alert-title-${alert.type}`}>{alert.title}</p>
                    <p className={`mb-0 alert-message-${alert.type}`}>{alert.message}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <button className="btn btn-outline-primary w-100 mt-3">Import Données</button>
      </div>
    </div>
  )
}
