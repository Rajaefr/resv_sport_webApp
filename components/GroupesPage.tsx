"use client"

import { useState } from "react"
import { Search, Download, Plus, Waves, Users, Clock, AlertTriangle } from "lucide-react"

interface Groupe {
  code: string
  horaires: string
  participantsCount: number
  capacite: number
  isBlocked: boolean
  bassin: string
  type: string
}

const groupesData: Groupe[] = [
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

export function GroupesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredGroupes = groupesData.filter((groupe) => {
    const matchesSearch =
      groupe.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      groupe.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && !groupe.isBlocked) ||
      (statusFilter === "blocked" && groupe.isBlocked)
    return matchesSearch && matchesStatus
  })

  const getGroupStatusBadge = (isBlocked: boolean) => (
    <span
      className="badge"
      style={{
        backgroundColor: isBlocked ? "#fee2e2" : "#dcfce7",
        color: isBlocked ? "#dc2626" : "#16a34a",
        fontSize: "0.7rem",
      }}
    >
      {isBlocked ? "Bloqué" : "Ouvert"}
    </span>
  )

  const getOccupationBadge = (participants: number, capacite: number) => {
    const percent = Math.round((participants / capacite) * 100)
    let backgroundColor, color
    if (percent >= 90) {
      backgroundColor = "#fee2e2"
      color = "#dc2626"
    } else if (percent >= 70) {
      backgroundColor = "#fef3c7"
      color = "#eab308"
    } else {
      backgroundColor = "#dcfce7"
      color = "#16a34a"
    }

    return (
      <span className="badge" style={{ backgroundColor, color, fontSize: "0.7rem" }}>
        {percent}%
      </span>
    )
  }

  const totalGroupes = groupesData.length
  const openGroupes = groupesData.filter((g) => !g.isBlocked).length
  const totalParticipants = groupesData.reduce((sum, g) => sum + g.participantsCount, 0)
  const totalCapacite = groupesData.reduce((sum, g) => sum + g.capacite, 0)

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8fffe", minHeight: "100vh" }}>
      {/* Header */}
      <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="d-flex align-items-center mb-2" style={{ color: "#16a34a", fontSize: "1.8rem" }}>
              <Waves size={32} className="me-3" />
              Groupes Piscine
            </h1>
            <p className="text-muted mb-0">
              Gestion des groupes et horaires de natation • {filteredGroupes.length} groupes
            </p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary">
              <Download size={16} className="me-1" />
              Exporter
            </button>
            <button className="btn text-white" style={{ backgroundColor: "#16a34a" }}>
              <Plus size={16} className="me-1" />
              Nouveau Groupe
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{
                  width: "50px",
                  height: "50px",
                  background: "linear-gradient(135deg, #3498db, #2980b9)",
                }}
              >
                <Waves size={24} className="text-white" />
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#16a34a" }}>
                  {totalGroupes}
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Total Groupes
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{
                  width: "50px",
                  height: "50px",
                  background: "linear-gradient(135deg, #27ae60, #229954)",
                }}
              >
                <Users size={24} className="text-white" />
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#16a34a" }}>
                  {openGroupes}
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Ouverts
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{
                  width: "50px",
                  height: "50px",
                  background: "linear-gradient(135deg, #9b59b6, #8e44ad)",
                }}
              >
                <Users size={24} className="text-white" />
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#16a34a" }}>
                  {totalParticipants}
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Participants
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{
                  width: "50px",
                  height: "50px",
                  background: "linear-gradient(135deg, #f39c12, #e67e22)",
                }}
              >
                <AlertTriangle size={24} className="text-white" />
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#16a34a" }}>
                  {Math.round((totalParticipants / totalCapacite) * 100)}%
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Occupation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
        <div className="d-flex gap-3 align-items-center">
          <div className="position-relative flex-grow-1">
            <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            <input
              type="text"
              placeholder="Rechercher un groupe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control ps-5"
              style={{ borderColor: "#e5e7eb" }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: "200px", borderColor: "#e5e7eb" }}
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouverts</option>
            <option value="blocked">Bloqués</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Code Groupe
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Type & Bassin
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Horaires
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Participants
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Occupation
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGroupes.map((groupe) => (
                <tr key={groupe.code}>
                  <td className="align-middle py-3 px-4">
                    <span
                      className="badge fw-bold"
                      style={{
                        backgroundColor: "#f0fdf4",
                        color: "#16a34a",
                        fontSize: "0.9rem",
                      }}
                    >
                      {groupe.code}
                    </span>
                  </td>
                  <td className="align-middle py-3 px-4">
                    <div>
                      <div className="fw-semibold" style={{ color: "#374151", fontSize: "0.85rem" }}>
                        {groupe.type}
                      </div>
                      <small className="text-muted">{groupe.bassin}</small>
                    </div>
                  </td>
                  <td className="align-middle py-3 px-4">
                    <div className="d-flex align-items-center gap-1">
                      <Clock size={14} style={{ color: "#16a34a" }} />
                      <span style={{ fontSize: "0.85rem" }}>{groupe.horaires}</span>
                    </div>
                  </td>
                  <td className="align-middle py-3 px-4">
                    <div className="text-center">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "#e0f2fe",
                          color: "#0369a1",
                          fontSize: "0.8rem",
                        }}
                      >
                        {groupe.participantsCount}/{groupe.capacite}
                      </span>
                    </div>
                  </td>
                  <td className="align-middle py-3 px-4 text-center">
                    {getOccupationBadge(groupe.participantsCount, groupe.capacite)}
                  </td>
                  <td className="align-middle py-3 px-4 text-center">{getGroupStatusBadge(groupe.isBlocked)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
