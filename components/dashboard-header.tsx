"use client"

import { User, Bell, Settings } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm border-bottom mb-4 p-3 rounded-3">
      <div className="container-fluid">
        <div className="row align-items-center py-2">
          {/* Left Section */}
          <div className="col-md-8">
            <div className="d-flex align-items-center">
              <div className="me-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#f8f9fa",
                    border: "2px solid #16a34a",
                  }}   
                >
                  <span style={{ color: "#16a34a", fontWeight: "bold", fontSize: "15px" }}>OCP</span>
                </div>
              </div>
              <div>
                <h1 className="h5 mb-0 fw-bold text-dark">
                  Dashboard
                  <span className="ms-2" style={{ color: "#16a34a" }}>
                    OCP Sport
                  </span>
                </h1>
                <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
                  Vue d'ensemble des activités sportives •{" "}
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-end gap-2">
              {/* Notifications */}
              <div className="position-relative">
                <button
                  className="btn btn-light btn-sm rounded-circle p-1 position-relative border-0"
                  style={{ backgroundColor: "#f0fdf4", width: "32px", height: "32px" }}
                >
                  <Bell size={16} style={{ color: "#16a34a" }} />
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{
                      fontSize: "0.5rem",
                      backgroundColor: "#16a34a",
                      color: "white",
                    }}
                  >
                    3
                  </span>
                </button>
              </div>

              {/* Settings */}
              <button
                className="btn btn-light btn-sm rounded-circle p-1 border-0"
                style={{ backgroundColor: "#f0fdf4", width: "32px", height: "32px" }}
              >
                <Settings size={16} style={{ color: "#16a34a" }} />
              </button>

              {/* User Profile */}
              <div className="dropdown">
                <button
                  className="btn btn-light d-flex align-items-center gap-2 dropdown-toggle border-0 py-1 px-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{ backgroundColor: "#f0fdf4" }}
                >
                  <div
                    className="text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    }}
                  >
                    <User size={14} />
                  </div>
                  <div className="text-start d-none d-md-block">
                    <div className="fw-semibold" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                      Admin OCP
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                      Administrateur
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
