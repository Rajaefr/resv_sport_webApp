"use client"

import { TrendingUp, Users, DollarSign, Calendar, BarChart3, Activity, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { apiService } from "../lib/apiService"

interface DashboardStats {
  overview: {
    totalReservations: number;
    totalRevenue: number;
    totalUsers: number;
    totalActivities: number;
    occupationRate: number;
  };
  monthlyStats: any[];
  occupationStats: any[];
}

interface MonthlyData {
  month: string;
  reservations: number;
  revenue: number;
}

interface OccupationData {
  hour: number;
  reservations: number;
  avg_participants: number;
}

interface RevenueByDiscipline {
  code: string;
  discipline: string;
  revenue: number;
  reservations_count: number;
  unique_users: number;
}

interface OccupationRate {
  activity_name: string;
  discipline_code: string;
  total_reservations: number;
  avg_participants: number;
  max_capacity: number;
  occupation_rate: number;
}

export function StatsChart() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyData[]>([]);
  const [revenueByDiscipline, setRevenueByDiscipline] = useState<RevenueByDiscipline[]>([]);
  const [occupationRates, setOccupationRates] = useState<OccupationRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        dashboardResponse,
        monthlyResponse,
        revenueResponse,
        occupationResponse
      ] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getMonthlyTrends(),
        apiService.getRevenueByDiscipline(),
        apiService.getOccupationRates()
      ]);

      setStats(dashboardResponse.data);
      setMonthlyTrends(monthlyResponse.data.monthlyTrends);
      setRevenueByDiscipline(revenueResponse.data.revenueByDiscipline);
      setOccupationRates(occupationResponse.data.occupationRates);
      
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3 shadow-sm border p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-3 shadow-sm border p-4">
        <div className="alert alert-danger" role="alert">
          {error || 'Erreur lors du chargement des statistiques'}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={fetchAllData}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const maxReservations = (monthlyTrends || []).length > 0 ? Math.max(...(monthlyTrends || []).map((d) => d.reservations)) : 1;
  const maxRevenue = (revenueByDiscipline || []).length > 0 ? Math.max(...(revenueByDiscipline || []).map((d) => d.revenue)) : 1;

  // Convertir les données d'occupation par heure pour le graphique
  const occupationData = (stats.occupationStats || []).map((item: any) => ({
    time: `${item.hour.toString().padStart(2, '0')}:00`,
    rate: Math.round((item.avg_participants / 30) * 100) // Estimation basée sur capacité moyenne de 30
  }));

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
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm d-flex align-items-center gap-2"
            style={{ backgroundColor: "#16a34a", color: "white", border: "none" }}
          >
            <Calendar size={14} />
            Derniers 6 mois
          </button>
          <button 
            className="btn btn-light btn-sm border-0" 
            style={{ backgroundColor: "#f9fafb" }}
            onClick={fetchAllData}
            disabled={loading}
          >
            <RefreshCw size={14} style={{ color: "#16a34a" }} />
          </button>
        </div>
      </div>

      {/* Cards statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="rounded-2 p-3 border" style={{ backgroundColor: "#f0fdf4" }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted small">Total Réservations</p>
                <h5 className="mb-0 fw-bold" style={{ color: "#16a34a" }}>
                  {(stats.overview?.totalReservations || 0).toLocaleString()}
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
                  {(stats.overview?.totalRevenue || 0).toLocaleString()}dh
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
                  {(stats.overview?.occupationRate || 0)}%
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
                <p className="mb-1 text-muted small">Activités</p>
                <h5 className="mb-0 fw-bold" style={{ color: "#16a34a" }}>
                  {stats.overview?.totalActivities || 0}
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
              {(monthlyTrends || []).map((data: MonthlyData, index: number) => (
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
                    (occupationData || []).map((d, i) => `${40 + i * 35},${140 - d.rate * 1.1}`).join(" ") + ` 280,140 40,140`
                  }
                />
                <polyline
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  points={(occupationData || []).map((d, i) => `${40 + i * 35},${140 - d.rate * 1.1}`).join(" ")}
                />
                {/* Points de données */}
                {(occupationData || []).map((d, i) => (
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
                {(occupationData || []).map((d, i) => (
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
              {(revenueByDiscipline || []).map((item: RevenueByDiscipline, index: number) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between p-3 rounded-2"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge text-white fw-medium px-2 py-1" style={{ backgroundColor: "#16a34a" }}>
                      {item.code}
                    </span>
                    <span className="fw-medium text-dark">
                      {item.discipline}
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold" style={{ color: "#16a34a" }}>
                      {Number(item.revenue).toLocaleString()}dh
                    </div>
                    <div className="progress mt-1" style={{ width: "80px", height: "4px" }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${(Number(item.revenue) / maxRevenue) * 100}%`,
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
              {(occupationRates || []).slice(0, 8).map((activity: OccupationRate, index: number) => (
                <div key={index} className="p-3 rounded-2" style={{ backgroundColor: "#f8f9fa" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge text-white fw-medium px-2 py-1" style={{ backgroundColor: "#16a34a" }}>
                        {activity.discipline_code}
                      </span>
                      <span className="fw-medium text-dark">
                        {Math.round(activity.avg_participants)}/{activity.max_capacity}
                      </span>
                    </div>
                    <span
                      className={`fw-bold ${
                        activity.occupation_rate >= 90 ? "text-danger" : activity.occupation_rate >= 70 ? "text-warning" : ""
                      }`}
                      style={{ color: activity.occupation_rate < 70 ? "#16a34a" : undefined }}
                    >
                      {Math.round(activity.occupation_rate)}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${activity.occupation_rate}%`,
                        backgroundColor:
                          activity.occupation_rate >= 90 ? "#f04848" : activity.occupation_rate >= 70 ? "#f7e14f" : "#16a318",
                      }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small className="text-muted">{activity.activity_name}</small>
                    <small style={{ color: "#16a34a" }}>
                      {activity.max_capacity - Math.round(activity.avg_participants)} places libres
                    </small>
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
