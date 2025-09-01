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
  const [itemsPerPage] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editingCategorie, setEditingCategorie] = useState<CategorieDebiteur | null>(null)
  const [currentYear, setCurrentYear] = useState(2024)

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

  // Mettre à jour l'année côté client
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: 'white', 
      fontFamily: 'Arial, sans-serif',
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
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1a202c'
        }}>
          Gestion des catégories de débiteurs
        </h1>
        <p style={{
          margin: '0.5rem 0 0 0',
          color: '#718096',
          fontSize: '0.875rem'
        }}>
          Programme de gestion des catégories de débiteurs
        </p>
      </div>

      {/* Barre verte avec titre */}
      <div style={{
        backgroundColor: '#059669',
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
                  fontSize: '0.875rem',
                  width: '250px',
                  outline: 'none'
                }}
              />
              <span style={{
                position: 'absolute',
                right: '0.75rem',
                color: '#a0aec0',
                fontSize: '0.875rem'
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
              background: '#ff8c00',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ➕ Ajouter
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
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    #
                  </th>
                  <th 
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
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
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
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
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map((categorie, index) => (
                  <tr key={categorie.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  >
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f7fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#4a5568' }}>▶</span>
                        <input type="checkbox" />
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f7fafc' }}>
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
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f7fafc' }}>
                      <div style={{ fontWeight: '600', color: '#1a202c' }}>
                        {categorie.libelle}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f7fafc' }}>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => {
                            setEditingCategorie(categorie)
                            setShowForm(true)
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3b82f6'
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteCategorie(categorie.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444'
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredCategories.length)} sur {filteredCategories.length} résultats
              </div>
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: currentPage === 1 ? '#f3f4f6' : '#059669',
                    color: currentPage === 1 ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Précédent
                </button>
                <span style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#059669',
                    color: currentPage === totalPages ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
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
