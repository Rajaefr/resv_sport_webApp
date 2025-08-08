"use client"
import  {StatistiquesDashboard}  from "@/components/statistiques-dashboard"

export default function StatisticsPage() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <StatistiquesDashboard />
          </div>
        </div>
      </div>
    </div>
  )
}
