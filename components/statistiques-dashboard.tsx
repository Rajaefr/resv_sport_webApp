"use client"

import { useState, useEffect } from "react"
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
import { TrendingUp, Users, DollarSign, Waves, Target, AlertCircle, CheckCircle, Clock, Filter, Download, RefreshCw, Loader2, Activity } from 'lucide-react'
import { apiService } from "../lib/apiService"

interface IntegratedStats {
  overview: {
    totalReservations: number;
    pendingReservations: number;
    approvedReservations: number;
    totalRevenue: number;
    totalParticipants: number;
    occupationRate: number;
    totalActivities: number;
    totalUsers: number;
    paymentRate: number;
  };
  reservations: {
    piscine: any[];
    sport: any[];
    byStatus: {
      pending: number;
      approved: number;
      rejected: number;
    };
  };
  disciplines: any[];
  groupes: any[];
  payments: {
    total: number;
    completed: number;
    pending: number;
    totalAmount: number;
  };
}

export function StatistiquesDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [stats, setStats] = useState<IntegratedStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les statistiques intégrées depuis l'API
  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getIntegratedStats()
      
      if (response.success && response.data) {
        setStats(response.data)
      } else {
        setError('Erreur lors du chargement des statistiques')
      }
    } catch (err) {
      console.error('Erreur statistiques dashboard:', err)
      setError('Impossible de charger les statistiques')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  // Calculer les données pour les graphiques à partir des stats réelles
  const getRevenueByDiscipline = () => {
    if (!stats?.disciplines) return []
    
    return stats.disciplines.map((d: any) => ({
      name: d.nom?.split(" ")[1] || d.nom || d.code,
      revenue: (d.participantsCount || 0) * (d.price || 100), // Estimation du prix
      participants: d.participantsCount || 0,
      paid: d.paidCount || 0,
    }))
  }

  const getParticipantsByType = () => {
    if (!stats?.disciplines || !stats?.groupes) return []
    
    const disciplines = stats.disciplines
    const groupes = stats.groupes
    
    return [
      {
        name: "Adultes",
        disciplines: disciplines
          .filter((d: any) => d.nom?.includes("Adultes") || d.type === "adulte")
          .reduce((sum: number, d: any) => sum + (d.participantsCount || 0), 0),
        groupes: groupes
          .filter((g: any) => g.type === "Adultes")
          .reduce((sum: number, g: any) => sum + (g.participantsCount || 0), 0),
      },
      {
        name: "Enfants",
        disciplines: disciplines
          .filter((d: any) => d.nom?.includes("Enfants") || d.type === "enfant")
          .reduce((sum: number, d: any) => sum + (d.participantsCount || 0), 0),
        groupes: groupes
          .filter((g: any) => g.type === "Enfants")
          .reduce((sum: number, g: any) => sum + (g.participantsCount || 0), 0),
      },
      {
        name: "Retraités",
        disciplines: disciplines
          .filter((d: any) => d.nom?.includes("Retraités") || d.type === "retraite")
          .reduce((sum: number, d: any) => sum + (d.participantsCount || 0), 0),
        groupes: groupes
          .filter((g: any) => g.type === "Retraités")
          .reduce((sum: number, g: any) => sum + (g.participantsCount || 0), 0),
      },
      {
        name: "Mixte",
        disciplines: 0,
        groupes: groupes
          .filter((g: any) => g.type === "Mixte")
          .reduce((sum: number, g: any) => sum + (g.participantsCount || 0), 0),
      },
    ]
  }

  const getOccupationData = () => {
    if (!stats?.groupes) return []
    
    return stats.groupes.map((g: any) => ({
      name: g.code,
      occupation: g.capacite > 0 ? Math.round(((g.participantsCount || 0) / g.capacite) * 100) : 0,
      participants: g.participantsCount || 0,
      capacite: g.capacite || 0,
      type: g.type,
    }))
  }

  const getPaymentStatusData = () => {
    if (!stats?.payments) return []
    
    return [
      { name: "Payé", value: stats.payments.completed, color: "#16a34a" },
      { name: "En attente", value: stats.payments.pending, color: "#dc2626" },
    ]
  }

  const getMonthlyTrend = () => {
    // Simulation de données mensuelles basées sur les stats actuelles
    const currentRevenue = stats?.overview?.totalRevenue || 0
    const currentParticipants = stats?.overview?.totalParticipants || 0
    
    return [
      { month: "Jan", revenue: Math.round(currentRevenue * 0.6), participants: Math.round(currentParticipants * 0.7), newInscriptions: 15 },
      { month: "Fév", revenue: Math.round(currentRevenue * 0.7), participants: Math.round(currentParticipants * 0.8), newInscriptions: 22 },
      { month: "Mar", revenue: Math.round(currentRevenue * 0.8), participants: Math.round(currentParticipants * 0.85), newInscriptions: 28 },
      { month: "Avr", revenue: Math.round(currentRevenue * 0.9), participants: Math.round(currentParticipants * 0.9), newInscriptions: 35 },
      { month: "Mai", revenue: Math.round(currentRevenue * 0.95), participants: Math.round(currentParticipants * 0.95), newInscriptions: 42 },
      { month: "Juin", revenue: currentRevenue, participants: currentParticipants, newInscriptions: 38 },
    ]
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <Loader2 size={32} className="animate-spin" />
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <AlertCircle size={32} className="text-red-500" />
          <p className="text-red-600">{error}</p>
          <button onClick={fetchStats} className="btn btn-primary">
            <RefreshCw size={16} />
            Réessayer
          </button>
        </div>
      </div>
    )
  }

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
            <div className="kpi-value">{stats?.overview?.totalRevenue?.toLocaleString() || '0'} DA</div>
            <div className="kpi-label">Revenus Total</div>
            <div className="kpi-trend positive">+12.5%</div>
          </div>
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats?.overview?.totalRevenue?.toLocaleString() || '0'} DA</div>
                <div className="stat-label">Revenus Total</div>
                <div className="stat-change positive">+12.5%</div>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats?.overview?.totalParticipants || 0}</div>
                <div className="stat-label">Total Participants</div>
                <div className="stat-change positive">+8.3%</div>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">
                <Activity size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats?.disciplines?.length || 0}</div>
                <div className="stat-label">Disciplines</div>
                <div className="stat-change neutral">
                  <span className="stat-detail">{stats?.groupes?.length || 0} Groupes</span>
                </div>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats?.overview?.paymentRate || 0}%</div>
                <div className="stat-label">Taux de Paiement</div>
                <div className="stat-change">
                  <span className="stat-detail">
                    {(stats?.overview?.paymentRate || 0) > 80 ? "Excellent" : (stats?.overview?.paymentRate || 0) > 60 ? "Bon" : "À améliorer"}
                  </span>
                  <span className="payment-ratio">
                    {stats?.payments?.completed || 0}/{(stats?.payments?.completed || 0) + (stats?.payments?.pending || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="stat-card secondary">
              <div className="stat-icon">
                <Target size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats?.overview?.occupationRate || 0}%</div>
                <div className="stat-label">Taux d'Occupation</div>
                <div className="stat-change">
                  <span className="stat-detail">
                    {stats?.groupes?.filter((g: any) => !g.isBlocked).length || 0} groupes actifs
                  </span>
                  <span className="occupation-status">
                    {(stats?.groupes?.filter((g: any) => !g.isBlocked).length || 0) > 10 ? "Optimal" : "Faible"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="kpi-card participants">
          <div className="kpi-icon">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{stats?.overview?.totalParticipants || 0}</div>
            <div className="kpi-label">Total Participants</div>
            <div className="kpi-trend positive">+8.3% vs mois dernier</div>
          </div>
          <div className="kpi-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Disciplines</span>
              <span className="breakdown-value">{stats?.disciplines?.reduce((sum: number, d: any) => sum + (d.participantsCount || 0), 0) || 0}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Groupes</span>
              <span className="breakdown-value">{stats?.groupes?.reduce((sum: number, g: any) => sum + (g.participantsCount || 0), 0) || 0}</span>
            </div>
          </div>
        </div>

        <div className="kpi-card payment">
          <div className="kpi-icon">
            <Target size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{stats?.overview?.paymentRate || 0}%</div>
            <div className="kpi-label">Taux de Paiement</div>
            <div className="kpi-trend positive">+3.2% vs mois dernier</div>
          </div>
          <div className="kpi-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats?.overview?.paymentRate || 0}%` }}></div>
            </div>
            <div className="progress-text">
              {stats?.payments?.completed || 0}/{(stats?.payments?.completed || 0) + (stats?.payments?.pending || 0)} payés
            </div>
          </div>
        </div>

        <div className="kpi-card occupation">
          <div className="kpi-icon">
            <Waves size={24} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{stats?.overview?.occupationRate || 0}%</div>
            <div className="kpi-label">Occupation Groupes</div>
            <div className="kpi-trend neutral">+1.5% vs mois dernier</div>
          </div>
          <div className="kpi-details">
            <div className="detail-item">
              <CheckCircle size={14} />
              <span>{stats?.groupes?.filter((g: any) => !g.isBlocked).length || 0} groupes actifs</span>
            </div>
            <div className="detail-item">
              <AlertCircle size={14} />
              <span>{stats?.groupes?.filter((g: any) => g.isBlocked).length || 0} bloqués</span>
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
              <BarChart data={getRevenueByDiscipline()}>
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
              <BarChart data={getParticipantsByType()}>
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
                  data={getPaymentStatusData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getPaymentStatusData().map((entry: any, index: number) => (
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
              <AreaChart data={getMonthlyTrend()}>
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
              {(stats?.disciplines || [])
                .sort((a: any, b: any) => (b.paidCount || 0) * (b.price || 100) - (a.paidCount || 0) * (a.price || 100))
                .slice(0, 5)
                .map((discipline: any, index: number) => (
                  <div key={discipline.code || index} className="performance-item">
                    <div className="performance-rank">#{index + 1}</div>
                    <div className="performance-info">
                      <div className="performance-name">{discipline.nom || discipline.code}</div>
                      <div className="performance-code">{discipline.code}</div>
                    </div>
                    <div className="performance-metrics">
                      <div className="performance-value">
                        {((discipline.paidCount || 0) * (discipline.price || 100)).toLocaleString()} DA
                      </div>
                      <div className="performance-participants">{discipline.participantsCount || 0} participants</div>
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
              {(stats?.groupes || [])
                .sort((a: any, b: any) => (b.participantsCount || 0) / (b.capacite || 1) - (a.participantsCount || 0) / (a.capacite || 1))
                .slice(0, 5)
                .map((groupe: any, index: number) => (
                  <div key={groupe.code || index} className="performance-item">
                    <div className="performance-rank">#{index + 1}</div>
                    <div className="performance-info">
                      <div className="performance-name">{groupe.code}</div>
                      <div className="performance-code">
                        {groupe.type} - {groupe.bassin || 'Piscine'}
                      </div>
                    </div>
                    <div className="performance-metrics">
                      <div className="performance-value">
                        {Math.round(((groupe.participantsCount || 0) / (groupe.capacite || 1)) * 100)}%
                      </div>
                      <div className="performance-participants">
                        {groupe.participantsCount || 0}/{groupe.capacite || 0}
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
