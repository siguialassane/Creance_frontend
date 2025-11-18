"use client"

import { useState, useMemo, useEffect } from 'react'
import BanqueForm from './banque-form'
import { NotificationManager } from '../notification/notification'
import { ConfirmationModal } from '../confirmation/confirmation-modal'
import { useBanques, useDeleteBanque, useCreateBanque, useUpdateBanque } from '@/hooks/useBanques'
import { Banque } from '@/types/banque'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export default function BanqueView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Banque>('BQ_LIB')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [itemsPerPage] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editingBanque, setEditingBanque] = useState<Banque | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [currentYear, setCurrentYear] = useState(2024)
  const [notifications, setNotifications] = useState<Notification[]>([])
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

  // React Query hooks
  const { data: banquesData, isLoading, error, refetch } = useBanques()
  const deleteBanqueMutation = useDeleteBanque()
  const createBanqueMutation = useCreateBanque()
  const updateBanqueMutation = useUpdateBanque()

  // Filtrage et tri des données
  const filteredBanques = useMemo(() => {
    if (!banquesData || !Array.isArray(banquesData)) return []
    
    let filtered = [...banquesData] // Créer une copie du tableau

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(banque => 
        banque.BQ_CODE.toLowerCase().includes(searchLower) ||
        banque.BQ_LIB.toLowerCase().includes(searchLower) ||
        (banque.BQ_RESPONS && banque.BQ_RESPONS.toLowerCase().includes(searchLower)) ||
        (banque.BQ_ADRESS && banque.BQ_ADRESS.toLowerCase().includes(searchLower))
      )
    }

    // Tri
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      return 0
    })

    return filtered
  }, [banquesData, searchTerm, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredBanques.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBanques = filteredBanques.slice(startIndex, endIndex)

  // Gestion du tri
  const handleSort = (field: keyof Banque) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Gestion de la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // Fonction pour ajouter une notification
  const addNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration = 5000) => {
    const id = `notif_${Math.random().toString(36).substr(2, 9)}_${notifications.length}`
    setNotifications(prev => [...prev, { id, type, title, message, duration }])
  }

  // Fonction pour supprimer une notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  // Fonction pour afficher une confirmation
  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm
    })
  }

  // Fonction pour fermer la confirmation
  const closeConfirmation = () => {
    setConfirmationModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => {}
    })
  }

  const handleAddBanque = (banque: any) => {
    createBanqueMutation.mutate(banque, {
      onSuccess: () => {
        setShowForm(false)
        addNotification('success', 'Banque créée', `La banque "${banque.BQ_LIB}" a été créée avec succès.`)
      },
      onError: (error: any) => {
        addNotification('error', 'Erreur de création', error.message || 'Une erreur est survenue lors de la création de la banque.')
      }
    })
  }

  const handleEditBanque = (banque: any) => {
    if (editingBanque) {
      updateBanqueMutation.mutate({
        code: editingBanque.BQ_CODE,
        banque: banque
      }, {
        onSuccess: () => {
          setShowForm(false)
          setEditingBanque(null)
          setShowActionMenu(null)
          addNotification('success', 'Banque modifiée', `La banque "${banque.BQ_LIB}" a été modifiée avec succès.`)
        },
        onError: (error: any) => {
          addNotification('error', 'Erreur de modification', error.message || 'Une erreur est survenue lors de la modification de la banque.')
        }
      })
    }
  }

  const handleDeleteBanque = (banque: Banque) => {
    showConfirmation(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer la banque "${banque.BQ_LIB}" ? Cette action est irréversible.`,
      () => {
        deleteBanqueMutation.mutate(banque.BQ_CODE, {
          onSuccess: () => {
            setShowActionMenu(null)
            closeConfirmation()
            addNotification('success', 'Banque supprimée', `La banque "${banque.BQ_LIB}" a été supprimée avec succès.`)
          },
          onError: (error: any) => {
            addNotification('error', 'Erreur de suppression', error.message || 'Une erreur est survenue lors de la suppression de la banque.')
          }
        })
      }
    )
  }

  const toggleActionMenu = (id: string) => {
    setShowActionMenu(showActionMenu === id ? null : id)
  }

  // Mettre à jour l'année côté client
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  // États de chargement et d'erreur
  if (isLoading) {
    return (
      <div style={{ 
        height: '100vh', 
        backgroundColor: 'white', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #28A325',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Chargement des banques...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        height: '100vh', 
        backgroundColor: 'white', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{ color: '#dc2626', fontSize: '1.5rem', marginBottom: '1rem' }}>❌</div>
        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>Erreur lors du chargement des banques</p>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{error.message}</p>
        <button
          onClick={() => refetch()}
          style={{
            background: '#28A325',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Réessayer
        </button>
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
      {/* En-tête principal */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#1a202c',
          letterSpacing: '-0.025em'
        }}>
          Gestion des banques
        </h1>
        <p style={{
          margin: '0.5rem 0 0 0',
          color: '#718096',
          fontSize: '1rem',
          fontWeight: '400'
        }}>
          Programme de gestion des banques
        </p>
      </div>

      {/* Barre verte avec titre */}
      <div style={{
        backgroundColor: '#28A325',
        color: 'white',
        padding: '0.5rem 2rem',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        ✓ BANQUES
      </div>

      {/* Section Liste des banques */}
      <div style={{
        padding: '1rem 2rem',
        backgroundColor: '#f7fafc',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#2d3748',
          fontWeight: '600',
          fontSize: '0.875rem'
        }}>
          <span>▼</span>
          <span>LISTE DES BANQUES</span>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{
        padding: '1.5rem 2rem',
        flex: 1,
        overflowY: 'auto'
      }}>
        {/* Barre de recherche et actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Rechercher"
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  padding: '0.5rem 2.5rem 0.5rem 1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  width: '250px',
                  outline: 'none'
                }}
              />
              <span style={{
                position: 'absolute',
                right: '0.75rem',
                color: '#a0aec0',
                fontSize: '0.9rem'
              }}>
                Q
              </span>
            </div>
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: '#6b7280'
            }}>
              🔄
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: '#F97316',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Ajouter
          </button>
        </div>

        {/* Tableau */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    #
                  </th>
                  <th 
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('BQ_CODE')}
                  >
                    Code de la banque
                    {sortField === 'BQ_CODE' && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('BQ_LIB')}
                  >
                    Nom de la banque
                    {sortField === 'BQ_LIB' && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('BQ_RESPONS')}
                  >
                    Responsable
                    {sortField === 'BQ_RESPONS' && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSort('BQ_ADRESS')}
                  >
                    Adresse
                    {sortField === 'BQ_ADRESS' && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBanques.map((banque, index) => {
                  const isLastRow = index === currentBanques.length - 1;
                  return (
                  <tr key={banque.BQ_CODE} style={{
                    borderBottom: '1px solid #e2e8f0',
                    background: index % 2 === 0 ? 'white' : '#fafafa'
                  }}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#6b7280' }}>▶</span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <span style={{
                        fontFamily: 'Monaco, monospace',
                        fontWeight: '600',
                        color: '#1e293b',
                        background: '#f1f5f9',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        {banque.BQ_CODE}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: '600', color: '#1a202c' }}>
                        {banque.BQ_LIB}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#6b7280' }}>
                        {banque.BQ_RESPONS || 'Non renseigné'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#6b7280' }}>
                        {banque.BQ_ADRESS || 'Non renseigné'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', position: 'relative' }} className="action-menu">
                      <button
                        onClick={() => toggleActionMenu(banque.BQ_CODE)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#F97316',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          transition: 'background-color 0.2s',
                          minWidth: '40px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F97316'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F97316'
                        }}
                      >
                        ⋯
                      </button>
                      
                      {/* Menu d'actions */}
                      {showActionMenu === banque.BQ_CODE && (
                        <div style={{
                          position: 'absolute',
                          top: isLastRow ? 'auto' : '100%',
                          bottom: isLastRow ? '100%' : 'auto',
                          right: '0',
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                          zIndex: 1000,
                          minWidth: '120px'
                        }}>
                          <button
                            onClick={() => {
                              setEditingBanque(banque)
                              setShowForm(true)
                            }}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              backgroundColor: 'white',
                              color: '#374151',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              borderBottom: '1px solid #f3f4f6',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f9fafb'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'white'
                            }}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteBanque(banque)}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              backgroundColor: 'white',
                              color: '#dc2626',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fef2f2'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'white'
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
              padding: '1.5rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
          }}>
              <div style={{
                  color: '#6b7280',
                  fontSize: '0.9rem'
              }}>
                  Affichage de 1 à {Math.min(5, currentBanques.length)} sur {currentBanques.length} résultats
              </div>
              <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
              }}>
                  <button
                      style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#f3f4f6',
                          color: '#9ca3af',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'not-allowed',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                      }}
                      disabled
                  >
                      &lt;&lt;&lt;
                  </button>
                  <button
                      style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#f3f4f6',
                          color: '#9ca3af',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'not-allowed',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                      }}
                      disabled
                  >
                      &lt;
                  </button>
                  <span style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#28A325',
                      color: 'white',
                      borderRadius: '0.375rem',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                  }}>
                      1
                  </span>
                  <span style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '0.375rem',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                  }}>
                      2
                  </span>
                  <button
                      style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#28A325',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                      }}
                  >
                      &gt;
                  </button>
                  <button
                      style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#28A325',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                      }}
                  >
                      &gt;&gt;&gt;
                  </button>
                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginLeft: '1rem'
                  }}>
                      <select
                          style={{
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.9rem',
                              backgroundColor: 'white'
                          }}
                      >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                      </select>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>▼</span>
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '1rem 2rem',
        textAlign: 'center',
        color: '#718096',
        fontSize: '0.875rem',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: 'white',
        flexShrink: 0
      }}>
        {currentYear} © tout droit reservé
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <BanqueForm
          banque={editingBanque}
          onSubmit={editingBanque ? handleEditBanque : handleAddBanque}
          onCancel={() => {
            setShowForm(false)
            setEditingBanque(null)
            addNotification('info', 'Action annulée', editingBanque ? 'Modification annulée.' : 'Création annulée.')
          }}
          isEditing={!!editingBanque}
        />
      )}

      {/* Gestionnaire de notifications */}
      <NotificationManager
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        onConfirm={confirmationModal.onConfirm}
        onCancel={closeConfirmation}
      />
    </div>
  )
}
