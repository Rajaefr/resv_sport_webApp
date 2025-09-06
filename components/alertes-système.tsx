"use client"

import { AlertCircle, Clock, XCircle, RefreshCw, CheckCircle, Info } from "lucide-react"
import { useState, useEffect } from "react"
import { apiService } from "../lib/apiService"

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export function SystemAlerts() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAllNotifications();
      
      // Convertir les notifications en alertes système
      const notifications = response.data?.notifications || [];
      const systemAlerts: SystemAlert[] = notifications
        .filter((notif: any) => notif.type === 'SYSTEM' || notif.type === 'ALERT')
        .slice(0, 5) // Limiter à 5 alertes
        .map((notif: any) => ({
          id: notif.id,
          type: getAlertType(notif.priority),
          title: notif.title,
          message: notif.message,
          createdAt: notif.createdAt,
          isRead: notif.isRead
        }));
      
      setAlerts(systemAlerts);
      
    } catch (err) {
      console.error('Erreur lors du chargement des alertes:', err);
      setError('Erreur lors du chargement des alertes');
    } finally {
      setLoading(false);
    }
  };

  const getAlertType = (priority: string): 'warning' | 'error' | 'info' | 'success' => {
    switch (priority) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'info';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const markAsRead = async (alertId: string) => {
    // Marquer comme lu localement (l'API de marquage sera ajoutée plus tard)
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-transparent border-0">
          <h5 className="card-title fw-bold mb-1 d-flex align-items-center gap-2">
            <AlertCircle size={20} className="text-warning" />
            Alertes Système
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title fw-bold mb-1 d-flex align-items-center gap-2">
            <AlertCircle size={20} className="text-warning" />
            Alertes Système
          </h5>
          <button 
            className="btn btn-light btn-sm border-0" 
            onClick={fetchAlerts}
            disabled={loading}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      <div className="card-body">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
            <button 
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={fetchAlerts}
            >
              Réessayer
            </button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center text-muted py-4">
            <CheckCircle size={48} className="text-success mb-2" />
            <p className="mb-0">Aucune alerte système</p>
          </div>
        ) : (
          <div className="alerts-container">
            {alerts.map((alert: SystemAlert) => {
              const Icon = getAlertIcon(alert.type);
              return (
                <div 
                  key={alert.id} 
                  className={`alert-item alert-${alert.type} ${!alert.isRead ? 'alert-unread' : ''}`}
                  onClick={() => !alert.isRead && markAsRead(alert.id)}
                  style={{ cursor: !alert.isRead ? 'pointer' : 'default' }}
                >
                  <div className="d-flex align-items-start gap-3">
                    <Icon size={20} className={`alert-icon-${alert.type}`} />
                    <div className="flex-grow-1">
                      <p className={`fw-medium mb-1 alert-title-${alert.type}`}>{alert.title}</p>
                      <p className={`mb-0 alert-message-${alert.type}`}>{alert.message}</p>
                      <small className="text-muted">
                        {new Date(alert.createdAt).toLocaleDateString('fr-FR')}
                      </small>
                    </div>
                    {!alert.isRead && (
                      <div className="badge bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <button 
          className="btn btn-outline-success w-100 mt-3"
          onClick={fetchAlerts}
        >
          <RefreshCw size={16} className="me-2" />
          Actualiser les Alertes
        </button>
      </div>

      <style jsx>{`
        .alert-item {
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .alert-unread {
          background-color: #f8f9fa;
          border-left: 3px solid #16a34a;
        }
        
        .alert-warning {
          background-color: #fff8e1;
          border-left: 3px solid #f59e0b;
        }
        
        .alert-error {
          background-color: #fef2f2;
          border-left: 3px solid #ef4444;
        }
        
        .alert-info {
          background-color: #eff6ff;
          border-left: 3px solid #3b82f6;
        }
        
        .alert-success {
          background-color: #f0fdf4;
          border-left: 3px solid #10b981;
        }
        
        .alert-icon-warning { color: #f59e0b; }
        .alert-icon-error { color: #ef4444; }
        .alert-icon-info { color: #3b82f6; }
        .alert-icon-success { color: #10b981; }
        
        .alert-title-warning { color: #92400e; }
        .alert-title-error { color: #991b1b; }
        .alert-title-info { color: #1e40af; }
        .alert-title-success { color: #065f46; }
        
        .alert-message-warning { color: #a16207; }
        .alert-message-error { color: #b91c1c; }
        .alert-message-info { color: #2563eb; }
        .alert-message-success { color: #047857; }
        
        .alert-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  )
}
