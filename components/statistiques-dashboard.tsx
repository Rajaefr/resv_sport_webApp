"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Users, DollarSign, Waves, Target, AlertCircle, CheckCircle, Clock, Filter, Download, RefreshCw } from 'lucide-react'

// Données des disciplines (reprises des codes précédents)
const disciplinesData = [
  { code: "C001-1", nom: "Adultes Musculation", participantsCount: 25, paidCount: 20, isActive: true, price: 80 },
  { code: "C001-2", nom: "Enfants Musculation", participantsCount: 15, paidCount: 12, isActive: true, price: 50 },
  { code: "C058-1", nom: "Adultes Gym", participantsCount: 30, paidCount: 25, isActive: true, price: 100 },
  { code: "C058-2", nom: "Enfants Gym", participantsCount: 18, paidCount: 10, isActive: false, price: 60 },
  { code: "C058-3", nom: "Adultes Gym & Swim", participantsCount: 12, paidCount: 12, isActive: true, price: 150 },
  { code: "C058-4", nom: "Enfants Gym & Swim", participantsCount: 8, paidCount: 6, isActive: true, price: 90 },
  { code: "C025-1", nom: "Adultes Fitness", participantsCount: 22, paidCount: 18, isActive: true, price: 120 },
  { code: "C025-2", nom: "Enfants Fitness", participantsCount: 10, paidCount: 8, isActive: false, price: 70 },
]

// Données des groupes piscine (reprises des codes précédents)
const groupesData = [
  {
    code: "A1-1",
    horaires: "Lundi 14:00-16:00, Mercredi 08:00-10:00",
    participantsCount: 12,
    capacite: 15,
    isBlocked: false,
    bassin: "Grand Bassin",
    type: "Adultes",
  },
  {
    code: "A1-2",
    horaires: "Mardi 10:00-12:00, Jeudi 14:00-16:00",
    participantsCount: 8,
    capacite: 10,
    isBlocked: true,
    bassin: "Petit Bassin",
    type: "Enfants",
  },
  {
    code: "A1-3",
    horaires: "Vendredi 08:00-10:00, Samedi 16:00-18:00",
    participantsCount: 10,
    capacite: 15,
    isBlocked: false,
    bassin: "Grand Bassin",
    type: "Adultes",
  },
  {
    code: "A2-1",
    horaires: "Lundi 16:00-18:00, Mercredi 10:00-12:00",
    participantsCount: 14,
    capacite: 15,
    isBlocked: false,
    bassin: "Grand Bassin",
    type: "Retraités",
  },
  {
    code: "A2-2",
    horaires: "Mardi 14:00-16:00, Jeudi 16:00-18:00",
    participantsCount: 6,
    capacite: 10,
    isBlocked: false,
    bassin: "Petit Bassin",
    type: "Mixte",
  },
  {
    code: "B1-1",
    horaires: "Vendredi 10:00-12:00",
    participantsCount: 3,
    capacite: 12,
    isBlocked: false,
    bassin: "Petit Bassin",
    type: "Enfants",
  },
]

export function StatistiquesDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Calculs des statistiques globales
  const totalParticipantsDisciplines = disciplinesData.reduce((sum, d) => sum + d.participantsCount, 0)
  const totalPaidDisciplines = disciplinesData.reduce((sum, d) => sum + d.paidCount, 0)
  const totalRevenueDisciplines = disciplinesData.reduce((sum, d) => sum + d.paidCount * d.price, 0)
  const activeDisciplines = disciplinesData.filter((d) => d.isActive).length

  const totalParticipantsGroupes = groupesData.reduce((sum, g) => sum + g.participantsCount, 0)
  const totalCapaciteGroupes = groupesData.reduce((sum, g) => sum + g.capacite, 0)
  const activeGroupes = groupesData.filter((g) => !g.isBlocked).length

  const totalParticipants = totalParticipantsDisciplines + totalParticipantsGroupes
  const totalRevenue = totalRevenueDisciplines
  const tauxPaiementGlobal = Math.round((totalPaidDisciplines / totalParticipantsDisciplines) * 100)
  const tauxOccupationGroupes = Math.round((totalParticipantsGroupes / totalCapaciteGroupes) * 100)

  // Données pour les graphiques
  const revenueByDiscipline = disciplinesData.map((d) => ({
    name: d.nom.split(" ")[1] || d.nom,
    revenue: d.paidCount * d.price,
    participants: d.participantsCount,
    paid: d.paidCount,
  }))

  const participantsByType = [
    {
      name: "Adultes",
      disciplines: disciplinesData
        .filter((d) => d.nom.includes("Adultes"))
        .reduce((sum, d) => sum + d.participantsCount, 0),
      groupes: groupesData.filter((g) => g.type === "Adultes").reduce((sum, g) => sum + g.participantsCount, 0),
    },
    {
      name: "Enfants",
      disciplines: disciplinesData
        .filter((d) => d.nom.includes("Enfants"))
        .reduce((sum, d) => sum + d.participantsCount, 0),
      groupes: groupesData.filter((g) => g.type === "Enfants").reduce((sum, g) => sum + g.participantsCount, 0),
    },
    {
      name: "Retraités",
      disciplines: 0,
      groupes: groupesData.filter((g) => g.type === "Retraités").reduce((sum, g) => sum + g.participantsCount, 0),
    },
    {
      name: "Mixte",
      disciplines: 0,
      groupes: groupesData.filter((g) => g.type === "Mixte").reduce((sum, g) => sum + g.participantsCount, 0),
    },
  ]

  const occupationData = groupesData.map((g) => ({
    name: g.code,
    occupation: Math.round((g.participantsCount / g.capacite) * 100),
    participants: g.participantsCount,
    capacite: g.capacite,
    type: g.type,
  }))

  const paymentStatusData = [
    { name: "Payé", value: totalPaidDisciplines, color: "#16a34a" },
    { name: "Non payé", value: totalParticipantsDisciplines - totalPaidDisciplines, color: "#dc2626" },
  ]

  const monthlyTrend = [
    { month: "Jan", revenue: 12000, participants: 120, newInscriptions: 15 },
    { month: "Fév", revenue: 15000, participants: 135, newInscriptions: 22 },
    { month: "Mar", revenue: 18000, participants: 150, newInscriptions: 28 },
    { month: "Avr", revenue: 22000, participants: 165, newInscriptions: 35 },
    { month: "Mai", revenue: 25000, participants: 180, newInscriptions: 42 },
    { month: "Juin", revenue: totalRevenue, participants: totalParticipants, newInscriptions: 38 },
  ]

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <TrendingUp size={28} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Tableau de Bord Statistiques</h1>
              <p className="page-subtitle">Vue d'ensemble des performances • Paiements, Participants & Groupes</p>
            </div>
          </div>
          <div className="header-actions">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            <button className="btn-header btn-secondary">
              <RefreshCw size={18} />
              <span>Actualiser</span>
            </button>
            <button className="btn-header btn-primary">
              <Download size={18} />
              <span>Exporter</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{totalRevenue.toLocaleString()} DH</div>
            <div className="kpi-label">Revenus Total</div>
            <div className="kpi-trend positive">+12.5% vs mois dernier</div>
          </div>
          <div className="kpi-chart">
            <div className="mini-chart">
              <div className="chart-bar" style={{ height: "60%" }}></div>
              <div className="chart-bar" style={{ height: "80%" }}></div>
              <div className="chart-bar" style={{ height: "70%" }}></div>
              <div className="chart-bar" style={{ height: "90%" }}></div>
              <div className="chart-bar" style={{ height: "100%" }}></div>
            </div>
          </div>
        </div>

        <div className="kpi-card participants">
          <div className="kpi-icon">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{totalParticipants}</div>
            <div className="kpi-label">Total Participants</div>
            <div className="kpi-trend positive">+8.3% vs mois dernier</div>
          </div>
          <div className="kpi-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Disciplines</span>
              <span className="breakdown-value">{totalParticipantsDisciplines}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Groupes</span>
              <span className="breakdown-value">{totalParticipantsGroupes}</span>
            </div>
          </div>
        </div>

        <div className="kpi-card payment">
          <div className="kpi-icon">
            <Target size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{tauxPaiementGlobal}%</div>
            <div className="kpi-label">Taux de Paiement</div>
            <div className="kpi-trend positive">+3.2% vs mois dernier</div>
          </div>
          <div className="kpi-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${tauxPaiementGlobal}%` }}></div>
            </div>
            <div className="progress-text">
              {totalPaidDisciplines}/{totalParticipantsDisciplines} payés
            </div>
          </div>
        </div>

        <div className="kpi-card occupation">
          <div className="kpi-icon">
            <Waves size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{tauxOccupationGroupes}%</div>
            <div className="kpi-label">Occupation Groupes</div>
            <div className="kpi-trend neutral">+1.5% vs mois dernier</div>
          </div>
          <div className="kpi-details">
            <div className="detail-item">
              <CheckCircle size={14} />
              <span>{activeGroupes} groupes actifs</span>
            </div>
            <div className="detail-item">
              <AlertCircle size={14} />
              <span>{groupesData.length - activeGroupes} bloqués</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="charts-grid">
        {/* Revenus par discipline */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Revenus par Discipline</h3>
            <div className="chart-actions">
              <button className="chart-btn">
                <Filter size={16} />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByDiscipline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition des participants */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Participants par Type</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participantsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="disciplines" stackId="a" fill="#16a34a" name="Disciplines" />
                <Bar dataKey="groupes" stackId="a" fill="#22c55e" name="Groupes Piscine" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Graphiques secondaires */}
      <div className="secondary-charts">
        {/* Statut des paiements */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Statut des Paiements</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution mensuelle */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Évolution Mensuelle</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.6}
                  name="Revenus (DH)"
                />
                <Area
                  type="monotone"
                  dataKey="participants"
                  stackId="2"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                  name="Participants"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tableaux de performance */}
      <div className="performance-tables">
        {/* Top disciplines */}
        <div className="performance-card">
          <div className="performance-header">
            <h3 className="performance-title">Top Disciplines (Revenus)</h3>
          </div>
          <div className="performance-content">
            <div className="performance-list">
              {disciplinesData
                .sort((a, b) => b.paidCount * b.price - a.paidCount * a.price)
                .slice(0, 5)
                .map((discipline, index) => (
                  <div key={discipline.code} className="performance-item">
                    <div className="performance-rank">#{index + 1}</div>
                    <div className="performance-info">
                      <div className="performance-name">{discipline.nom}</div>
                      <div className="performance-code">{discipline.code}</div>
                    </div>
                    <div className="performance-metrics">
                      <div className="performance-value">
                        {(discipline.paidCount * discipline.price).toLocaleString()} DH
                      </div>
                      <div className="performance-participants">{discipline.participantsCount} participants</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Occupation des groupes */}
        <div className="performance-card">
          <div className="performance-header">
            <h3 className="performance-title">Occupation des Groupes</h3>
          </div>
          <div className="performance-content">
            <div className="performance-list">
              {groupesData
                .sort((a, b) => b.participantsCount / b.capacite - a.participantsCount / a.capacite)
                .slice(0, 5)
                .map((groupe, index) => (
                  <div key={groupe.code} className="performance-item">
                    <div className="performance-rank">#{index + 1}</div>
                    <div className="performance-info">
                      <div className="performance-name">{groupe.code}</div>
                      <div className="performance-code">
                        {groupe.type} - {groupe.bassin}
                      </div>
                    </div>
                    <div className="performance-metrics">
                      <div className="performance-value">
                        {Math.round((groupe.participantsCount / groupe.capacite) * 100)}%
                      </div>
                      <div className="performance-participants">
                        {groupe.participantsCount}/{groupe.capacite}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="alerts-section">
        <div className="alerts-card">
          <div className="alerts-header">
            <h3 className="alerts-title">Alertes & Notifications</h3>
          </div>
          <div className="alerts-content">
            <div className="alert-item warning">
              <AlertCircle size={20} />
              <div className="alert-text">
                <div className="alert-message">3 groupes ont un taux d'occupation inférieur à 50%</div>
                <div className="alert-time">Il y a 2 heures</div>
              </div>
            </div>
            <div className="alert-item success">
              <CheckCircle size={20} />
              <div className="alert-text">
                <div className="alert-message">Objectif mensuel de revenus atteint à 105%</div>
                <div className="alert-time">Il y a 1 jour</div>
              </div>
            </div>
            <div className="alert-item info">
              <Clock size={20} />
              <div className="alert-text">
                <div className="alert-message">15 nouveaux participants inscrits cette semaine</div>
                <div className="alert-time">Il y a 3 jours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS */}
      <style jsx>{`
        .dashboard-container {
          padding: 24px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          min-height: 100vh;
        }

        /* Header */
        .page-header {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #16a34a;
          margin: 0 0 4px 0;
        }

        .page-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .period-select {
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          color: #374151;
          min-width: 140px;
        }

        .btn-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }

        .btn-secondary {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        /* KPIs Grid - Version minimisée */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .kpi-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 12px rgba(22, 163, 74, 0.06);
          border: 1px solid #bbf7d0;
          position: relative;
          overflow: hidden;
          min-height: 120px;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .kpi-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 12px;
        }

        .kpi-content {
          margin-bottom: 8px;
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2px;
          line-height: 1.2;
        }

        .kpi-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .kpi-trend {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 8px;
          display: inline-block;
        }

        .kpi-breakdown {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .breakdown-label {
          font-size: 10px;
          color: #6b7280;
          font-weight: 500;
        }

        .breakdown-value {
          font-size: 14px;
          font-weight: 700;
          color: #16a34a;
        }

        .kpi-progress {
          margin-top: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #f3f4f6;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .progress-text {
          font-size: 11px;
          color: #6b7280;
        }

        .kpi-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 8px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #6b7280;
        }

        .kpi-chart {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .mini-chart {
          display: flex;
          align-items: end;
          gap: 1px;
          height: 28px;
        }

        .chart-bar {
          width: 3px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          border-radius: 1px;
          opacity: 0.7;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .secondary-charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          overflow: hidden;
        }

        .chart-wide {
          grid-column: span 2;
        }

        .chart-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chart-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .chart-actions {
          display: flex;
          gap: 8px;
        }

        .chart-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .chart-btn:hover {
          border-color: #16a34a;
          color: #16a34a;
        }

        .chart-content {
          padding: 20px;
        }

        /* Performance Tables */
        .performance-tables {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .performance-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          overflow: hidden;
        }

        .performance-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
          background: #f9fafb;
        }

        .performance-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .performance-content {
          padding: 16px;
        }

        .performance-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .performance-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .performance-item:hover {
          background: #f9fafb;
        }

        .performance-rank {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .performance-info {
          flex: 1;
        }

        .performance-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .performance-code {
          font-size: 12px;
          color: #6b7280;
        }

        .performance-metrics {
          text-align: right;
        }

        .performance-value {
          font-weight: 700;
          color: #16a34a;
          font-size: 16px;
          margin-bottom: 2px;
        }

        .performance-participants {
          font-size: 12px;
          color: #6b7280;
        }

        /* Alerts Section */
        .alerts-section {
          margin-bottom: 32px;
        }

        .alerts-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.08);
          border: 1px solid #bbf7d0;
          overflow: hidden;
        }

        .alerts-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
          background: #f9fafb;
        }

        .alerts-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .alerts-content {
          padding: 16px;
        }

        .alert-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          border-left: 4px solid;
        }

        .alert-item.warning {
          background: #fef3c7;
          border-left-color: #f59e0b;
          color: #92400e;
        }

        .alert-item.success {
          background: #dcfce7;
          border-left-color: #16a34a;
          color: #166534;
        }

        .alert-item.info {
          background: #dbeafe;
          border-left-color: #3b82f6;
          color: #1e40af;
        }

        .alert-text {
          flex: 1;
        }

        .alert-message {
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .alert-time {
          font-size: 12px;
          opacity: 0.8;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }

          .secondary-charts {
            grid-template-columns: 1fr;
          }

          .performance-tables {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .header-actions {
            width: 100%;
            justify-content: center;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .kpi-value {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}
