'use client';
import { UsersManagement } from "@/components/users-management"
export default function UsersPage() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card h-100">
          <div className="card-body">
            <UsersManagement />
          </div>
        </div>
      </div>
    </div>
  )
}
