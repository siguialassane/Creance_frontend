"use client"

import { useState, useEffect } from 'react'

interface NationaliteFormData {
  NAT_CODE?: string | number
  NAT_LIB: string
  NAT_DEF?: string
  NAT_IND?: string
}

interface NationaliteFormProps {
  nationalite?: {
    id: string | number
    code: string | number
    libelle: string
    NAT_DEF?: string
    NAT_IND?: string
    [key: string]: any
  } | null
  onSubmit: (data: NationaliteFormData) => void
  onCancel: () => void
  isEditing?: boolean
}

export default function NationaliteForm({ nationalite, onSubmit, onCancel, isEditing = false }: NationaliteFormProps) {
  const [formData, setFormData] = useState<NationaliteFormData>({
    NAT_CODE: '',
    NAT_LIB: '',
    NAT_DEF: '',
    NAT_IND: ''
  })
  const [errors, setErrors] = useState<Partial<NationaliteFormData>>({})

  useEffect(() => {
    if (nationalite) {
      setFormData({
        NAT_CODE: nationalite.code || nationalite.NAT_CODE || '',
        NAT_LIB: nationalite.libelle || nationalite.NAT_LIB || '',
        NAT_DEF: nationalite.NAT_DEF || '',
        NAT_IND: nationalite.NAT_IND || ''
      })
    } else {
      setFormData({
        NAT_CODE: '',
        NAT_LIB: '',
        NAT_DEF: '',
        NAT_IND: ''
      })
    }
    setErrors({})
  }, [nationalite])

  const validateForm = (): boolean => {
    const newErrors: Partial<NationaliteFormData> = {}

    if (!isEditing && !formData.NAT_CODE?.toString().trim()) {
      newErrors.NAT_CODE = 'Le code est requis'
    }

    if (!formData.NAT_LIB?.trim()) {
      newErrors.NAT_LIB = 'Le libellé est requis'
    } else if (formData.NAT_LIB.length > 100) {
      newErrors.NAT_LIB = 'Le libellé ne peut pas dépasser 100 caractères'
    }

    if (formData.NAT_DEF && formData.NAT_DEF.length > 10) {
      newErrors.NAT_DEF = 'Le défaut ne peut pas dépasser 10 caractères'
    }

    if (formData.NAT_IND && formData.NAT_IND.length > 3) {
      newErrors.NAT_IND = 'L\'indicateur ne peut pas dépasser 3 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const submitData: NationaliteFormData = {
        NAT_LIB: formData.NAT_LIB || ''
      }
      if (!isEditing) {
        submitData.NAT_CODE = formData.NAT_CODE
      }
      if (formData.NAT_DEF) {
        submitData.NAT_DEF = formData.NAT_DEF
      }
      if (formData.NAT_IND) {
        submitData.NAT_IND = formData.NAT_IND
      }
      onSubmit(submitData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name as keyof NationaliteFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  return (
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
        maxWidth: '600px',
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
            {isEditing ? '✏️ Modifier la Nationalité' : '➕ Ajouter une Nationalité'}
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#a0aec0',
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#4a5568'
              e.currentTarget.style.backgroundColor = '#f7fafc'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#a0aec0'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            ✕
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* NAT_CODE - Seulement en mode création */}
            {!isEditing && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#2d3748',
                  marginBottom: '0.5rem'
                }}>
                  Code <span style={{ color: '#e53e3e' }}>*</span>
                </label>
                <input
                  type="text"
                  name="NAT_CODE"
                  value={formData.NAT_CODE || ''}
                  onChange={handleChange}
                  placeholder="Ex: 01"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    border: errors.NAT_CODE ? '1px solid #e53e3e' : '1px solid #cbd5e0',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                />
                {errors.NAT_CODE && (
                  <p style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.NAT_CODE}
                  </p>
                )}
              </div>
            )}

            {/* NAT_LIB - Toujours visible, 2 colonnes en création, 1 colonne en édition */}
            <div style={{ gridColumn: !isEditing && formData.NAT_CODE ? 'auto' : isEditing ? '1 / -1' : '2' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}>
                Libellé <span style={{ color: '#e53e3e' }}>*</span>
              </label>
              <input
                type="text"
                name="NAT_LIB"
                value={formData.NAT_LIB}
                onChange={handleChange}
                placeholder="Ex: Sénégalaise"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  border: errors.NAT_LIB ? '1px solid #e53e3e' : '1px solid #cbd5e0',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
              {errors.NAT_LIB && (
                <p style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.NAT_LIB}
                </p>
              )}
            </div>

            {/* NAT_DEF - Champ optionnel */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}>
                Défaut
              </label>
              <input
                type="text"
                name="NAT_DEF"
                value={formData.NAT_DEF || ''}
                onChange={handleChange}
                placeholder="Ex: N"
                maxLength={10}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            {/* NAT_IND - Champ optionnel */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}>
                Indicateur
              </label>
              <input
                type="text"
                name="NAT_IND"
                value={formData.NAT_IND || ''}
                onChange={handleChange}
                placeholder="Ex: A"
                maxLength={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>

          {/* Boutons */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#2d3748',
                backgroundColor: '#f7fafc',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f7fafc'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#28A325',
                border: 'none',
                borderRadius: '6px',
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
              {isEditing ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
