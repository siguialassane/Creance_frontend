"use client"

import { useState, useMemo, useEffect } from 'react'
import BanqueForm from './banque-form'

interface Banque {
  id: number
  code: string
  libelle: string
  responsable: string
  adresse: string
}

// Données de test pour les banques
const banquesData: Banque[] = [
  { id: 1, code: "B001", libelle: "Banque Atlantique", responsable: "M. Koné", adresse: "Abidjan, Plateau" },
  { id: 2, code: "B002", libelle: "Société Générale", responsable: "Mme Traoré", adresse: "Abidjan, Cocody" },
  { id: 3, code: "B003", libelle: "BNI", responsable: "M. Ouattara", adresse: "Abidjan, Marcory" },
  { id: 4, code: "B004", libelle: "SIB", responsable: "Mme Diallo", adresse: "Abidjan, Treichville" },
  { id: 5, code: "B005", libelle: "Ecobank", responsable: "M. Coulibaly", adresse: "Abidjan, Deux Plateaux" },
  { id: 6, code: "B006", libelle: "NSIA", responsable: "Mme Bamba", adresse: "Abidjan, Angré" },
  { id: 7, code: "B007", libelle: "BACI", responsable: "M. Yao", adresse: "Abidjan, Riviera" },
  { id: 8, code: "B008", libelle: "SGBCI", responsable: "Mme Kouassi", adresse: "Abidjan, Yopougon" },
  { id: 9, code: "B009", libelle: "BICICI", responsable: "M. N'Guessan", adresse: "Abidjan, Adjame" },
  { id: 10, code: "B010", libelle: "Citi Bank", responsable: "Mme Konan", adresse: "Abidjan, Plateau" }
]

export default function BanqueView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Banque>('libelle')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [itemsPerPage] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editingBanque, setEditingBanque] = useState<Banque | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [currentYear, setCurrentYear] = useState(2024)

  // Filtrage et tri des données
  const filteredBanques = useMemo(() => {
    let filtered = banquesData

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(banque => 
        banque.code.toLowerCase().includes(searchLower) ||
        banque.libelle.toLowerCase().includes(searchLower) ||
        banque.responsable.toLowerCase().includes(searchLower) ||
        banque.adresse.toLowerCase().includes(searchLower)
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

  const handleAddBanque = (banque: any) => {
    console.log('Ajouter banque:', banque)
    setShowForm(false)
  }

  const handleEditBanque = (banque: any) => {
    console.log('Modifier banque:', banque)
    setShowForm(false)
    setEditingBanque(null)
    setShowActionMenu(null)
  }

  const handleDeleteBanque = (id: number) => {
    console.log('Supprimer banque:', id)
    setShowActionMenu(null)
  }

  const toggleActionMenu = (id: string) => {
    setShowActionMenu(showActionMenu === id ? null : id)
  }

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
                    Code de la banque
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
                    Nom de la banque
                    {sortField === 'libelle' && (
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
                    onClick={() => handleSort('responsable')}
                  >
                    Responsable
                    {sortField === 'responsable' && (
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
                    onClick={() => handleSort('adresse')}
                  >
                    Adresse
                    {sortField === 'adresse' && (
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
                  <tr key={banque.id} style={{
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
                        {banque.code}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: '600', color: '#1a202c' }}>
                        {banque.libelle}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#6b7280' }}>
                        {banque.responsable}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#6b7280' }}>
                        {banque.adresse}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', position: 'relative' }} className="action-menu">
                      <button
                        onClick={() => toggleActionMenu(banque.id.toString())}
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
                      {showActionMenu === banque.id.toString() && (
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
                            onClick={() => handleDeleteBanque(banque.id)}
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
          }}
          isEditing={!!editingBanque}
        />
      )}
    </div>
  )
}
