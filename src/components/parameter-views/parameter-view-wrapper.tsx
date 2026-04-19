"use client"

import { useMemo } from 'react'
import { PARAMETER_CONFIG } from '@/lib/parameter-config'
import ParameterView from './parameter-view'

interface ParameterViewWrapperProps {
  title: string
  description?: string
  initData?: Array<{ id: string; [key: string]: unknown }>
  type?: string
  columns?: Array<{
    key: string
    label: string
    sortable?: boolean
    render?: (value: unknown, item: any) => React.ReactNode
  }>
  useServerPagination?: boolean
}

/**
 * Composant wrapper qui garantit que ParameterView ne reçoit que des types valides
 * Évite la violation des règles des hooks React quand le type est undefined
 */
export default function ParameterViewWrapper({
  title,
  description,
  initData,
  type,
  columns,
  useServerPagination = false
}: ParameterViewWrapperProps) {
  // Vérifier que le type est valide AVANT de rendre ParameterView
  const isValidType = useMemo(() => {
    if (!type) return false
    const config = PARAMETER_CONFIG.getConfig(type)
    return config && config.hook !== undefined
  }, [type])

  // Ne pas rendre ParameterView si le type n'est pas valide
  // Cela évite que ParameterView appelle conditionnellement des hooks
  if (!isValidType) {
    console.warn('[ParameterViewWrapper] Type invalide ou undefined:', type)
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>Configuration du paramètre "{type || 'inconnu'}" non trouvée</p>
      </div>
    )
  }

  // Type est valide → ParameterView peut être rendu en toute sécurité
  // Les hooks seront toujours appelés dans le même ordre
  return (
    <ParameterView
      title={title}
      description={description}
      initData={initData}
      type={type}
      columns={columns}
      useServerPagination={useServerPagination}
    />
  )
}
