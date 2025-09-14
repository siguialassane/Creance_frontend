"use client"

import { useState, useEffect } from 'react'

export interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

export function Notification({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto-close après la durée spécifiée
    const autoCloseTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(autoCloseTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10b981',
          borderColor: '#059669',
          icon: '✓'
        }
      case 'error':
        return {
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          icon: '✕'
        }
      case 'warning':
        return {
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          icon: '⚠'
        }
      case 'info':
        return {
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          icon: 'ℹ'
        }
      default:
        return {
          backgroundColor: '#6b7280',
          borderColor: '#4b5563',
          icon: 'ℹ'
        }
    }
  }

  const typeStyles = getTypeStyles()

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'white',
        border: `2px solid ${typeStyles.borderColor}`,
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '1rem 1.5rem',
        minWidth: '320px',
        maxWidth: '400px',
        zIndex: 9999,
        transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible && !isLeaving ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        {/* Icône */}
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: typeStyles.backgroundColor,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          flexShrink: 0,
          marginTop: '2px'
        }}>
          {typeStyles.icon}
        </div>

        {/* Contenu */}
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: '0 0 0.25rem 0',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1f2937',
            lineHeight: '1.25'
          }}>
            {title}
          </h4>
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: '1.4'
          }}>
            {message}
          </p>
        </div>

        {/* Bouton de fermeture */}
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '1.25rem',
            padding: '0',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#6b7280'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#9ca3af'
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export interface NotificationManagerProps {
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    duration?: number
  }>
  onRemoveNotification: (id: string) => void
}

export function NotificationManager({ notifications, onRemoveNotification }: NotificationManagerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onRemoveNotification}
        />
      ))}
    </>
  )
}
