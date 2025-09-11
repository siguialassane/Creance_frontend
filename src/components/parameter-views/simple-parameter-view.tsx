"use client"

import { useState, useEffect, useMemo } from 'react'

interface SimpleParameterViewProps {
    title: string
    description?: string
    data?: Array<{ id: string; code: string; libelle: string; [key: string]: any }>
    actionOptions?: Array<{
        label: string
        icon?: string
        action: (item: any) => void
        color?: string
    }>
}

export default function SimpleParameterView({ title, description, data: initialData = [], actionOptions }: SimpleParameterViewProps) {
    const [data, setData] = useState(initialData)
    const [searchTerm, setSearchTerm] = useState('')
    const [editingItem, setEditingItem] = useState<any>(null)
    const [formData, setFormData] = useState({ code: '', libelle: '' })
    const [showForm, setShowForm] = useState(false)
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
    const [currentYear, setCurrentYear] = useState(2024)

    // Données de démonstration si aucune donnée n'est fournie
    useEffect(() => {
        if (initialData.length === 0 && data.length === 0) {
            const demoData = [
                { id: 'demo_1', code: '001', libelle: 'Exemple 1' },
                { id: 'demo_2', code: '002', libelle: 'Exemple 2' },
                { id: 'demo_3', code: '003', libelle: 'Exemple 3' },
            ]
            setData(demoData)
        }
        // Mettre à jour l'année côté client
        setCurrentYear(new Date().getFullYear())
    }, []) // Pas de dépendances pour éviter la boucle infinie

    // Filtrage des données avec useMemo
    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.libelle.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm, data])

    const handleAdd = () => {
        setEditingItem(null)
        setFormData({ code: '', libelle: '' })
        setShowForm(true)
    }

    const handleEdit = (item: any) => {
        setEditingItem(item)
        setFormData({ code: item.code, libelle: item.libelle })
        setShowForm(true)
        setShowActionMenu(null)
    }

    const handleDelete = (id: string) => {
        setData(data.filter(item => item.id !== id))
        // Notification silencieuse - on pourrait ajouter un toast ici
        console.log('Élément supprimé avec succès')
        setShowActionMenu(null)
    }

    const toggleActionMenu = (id: string) => {
        setShowActionMenu(showActionMenu === id ? null : id)
    }

    // Fermer le menu quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showActionMenu && !(event.target as Element).closest('.action-menu')) {
                setShowActionMenu(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showActionMenu])

    const handleSave = () => {
        if (!formData.code.trim() || !formData.libelle.trim()) {
            // Validation silencieuse - on pourrait ajouter un toast ici
            console.log('Le code et le libellé sont obligatoires')
            return
        }

        if (editingItem) {
            // Modification
            setData(data.map(item =>
                item.id === editingItem.id
                    ? { ...item, ...formData }
                    : item
            ))
            // Notification silencieuse - on pourrait ajouter un toast ici
            console.log('Élément modifié avec succès')
        } else {
            // Vérifier si le code existe déjà
            if (data.some(item => item.code === formData.code)) {
                // Validation silencieuse - on pourrait ajouter un toast ici
                console.log('Ce code existe déjà')
                return
            }

            // Ajout
            const newItem = {
                id: `new_${data.length + 1}`,
                ...formData
            }
            setData([...data, newItem])
            // Notification silencieuse - on pourrait ajouter un toast ici
            console.log('Élément ajouté avec succès')
        }
        setShowForm(false)
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
                    {title}
                </h1>
                {description && (
                    <p style={{
                        margin: '0.5rem 0 0 0',
                        color: '#718096',
                        fontSize: '1rem',
                        fontWeight: '400'
                    }}>
                        {description}
                    </p>
                )}
            </div>

            {/* Barre verte avec titre */}
            <div style={{
                backgroundColor: '#28A325',
                color: 'white',
                padding: '0.5rem 2rem',
                fontSize: '1rem',
                fontWeight: '600'
            }}>
                ✓ {title.toUpperCase()}
            </div>

            {/* Section Liste */}
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
                    fontSize: '0.9rem'
                }}>
                    <span>▼</span>
                    <span>LISTE DES {title.toUpperCase()}</span>
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
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                        onClick={handleAdd}
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
                                {filteredData.map((item, index) => {
                                    const isLastRow = index === filteredData.length - 1;
                                    return (
                                    <tr key={item.id} style={{
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
                                                {item.code}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                                            <div style={{ fontWeight: '600', color: '#1a202c' }}>
                                                {item.libelle}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', position: 'relative' }} className="action-menu">
                                            <button
                                                onClick={() => toggleActionMenu(item.id)}
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
                                            {showActionMenu === item.id && (
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
                                                    {actionOptions ? (
                                                        actionOptions.map((option, optionIndex) => (
                                                            <button
                                                                key={optionIndex}
                                                                onClick={() => {
                                                                    option.action(item)
                                                                    setShowActionMenu(null)
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.75rem 1rem',
                                                                    backgroundColor: 'white',
                                                                    color: option.color || '#374151',
                                                                    border: 'none',
                                                                    textAlign: 'left',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.9rem',
                                                                    borderBottom: optionIndex < actionOptions.length - 1 ? '1px solid #f3f4f6' : 'none',
                                                                    transition: 'background-color 0.2s'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = option.color === '#dc2626' ? '#fef2f2' : '#f9fafb'
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = 'white'
                                                                }}
                                                            >
                                                                {option.icon && <span style={{ marginRight: '0.5rem' }}>{option.icon}</span>}
                                                                {option.label}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleEdit(item)}
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
                                                                onClick={() => handleDelete(item.id)}
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
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                                })}
                            </tbody>
                        </table>
                    </div>
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
                        Affichage de 1 à {Math.min(5, filteredData.length)} sur {filteredData.length} résultats
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

            {/* Footer */}
            <div style={{
                padding: '1rem 2rem',
                textAlign: 'center',
                color: '#718096',
                fontSize: '0.9rem',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: 'white',
                flexShrink: 0
            }}>
                {currentYear} © tout droit reservé
            </div>

            {/* Formulaire modal */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        width: '90%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        {/* En-tête du formulaire */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#1a202c'
                            }}>
                                {editingItem ? '✏️ Modifier' : <><span style={{ color: 'white' }}>+</span> Ajouter</>}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    padding: '0.25rem',
                                    borderRadius: '0.25rem',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Corps du formulaire */}
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Code */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '0.9rem'
                                    }}>
                                        Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="Ex: 001"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#28A325'
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#d1d5db'
                                        }}
                                    />
                                </div>

                                {/* Libellé */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '0.9rem'
                                    }}>
                                        Libellé *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.libelle}
                                        onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                                        placeholder="Ex: Exemple"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#28A325'
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#d1d5db'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end',
                                marginTop: '2rem',
                                paddingTop: '1.5rem',
                                borderTop: '1px solid #e2e8f0'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: 'white',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f9fafb'
                                        e.currentTarget.style.borderColor = '#9ca3af'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white'
                                        e.currentTarget.style.borderColor = '#d1d5db'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSave}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#28A325',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#047857'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#28A325'
                                    }}
                                >
                                    {editingItem ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
