import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/userStorage";
import { validateForgotPassword } from "@/lib/validation";
import type { AuthResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body = await request.json();
    
    // Validation des données
    const validationResult = validateForgotPassword(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validationResult.error || 'Données invalides'
        },
        { status: 400 }
      );
    }

    const { email } = body;

    // Vérifier si l'utilisateur existe
    const user = findUserByEmail(email);
    
    // Pour des raisons de sécurité, on renvoie toujours le même message
    // même si l'utilisateur n'existe pas
    if (!user) {
      // Log pour le debug mais ne pas révéler à l'utilisateur
      console.log(`Tentative de récupération pour email inexistant: ${email}`);
    }

    // Simulation d'envoi d'email
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: "Si cette adresse email existe, vous recevrez les instructions de récupération"
    });

  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
