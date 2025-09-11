"use client"

import { useState, useMemo, useEffect } from 'react'
import CategorieDebiteurForm from './categorie-debiteur-form'

interface CategorieDebiteur {
  id: number
  code: string
  libelle: string
}

// Données de test pour les catégories de débiteurs
const categoriesData: CategorieDebiteur[] = [
  { id: 1, code: "CAT001", libelle: "Particuliers" },
  { id: 2, code: "CAT002", libelle: "Professions Libérales" },
  { id: 3, code: "CAT003", libelle: "Commerçants" },
  { id: 4, code: "CAT004", libelle: "moyen" },
  { id: 5, code: "CAT005", libelle: "Agriculteurs" },
  { id: 6, code: "CAT006", libelle: "PME" },
  { id: 7, code: "CAT007", libelle: "Grandes Entreprises" },
  { id: 8, code: "CAT008", libelle: "Sociétés Civiles" },
  { id: 9, code: "CAT009", libelle: "Associations" },
  { id: 10, code: "CAT010", libelle: "Coopératives" },
  { id: 11, code: "CAT011", libelle: "Fonctionnaires" },
  { id: 12, code: "CAT012", libelle: "Salariés Privés" },
  { id: 13, code: "CAT013", libelle: "Retraités" },
  { id: 14, code: "CAT014", libelle: "Étudiants" },
  { id: 15, code: "CAT015", libelle: "Chômeurs" }
]

export default function CategorieDebiteurView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof CategorieDebiteur>('libelle')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editingCategorie, setEditingCategorie] = useState<CategorieDebiteur | null>(null)
  const [currentYear, setCurrentYear] = useState(2024)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)

  // Filtrage et tri des données
  const filteredCategories = useMemo(() => {
    let filtered = categoriesData

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(categorie => 
        categorie.code.toLowerCase().includes(searchLower) ||
        categorie.libelle.toLowerCase().includes(searchLower)
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
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCategories = filteredCategories.slice(startIndex, endIndex)

  // Gestion du tri
  const handleSort = (field: keyof CategorieDebiteur) => {
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

  const handleAddCategorie = (categorie: any) => {
    console.log('Ajouter catégorie:', categorie)
    setShowForm(false)
  }

  const handleEditCategorie = (categorie: any) => {
    console.log('Modifier catégorie:', categorie)
    setShowForm(false)
    setEditingCategorie(null)
  }

  const handleDeleteCategorie = (id: number) => {
    console.log('Supprimer catégorie:', id)
  }

  // Gestion du menu d'actions
  const toggleActionMenu = (id: string) => {
    setShowActionMenu(showActionMenu === id ? null : id)
  }

  // Fermer le menu d'actions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.action-menu')) {
        setShowActionMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Mettre à jour l'année côté client
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

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
          Gestion des catégories de débiteurs
        </h1>
        <p style={{
          margin: '0.5rem 0 0 0',
          color: '#718096',
          fontSize: '1rem',
          fontWeight: '400'
        }}>
          Programme de gestion des catégories de débiteurs
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
        ✓ CATÉGORIES DE DÉBITEURS
      </div>

      {/* Section Liste des catégories */}
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
          <span>LISTE DES CATÉGORIES</span>
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
            <span style={{ color: 'white' }}>+</span> Ajouter
          </button>
        </div>

        {/* Tableau */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
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
                    onClick={() => handleSort('code')}
                  >
                    Code
                    {sortField === 'code' && (
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
                    onClick={() => handleSort('libelle')}
                  >
                    Libellé
                    {sortField === 'libelle' && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map((categorie, index) => {
                  const isLastRow = index === currentCategories.length - 1
                  return (
                  <tr key={categorie.id} style={{
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
                        {categorie.code}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: '600', color: '#1a202c' }}>
                        {categorie.libelle}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', position: 'relative' }} className="action-menu">
                      <button
                        onClick={() => toggleActionMenu(categorie.id.toString())}
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
                      {showActionMenu === categorie.id.toString() && (
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
                              setEditingCategorie(categorie)
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
                            onClick={() => handleDeleteCategorie(categorie.id)}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              backgroundColor: 'white',
                              color: '#ef4444',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f9fafb'
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
                  )
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
                  Affichage de {startIndex + 1} à {Math.min(endIndex, filteredCategories.length)} sur {filteredCategories.length} résultats
              </div>
              <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
              }}>
                  <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: currentPage === 1 ? '#f3f4f6' : '#28A325',
                          color: currentPage === 1 ? '#9ca3af' : 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                      }}
                  >
                      &lt;&lt;&lt;
                  </button>
                  <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: currentPage === 1 ? '#f3f4f6' : '#28A325',
                          color: currentPage === 1 ? '#9ca3af' : 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                      }}
                  >
                      &lt;
                  </button>
                  
                  {/* Numéros de page */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      const isActive = pageNum === currentPage
                      return (
                          <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              style={{
                                  padding: '0.5rem 0.75rem',
                                  backgroundColor: isActive ? '#28A325' : '#f3f4f6',
                                  color: isActive ? 'white' : '#374151',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  cursor: 'pointer',
                                  fontSize: '0.9rem',
                                  fontWeight: '500',
                                  transition: 'all 0.2s'
                              }}
                          >
                              {pageNum}
                          </button>
                      )
                  })}
                  
                  <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#28A325',
                          color: currentPage === totalPages ? '#9ca3af' : 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                      }}
                  >
                      &gt;
                  </button>
                  <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#28A325',
                          color: currentPage === totalPages ? '#9ca3af' : 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
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
                          value={itemsPerPage}
                          onChange={(e) => {
                              setItemsPerPage(Number(e.target.value))
                              setCurrentPage(1)
                          }}
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
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <CategorieDebiteurForm
          categorie={editingCategorie}
          onSubmit={editingCategorie ? handleEditCategorie : handleAddCategorie}
          onCancel={() => {
            setShowForm(false)
            setEditingCategorie(null)
          }}
          isEditing={!!editingCategorie}
        />
      )}
    </div>
  )
}
