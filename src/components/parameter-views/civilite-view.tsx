"use client"

import { useState, useMemo, useEffect } from 'react'
import CiviliteForm from './civilite-form'
import { NotificationManager } from '../notification/notification'
import { ConfirmationModal } from '../confirmation/confirmation-modal'

interface Civilite {
  id: number
  code: string
  libelle: string
}

// Données de test pour les civilités (selon l'ancienne app)
const civilitesData: Civilite[] = [
  { id: 1, code: "M", libelle: "Monsieur" },
  { id: 2, code: "MME", libelle: "Madame" },
  { id: 3, code: "MLLE", libelle: "Mademoiselle" },
  { id: 4, code: "DR", libelle: "Docteur" },
  { id: 5, code: "PROF", libelle: "Professeur" },
  { id: 6, code: "MAITRE", libelle: "Maître" },
  { id: 7, code: "COL", libelle: "Colonel" },
  { id: 8, code: "CAP", libelle: "Capitaine" },
  { id: 9, code: "LT", libelle: "Lieutenant" },
  { id: 10, code: "SGT", libelle: "Sergent" },
  { id: 11, code: "ADJ", libelle: "Adjudant" },
  { id: 12, code: "DIR", libelle: "Directeur" },
  { id: 13, code: "PDG", libelle: "Président Directeur Général" },
  { id: 14, code: "MIN", libelle: "Ministre" },
  { id: 15, code: "AMB", libelle: "Ambassadeur" }
]

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export default function CiviliteView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Civilite>('code')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [itemsPerPage] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editingCivilite, setEditingCivilite] = useState<Civilite | null>(null)
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

  // Filtrage et tri des données
  const filteredCivilites = useMemo(() => {
    let filtered = civilitesData

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(civilite => 
        civilite.code.toLowerCase().includes(searchLower) ||
        civilite.libelle.toLowerCase().includes(searchLower)
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
  }, [searchTerm, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredCivilites.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCivilites = filteredCivilites.slice(startIndex, endIndex)

  // Gestion du tri
  const handleSort = (field: keyof Civilite) => {
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

  const handleAddCivilite = (civilite: any) => {
    try {
      console.log('Ajouter civilité:', civilite)
      setShowForm(false)
      addNotification('success', 'Civilité créée', `La civilité "${civilite.libelle}" a été créée avec succès.`)
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      addNotification('error', 'Erreur de création', 'Une erreur est survenue lors de la création de la civilité.')
    }
  }

  const handleEditCivilite = (civilite: any) => {
    try {
      console.log('Modifier civilité:', civilite)
      setShowForm(false)
      setEditingCivilite(null)
      setShowActionMenu(null)
      addNotification('success', 'Civilité modifiée', `La civilité "${civilite.libelle}" a été modifiée avec succès.`)
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
      addNotification('error', 'Erreur de modification', 'Une erreur est survenue lors de la modification de la civilité.')
    }
  }

  const handleDeleteCivilite = (id: number) => {
    const civilite = civilitesData.find(c => c.id === id)
    if (civilite) {
      showConfirmation(
        'Confirmer la suppression',
        `Êtes-vous sûr de vouloir supprimer la civilité "${civilite.libelle}" ? Cette action est irréversible.`,
        () => {
          try {
            console.log('Supprimer civilité:', id)
            setShowActionMenu(null)
            closeConfirmation()
            addNotification('success', 'Civilité supprimée', `La civilité "${civilite.libelle}" a été supprimée avec succès.`)
          } catch (error) {
            console.error('Erreur lors de la suppression:', error)
            addNotification('error', 'Erreur de suppression', 'Une erreur est survenue lors de la suppression de la civilité.')
          }
        }
      )
    } else {
      addNotification('error', 'Erreur', 'Civilité introuvable.')
    }
  }

  const toggleActionMenu = (id: string) => {
    setShowActionMenu(showActionMenu === id ? null : id)
  }

  // Mettre à jour l'année côté client
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const openAddForm = () => {
    setEditingCivilite(null)
    setShowForm(true)
  }

  const openEditForm = (civilite: Civilite) => {
    setEditingCivilite(civilite)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCivilite(null)
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
          Gestion des civilités
        </h1>
        <p style={{
          margin: '0.5rem 0 0 0',
          color: '#718096',
          fontSize: '1rem',
          fontWeight: '400'
        }}>
          Programme de gestion des civilités
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
        ✓ CIVILITÉS
      </div>

      {/* Section Liste des civilités */}
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
          <span>LISTE DES CIVILITÉS</span>
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
              color: '#4a5568'
            }}>
              🔄
            </button>
          </div>
          <button
            onClick={openAddForm}
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
            <span style={{ color: 'white' }}>+</span> Ajouter
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
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Code
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  Libellé
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
              {currentCivilites.map((civilite, index) => {
                const isLastRow = index === currentCivilites.length - 1;
                return (
                <tr key={civilite.id} style={{
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
                      {civilite.code}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    {civilite.libelle}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', position: 'relative' }} className="action-menu">
                    <button
                      onClick={() => toggleActionMenu(civilite.id.toString())}
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
                    {showActionMenu === civilite.id.toString() && (
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
                            setEditingCivilite(civilite)
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
                          onClick={() => handleDeleteCivilite(civilite.id)}
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
                Affichage de 1 à {Math.min(5, currentCivilites.length)} sur {currentCivilites.length} résultats
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

      {/* Formulaire Modal */}
      {showForm && (
        <CiviliteForm
          civilite={editingCivilite}
          onSubmit={editingCivilite ? handleEditCivilite : handleAddCivilite}
          onCancel={() => {
            closeForm()
            addNotification('info', 'Action annulée', editingCivilite ? 'Modification annulée.' : 'Création annulée.')
          }}
          isEditing={!!editingCivilite}
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