"use client"

import { useEffect, useState } from 'react'
import { ParameterPage } from './parameter-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { useBanques } from '@/hooks/useBanques'
import { useAgencesBanque } from '@/hooks/useAgencesBanque'
import { useClasses } from '@/hooks/useClasses'
import { useCategoriesDebiteur } from '@/hooks/useCategoriesDebiteur'
import { useCivilites } from '@/hooks/useCivilites'
import { useNationalites } from '@/hooks/useNationalites'
import { useProfessions } from '@/hooks/useProfessions'
import { useQuartiers } from '@/hooks/useQuartiers'
import { useVilles } from '@/hooks/useVilles'
import { useZones } from '@/hooks/useZones'
import { useTypesOperation } from '@/hooks/useTypesOperation'
import { Banque } from '@/types/banque'
import { AgenceBanque } from '@/types/agence-banque'
import { Classe } from '@/types/classe'
import { CategorieDebiteur } from '@/types/categorie-debiteur'
import { Civilite } from '@/types/civilite'
import { Nationalite } from '@/types/nationalite'
import { Profession } from '@/types/profession'
import { Quartier } from '@/types/quartier'
import { Ville } from '@/types/ville'
import { Zone } from '@/types/zone'
import { TypeOperation } from '@/types/type-operation'

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

// Configuration des paramètres supportés
const PARAMETER_CONFIG = {
  banque: {
    hook: useBanques,
    dataKey: null, // Les données sont déjà extraites dans le hook
    mapper: (item: Banque) => ({
      id: item.BQ_CODE,
      code: item.BQ_CODE,
      libelle: item.BQ_LIB,
    })
  },
  agence_de_banque: {
    hook: useAgencesBanque,
    dataKey: null, // Les données sont déjà extraites dans le hook
    mapper: (item: AgenceBanque) => ({
      id: item.BQAG_NUM,
      code: item.BQAG_NUM,
      banqueCode: item.BQ_CODE,
      libelle: item.BQAG_LIB,
    })
  },
  classe: {
    hook: useClasses,
    dataKey: null, // Les données sont déjà extraites dans le hook
    mapper: (item: Classe) => ({
      id: item.CL_CODE,
      code: item.CL_CODE,
      libelle: item.CL_LIB,
    })
  },
  categorie_debiteur: {
    hook: useCategoriesDebiteur,
    dataKey: null, // Les données sont déjà extraites dans le hook
    mapper: (item: CategorieDebiteur) => ({
      id: item.CD_CODE,
      code: item.CD_CODE,
      libelle: item.CD_LIB,
    })
  },
  civilite: {
    hook: useCivilites,
    dataKey: null, // Les données sont déjà extraites dans le hook
    mapper: (item: Civilite) => ({
      id: item.CV_CODE,
      code: item.CV_CODE,
      libelle: item.CV_LIB,
    })
  },
  nationalite: {
    hook: useNationalites,
    dataKey: null,
    mapper: (item: Nationalite) => ({ id: item.NAT_CODE, code: item.NAT_CODE, libelle: item.NAT_LIB })
  },
  profession: {
    hook: useProfessions,
    dataKey: null,
    mapper: (item: Profession) => ({ id: item.PROF_CODE, code: item.PROF_CODE, libelle: item.PROF_LIB })
  },
  quartier: {
    hook: useQuartiers,
    dataKey: null,
    mapper: (item: Quartier) => ({ id: item.Q_CODE, code: item.Q_CODE, libelle: item.Q_LIB })
  },
  ville: {
    hook: useVilles,
    dataKey: null,
    mapper: (item: Ville) => ({ id: item.V_CODE, code: item.V_CODE, libelle: item.V_LIB })
  },
  zone: {
    hook: useZones,
    dataKey: null,
    mapper: (item: Zone) => ({ id: item.Z_CODE, code: item.Z_CODE, libelle: item.Z_LIB })
  },
  type_operation: {
    hook: useTypesOperation,
    dataKey: null,
    mapper: (item: TypeOperation) => ({ id: item.TOP_CODE, code: item.TOP_CODE, libelle: item.TOP_LIB })
  }
}


export default function ParameterView({ 
  title, 
  description, 
  initData,
  columns: initialColumns = defaultColumns,
  type
}: ParameterViewProps) {
  console.log("initialData", initData)
  // Initialisation directe avec une fonction pour éviter les re-calculs
  const [data, setData] = useState<SimpleItem[]>([])
  
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<SimpleItem | null>(null)
  const [formData, setFormData] = useState({ code: '', libelle: '' })

  // Configuration du paramètre actuel
  const currentConfig = type ? PARAMETER_CONFIG[type as keyof typeof PARAMETER_CONFIG] : null
  
  // Hook dynamique basé sur le type
  const { data: apiData, error, isLoading, refetch } = currentConfig?.hook() || { 
    data: null, 
    error: null, 
    isLoading: false, 
    refetch: () => {} 
  }

  // Statut de chargement pour le composant ParameterPage
  const status = isLoading ? 'loading' : error ? 'error' : 'success'

  useEffect(() => {
    if (type && currentConfig && apiData) {
      console.log(`${type} data loaded:`, apiData)
      
      // Mapper les données selon la configuration
      let dataArray: unknown[]
      
      if (currentConfig.dataKey === null) {
        // Les données sont déjà extraites dans le hook
        dataArray = Array.isArray(apiData) ? apiData : []
      } else {
        // Extraire les données de l'objet de réponse
        dataArray = (apiData as unknown as Record<string, unknown>)[currentConfig.dataKey] as unknown[]
        dataArray = Array.isArray(dataArray) ? dataArray : []
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedData = dataArray.map((item: unknown) => currentConfig.mapper(item as any))
      console.log(`${type} data mapped:`, mappedData)
      setData(mappedData)
    } else if (initData) {
      // Utiliser les données initiales si pas de type spécifique
      setData(initData)
    }
  }, [type, apiData, initData, currentConfig])
  
  console.log("isLoading", isLoading)
  console.log("titre", type)

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ code: '', libelle: '' })
    setShowForm(true)
  }

  const handleEdit = (item: SimpleItem) => {
    setEditingItem(item)
    setFormData({ 
      code: String(item.code || ''), 
      libelle: String(item.libelle || '') 
    })
    setShowForm(true)
  }

  const handleDelete = (item: SimpleItem) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${item.libelle} ?`)) {
      setData(data.filter(d => d.id !== item.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.code.trim() || !formData.libelle.trim()) {
      alert('Veuillez remplir tous les champs')
      return
    }

    if (editingItem) {
      // Modification
      setData(data.map(item => 
        item.id === editingItem.id 
          ? { ...item, code: formData.code, libelle: formData.libelle }
          : item
      ))
    } else {
      // Ajout
      const newItem: SimpleItem = {
        id: `item_${Date.now()}`,
        code: formData.code,
        libelle: formData.libelle
      }
      setData([...data, newItem])
    }
    
    setShowForm(false)
    setEditingItem(null)
    setFormData({ code: '', libelle: '' })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({ code: '', libelle: '' })
  }

  // Gestion de l'état de chargement et d'erreur
  if (type && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des {title.toLowerCase()}...</p>
        </div>
      </div>
    )
  }

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
        onEdit={handleEdit}
        onDelete={handleDelete}
        status={status}
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
                  border: '1px solid #000',
                  padding: '5px 15px',
                  borderRadius: '6px',
                }}
                variant="outline"
                onClick={handleCancel}
                className="px-6 h-10"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                style={{
                  border: '2px solid green',
                  padding: '5px 15px',
                  borderRadius: '6px',
                }}
                className="bg-green-600 hover:bg-green-700! px-8! h-10 hover:text-white!"
              >
                {editingItem ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
