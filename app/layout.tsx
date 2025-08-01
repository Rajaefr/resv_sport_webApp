import type React from "react"
import type { Metadata } from "next"
import "../styles/bootstrap-custom.css"
import "../styles/dashboard.css"


export const metadata: Metadata = {
  title: "OCP Sport - Dashboard",
  description: "Système de gestion des réservations sportives",
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async></script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
