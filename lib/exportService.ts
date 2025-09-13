import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { apiService } from './apiService';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export class ExportService {
  
  // ==================== EXPORT EXCEL ====================
  
  /**
   * Export des utilisateurs vers Excel
   */
  static async exportUsersToExcel() {
    try {
      const response = await apiService.getUsers({ page: 1, limit: 1000 });
      
      if (!response.success || !response.data?.users) {
        throw new Error('Erreur lors de la récupération des données utilisateurs');
      }

      const users = response.data.users.map((user: any) => ({
        'Matricule': user.matricule || '',
        'Prénom': user.firstName || '',
        'Nom': user.lastName || '',
        'Email': user.email || '',
        'Téléphone': user.telephone || '',
        'Département': user.department || '',
        'Rôle': user.role || '',
        'Statut': user.isActive ? 'Actif' : 'Inactif',
        'Date d\'inscription': user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '',
        'Dernière connexion': user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais'
      }));

      this.downloadExcel(users, 'utilisateurs_ocp');
      return { success: true, message: 'Export Excel des utilisateurs réussi' };
    } catch (error) {
      console.error('Erreur export utilisateurs:', error);
      return { success: false, message: 'Erreur lors de l\'export des utilisateurs' };
    }
  }

  /**
   * Export des codes disciplines vers Excel
   */
  static async exportDisciplineCodesToExcel() {
    try {
      const response = await apiService.getDisciplineCodes();
      
      if (!response.success || !response.data?.disciplineCodes) {
        throw new Error('Erreur lors de la récupération des codes disciplines');
      }

      const codes = response.data.disciplineCodes.map((code: any) => ({
        'Code': code.code || '',
        'Nom': code.name || '',
        'Prix (DH)': code.price || 0,
        'Catégorie': code.category || '',
        'Statut': code.isActive ? 'Actif' : 'Inactif',
        'Date de création': code.createdAt ? new Date(code.createdAt).toLocaleDateString('fr-FR') : '',
        'Dernière modification': code.updatedAt ? new Date(code.updatedAt).toLocaleDateString('fr-FR') : ''
      }));

      this.downloadExcel(codes, 'codes_disciplines_ocp');
      return { success: true, message: 'Export Excel des codes disciplines réussi' };
    } catch (error) {
      console.error('Erreur export codes disciplines:', error);
      return { success: false, message: 'Erreur lors de l\'export des codes disciplines' };
    }
  }

  /**
   * Export des réservations sport vers Excel
   */
  static async exportSportReservationsToExcel() {
    try {
      console.log('Début de l\'export des réservations sport...');
      
      // Utiliser le nouvel endpoint d'export
      const response = await apiService.request('GET', '/reservations/sport/export');
      
      console.log('Réponse de l\'API d\'export:', response);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors de la récupération des données d\'export');
      }

      const reservations = response.data;
      
      if (!Array.isArray(reservations)) {
        throw new Error('Format de données d\'export invalide');
      }
      
      if (reservations.length === 0) {
        console.warn('Aucune réservation à exporter');
        return { success: false, message: 'Aucune réservation à exporter' };
      }

      console.log(`Préparation de l'export de ${reservations.length} réservations...`);
      
      // Utiliser directement les données formatées du backend
      this.downloadExcel(reservations, 'reservations_sport_ocp');
      
      return { 
        success: true, 
        message: 'Export Excel des réservations sport réussi',
        count: reservations.length
      };
      
    } catch (error) {
      console.error('Erreur détaillée lors de l\'export des réservations sport:', {
        error,
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur lors de l\'export des réservations sport',
        error: error instanceof Error ? error.toString() : 'Erreur inconnue'
      };
    }
  }

  /**
   * Export des réservations piscine vers Excel
   */
  static async exportPiscineReservationsToExcel() {
    try {
      const response = await apiService.getPiscineReservations({ page: 1, limit: 1000 });
      
      if (!response.success || !response.data?.reservations) {
        throw new Error('Erreur lors de la récupération des réservations piscine');
      }

      const reservations = response.data.reservations.map((reservation: any) => ({
        'ID Réservation': reservation.id || '',
        'Utilisateur': `${reservation.user?.firstName || ''} ${reservation.user?.lastName || ''}`,
        'Email': reservation.user?.email || '',
        'Matricule': reservation.user?.matricule || '',
        'Activité': reservation.activity?.name || '',
        'Date': reservation.date ? new Date(reservation.date).toLocaleDateString('fr-FR') : '',
        'Créneau': reservation.timeSlot || '',
        'Participants': reservation.participants || 0,
        'Statut': reservation.status || '',
        'Montant total (DH)': reservation.totalAmount || 0,
        'Montant payé (DH)': reservation.paidAmount || 0,
        'Statut paiement': reservation.paymentStatus || '',
        'Notes': reservation.notes || '',
        'Date de création': reservation.createdAt ? new Date(reservation.createdAt).toLocaleDateString('fr-FR') : ''
      }));

      this.downloadExcel(reservations, 'reservations_piscine_ocp');
      return { success: true, message: 'Export Excel des réservations piscine réussi' };
    } catch (error) {
      console.error('Erreur export réservations piscine:', error);
      return { success: false, message: 'Erreur lors de l\'export des réservations piscine' };
    }
  }

  // ==================== EXPORT PDF ====================

  /**
   * Export des statistiques dashboard vers PDF
   */
  static async exportDashboardStatsToPDF() {
    try {
      const [dashboardStats, revenueByDiscipline, monthlyTrends] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRevenueByDiscipline(),
        apiService.getMonthlyTrends()
      ]);

      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(22, 163, 74);
      doc.text('Rapport Statistiques OCP Sport', 20, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, 35);

      let yPosition = 50;

      // Statistiques générales
      if (dashboardStats.success && dashboardStats.data?.overview) {
        const overview = dashboardStats.data.overview;
        
        doc.setFontSize(16);
        doc.setTextColor(22, 163, 74);
        doc.text('Vue d\'ensemble', 20, yPosition);
        yPosition += 15;

        const overviewData = [
          ['Total Réservations', overview.totalReservations?.toString() || '0'],
          ['Revenus Total (DH)', overview.totalRevenue?.toFixed(2) || '0.00'],
          ['Utilisateurs Actifs', overview.totalUsers?.toString() || '0'],
          ['Activités Disponibles', overview.totalActivities?.toString() || '0'],
          ['Taux d\'Occupation (%)', overview.occupationRate?.toString() || '0']
        ];

        doc.autoTable({
          startY: yPosition,
          head: [['Métrique', 'Valeur']],
          body: overviewData,
          theme: 'grid',
          headStyles: { fillColor: [22, 163, 74] },
          margin: { left: 20, right: 20 }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
      }

      // Revenus par discipline
      if (revenueByDiscipline.success && revenueByDiscipline.data?.revenueByDiscipline) {
        doc.setFontSize(16);
        doc.setTextColor(22, 163, 74);
        doc.text('Revenus par Discipline', 20, yPosition);
        yPosition += 15;

        const revenueData = revenueByDiscipline.data.revenueByDiscipline.map((item: any) => [
          item.discipline || item.name || '',
          item.reservations_count?.toString() || '0',
          item.revenue?.toFixed(2) || '0.00',
          item.unique_users?.toString() || '0'
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [['Discipline', 'Réservations', 'Revenus (DH)', 'Utilisateurs']],
          body: revenueData,
          theme: 'grid',
          headStyles: { fillColor: [22, 163, 74] },
          margin: { left: 20, right: 20 }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
      }

      // Ajouter nouvelle page si nécessaire
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }

      // Tendances mensuelles
      if (monthlyTrends.success && monthlyTrends.data?.monthlyTrends) {
        doc.setFontSize(16);
        doc.setTextColor(22, 163, 74);
        doc.text('Tendances Mensuelles', 20, yPosition);
        yPosition += 15;

        const trendsData = monthlyTrends.data.monthlyTrends.map((item: any) => [
          item.month || '',
          item.reservations?.toString() || '0',
          item.unique_participants?.toString() || '0',
          item.revenue?.toFixed(2) || '0.00'
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [['Mois', 'Réservations', 'Participants', 'Revenus (DH)']],
          body: trendsData,
          theme: 'grid',
          headStyles: { fillColor: [22, 163, 74] },
          margin: { left: 20, right: 20 }
        });
      }

      // Télécharger le PDF
      const fileName = `rapport_statistiques_ocp_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      return { success: true, message: 'Export PDF des statistiques réussi' };
    } catch (error) {
      console.error('Erreur export PDF statistiques:', error);
      return { success: false, message: 'Erreur lors de l\'export PDF des statistiques' };
    }
  }

  // ==================== MÉTHODES UTILITAIRES ====================

  /**
   * Télécharger un fichier Excel
   */
  static downloadExcel(data: any[], fileName: string) {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Aucune donnée valide fournie pour l\'export Excel');
      }

      console.log(`Génération du fichier Excel avec ${data.length} entrées...`);
      
      // Créer un nouveau classeur
      const wb = XLSX.utils.book_new();
      
      // Convertir les données en feuille de calcul
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Ajouter la feuille de calcul au classeur
      XLSX.utils.book_append_sheet(wb, ws, 'Réservations');
      
      // Générer le fichier Excel
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
      // Créer un blob à partir du buffer
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Créer un objet URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un élément <a> pour le téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Déclencher le téléchargement
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Téléchargement du fichier Excel réussi');
      
    } catch (error) {
      console.error('Erreur lors de la génération du fichier Excel:', {
        error,
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        dataLength: data?.length,
        fileName
      });
      throw new Error(`Échec de la génération du fichier Excel: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Formater les données pour l'export
   */
  static formatDataForExport(data: any[], type: 'users' | 'reservations' | 'disciplines' | 'groups') {
    switch (type) {
      case 'users':
        return data.map(user => ({
          'Matricule': user.matricule || '',
          'Prénom': user.firstName || user.prenom || '',
          'Nom': user.lastName || user.nom || '',
          'Email': user.email || '',
          'Téléphone': user.telephone || '',
          'Rôle': user.role || '',
          'Statut': user.isActive ? 'Actif' : 'Inactif'
        }));
        
      case 'disciplines':
        return data.map(discipline => ({
          'Code': discipline.code || '',
          'Nom': discipline.name || discipline.nom || '',
          'Prix': discipline.price || discipline.prix || 0,
          'Catégorie': discipline.category || discipline.categorie || ''
        }));
        
      default:
        return data;
    }
  }

  /**
   * Valider les données avant export
   */
  static validateExportData(data: any[]): { isValid: boolean; message?: string } {
    if (!Array.isArray(data)) {
      return { isValid: false, message: 'Les données doivent être un tableau' };
    }
    
    if (data.length === 0) {
      return { isValid: false, message: 'Aucune donnée à exporter' };
    }
    
    return { isValid: true };
  }

  /**
   * Générer un nom de fichier avec timestamp
   */
  static generateFileName(baseName: string, extension: 'xlsx' | 'pdf' = 'xlsx'): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${baseName}_${timestamp}.${extension}`;
  }


  static async exportPiscineReservationsToExcel() {
    try {
      const response = await apiService.request('GET', '/reservations/piscine/export');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors de la récupération des données');
      }
  
      const reservations = response.data;
      
      if (!Array.isArray(reservations)) {
        throw new Error('Format de données invalide');
      }
      
      if (reservations.length === 0) {
        return { 
          success: false, 
          message: 'Aucune réservation à exporter',
          count: 0
        };
      }
  
      this.downloadExcel(reservations, 'reservations_piscine_ocp');
      
      return { 
        success: true, 
        message: 'Export réussi',
        count: reservations.length
      };
      
    } catch (error) {
      console.error('Erreur export piscine:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        error: error instanceof Error ? error.toString() : 'Erreur inconnue'
      };
    }
  }
}

export default ExportService;
