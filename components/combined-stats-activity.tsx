"use client"

import { Users, Calendar, Activity, AlertCircle, TrendingUp, TrendingDown, Clock, RefreshCw } from "lucide-react"

const statsData = [
  {
    title: "Réservations",
    subtitle: "Aujourd'hui",
    value: "47",
    change: "+12%",
    changeText: "vs hier",
    trend: "up",
    icon: Calendar,
    bgGradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    bgColor: "#dcfce7",
  },
  {
    title: "Utilisateurs Actifs",
    subtitle: "En ligne",
    value: "1,234",
    change: "+5%",
    changeText: "vs hier",
    trend: "up",
    icon: Users,
    bgGradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    bgColor: "#dcfce7",
  },
  {
    title: "Taux d'Occupation",
    subtitle: "Moyenne",
    value: "78%",
    change: "+8%",
    changeText: "vs hier",
    trend: "up",
    icon: Activity,
    bgGradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    bgColor: "#d1fae5",
  },
  {
    title: "En Attente",
    subtitle: "Validation",
    value: "23",
    change: "-3%",
    changeText: "vs hier",
    trend: "down",
    icon: AlertCircle,
    bgGradient: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
    bgColor: "#fef3c7",
  },
]

export function CombinedStatsActivity() {
  return (
    <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
      {/* Section Header - Plus compact */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: "#16a34a", fontSize: "1.1rem" }}>
            Statistiques & Activités
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
            Vue d'ensemble en temps réel
          </p>
        </div>
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm d-flex align-items-center gap-1 border-0"
            style={{
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
              fontSize: "0.75rem",
            }}
          >
            <Clock size={14} />
            <span className="d-none d-sm-inline">Temps réel</span>
          </button>
          <button className="btn btn-light btn-sm border-0" style={{ backgroundColor: "#f9fafb" }}>
            <RefreshCw size={14} style={{ color: "#16a34a" }} />
          </button>
        </div>
      </div>

      {/* Stats Cards - Plus compactes */}
      <div className="row g-2">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown

          return (
            <div
              key={index}
              className="col-xl-3 col-lg-6 col-md-6"
              onMouseEnter={(e) => {
                const card = e.currentTarget.querySelector(".card")
                if (card) {
                  card.style.transform = "translateY(-4px)"
                  card.style.boxShadow = "0 8px 25px rgba(22, 163, 74, 0.15)"
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget.querySelector(".card")
                if (card) {
                  card.style.transform = "translateY(0)"
                  card.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"
                }
              }}
            >
              <div
                className="card border-0 h-100 overflow-hidden position-relative bg-white"
                style={{
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Background decoration */}
                <div
                  className="position-absolute top-0 end-0"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: stat.bgColor,
                    borderRadius: "50%",
                    transform: "translate(20px, -20px)",
                    opacity: 0.3,
                  }}
                />

                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="card-title fw-semibold mb-1" style={{ color: "#374151", fontSize: "0.8rem" }}>
                        {stat.title}
                      </h6>
                      <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                        {stat.subtitle}
                      </small>
                    </div>
                    <div
                      className="text-white rounded-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: stat.bgGradient,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="mb-2">
                    <h4 className="fw-bold mb-0" style={{ color: "#16a34a", fontSize: "1.5rem" }}>
                      {stat.value}
                    </h4>
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    <span
                      className={`badge d-flex align-items-center gap-1`}
                      style={{
                        backgroundColor: stat.trend === "up" ? "#dcfce7" : "#fee2e2",
                        color: stat.trend === "up" ? "#16a34a" : "#dc2626",
                        fontSize: "0.7rem",
                      }}
                    >
                      <TrendIcon size={10} />
                      {stat.change}
                    </span>
                    <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                      {stat.changeText}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
