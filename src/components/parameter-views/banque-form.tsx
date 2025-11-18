"use client"

import { useState, useEffect } from 'react'
import { Banque, BanqueCreateRequest, BanqueUpdateRequest } from '@/types/banque'

interface BanqueFormProps {
  banque?: Banque | null
  onSubmit: (data: BanqueCreateRequest | BanqueUpdateRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function BanqueForm({ banque, onSubmit, onCancel, isLoading = false }: BanqueFormProps) {
  const [formData, setFormData] = useState<BanqueCreateRequest>({
    BQ_LIB: '',
    BQ_RESPONS: '',
    BQ_ADRESS: '',
    BQ_CONTACT: '',
    BQ_LIBLONG: '',
    BQ_SIGLE: '',
    BQ_AUTLIB: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (banque) {
      setFormData({
        BQ_LIB: banque.BQ_LIB || '',
        BQ_RESPONS: banque.BQ_RESPONS || '',
        BQ_ADRESS: banque.BQ_ADRESS || '',
        BQ_CONTACT: banque.BQ_CONTACT || '',
        BQ_LIBLONG: banque.BQ_LIBLONG || '',
        BQ_SIGLE: banque.BQ_SIGLE || '',
        BQ_AUTLIB: banque.BQ_AUTLIB || ''
      })
    } else {
      setFormData({
        BQ_LIB: '',
        BQ_RESPONS: '',
        BQ_ADRESS: '',
        BQ_CONTACT: '',
        BQ_LIBLONG: '',
        BQ_SIGLE: '',
        BQ_AUTLIB: ''
      })
    }
    setErrors({})
  }, [banque])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.BQ_LIB.trim()) {
      newErrors.BQ_LIB = 'Le libellé est requis'
    } else if (formData.BQ_LIB.length > 100) {
      newErrors.BQ_LIB = 'Le libellé ne peut pas dépasser 100 caractères'
    }

    if (formData.BQ_RESPONS && formData.BQ_RESPONS.length > 50) {
      newErrors.BQ_RESPONS = 'Le responsable ne peut pas dépasser 50 caractères'
    }

    if (formData.BQ_ADRESS && formData.BQ_ADRESS.length > 200) {
      newErrors.BQ_ADRESS = 'L\'adresse ne peut pas dépasser 200 caractères'
    }

    if (formData.BQ_CONTACT && formData.BQ_CONTACT.length > 50) {
      newErrors.BQ_CONTACT = 'Le contact ne peut pas dépasser 50 caractères'
    }

    if (formData.BQ_LIBLONG && formData.BQ_LIBLONG.length > 200) {
      newErrors.BQ_LIBLONG = 'Le libellé long ne peut pas dépasser 200 caractères'
    }

    if (formData.BQ_SIGLE && formData.BQ_SIGLE.length > 20) {
      newErrors.BQ_SIGLE = 'Le sigle ne peut pas dépasser 20 caractères'
    }

    if (formData.BQ_AUTLIB && formData.BQ_AUTLIB.length > 100) {
      newErrors.BQ_AUTLIB = 'Le libellé alternatif ne peut pas dépasser 100 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (banque) {
        // Mise à jour
        const updateData: BanqueUpdateRequest = {
          BQ_CODE: banque.BQ_CODE,
          ...formData
        }
        onSubmit(updateData)
      } else {
        // Création
        onSubmit(formData)
      }
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
            {banque ? '✏️ Modifier la Banque' : '➕ Ajouter une Banque'}
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
                name="BQ_LIB"
                value={formData.BQ_LIB}
                onChange={handleChange}
                placeholder="Ex: Banque Atlantique"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.BQ_LIB ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.BQ_LIB ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.BQ_LIB ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.BQ_LIB && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.BQ_LIB}
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
                Responsable
              </label>
              <input
                type="text"
                name="BQ_RESPONS"
                value={formData.BQ_RESPONS}
                onChange={handleChange}
                placeholder="Ex: M. Koné"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.BQ_RESPONS ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.BQ_RESPONS ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.BQ_RESPONS ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.BQ_RESPONS && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.BQ_RESPONS}
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
                Adresse
              </label>
              <textarea
                name="BQ_ADRESS"
                value={formData.BQ_ADRESS}
                onChange={handleChange}
                placeholder="Ex: Abidjan, Plateau"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.BQ_ADRESS ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.BQ_ADRESS ? '#fef2f2' : 'white',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.BQ_ADRESS ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.BQ_ADRESS && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.BQ_ADRESS}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Contact
              </label>
              <input
                type="text"
                name="BQ_CONTACT"
                value={formData.BQ_CONTACT}
                onChange={handleChange}
                placeholder="Ex: +225 20 30 40 50"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.BQ_CONTACT ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.BQ_CONTACT ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.BQ_CONTACT ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.BQ_CONTACT && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.BQ_CONTACT}
                </p>
              )}
            </div>

            {/* Sigle */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Sigle
              </label>
              <input
                type="text"
                name="BQ_SIGLE"
                value={formData.BQ_SIGLE}
                onChange={handleChange}
                placeholder="Ex: BA"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.BQ_SIGLE ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.BQ_SIGLE ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.BQ_SIGLE ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.BQ_SIGLE && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.BQ_SIGLE}
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
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: isLoading ? '#9ca3af' : '#28A325',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#047857'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#28A325'
                }
              }}
            >
              {isLoading ? 'En cours...' : (banque ? 'Modifier' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
