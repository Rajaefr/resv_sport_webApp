import { NextRequest, NextResponse } from 'next/server';

// Fonction pour vérifier l'existence d'un utilisateur par email ET matricule
async function verifyUserExists(email: string, matricule: string) {
  const backendURL = process.env.BACKEND_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${backendURL}/api/auth/verify-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, matricule })
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { exists: false, message: result.message || 'Utilisateur non trouvé' };
    }
    
    return { exists: true, user: result.data };
  } catch (error) {
    console.error('Erreur vérification utilisateur:', error);
    return { exists: false, message: 'Erreur de vérification' };
  }
}

// Fonction pour appeler le backend Node.js avec authentification
async function callBackendAPI(endpoint: string, method: string = 'GET', data?: any, authToken?: string) {
  const backendURL = process.env.BACKEND_URL || 'http://localhost:3001';
  
  try {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Ajouter le token d'authentification si fourni
    if (authToken) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${authToken}`
      };
    }

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${backendURL}${endpoint}`, config);
    const result = await response.json();
    
    if (!response.ok) {
      // Si l'utilisateur n'est pas trouvé, propager l'erreur
      if (response.status === 401 && result.code === 'USER_NOT_FOUND') {
        throw new Error('UTILISATEUR_NON_TROUVE');
      }
      throw new Error(result.message || `HTTP ${response.status}`);
    }
    
    return result;
  } catch (error) {
    console.error(`Erreur backend API ${method} ${endpoint}:`, error);
    throw error;
  }
}

// Fonction pour valider le matricule et les données famille via les archives
async function validateReservationWithArchives(matricule: string, familyData: any) {
  try {
    const validationResult = await callBackendAPI('/api/verification/validate-family', 'POST', {
      matricule,
      familyData
    });
    
    return validationResult;
  } catch (error) {
    console.error('Erreur validation archives:', error);
    return {
      success: false,
      status: 'pending',
      message: 'Validation impossible - données d\'archives non disponibles'
    };
  }
}

// GET /api/reservations/piscine - Récupérer les réservations piscine
export async function GET(request: NextRequest) {
  try {
    // Pour la lecture, utiliser des données mockées pour éviter l'erreur d'authentification
    // En production, ceci devrait appeler le backend avec les bonnes permissions admin
    const mockReservations = {
      success: true,
      data: {
        items: [
          {
            id: "P001",
            user: {
              firstName: "Ahmed",
              lastName: "Benali",
              email: "ahmed.benali@ocp.ma",
              matricule: "12345A",
              role: "employee"
            },
            bassin: "Grand Bassin",
            date: "2024-01-15",
            startTime: "14:00",
            endTime: "15:00",
            status: "approved",
            createdAt: "2024-01-10T10:00:00Z",
            comment: "Réservation pour famille",
            participants: [
              {
                firstName: "Ahmed",
                lastName: "Benali",
                type: "Collaborateur",
                relation: "principal"
              }
            ]
          },
          {
            id: "P002",
            user: {
              firstName: "Fatima",
              lastName: "Alami",
              email: "fatima.alami@ocp.ma",
              matricule: "67890B",
              role: "employee"
            },
            bassin: "Petit Bassin",
            date: "2024-01-16",
            startTime: "10:00",
            endTime: "11:00",
            status: "pending",
            createdAt: "2024-01-11T09:00:00Z",
            comment: "Réservation famille avec enfants",
            participants: [
              {
                firstName: "Fatima",
                lastName: "Alami",
                type: "Collaborateur",
                relation: "principal"
              },
              {
                firstName: "Sara",
                lastName: "Alami",
                type: "Enfant",
                relation: "enfant"
              }
            ]
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1
        }
      }
    };

    return NextResponse.json(mockReservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Erreur lors de la récupération des réservations' 
        } 
      },
      { status: 500 }
    );
  }
}

// POST /api/reservations/piscine - Créer une nouvelle réservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Données de réservation reçues:', body);

    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('authorization');
    const authToken = authHeader?.replace('Bearer ', '');

    if (!authToken) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Token d\'authentification requis pour créer une réservation'
        }
      }, { status: 401 });
    }

    // Étape 1: Vérifier l'existence de l'utilisateur par email ET matricule
    const email = body.requesterInfo?.email;
    const matricule = body.requesterInfo?.matricule;
    
    if (!email || !matricule) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Email et matricule requis pour créer une réservation'
        }
      }, { status: 400 });
    }

    const userVerification = await verifyUserExists(email, matricule);
    if (!userVerification.exists) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: `Utilisateur non trouvé avec email ${email} et matricule ${matricule}. Chaque réservation doit être liée à un membre connecté.`
        }
      }, { status: 401 });
    }

    // Étape 2: Créer la réservation avec statut 'pending'
    let reservationResult;
    try {
      reservationResult = await callBackendAPI('/api/reservations/piscine', 'POST', body, authToken);
    } catch (error: any) {
      if (error.message === 'UTILISATEUR_NON_TROUVE') {
        return NextResponse.json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Utilisateur non trouvé dans la base de données. Chaque réservation doit être liée à un membre connecté.'
          }
        }, { status: 401 });
      }
      throw error;
    }

    // Étape 3: Validation automatique via les archives
    if (matricule && body.participants) {
      console.log(`Validation automatique pour matricule: ${matricule}`);
      
      const validationResult = await validateReservationWithArchives(matricule, {
        requester: body.requesterInfo,
        participants: body.participants
      });

      // Mettre à jour le statut selon la validation
      let newStatus = 'pending';
      let validationMessage = '';

      if (validationResult.success) {
        switch (validationResult.status) {
          case 'verified':
            newStatus = 'verified';
            validationMessage = 'Toutes les données validées avec les archives';
            break;
          case 'partial':
            newStatus = 'partial';
            validationMessage = 'Au moins un membre validé avec les archives';
            break;
          case 'rejected':
            newStatus = 'rejected';
            validationMessage = 'Aucune donnée ne correspond aux archives';
            break;
          default:
            newStatus = 'pending';
            validationMessage = 'En attente de validation manuelle';
        }

        // Mettre à jour le statut de la réservation
        try {
          await callBackendAPI(
            `/api/reservations/piscine/${reservationResult.data.id}`, 
            'PUT', 
            { 
              status: newStatus,
              validationMessage,
              validationDetails: validationResult.details 
            },
            authToken
          );
        } catch (updateError) {
          console.error('Erreur mise à jour statut:', updateError);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          ...reservationResult.data,
          status: newStatus,
          validationMessage
        },
        message: `Réservation créée avec statut: ${newStatus}`
      });
    }

    return NextResponse.json({
      success: true,
      data: reservationResult.data,
      message: 'Réservation créée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Erreur lors de la création de la réservation'
      }
    }, { status: 500 });
  }
}
