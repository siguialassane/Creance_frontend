"use client"

import { useState, useMemo, useEffect } from 'react'
import NationaliteForm from './nationalite-form'
import { NotificationManager } from '../notification/notification'
import { ConfirmationModal } from '../confirmation/confirmation-modal'

interface Nationalite {
  id: string | number
  code: string | number
  libelle: string
  NAT_DEF?: string
  NAT_IND?: string
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface NationaliteViewProps {
  data?: Nationalite[]
  isLoading?: boolean
  onAdd?: (data: any) => Promise<void> | void
  onEdit?: (code: string | number, data: any) => Promise<void> | void
  onDelete?: (code: string | number) => Promise<void> | void
}

export default function NationaliteView({ 
  data: initialData = [],
  isLoading = false,
  onAdd,
  onEdit,
  onDelete
}: NationaliteViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Nationalite>('code')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [itemsPerPage] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editingNationalite, setEditingNationalite] = useState<Nationalite | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [currentYear, setCurrentYear] = useState(2024)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  // Mise à jour de l'année
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  // Filtrage et tri des données
  const filteredNationalites = useMemo(() => {
    let filtered = initialData || []

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(nat => 
        String(nat.code).toLowerCase().includes(searchLower) ||
        nat.libelle.toLowerCase().includes(searchLower) ||
        (nat.NAT_DEF && nat.NAT_DEF.toLowerCase().includes(searchLower)) ||
        (nat.NAT_IND && nat.NAT_IND.toLowerCase().includes(searchLower))
      )
    }

    // Tri
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1
      
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      }
      
      return sortDirection === 'asc'
        ? (aValue as any) - (bValue as any)
        : (bValue as any) - (aValue as any)
    })

    return filtered
  }, [initialData, searchTerm, sortField, sortDirection])

  // Pagination
  const paginatedNationalites = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredNationalites.slice(startIndex, endIndex)
  }, [filteredNationalites, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredNationalites.length / itemsPerPage)

  // Gestion des notifications
  const addNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration = 5000) => {
    const id = `notif_${Math.random().toString(36).substr(2, 9)}_${notifications.length}`
    setNotifications(prev => [...prev, { id, type, title, message, duration }])
    
    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm()
        closeConfirmation()
      }
    })
  }

  const closeConfirmation = () => {
    setConfirmationModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => {}
    })
  }

  const handleAdd = () => {
    setEditingNationalite(null)
    setShowForm(true)
  }

  const handleEdit = (nationalite: Nationalite) => {
    setEditingNationalite(nationalite)
    setShowForm(true)
    setShowActionMenu(null)
  }

  const handleDelete = (nationalite: Nationalite) => {
    setShowActionMenu(null)
    showConfirmation(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer la nationalité "${nationalite.libelle}" (${nationalite.code}) ? Cette action est irréversible.`,
      async () => {
        setIsSubmitting(true)
        try {
          if (onDelete) {
            await onDelete(nationalite.code)
          }
          addNotification('success', 'Suppression réussie', `La nationalité "${nationalite.libelle}" a été supprimée avec succès.`)
        } catch (error: any) {
          console.error('Erreur lors de la suppression:', error)
          addNotification('error', 'Erreur de suppression', error?.message || 'Une erreur est survenue lors de la suppression.')
        } finally {
          setIsSubmitting(false)
        }
      }
    )
  }

  const toggleActionMenu = (id: string | number) => {
    setShowActionMenu(showActionMenu === String(id) ? null : String(id))
  }

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true)
    try {
      if (editingNationalite) {
        // Mode édition
        if (onEdit) {
          await onEdit(editingNationalite.code, formData)
        }
        addNotification('success', 'Mise à jour réussie', `La nationalité "${formData.NAT_LIB}" a été mise à jour avec succès.`)
      } else {
        // Mode création
        if (onAdd) {
          await onAdd(formData)
        }
        addNotification('success', 'Création réussie', `La nationalité "${formData.NAT_LIB}" a été créée avec succès.`)
      }
      setShowForm(false)
      setEditingNationalite(null)
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error)
      addNotification('error', 'Erreur', error?.message || 'Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fermer le menu d'action au clic ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionMenu && !(event.target as Element).closest('.action-menu')) {
        setShowActionMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showActionMenu])

  if (isLoading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #28A325',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Chargement des nationalités...
        </p>
      </div>
    )
  }

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: 'white', 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* En-tête */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#fff'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: 'bold', color: '#1a202c' }}>
              Nationalités
            </h1>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Gestion des nationalités - {filteredNationalites.length} résultats
            </p>
          </div>
          <button
            onClick={handleAdd}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28A325',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e7d1a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#28A325'
            }}
          >
            ➕ Ajouter une Nationalité
          </button>
        </div>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher par code ou libellé..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            border: '1px solid #cbd5e0',
            borderRadius: '6px',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Contenu principal */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1.5rem'
      }}>
        {filteredNationalites.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Aucune nationalité trouvée</p>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              {searchTerm ? 'Essayez une autre recherche' : 'Commencez par ajouter une nationalité'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {paginatedNationalites.map((nationalite) => (
              <div
                key={nationalite.id}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f4f8'
                  e.currentTarget.style.borderColor = '#94a3b8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.borderColor = '#cbd5e0'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#1a202c' }}>
                    {nationalite.libelle}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                    Code: <strong>{nationalite.code}</strong>
                  </p>
                </div>

                {/* Champs optionnels */}
                {(nationalite.NAT_DEF || nationalite.NAT_IND) && (
                  <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
                    {nationalite.NAT_DEF && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <span style={{ fontWeight: '500' }}>Défaut:</span> {nationalite.NAT_DEF}
                      </p>
                    )}
                    {nationalite.NAT_IND && (
                      <p style={{ margin: '0.25rem 0' }}>
                        <span style={{ fontWeight: '500' }}>Indicateur:</span> {nationalite.NAT_IND}
                      </p>
                    )}
                  </div>
                )}

                {/* Menu d'actions */}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <div className="action-menu" style={{ position: 'relative' }}>
                    <button
                      onClick={() => toggleActionMenu(String(nationalite.id))}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.25rem',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: '0.25rem',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#1a202c'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280'
                      }}
                    >
                      ⋮
                    </button>

                    {showActionMenu === String(nationalite.id) && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 10,
                        minWidth: '120px',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => handleEdit(nationalite)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: '#2d3748',
                            borderBottom: '1px solid #e2e8f0',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f7fafc'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(nationalite)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: '#e53e3e',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fef2f2'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #cbd5e0',
              borderRadius: '4px',
              backgroundColor: currentPage === 1 ? '#f7fafc' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            ← Précédent
          </button>
          <div style={{ padding: '0.5rem 1rem' }}>
            Page {currentPage} sur {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #cbd5e0',
              borderRadius: '4px',
              backgroundColor: currentPage === totalPages ? '#f7fafc' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Suivant →
          </button>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <NationaliteForm
          nationalite={editingNationalite}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingNationalite(null)
          }}
          isEditing={!!editingNationalite}
        />
      )}

      {/* Gestionnaire de notifications */}
      <NotificationManager
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={closeConfirmation}
      />
    </div>
  )
}
