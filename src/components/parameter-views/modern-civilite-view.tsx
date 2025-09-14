"use client"

import { useState } from 'react'
import ModernParameterPage from './modern-parameter-page'
import CiviliteForm from './civilite-form'

interface Civilite {
  id: number
  code: string
  libelle: string
}

// Données de test
const civiliteData: Civilite[] = [
  { id: 1, code: "M", libelle: "Monsieur" },
  { id: 2, code: "MME", libelle: "Madame" },
  { id: 3, code: "MLLE", libelle: "Mademoiselle" },
  { id: 4, code: "DR", libelle: "Docteur" },
  { id: 5, code: "PR", libelle: "Professeur" },
  { id: 6, code: "ME", libelle: "Maître" }
]

const columns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'libelle', label: 'Libellé', sortable: true }
]

export default function ModernCiviliteView() {
  const [data, setData] = useState(civiliteData)
  const [showForm, setShowForm] = useState(false)
  const [editingCivilite, setEditingCivilite] = useState<Civilite | null>(null)

  const handleAdd = () => {
    setEditingCivilite(null)
    setShowForm(true)
  }

  const handleEdit = (civilite: Civilite) => {
    setEditingCivilite(civilite)
    setShowForm(true)
  }

  const handleDelete = (civilite: Civilite) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${civilite.libelle} ?`)) {
      setData(data.filter(c => c.id !== civilite.id))
    }
  }

  const handleSubmit = (formData: any) => {
    if (editingCivilite) {
      // Modification
      setData(data.map(c => 
        c.id === editingCivilite.id 
          ? { ...c, ...formData }
          : c
      ))
    } else {
      // Ajout
      const newCivilite = {
        id: Math.max(...data.map(c => c.id)) + 1,
        ...formData
      }
      setData([...data, newCivilite])
    }
    setShowForm(false)
    setEditingCivilite(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCivilite(null)
  }

  return (
    <>
      <ModernParameterPage
        title="Civilités"
        description="Gestion des titres de civilité"
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchFields={['code', 'libelle']}
        primaryField="libelle"
      />

      {showForm && (
        <CiviliteForm
          civilite={editingCivilite}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={!!editingCivilite}
        />
      )}
    </>
  )
}
