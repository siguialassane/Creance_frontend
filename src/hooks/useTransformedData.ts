import { useMemo } from 'react'
import { useBanques } from './useBanques'
import { useSession } from 'next-auth/react'

// Types pour les données transformées
export interface TransformedBanque {
  id: string
  code: string
  libelle: string
  responsable?: string
  adresse?: string
  contact?: string
  [key: string]: any
}

// Hook pour transformer les données des banques
export function useTransformedBanques() {
  const { data: banquesData, isLoading, error, status } = useBanques()
  const { status: sessionStatus } = useSession()

  const transformedData = useMemo(() => {
    // Vérifier que les données sont bien un tableau
    if (!banquesData || !Array.isArray(banquesData)) {
      return []
    }

    return banquesData.map((banque: any) => ({
      id: banque.BQ_CODE || '',
      code: banque.BQ_CODE || '',
      libelle: banque.BQ_LIB || '',
      responsable: banque.BQ_RESPONS || '',
      adresse: banque.BQ_ADRESS || '',
      contact: banque.BQ_CONTACT || '',
      // Ajouter d'autres champs si nécessaire
      cptoperCode: banque.CPTOPER_CODE || '',
      bqag: banque.BQAG || '',
      libLong: banque.BQ_LIBLONG || '',
      sigle: banque.BQ_SIGLE || '',
      autLib: banque.BQ_AUTLIB || '',
    }))
  }, [banquesData])

  return {
    data: transformedData,
    isLoading: isLoading || sessionStatus === 'loading',
    error,
    isEmpty: transformedData.length === 0,
    isReady: !isLoading && !error && sessionStatus === 'authenticated'
  }
}

// Hook pour transformer les données des civilités (exemple d'extension)
export function useTransformedCivilites() {
  // Pour l'instant, utiliser des données statiques
  // Plus tard, remplacer par un vrai hook API comme useCivilites()
  const civilitesData = [
    { id: '1', code: 'M', libelle: 'Monsieur' },
    { id: '2', code: 'Mme', libelle: 'Madame' },
    { id: '3', code: 'Mlle', libelle: 'Mademoiselle' },
  ]

  const transformedData = useMemo(() => {
    return civilitesData.map((civilite: any) => ({
      id: civilite.id,
      code: civilite.code,
      libelle: civilite.libelle,
    }))
  }, [civilitesData])

  return {
    data: transformedData,
    isLoading: false,
    error: null,
    isEmpty: transformedData.length === 0,
    isReady: true
  }
}

// Hook générique pour d'autres types de données (à étendre plus tard)
export function useTransformedData<T>(
  data: any[] | undefined,
  transformer: (item: any) => T,
  isLoading: boolean = false,
  error: any = null
) {
  const transformedData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return []
    }
    return data.map(transformer)
  }, [data, transformer])

  return {
    data: transformedData,
    isLoading,
    error,
    isEmpty: transformedData.length === 0,
    isReady: !isLoading && !error
  }
}
