"use client"

import { useState, useMemo } from 'react'
import { useBanques, useDeleteBanque, useCreateBanque, useUpdateBanque } from '@/hooks/useBanques'
import { Banque, BanqueCreateRequest, BanqueUpdateRequest } from '@/types/banque'
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
  Mail
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ConfirmationModal } from '../confirmation/confirmation-modal'
import BanqueForm from './banque-form'


export default function ModernBanqueView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Banque>('BQ_LIB')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [itemsPerPage] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editingBanque, setEditingBanque] = useState<Banque | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)

  // React Query hooks
  const { data: banquesResponse, isLoading, error, refetch } = useBanques()
  const deleteBanqueMutation = useDeleteBanque()
  const createBanqueMutation = useCreateBanque()
  const updateBanqueMutation = useUpdateBanque()

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

  // Données des banques
  const banques = banquesResponse?.data || []

  // Filtrage et tri des données
  const filteredAndSortedBanques = useMemo(() => {
    let filtered = banques.filter(banque =>
      banque.BQ_LIB?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banque.BQ_CODE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banque.BQ_RESPONS?.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [banques, searchTerm, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBanques.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBanques = filteredAndSortedBanques.slice(startIndex, startIndex + itemsPerPage)

  // Gestion des actions
  const handleSort = (field: keyof Banque) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleEdit = (banque: Banque) => {
    setEditingBanque(banque)
    setShowForm(true)
  }

  const handleDelete = (banque: Banque) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Supprimer la banque',
      message: `Êtes-vous sûr de vouloir supprimer la banque "${banque.BQ_LIB}" ?`,
      onConfirm: () => {
        deleteBanqueMutation.mutate(banque.BQ_CODE, {
          onSuccess: () => {
            setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })
          }
        })
      }
    })
  }

  const handleFormSubmit = (formData: BanqueCreateRequest | BanqueUpdateRequest) => {
    if (editingBanque) {
      // Mise à jour
      updateBanqueMutation.mutate({
        code: editingBanque.BQ_CODE,
        banque: formData as BanqueUpdateRequest
      }, {
        onSuccess: () => {
          setShowForm(false)
          setEditingBanque(null)
        }
      })
    } else {
      // Création
      createBanqueMutation.mutate(formData as BanqueCreateRequest, {
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
          <p className="mt-4 text-gray-600">Chargement des banques...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Erreur lors du chargement des banques</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Banques</h2>
          <p className="text-gray-600">Gérez les informations des banques partenaires</p>
        </div>
        <Button 
          onClick={() => {
            setEditingBanque(null)
            setShowForm(true)
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une banque
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une banque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-600 border-emerald-600">
            {filteredAndSortedBanques.length} banque(s)
          </Badge>
        </div>
      </div>

      {/* Banques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBanques.map((banque) => (
          <Card key={banque.BQ_CODE} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{banque.BQ_LIB}</CardTitle>
                    <p className="text-sm text-gray-500">{banque.BQ_CODE}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(banque)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(banque)}
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
              {banque.BQ_RESPONS && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{banque.BQ_RESPONS}</span>
                </div>
              )}
              {banque.BQ_ADRESS && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{banque.BQ_ADRESS}</span>
                </div>
              )}
              {banque.BQ_CONTACT && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{banque.BQ_CONTACT}</span>
                </div>
              )}
              {banque.BQ_SIGLE && (
                <Badge variant="secondary" className="w-fit">
                  {banque.BQ_SIGLE}
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
            Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredAndSortedBanques.length)} sur {filteredAndSortedBanques.length} banques
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
        <BanqueForm
          banque={editingBanque}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false)
            setEditingBanque(null)
          }}
          isLoading={createBanqueMutation.isPending || updateBanqueMutation.isPending}
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