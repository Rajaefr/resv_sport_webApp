'use client';

import { ReservationsPiscine } from "@/components/reservations-piscine"

export default function PiscinePage() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <ReservationsPiscine />
          </div>
        </div>
      </div>
    </div>
  )


  
}
