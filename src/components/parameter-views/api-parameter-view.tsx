"use client"

import { ReactNode } from 'react'
import { useTransformedBanques, useTransformedCivilites } from '@/hooks/useTransformedData'
import ParameterView from './parameter-view'

interface ApiParameterViewProps {
  title: string
  description?: string
  paramType: 'banque' | 'civilite' | 'categorie-debiteur' | 'agence' | 'classe' | 'fonction'
  columns?: Array<{
    key: string
    label: string
    sortable?: boolean
    render?: (value: any, item: any) => ReactNode
  }>
  fallbackData?: any[]
  // Pour les futurs hooks API
  customHook?: () => {
    data: any[]
    isLoading: boolean
    error: any
    isEmpty: boolean
    isReady: boolean
  }
}

// Configuration des colonnes par type de paramètre
const COLUMN_CONFIGS = {
  banque: [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'libelle', label: 'Nom de la banque', sortable: true },
    { key: 'responsable', label: 'Responsable', sortable: true },
    { key: 'adresse', label: 'Adresse', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
  ],
  civilite: [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
  ],
  'categorie-debiteur': [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
  ],
  agence: [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
  ],
  classe: [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
  ],
  fonction: [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
  ],
}

export default function ApiParameterView({ 
  title, 
  description, 
  paramType, 
  columns, 
  fallbackData = [],
  customHook
}: ApiParameterViewProps) {
  // Utiliser le hook approprié selon le type de paramètre
  const banquesData = useTransformedBanques()
  const civilitesData = useTransformedCivilites()
  
  // Si un hook personnalisé est fourni, l'utiliser
  const customData = customHook ? customHook() : null
  
  // Sélectionner les données et l'état selon le type
  const getDataAndState = () => {
    // Priorité au hook personnalisé
    if (customData) {
      return customData
    }
    
    switch (paramType) {
      case 'banque':
        return {
          data: banquesData.data,
          isLoading: banquesData.isLoading,
          error: banquesData.error,
          isEmpty: banquesData.isEmpty,
          isReady: banquesData.isReady
        }
      case 'civilite':
        return {
          data: civilitesData.data,
          isLoading: civilitesData.isLoading,
          error: civilitesData.error,
          isEmpty: civilitesData.isEmpty,
          isReady: civilitesData.isReady
        }
      // Pour les autres types, utiliser les données de fallback pour l'instant
      default:
        return {
          data: fallbackData,
          isLoading: false,
          error: null,
          isEmpty: fallbackData.length === 0,
          isReady: true
        }
    }
  }

  const { data, isLoading, error, isEmpty, isReady } = getDataAndState()
  
  // Colonnes par défaut ou personnalisées
  const defaultColumns = COLUMN_CONFIGS[paramType] || [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
  ]
  const finalColumns = columns || defaultColumns

  // États de chargement et d'erreur
  if (isLoading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #28A325',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Chargement des {title.toLowerCase()}...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        backgroundColor: '#fef2f2',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{ color: '#dc2626', fontSize: '2rem' }}>❌</div>
        <h3 style={{ color: '#dc2626', fontSize: '1.25rem', margin: 0 }}>
          Erreur lors du chargement des {title.toLowerCase()}
        </h3>
        <p style={{ color: '#6b7280', margin: 0 }}>
          {error.message || 'Une erreur est survenue'}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28A325',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (isEmpty && isReady) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{ color: '#6b7280', fontSize: '2rem' }}>📋</div>
        <h3 style={{ color: '#6b7280', fontSize: '1.25rem', margin: 0 }}>
          Aucune donnée disponible
        </h3>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Aucun {title.toLowerCase()} trouvé.
        </p>
      </div>
    )
  }

  // Rendre le composant ParameterView avec les données
  return (
    <ParameterView
      title={title}
      description={description}
      columns={finalColumns}
      initData={data}
    />
  )
}
