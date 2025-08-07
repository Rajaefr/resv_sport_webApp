import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/jwt"; // Import verifyToken from unified lib/jwt.ts

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/welcome",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

// Fonction pour vérifier si une route est publique
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route))
}

// Fonction pour vérifier le token d'authentification
async function verifyAuthToken(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("authToken")?.value ||
                request.headers.get("authorization")?.replace("Bearer ", "")

  console.log('Middleware received token:', token);

  if (!token) {
    console.log('Middleware: No token found.');
    return false;
  }

  try {
    const decoded = await verifyToken(token); // Use unified verifyToken
    // Le champ 'exp' est automatiquement vérifié par jose.jwtVerify
    console.log('Middleware: Token successfully verified. Decoded payload:', decoded);
    return true; // Si la vérification réussit, le token est valide et non expiré
  } catch (error) {
    console.error("Middleware: Erreur de vérification du token:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permettre l'accès aux routes publiques
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Vérifier l'authentification pour les routes protégées
  if (!await verifyAuthToken(request)) {
    // Rediriger vers la page de connexion
    const loginUrl = new URL("/welcome", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
      * Match all request paths except for the ones starting with:
      * - api (API routes)
      * - _next/static (static files)
      * - _next/image (image optimization files)
      * - favicon.ico (favicon file)
      */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
