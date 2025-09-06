import * as XLSX from 'xlsx';
import { apiService } from './apiService';

export interface ImportResult {
  success: boolean;
  message: string;
  stats?: {
    total: number;
    added: number;
    updated: number;
    unchanged: number;
    errors: number;
  };
  errors?: string[];
}

export interface ArchiveEmployee {
  matricule: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  status: string;
  type: 'employee';
}

export interface ArchiveRetiree {
  matricule?: string;
  rcarNumber?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  retirementDate?: string;
  status: string;
  type: 'retiree';
}

export interface ArchiveFamilyMember {
  parentMatricule: string;
  firstName: string;
  lastName: string;
  relationship: string;
  birthDate?: string;
  gender?: string;
  cne?: string;
  type: 'family_member';
}

export class ImportService {
  
  // ==================== IMPORT ARCHIVES EXCEL ====================
  
  /**
   * Import des archives depuis des fichiers Excel
   */
  static async importArchivesFromExcel(files: FileList): Promise<ImportResult> {
    try {
      if (!files || files.length === 0) {
        return {
          success: false,
          message: 'Aucun fichier sélectionné'
        };
      }

      const results = {
        employees: [] as ArchiveEmployee[],
        retirees: [] as ArchiveRetiree[],
        familyMembers: [] as ArchiveFamilyMember[]
      };

      let totalProcessed = 0;
      const errors: string[] = [];

      // Traiter chaque fichier Excel
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          const data = await this.readExcelFile(file);
          const processedData = await this.processExcelData(data, file.name);
          
          if (processedData.employees) {
            results.employees.push(...processedData.employees);
          }
          if (processedData.retirees) {
            results.retirees.push(...processedData.retirees);
          }
          if (processedData.familyMembers) {
            results.familyMembers.push(...processedData.familyMembers);
          }
          
          totalProcessed += processedData.totalRows || 0;
        } catch (error) {
          console.error(`Erreur traitement fichier ${file.name}:`, error);
          errors.push(`Erreur fichier ${file.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
      }

      // Envoyer les données au backend pour traitement
      const importResult = await this.sendArchivesToBackend(results);
      
      return {
        success: importResult.success,
        message: importResult.message,
        stats: {
          total: totalProcessed,
          added: importResult.stats?.added || 0,
          updated: importResult.stats?.updated || 0,
          unchanged: importResult.stats?.unchanged || 0,
          errors: errors.length
        },
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      console.error('Erreur import archives:', error);
      return {
        success: false,
        message: `Erreur lors de l'import: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  /**
   * Lire un fichier Excel
   */
  private static readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Prendre la première feuille
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convertir en JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: ''
          });
          
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Erreur lecture fichier Excel: ${error instanceof Error ? error.message : 'Format invalide'}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Erreur lecture fichier'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Traiter les données Excel selon le type détecté
   */
  private static async processExcelData(data: any[], fileName: string) {
    if (!data || data.length < 2) {
      throw new Error('Fichier vide ou format invalide');
    }

    const headers = data[0] as string[];
    const rows = data.slice(1);

    // Détecter le type de fichier basé sur les en-têtes
    const fileType = this.detectFileType(headers, fileName);
    
    switch (fileType) {
      case 'employees':
        return {
          employees: this.processEmployeesData(headers, rows),
          totalRows: rows.length
        };
        
      case 'retirees':
        return {
          retirees: this.processRetireesData(headers, rows),
          totalRows: rows.length
        };
        
      case 'family':
        return {
          familyMembers: this.processFamilyData(headers, rows),
          totalRows: rows.length
        };
        
      default:
        throw new Error(`Type de fichier non reconnu: ${fileName}`);
    }
  }

  /**
   * Détecter le type de fichier basé sur les en-têtes
   */
  private static detectFileType(headers: string[], fileName: string): 'employees' | 'retirees' | 'family' {
    const headerStr = headers.join(' ').toLowerCase();
    
    if (headerStr.includes('matricule') && (headerStr.includes('employe') || headerStr.includes('employee') || headerStr.includes('poste'))) {
      return 'employees';
    }
    
    if (headerStr.includes('retraite') || headerStr.includes('rcar') || headerStr.includes('pension')) {
      return 'retirees';
    }
    
    if (headerStr.includes('famille') || headerStr.includes('enfant') || headerStr.includes('conjoint') || headerStr.includes('parent')) {
      return 'family';
    }
    
    // Fallback basé sur le nom du fichier
    const fileNameLower = fileName.toLowerCase();
    if (fileNameLower.includes('employe') || fileNameLower.includes('employee')) {
      return 'employees';
    }
    if (fileNameLower.includes('retraite') || fileNameLower.includes('rcar')) {
      return 'retirees';
    }
    if (fileNameLower.includes('famille') || fileNameLower.includes('family')) {
      return 'family';
    }
    
    // Par défaut, considérer comme employés
    return 'employees';
  }

  /**
   * Traiter les données des employés
   */
  private static processEmployeesData(headers: string[], rows: any[]): ArchiveEmployee[] {
    const employees: ArchiveEmployee[] = [];
    
    // Mapper les colonnes communes
    const columnMap = this.createColumnMap(headers, {
      matricule: ['matricule', 'mat', 'id', 'numero'],
      firstName: ['prenom', 'firstname', 'first_name', 'nom_prenom'],
      lastName: ['nom', 'lastname', 'last_name', 'nom_famille'],
      email: ['email', 'mail', 'e_mail'],
      phone: ['telephone', 'tel', 'phone', 'mobile'],
      department: ['departement', 'dept', 'department', 'service'],
      position: ['poste', 'position', 'fonction', 'job'],
      hireDate: ['date_embauche', 'embauche', 'hire_date', 'date_recrutement']
    });

    rows.forEach((row, index) => {
      try {
        const employee: ArchiveEmployee = {
          matricule: this.getValueFromRow(row, columnMap.matricule) || `EMP_${index + 1}`,
          firstName: this.getValueFromRow(row, columnMap.firstName) || '',
          lastName: this.getValueFromRow(row, columnMap.lastName) || '',
          email: this.getValueFromRow(row, columnMap.email),
          phone: this.getValueFromRow(row, columnMap.phone),
          department: this.getValueFromRow(row, columnMap.department),
          position: this.getValueFromRow(row, columnMap.position),
          hireDate: this.getValueFromRow(row, columnMap.hireDate),
          status: 'active',
          type: 'employee'
        };

        if (employee.firstName && employee.lastName) {
          employees.push(employee);
        }
      } catch (error) {
        console.warn(`Erreur traitement ligne ${index + 1}:`, error);
      }
    });

    return employees;
  }

  /**
   * Traiter les données des retraités
   */
  private static processRetireesData(headers: string[], rows: any[]): ArchiveRetiree[] {
    const retirees: ArchiveRetiree[] = [];
    
    const columnMap = this.createColumnMap(headers, {
      matricule: ['matricule', 'mat', 'id', 'numero'],
      rcarNumber: ['rcar', 'numero_rcar', 'rcar_number'],
      firstName: ['prenom', 'firstname', 'first_name'],
      lastName: ['nom', 'lastname', 'last_name'],
      email: ['email', 'mail', 'e_mail'],
      phone: ['telephone', 'tel', 'phone', 'mobile'],
      retirementDate: ['date_retraite', 'retraite', 'retirement_date']
    });

    rows.forEach((row, index) => {
      try {
        const retiree: ArchiveRetiree = {
          matricule: this.getValueFromRow(row, columnMap.matricule),
          rcarNumber: this.getValueFromRow(row, columnMap.rcarNumber),
          firstName: this.getValueFromRow(row, columnMap.firstName) || '',
          lastName: this.getValueFromRow(row, columnMap.lastName) || '',
          email: this.getValueFromRow(row, columnMap.email),
          phone: this.getValueFromRow(row, columnMap.phone),
          retirementDate: this.getValueFromRow(row, columnMap.retirementDate),
          status: 'retired',
          type: 'retiree'
        };

        if (retiree.firstName && retiree.lastName) {
          retirees.push(retiree);
        }
      } catch (error) {
        console.warn(`Erreur traitement ligne ${index + 1}:`, error);
      }
    });

    return retirees;
  }

  /**
   * Traiter les données des membres de famille
   */
  private static processFamilyData(headers: string[], rows: any[]): ArchiveFamilyMember[] {
    const familyMembers: ArchiveFamilyMember[] = [];
    
    const columnMap = this.createColumnMap(headers, {
      parentMatricule: ['matricule_parent', 'parent_matricule', 'matricule', 'mat_parent'],
      firstName: ['prenom', 'firstname', 'first_name', 'prenom_enfant'],
      lastName: ['nom', 'lastname', 'last_name', 'nom_enfant'],
      relationship: ['lien', 'relation', 'relationship', 'parente'],
      birthDate: ['date_naissance', 'naissance', 'birth_date', 'date_naiss'],
      gender: ['sexe', 'genre', 'gender', 'sex'],
      cne: ['cne', 'cin', 'carte_identite']
    });

    rows.forEach((row, index) => {
      try {
        const familyMember: ArchiveFamilyMember = {
          parentMatricule: this.getValueFromRow(row, columnMap.parentMatricule) || '',
          firstName: this.getValueFromRow(row, columnMap.firstName) || '',
          lastName: this.getValueFromRow(row, columnMap.lastName) || '',
          relationship: this.getValueFromRow(row, columnMap.relationship) || 'enfant',
          birthDate: this.getValueFromRow(row, columnMap.birthDate),
          gender: this.getValueFromRow(row, columnMap.gender),
          cne: this.getValueFromRow(row, columnMap.cne),
          type: 'family_member'
        };

        if (familyMember.parentMatricule && familyMember.firstName && familyMember.lastName) {
          familyMembers.push(familyMember);
        }
      } catch (error) {
        console.warn(`Erreur traitement ligne ${index + 1}:`, error);
      }
    });

    return familyMembers;
  }

  /**
   * Créer une map des colonnes basée sur les en-têtes
   */
  private static createColumnMap(headers: string[], fieldMap: Record<string, string[]>): Record<string, number[]> {
    const columnMap: Record<string, number[]> = {};
    
    Object.entries(fieldMap).forEach(([field, possibleNames]) => {
      columnMap[field] = [];
      
      headers.forEach((header, index) => {
        const headerLower = header.toLowerCase().trim();
        if (possibleNames.some(name => headerLower.includes(name.toLowerCase()))) {
          columnMap[field].push(index);
        }
      });
    });
    
    return columnMap;
  }

  /**
   * Récupérer une valeur d'une ligne basée sur les indices de colonnes
   */
  private static getValueFromRow(row: any[], columnIndices: number[]): string | undefined {
    for (const index of columnIndices) {
      if (index < row.length && row[index] !== null && row[index] !== undefined && row[index] !== '') {
        return String(row[index]).trim();
      }
    }
    return undefined;
  }

  /**
   * Envoyer les archives au backend
   */
  private static async sendArchivesToBackend(data: {
    employees: ArchiveEmployee[];
    retirees: ArchiveRetiree[];
    familyMembers: ArchiveFamilyMember[];
  }): Promise<ImportResult> {
    try {
      // Endpoint pour l'import des archives (à implémenter dans le backend)
      const response = await apiService.post('/admin/archives/import', {
        employees: data.employees,
        retirees: data.retirees,
        familyMembers: data.familyMembers
      });

      if (response.success) {
        return {
          success: true,
          message: `Import réussi: ${response.data?.stats?.added || 0} ajoutés, ${response.data?.stats?.updated || 0} mis à jour`,
          stats: response.data?.stats
        };
      } else {
        return {
          success: false,
          message: response.error?.message || 'Erreur lors de l\'import'
        };
      }
    } catch (error) {
      console.error('Erreur envoi archives:', error);
      return {
        success: false,
        message: `Erreur communication serveur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  // ==================== MÉTHODES UTILITAIRES ====================

  /**
   * Valider un fichier Excel
   */
  static validateExcelFile(file: File): { isValid: boolean; message?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: 'Format de fichier non supporté. Utilisez des fichiers Excel (.xlsx, .xls)'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        message: 'Fichier trop volumineux. Taille maximale: 10MB'
      };
    }

    return { isValid: true };
  }

  /**
   * Prévisualiser les données d'un fichier Excel
   */
  static async previewExcelFile(file: File, maxRows: number = 5): Promise<{
    success: boolean;
    data?: any[];
    headers?: string[];
    message?: string;
  }> {
    try {
      const validation = this.validateExcelFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.message
        };
      }

      const data = await this.readExcelFile(file);
      
      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'Fichier vide'
        };
      }

      const headers = data[0] as string[];
      const previewData = data.slice(1, maxRows + 1);

      return {
        success: true,
        headers,
        data: previewData
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur prévisualisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }
}

export default ImportService;
