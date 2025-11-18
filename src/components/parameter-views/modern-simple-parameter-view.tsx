"use client"

import { useState, useEffect } from 'react'
import ModernParameterPage from './modern-parameter-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface SimpleParameterViewProps {
  title: string
  description?: string
  data?: Array<{ id: string; code: string; libelle: string; [key: string]: any }>
}

interface SimpleItem {
  id: string
  code: string
  libelle: string
}

const columns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'libelle', label: 'Libellé', sortable: true }
]

export default function ModernSimpleParameterView({ 
  title, 
  description, 
  data: initialData = [] 
}: SimpleParameterViewProps) {
  const [data, setData] = useState<SimpleItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<SimpleItem | null>(null)
  const [formData, setFormData] = useState({ code: '', libelle: '' })

  // Données de démonstration si aucune donnée n'est fournie
  useEffect(() => {
    if (initialData.length === 0) {
      const demoData = [
        { id: 'demo_1', code: '001', libelle: 'Exemple 1' },
        { id: 'demo_2', code: '002', libelle: 'Exemple 2' },
        { id: 'demo_3', code: '003', libelle: 'Exemple 3' },
        { id: 'demo_4', code: '004', libelle: 'Exemple 4' },
        { id: 'demo_5', code: '005', libelle: 'Exemple 5' },
      ]
      setData(demoData)
    } else {
      setData(initialData as SimpleItem[])
    }
  }, [initialData])

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
      <ModernParameterPage
        title={title}
        description={description || `Gestion des ${title.toLowerCase()}`}
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchFields={['code', 'libelle']}
        primaryField="libelle"
      />

      {/* Formulaire modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingItem ? 'Modifier' : 'Ajouter'} {title.toLowerCase().slice(0, -1)}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Code *
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Saisir le code..."
                  required
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="libelle" className="text-sm font-medium text-gray-700">
                  Libellé *
                </Label>
                <Input
                  id="libelle"
                  type="text"
                  value={formData.libelle}
                  onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                  placeholder="Saisir le libellé..."
                  required
                  className="h-10"
                />
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-6"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 px-6"
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
