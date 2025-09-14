"use client"

import { useState } from 'react'
import ModernParameterPage from './modern-parameter-page'
import BanqueForm from './banque-form'

interface Banque {
  id: number
  code: string
  libelle: string
  responsable: string
  adresse: string
}

// Données de test
const banquesData: Banque[] = [
  { id: 1, code: "B001", libelle: "Banque Atlantique", responsable: "M. Koné", adresse: "Abidjan, Plateau" },
  { id: 2, code: "B002", libelle: "Société Générale", responsable: "Mme Traoré", adresse: "Abidjan, Cocody" },
  { id: 3, code: "B003", libelle: "BNI", responsable: "M. Ouattara", adresse: "Abidjan, Marcory" },
  { id: 4, code: "B004", libelle: "SIB", responsable: "Mme Diallo", adresse: "Abidjan, Treichville" },
  { id: 5, code: "B005", libelle: "Ecobank", responsable: "M. Coulibaly", adresse: "Abidjan, Deux Plateaux" },
  { id: 6, code: "B006", libelle: "NSIA", responsable: "Mme Bamba", adresse: "Abidjan, Angré" },
  { id: 7, code: "B007", libelle: "BACI", responsable: "M. Yao", adresse: "Abidjan, Riviera" },
  { id: 8, code: "B008", libelle: "SGBCI", responsable: "Mme Kouassi", adresse: "Abidjan, Yopougon" },
  { id: 9, code: "B009", libelle: "BICICI", responsable: "M. N'Guessan", adresse: "Abidjan, Adjame" },
  { id: 10, code: "B010", libelle: "Citi Bank", responsable: "Mme Konan", adresse: "Abidjan, Plateau" }
]

const columns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'libelle', label: 'Libellé', sortable: true },
  { key: 'responsable', label: 'Responsable', sortable: true },
  { key: 'adresse', label: 'Adresse', sortable: false }
]

export default function ModernBanqueView() {
  const [data, setData] = useState(banquesData)
  const [showForm, setShowForm] = useState(false)
  const [editingBanque, setEditingBanque] = useState<Banque | null>(null)

  const handleAdd = () => {
    setEditingBanque(null)
    setShowForm(true)
  }

  const handleEdit = (banque: Banque) => {
    setEditingBanque(banque)
    setShowForm(true)
  }

  const handleDelete = (banque: Banque) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${banque.libelle} ?`)) {
      setData(data.filter(b => b.id !== banque.id))
    }
  }

  const handleSubmit = (formData: any) => {
    if (editingBanque) {
      // Modification
      setData(data.map(b => 
        b.id === editingBanque.id 
          ? { ...b, ...formData }
          : b
      ))
    } else {
      // Ajout
      const newBanque = {
        id: Math.max(...data.map(b => b.id)) + 1,
        ...formData
      }
      setData([...data, newBanque])
    }
    setShowForm(false)
    setEditingBanque(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingBanque(null)
  }

  return (
    <>
      <ModernParameterPage
        title="Banques"
        description="Gestion des établissements bancaires"
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchFields={['code', 'libelle', 'responsable', 'adresse']}
        primaryField="libelle"
      />

      {showForm && (
        <BanqueForm
          banque={editingBanque}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={!!editingBanque}
        />
      )}
    </>
  )
}
