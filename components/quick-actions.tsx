"use client"

import { Waves, Dumbbell, Users, Settings, Upload, BarChart3 } from "lucide-react"

const quickActions = [
  {
    title: "Piscine",
    description: "15 réservations en attente",
    icon: Waves,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    count: 15,
  },
  {
    title: "Sport",
    description: "32 réservations en attente",
    icon: Dumbbell,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    count: 32,
  },
  {
    title: "Utilisateurs",
    description: "Gestion",
    icon: Users,
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    count: null,
  },
  {
    title: "Données",
    description: "Paramètres",
    icon: Settings,
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    count: null,
  },
  {
    title: "Statistiques",
    description: "Analyses détaillées",
    icon: BarChart3,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    count: null,
  },
  {
    title: "Import/Export",
    description: "Gestion des données",
    icon: Upload,
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    count: null,
  },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: "#16a34a", fontSize: "1.1rem" }}>
            Actions Rapides
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
            Accès direct aux fonctionnalités principales
          </p>
        </div>
      </div>

      <div className="row g-2">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
              <button
                className="btn w-100 p-2 border-0 position-relative"
                style={{
                  backgroundColor: "#f8fffe",
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{
                      width: "36px",
                      height: "36px",
                      background: action.gradient,
                    }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="text-start flex-grow-1">
                    <div className="fw-semibold" style={{ fontSize: "0.85rem", color: "#374151" }}>
                      {action.title}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                      {action.description}
                    </div>
                  </div>
                </div>
                {action.count && (
                  <span
                    className="position-absolute top-0 end-0 translate-middle badge rounded-pill"
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      fontSize: "0.6rem",
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
  )
}
