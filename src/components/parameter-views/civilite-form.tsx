"use client"

import { useState, useEffect } from 'react'

interface CiviliteFormData {
  code: string
  libelle: string
}

interface CiviliteFormProps {
  civilite?: {
    id: number
    code: string
    libelle: string
  } | null
  onSubmit: (data: CiviliteFormData) => void
  onCancel: () => void
  isEditing?: boolean
}

export default function CiviliteForm({ civilite, onSubmit, onCancel, isEditing = false }: CiviliteFormProps) {
  const [formData, setFormData] = useState<CiviliteFormData>({
    code: '',
    libelle: ''
  })
  const [errors, setErrors] = useState<Partial<CiviliteFormData>>({})

  useEffect(() => {
    if (civilite) {
      setFormData({
        code: civilite.code,
        libelle: civilite.libelle
      })
    } else {
      setFormData({
        code: '',
        libelle: ''
      })
    }
    setErrors({})
  }, [civilite])

  const validateForm = (): boolean => {
    const newErrors: Partial<CiviliteFormData> = {}

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis'
    } else if (formData.code.length > 10) {
      newErrors.code = 'Le code ne peut pas dépasser 10 caractères'
    }

    if (!formData.libelle.trim()) {
      newErrors.libelle = 'Le libellé est requis'
    } else if (formData.libelle.length > 50) {
      newErrors.libelle = 'Le libellé ne peut pas dépasser 50 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Effacer l'erreur pour ce champ
    if (errors[name as keyof CiviliteFormData]) {
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
            {isEditing ? '✏️ Modifier la Civilité' : <><span style={{ color: 'white' }}>+</span> Ajouter une Civilité</>}
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
          {/* Code */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Code *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Ex: M, MME, DR..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.code ? '#e53e3e' : '#e2e8f0'}`,
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontFamily: 'Monaco, monospace',
                backgroundColor: errors.code ? '#fed7d7' : 'white',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3182ce'
                e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.code ? '#e53e3e' : '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
            {errors.code && (
              <p style={{
                color: '#e53e3e',
                fontSize: '0.75rem',
                margin: '0.25rem 0 0 0'
              }}>
                {errors.code}
              </p>
            )}
          </div>

          {/* Libellé */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Libellé *
            </label>
            <input
              type="text"
              name="libelle"
              value={formData.libelle}
              onChange={handleChange}
              placeholder="Ex: Monsieur, Madame, Docteur..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.libelle ? '#e53e3e' : '#e2e8f0'}`,
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: errors.libelle ? '#fed7d7' : 'white',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3182ce'
                e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.libelle ? '#e53e3e' : '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
            {errors.libelle && (
              <p style={{
                color: '#e53e3e',
                fontSize: '0.75rem',
                margin: '0.25rem 0 0 0'
              }}>
                {errors.libelle}
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4a5568',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7fafc'
                e.currentTarget.style.borderColor = '#cbd5e0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'white',
                backgroundColor: '#F97316',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F97316'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F97316'
              }}
            >
              {isEditing ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}