"use client"

import { CheckCircle, XCircle, Clock, Filter, Waves, Dumbbell } from "lucide-react"
import { useState } from "react"

// Données pour les réservations piscine
const reservationsPiscine = [
  {
    id: "P001",
    user: "Ahmed Benali",
    userType: "Collaborateur",
    matricule: "12345A",
    email: "ahmed.benali@ocp.ma",
    groupe: "A1-1",
    bassin: "Grand Bassin",
    date: "2024-01-15",
    heureDebut: "14:00",
    heureFin: "15:00",
    participants: 4,
    status: "acceptee",
    commentaire: "Réservation pour famille",
  },
  {
    id: "P002",
    user: "Fatima Zahra Alami",
    userType: "Collaboratrice",
    matricule: "67890B",
    email: "fatima.zahra@ocp.ma",
    groupe: "A1-2",
    bassin: "Petit Bassin",
    date: "2024-01-15",
    heureDebut: "16:00",
    heureFin: "17:00",
    participants: 1,
    status: "en_attente",
    commentaire: "Séance aquagym",
  },
  {
    id: "P003",
    user: "Mohamed Alami",
    userType: "Retraité",
    matricule: "54321C",
    email: "mohamed.alami@ocp.ma",
    groupe: "A2-1",
    bassin: "Grand Bassin",
    date: "2024-01-16",
    heureDebut: "10:00",
    heureFin: "11:30",
    participants: 5,
    status: "refusee",
    commentaire: "Formation plongée débutant",
  },
]

// Données pour les réservations sport
const reservationsSport = [
  {
    id: "S001",
    user: "Hassan Benjelloun",
    userType: "Collaborateur",
    matricule: "33445A",
    email: "hassan.benjelloun@ocp.ma",
    salle: "C001-1",
   
    date: "2024-01-15",
    heureDebut: "14:00",
    heureFin: "16:00",
    participants: 5,
    status: "acceptee",
    commentaire: "Match inter-services",
    paymentStatus: "Payé",
    totalAmount: 400,
    paidAmount: 400,
  },
  {
    id: "S002",
    user: "Aicha Benali",
    userType: "Collaboratrice",
    matricule: "55667B",
    email: "aicha.benali@ocp.ma",
    salle: "C058-2",
    activite: "Volleyball",
    date: "2024-01-15",
    heureDebut: "18:00",
    heureFin: "19:30",
    participants: 4,
    status: "en_attente",
    commentaire: "Tournoi féminin",
    paymentStatus: "Partiel",
    totalAmount: 220,
    paidAmount: 110,
  },
  {
    id: "S003",
    user: "Omar Tazi",
    userType: "Retraité",
    matricule: "987654321012",
    email: "omar.tazi@ocp.ma",
    salle: "C003-1",
    activite: "Basketball",
    date: "2024-01-16",
    heureDebut: "16:00",
    heureFin: "18:00",
    participants: 10,
    status: "refusee",
    commentaire: "Entraînement équipe",
    paymentStatus: "En attente",
    totalAmount: 800,
    paidAmount: 0,
  },
]

const getStatusBadge = (status: string) => {
  const statusConfig = {
    acceptee: {
      icon: CheckCircle,
      label: "Acceptée",
      backgroundColor: "#dcfce7",
      color: "#16a34a",
    },
    refusee: {
      icon: XCircle,
      label: "Refusée",
      backgroundColor: "#fee2e2",
      color: "#dc2626",
    },
    en_attente: {
      icon: Clock,
      label: "En Attente",
      backgroundColor: "#fef3c7",
      color: "#eab308",
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null

  const Icon = config.icon

  return (
    <span
      className="badge d-flex align-items-center gap-1"
      style={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        fontSize: "0.7rem",
      }}
    >
      <Icon size={10} />
      <span>{config.label}</span>
    </span>
  )
}

const getPaymentStatusBadge = (status: string) => {
  const statusConfig = {
    Payé: {
      icon: CheckCircle,
      label: "Payé",
      backgroundColor: "#dcfce7",
      color: "#16a34a",
    },
    Partiel: {
      icon: Clock,
      label: "Partiel",
      backgroundColor: "#fef3c7",
      color: "#eab308",
    },
    "En attente": {
      icon: XCircle,
      label: "En attente",
      backgroundColor: "#fee2e2",
      color: "#dc2626",
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null

  const Icon = config.icon

  return (
    <span
      className="badge d-flex align-items-center gap-1"
      style={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        fontSize: "0.7rem",
      }}
    >
      <Icon size={10} />
      <span>{config.label}</span>
    </span>
  )
}

export function RecentReservations() {
  const [activeTab, setActiveTab] = useState<"piscine" | "sport">("piscine")

  const currentReservations = activeTab === "piscine" ? reservationsPiscine : reservationsSport

  return (
    <div className="card border-0 shadow-sm bg-white p-3">
      {/* Header avec onglets */}
      <div className="card-header bg-transparent border-0 pb-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="card-title fw-bold mb-2" style={{ color: "#16a34a", fontSize: "1rem" }}>
              Réservations Récentes
            </h6>
            <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
              Dernières demandes de réservation
            </p>
          </div>
          <div className="d-flex gap-1">
           
            <button
              className="btn btn-sm text-white border-0"
              style={{ backgroundColor: "#16a34a", fontSize: "0.75rem" }}
            >
              Voir Tout
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="d-flex gap-2  p-2">
          <button
            className={`btn btn-sm d-flex align-items-center gap-2 border-0 ${
              activeTab === "piscine" ? "text-white" : ""
            }`}
            style={{
              backgroundColor: activeTab === "piscine" ? "#16a34a" : "#f0fdf4",
              color: activeTab === "piscine" ? "white" : "#16a34a",
              fontSize: "0.8rem",
              margin:"0.3rem",
              padding:"0.35rem"
            }}
            onClick={() => setActiveTab("piscine")}
          >
            <Waves size={16} />
            Piscine
          </button>
          <button
            className={`btn btn-sm d-flex align-items-center gap-2 border-0 ${
              activeTab === "sport" ? "text-white" : ""
            }`}
            style={{
              backgroundColor: activeTab === "sport" ? "#16a34a" : "#f0fdf4",
              color: activeTab === "sport" ? "white" : "#16a34a",
              fontSize: "0.8rem",
              margin:"0.3rem",
              padding:"0.35rem"
            }}
            onClick={() => setActiveTab("sport")}
          >
            <Dumbbell size={16} />
            Salles de Sport
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card-body">
        <div className="table-responsive  p-1">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  Utilisateur
                </th>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  Matricule
                </th>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  {activeTab === "piscine" ? "Groupe & Bassin" : "Salle & Activité"}
                </th>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  Date & Heure
                </th>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  Participants
                </th>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  Statut
                </th>
                {activeTab === "sport" && (
                  <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                    Paiement
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation) => {
                const priorityStyles = {
                  high: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                  normal: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                  low: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                }["normal"]

                return (
                  <tr key={reservation.id}>
                    <td className="align-middle py-2 px-3">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.7rem",
                            background: priorityStyles,
                          }}
                        >
                          {reservation.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ color: "#374151", fontSize: "0.8rem" }}>
                            {reservation.user}
                          </div>
                          <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                            {reservation.userType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle py-2 px-3">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "#f0fdf4",
                          color: "#16a34a",
                          fontSize: "0.7rem",
                        }}
                      >
                        #{reservation.matricule}
                      </span>
                    </td>
                    <td className="align-middle py-2 px-3">
                      {activeTab === "piscine" ? (
                        <div>
                          <div className="fw-medium" style={{ color: "#374151", fontSize: "0.8rem" }}>
                            {(reservation as any).groupe}
                          </div>
                          <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                            {(reservation as any).bassin}
                          </small>
                        </div>
                      ) : (
                        
                          <div className="fw-medium" style={{ color: "#374151", fontSize: "0.8rem", textAlign:"center" }}>
                            {(reservation as any).salle}
                          </div>
                        
              
                      )}
                    </td>
                    <td className="align-middle py-2 px-3">
                      <div>
                        <div className="fw-medium" style={{ color: "#374151", fontSize: "0.8rem" }}>
                          {reservation.date}
                        </div>
                        <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                          {reservation.heureDebut} - {reservation.heureFin}
                        </small>
                      </div>
                    </td>
                    <td className="align-middle py-2 px-3">
                      <div className="text-center">
                        <span className="fw-bold" style={{ color: "#16a34a", fontSize: "0.9rem" }}>
                          {reservation.participants}
                        </span>
                        <div className="small text-muted" style={{ fontSize: "0.7rem" }}>
                          participants
                        </div>
                      </div>
                    </td>
                    <td className="align-middle py-2 px-3">{getStatusBadge(reservation.status)}</td>
                    {activeTab === "sport" && (
                      <td className="align-middle py-2 px-3">
                        <div className="text-center">
                          {getPaymentStatusBadge((reservation as any).paymentStatus)}
                          <div className="small text-muted" style={{ fontSize: "0.7rem" }}>
                            {(reservation as any).paidAmount}/{(reservation as any).totalAmount} DH
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer bg-transparent border-0 py-2">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            Affichage de {currentReservations.length} réservations {activeTab === "piscine" ? "piscine" : "sport"}
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <span className="page-link border-0" style={{ backgroundColor: "#f9fafb", fontSize: "0.75rem" }}>
                  Précédent
                </span>
              </li>
              <li className="page-item active">
                <span
                  className="page-link border-0 text-white"
                  style={{ backgroundColor: "#16a34a", fontSize: "0.75rem" }}
                >
                  1
                </span>
              </li>
              <li className="page-item">
                <a
                  className="page-link border-0"
                  href="#"
                  style={{
                    backgroundColor: "#f9fafb",
                    color: "#16a34a",
                    fontSize: "0.75rem",
                    
                  
                  }}
                >
                  2
                </a>
              </li>
              <li className="page-item">
                <a
                  className="page-link border-0"
                  href="#"
                  style={{
                    backgroundColor: "#f9fafb",
                    color: "#16a34a",
                    fontSize: "0.75rem",
                    
                  }}
                >
                  Suivant
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
