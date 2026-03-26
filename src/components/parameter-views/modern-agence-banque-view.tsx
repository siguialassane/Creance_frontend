"use client"

import { useState, useMemo } from 'react'
import { useAgencesBanque, useDeleteAgenceBanque, useCreateAgenceBanque, useUpdateAgenceBanque } from '@/hooks/useAgencesBanque'
import { AgenceBanque, AgenceBanqueCreateRequest, AgenceBanqueUpdateRequest } from '@/types/agence-banque'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  Banknote
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ConfirmationModal } from '../confirmation/confirmation-modal'
import AgenceBanqueForm from './agence-banque-form'

export default function ModernAgenceBanqueView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof AgenceBanque>('AG_LIB')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [itemsPerPage] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editingAgence, setEditingAgence] = useState<AgenceBanque | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)

  // React Query hooks
  const { data: agencesResponse, isLoading, error, refetch } = useAgencesBanque()
  const deleteAgenceMutation = useDeleteAgenceBanque()
  const createAgenceMutation = useCreateAgenceBanque()
  const updateAgenceMutation = useUpdateAgenceBanque()

  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  // Données des agences
  const agences = agencesResponse?.data || []

  // Filtrage et tri des données
  const filteredAndSortedAgences = useMemo(() => {
    let filtered = agences.filter(agence =>
      agence.AG_LIB?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agence.AG_CODE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agence.AG_RESPONS?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agence.BQ_CODE?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      const aValue = a[sortField] || ''
      const bValue = b[sortField] || ''
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [agences, searchTerm, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAgences.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAgences = filteredAndSortedAgences.slice(startIndex, startIndex + itemsPerPage)

  // Gestion des actions
  const handleSort = (field: keyof AgenceBanque) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleEdit = (agence: AgenceBanque) => {
    setEditingAgence(agence)
    setShowForm(true)
  }

  const handleDelete = (agence: AgenceBanque) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Supprimer l\'agence',
      message: `Êtes-vous sûr de vouloir supprimer l'agence "${agence.AG_LIB}" ?`,
      onConfirm: () => {
        deleteAgenceMutation.mutate(agence.AG_CODE, {
          onSuccess: () => {
            setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })
          }
        })
      }
    })
  }

  const handleFormSubmit = (formData: AgenceBanqueCreateRequest | AgenceBanqueUpdateRequest) => {
    if (editingAgence) {
      // Mise à jour
      updateAgenceMutation.mutate({
        code: editingAgence.AG_CODE,
        agence: formData as AgenceBanqueUpdateRequest
      }, {
        onSuccess: () => {
          setShowForm(false)
          setEditingAgence(null)
        }
      })
    } else {
      // Création
      createAgenceMutation.mutate(formData as AgenceBanqueCreateRequest, {
        onSuccess: () => {
          setShowForm(false)
        }
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des agences bancaires...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Erreur lors du chargement des agences bancaires</p>
          <Button onClick={() => refetch()} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Agences Bancaires</h2>
          <p className="text-gray-600">Gérez les informations des agences bancaires</p>
        </div>
        <Button 
          onClick={() => {
            setEditingAgence(null)
            setShowForm(true)
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une agence
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une agence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-600 border-emerald-600">
            {filteredAndSortedAgences.length} agence(s)
          </Badge>
        </div>
      </div>

      {/* Agences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedAgences.map((agence) => (
          <Card key={agence.AG_CODE} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Banknote className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agence.AG_LIB}</CardTitle>
                    <p className="text-sm text-gray-500">{agence.AG_CODE}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {agence.BQ_CODE}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(agence)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(agence)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {agence.AG_RESPONS && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{agence.AG_RESPONS}</span>
                </div>
              )}
              {agence.AG_ADRESS && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{agence.AG_ADRESS}</span>
                </div>
              )}
              {agence.AG_CONTACT && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{agence.AG_CONTACT}</span>
                </div>
              )}
              {agence.AG_SIGLE && (
                <Badge variant="secondary" className="w-fit">
                  {agence.AG_SIGLE}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredAndSortedAgences.length)} sur {filteredAndSortedAgences.length} agences
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <AgenceBanqueForm
          agence={editingAgence}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false)
            setEditingAgence(null)
          }}
          isLoading={createAgenceMutation.isPending || updateAgenceMutation.isPending}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
      />

    </div>
  )
}
