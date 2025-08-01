"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  FileText,
  Home,
  Settings,
  Users,
  Waves,
  Upload,
  BarChart3,
  Bell,
  Dumbbell,
  ChevronDown,
  Menu,
  X,
  Database,
  Shield,
} from "lucide-react"
import { useState, useEffect } from "react"

interface SubMenuItem {
  title: string
  url: string
  icon: React.ComponentType<any>
  badge?: string
  description?: string
}

interface MenuItem {
  title: string
  icon: React.ComponentType<any>
  url?: string
  badge?: string
  items?: SubMenuItem[]
  description?: string
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
    description: "Vue d'ensemble",
  },
  {
    title: "Réservations",
    icon: Calendar,
    badge: "47",
    description: "Gestion des réservations",
    items: [
      {
        title: "Piscine",
        url: "/reservations/piscine",
        icon: Waves,
        badge: "15",
        description: "Réservations piscine",
      },
      {
        title: "Salle de Sport",
        url: "/reservations/sport",
        icon: Dumbbell,
        badge: "32",
        description: "Réservations sport",
      },
    ],
  },
  {
    title: "Utilisateurs",
    icon: Users,
    url: "/users",
    badge: "1.2k",
    description: "Gestion des utilisateurs",
  },
  {
    title: "Données",
    icon: Database,
    description: "Gestion des données",
    items: [
      {
        title: "Codes Disciplines",
        url: "/data/discipline-code",
        icon: FileText,
        description: "Codes des disciplines",
      },
      {
        title: "Groupes Piscine",
        url: "/data/groupes",
        icon: Waves,
        description: "Gestion des groupes",
      },
      {
        title: "Statistiques",
        url: "/data/statistics",
        icon: BarChart3,
        description: "Analyses et rapports",
      },
    ],
  },
  {
    title: "Import/Export",
    icon: Upload,
    url: "/import-export",
    description: "Gestion des données",
  },
  {
    title: "Notifications",
    icon: Bell,
    url: "/notifications",
    badge: "3",
    description: "Alertes système",
  },
]

export function AppSidebar() {
  const [expandedItems, setExpandedItems] = useState<number[]>([1])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const pathname = usePathname()

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  // Auto-expand current section
  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.items) {
        const hasActiveSubItem = item.items.some((subItem) => pathname === subItem.url)
        if (hasActiveSubItem && !expandedItems.includes(index)) {
          setExpandedItems((prev) => [...prev, index])
        }
      }
    })
  }, [pathname])

  return (
    <>
      <aside
        className={`sidebar-enhanced ${isCollapsed ? "collapsed" : ""}`}
        style={{
          width: isCollapsed ? "70px" : "280px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fffe 100%)",
          borderRight: "1px solid #e5f3f0",
          boxShadow: "4px 0 20px rgba(22, 163, 74, 0.08)",
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        {/* Sidebar Header */}
        <div
          className="sidebar-header-enhanced"
          style={{
            padding: "20px",
            borderBottom: "1px solid #e5f3f0",
            background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
            position: "relative",
          }}
        >
          <div className="d-flex align-items-center justify-content-between" >
            <button
              className="sidebar-toggle"
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                borderRadius: "12px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              {isCollapsed ? <Menu size={25}  /> : <X size={20} />}
            </button>

            {!isCollapsed && (
              <div
                className="brand-text-sidebar ms-3"
                style={{
                  color: "white",
                  opacity: isCollapsed ? 0 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <h2
                  className="brand-title-sidebar mb-0"
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "500",
                    letterSpacing: "-0.02em",
                    color:"white"
                  }}
                >
                  OCP Sport
                </h2>
                <span
                  className="brand-subtitle-sidebar"
                  style={{
                    fontSize: "0.8rem",
                    opacity: 0.9,
                    fontWeight: "500",
                    color:"white"
                  }}
                >
                  Administration
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav
          className="sidebar-nav-enhanced"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "16px 12px",
            height: "calc(100vh - 200px)",
          }}
        >
          <div className="nav-section">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isExpanded = expandedItems.includes(index)
              const isActive = item.url ? pathname === item.url : false
              const isHovered = hoveredItem === index

              return (
                <div key={item.title} className="nav-item-wrapper mb-2">
                  {item.items ? (
                    <>
                      <button
                        className={`nav-item nav-item-expandable w-100 ${isExpanded ? "expanded" : ""}`}
                        onClick={() => toggleExpanded(index)}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                        style={{
                          background: isExpanded
                            ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                            : isHovered
                              ? "rgba(22, 163, 74, 0.05)"
                              : "transparent",
                          border: "none",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: isExpanded ? "#16a34a" : "#374151",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="nav-item-icon"
                            style={{
                              width: "24px",
                              height: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: isCollapsed ? 0 : "12px",
                            }}
                          >
                     <Icon
  size={item.title === "Données" || item.title === "Réservations" ? 22 : 20}
  style={{
    transform: item.title === "Données" || item.title === "Réservations" ? "translateX(-7px)" : "none",
  }}
/>

                          </div>
                          {!isCollapsed && (
                            <>
                              <div>
                                <div
                                  className="nav-item-text"
                                  style={{
                                    fontSize: "0.9rem",
                                    fontWeight: "600",
                                    lineHeight: "1.2",
                                  }}
                                >
                                  {item.title}
                                </div>
                                {item.description && (
                                  <div
                                    style={{
                                      fontSize: "0.75rem",
                                      color: "#6b7280",
                                      marginTop: "2px",
                                    }}
                                  >
                                    {item.description}
                                  </div>
                                )}
                              </div>
                              {item.badge && (
                                <span
                                  className="nav-badge ms-auto me-2"
                                  style={{
                                    background: isExpanded
                                      ? "#16a34a"
                                      : "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                                    color: "white",
                                    fontSize: "0.7rem",
                                    fontWeight: "600",
                                    padding: "4px 8px",
                                    borderRadius: "20px",
                                    minWidth: "20px",
                                    textAlign: "center",
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                              <ChevronDown
                                size={16}
                                className="nav-chevron"
                                style={{
                                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                  transition: "transform 0.2s ease",
                                }}
                              />
                            </>
                          )}
                        </div>
                      </button>

                      {!isCollapsed && (
                        <div
                          className={`nav-submenu ${isExpanded ? "expanded" : ""}`}
                          style={{
                            maxHeight: isExpanded ? "300px" : "0",
                            overflow: "hidden",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            marginTop: isExpanded ? "8px" : "0",
                            marginLeft: "12px",
                            paddingLeft: "20px",
                            borderLeft: isExpanded ? "2px solid #e5f3f0" : "none",
                          }}
                        >
                          {item.items.map((subItem) => {
                            const SubIcon = subItem.icon
                            const isSubActive = pathname === subItem.url

                            return (
                              <Link
                                key={subItem.title}
                                href={subItem.url}
                                className={`nav-subitem d-flex align-items-center ${isSubActive ? "active" : ""}`}
                                style={{
                                  padding: "10px 16px",
                                  borderRadius: "8px",
                                  marginBottom: "4px",
                                  textDecoration: "none",
                                  background: isSubActive
                                    ? "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)"
                                    : "transparent",
                                  color: isSubActive ? "white" : "#6b7280",
                                  transition: "all 0.2s ease",
                                  fontSize: "0.85rem",
                                  fontWeight: isSubActive ? "600" : "500",
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.background = "rgba(22, 163, 74, 0.08)"
                                    e.currentTarget.style.color = "#16a34a"
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.background = "transparent"
                                    e.currentTarget.style.color = "#6b7280"
                                  }
                                }}
                              >
                                <SubIcon size={16} style={{ marginRight: "8px" }} />
                                <span>{subItem.title}</span>
                                {subItem.badge && (
                                  <span
                                    className="nav-badge-small ms-auto"
                                    style={{
                                      background: isSubActive ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb",
                                      color: isSubActive ? "white" : "#6b7280",
                                      fontSize: "0.65rem",
                                      fontWeight: "600",
                                      padding: "2px 6px",
                                      borderRadius: "12px",
                                    }}
                                  >
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : item.url ? (
                    <Link
                      href={item.url}
                      className={`nav-item d-flex align-items-center ${isActive ? "active" : ""}`}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        textDecoration: "none",
                        background: isActive
                          ? "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)"
                          : isHovered
                            ? "rgba(22, 163, 74, 0.05)"
                            : "transparent",
                        color: isActive ? "white" : "#374151",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontSize: "0.9rem",
                        fontWeight: isActive ? "600" : "500",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div className="d-flex align-items-center w-100 ">
                        <div
                          className="nav-item-icon "
                          style={{
                            width: "24px",
                            height: "24px",
                            display: "flex",
                           
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: isCollapsed ? 0 : "12px",
                          }}
                        >
                          <Icon size={22} />
                        </div>
                        {!isCollapsed && (
                          <>
                            <div className="flex-grow-1">
                              <div className="nav-item-text">{item.title}</div>
                              {item.description && (
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    opacity: 0.8,
                                    marginTop: "2px",
                                  }}
                                >
                                  {item.description}
                                </div>
                              )}
                            </div>
                            {item.badge && (
                              <span
                                className="nav-badge"
                                style={{
                                  background: isActive
                                    ? "rgba(255, 255, 255, 0.2)"
                                    : "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                                  color: "white",
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                  padding: "4px 8px",
                                  borderRadius: "20px",
                                  minWidth: "20px",
                                  textAlign: "center",
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </Link>
                  ) : null}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div
          className="sidebar-footer-enhanced"
          style={{
            padding: "10px",
            borderTop: "1px solid #e5f3f0",
            background: "rgba(248, 255, 254, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Paramètres */}
          <div className="settings-section mb-1">
            <Link
              href="/settings"
              className="settings-link d-flex align-items-center"
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                textDecoration: "none",
                color: "#6b7280",
                transition: "all 0.2s ease",
                fontSize: "0.85rem",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(22, 163, 74, 0.08)"
                e.currentTarget.style.color = "#16a34a"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "#6b7280"
              }}
            >
              <div
                className="settings-icon"
                style={{
                  marginRight: isCollapsed ? 0 : "15px",
                }}
              >
                <Settings size={24} />
              </div>
              {!isCollapsed && <span className="settings-label">Paramètres</span>}
            </Link>
          </div>

          {/* Profile utilisateur */}
          <div
            className="user-profile-sidebar d-flex align-items-center"
            style={{
              padding: "10px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
              border: "1px solid rgba(22, 163, 74, 0.1)",
            }}
          >
            <div
              className="user-avatar-sidebar"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                marginRight: isCollapsed ? 0 : "12px",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
              }}
            >
              <Shield size={15} />
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <div
                  className="user-name-sidebar"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#16a34a",
                    lineHeight: "1.2",
                  }}
                >
                  Admin OCP
                </div>
                <div
                  className="user-role-sidebar"
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginTop: "2px",
                  }}
                >
                  Administrateur
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay pour mobile */}
      {!isCollapsed && (
        <div
          className="sidebar-overlay d-lg-none"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .sidebar-nav-enhanced::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar-nav-enhanced::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-nav-enhanced::-webkit-scrollbar-thumb {
          background: rgba(22, 163, 74, 0.2);
          border-radius: 2px;
        }
        
        .sidebar-nav-enhanced::-webkit-scrollbar-thumb:hover {
          background: rgba(22, 163, 74, 0.4);
        }

        @media (max-width: 991.98px) {
          .sidebar-enhanced {
            transform: translateX(-100%);
          }
          
          .sidebar-enhanced:not(.collapsed) {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}

export function SidebarTrigger() {
  return null
}
