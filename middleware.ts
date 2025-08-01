import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Pages publiques
    if (pathname.startsWith("/auth/")) {
      return NextResponse.next()
    }

    // Vérifier si l'utilisateur est connecté
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Vérifications des rôles pour certaines pages
    if (pathname.startsWith("/admin")) {
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    if (pathname.startsWith("/users-management")) {
      if (token.role !== "admin" && token.role !== "gestionnaire") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/users-management/:path*", "/reservations/:path*", "/admin/:path*"],
}
