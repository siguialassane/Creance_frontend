"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ParameterPage } from './parameter-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { useBanques } from '@/hooks/useBanques'
import { Banque } from '@/types/banque'

interface ParameterViewProps {
  title: string
  description?: string
  initData?: Array<{ id: string; [key: string]: any }>
  type?: string
  columns?: Array<{
    key: string
    label: string
    sortable?: boolean
    render?: (value: any, item: any) => React.ReactNode
  }>
}

interface SimpleItem {
  id: string
  [key: string]: any
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
  type
}: ParameterViewProps) {
  console.log("initialData", initData)
  // Initialisation directe avec une fonction pour éviter les re-calculs
  const [data, setData] = useState<any[]>([])
  
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<SimpleItem | null>(null)
  const [formData, setFormData] = useState({ code: '', libelle: '' })

  const { mutateAsync: banquesMutation, error, status } = useBanques()
  const { status: authStatus } = useSession()

  useEffect(() => {
    if (type === "banque" && authStatus === 'authenticated') {
      banquesMutation().then((res) => {
        console.log("banquesss", res)
        setData(res.map((banque: Banque) => ({
          id: banque.BQ_CODE,
          code: banque.BQ_CODE,
          libelle: banque.BQ_LIB,
        })))
       })
    }
   
  }, [type, authStatus])
  console.log("status", status)
  console.log("titre", type)

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ code: '', libelle: '' })
    setShowForm(true)
  }

  const handleEdit = (item: SimpleItem) => {
    setEditingItem(item)
    setFormData({ code: item.code, libelle: item.libelle })
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
