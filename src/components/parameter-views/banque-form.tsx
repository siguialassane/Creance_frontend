"use client"

import { useState, useEffect } from 'react'

interface BanqueFormData {
  code: string
  libelle: string
  responsable: string
  adresse: string
}

interface BanqueFormProps {
  banque?: {
    id: number
    code: string
    libelle: string
    responsable: string
    adresse: string
  } | null
  onSubmit: (data: BanqueFormData) => void
  onCancel: () => void
  isEditing?: boolean
}

export default function BanqueForm({ banque, onSubmit, onCancel, isEditing = false }: BanqueFormProps) {
  const [formData, setFormData] = useState<BanqueFormData>({
    code: '',
    libelle: '',
    responsable: '',
    adresse: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (banque) {
      setFormData({
        code: banque.code,
        libelle: banque.libelle,
        responsable: banque.responsable,
        adresse: banque.adresse
      })
    } else {
      setFormData({
        code: '',
        libelle: '',
        responsable: '',
        adresse: ''
      })
    }
    setErrors({})
  }, [banque])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis'
    } else if (formData.code.length > 10) {
      newErrors.code = 'Le code ne peut pas dépasser 10 caractères'
    }

    if (!formData.libelle.trim()) {
      newErrors.libelle = 'Le libellé est requis'
    } else if (formData.libelle.length > 100) {
      newErrors.libelle = 'Le libellé ne peut pas dépasser 100 caractères'
    }

    if (!formData.responsable.trim()) {
      newErrors.responsable = 'Le responsable est requis'
    } else if (formData.responsable.length > 50) {
      newErrors.responsable = 'Le responsable ne peut pas dépasser 50 caractères'
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise'
    } else if (formData.adresse.length > 200) {
      newErrors.adresse = 'L\'adresse ne peut pas dépasser 200 caractères'
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
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
            {isEditing ? '✏️ Modifier la Banque' : <><span style={{ color: 'white' }}>+</span> Ajouter une Banque</>}
          </h2>
          <button
            onClick={onCancel}
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
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Code */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Ex: B001"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.code ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.code ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.code ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.code && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.code}
                </p>
              )}
            </div>

            {/* Libellé */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Nom de la banque *
              </label>
              <input
                type="text"
                name="libelle"
                value={formData.libelle}
                onChange={handleChange}
                placeholder="Ex: Banque Atlantique"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.libelle ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.libelle ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.libelle ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.libelle && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.libelle}
                </p>
              )}
            </div>

            {/* Responsable */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Responsable *
              </label>
              <input
                type="text"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                placeholder="Ex: M. Koné"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.responsable ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.responsable ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.responsable ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.responsable && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.responsable}
                </p>
              )}
            </div>

            {/* Adresse */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Adresse *
              </label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                placeholder="Ex: Abidjan, Plateau"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.adresse ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.adresse ? '#fef2f2' : 'white',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.adresse ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.adresse && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.adresse}
                </p>
              )}
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
              onClick={onCancel}
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
              {isEditing ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
