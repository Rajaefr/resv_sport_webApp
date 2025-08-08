"use client"

import  ParametresPage from "@/components/parametres"

export default function SettingsPage() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <ParametresPage />
          </div>
        </div>
      </div>
    </div>
  )
}
