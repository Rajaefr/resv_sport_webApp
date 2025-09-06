import { NextRequest, NextResponse } from 'next/server';

// POST /api/reservations/piscine/[id]/assign-groups - Affecter des participants aux groupes
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log(`Affectation groupes pour réservation ${id}:`, body);

    return NextResponse.json({
      success: true,
      message: 'Affectation aux groupes mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'affectation aux groupes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'ASSIGN_ERROR', 
          message: 'Erreur lors de l\'affectation aux groupes' 
        } 
      },
      { status: 500 }
    );
  }
}
