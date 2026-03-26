"use client"

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/useApiClient'
import { toast } from 'sonner'
import { ParameterPage } from './parameter-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { PARAMETER_CONFIG } from '@/lib/parameter-config'
import { PaginationInfo, PaginationParams, normalizePaginationParams } from '@/types/pagination'
import { getFormFieldsForType, validateFormField, type FormFieldConfig } from '@/lib/form-field-config'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useBanquesSearchable } from '@/hooks/useBanquesSearchable'

interface PaginationData {
  totalElements?: number
  totalPages?: number
  size?: number
  number?: number
  first?: boolean
  last?: boolean
  numberOfElements?: number
  hasNext?: boolean
  hasPrevious?: boolean
}

interface ParameterViewProps {
  title: string
  description?: string
  initData?: Array<{ id: string; [key: string]: unknown }>
  type?: string
  columns?: Array<{
    key: string
    label: string
    sortable?: boolean
    render?: (value: unknown, item: SimpleItem) => React.ReactNode
  }>
  useServerPagination?: boolean
}

interface SimpleItem {
  id: string
  [key: string]: unknown
}

const defaultColumns = [
  {
    key: 'code',
    label: 'Code',
    sortable: true,
  },
  {
    key: 'libelle', 
    label: 'Libellé',
    sortable: true,
  }
]



export default function ParameterView({ 
  title, 
  description, 
  initData,
  columns: initialColumns = defaultColumns,
  type,
  useServerPagination = false
}: ParameterViewProps) {
  // Initialisation directe avec une fonction pour éviter les re-calculs
  const [data, setData] = useState<SimpleItem[]>([])

  // État pour la pagination côté serveur
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 0,
    size: 50,
    search: '',
    sortDirection: 'DESC',
    // sortBy: 'code'
  })

  // État pour la recherche (synchronisé avec DataTable)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentSearchValue, setCurrentSearchValue] = useState('')

  // État pour indiquer le chargement lors de la pagination
  const [isPaginationLoading, setIsPaginationLoading] = useState(false)

  // État pour indiquer le chargement global du tableau
  const [isTableLoading, setIsTableLoading] = useState(false)

  // État pour indiquer le chargement lors de l'ajout/modification
  const [isFormLoading, setIsFormLoading] = useState(false)

  // État pour les erreurs d'API
  const [formError, setFormError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<SimpleItem | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // Obtenir la configuration des champs pour ce type
  const formFields = useMemo(() => {
    return type ? getFormFieldsForType(type) : []
  }, [type])

  // Hook pour les banques - toujours appelé pour respecter les règles des hooks
  // Mais seulement utilisé si le type est agence_de_banque
  const banquesSearchable = useBanquesSearchable()
  
  // Initialiser formData avec les champs requis (seulement au montage ou changement de type)
  useEffect(() => {
    if (formFields.length > 0 && Object.keys(formData).length === 0) {
      const initialData: Record<string, any> = {}
      formFields.forEach(field => {
        initialData[field.key] = ''
      })
      setFormData(initialData)
      setFormErrors({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]) // Ne dépendre que de type, pas de formFields qui est un tableau qui change de référence

  // Hooks pour l'API et le cache
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  // Configuration du paramètre actuel (mémoïsée pour éviter les re-créations)
  const currentConfig = useMemo(() => {
    return type ? PARAMETER_CONFIG.getConfig(type) : null
  }, [type])
  
  // Hook dynamique basé sur le type
  // IMPORTANT: Toujours appeler exactement un hook pour respecter les règles des hooks React
  const hookFunction = currentConfig?.hook
  const hookPaginatedFunction = currentConfig?.hookPaginated

  // Appeler exactement un hook selon les conditions
  // Si on utilise la pagination serveur ET qu'on a un hook paginé, l'utiliser
  // Sinon, utiliser le hook normal
  // Le ternaire garantit qu'on appelle toujours exactement un hook
  const hookData = useServerPagination
    ? (
      hookPaginatedFunction
        ? hookPaginatedFunction(paginationParams)
        : (hookFunction
            // Cas important: certains hooks "paginated" (ex: useAgencesBanquePaginated)
            // exposent uniquement `hook` mais attendent quand même les params.
            ? hookFunction(paginationParams)
            : { data: null, error: null, isLoading: false, refetch: () => {} })
    )
    : (
      hookFunction
        ? hookFunction()
        : { data: null, error: null, isLoading: false, refetch: () => {} }
    )

  const { data: apiData, error, isLoading, refetch } = hookData

  // Dépendance pour le useEffect basée sur la pagination (mémoïsée)
  const paginationDependency = useMemo(() => {
    return useServerPagination ? JSON.stringify(paginationParams) : undefined
  }, [useServerPagination, paginationParams.page, paginationParams.size, paginationParams.search, paginationParams.sortBy, paginationParams.sortDirection])

  useEffect(() => {
    if (type && currentConfig && apiData) {
      console.log(`${type} data loaded:`, apiData)

      // Mapper les données selon la configuration
      let dataArray: unknown[]

      if (useServerPagination && apiData && typeof apiData === 'object' && !Array.isArray(apiData) && 'data' in apiData) {
        // Pour la pagination côté serveur, extraire depuis apiData.data.content
        const paginatedResponse = apiData as { data?: { content?: unknown[] } }
        dataArray = Array.isArray(paginatedResponse.data?.content) 
          ? paginatedResponse.data.content 
          : []
      } else if (currentConfig?.dataKey === null) {
        // Les données sont déjà extraites dans le hook
        dataArray = Array.isArray(apiData) ? apiData : []
      } else {
        // Extraire les données de l'objet de réponse
        dataArray = (apiData as unknown as Record<string, unknown>)[currentConfig?.dataKey || ''] as unknown[]
        dataArray = Array.isArray(dataArray) ? dataArray : []
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedData = dataArray.map((item: unknown) => currentConfig?.mapper(item as any))
      console.log(`${type} data mapped:`, mappedData)
      setData(mappedData)

      // Désactiver le chargement quand les données arrivent
      setIsTableLoading(false)
    } else if (initData) {
      // Utiliser les données initiales si pas de type spécifique
      setData(initData)
      // Désactiver le chargement
      setIsTableLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, apiData, initData, paginationDependency, useServerPagination])
  


  const handleAdd = useCallback(() => {
    console.log("Bouton Ajouter cliqué")
    console.log("Type de paramètre:", type)
    console.log("Configuration:", currentConfig)
    setEditingItem(null)
    // Réinitialiser avec les champs de la configuration
    const initialData: Record<string, any> = {}
    formFields.forEach(field => {
      initialData[field.key] = ''
    })
    setFormData(initialData)
    setFormErrors({})
    setFormError(null)
    setShowForm(true)
  }, [type, currentConfig, formFields])

  const handleEdit = useCallback((item: SimpleItem) => {
    setEditingItem(item)
    // Remplir le formulaire avec les données de l'item
    const itemData: Record<string, any> = {}
    formFields.forEach(field => {
      // Mapper depuis l'item vers le formulaire
      const apiKey = field.apiKey || field.key
      // Essayer plusieurs clés possibles
      // Pour agence_de_banque, banqueCode peut être dans banqueCode ou BQ_CODE
      if (field.key === 'banqueCode' && type === 'agence_de_banque') {
        itemData[field.key] = item.banqueCode || item.BQ_CODE || ''
      } else {
        itemData[field.key] = item[field.key] || item[apiKey] || 
                             (field.key === 'code' ? item.code : '') ||
                             (field.key === 'libelle' ? item.libelle : '') || ''
      }
      
      // Pour les dates, convertir en format YYYY-MM-DD
      if (field.type === 'date' && itemData[field.key]) {
        try {
          const date = new Date(itemData[field.key])
          if (!isNaN(date.getTime())) {
            itemData[field.key] = date.toISOString().split('T')[0]
          }
        } catch {
          // Si la conversion échoue, garder la valeur originale
        }
      }
    })
    setFormData(itemData)
    setFormErrors({})
    setFormError(null)
    setShowForm(true)
  }, [formFields, type])

  const handleDelete = useCallback(async (item: SimpleItem) => {
    if (!type) {
      console.error('Type de paramètre non défini')
      return
    }

    try {
      // Dynamiquement importer et utiliser le service de suppression
      const deleteService = await PARAMETER_CONFIG.getServiceDelete(type)
      if (!deleteService) {
        console.log('Service de suppression non trouvé pour le type:', type)
        throw new Error('Service de suppression non disponible')
      }

      if (type === 'agence_de_banque') {
        const bqCode = (item as any).banqueCode ?? (item as any).BQ_CODE ?? ''
        const bqagLib = (item as any).libelle ?? (item as any).BQAG_LIB ?? ''
        // On ne récupère PAS bqagNum via `code`, car `code` sert à l'affichage (BQAG_CODE).
        const bqagNum = (item as any).bqagNum ?? (item as any).BQAG_NUM ?? ''
        const bqagCode = (item as any).bqagCode ?? (item as any).BQAG_CODE ?? ''

        if (!bqCode || (!bqagLib && !bqagNum && !bqagCode)) {
          throw new Error(
            `Suppression agence bancaire impossible: bqCode='${bqCode}', bqagLib='${bqagLib}', bqagNum='${bqagNum}', bqagCode='${bqagCode}'`
          )
        }

        // Le backend accepte (BQ_CODE, BQAG_LIB), (BQ_CODE, BQAG_NUM) et (BQ_CODE, BQAG_CODE) en fallback
        await (deleteService as any)(
          apiClient,
          String(bqCode),
          String(bqagLib || ''),
          String(bqagNum || ''),
          String(bqagCode || '')
        )
      } else {
        const code = (item as any).code ?? (item as any).id
        await deleteService(apiClient, String(code))
      }

      // Rafraîchir les données depuis le serveur
      refetch()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      // En cas d'erreur, refetch pour avoir les données correctes
      refetch()
      throw error
    }
  }, [type, refetch, apiClient, queryClient])

  const handleSearchChange = useCallback((newQuery: string) => {
    // Ne pas déclencher automatiquement la recherche
    // Juste mettre à jour la query locale
    setSearchQuery(newQuery)
    setCurrentSearchValue(newQuery)
  }, [])

  const handleSearchValueChange = useCallback((newValue: string) => {
    // Mettre à jour la valeur actuelle du champ de recherche
    setCurrentSearchValue(newValue)
  }, [])

  const handleSearchReset = useCallback(() => {
    // Vider la recherche et relancer avec des paramètres vides
    setCurrentSearchValue('')
    setSearchQuery('')

    const newParams = normalizePaginationParams({
      ...paginationParams,
      search: '',
      page: 0 // Remettre à la page 0
    })

    // Mettre à jour les paramètres
    setPaginationParams(newParams)

    // Indiquer le chargement lors d'une recherche
    setIsTableLoading(true)
    setIsPaginationLoading(true)

    // Déclencher le refetch
    const refetchResult = refetch()
    if (refetchResult && typeof refetchResult.finally === 'function') {
      refetchResult.finally(() => {
        setIsTableLoading(false)
        setIsPaginationLoading(false)
      })
    } else {
      setIsTableLoading(false)
      setIsPaginationLoading(false)
    }
  }, [paginationParams, refetch])

  const handleSearchSubmit = useCallback(() => {
    // Utiliser currentSearchValue qui contient la valeur actuelle du champ
    const searchTerm = currentSearchValue

    // Déclencher la recherche quand on clique sur le bouton
    setPaginationParams(prev => {
      const newParams = normalizePaginationParams({
        ...prev,
        search: searchTerm,
        page: 0 // Remettre à la page 0 lors d'une recherche
      })

      console.log("onSearchSubmit called - searchTerm:", searchTerm)
      console.log("onSearchSubmit called - paginationParams:", newParams)

      // Indiquer le chargement lors d'une recherche
      setIsTableLoading(true)
      setIsPaginationLoading(true)

      // Déclencher le refetch
      const refetchResult = refetch()
      if (refetchResult && typeof refetchResult.finally === 'function') {
        refetchResult.finally(() => {
          setIsTableLoading(false)
          setIsPaginationLoading(false)
        })
      } else {
        setIsTableLoading(false)
        setIsPaginationLoading(false)
      }

      return newParams
    })
  }, [currentSearchValue, refetch])

  // Fonction de validation qui ne met pas à jour l'état (pour éviter les re-renders infinis)
  const isValidForm = useMemo((): boolean => {
    let isValid = true
    
    formFields.forEach(field => {
      const value = formData[field.key]
      const error = validateFormField(value, field)
      if (error) {
        isValid = false
      }
    })
    
    return isValid
  }, [formData, formFields])

  // Fonction de validation qui met à jour les erreurs (appelée lors de la soumission)
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}
    
    formFields.forEach(field => {
      const value = formData[field.key]
      const error = validateFormField(value, field)
      if (error) {
        errors[field.key] = error
      }
    })
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData, formFields])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Valider le formulaire
    if (!validateForm()) {
      setFormError('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    // Vérifier si on a un type de paramètre et une configuration
    if (!type || !currentConfig) {
      setFormError('Type de paramètre non défini')
      return
    }

    setIsFormLoading(true)
    setFormError(null)

    try {
      if (editingItem) {
        // Modification côté serveur
        await handleUpdateItem()
      } else {
        // Ajout côté serveur
        await handleCreateNewItem()
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)

      const errorMessage = (error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ||
                          (error as Error)?.message ||
                          "Erreur lors de la sauvegarde"
      setFormError(errorMessage)
    }
  }

  const handleCreateNewItem = async () => {
    if (!type || !currentConfig) return

    // Réinitialiser les erreurs
    setFormError(null)
    setIsFormLoading(true)

    try {
      // Créer l'objet brut selon les champs du formulaire
      const rawItem = createRawItemFromForm(type, formData, formFields)

      // NOTE: currentConfig.mapper() sert au mapping pour l'affichage.
      // Pour l'appel API "create", on doit envoyer les clés API (via createRawItemFromForm),
      // sinon on perd les champs attendus par le backend (ex: BQ_CODE, BQAG_LIB).
      console.log(`Ajout d'un nouvel élément de type: ${type}`, { rawItem })

      // Ajouter temporairement l'élément côté client pour une meilleure UX
      const timestamp = typeof window !== 'undefined' ? Date.now() : 0
      const newItem: SimpleItem = {
        id: `temp_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
        ...formData
      }

      setData(prev => [...prev, newItem])

      // Déclencher l'ajout côté serveur selon le type
      await handleServerCreate(rawItem, type)

      // Fermer le formulaire et réinitialiser les données
      setShowForm(false)
      const initialData: Record<string, any> = {}
      formFields.forEach(field => {
        initialData[field.key] = ''
      })
      setFormData(initialData)
      setFormErrors({})

    } catch (error) {
      console.error('Erreur lors de la création:', error)

      // Afficher l'erreur à l'utilisateur
      const errorMessage = (error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ||
                          (error as Error)?.message ||
                          "Erreur lors de la création de l'élément"

      setFormError(errorMessage)

      // Supprimer l'élément temporaire en cas d'erreur
      setData(prev => prev.filter(item => !item.id.startsWith('temp_')))
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleUpdateItem = async () => {
    if (!type || !currentConfig || !editingItem) return

    setFormError(null)
    setIsFormLoading(true)

    try {
      // Créer l'objet brut selon les champs du formulaire
      const rawItem = createRawItemFromForm(type, formData, formFields)

      console.log(`Mise à jour de l'élément de type: ${type}`, rawItem)

      if (type === 'agence_de_banque') {
        // Pour agence_de_banque, la clé est composite (BQ_CODE, BQAG_LIB).
        // IMPORTANT: l'URL doit utiliser l'ancienne valeur BQAG_LIB (avant modification),
        // sinon rowsAffected = 0.
        const bqCodeKey =
          String((editingItem as any).banqueCode ?? (editingItem as any).BQ_CODE ?? rawItem?.BQ_CODE ?? '')
        const bqagLibKey =
          String((editingItem as any).libelle ?? (editingItem as any).BQAG_LIB ?? rawItem?.BQAG_LIB ?? '')

        const agenceModule = await import('@/services/agence-banque.service')
        await agenceModule.AgenceBanqueService.updateByComposite(apiClient, bqCodeKey, bqagLibKey, rawItem)
      } else {
        // Dynamiquement importer et utiliser le service de mise à jour
        const updateService = await PARAMETER_CONFIG.getServiceUpdate(type)
        if (!updateService) {
          throw new Error('Service de mise à jour non trouvé pour le type: ' + type)
        }

        // Obtenir le code de l'élément à mettre à jour
        const itemCode = String(editingItem.code || editingItem.id || '')
        // Appeler le service directement avec l'objet brut
        await updateService(apiClient, itemCode, rawItem)
      }

      // Invalider le cache et afficher un message de succès
      queryClient.invalidateQueries({ queryKey: [type] })
      toast.success('Élément mis à jour avec succès')

      // Rafraîchir les données depuis le serveur
      refetch()

      // Fermer le formulaire
      setShowForm(false)
      const initialData: Record<string, any> = {}
      formFields.forEach(field => {
        initialData[field.key] = ''
      })
      setFormData(initialData)
      setFormErrors({})
      setEditingItem(null)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)

      const errorMessage = (error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ||
                          (error as Error)?.message ||
                          "Erreur lors de la mise à jour de l'élément"

      setFormError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsFormLoading(false)
    }
  }

  // Créer l'objet brut à partir des données du formulaire
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createRawItemFromForm = (type: string, formData: Record<string, any>, fields: FormFieldConfig[]): any => {
    const rawItem: Record<string, any> = {}
    
    fields.forEach(field => {
      const value = formData[field.key]
      const apiKey = field.apiKey || field.key
      
      if (value !== undefined && value !== null && value !== '') {
        if (field.type === 'number') {
          rawItem[apiKey] = Number(value)
        } else if (field.type === 'date') {
          // Les dates sont déjà au format YYYY-MM-DD depuis l'input date
          rawItem[apiKey] = value
        } else {
          rawItem[apiKey] = String(value).trim()
        }
      }
    })
    
    return rawItem
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleServerCreate = async (item: any, itemType: string) => {
    if (!itemType) return

    try {
      // Dynamiquement importer et utiliser le service de création
      const createService = await PARAMETER_CONFIG.getServiceCreate(itemType)
      if (!createService) {
        console.log('Service de création non trouvé pour le type:', itemType)
        toast.error('Service de création non disponible')
        return
      }

      // Appeler le service directement
      await createService(apiClient, item)

      // Invalider le cache et afficher un message de succès
      queryClient.invalidateQueries({ queryKey: [itemType] })
      toast.success('Élément créé avec succès')

      // Rafraîchir les données depuis le serveur
      refetch()

    } catch (error) {
      console.error('Erreur lors de la création:', error)
      throw error
    }
  }


  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
    const initialData: Record<string, any> = {}
    formFields.forEach(field => {
      initialData[field.key] = ''
    })
    setFormData(initialData)
    setFormErrors({})
    setFormError(null)
  }

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }))
    
    // Effacer l'erreur pour ce champ s'il existe
    if (formErrors[fieldKey]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldKey]
        return newErrors
      })
    }
  }

  // Tous les hooks doivent être appelés AVANT tout early return
  // Calculer la pagination (hook qui doit être appelé toujours)
  const pagination = useMemo(() => {
    // Pour la pagination côté serveur, extraire depuis apiData.data
    if (useServerPagination && apiData && typeof apiData === 'object' && !Array.isArray(apiData) && 'data' in apiData) {
      const paginatedResponse = apiData as { data?: PaginationData }
      const paginationData = paginatedResponse.data
      if (paginationData && typeof paginationData === 'object') {
        return {
          totalElements: paginationData.totalElements || 0,
          totalPages: paginationData.totalPages || 0,
          size: paginationData.size || 50,
          number: paginationData.number || 0,
          first: paginationData.first || false,
          last: paginationData.last || false,
          numberOfElements: paginationData.numberOfElements || 0,
          hasNext: paginationData.hasNext || false,
          hasPrevious: paginationData.hasPrevious || false,
        } as PaginationInfo
      }
    }
    // Vérifier si apiData contient les informations de pagination (format direct)
    if (apiData && typeof apiData === 'object' && !Array.isArray(apiData) && 'totalElements' in apiData) {
      const paginationData = apiData as PaginationData
      return {
        totalElements: paginationData.totalElements || 0,
        totalPages: paginationData.totalPages || 0,
        size: paginationData.size || 50,
        number: paginationData.number || 0,
        first: paginationData.first || false,
        last: paginationData.last || false,
        numberOfElements: paginationData.numberOfElements || 0,
        hasNext: paginationData.hasNext || false,
        hasPrevious: paginationData.hasPrevious || false,
      } as PaginationInfo
    }
    // Priorité 3: Fallback pour les hooks sans pagination ou quand apiData est un tableau
    return {
      totalElements: Array.isArray(apiData) ? apiData.length : 0,
      totalPages: 1,
      size: paginationParams.size || 50,
      number: paginationParams.page || 0,
      first: (paginationParams.page || 0) === 0,
      last: true, // On ne peut pas déterminer sans les données du serveur
      numberOfElements: Array.isArray(apiData) ? apiData.length : 0,
      hasNext: false, // On ne peut pas déterminer sans les données du serveur
      hasPrevious: (paginationParams.page || 0) > 0,
    } as PaginationInfo
  }, [useServerPagination, apiData, paginationParams.size, paginationParams.page])

  // Hook onPaginationChange (doit être appelé toujours)
  const handlePaginationChange = useCallback((params: { page?: number; size?: number; search?: string }) => {
    // Mettre à jour les paramètres de pagination
    setPaginationParams(prev => {
      const newParams = normalizePaginationParams({
        ...prev,
        ...params
      })

      // Comparer les paramètres de manière plus stable
      const prevKey = `${prev.page || 0}-${prev.size || 50}-${prev.search || ''}`
      const newKey = `${newParams.page || 0}-${newParams.size || 50}-${newParams.search || ''}`
      
      // Si les paramètres n'ont pas vraiment changé, ne rien faire
      if (prevKey === newKey) {
        return prev
      }

      setIsTableLoading(true)

      if (params.page !== undefined && params.search === undefined) {
        setIsPaginationLoading(true)
      }

      if (params.search !== undefined) {
        setSearchQuery(params.search)
        if (params.search !== prev.search) {
          setIsPaginationLoading(true)
        }
      }

      const refetchResult = refetch()
      if (refetchResult && typeof refetchResult.finally === 'function') {
        refetchResult.finally(() => {
          setIsTableLoading(false)
          setIsPaginationLoading(false)
        })
      } else {
        setIsTableLoading(false)
        setIsPaginationLoading(false)
      }

      return newParams
    })
  }, [refetch])

  // Gestion de l'état de chargement et d'erreur
  // if (type && isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Chargement des {title.toLowerCase()}...</p>
  //       </div>
  //     </div>
  //   )
  // }

  if (type && error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Erreur lors du chargement des {title.toLowerCase()}</p>
          <Button onClick={() => refetch()} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <ParameterPage
        title={title}
        description={description || `Gestion des ${title.toLowerCase()} de l'application`}
        data={data}
        columns={initialColumns}
        searchKey="libelle"
        searchPlaceholder={`Rechercher dans ${title.toLowerCase()}...`}
        onAdd={handleAdd}
        searchQuery={searchQuery}
        searchValue={currentSearchValue}
        onSearchChange={handleSearchChange}
        onSearchValueChange={handleSearchValueChange}
        onSearchReset={handleSearchReset}
        onSearchSubmit={currentConfig?.hook?.name.includes('Paginated') ? handleSearchSubmit : undefined}
        onRefresh={refetch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        status={isLoading}
        useServerPagination={useServerPagination && (!!currentConfig?.hookPaginated || currentConfig?.hook?.name.includes('Paginated'))}
        isPaginationLoading={isPaginationLoading}
        isTableLoading={isTableLoading}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />

      {/* Formulaire modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border shadow-xl">
          {/* Header stylé */}
          <div className="bg-gradient-to-r from-emerald-50 to-white border-b px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Modifier' : 'Ajouter'} {title.toLowerCase().endsWith('s') ? title.toLowerCase().slice(0, -1) : title.toLowerCase()}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Veuillez renseigner les champs obligatoires marqués par *
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Corps du formulaire */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 bg-white">
            {/* Affichage des erreurs d'API */}
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{formError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-5">
              {formFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label 
                    htmlFor={field.key} 
                    className="text-base font-medium text-gray-800"
                  >
                    {field.label} {field.required && '*'}
                  </Label>
                  
                  {field.type === 'searchable-select' && field.searchableHook === 'useBanquesSearchable' ? (
                    <SearchableSelect
                      value={formData[field.key] || ''}
                      onValueChange={(value) => handleFieldChange(field.key, value)}
                      items={banquesSearchable.items}
                      placeholder={banquesSearchable.isLoading ? 'Chargement...' : (field.placeholder || `Sélectionner ${field.label.toLowerCase()}...`)}
                      searchPlaceholder={`Rechercher ${field.label.toLowerCase()}...`}
                      emptyMessage={`Aucune ${field.label.toLowerCase()} trouvée`}
                      disabled={banquesSearchable.isLoading || isFormLoading}
                      isLoading={banquesSearchable.isLoading}
                      hasMore={banquesSearchable.hasMore}
                      onLoadMore={banquesSearchable.loadMore}
                      isFetchingMore={banquesSearchable.isFetchingMore}
                      onSearchChange={banquesSearchable.setSearch}
                      className={formErrors[field.key] ? 'border-red-500' : formData[field.key] ? 'border-[#28A325]' : ''}
                    />
                  ) : field.type === 'select' && field.options ? (
                    <Select
                      value={formData[field.key] || ''}
                      onValueChange={(value) => handleFieldChange(field.key, value)}
                    >
                      <SelectTrigger
                        className="h-10 border-gray-300 focus:ring-emerald-200 focus:border-emerald-500"
                        style={{
                          border: '1px solid #000',
                          padding: '5px 15px',
                          borderRadius: '6px',
                        }}
                      >
                        <SelectValue placeholder={field.placeholder || `Sélectionner ${field.label.toLowerCase()}...`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={field.key}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder || `Saisir ${field.label.toLowerCase()}...`}
                      required={field.required}
                      maxLength={field.maxLength}
                      rows={4}
                      style={{
                        border: '1px solid #000',
                        padding: '5px 15px',
                        borderRadius: '6px',
                        width: '100%',
                        resize: 'vertical',
                      }}
                      className="border-gray-300 focus:ring-emerald-200 focus:border-emerald-500"
                    />
                  ) : (
                    <Input
                      id={field.key}
                      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder || `Saisir ${field.label.toLowerCase()}...`}
                      required={field.required}
                      maxLength={field.maxLength}
                      min={field.min}
                      max={field.max}
                      style={{
                        border: '1px solid #000',
                        padding: '5px 15px',
                        borderRadius: '6px',
                      }}
                      className="h-10 border-gray-300 focus-visible:ring-emerald-200 focus-visible:border-emerald-500"
                    />
                  )}
                  
                  {formErrors[field.key] && (
                    <p className="text-sm text-red-600 mt-1">{formErrors[field.key]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <DialogFooter className="gap-3 px-0 ">
              <Button
                type="button"
                style={{
                  border: '2px solid #6b7280',
                  padding: '5px 15px',
                  borderRadius: '6px',
                }}
                variant="outline"
                onClick={handleCancel}
                className="px-6 h-10 hover:bg-gray-50"
                disabled={isFormLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                style={{
                  border: '2px solid #10b981',
                  padding: '5px 15px',
                  borderRadius: '6px',
                }}
                className="bg-emerald-600 hover:bg-emerald-700! px-8! h-10 hover:text-white!"
                disabled={isFormLoading || !isValidForm}
              >
                {isFormLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingItem ? 'Modification...' : 'Ajout...'}
                  </>
                ) : (
                  editingItem ? 'Modifier' : 'Ajouter'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
