'use client';

import { RecentReservations } from "@/components/recent-reservations"
import { SystemAlerts } from "@/components/system-alerts"
import { QuickActions } from "@/components/quick-actions"
import { CombinedStatsActivity } from "@/components/combined-stats-activity"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import "bootstrap-icons/font/bootstrap-icons.css"
import {StatsChart} from "@/components/stats-chart"


export default function DashboardPage() {
  // La logique d'authentification et de redirection est maintenant gérée dans app/layout.tsx.
  // Le composant DashboardHeader est également rendu dans app/layout.tsx.

  return (
    <div className="row g-4">
      {/* Quick Actions en haut avec scroll horizontal */}
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <QuickActions />
          </div>
        </div>
      </div>

      {/* Combined Stats and Activity - Admin only */}
      <PermissionGuard permission="canViewStatistics">
        <div className="col-12">
          <div className="card h-100">
            <div className="card-body">
              <CombinedStatsActivity />
            </div>
          </div>
        </div>
      </PermissionGuard>

      {/* Stats Chart - Admin only */}
      <PermissionGuard permission="canViewStatistics">
        <div className="col-12">
          <div className="card h-100">
            <div className="card-body">
              <StatsChart />
            </div>
          </div>
        </div>
      </PermissionGuard>

      {/* Alertes */}
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <SystemAlerts />
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <RecentReservations />
          </div>
        </div>
      </div>
    </div>
  );
}
