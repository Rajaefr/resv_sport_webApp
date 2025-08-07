"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"

interface LogoutButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function LogoutButton({ 
  className = "", 
  variant = "default",
  size = "md" 
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      setIsLoading(true)
      
      try {
        // Appel à l'API de déconnexion
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error)
      } finally {
        // Nettoyer le localStorage
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        
        // Rediriger vers la page de connexion
        router.push("/auth/login")
      }
    }
  }

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center gap-2 font-medium transition-all duration-200"
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    }
    
    const variantClasses = {
      default: "bg-red-600 text-white hover:bg-red-700 rounded-lg",
      outline: "border border-red-600 text-red-600 hover:bg-red-50 rounded-lg",
      ghost: "text-red-600 hover:bg-red-50 rounded-lg"
    }
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={getButtonClasses()}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogOut size={16} />
      )}
      <span>{isLoading ? "Déconnexion..." : "Déconnexion"}</span>
    </button>
  )
} 