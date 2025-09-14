"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icon } from "@iconify/react/dist/iconify.js"

type Acte = {
  id: number
  code: string
  type: string
  debiteur: string
  numeroCreance: string
  dateCreation: string
  dateSignature?: string
  dateNotification?: string
  dateReaction?: string
}

const columns: ColumnDef<Acte>[] = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "code", header: "Code de l'acte" },
  { accessorKey: "type", header: "Type de l'acte" },
  { accessorKey: "debiteur", header: "Nom du débiteur" },
  { accessorKey: "numeroCreance", header: "Numéro de créance" },
  { accessorKey: "dateCreation", header: "Date de création" },
  { accessorKey: "dateSignature", header: "Date de signature" },
  { accessorKey: "dateNotification", header: "Date de notification" },
  { accessorKey: "dateReaction", header: "Date de réaction" },
]

const seed: Acte[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  code: String(244200 + i),
  type: ["AVIS A TIERS DETENTEUR", "COMMANDEMENT DE PAYER"][i % 2],
  debiteur: ["PCRTÉPXC MLSVBRD LMXHMX", "MXLBT DBH"][i % 2],
  numeroCreance: "51",
  dateCreation: "2025-08-09T12:31:50",
  dateSignature: i % 3 === 0 ? "2025-08-12" : undefined,
  dateNotification: i % 4 === 0 ? "2025-08-14" : undefined,
  dateReaction: i % 5 === 0 ? "2025-08-20" : undefined,
}))

export default function GestionAmiablePage() {
  const [data, setData] = React.useState<Acte[]>(seed)
  const router = useRouter()

  // Filtres avancés
  const [type, setType] = React.useState<string>("")
  const [debiteur, setDebiteur] = React.useState<string>("")
  const [code, setCode] = React.useState<string>("")
  const [dateDebut, setDateDebut] = React.useState<string>("")
  const [dateFin, setDateFin] = React.useState<string>("")

  const filtered = React.useMemo(() => {
    return data.filter((a) => {
      const okType = type ? a.type.toLowerCase().includes(type.toLowerCase()) : true
      const okDebiteur = debiteur ? a.debiteur.toLowerCase().includes(debiteur.toLowerCase()) : true
      const okCode = code ? a.code.toLowerCase().includes(code.toLowerCase()) : true
      const okDate = (() => {
        if (!dateDebut && !dateFin) return true
        const t = new Date(a.dateCreation).getTime()
        const min = dateDebut ? new Date(dateDebut).getTime() : -Infinity
        const max = dateFin ? new Date(dateFin).getTime() : Infinity
        return t >= min && t <= max
      })()
      return okType && okDebiteur && okCode && okDate
    })
  }, [data, type, debiteur, code, dateDebut, dateFin])

  // Stats
  const stats = React.useMemo(() => {
    const total = filtered.length
    const signes = filtered.filter(a => !!a.dateSignature).length
    const notifies = filtered.filter(a => !!a.dateNotification).length
    const enRetard = filtered.filter(a => !a.dateReaction && !!a.dateNotification).length
    return { total, signes, notifies, enRetard }
  }, [filtered])

  return (
    <div className="h-full flex flex-col bg-white">
      <DataTable
        title="Gestion amiable des actes"
        description="Programme de saisie d’un acte amiable"
        columns={columns}
        data={filtered}
        onAdd={() => router.push("/etude_creance/gestion_amiable/nouveau")}
        addButtonText="Ajouter"
        searchPlaceholder="Rechercher un acte..."
        statsSlot={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div style={{ border: '1px solid #000', padding: '5px 15px', borderRadius: '6px' }} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">Total actes</div>
              <div className="text-2xl font-semibold">{stats.total}</div>
            </div>
            <div style={{ border: '1px solid #000', padding: '5px 15px', borderRadius: '6px' }} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">Signés</div>
              <div className="text-2xl font-semibold text-emerald-700">{stats.signes}</div>
            </div>
            <div style={{ border: '1px solid #000', padding: '5px 15px', borderRadius: '6px' }} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">Notifiés</div>
              <div className="text-2xl font-semibold text-amber-600">{stats.notifies}</div>
            </div>
            <div style={{ border: '1px solid #000', padding: '5px 15px', borderRadius: '6px' }} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">En retard</div>
              <div className="text-2xl font-semibold text-red-600">{stats.enRetard}</div>
            </div>
          </div>
        }
        extraActionsSlot={
          <Sheet>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-2" style={{ border: '1px solid #000', padding: '5px 15px', borderRadius: '6px' }} variant="outline">
                <Icon icon={"mdi:filter"} width={20} height={20} />
                Filtres</Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[420px] sm:w-[520px]"
              style={{
                padding: 0,
                background: '#ffffff',
                borderLeft: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                background: 'linear-gradient(90deg, #ecfdf5 0%, #ffffff 100%)'
              }}>
                <SheetHeader>
                  <SheetTitle style={{ fontSize: 18, fontWeight: 700, color: '#065f46' }}>Filtres avancés</SheetTitle>
                </SheetHeader>
              </div>
              <div 
                className="space-y-4"
                style={{ padding: 20 }}
              >
                <div>
                  <Label className="text-sm" style={{ color: '#111827', fontWeight: 600 }}>Type</Label>
                  <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type d'acte" 
                    style={{ border: '1px solid #e5e7eb', height: 40 }}
                  />
                </div>
                <div>
                  <Label className="text-sm" style={{ color: '#111827', fontWeight: 600 }}>Débiteur</Label>
                  <Input value={debiteur} onChange={(e) => setDebiteur(e.target.value)} placeholder="Nom du débiteur" 
                    style={{ border: '1px solid #e5e7eb', height: 40 }}
                  />
                </div>
                <div>
                  <Label className="text-sm" style={{ color: '#111827', fontWeight: 600 }}>Code</Label>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code acte" 
                    style={{ border: '1px solid #e5e7eb', height: 40 }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm" style={{ color: '#111827', fontWeight: 600 }}>Du</Label>
                    <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} 
                      style={{ border: '1px solid #e5e7eb', height: 40 }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm" style={{ color: '#111827', fontWeight: 600 }}>Au</Label>
                    <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} 
                      style={{ border: '1px solid #e5e7eb', height: 40 }}
                    />
                  </div>
                </div>
                <div className="flex gap-2" style={{ marginTop: 8 }}>
                  <Button 
                    variant="outline" 
                    onClick={() => { setType(""); setDebiteur(""); setCode(""); setDateDebut(""); setDateFin("") }}
                    style={{ height: 40 }}
                  >
                    Réinitialiser
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700" 
                    style={{ height: 40, color: '#fff' }}
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        }
      />
    </div>
  )
}


