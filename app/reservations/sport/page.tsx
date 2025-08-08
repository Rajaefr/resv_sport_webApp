'use client';

import { ReservationsSport } from "@/components/reservations-sport"

export default function SportPage() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <ReservationsSport />
          </div>
        </div>
      </div>
    </div>
  )
}
