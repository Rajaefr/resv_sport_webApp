"use client"

import { Calendar, AlertTriangle, TrendingUp, TrendingDown, Activity } from "lucide-react"

// Données simulées pour tous les groupes
const allGroupsData = [
  // Groupe A1
  { id: "A1.1", name: "A1-1", type: "piscine", bassin: "grand", occupation: 98, status: "critique" },
  { id: "A1.2", name: "A1-2", type: "piscine", bassin: "petit", occupation: 45, status: "faible" },
  { id: "A1.3", name: "A1-3", type: "piscine", bassin: "grand", occupation: 78, status: "stable" },
  { id: "A1.4", name: "A1-4", type: "piscine", bassin: "petit", occupation: 82, status: "stable" },

  // Groupe A2
  { id: "A2.1", name: "A2-1", type: "piscine", bassin: "grand", occupation: 95, status: "critique" },
  { id: "A2.2", name: "A2-2", type: "piscine", bassin: "petit", occupation: 38, status: "faible" },
  { id: "A2.3", name: "A2-3", type: "piscine", bassin: "grand", occupation: 75, status: "stable" },
  { id: "A2.4", name: "A2-4", type: "piscine", bassin: "petit", occupation: 81, status: "stable" },

  // Groupe B1
  { id: "B1.1", name: "B1-1", type: "sport", bassin: null, occupation: 89, status: "stable" },
  { id: "B1.2", name: "B1-2", type: "sport", bassin: null, occupation: 42, status: "faible" },
  { id: "B1.3", name: "B1-3", type: "sport", bassin: null, occupation: 96, status: "critique" },
  { id: "B1.4", name: "B1-4", type: "sport", bassin: null, occupation: 77, status: "stable" },

  // Groupe B2
  { id: "B2.1", name: "B2-1", type: "sport", bassin: null, occupation: 35, status: "faible" },
  { id: "B2.2", name: "B2-2", type: "sport", bassin: null, occupation: 86, status: "stable" },
  { id: "B2.3", name: "B2-3", type: "sport", bassin: null, occupation: 93, status: "critique" },
  { id: "B2.4", name: "B2-4", type: "sport", bassin: null, occupation: 99, status: "critique" },
]

// Tri et catégorisation des groupes
const groupesCritiques = allGroupsData.filter((g) => g.occupation >= 90).sort((a, b) => b.occupation - a.occupation)
const groupesStables = allGroupsData
  .filter((g) => g.occupation >= 60 && g.occupation < 90)
  .sort((a, b) => b.occupation - a.occupation)
const groupesFaibles = allGroupsData.filter((g) => g.occupation < 60).sort((a, b) => a.occupation - b.occupation)

export function StatsChart() {
  return (
    <div className="chart-card-enhanced">
      <div className="chart-header">
        <div className="header-content">
          <h3 className="chart-title">
            <Activity size={24} className="me-2 text-primary" />
            Occupation des Groupes - Vue Organisée
          </h3>
          <p className="chart-subtitle">Classification par niveau d'occupation pour une gestion optimale</p>
        </div>
        <div className="chart-controls">
          <div className="chart-legend-organized">
            <div className="legend-item">
              <div className="legend-color critique"></div>
              <span>Critiques (≥90%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color stable"></div>
              <span>Stables (60-89%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color faible"></div>
              <span>Disponibles (&lt;60%)</span>
            </div>
          </div>
          <button className="btn btn-outline-primary btn-sm">
            <Calendar size={16} className="me-1" />
            Temps réel
          </button>
        </div>
      </div>

      {/* Vue organisée en 3 colonnes */}
      <div className="chart-container-organized">
        {/* Colonne 1: Groupes Critiques */}
        <div className="occupation-column critique-column">
          <div className="column-header">
            <AlertTriangle size={18} className="column-icon" />
            <div className="column-info">
              <h4 className="column-title">Groupes Critiques</h4>
              <p className="column-subtitle">{groupesCritiques.length} groupes nécessitent une attention</p>
            </div>
          </div>

          <div className="groups-list">
            {groupesCritiques.map((group, index) => (
              <div key={group.id} className="group-bar-item critique-item">
                <div className="group-info-bar">
                  <div className="group-header-bar">
                    <span className="group-name-bar">{group.name}</span>
                    <span className="group-occupation-value critique">{group.occupation}%</span>
                  </div>
                  <div className="group-details-bar">
                    <span className="group-type-bar">
                      {group.type === "piscine" ? `🏊 ${group.bassin}` : "🏃 Sport"}
                    </span>
                  </div>
                </div>
                <div className="group-progress-bar">
                  <div className="progress-fill critique-fill" style={{ width: `${group.occupation}%` }}></div>
                </div>
                <div className="rank-badge critique-rank">#{index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne 2: Groupes Stables */}
        <div className="occupation-column stable-column">
          <div className="column-header">
            <TrendingUp size={18} className="column-icon" />
            <div className="column-info">
              <h4 className="column-title">Groupes Stables</h4>
              <p className="column-subtitle">{groupesStables.length} groupes fonctionnent bien</p>
            </div>
          </div>

          <div className="groups-list">
            {groupesStables.map((group, index) => (
              <div key={group.id} className="group-bar-item stable-item">
                <div className="group-info-bar">
                  <div className="group-header-bar">
                    <span className="group-name-bar">{group.name}</span>
                    <span className="group-occupation-value stable">{group.occupation}%</span>
                  </div>
                  <div className="group-details-bar">
                    <span className="group-type-bar">
                      {group.type === "piscine" ? `🏊 ${group.bassin}` : "🏃 Sport"}
                    </span>
                  </div>
                </div>
                <div className="group-progress-bar">
                  <div className="progress-fill stable-fill" style={{ width: `${group.occupation}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne 3: Groupes Faibles */}
        <div className="occupation-column faible-column">
          <div className="column-header">
            <TrendingDown size={18} className="column-icon" />
            <div className="column-info">
              <h4 className="column-title">Capacité Disponible</h4>
              <p className="column-subtitle">{groupesFaibles.length} groupes sous-utilisés</p>
            </div>
          </div>

          <div className="groups-list">
            {groupesFaibles.map((group, index) => (
              <div key={group.id} className="group-bar-item faible-item">
                <div className="group-info-bar">
                  <div className="group-header-bar">
                    <span className="group-name-bar">{group.name}</span>
                    <span className="group-occupation-value faible">{group.occupation}%</span>
                  </div>
                  <div className="group-details-bar">
                    <span className="group-type-bar">
                      {group.type === "piscine" ? `🏊 ${group.bassin}` : "🏃 Sport"}
                    </span>
                    <span className="capacity-available">{100 - group.occupation}% libre</span>
                  </div>
                </div>
                <div className="group-progress-bar">
                  <div className="progress-fill faible-fill" style={{ width: `${group.occupation}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Résumé statistique */}
      <div className="chart-footer-organized">
        <div className="stats-summary">
          <div className="summary-item critique-summary">
            <div className="summary-icon">
              <AlertTriangle size={16} />
            </div>
            <div className="summary-content">
              <span className="summary-value">{groupesCritiques.length}</span>
              <span className="summary-label">Critiques</span>
            </div>
          </div>

          <div className="summary-item stable-summary">
            <div className="summary-icon">
              <TrendingUp size={16} />
            </div>
            <div className="summary-content">
              <span className="summary-value">{groupesStables.length}</span>
              <span className="summary-label">Stables</span>
            </div>
          </div>

          <div className="summary-item faible-summary">
            <div className="summary-icon">
              <TrendingDown size={16} />
            </div>
            <div className="summary-content">
              <span className="summary-value">{groupesFaibles.length}</span>
              <span className="summary-label">Disponibles</span>
            </div>
          </div>

          <div className="summary-item total-summary">
            <div className="summary-content">
              <span className="summary-value">
                {Math.round(allGroupsData.reduce((acc, g) => acc + g.occupation, 0) / allGroupsData.length)}%
              </span>
              <span className="summary-label">Moyenne générale</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
