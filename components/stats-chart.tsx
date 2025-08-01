"use client"

import { TrendingUp, Users, DollarSign, Calendar, BarChart3, Activity } from "lucide-react"

const monthlyData = [
  { month: "Jan", reservations: 245, revenue: 12500 },
  { month: "Fév", reservations: 289, revenue: 14200 },
  { month: "Mar", reservations: 312, revenue: 15800 },
  { month: "Avr", reservations: 278, revenue: 13900 },
  { month: "Mai", reservations: 334, revenue: 16700 },
  { month: "Juin", reservations: 298, revenue: 14900 },
]

const occupationData = [
  { time: "08:00", rate: 45 },
  { time: "10:00", rate: 72 },
  { time: "12:00", rate: 89 },
  { time: "14:00", rate: 95 },
  { time: "16:00", rate: 78 },
  { time: "18:00", rate: 62 },
  { time: "20:00", rate: 34 },
]

// Données des revenus par code discipline (salles)
const revenueByDiscipline = [
  { code: "C001", discipline: "Tennis", revenue: 15600 },
  { code: "C003", discipline: "Badminton", revenue: 1280 },
  { code: "C007", discipline: "Squash", revenue: 920 },
  { code: "C012", discipline: "Volleyball", revenue: 890 },
  { code: "C015", discipline: "Basketball", revenue: 1140 },
  { code: "C018", discipline: "Handball", revenue: 730 },
]

// Données d'occupation par groupe
const groupOccupationData = [
  { group: "A1-1", occupation: 98, capacity: 25, current: 24 },
  { group: "A1-2", occupation: 45, capacity: 20, current: 9 },
  { group: "A2-1", occupation: 95, capacity: 30, current: 28,  },
  { group: "B1-3", occupation: 96, capacity: 22, current: 21 },
  { group: "B2-4", occupation: 99, capacity: 28, current: 27 },
  { group: "A1-3", occupation: 78, capacity: 25, current: 19  },
  { group: "B1-1", occupation: 89, capacity: 24, current: 21 },
  { group: "A2-3", occupation: 75, capacity: 26, current: 19  },
]

export function StatsChart() {
  const maxReservations = Math.max(...monthlyData.map((d) => d.reservations))
  const maxRevenue = Math.max(...revenueByDiscipline.map((d) => d.revenue))

  return (
    <div className="bg-white rounded-3 shadow-sm border p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-2"
            style={{ width: "40px", height: "40px", backgroundColor: "#16a34a" }}
          >
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h4 className="mb-1 fw-semibold" style={{ color: "#16a34a" }}>
              Tableau de Bord Analytique
            </h4>
            <p className="mb-0 text-muted small">Vue d'ensemble des performances</p>
          </div>
        </div>
        <button
          className="btn btn-sm d-flex align-items-center gap-2"
          style={{ backgroundColor: "#16a34a", color: "white", border: "none" }}
        >
          <Calendar size={14} />
          Derniers 6 mois
        </button>
      </div>

      {/* Cards statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="rounded-2 p-3 border" style={{ backgroundColor: "#f0fdf4" }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted small">Total Réservations</p>
                <h5 className="mb-0 fw-bold" style={{ color: "#16a34a" }}>
                  1,756
                </h5>
                <small style={{ color: "#16a34a" }}>
                  <TrendingUp size={12} className="me-1" />
                  +12.5%
                </small>
              </div>
              <Users size={24} style={{ color: "#16a34a", opacity: 0.75 }} />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="rounded-2 p-3 border" style={{ backgroundColor: "#f0fdf4" }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted small">Revenus</p>
                <h5 className="mb-0 fw-bold" style={{ color: "#16a34a" }}>
                  87,900€
                </h5>
                <small style={{ color: "#16a34a" }}>
                  <TrendingUp size={12} className="me-1" />
                  +8.2%
                </small>
              </div>
              <DollarSign size={24} style={{ color: "#16a34a", opacity: 0.75 }} />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="rounded-2 p-3 border" style={{ backgroundColor: "#f0fdf4" }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted small">Taux d'Occupation</p>
                <h5 className="mb-0 fw-bold" style={{ color: "#16a34a" }}>
                  73%
                </h5>
                <small style={{ color: "#16a34a" }}>
                  <TrendingUp size={12} className="me-1" />
                  +5.1%
                </small>
              </div>
              <Activity size={24} style={{ color: "#16a34a", opacity: 0.75 }} />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="rounded-2 p-3 border" style={{ backgroundColor: "#f0fdf4" }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted small">Groupes Actifs</p>
                <h5 className="mb-0 fw-bold" style={{ color: "#16a34a" }}>
                  16
                </h5>
                <small style={{ color: "#16a34a" }}>
                  <TrendingUp size={12} className="me-1" />
                  +2
                </small>
              </div>
              <BarChart3 size={24} style={{ color: "#16a34a", opacity: 0.75 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="row g-4">
        {/* Graphique des réservations */}
        <div className="col-md-6">
          <div className="border rounded-2 p-3">
            <h6 className="mb-3 fw-semibold" style={{ color: "#16a34a" }}>
              Réservations Mensuelles
            </h6>
            <div className="d-flex align-items-end gap-2" style={{ height: "200px" }}>
              {monthlyData.map((data, index) => (
                <div key={index} className="d-flex flex-column align-items-center flex-fill">
                  <div
                    className="rounded-top"
                    style={{
                      width: "100%",
                      height: `${(data.reservations / maxReservations) * 160}px`,
                      minHeight: "20px",
                      backgroundColor: "#16a34a",
                      transition: "height 0.6s ease",
                    }}
                    title={`${data.reservations} réservations`}
                  ></div>
                  <small className="text-muted mt-2">{data.month}</small>
                  <small className="fw-medium" style={{ color: "#16a34a" }}>
                    {data.reservations}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graphique d'occupation */}
        <div className="col-md-6">
          <div className="border rounded-2 p-3">
            <h6 className="mb-3 fw-semibold" style={{ color: "#16a34a" }}>
              Taux d'Occupation Journalier
            </h6>
            <div style={{ height: "200px", position: "relative" }}>
              <svg width="100%" height="100%" viewBox="0 0 300 160">
                <defs>
                  <linearGradient id="occupationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {/* Grille */}
                {[0, 25, 50, 75, 100].map((value) => (
                  <g key={value}>
                    <line
                      x1="30"
                      y1={140 - value * 1.1}
                      x2="280"
                      y2={140 - value * 1.1}
                      stroke="#e9ecef"
                      strokeWidth="1"
                    />
                    <text x="25" y={145 - value * 1.1} fontSize="10" fill="#6c757d" textAnchor="end">
                      {value}%
                    </text>
                  </g>
                ))}
                {/* Ligne de données */}
                <polyline
                  fill="url(#occupationGradient)"
                  stroke="#16a34a"
                  strokeWidth="2"
                  points={
                    occupationData.map((d, i) => `${40 + i * 35},${140 - d.rate * 1.1}`).join(" ") + ` 280,140 40,140`
                  }
                />
                <polyline
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  points={occupationData.map((d, i) => `${40 + i * 35},${140 - d.rate * 1.1}`).join(" ")}
                />
                {/* Points de données */}
                {occupationData.map((d, i) => (
                  <circle
                    key={i}
                    cx={40 + i * 35}
                    cy={140 - d.rate * 1.1}
                    r="3"
                    fill="#16a34a"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <title>
                      {d.time}: {d.rate}%
                    </title>
                  </circle>
                ))}
                {/* Labels des heures */}
                {occupationData.map((d, i) => (
                  <text key={i} x={40 + i * 35} y="155" fontSize="10" fill="#6c757d" textAnchor="middle">
                    {d.time}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Revenus par Code Discipline et Occupation par Groupe */}
      <div className="row g-4 mt-2">
        {/* Revenus par Code Discipline */}
        <div className="col-md-6">
          <div className="border rounded-2 p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-semibold" style={{ color: "#16a34a" }}>
                Revenus par Code Discipline
              </h6>
              <small className="text-muted">Salles sportives</small>
            </div>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: "250px", overflowY: "auto" }}>
              {revenueByDiscipline.map((item, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between p-3 rounded-2"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge text-white fw-medium px-2 py-1" style={{ backgroundColor: "#16a34a" }}>
                      {item.code}
                    </span>
                  
                  </div>
                  <div className="text-end">
                    <div className="fw-bold" style={{ color: "#16a34a" }}>
                      {item.revenue.toLocaleString()}€
                    </div>
                    <div className="progress mt-1" style={{ width: "80px", height: "4px" }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${(item.revenue / maxRevenue) * 100}%`,
                          backgroundColor: "#16a34a",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Occupation par Groupe */}
        <div className="col-md-6">
          <div className="border rounded-2 p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-semibold" style={{ color: "#16a34a" }}>
                Occupation par Groupe
              </h6>
              <small className="text-muted">Temps réel</small>
            </div>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: "250px", overflowY: "auto" }}>
              {groupOccupationData.map((group, index) => (
                <div key={index} className="p-3 rounded-2" style={{ backgroundColor: "#f8f9fa" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-white badge text-white fw-medium px-2 py-1" style={{ backgroundColor: "#16a34a" }}>{group.group}</span>
                      <span className="fw-medium text-dark">
                        {group.current}/{group.capacity}
                      </span>
                    
                    </div>
                    <span
                      className={`fw-bold ${
                        group.occupation >= 90 ? "text-danger" : group.occupation >= 70 ? "text-warning" : ""
                      }`}
                      style={{ color: group.occupation < 70 ? "#16a34a" : undefined }}
                    >
                      {group.occupation}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${group.occupation}%`,
                        backgroundColor:
                          group.occupation >= 90 ? "#f04848" : group.occupation >= 70 ? "#f7e14f" : "#16a318",
                      }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small className="text-muted">Participants actuels</small>
                    <small style={{ color: "#16a34a" }}>{group.capacity - group.current} places libres</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        svg circle:hover {
          r: 4;
          transition: r 0.2s ease;
        }
        
        .progress-bar {
          transition: width 0.6s ease;
        }
        
        div::-webkit-scrollbar {
          width: 4px;
        }
        
        div::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 2px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #16a34a;
          border-radius: 2px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #15803d;
        }
      `}</style>
    </div>
  )
}
