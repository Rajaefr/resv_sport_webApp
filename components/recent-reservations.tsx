"use client"

import { CheckCircle, XCircle, Clock, Filter, Waves, Dumbbell, Calendar, Users, UserCheck } from "lucide-react"
import { useState, useEffect } from "react"

// Données mockées pour les réservations piscine (identiques à reservations-piscine.tsx)
const reservationsPiscineData = [
  {
    id: "P001",
    user: "Ahmed Rehani",
    userType: "Collaborateur",
    matricule: "12345A",
    email: "ahmed.Rehani@ocp.ma",
    date: "2025-08-15",
    heureDebut: "14:00",
    participants: 4,
    status: "acceptee",
    dateCreation: "2025-07-10",
    commentaire: "Réservation pour famille",
    participantsList: [
      { nom: "Ahmed", prenom: "Rehani", type: "Collaborateur", groupe: "A1-1" },
      { nom: "Fatima", prenom: "Rehani", type: "Conjoint", groupe: "A1-1" },
      { nom: "Sara", prenom: "Rehani", type: "Enfant", age: 12, groupe: "A1-2" },
      { nom: "Omar", prenom: "Rehani", type: "Enfant", age: 8, groupe: "A1-2" },
    ],
  },
  {
    id: "P002",
    user: "Fatima Zahra Reda",
    userType: "Collaboratrice",
    matricule: "67890B",
    email: "fatima.zahra@ocp.ma",
    date: "2025-07-15",
    heureCreation: "16:00",
    participants: 1,
    status: "en_attente",
    dateCreation: "2025-07-12",
    participantsList: [{ nom: "Fatima Zahra", prenom: "Reda", type: "Collaboratrice", groupe: "A1-2" }],
  },
  {
    id: "P003",
    user: "Mohamed reda",
    userType: "Retraité",
    matricule: "54321C",
    email: "mohamed.reda@ocp.ma",
    date: "2025-07-16",
    heureCreation: "10:00",
    participants: 5,
    status: "refusee",
    dateCreation: "2025-07-11",
    participantsList: [
      { nom: "Mohamed", prenom: "Reda", type: "Retraité", groupe: "A2-1" },
      { nom: "Khadija", prenom: "Reda", type: "Conjoint", groupe: "A2-1" },
      { nom: "Yassine", prenom: "Reda", type: "Enfant", age: 10, groupe: "A2-2" },
      { nom: "Salma", prenom: "Reda", type: "Enfant", age: 14, groupe: "A2-2" },
      { nom: "Ali", prenom: "Reda", type: "Enfant", age: 16, groupe: "A2-2" },
    ],
  },
  {
    id: "P004",
    user: "Khadija Riad",
    userType: "Retraitée",
    matricule: "98765D",
    email: "khadija.Riad@ocp.ma",
    date: "2025-07-16",
    heureCreation: "18:00",
    participants: 2,
    status: "en_attente",
    dateCreation: "2025-07-13",
    participantsList: [
      { nom: "Khadija", prenom: "Riad", type: "Retraitée", groupe: "A2-2" },
      { nom: "Abdellah", prenom: "Riad", type: "Conjoint", groupe: "A2-2" },
    ],
  },
  {
    id: "P005",
    user: "Youssef Idrissi",
    userType: "Collaborateur",
    matricule: "11223E",
    email: "youssef.idrissi@ocp.ma",
    date: "2025-08-17",
    heureCreation: "08:00",
    participants: 4,
    status: "acceptee",
    dateCreation: "2025-08-14",
    participantsList: [
      { nom: "Youssef", prenom: "Idrissi", type: "Collaborateur", groupe: "A1-3" },
      { nom: "Leila", prenom: "Idrissi", type: "Conjoint", groupe: "A1-3" },
      { nom: "Amine", prenom: "Idrissi", type: "Enfant", age: 7, groupe: "A1-4" },
      { nom: "Nadia", prenom: "Idrissi", type: "Enfant", age: 11, groupe: "A1-4" },
    ],
  },
]

// Données mockées pour les réservations sport (identiques à reservations-sport.tsx)
const reservationsSportData = [
  {
    id: "S001",
    user: "Hassan Rafik",
    userType: "Collaborateur",
    matricule: "33445A",
    email: "hassan.Rafik@ocp.ma",
    salle: "C001-1",
    date: "2025-01-15",
    heureCreation: "14:00",
    participants: 5,
    status: "acceptee",
    commentaire: "Match inter-services",
    paymentStatus: "PAID",
    totalAmount: 400,
    paidAmount: 400,
  },
  {
    id: "S002",
    user: "Aicha Rehani",
    userType: "Collaboratrice",
    matricule: "55667B",
    email: "aicha.Rehani@ocp.ma",
    salle: "C058-2",
    activite: "Volleyball",
    date: "2025-01-15",
    heureCreation: "18:00",
    participants: 4,
    status: "en_attente",
    commentaire: "Tournoi féminin",
    paymentStatus: "PARTIAL",
    totalAmount: 220,
    paidAmount: 110,
  },
  {
    id: "S003",
    user: "Omar Arif",
    userType: "Retraité",
    matricule: "987654321012",
    email: "omar.Arif@ocp.ma",
    salle: "C003-1",
    activite: "Basketball",
    date: "2025-01-16",
    heureCreation: "16:00",
    participants: 10,
    status: "refusee",
    commentaire: "Entraînement équipe",
    paymentStatus: "PENDING",
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
    PAID: {
      icon: CheckCircle,
      label: "Payé",
      backgroundColor: "#dcfce7",
      color: "#16a34a",
    },
    PARTIAL: {
      icon: Clock,
      label: "Partiel",
      backgroundColor: "#fef3c7",
      color: "#eab308",
    },
    PENDING: {
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
  const [reservationsPiscine, setReservationsPiscine] = useState<any[]>(reservationsPiscineData.slice(0, 5))
  const [reservationsSport, setReservationsSport] = useState<any[]>(reservationsSportData.slice(0, 5))

  // Fonction pour rafraîchir les données (appelée depuis les autres composants)
  const refreshData = () => {
    // Récupérer les données les plus récentes depuis les autres composants
    if ((window as any).getLatestPiscineReservations) {
      const latestPiscine = (window as any).getLatestPiscineReservations()
      setReservationsPiscine(latestPiscine.slice(0, 5))
    }
    if ((window as any).getLatestSportReservations) {
      const latestSport = (window as any).getLatestSportReservations()
      setReservationsSport(latestSport.slice(0, 5))
    }
  }

  // Exposer la fonction de rafraîchissement globalement
  useEffect(() => {
    (window as any).refreshRecentReservations = refreshData
    return () => {
      delete (window as any).refreshRecentReservations
    }
  }, [])

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
        <div className="d-flex gap-2 p-2">
          <button
            className={`btn btn-sm d-flex align-items-center gap-2 border-0 ${
              activeTab === "piscine" ? "text-white" : ""
            }`}
            style={{
              backgroundColor: activeTab === "piscine" ? "#16a34a" : "#f0fdf4",
              color: activeTab === "piscine" ? "white" : "#16a34a",
              fontSize: "0.8rem",
              margin: "0.3rem",
              padding: "0.35rem"
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
              margin: "0.3rem",
              padding: "0.35rem"
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
        <div className="table-responsive p-1">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  {activeTab === "piscine" ? "Titulaire" : "Utilisateur"}
                </th>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  Type & Matricule
                </th>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  Date & Heure
                </th>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  Participants
                </th>
                <th className="border-0 fw-semibold py-2 px-3" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                  {activeTab === "piscine" ? "Statut" : "Statut Réservation"}
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
                            {reservation.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle py-2 px-3">
                      <div className="d-flex flex-column">
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <UserCheck size={12} />
                          <span style={{ fontSize: "0.75rem", color: "#374151" }}>
                            {reservation.userType}
                          </span>
                        </div>
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
                      </div>
                    </td>
                    <td className="align-middle py-2 px-3">
                      <div className="d-flex flex-column">
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <Calendar size={12} />
                          <span style={{ fontSize: "0.75rem", color: "#374151" }}>
                            {reservation.date}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <Clock size={12} />
                          <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
                            {reservation.heureDebut || reservation.heureCreation}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle py-2 px-3">
                      <div className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          <Users size={12} />
                          <span className="fw-bold" style={{ color: "#16a34a", fontSize: "0.9rem" }}>
                            {reservation.participants}
                          </span>
                        </div>
                        <div className="small text-muted" style={{ fontSize: "0.7rem" }}>
                          participants
                        </div>
                      </div>
                    </td>
                    <td className="align-middle py-2 px-3">{getStatusBadge(reservation.status)}</td>
                    {activeTab === "sport" && (
                      <td className="align-middle py-2 px-3">
                        <div className="text-center">
                          {getPaymentStatusBadge(reservation.paymentStatus)}
                          <div className="small text-muted" style={{ fontSize: "0.7rem" }}>
                            {reservation.paidAmount}/{reservation.totalAmount} DH
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

export default RecentReservations;
