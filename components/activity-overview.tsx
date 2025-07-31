"use client"

import { Calendar, Clock, Users, TrendingUp } from "lucide-react"

const activityData = [
  {
    title: "Réservations Aujourd'hui",
    value: "47",
    subtitle: "15 piscine • 32 sport",
    icon: Calendar,
    trend: "+12%",
    color: "primary",
  },
  {
    title: "Créneaux Disponibles",
    value: "23",
    subtitle: "Sur 70 créneaux totaux",
    icon: Clock,
    trend: "-5%",
    color: "warning",
  },
  {
    title: "Utilisateurs Connectés",
    value: "156",
    subtitle: "Pic à 14h: 203 utilisateurs",
    icon: Users,
    trend: "+8%",
    color: "success",
  },
  {
    title: "Taux de Satisfaction",
    value: "94%",
    subtitle: "Basé sur 127 avis",
    icon: TrendingUp,
    trend: "+2%",
    color: "info",
  },
]

export function ActivityOverview() {
  return (
    <div className="activity-overview-card">
      <div className="card-header-enhanced">
        <div className="header-content">
          <h3 className="card-title-enhanced">Aperçu des Activités</h3>
          <p className="card-subtitle-enhanced">Données en temps réel</p>
        </div>
        <div className="header-actions-small">
          <button className="btn btn-outline-primary btn-sm">
            <Clock size={16} className="me-1" />
            Temps réel
          </button>
        </div>
      </div>

      <div className="activity-grid">
        {activityData.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className={`activity-item activity-${item.color}`}>
              <div className="activity-icon-wrapper">
                <Icon size={24} />
              </div>
              <div className="activity-content">
                <h4 className="activity-value">{item.value}</h4>
                <p className="activity-title">{item.title}</p>
                <p className="activity-subtitle">{item.subtitle}</p>
                <div className={`activity-trend trend-${item.trend.startsWith("+") ? "up" : "down"}`}>
                  <TrendingUp size={14} />
                  <span>{item.trend}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
