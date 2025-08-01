"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { RecentReservations } from "@/components/recent-reservations"
import { SystemAlerts } from "@/components/system-alerts"
import { QuickActions } from "@/components/quick-actions"
import { DashboardHeader } from "@/components/dashboard-header"
import { CombinedStatsActivity } from "@/components/combined-stats-activity"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import {StatsChart} from "@/components/stats-chart"
export default function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      <AppSidebar />

      <main className="main-content main-content-scroll">
        <div className="main-container">
          {/* Enhanced Header */}
          <DashboardHeader />

          {/* Quick Actions en haut avec scroll horizontal */}
          <section className="actions-section-top">
            <QuickActions />
          </section>

          {/* Combined Stats and Activity */}
          <section className="combined-section">
            <CombinedStatsActivity />
          </section>
          <section className="stats-chart">
            <StatsChart />
          </section>

          {/* Alertes */}
          <section className="alerts-section">
            <div className="row">
              <div className="col-12">
                <SystemAlerts />
              </div>
            </div>
          </section>

          {/* Recent Reservations */}
          <section className="reservations-section">
            <RecentReservations />
          </section>
        </div>
      </main>
    </div>
  )
}
