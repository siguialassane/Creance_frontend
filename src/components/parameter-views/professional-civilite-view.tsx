"use client"

import { useState } from 'react'
import { ParameterPage } from './parameter-page'
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
  {
    key: 'code' as keyof Civilite,
    label: 'Code',
    sortable: true,
  },
  {
    key: 'libelle' as keyof Civilite,
    label: 'Libellé',
    sortable: true,
  }
]

export default function ProfessionalCiviliteView() {
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
      <ParameterPage
        title="Civilités"
        description="Gestion des titres de civilité utilisés dans l'application"
        data={data}
        columns={columns}
        searchKey="libelle"
        searchPlaceholder="Rechercher une civilité..."
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonText="Nouvelle civilité"
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
