"use client"
import { DisciplinesPage} from "@/components/DisciplineCodesPage"

export default function DisciplineCodePage() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <DisciplinesPage />
          </div>
        </div>
      </div>
    </div>
  )
}
