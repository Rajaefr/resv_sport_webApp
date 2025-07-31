"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { AppSidebar } from "@/components/app-sidebar"
import { CombinedStatsActivity } from "@/components/combined-stats-activity"
import { SystemAlerts } from "@/components/system-alerts"
import { RecentReservations } from "@/components/recent-reservations"
import { QuickActions } from "@/components/quick-actions"

export default function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(260)

  // Écouter les changements de largeur de la sidebar
  useEffect(() => {
    const handleSidebarChange = () => {
      const sidebar = document.querySelector('[data-sidebar="true"]')
      if (sidebar) {
        const width = sidebar.getBoundingClientRect().width
        setSidebarWidth(width)
      }
    }

    // Observer les changements
    const observer = new MutationObserver(handleSidebarChange)
    const sidebar = document.querySelector('[data-sidebar="true"]')
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ["style"] })
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="d-flex" style={{ backgroundColor: "#f8fffe", minHeight: "100vh" }}>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header */}
        <DashboardHeader />

        {/* Dashboard Content */}
        <main className="container-fluid p-3">
          {/* Quick Actions */}
          <QuickActions />

          {/* Stats Section */}
          <CombinedStatsActivity />

          {/* Content Grid */}
          <div className="row g-3">
            {/* Recent Reservations */}
            <div className="col-lg-8">
              <RecentReservations />
            </div>

            {/* System Alerts */}
            <div className="col-lg-4">
              <SystemAlerts />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
