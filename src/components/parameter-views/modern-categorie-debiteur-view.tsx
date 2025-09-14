"use client"

import { useState } from 'react'
import ModernParameterPage from './modern-parameter-page'
import CategorieDebiteurForm from './categorie-debiteur-form'

interface CategorieDebiteur {
  id: number
  code: string
  libelle: string
}

// Données de test
const categoriesData: CategorieDebiteur[] = [
  { id: 1, code: "CAT001", libelle: "Particuliers" },
  { id: 2, code: "CAT002", libelle: "Professions Libérales" },
  { id: 3, code: "CAT003", libelle: "Commerçants" },
  { id: 4, code: "CAT004", libelle: "Moyennes Entreprises" },
  { id: 5, code: "CAT005", libelle: "Agriculteurs" },
  { id: 6, code: "CAT006", libelle: "PME" },
  { id: 7, code: "CAT007", libelle: "Grandes Entreprises" },
  { id: 8, code: "CAT008", libelle: "Sociétés Civiles" },
  { id: 9, code: "CAT009", libelle: "Associations" },
  { id: 10, code: "CAT010", libelle: "Coopératives" },
  { id: 11, code: "CAT011", libelle: "Fonctionnaires" },
  { id: 12, code: "CAT012", libelle: "Salariés Privés" },
  { id: 13, code: "CAT013", libelle: "Retraités" },
  { id: 14, code: "CAT014", libelle: "Étudiants" },
  { id: 15, code: "CAT015", libelle: "Chômeurs" }
]

const columns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'libelle', label: 'Libellé', sortable: true }
]

export default function ModernCategorieDebiteurView() {
  const [data, setData] = useState(categoriesData)
  const [showForm, setShowForm] = useState(false)
  const [editingCategorie, setEditingCategorie] = useState<CategorieDebiteur | null>(null)

  const handleAdd = () => {
    setEditingCategorie(null)
    setShowForm(true)
  }

  const handleEdit = (categorie: CategorieDebiteur) => {
    setEditingCategorie(categorie)
    setShowForm(true)
  }

  const handleDelete = (categorie: CategorieDebiteur) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${categorie.libelle} ?`)) {
      setData(data.filter(c => c.id !== categorie.id))
    }
  }

  const handleSubmit = (formData: any) => {
    if (editingCategorie) {
      // Modification
      setData(data.map(c => 
        c.id === editingCategorie.id 
          ? { ...c, ...formData }
          : c
      ))
    } else {
      // Ajout
      const newCategorie = {
        id: Math.max(...data.map(c => c.id)) + 1,
        ...formData
      }
      setData([...data, newCategorie])
    }
    setShowForm(false)
    setEditingCategorie(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCategorie(null)
  }

  return (
    <>
      <ModernParameterPage
        title="Catégories de Débiteurs"
        description="Gestion des catégories de débiteurs"
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchFields={['code', 'libelle']}
        primaryField="libelle"
      />

      {showForm && (
        <CategorieDebiteurForm
          categorieDebiteur={editingCategorie}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={!!editingCategorie}
        />
      )}
    </>
  )
}
