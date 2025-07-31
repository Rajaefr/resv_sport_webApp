"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import {ReservationsPiscine} from "@/components/reservations-piscine"


export default function PiscinePage() {
  return (
    <div className="dashboard-wrapper">
      <AppSidebar />

      <main className="main-content main-content-scroll">
        <div className="main-container">
          <DashboardHeader />

          <section className="reservations-section">
            <ReservationsPiscine />
          </section>
        </div>
      </main>
    </div>
  )
}
