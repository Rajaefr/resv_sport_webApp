interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    this.timeout = 30000; // Increased from 10000ms
  }

  // Récupérer le token d'authentification
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('firebaseToken');
      if (!token) {
        console.warn('Aucun token d\'authentification trouvé');
      }
      return token;
    }
    return null;
  }

  // Créer les headers avec authentification
  private createHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Méthode générique pour les requêtes
  private async request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    params?: any,
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    if (requireAuth && !token) {
      console.error('Token d\'authentification manquant pour:', endpoint);
      // Retourner des données par défaut au lieu de lever une erreur
      return {
        success: false,
        message: 'Non authentifié',
        data: null
      };
    }

    // Mode test avec token admin de test
    if (token && token.startsWith('test-admin-token-')) {
      console.log(`🧪 Mode test - Simulation API ${method.toUpperCase()} ${endpoint}`);
      return this.simulateApiResponse<T>(method, endpoint, data, params);
    }

    try {
      let url = `${this.baseURL}${endpoint}`;
      
      // Add query parameters if provided
      if (params && method.toUpperCase() === 'GET') {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) queryParams.append(key, value.toString());
        });
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }

      const config: RequestInit = {
        method: method.toUpperCase(),
        headers: requireAuth ? this.createHeaders() : { 'Content-Type': 'application/json' },
      };

      if (data && method.toUpperCase() !== 'GET') {
        config.body = JSON.stringify(data);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      console.log(`✅ API Response ${method.toUpperCase()} ${endpoint}:`, responseData);
      return responseData;

    } catch (error: any) {
      console.error(`❌ API Error ${method.toUpperCase()} ${endpoint}:`, error);
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout de la requête');
      }
      
      throw error;
    }
  }

  // Simulation des réponses API pour les tests
  private async simulateApiResponse<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<ApiResponse<T>> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 200));

    // Réponses simulées selon l'endpoint
    switch (endpoint) {
      case '/auth/verify-token':
        return {
          success: true,
          data: {
            user: {
              id: 'test-admin-001',
              firebaseUid: 'test-firebase-uid',
              firstName: 'Admin',
              lastName: 'Test',
              email: 'admin@ocp.ma',
              username: 'admin.test',
              department: 'IT',
              matricule: 'ADM001',
              telephone: '+212600000000',
              role: 'ADMIN',
              isActive: true,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            }
          }
        } as ApiResponse<T>;

      case '/admin/discipline-codes':
        return {
          success: true,
          data: {
            disciplineCodes: [
              {
                code: 'C001-1',
                nom: 'Natation Adultes',
                price: 150,
                isActive: true,
                description: 'Natation pour adultes (collaborateurs, conjoints, enfants adultes)',
                type: 'sport',
                participantsCount: 30,
                paidCount: 25
              },
              {
                code: 'C001-2',
                nom: 'Natation Enfants',
                price: 100,
                isActive: true,
                description: 'Natation pour enfants (âge > 6 ans)',
                type: 'sport',
                participantsCount: 20,
                paidCount: 15
              },
              {
                code: 'C058-1',
                nom: 'Gym Adultes',
                price: 120,
                isActive: true,
                description: 'Gymnastique et fitness pour adultes',
                type: 'sport',
                participantsCount: 20,
                paidCount: 18
              },
              {
                code: 'C058-2',
                nom: 'Gym Enfants',
                price: 80,
                isActive: true,
                description: 'Gymnastique pour enfants',
                type: 'sport',
                participantsCount: 15,
                paidCount: 10
              },
              {
                code: 'C058-3',
                nom: 'Gym & Swim Adultes',
                price: 250,
                isActive: true,
                description: 'Accès combiné gym et piscine pour adultes',
                type: 'sport',
                participantsCount: 10,
                paidCount: 8
              },
              {
                code: 'C058-4',
                nom: 'Gym & Swim Enfants',
                price: 180,
                isActive: true,
                description: 'Accès combiné gym et piscine pour enfants',
                type: 'sport',
                participantsCount: 8,
                paidCount: 5
              }
            ]
          }
        } as ApiResponse<T>;

      case '/admin/groupes':
        return {
          success: true,
          data: {
            groupes: [
              {
                code: 'A1-1',
                type: 'Adultes',
                bassin: 'Grand Bassin',
                capacite: 15,
                horaires: 'Lundi 14:00-16:00, Mercredi 08:00-10:00',
                isBlocked: false,
                participantsCount: 12,
                description: 'Groupe natation adultes - Niveau débutant',
                participants: [
                  { id: 'u1', name: 'Jean Dupont', status: 'active' },
                  { id: 'u2', name: 'Marie Martin', status: 'active' }
                ]
              },
              {
                code: 'A1-2',
                type: 'Enfants',
                bassin: 'Petit Bassin',
                capacite: 10,
                horaires: 'Mardi 10:00-12:00, Jeudi 14:00-16:00',
                isBlocked: true,
                participantsCount: 8,
                description: 'Cours d\'initiation pour les 6-10 ans',
                participants: [
                  { id: 'u3', name: 'Léo Petit', status: 'active' },
                  { id: 'u4', name: 'Emma Durand', status: 'paused' }
                ]
              },
              {
                code: 'A1-3',
                type: 'Adultes',
                bassin: 'Grand Bassin',
                capacite: 15,
                horaires: 'Vendredi 08:00-10:00, Samedi 16:00-18:00',
                isBlocked: false,
                participantsCount: 10,
                description: 'Groupe natation adultes - Niveau avancé',
                participants: [
                  { id: 'u5', name: 'Thomas Leroy', status: 'active' },
                  { id: 'u6', name: 'Sophie Moreau', status: 'active' }
                ]
              },
              {
                code: 'A2-1',
                type: 'Retraités',
                bassin: 'Grand Bassin',
                capacite: 15,
                horaires: 'Lundi 16:00-18:00, Mercredi 10:00-12:00',
                isBlocked: false,
                participantsCount: 14,
                description: 'Activités aquatiques pour seniors',
                participants: [
                  { id: 'u7', name: 'Robert Dubois', status: 'active' },
                  { id: 'u8', name: 'Jacqueline Bernard', status: 'active' }
                ]
              },
              {
                code: 'A2-2',
                type: 'Mixte',
                bassin: 'Petit Bassin',
                capacite: 10,
                horaires: 'Mardi 14:00-16:00, Jeudi 16:00-18:00',
                isBlocked: false,
                participantsCount: 6,
                description: 'Cours mixte pour adultes et adolescents',
                participants: [
                  { id: 'u9', name: 'Paul Lefebvre', status: 'active' },
                  { id: 'u10', name: 'Camille Roux', status: 'active' }
                ]
              },
              {
                code: 'B1-1',
                type: 'Enfants',
                bassin: 'Petit Bassin',
                capacite: 12,
                horaires: 'Vendredi 10:00-12:00',
                isBlocked: false,
                participantsCount: 3,
                description: 'Cours pour les 10-14 ans',
                participants: [
                  { id: 'u11', name: 'Hugo Laurent', status: 'active' },
                  { id: 'u12', name: 'Léa Petit', status: 'active' },
                  { id: 'u13', name: 'Noah Richard', status: 'active' }
                ]
              }
            ]
          }
        } as ApiResponse<T>;

      case '/reservations/piscine':
        return {
          success: true,
          data: {
            items: [
              {
                id: 'res-001',
                beneficiaryName: 'Ahmed Benali',
                beneficiaryEmail: 'ahmed.benali@ocp.ma',
                beneficiaryMatricule: 'MAT001',
                beneficiaryType: 'Collaborateur',
                date: '2024-12-15',
                timeSlot: '08:00-10:00',
                bassin: 'Grand Bassin',
                status: 'APPROVED',
                participants: 3,
                createdAt: '2024-12-10T08:00:00Z',
                notes: 'Réservation famille',
                participants_list: [
                  { nom: 'Benali', prenom: 'Ahmed', type: 'Collaborateur', groupe: 'C001-1-G1' },
                  { nom: 'Benali', prenom: 'Fatima', type: 'Conjoint', groupe: 'C058-1-G1' },
                  { nom: 'Benali', prenom: 'Omar', type: 'Enfant', groupe: 'C001-2-G1', age: 10 }
                ]
              },
              {
                id: 'res-002',
                beneficiaryName: 'Fatima Zahra',
                beneficiaryEmail: 'fatima.zahra@ocp.ma',
                beneficiaryMatricule: 'MAT002',
                beneficiaryType: 'Collaborateur',
                date: '2024-12-20',
                timeSlot: '14:00-16:00',
                bassin: 'Petit Bassin',
                status: 'PENDING',
                participants: 2,
                createdAt: '2024-12-18T10:30:00Z',
                notes: 'Cours enfants',
                participants_list: [
                  { nom: 'Zahra', prenom: 'Fatima', type: 'Collaborateur', groupe: 'A2-1' },
                  { nom: 'Zahra', prenom: 'Youssef', type: 'Enfant', groupe: 'E1-1', age: 8 }
                ]
              },
              {
                id: 'res-003',
                beneficiaryName: 'Mohammed Alami',
                beneficiaryEmail: 'mohammed.alami@ocp.ma',
                beneficiaryMatricule: 'MAT003',
                beneficiaryType: 'Retraité',
                date: '2024-11-25',
                timeSlot: '10:00-12:00',
                bassin: 'Grand Bassin',
                status: 'APPROVED',
                participants: 1,
                createdAt: '2024-11-20T14:15:00Z',
                notes: 'Natation libre',
                participants_list: [
                  { nom: 'Alami', prenom: 'Mohammed', type: 'Retraité', groupe: 'R1-1' }
                ]
              },
              {
                id: 'res-004',
                beneficiaryName: 'Aicha Benjelloun',
                beneficiaryEmail: 'aicha.benjelloun@ocp.ma',
                beneficiaryMatricule: 'MAT004',
                beneficiaryType: 'Collaborateur',
                date: '2024-10-30',
                timeSlot: '16:00-18:00',
                bassin: 'Grand Bassin',
                status: 'APPROVED',
                participants: 4,
                createdAt: '2024-10-25T09:45:00Z',
                notes: 'Groupe famille élargie',
                participants_list: [
                  { nom: 'Benjelloun', prenom: 'Aicha', type: 'Collaborateur', groupe: 'A1-1' },
                  { nom: 'Benjelloun', prenom: 'Hassan', type: 'Conjoint', groupe: 'A1-1' },
                  { nom: 'Benjelloun', prenom: 'Salma', type: 'Enfant', groupe: 'E1-2', age: 12 },
                  { nom: 'Benjelloun', prenom: 'Karim', type: 'Enfant', groupe: 'E1-1', age: 9 }
                ]
              },
              {
                id: 'res-005',
                beneficiaryName: 'Omar Tazi',
                beneficiaryEmail: 'omar.tazi@ocp.ma',
                beneficiaryMatricule: 'MAT005',
                beneficiaryType: 'Collaborateur',
                date: '2024-09-15',
                timeSlot: '07:00-09:00',
                bassin: 'Grand Bassin',
                status: 'APPROVED',
                participants: 2,
                createdAt: '2024-09-10T16:20:00Z',
                notes: 'Entraînement matinal',
                participants_list: [
                  { nom: 'Tazi', prenom: 'Omar', type: 'Collaborateur', groupe: 'A2-2' },
                  { nom: 'Tazi', prenom: 'Nadia', type: 'Conjoint', groupe: 'A2-2' }
                ]
              }
            ],
            pagination: { page: 1, limit: 10, total: 5, pages: 1 }
          }
        } as ApiResponse<T>;

      case '/reservations/sport':
        return {
          success: true,
          data: {
            items: [
              {
                id: 'sport-001',
                beneficiaryName: 'Youssef Alami',
                beneficiaryEmail: 'youssef.alami@ocp.ma',
                beneficiaryMatricule: 'MAT006',
                beneficiaryType: 'Collaborateur',
                discipline: 'Tennis',
                disciplineCode: 'TEN',
                date: '2024-12-16',
                timeSlot: '16:00-17:00',
                status: 'PENDING',
                participants: 2,
                createdAt: '2024-12-14T11:00:00Z',
                notes: 'Match double',
                participants_list: [
                  { nom: 'Alami', prenom: 'Youssef', type: 'Collaborateur', groupe: 'TEN-A1' },
                  { nom: 'Alami', prenom: 'Rachid', type: 'Conjoint', groupe: 'TEN-A1' }
                ]
              },
              {
                id: 'sport-002',
                beneficiaryName: 'Laila Benkirane',
                beneficiaryEmail: 'laila.benkirane@ocp.ma',
                beneficiaryMatricule: 'MAT007',
                beneficiaryType: 'Collaborateur',
                discipline: 'Football',
                disciplineCode: 'FOOT',
                date: '2024-11-28',
                timeSlot: '18:00-20:00',
                status: 'APPROVED',
                participants: 8,
                createdAt: '2024-11-25T15:30:00Z',
                notes: 'Match équipe féminine',
                participants_list: [
                  { nom: 'Benkirane', prenom: 'Laila', type: 'Collaborateur', groupe: 'FOOT-F1' },
                  { nom: 'Hassani', prenom: 'Amina', type: 'Collaborateur', groupe: 'FOOT-F1' },
                  { nom: 'Idrissi', prenom: 'Khadija', type: 'Collaborateur', groupe: 'FOOT-F1' },
                  { nom: 'Ziani', prenom: 'Fatima', type: 'Collaborateur', groupe: 'FOOT-F1' },
                  { nom: 'Berrada', prenom: 'Nadia', type: 'Collaborateur', groupe: 'FOOT-F1' },
                  { nom: 'Alaoui', prenom: 'Samira', type: 'Collaborateur', groupe: 'FOOT-F1' },
                  { nom: 'Tounsi', prenom: 'Malika', type: 'Collaborateur', groupe: 'FOOT-F1' },
                  { nom: 'Chraibi', prenom: 'Zineb', type: 'Collaborateur', groupe: 'FOOT-F1' }
                ]
              },
              {
                id: 'sport-003',
                beneficiaryName: 'Khalid Mansouri',
                beneficiaryEmail: 'khalid.mansouri@ocp.ma',
                beneficiaryMatricule: 'MAT008',
                beneficiaryType: 'Collaborateur',
                discipline: 'Basketball',
                disciplineCode: 'BASK',
                date: '2024-10-22',
                timeSlot: '19:00-21:00',
                status: 'APPROVED',
                participants: 5,
                createdAt: '2024-10-18T13:45:00Z',
                notes: 'Entraînement équipe',
                participants_list: [
                  { nom: 'Mansouri', prenom: 'Khalid', type: 'Collaborateur', groupe: 'BASK-M1' },
                  { nom: 'Bennani', prenom: 'Amine', type: 'Collaborateur', groupe: 'BASK-M1' },
                  { nom: 'Fassi', prenom: 'Mehdi', type: 'Collaborateur', groupe: 'BASK-M1' },
                  { nom: 'Kettani', prenom: 'Saad', type: 'Collaborateur', groupe: 'BASK-M1' },
                  { nom: 'Ouali', prenom: 'Tarik', type: 'Collaborateur', groupe: 'BASK-M1' }
                ]
              },
              {
                id: 'sport-004',
                beneficiaryName: 'Sanaa Radi',
                beneficiaryEmail: 'sanaa.radi@ocp.ma',
                beneficiaryMatricule: 'MAT009',
                beneficiaryType: 'Retraité',
                discipline: 'Volleyball',
                disciplineCode: 'VOLL',
                date: '2024-09-30',
                timeSlot: '15:00-17:00',
                status: 'APPROVED',
                participants: 6,
                createdAt: '2024-09-27T10:20:00Z',
                notes: 'Groupe retraités mixte',
                participants_list: [
                  { nom: 'Radi', prenom: 'Sanaa', type: 'Retraité', groupe: 'VOLL-R1' },
                  { nom: 'Benali', prenom: 'Hassan', type: 'Retraité', groupe: 'VOLL-R1' },
                  { nom: 'Amrani', prenom: 'Aicha', type: 'Retraité', groupe: 'VOLL-R1' },
                  { nom: 'Filali', prenom: 'Omar', type: 'Retraité', groupe: 'VOLL-R1' },
                  { nom: 'Sekkat', prenom: 'Latifa', type: 'Retraité', groupe: 'VOLL-R1' },
                  { nom: 'Tazi', prenom: 'Abdelkader', type: 'Retraité', groupe: 'VOLL-R1' }
                ]
              },
              {
                id: 'sport-005',
                beneficiaryName: 'Hamza Berrada',
                beneficiaryEmail: 'hamza.berrada@ocp.ma',
                beneficiaryMatricule: 'MAT010',
                beneficiaryType: 'Collaborateur',
                discipline: 'Fitness',
                disciplineCode: 'FIT',
                date: '2024-08-15',
                timeSlot: '06:00-08:00',
                status: 'APPROVED',
                participants: 3,
                createdAt: '2024-08-12T07:15:00Z',
                notes: 'Session matinale',
                participants_list: [
                  { nom: 'Berrada', prenom: 'Hamza', type: 'Collaborateur', groupe: 'FIT-M1' },
                  { nom: 'Berrada', prenom: 'Nour', type: 'Conjoint', groupe: 'FIT-M1' },
                  { nom: 'Cherkaoui', prenom: 'Yassine', type: 'Collaborateur', groupe: 'FIT-M1' }
                ]
              }
            ],
            pagination: { page: 1, limit: 10, total: 5, pages: 1 }
          }
        } as ApiResponse<T>;

      case '/users':
        return {
          success: true,
          data: {
            items: [
              {
                id: 'user-001',
                firstName: 'Ahmed',
                lastName: 'Benali',
                email: 'ahmed.benali@ocp.ma',
                role: 'USER',
                isActive: true,
                department: 'Production'
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        } as ApiResponse<T>;

      case '/admin/stats/dashboard':
        return {
          success: true,
          data: {
            overview: {
              totalReservations: 10,
              totalRevenue: 15750,
              totalUsers: 25,
              totalActivities: 8,
              occupationRate: 78
            },
            monthlyStats: [
              { month: 'Août', reservations: 8, revenue: 3200 },
              { month: 'Sept', reservations: 12, revenue: 4800 },
              { month: 'Oct', reservations: 15, revenue: 6000 },
              { month: 'Nov', reservations: 18, revenue: 7200 },
              { month: 'Déc', reservations: 22, revenue: 8800 }
            ],
            occupationStats: [
              { hour: 7, avg_participants: 8 },
              { hour: 8, avg_participants: 15 },
              { hour: 9, avg_participants: 22 },
              { hour: 10, avg_participants: 18 },
              { hour: 14, avg_participants: 12 },
              { hour: 15, avg_participants: 20 },
              { hour: 16, avg_participants: 25 },
              { hour: 18, avg_participants: 28 }
            ]
          }
        } as ApiResponse<T>;

      case '/admin/stats/monthly-trends':
        return {
          success: true,
          data: {
            monthlyTrends: [
              { month: 'Août', reservations: 8, revenue: 3200 },
              { month: 'Sept', reservations: 12, revenue: 4800 },
              { month: 'Oct', reservations: 15, revenue: 6000 },
              { month: 'Nov', reservations: 18, revenue: 7200 },
              { month: 'Déc', reservations: 22, revenue: 8800 }
            ]
          }
        } as ApiResponse<T>;

      case '/admin/stats/revenue-by-discipline':
        return {
          success: true,
          data: {
            revenueByDiscipline: [
              { code: 'TEN', discipline: 'Tennis', revenue: 4500, reservations_count: 15, unique_users: 8 },
              { code: 'FOOT', discipline: 'Football', revenue: 3200, reservations_count: 12, unique_users: 24 },
              { code: 'BASK', discipline: 'Basketball', revenue: 2800, reservations_count: 10, unique_users: 15 },
              { code: 'VOLL', discipline: 'Volleyball', revenue: 2400, reservations_count: 8, unique_users: 12 },
              { code: 'FIT', discipline: 'Fitness', revenue: 2850, reservations_count: 18, unique_users: 20 }
            ]
          }
        } as ApiResponse<T>;

      case '/admin/stats/occupation-rates':
        return {
          success: true,
          data: {
            occupationRates: [
              { activity_name: 'Tennis Court A', discipline_code: 'TEN', total_reservations: 15, avg_participants: 2.5, max_capacity: 4, occupation_rate: 62.5 },
              { activity_name: 'Terrain Football', discipline_code: 'FOOT', total_reservations: 12, avg_participants: 18, max_capacity: 22, occupation_rate: 81.8 },
              { activity_name: 'Terrain Basketball', discipline_code: 'BASK', total_reservations: 10, avg_participants: 8, max_capacity: 10, occupation_rate: 80 },
              { activity_name: 'Terrain Volleyball', discipline_code: 'VOLL', total_reservations: 8, avg_participants: 10, max_capacity: 12, occupation_rate: 83.3 },
              { activity_name: 'Salle Fitness', discipline_code: 'FIT', total_reservations: 18, avg_participants: 15, max_capacity: 20, occupation_rate: 75 },
              { activity_name: 'Grand Bassin', discipline_code: 'PISC', total_reservations: 20, avg_participants: 12, max_capacity: 15, occupation_rate: 80 },
              { activity_name: 'Petit Bassin', discipline_code: 'PISC', total_reservations: 15, avg_participants: 6, max_capacity: 8, occupation_rate: 75 },
              { activity_name: 'Tennis Court B', discipline_code: 'TEN', total_reservations: 8, avg_participants: 2, max_capacity: 4, occupation_rate: 50 }
            ]
          }
        } as ApiResponse<T>;

      default:
        // Réponse générique pour les autres endpoints
        if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
          return {
            success: true,
            message: 'Opération réussie (mode test)',
            data: data
          } as ApiResponse<T>;
        }
        
        return {
          success: true,
          data: { message: 'Données simulées', endpoint, method }
        } as ApiResponse<T>;
    }
  }

  // Méthodes HTTP
  async get<T = any>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, null, params);
  }

  async post<T = any>(endpoint: string, data?: any, customHeaders: Record<string, string> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, customHeaders);
  }

  async put<T = any>(endpoint: string, data?: any, customHeaders: Record<string, string> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, customHeaders);
  }

  async delete<T = any>(endpoint: string, customHeaders: Record<string, string> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, null, customHeaders);
  }

  // === MÉTHODES SPÉCIFIQUES POUR L'APP ADMIN ===

  // Authentification
  async verifyToken(token: string) {
    return this.post('/auth/verify-token', { token });
  }

  async verifyUser(email: string, matricule: string): Promise<ApiResponse<any>> {
    return this.request('POST', '/auth/verify-user', { email, matricule }, null, false);
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async updateProfile(profileData: any) {
    return this.put('/auth/profile', profileData);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  // === GESTION UTILISATEURS ===
  async getUsers(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.request('GET', '/users', null, params);
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.request('POST', '/users', userData);
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse<any>> {
    return this.request('PUT', `/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    return this.request('DELETE', `/users/${id}`);
  }

  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('GET', '/auth/profile');
  }

  async updateUserProfile(data: any): Promise<ApiResponse<any>> {
    return this.request('PUT', '/auth/profile', data);
  }

  // === GESTION RÉSERVATIONS ===
  async getPiscineReservations(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.request('GET', '/reservations/piscine', null, params);
  }

  async createPiscineReservation(data: any): Promise<ApiResponse<any>> {
    return this.request('POST', '/reservations/piscine', data, null, false);
  }

  async updatePiscineReservation(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request('PUT', `/reservations/piscine/${id}`, data);
  }

  async deletePiscineReservation(id: string): Promise<ApiResponse<any>> {
    return this.request('DELETE', `/reservations/piscine/${id}`);
  }

  // Affecter des participants aux groupes
  async assignParticipantsToGroups(reservationId: string, groupAssignments: any): Promise<ApiResponse<any>> {
    return this.request('POST', `/reservations/piscine/${reservationId}/assign-groups`, { groupAssignments });
  }

  // Valider les paiements pour les réservations
  async updateReservationPaymentStatus(reservationId: string, paymentData: any): Promise<ApiResponse<any>> {
    return this.request('PUT', `/reservations/${reservationId}/payment`, paymentData);
  }

  async getSportReservations(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.request('GET', '/reservations/sport', null, params);
  }

  async createSportReservation(data: any): Promise<ApiResponse<any>> {
    return this.request('POST', '/reservations/sport', data);
  }

  async updateSportReservation(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request('PUT', `/reservations/sport/${id}`, data);
  }

  async deleteSportReservation(id: string): Promise<ApiResponse<any>> {
    return this.request('DELETE', `/reservations/sport/${id}`);
  }

  // Approuver/Rejeter une réservation
  async approveReservation(id: string, type: 'piscine' | 'sport'): Promise<ApiResponse<any>> {
    return this.request('POST', `/reservations/${type}/${id}/approve`);
  }

  async rejectReservation(id: string, type: 'piscine' | 'sport', reason: string): Promise<ApiResponse<any>> {
    return this.request('POST', `/reservations/${type}/${id}/reject`, { reason });
  }

  // Générer des rapports
  async generateReservationReport(type: 'piscine' | 'sport', filters?: any): Promise<ApiResponse<any>> {
    return this.request('GET', `/reports/reservations/${type}`, null, filters);
  }

  // === GESTION ACTIVITÉS ===
  async getActivities(type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.get<{ activities: any[] }>(`/activities${query}`);
  }

  async createActivity(activityData: any) {
    return this.post('/activities', activityData);
  }

  async updateActivity(id: string, activityData: any) {
    return this.put(`/activities/${id}`, activityData);
  }

  async deleteActivity(id: string) {
    return this.delete(`/activities/${id}`);
  }

  async getActivityStats() {
    return this.get('/activities/stats');
  }

  // === GESTION PAIEMENTS ===
  async getAllPayments(params: PaginationParams & { status?: string; method?: string; search?: string } = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.append(key, value.toString());
    });
    return this.get<{ payments: any[]; pagination: any }>(`/payments/admin/all?${query}`);
  }

  async updatePaymentStatus(id: string, status: string, notes?: string) {
    return this.put(`/payments/admin/${id}/status`, { status, notes });
  }

  async getPaymentStats() {
    return this.get('/payments/admin/stats');
  }

  async exportPayments(params: { startDate?: string; endDate?: string; status?: string; format?: string } = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.append(key, value);
    });
    return this.get(`/payments/admin/export?${query}`);
  }

  // === GESTION NOTIFICATIONS ===
  async getAllNotifications(params: PaginationParams & { type?: string; search?: string } = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.append(key, value.toString());
    });
    return this.get<{ notifications: any[]; pagination: any }>(`/notifications/admin/all?${query}`);
  }

  async broadcastNotification(notificationData: {
    title: string;
    message: string;
    type?: string;
    targetRole?: string;
    targetUsers?: string[];
  }) {
    return this.post('/notifications/admin/broadcast', notificationData);
  }

  async getNotificationStats() {
    return this.get('/notifications/admin/stats');
  }

  // === CODES DISCIPLINES ===
  async getDisciplineCodes() {
    return this.get<{ disciplineCodes: any[] }>('/admin/discipline-codes');
  }

  async createDisciplineCode(codeData: any) {
    return this.post('/admin/discipline-codes', codeData);
  }

  async updateDisciplineCode(code: string, codeData: any) {
    return this.put(`/admin/discipline-codes/${code}`, codeData);
  }

  // === GESTION GROUPES ===
  async getGroupes() {
    return this.get<{ groupes: any[] }>('/admin/groupes');
  }

  async createGroupe(groupeData: any) {
    return this.post('/admin/groupes', groupeData);
  }

  async updateGroupe(code: string, groupeData: any) {
    return this.put(`/admin/groupes/${code}`, groupeData);
  }

  async deleteGroupe(code: string) {
    return this.delete(`/admin/groupes/${code}`);
  }

  // === STATISTIQUES GLOBALES ===
  async getDashboardStats() {
    return this.get('/admin/stats/dashboard');
  }

  async getRevenueByDiscipline() {
    return this.get('/admin/stats/revenue-by-discipline');
  }

  async getParticipantsByType() {
    return this.get('/admin/stats/participants-by-type');
  }

  async getOccupationRates() {
    return this.get('/admin/stats/occupation-rates');
  }

  async getMonthlyTrends() {
    return this.get('/admin/stats/monthly-trends');
  }

  // === STATISTIQUES INTÉGRÉES POUR DASHBOARD ===
  async getIntegratedStats() {
    try {
      const [
        piscineRes,
        sportRes,
        disciplinesRes,
        groupesRes,
        paymentsRes
      ] = await Promise.all([
        this.getPiscineReservations(),
        this.getSportReservations(),
        this.getDisciplineCodes(),
        this.getGroupes(),
        this.getAllPayments()
      ]);

      // Calculer les statistiques à partir des données réelles
      const piscineReservations = piscineRes.data?.items || [];
      const sportReservations = sportRes.data?.items || [];
      const allReservations = [...piscineReservations, ...sportReservations];
      
      const disciplines = disciplinesRes.data?.disciplineCodes || [];
      const groupes = groupesRes.data?.groupes || [];
      const payments = paymentsRes.data?.payments || [];

      // Calculer les métriques
      const totalReservations = allReservations.length;
      const pendingReservations = allReservations.filter(r => r.status === 'PENDING').length;
      const approvedReservations = allReservations.filter(r => r.status === 'APPROVED').length;
      
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const paidPayments = payments.filter(p => p.status === 'COMPLETED').length;
      
      const totalParticipants = allReservations.reduce((sum, r) => sum + (r.participants || 1), 0);
      const totalCapacity = groupes.reduce((sum, g) => sum + (g.capacite || 0), 0);
      const occupationRate = totalCapacity > 0 ? Math.round((totalParticipants / totalCapacity) * 100) : 0;

      return {
        success: true,
        data: {
          overview: {
            totalReservations,
            pendingReservations,
            approvedReservations,
            totalRevenue,
            totalParticipants,
            occupationRate,
            totalActivities: disciplines.length,
            totalUsers: allReservations.length, // Approximation
            paymentRate: payments.length > 0 ? Math.round((paidPayments / payments.length) * 100) : 0
          },
          reservations: {
            piscine: piscineReservations,
            sport: sportReservations,
            byStatus: {
              pending: pendingReservations,
              approved: approvedReservations,
              rejected: allReservations.filter(r => r.status === 'REJECTED').length
            }
          },
          disciplines,
          groupes,
          payments: {
            total: payments.length,
            completed: paidPayments,
            pending: payments.filter(p => p.status === 'PENDING').length,
            totalAmount: totalRevenue
          }
        }
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques intégrées:', error);
      return {
        success: false,
        message: 'Erreur lors du calcul des statistiques',
        data: null
      };
    }
  }

  async getCombinedDashboardStats() {
    const [paymentStats, notificationStats, activityStats, dashboardStats] = await Promise.all([
      this.getPaymentStats(),
      this.getNotificationStats(),
      this.getActivityStats(),
      this.getDashboardStats()
    ]);

    return {
      success: true,
      data: {
        payments: paymentStats.data?.stats || {},
        notifications: notificationStats.data?.stats || {},
        activities: activityStats.data?.stats || {},
        dashboard: dashboardStats.data || {}
      }
    };
  }

  // Health check
  async checkHealth() {
    return this.get('/health');
  }

  // Gestion des erreurs
  isNetworkError(error: Error): boolean {
    return error.message.includes('Network') || 
           error.message.includes('fetch') ||
           error.message.includes('Timeout');
  }

  isAuthError(error: Error): boolean {
    return error.message.includes('401') || 
           error.message.includes('Unauthorized') ||
           error.message.includes('Token');
  }

  // Retry automatique pour les erreurs réseau
  async requestWithRetry<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    maxRetries: number = 3
  ): Promise<ApiResponse<T>> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.request<T>(method, endpoint, data);
      } catch (error: any) {
        lastError = error;
        
        if (this.isAuthError(error)) {
          // Ne pas retry les erreurs d'authentification
          throw error;
        }
        
        if (this.isNetworkError(error) && i < maxRetries - 1) {
          // Attendre avant de retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError!;
  }
}

export const apiService = new ApiService();
