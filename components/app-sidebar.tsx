"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  FileText,
  Home,
  Database,
  Users,
  Waves,
  Upload,
  Bell,
  Dumbbell,
  ChevronDown,
  Menu,
  X,
  BarChart3,
  Settings,
} from "lucide-react"
import { useState } from "react"

interface SubMenuItem {
  title: string
  url: string
  icon: React.ComponentType<any>
  badge?: string
}

interface MenuItem {
  title: string
  icon: React.ComponentType<any>
  url?: string
  badge?: string
  items?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
  },
  {
    title: "Réservations",
    icon: Calendar,
    badge: "47",
    items: [
      { title: "Piscine", url: "/reservations/piscine", icon: Waves, badge: "15" },
      { title: "Salle de Sport", url: "/reservations/sport", icon: Dumbbell, badge: "32" },
    ],
  },
  {
    title: "Utilisateurs",
    icon: Users,
    url: "/users",
    badge: "1.2k",
  },
  {
    title: "Données",
    icon: Database, // Changer de Settings à Database
    items: [
      { title: "Codes Disciplines", url: "/data/discipline-code", icon: FileText },
      { title: "Groupes Piscine", url: "/data/groupes", icon: Waves },
      { title: "Statistiques", url: "/data/statistics", icon: BarChart3 }, // Remplacer Tarification par Statistiques
    ],
  },
  {
    title: "Import/Export",
    icon: Upload,
    url: "/import-export",
  },
  {
    title: "Notifications",
    icon: Bell,
    url: "/notifications",
    badge: "3",
  },
]

export function AppSidebar() {
  const [expandedItems, setExpandedItems] = useState<number[]>([1])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div
      data-sidebar="true" // Ajouter cet attribut
      className={`bg-white shadow-sm border-end vh-100 position-fixed top-0 start-0`}
      style={{
        width: isCollapsed ? "70px" : "260px",
        transition: "width 0.3s ease",
        zIndex: 1000,
      }}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-bottom">
        <div className="d-flex align-items-center justify-content-between">
          <button
            className="btn btn-sm rounded-circle p-2 border-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ backgroundColor: "#f0fdf4" }}
          >
            {isCollapsed ? (
              <Menu size={18} style={{ color: "#16a34a" }} />
            ) : (
              <X size={18} style={{ color: "#16a34a" }} />
            )}
          </button>

          {!isCollapsed && (
            <div className="ms-2">
              <h5 className="fw-bold mb-0" style={{ color: "#16a34a", fontSize: "1rem" }}>
                OCP Sport
              </h5>
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                Administration
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 overflow-auto" style={{ height: "calc(100vh - 140px)" }}>
        <div className="p-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isExpanded = expandedItems.includes(index)
            const isActive = item.url ? pathname === item.url : false

            return (
              <div key={item.title} className="mb-1">
                {item.items ? (
                  <>
                    <button
                      className={`btn w-100 text-start d-flex align-items-center justify-content-between p-2 border-0`}
                      onClick={() => toggleExpanded(index)}
                      style={{
                        backgroundColor: isExpanded ? "#f0fdf4" : "transparent",
                        color: isExpanded ? "#16a34a" : "#374151",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <Icon size={20} className="me-2" />
                        {!isCollapsed && (
                          <>
                            <span className="fw-medium">{item.title}</span>
                            {item.badge && (
                              <span
                                className="badge ms-2"
                                style={{ backgroundColor: "#16a34a", color: "white", fontSize: "0.7rem" }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform`}
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        />
                      )}
                    </button>

                    {!isCollapsed && (
                      <div className={`collapse ${isExpanded ? "show" : ""}`}>
                        <div className="ms-3 mt-1">
                          {item.items.map((subItem) => {
                            const SubIcon = subItem.icon
                            const isSubActive = pathname === subItem.url

                            return (
                              <Link
                                key={subItem.title}
                                href={subItem.url}
                                className={`btn w-100 text-start d-flex align-items-center p-2 mb-1 border-0`}
                                style={{
                                  backgroundColor: isSubActive ? "#16a34a" : "transparent",
                                  color: isSubActive ? "white" : "#6b7280",
                                  fontSize: "0.8rem",
                                }}
                              >
                                <SubIcon size={16} className="me-2" />
                                <span>{subItem.title}</span>
                                {subItem.badge && (
                                  <span
                                    className="badge ms-auto"
                                    style={{
                                      backgroundColor: isSubActive ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                                      color: isSubActive ? "white" : "#6b7280",
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : item.url ? (
                  <Link
                    href={item.url}
                    className={`btn w-100 text-start d-flex align-items-center p-2 border-0`}
                    style={{
                      backgroundColor: isActive ? "#16a34a" : "transparent",
                      color: isActive ? "white" : "#374151",
                      fontSize: "0.85rem",
                    }}
                  >
                    <Icon size={20} className="me-2" />
                    {!isCollapsed && (
                      <>
                        <span className="fw-medium">{item.title}</span>
                        {item.badge && (
                          <span
                            className="badge ms-auto"
                            style={{
                              backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                              color: isActive ? "white" : "#6b7280",
                              fontSize: "0.7rem",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                ) : (
                  <button
                    className={`btn w-100 text-start d-flex align-items-center p-2 border-0`}
                    style={{
                      backgroundColor: isActive ? "#16a34a" : "transparent",
                      color: isActive ? "white" : "#374151",
                      fontSize: "0.85rem",
                    }}
                  >
                    <Icon size={20} className="me-2" />
                    {!isCollapsed && (
                      <>
                        <span className="fw-medium">{item.title}</span>
                        {item.badge && (
                          <span
                            className="badge ms-auto"
                            style={{
                              backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                              color: isActive ? "white" : "#6b7280",
                              fontSize: "0.7rem",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-top p-3" style={{ backgroundColor: "#f9fafb" }}>
        {/* Paramètres */}
        <div className="mb-2">
          <Link
            href="/settings"
            className="btn w-100 text-start d-flex align-items-center p-2 border-0"
            style={{
              backgroundColor: "transparent",
              color: "#374151",
              fontSize: "0.85rem",
            }}
          >
            <Settings size={20} className="me-2" />
            {!isCollapsed && <span className="fw-medium">Paramètres</span>}
          </Link>
        </div>

        {/* Profile utilisateur */}
        <div className="d-flex align-items-center">
          <div
            className="text-white rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            }}
          >
            <Users size={18} />
          </div>
          {!isCollapsed && (
            <div>
              <div className="fw-semibold" style={{ color: "#16a34a", fontSize: "0.8rem" }}>
                Admin OCP
              </div>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                Administrateur
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
