"use client"

import { useState, useEffect } from 'react'
import { AgenceBanque, AgenceBanqueCreateRequest, AgenceBanqueUpdateRequest } from '@/types/agence-banque'
import { Banque } from '@/types/banque'
import { useBanques } from '@/hooks/useBanques'

interface AgenceBanqueFormProps {
  agence?: AgenceBanque | null
  onSubmit: (data: AgenceBanqueCreateRequest | AgenceBanqueUpdateRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function AgenceBanqueForm({ agence, onSubmit, onCancel, isLoading = false }: AgenceBanqueFormProps) {
  const [formData, setFormData] = useState<AgenceBanqueCreateRequest>({
    AG_LIB: '',
    BQ_CODE: '',
    AG_RESPONS: '',
    AG_ADRESS: '',
    AG_CONTACT: '',
    AG_LIBLONG: '',
    AG_SIGLE: '',
    AG_AUTLIB: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Récupérer la liste des banques pour le select
  const { data: banquesResponse } = useBanques()
  const banques = banquesResponse || []

  useEffect(() => {
    if (agence) {
      setFormData({
        // Mapping depuis AgenceBanque (lecture)
        AG_LIB: agence.BQAG_LIB || '',
        BQ_CODE: agence.BQ_CODE || '',
        AG_RESPONS: '',
        AG_ADRESS: '',
        AG_CONTACT: '',
        AG_LIBLONG: '',
        AG_SIGLE: '',
        AG_AUTLIB: ''
      })
    } else {
      setFormData({
        AG_LIB: '',
        BQ_CODE: '',
        AG_RESPONS: '',
        AG_ADRESS: '',
        AG_CONTACT: '',
        AG_LIBLONG: '',
        AG_SIGLE: '',
        AG_AUTLIB: ''
      })
    }
    setErrors({})
  }, [agence])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.AG_LIB.trim()) {
      newErrors.AG_LIB = 'Le libellé est requis'
    } else if (formData.AG_LIB.length > 100) {
      newErrors.AG_LIB = 'Le libellé ne peut pas dépasser 100 caractères'
    }

    if (!formData.BQ_CODE.trim()) {
      newErrors.BQ_CODE = 'La banque est requise'
    }

    if (formData.AG_RESPONS && formData.AG_RESPONS.length > 50) {
      newErrors.AG_RESPONS = 'Le responsable ne peut pas dépasser 50 caractères'
    }

    if (formData.AG_ADRESS && formData.AG_ADRESS.length > 200) {
      newErrors.AG_ADRESS = 'L\'adresse ne peut pas dépasser 200 caractères'
    }

    if (formData.AG_CONTACT && formData.AG_CONTACT.length > 50) {
      newErrors.AG_CONTACT = 'Le contact ne peut pas dépasser 50 caractères'
    }

    if (formData.AG_LIBLONG && formData.AG_LIBLONG.length > 200) {
      newErrors.AG_LIBLONG = 'Le libellé long ne peut pas dépasser 200 caractères'
    }

    if (formData.AG_SIGLE && formData.AG_SIGLE.length > 20) {
      newErrors.AG_SIGLE = 'Le sigle ne peut pas dépasser 20 caractères'
    }

    if (formData.AG_AUTLIB && formData.AG_AUTLIB.length > 100) {
      newErrors.AG_AUTLIB = 'Le libellé alternatif ne peut pas dépasser 100 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (agence) {
        // Mise à jour
        const updateData: AgenceBanqueUpdateRequest = {
          // Utiliser l'identifiant existant côté lecture
          AG_CODE: agence.BQAG_NUM,
          ...formData
        }
        onSubmit(updateData)
      } else {
        // Création
        onSubmit(formData)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            {agence ? '✏️ Modifier l\'Agence' : '➕ Ajouter une Agence'}
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
                Nom de l'agence *
              </label>
              <input
                type="text"
                name="AG_LIB"
                value={formData.AG_LIB}
                onChange={handleChange}
                placeholder="Ex: Agence Plateau"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.AG_LIB ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.AG_LIB ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.AG_LIB ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.AG_LIB && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.AG_LIB}
                </p>
              )}
            </div>

            {/* Banque */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Banque *
              </label>
              <select
                name="BQ_CODE"
                value={formData.BQ_CODE}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.BQ_CODE ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.BQ_CODE ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.BQ_CODE ? '#ef4444' : '#d1d5db'
                }}
              >
                <option value="">Sélectionner une banque</option>
                {banques.map((banque: Banque) => (
                  <option key={banque.BQ_CODE} value={banque.BQ_CODE}>
                    {banque.BQ_LIB}
                  </option>
                ))}
              </select>
              {errors.BQ_CODE && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.BQ_CODE}
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
                name="AG_RESPONS"
                value={formData.AG_RESPONS}
                onChange={handleChange}
                placeholder="Ex: M. Koné"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.AG_RESPONS ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.AG_RESPONS ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.AG_RESPONS ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.AG_RESPONS && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.AG_RESPONS}
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
                name="AG_ADRESS"
                value={formData.AG_ADRESS}
                onChange={handleChange}
                placeholder="Ex: Abidjan, Plateau"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.AG_ADRESS ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.AG_ADRESS ? '#fef2f2' : 'white',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.AG_ADRESS ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.AG_ADRESS && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.AG_ADRESS}
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
                name="AG_CONTACT"
                value={formData.AG_CONTACT}
                onChange={handleChange}
                placeholder="Ex: +225 20 30 40 50"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.AG_CONTACT ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.AG_CONTACT ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.AG_CONTACT ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.AG_CONTACT && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.AG_CONTACT}
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
                name="AG_SIGLE"
                value={formData.AG_SIGLE}
                onChange={handleChange}
                placeholder="Ex: AP"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.AG_SIGLE ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: errors.AG_SIGLE ? '#fef2f2' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.AG_SIGLE ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.AG_SIGLE && (
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  {errors.AG_SIGLE}
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
              {isLoading ? 'En cours...' : (agence ? 'Modifier' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
