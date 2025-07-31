"use client"

import { Users, Calendar, Activity, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"

const statsData = [
  {
    title: "Réservations",
    subtitle: "Aujourd'hui",
    value: "47",
    change: "+12%",
    changeText: "vs hier",
    trend: "up",
    icon: Calendar,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    bgColor: "#f0f4ff",
  },
  {
    title: "Utilisateurs Actifs",
    subtitle: "En ligne",
    value: "1,234",
    change: "+5%",
    changeText: "vs hier",
    trend: "up",
    icon: Users,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    bgColor: "#fef7f7",
  },
  {
    title: "Taux d'Occupation",
    subtitle: "Moyenne",
    value: "78%",
    change: "+8%",
    changeText: "vs hier",
    trend: "up",
    icon: Activity,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    bgColor: "#f0fdff",
  },
  {
    title: "En Attente",
    subtitle: "Validation",
    value: "23",
    change: "-3%",
    changeText: "vs hier",
    trend: "down",
    icon: AlertCircle,
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    bgColor: "#fffbf0",
  },
]

export function StatsCards() {
  return (
    <div className="stats-grid">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown

        return (
          <div key={index} className="stat-card-enhanced">
            <div className="stat-card-inner">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title-enhanced">{stat.title}</h3>
                  <p className="stat-subtitle-enhanced">{stat.subtitle}</p>
                </div>
                <div className="stat-icon-enhanced" style={{ background: stat.gradient }}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>

              <div className="stat-body">
                <div className="stat-value-enhanced">{stat.value}</div>
                <div className={`stat-change-enhanced ${stat.trend === "up" ? "positive" : "negative"}`}>
                  <TrendIcon size={16} />
                  <span className="change-value">{stat.change}</span>
                  <span className="change-text">{stat.changeText}</span>
                </div>
              </div>

              <div className="stat-progress">
                <div
                  className="progress-bar"
                  style={{
                    background: stat.gradient,
                    width: `${Math.abs(Number.parseInt(stat.change))}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
