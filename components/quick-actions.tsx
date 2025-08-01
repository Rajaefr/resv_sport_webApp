"use client"

import { Waves, Dumbbell, Users, Settings, Upload, BarChart3 } from "lucide-react"

const quickActions = [
  {
    title: "Piscine",
    description: "15 réservations en attente",
    icon: Waves,
    gradient: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
    count: 15,
  },
  {
    title: "Sport",
    description: "32 réservations en attente",
    icon: Dumbbell,
    gradient: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
    count: 32,
  },
  {
    title: "Utilisateurs",
    description: "Gestion",
    icon: Users,
    gradient: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
    count: null,
  },
  {
    title: "Données",
    description: "Paramètres",
    icon: Settings,
    gradient: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
    count: null,
  },
  {
    title: "Statistiques",
    description: "Analyses détaillées",
    icon: BarChart3,
    gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    count: null,
  },
  {
    title: "Import/Export",
    description: "Gestion des données",
    icon: Upload,
    gradient: "linear-gradient(135deg, #10b981 0%, #16a34a 100%)",
    count: null,
  },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-3 shadow-sm p-4 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: "#16a34a", fontSize: "1.1rem" }}>
            Actions Rapides
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
            Accès direct aux fonctionnalités principales
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="row g-3 w-100" style={{ maxWidth: "1200px" }}>
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <button
                  className="btn w-100 p-3 border-0 position-relative h-100"
                  style={{
                    backgroundColor: "#f0fdf4",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    minHeight: "100px",
                    border: "1px solid #bbf7d0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(22, 163, 74, 0.15)"
                    e.currentTarget.style.backgroundColor = "#ecfdf5"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.backgroundColor = "#f0fdf4"
                  }}
                >
                  <div className="d-flex flex-column align-items-center gap-2 h-100 justify-content-center">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: action.gradient,
                        boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
                      }}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="text-center">
                      <div className="fw-bold mb-1" style={{ fontSize: "0.9rem", color: "#16a34a" }}>
                        {action.title}
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.75rem", lineHeight: "1.2" }}>
                        {action.description}
                      </div>
                    </div>
                  </div>
                  {action.count && (
                    <span
                      className="position-absolute top-0 end-0 translate-middle badge rounded-pill"
                      style={{
                        backgroundColor: "#dc2626",
                        color: "white",
                        fontSize: "0.65rem",
                        minWidth: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {action.count}
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
