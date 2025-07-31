"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import {ReservationsSport} from "@/components/reservations-sport"


export default function SportPage() {
  return (
    <div className="dashboard-wrapper">
      <AppSidebar />

      <main className="main-content main-content-scroll">
        <div className="main-container">
          <DashboardHeader />

          <section className="reservations-section">
            <ReservationsSport />
          </section>
        </div>
      </main>
    </div>
  )
}
