import { NextRequest, NextResponse } from "next/server";
import type { AuthResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Déconnexion réussie"
    });

    // Supprimer le cookie de session si utilisé
    response.cookies.delete('auth-token');
    
    return response;
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
