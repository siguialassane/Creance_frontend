"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function NouveauActePage() {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [form, setForm] = React.useState<any>({
    codeCreance: "",
    debiteur: "",
    groupe: "",
    objet: "",
    capitalInitial: "",
    datePremiereEcheance: "",
    dateOctroi: "",
    duree: "",
    periodicite: "",
    montantDebloque: "",
    nbEcheances: "",
    dateFinEcheance: "",
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Nouvel acte (Gestion amiable)</h1>
          <p className="text-gray-600">Étape {step + 1} sur 3</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9 space-y-6">
            {step === 0 && (
              <div className="rounded-lg border bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Code créance</Label>
                  <Input value={form.codeCreance} onChange={(e) => setForm({ ...form, codeCreance: e.target.value })} placeholder="Saisir le code créance" />
                </div>
                <div>
                  <Label className="text-sm">Débiteur</Label>
                  <Input value={form.debiteur} onChange={(e) => setForm({ ...form, debiteur: e.target.value })} placeholder="Nom du débiteur" />
                </div>
                <div>
                  <Label className="text-sm">Groupe créance</Label>
                  <Input value={form.groupe} onChange={(e) => setForm({ ...form, groupe: e.target.value })} placeholder="Groupe" />
                </div>
                <div className="xl:col-span-2">
                  <Label className="text-sm">Objet</Label>
                  <Input value={form.objet} onChange={(e) => setForm({ ...form, objet: e.target.value })} placeholder="Objet" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="rounded-lg border bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Capital initial</Label>
                  <Input value={form.capitalInitial} onChange={(e) => setForm({ ...form, capitalInitial: e.target.value })} placeholder="Ex: 1000000" />
                </div>
                <div>
                  <Label className="text-sm">Date 1ère échéance</Label>
                  <Input type="date" value={form.datePremiereEcheance} onChange={(e) => setForm({ ...form, datePremiereEcheance: e.target.value })} />
                </div>
                <div>
                  <Label className="text-sm">Date d’octroi</Label>
                  <Input type="date" value={form.dateOctroi} onChange={(e) => setForm({ ...form, dateOctroi: e.target.value })} />
                </div>
                <div>
                  <Label className="text-sm">Durée</Label>
                  <Input value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })} placeholder="Ex: 12 mois" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-lg border bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Périodicité</Label>
                  <Input value={form.periodicite} onChange={(e) => setForm({ ...form, periodicite: e.target.value })} placeholder="Mensuelle / Trimestrielle" />
                </div>
                <div>
                  <Label className="text-sm">Montant débloqué</Label>
                  <Input value={form.montantDebloque} onChange={(e) => setForm({ ...form, montantDebloque: e.target.value })} placeholder="Ex: 250000" />
                </div>
                <div>
                  <Label className="text-sm">Nb Échéances</Label>
                  <Input value={form.nbEcheances} onChange={(e) => setForm({ ...form, nbEcheances: e.target.value })} placeholder="Ex: 10" />
                </div>
                <div>
                  <Label className="text-sm">Date fin échéance</Label>
                  <Input type="date" value={form.dateFinEcheance} onChange={(e) => setForm({ ...form, dateFinEcheance: e.target.value })} />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => router.push('/etude_creance/gestion_amiable')}>Annuler</Button>
              <div className="space-x-2">
                {step > 0 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>Précédent</Button>
                )}
                {step < 2 ? (
                  <Button onClick={() => setStep(step + 1)}>Suivant</Button>
                ) : (
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Enregistrer</Button>
                )}
              </div>
            </div>
          </div>

          {/* Colonne d'aide */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-lg border bg-white">
              <div className="px-4 py-3 border-b font-semibold text-emerald-700">Solde débiteur</div>
              <div className="p-4 space-y-3">
                <div>
                  <Label className="text-sm">DU</Label>
                  <Input type="date" />
                </div>
                <Button variant="outline" className="w-full">Auxiliaire de justice</Button>
                <Button variant="outline" className="w-full">Extrait de compte</Button>
                <Button variant="outline" className="w-full">Rechercher un débiteur</Button>
                <Button variant="outline" className="w-full">Rechercher n° de créance</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


