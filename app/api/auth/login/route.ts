import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/userStorage";
import { verifyPassword, generateToken, sanitizeUser } from "@/lib/auth";
import { validateLogin } from "@/lib/validation";
import type { AuthResponse, User } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body = await request.json();
    
    // Validation des données
    const validationResult = validateLogin(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validationResult.error || 'Données invalides'
        },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Vérifier utilisateur local uniquement
    const user = findUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe hashé
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Générer le token JWT
    const sanitizedUser = sanitizeUser(user);
    const token = await generateToken(sanitizedUser); // Await generateToken
    console.log('API Login (route.ts): Token generated and sent to client:', token); // Added log

    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: sanitizedUser,
      token
    });

  } catch (error) {
    console.error("Erreur lors de la connexion (route.ts):", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
