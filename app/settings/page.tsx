"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import  ParametresPage from "@/components/parametres"

export default function UsersPage() {
  return (
    <div className="dashboard-wrapper">
      <AppSidebar />

      <main className="main-content main-content-scroll">
        <div className="main-container">
          <DashboardHeader />

          <section className="users-section">
            <ParametresPage />
          </section>
        </div>
      </main>
    </div>
  )
}
