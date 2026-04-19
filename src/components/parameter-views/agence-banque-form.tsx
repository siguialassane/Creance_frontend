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
    BQ_CODE: '',
    BQAG_CODE: '',
    BQAG_LIB: '',
    BQAG_NUM: null,
    ANC_AG: null,
    ANC_BQAG_CODE: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: banquesResponse } = useBanques()
  const banques = banquesResponse || []

  useEffect(() => {
    if (agence) {
      setFormData({
        BQ_CODE: agence.BQ_CODE || '',
        BQAG_CODE: agence.BQAG_CODE || '',
        BQAG_LIB: agence.BQAG_LIB || '',
        BQAG_NUM: agence.BQAG_NUM || null,
        ANC_AG: agence.ANC_AG || null,
        ANC_BQAG_CODE: agence.ANC_BQAG_CODE || null
      })
    } else {
      setFormData({
        BQ_CODE: '',
        BQAG_CODE: '',
        BQAG_LIB: '',
        BQAG_NUM: null,
        ANC_AG: null,
        ANC_BQAG_CODE: null
      })
    }
    setErrors({})
  }, [agence])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.BQ_CODE.trim()) {
      newErrors.BQ_CODE = 'La banque est requise'
    }

    if (!formData.BQAG_CODE.trim()) {
      newErrors.BQAG_CODE = 'Le code agence est requis'
    } else if (formData.BQAG_CODE.length > 20) {
      newErrors.BQAG_CODE = 'Le code agence ne peut pas dépasser 20 caractères'
    }

    if (!formData.BQAG_LIB.trim()) {
      newErrors.BQAG_LIB = 'Le libellé de l\'agence est requis'
    } else if (formData.BQAG_LIB.length > 100) {
      newErrors.BQAG_LIB = 'Le libellé ne peut pas dépasser 100 caractères'
    }

    if (formData.BQAG_NUM && formData.BQAG_NUM.length > 20) {
      newErrors.BQAG_NUM = 'Le numéro d\'agence ne peut pas dépasser 20 caractères'
    }

    if (formData.ANC_AG && formData.ANC_AG.length > 50) {
      newErrors.ANC_AG = 'L\'ancien code agence ne peut pas dépasser 50 caractères'
    }

    if (formData.ANC_BQAG_CODE && formData.ANC_BQAG_CODE.length > 50) {
      newErrors.ANC_BQAG_CODE = 'L\'ancien code banque-agence ne peut pas dépasser 50 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (agence) {
        const updateData: AgenceBanqueUpdateRequest = {
          AG_CODE: agence.BQAG_NUM,
          BQAG_CODE: formData.BQAG_CODE,
          BQAG_LIB: formData.BQAG_LIB,
          BQAG_NUM: formData.BQAG_NUM,
          ANC_AG: formData.ANC_AG,
          ANC_BQAG_CODE: formData.ANC_BQAG_CODE
        }
        onSubmit(updateData)
      } else {
        onSubmit(formData)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value
    }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const inputStyle = (fieldName: string) => ({
    width: '100%',
    padding: '0.75rem 1rem',
    border: errors[fieldName] ? '1px solid #ef4444' : '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: errors[fieldName] ? '#fef2f2' : 'white',
    boxSizing: 'border-box' as const
  })

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600' as const,
    color: '#374151',
    fontSize: '0.875rem'
  }

  const errorStyle = {
    margin: '0.5rem 0 0 0',
    color: '#ef4444',
    fontSize: '0.875rem'
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
        maxWidth: '750px',
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
          {/* Ligne 1 : Code banque + Code agence */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem'
          }}>
            {/* Code de la banque — 1ère position */}
            <div>
              <label style={labelStyle}>
                Code de la banque *
              </label>
              <select
                name="BQ_CODE"
                value={formData.BQ_CODE}
                onChange={handleChange}
                style={inputStyle('BQ_CODE')}
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
                    {banque.BQ_CODE} — {banque.BQ_LIB}
                  </option>
                ))}
              </select>
              {errors.BQ_CODE && <p style={errorStyle}>{errors.BQ_CODE}</p>}
            </div>

            {/* Code de l'agence — 2ème position */}
            <div>
              <label style={labelStyle}>
                Code de l'agence *
              </label>
              <input
                type="text"
                name="BQAG_CODE"
                value={formData.BQAG_CODE || ''}
                onChange={handleChange}
                placeholder="Ex: AG001"
                style={inputStyle('BQAG_CODE')}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.BQAG_CODE ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.BQAG_CODE && <p style={errorStyle}>{errors.BQAG_CODE}</p>}
            </div>
          </div>

          {/* Ligne 2 : Libellé de l'agence */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.25rem',
            marginTop: '1.25rem'
          }}>
            <div>
              <label style={labelStyle}>
                Libellé de l'agence *
              </label>
              <input
                type="text"
                name="BQAG_LIB"
                value={formData.BQAG_LIB}
                onChange={handleChange}
                placeholder="Ex: Agence Plateau"
                style={inputStyle('BQAG_LIB')}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.BQAG_LIB ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.BQAG_LIB && <p style={errorStyle}>{errors.BQAG_LIB}</p>}
            </div>
          </div>

          {/* Ligne 3 : N° agence + Ancien code agence */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem',
            marginTop: '1.25rem'
          }}>
            <div>
              <label style={labelStyle}>
                N° Agence
              </label>
              <input
                type="text"
                name="BQAG_NUM"
                value={formData.BQAG_NUM || ''}
                onChange={handleChange}
                placeholder="Ex: 12345"
                style={inputStyle('BQAG_NUM')}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.BQAG_NUM ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.BQAG_NUM && <p style={errorStyle}>{errors.BQAG_NUM}</p>}
            </div>

            <div>
              <label style={labelStyle}>
                Ancien code agence
              </label>
              <input
                type="text"
                name="ANC_AG"
                value={formData.ANC_AG || ''}
                onChange={handleChange}
                placeholder="Ex: ANC-AG-01"
                style={inputStyle('ANC_AG')}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.ANC_AG ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.ANC_AG && <p style={errorStyle}>{errors.ANC_AG}</p>}
            </div>
          </div>

          {/* Ligne 4 : Ancien code banque-agence */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.25rem',
            marginTop: '1.25rem'
          }}>
            <div>
              <label style={labelStyle}>
                Ancien code banque-agence
              </label>
              <input
                type="text"
                name="ANC_BQAG_CODE"
                value={formData.ANC_BQAG_CODE || ''}
                onChange={handleChange}
                placeholder="Ex: ANC-BQAG-001"
                style={inputStyle('ANC_BQAG_CODE')}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28A325'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.ANC_BQAG_CODE ? '#ef4444' : '#d1d5db'
                }}
              />
              {errors.ANC_BQAG_CODE && <p style={errorStyle}>{errors.ANC_BQAG_CODE}</p>}
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
