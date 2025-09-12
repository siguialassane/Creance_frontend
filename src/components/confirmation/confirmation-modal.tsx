"use client"

import { useState, useEffect } from 'react'

export interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'danger',
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isOpen && isClient) {
      document.body.style.overflow = 'hidden'
    } else if (isClient) {
      document.body.style.overflow = 'unset'
    }

    return () => {
      if (isClient) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, isClient])

  if (!isClient || !isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          iconColor: '#ef4444',
          confirmButtonColor: '#ef4444',
          confirmButtonHoverColor: '#dc2626'
        }
      case 'warning':
        return {
          icon: '⚠️',
          iconColor: '#f59e0b',
          confirmButtonColor: '#f59e0b',
          confirmButtonHoverColor: '#d97706'
        }
      case 'info':
        return {
          icon: 'ℹ️',
          iconColor: '#3b82f6',
          confirmButtonColor: '#3b82f6',
          confirmButtonHoverColor: '#2563eb'
        }
      default:
        return {
          icon: '⚠️',
          iconColor: '#ef4444',
          confirmButtonColor: '#ef4444',
          confirmButtonHoverColor: '#dc2626'
        }
    }
  }

  const typeStyles = getTypeStyles()

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icône et titre */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            fontSize: '2rem'
          }}>
            {typeStyles.icon}
          </div>
          <h3 style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {title}
          </h3>
        </div>

        {/* Message */}
        <p style={{
          margin: '0 0 2rem 0',
          fontSize: '1rem',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        {/* Boutons d'action */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: typeStyles.confirmButtonColor,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = typeStyles.confirmButtonHoverColor
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = typeStyles.confirmButtonColor
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
