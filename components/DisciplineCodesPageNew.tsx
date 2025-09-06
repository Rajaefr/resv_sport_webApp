"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  FileText,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Save,
  Loader2,
} from "lucide-react"
import { apiService } from "../lib/apiService"

interface Discipline {
  code: string
  nom: string
  participantsCount?: number
  paidCount?: number
  isActive: boolean
  price: number
  description?: string
  type?: string
}

const getStatusBadge = (isActive: boolean) => {
  const config = isActive
    ? {
        icon: CheckCircle,
        label: "Actif",
        className: "status-success",
      }
    : {
        icon: XCircle,
        label: "Inactif",
        className: "status-danger",
      }

  const Icon = config.icon
  return (
    <span className={`status-badge ${config.className}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  )
}

const DisciplineCodesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [showModal, setShowModal] = useState(false)
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null)
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    nom: "",
    price: 0,
    isActive: true,
    description: "",
    type: "sport"
  })

  // Charger les codes de discipline au montage
  useEffect(() => {
    loadDisciplineCodes()
  }, [])

  const loadDisciplineCodes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getDisciplineCodes()
      
      if (response.success) {
        setDisciplines(response.data.disciplineCodes || [])
      } else {
        setError("Erreur lors du chargement des codes de discipline")
      }
    } catch (err: any) {
      console.error("Erreur:", err)
      setError(err.message || "Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDiscipline = async () => {
    try {
      if (!formData.code || !formData.nom || !formData.price) {
        setError("Veuillez remplir tous les champs obligatoires")
        return
      }

      const response = await apiService.createDisciplineCode(formData)
      if (response.success) {
        await loadDisciplineCodes()
        setShowModal(false)
        setFormData({
          code: "",
          nom: "",
          price: 0,
          isActive: true,
          description: "",
          type: "sport"
        })
        setError(null)
      } else {
        setError("Erreur lors de la création")
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création")
    }
  }

  const handleUpdateDiscipline = async () => {
    try {
      if (!editingDiscipline) return

      const response = await apiService.updateDisciplineCode(editingDiscipline.code, formData)
      if (response.success) {
        await loadDisciplineCodes()
        setShowModal(false)
        setEditingDiscipline(null)
        setError(null)
      } else {
        setError("Erreur lors de la mise à jour")
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour")
    }
  }

  const openEditModal = (discipline: Discipline) => {
    setEditingDiscipline(discipline)
    setFormData({
      code: discipline.code,
      nom: discipline.nom,
      price: discipline.price,
      isActive: discipline.isActive,
      description: discipline.description || "",
      type: discipline.type || "sport"
    })
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditingDiscipline(null)
    setFormData({
      code: "",
      nom: "",
      price: 0,
      isActive: true,
      description: "",
      type: "sport"
    })
    setShowModal(true)
  }

  const filteredDisciplines = disciplines.filter((discipline) => {
    const matchesSearch = discipline.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discipline.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && discipline.isActive) ||
                         (filterStatus === "inactive" && !discipline.isActive)
    return matchesSearch && matchesFilter
  })

  // Statistiques calculées
  const totalDisciplines = disciplines.length
  const activeDisciplines = disciplines.filter(d => d.isActive).length
  const totalParticipants = disciplines.reduce((sum, d) => sum + (d.participantsCount || 0), 0)
  const totalRevenue = disciplines.reduce((sum, d) => sum + ((d.participantsCount || 0) * d.price), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <p>Chargement des codes de discipline...</p>
        </div>
      </div>
    )
  }

  if (error && disciplines.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDisciplineCodes} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={28} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Codes de Discipline</h1>
              <p className="text-gray-600">
                Gestion des disciplines sportives • {filteredDisciplines.length} disciplines
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={18} />
              <span>Exporter</span>
            </button>
            <button 
              onClick={openCreateModal}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              <span>Nouvelle Discipline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Disciplines</p>
              <p className="text-2xl font-bold text-gray-900">{totalDisciplines}</p>
            </div>
            <FileText size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actives</p>
              <p className="text-2xl font-bold text-green-600">{activeDisciplines}</p>
            </div>
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-purple-600">{totalParticipants}</p>
            </div>
            <Users size={24} className="text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-green-600">{totalRevenue} DH</p>
            </div>
            <DollarSign size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par code ou nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code & Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDisciplines.map((discipline) => (
                <tr key={discipline.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{discipline.code}</div>
                      <div className="text-sm text-gray-500">{discipline.nom}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{discipline.price} DH</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(discipline.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{discipline.participantsCount || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openEditModal(discipline)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDisciplines.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aucune discipline trouvée</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {editingDiscipline ? "Modifier la discipline" : "Nouvelle discipline"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  disabled={!!editingDiscipline}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Ex: C001-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Adultes Musculation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (DH) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Description de la discipline..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Discipline active
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={editingDiscipline ? handleUpdateDiscipline : handleCreateDiscipline}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingDiscipline ? "Modifier" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DisciplineCodesPage
