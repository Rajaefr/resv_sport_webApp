"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    "/welcome",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password"
  ]

  const isPublicRoute = (path: string) => {
    return publicRoutes.some(route => path.startsWith(route))
  }

  useEffect(() => {
    const checkAuth = () => {
      // Si c'est une route publique, permettre l'accès
      if (isPublicRoute(pathname)) {
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem("authToken")
      const user = localStorage.getItem("user")

      if (!token || !user) {
        router.push("/auth/login")
        return
      }

      try {
        // Vérifier la validité du token
        const decoded = JSON.parse(atob(token.split(".")[1]))
        const now = Date.now()

        if (decoded.exp < now) {
          // Token expiré
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
          router.push("/auth/login")
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        // Token invalide
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        router.push("/auth/login")
        return
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-content">
          <Loader2 size={32} className="spinner" />
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

// Styles pour le composant de chargement
const styles = `
  .auth-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  }

  .loading-content {
    text-align: center;
    color: #16a34a;
  }

  .loading-content p {
    margin-top: 16px;
    font-size: 14px;
    color: #6b7280;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

// Injecter les styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
} 