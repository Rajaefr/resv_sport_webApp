import { NextRequest, NextResponse } from 'next/server';
import { addUser, userExists } from '@/lib/userStorage';
import { validateRegister } from '@/lib/validation';
import { generateToken, sanitizeUser } from '@/lib/auth';
import type { AuthResponse } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body = await request.json();
    
    // Validation des données
    const validationResult = validateRegister(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validationResult.error || 'Données invalides'
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, department, matricule, telephone } = body;

    // Déterminer le rôle basé sur le domaine de l'e-mail
    let assignedRole: 'admin' | 'gestionnaire' | 'consulteur' = 'consulteur';
    if (email.endsWith('@ocp.ma')) {
      assignedRole = 'consulteur';
    }
    // Vous pouvez ajouter d'autres conditions ici si nécessaire, par exemple:
    // if (email.endsWith('@admin.ocp.ma')) {
    //   assignedRole = 'admin';
    // } else if (email.endsWith('@gestion.ocp.ma')) {
    //   assignedRole = 'gestionnaire';
    // }

    // Générer un nom d'utilisateur à partir du prénom et du nom
    const generatedUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;

    // Vérifier si l'utilisateur existe déjà par email
    // userExists a été mis à jour pour vérifier uniquement l'email pour les nouvelles inscriptions
    if (userExists(generatedUsername, email)) { // username parameter is now ignored in userExists for registration
      return NextResponse.json(
        { success: false, message: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Créer l'utilisateur
    const newUser = await addUser({
      firstName,
      lastName,
      email,
      username: generatedUsername, // Use the generated username
      password,
      department,
      matricule,
      telephone,
      employeeId: '',
      role: assignedRole
    });

    // Générer le token
    const sanitizedUser = sanitizeUser(newUser);
    const token = await generateToken(sanitizedUser); // Await generateToken
    console.log('API Register (route.ts): Token generated and sent to client:', token); // Added log

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      user: sanitizedUser,
      token
    });

  } catch (error) {
    console.error('Erreur lors de la création du compte (route.ts):', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
