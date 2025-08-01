"use client"

import { useState } from "react"
import { Search, Download, Plus, FileText, TrendingUp, Users, DollarSign } from "lucide-react"

interface Discipline {
  code: string
  nom: string
  participantsCount: number
  paidCount: number
  isActive: boolean
  price: number
}

const disciplinesData: Discipline[] = [
  { code: "C001-1", nom: "Adultes Musculation", participantsCount: 25, paidCount: 20, isActive: true, price: 80 },
  { code: "C001-2", nom: "Enfants Musculation", participantsCount: 15, paidCount: 12, isActive: true, price: 50 },
  { code: "C058-1", nom: "Adultes Gym", participantsCount: 30, paidCount: 25, isActive: true, price: 100 },
  { code: "C058-2", nom: "Enfants Gym", participantsCount: 18, paidCount: 10, isActive: false, price: 60 },
  { code: "C058-3", nom: "Adultes Gym & Swim", participantsCount: 12, paidCount: 12, isActive: true, price: 150 },
  { code: "C058-4", nom: "Enfants Gym & Swim", participantsCount: 8, paidCount: 6, isActive: true, price: 90 },
  { code: "C025-1", nom: "Adultes Fitness", participantsCount: 22, paidCount: 18, isActive: true, price: 120 },
  { code: "C025-2", nom: "Enfants Fitness", participantsCount: 10, paidCount: 8, isActive: false, price: 70 },
]

export function DisciplinesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDisciplines = disciplinesData.filter((discipline) => {
    const matchesSearch =
      discipline.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discipline.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && discipline.isActive) ||
      (statusFilter === "inactive" && !discipline.isActive)
    return matchesSearch && matchesStatus
  })

  const getPaymentBadge = (paid: number, total: number) => {
    const percent = Math.round((paid / total) * 100)
    let backgroundColor, color
    if (percent === 100) {
      backgroundColor = "#dcfce7"
      color = "#16a34a"
    } else if (percent >= 50) {
      backgroundColor = "#fef3c7"
      color = "#eab308"
    } else {
      backgroundColor = "#fee2e2"
      color = "#dc2626"
    }

    return (
      <span className="badge d-flex align-items-center gap-1" style={{ backgroundColor, color, fontSize: "0.7rem" }}>
        <DollarSign size={10} />
        {percent}% ({paid}/{total})
      </span>
    )
  }

  const getStatusBadge = (isActive: boolean) => (
    <span
      className="badge"
      style={{
        backgroundColor: isActive ? "#dcfce7" : "#f3f4f6",
        color: isActive ? "#16a34a" : "#6b7280",
        fontSize: "0.7rem",
      }}
    >
      {isActive ? "Actif" : "Inactif"}
    </span>
  )

  const totalParticipants = disciplinesData.reduce((sum, d) => sum + d.participantsCount, 0)
  const totalPaid = disciplinesData.reduce((sum, d) => sum + d.paidCount, 0)
  const activeDisciplines = disciplinesData.filter((d) => d.isActive).length
  const totalRevenue = disciplinesData.reduce((sum, d) => sum + d.paidCount * d.price, 0)

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8fffe", minHeight: "100vh" }}>
      {/* Header */}
      <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="d-flex align-items-center mb-2" style={{ color: "#16a34a", fontSize: "1.8rem" }}>
              <FileText size={32} className="me-3" />
              Codes de Discipline
            </h1>
            <p className="text-muted mb-0">
              Gestion des disciplines sportives et tarification • {filteredDisciplines.length} disciplines
            </p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary">
              <Download size={16} className="me-1" />
              Exporter
            </button>
            <button className="btn text-white" style={{ backgroundColor: "#16a34a" }}>
              <Plus size={16} className="me-1" />
              Nouvelle Discipline
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
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#16a34a" }}>
                  {disciplinesData.length}
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Total Disciplines
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
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#16a34a" }}>
                  {activeDisciplines}
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Actives
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
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#16a34a" }}>
                  {totalRevenue} DH
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Revenus
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
              placeholder="Rechercher par code ou nom..."
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
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
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
                  Code
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Nom
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Prix
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Participants
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  % Paiement
                </th>
                <th className="border-0 fw-semibold py-3 px-4" style={{ color: "#16a34a" }}>
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDisciplines.map((discipline) => (
                <tr key={discipline.code}>
                  <td className="align-middle py-3 px-4">
                    <span
                      className="badge fw-bold"
                      style={{
                        backgroundColor: "#f0fdf4",
                        color: "#16a34a",
                        fontSize: "0.8rem",
                      }}
                    >
                      {discipline.code}
                    </span>
                  </td>
                  <td className="align-middle py-3 px-4">
                    <span className="fw-semibold" style={{ color: "#374151" }}>
                      {discipline.nom}
                    </span>
                  </td>
                  <td className="align-middle py-3 px-4">
                    <span className="fw-bold" style={{ color: "#16a34a" }}>
                      {discipline.price} DH
                    </span>
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
                        {discipline.participantsCount}
                      </span>
                    </div>
                  </td>
                  <td className="align-middle py-3 px-4 text-center">
                    {getPaymentBadge(discipline.paidCount, discipline.participantsCount)}
                  </td>
                  <td className="align-middle py-3 px-4 text-center">{getStatusBadge(discipline.isActive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
