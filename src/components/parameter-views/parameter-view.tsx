"use client"

import { useEffect, useState, useCallback } from 'react'
import { ParameterPage } from './parameter-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { PARAMETER_CONFIG } from '@/lib/parameter-config'
import { PaginationInfo, PaginationParams, normalizePaginationParams } from '@/types/pagination'

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
    sortDirection: 'ASC',
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
  const [formData, setFormData] = useState({ code: '', libelle: '' })

  // Configuration du paramètre actuel
  const currentConfig = type ? PARAMETER_CONFIG.getConfig(type) : null
  
  // Hook dynamique basé sur le type
  // Vérifier si le hook accepte des paramètres de pagination
  const hookFunction = currentConfig?.hook

  // Utiliser le hook avec ou sans paramètres selon sa signature
  let hookData

  if (useServerPagination && hookFunction) {
    // Vérifier si le hook supporte les paramètres (c'est le cas pour les hooks paginés)
    if (hookFunction.name.includes('Paginated') || hookFunction.name.includes('paginated')) {
      // Hook avec paramètres (pagination)
      hookData = hookFunction(paginationParams)
    } else {
      // Hook qui ne supporte pas la pagination mais on force useServerPagination
      // Dans ce cas, on ne peut pas faire de vraie pagination serveur
      // On utilise le hook normal et on simule la pagination
      hookData = hookFunction()
    }
  } else if (hookFunction) {
    // Hook sans paramètres
    hookData = hookFunction()
  } else {
    // Fallback
    hookData = { data: null, error: null, isLoading: false, refetch: () => {} }
  }

  const { data: apiData, error, isLoading, refetch } = hookData

  // Dépendance pour le useEffect basée sur la pagination
  const paginationDependency = useServerPagination ? JSON.stringify(paginationParams) : undefined

  useEffect(() => {
    if (type && currentConfig && apiData) {
      console.log(`${type} data loaded:`, apiData)

      // Mapper les données selon la configuration
      let dataArray: unknown[]

      if (currentConfig?.dataKey === null) {
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
  }, [type, apiData, initData, paginationDependency])
  


  const handleAdd = useCallback(() => {
    console.log("Bouton Ajouter cliqué")
    console.log("Type de paramètre:", type)
    console.log("Configuration:", currentConfig)
    setEditingItem(null)
    setFormData({ code: '', libelle: '' })
    setShowForm(true)
  }, [type, currentConfig])

  const handleEdit = useCallback((item: SimpleItem) => {
    setEditingItem(item)
    setFormData({
      code: String(item.code || ''),
      libelle: String(item.libelle || '')
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((item: SimpleItem) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${item.libelle} ?`)) {
      setData(data.filter(d => d.id !== item.id))
    }
  }, [data])

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
    const newParams = normalizePaginationParams({
      ...paginationParams,
      search: searchTerm,
      page: 0 // Remettre à la page 0 lors d'une recherche
    })

    console.log("onSearchSubmit called - searchTerm:", searchTerm)
    console.log("onSearchSubmit called - paginationParams:", newParams)

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
  }, [currentSearchValue, paginationParams, refetch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code.trim() || !formData.libelle.trim()) {
      alert('Veuillez remplir tous les champs')
      return
    }

    // Vérifier si on a un type de paramètre et une configuration
    if (!type || !currentConfig) {
      alert('Type de paramètre non défini')
      return
    }

    setIsFormLoading(true)

    try {
      if (editingItem) {
        // Modification côté client (pour l'instant)
        setData(data.map(item =>
          item.id === editingItem.id
            ? { ...item, code: formData.code, libelle: formData.libelle }
            : item
        ))
      } else {
        // Ajout côté serveur
        await handleCreateNewItem()
      }

      setShowForm(false)
      setEditingItem(null)
      setFormData({ code: '', libelle: '' })
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleCreateNewItem = async () => {
    if (!type || !currentConfig) return

    // Réinitialiser les erreurs
    setFormError(null)
    setIsFormLoading(true)

    try {
      // Créer l'objet brut selon le type
      const rawItem = createRawItem(type, formData.code, formData.libelle)

      // Utiliser le mapper approprié pour créer l'objet à insérer
      const mappedItem = currentConfig?.mapper(rawItem)

      console.log(`Ajout d'un nouvel élément de type: ${type}`, mappedItem)

      // Ajouter temporairement l'élément côté client pour une meilleure UX
      const newItem: SimpleItem = {
        id: `temp_${Date.now()}`,
        code: formData.code,
        libelle: formData.libelle
      }

      setData(prev => [...prev, newItem])

      // Déclencher l'ajout côté serveur selon le type
      await handleServerCreate(mappedItem, type)

      // Fermer le formulaire et réinitialiser les données
      setShowForm(false)
      setFormData({ code: '', libelle: '' })

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createRawItem = (type: string, code: string, libelle: string): any => {
    switch (type) {
      case 'banque':
        return { BQ_CODE: code, BQ_LIB: libelle }
      case 'agence_de_banque':
        return { BQAG_NUM: code, BQAG_LIB: libelle }
      case 'classe':
        return { CL_CODE: code, CL_LIB: libelle }
      case 'categorie_debiteur':
        return { CD_CODE: code, CD_LIB: libelle }
      case 'civilite':
        return { CV_CODE: code, CV_LIB: libelle }
      case 'nationalite':
        return { NAT_CODE: code, NAT_LIB: libelle }
      case 'profession':
        return { PROF_CODE: code, PROF_LIB: libelle }
      case 'quartier':
        return { Q_CODE: code, Q_LIB: libelle }
      case 'ville':
        return { V_CODE: code, V_LIB: libelle }
      case 'zone':
        return { Z_CODE: code, Z_LIB: libelle }
      case 'type_operation':
        return { TOP_CODE: code, TOP_LIB: libelle }
      default:
        return { code, libelle }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleServerCreate = async (item: any, itemType: string) => {
    if (!itemType) return

    try {
      // Dynamiquement importer et utiliser le bon hook de création
      const createHook = await PARAMETER_CONFIG.getCreateHook(itemType)
      if (!createHook) {
        console.log('Hook de création non trouvé pour le type:', itemType)
        return
      }

      // Créer le hook de mutation
      const mutationHook = createHook()
      await mutationHook.mutateAsync(item)

    } catch (error) {
      console.error('Erreur lors de la création:', error)
      throw error
    }
  }


  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({ code: '', libelle: '' })
  }

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
        onEdit={handleEdit}
        onDelete={handleDelete}
        status={isLoading}
        useServerPagination={useServerPagination && currentConfig?.hook?.name.includes('Paginated')}
        isPaginationLoading={isPaginationLoading}
        isTableLoading={isTableLoading}
        pagination={(() => {
          // Vérifier si apiData contient les informations de pagination
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
          else {
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
          }
        })()
        }
        onPaginationChange={(params: { page?: number; size?: number; search?: string }) => {
          // Mettre à jour les paramètres de pagination
          setPaginationParams(prev => {
            const newParams = normalizePaginationParams({
              ...prev,
              ...params
            })

            // Indiquer le chargement global
            setIsTableLoading(true)

            // Si seulement la page change, on indique le chargement
            if (params.page !== undefined && params.search === undefined) {
              setIsPaginationLoading(true)
            }

            // Mettre à jour la recherche si elle a changé
            if (params.search !== undefined) {
              setSearchQuery(params.search)
              // Indiquer le chargement lors d'une recherche
              if (params.search !== prev.search) {
                setIsPaginationLoading(true)
              }
            }

            // Si les paramètres ont changé, on déclenche un refetch
            if (JSON.stringify(prev) !== JSON.stringify(newParams)) {
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
            }

            return newParams
          })
        }}
        // addButtonText={`Nouveau ${title.toLowerCase().slice(0, -1)}`}
      />

      {/* Formulaire modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border shadow-xl">
          {/* Header stylé */}
          <div className="bg-gradient-to-r from-emerald-50 to-white border-b px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Modifier' : 'Ajouter'} {title.toLowerCase().slice(0, -1)}
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
              <div className="space-y-2">
                <Label htmlFor="code" className="text-base font-medium text-gray-800">
                  Code *
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Saisir le code..."
                  required
                  style={{
                    border: '1px solid #000',
                    padding: '5px 15px',
                    borderRadius: '6px',
                  }}
                  className="h-10 border-gray-300 focus-visible:ring-emerald-200 focus-visible:border-emerald-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="libelle" className="text-base font-medium text-gray-800">
                  Libellé *
                </Label>
                <Input
                  id="libelle"
                  type="text"
                  value={formData.libelle}
                  onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                  placeholder="Saisir le libellé..."
                  required
                  style={{
                    border: '1px solid #000',
                    padding: '5px 15px',
                    borderRadius: '6px',
                  }}
                  className="h-10 border-[gray-300] focus-visible:ring-emerald-200 focus-visible:border-emerald-500"
                />
              </div>
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
                disabled={isFormLoading || !formData.code.trim() || !formData.libelle.trim()}
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
