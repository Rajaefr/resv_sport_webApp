"use client"

import  {GroupesPage}  from "@/components/GroupesPage"

export default function GroupePage() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <GroupesPage />
          </div>
        </div>
      </div>
    </div>
  )
}
