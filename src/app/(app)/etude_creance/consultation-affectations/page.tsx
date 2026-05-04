"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SimplePagination } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { useApiClient } from "@/hooks/useApiClient"
import { CreanceService } from "@/services/creance.service"
import type {
  EtudeCreanceAffectationConsultationByCreanceResponse,
  EtudeCreanceAffectationConsultationByGestionnaireResponse,
  EtudeCreanceAffectationConsultationContext,
  EtudeCreanceAffectationConsultationRow,
  EtudeCreanceAffectationGestionnaireOption,
} from "@/types/creance"
import { DisplayBox, formatDate, formatText } from "@/components/suivie-clientel/ovp-ui"

type ConsultationMode = "creance" | "gestionnaire"
type GestionnaireStatusFilter = "all" | "active" | "closed"

const GESTIONNAIRE_PAGE_SIZE = 15

type GestionnaireItem = {
  value: string
  label: string
  GEST_CODE?: string
  GEST_NOM?: string
  GEST_PRENOM?: string
  GEST_POSTE?: string
  STAT_CODE?: string
  STATUT_LIB?: string
  ENTITE_CODE?: string
}

function normalizeGestionnaires(options?: EtudeCreanceAffectationGestionnaireOption[]): GestionnaireItem[] {
  return (options || [])
    .map((option) => ({
      ...option,
      value: String(option.CODE ?? option.GEST_CODE ?? "").trim(),
      label: String(option.LIBELLE ?? option.GEST_CODE ?? ""),
    }))
    .filter((option) => option.value)
}

function resolveGestionnaireSelection(items: GestionnaireItem[], rawCode: string): {
  match: GestionnaireItem | null
  isAmbiguous: boolean
} {
  const trimmedCode = rawCode.trim()
  if (!trimmedCode) {
    return { match: null, isAmbiguous: false }
  }

  const exactMatch = items.find((item) => item.value.trim() === trimmedCode)
  if (exactMatch) {
    return { match: exactMatch, isAmbiguous: false }
  }

  const caseInsensitiveMatches = items.filter((item) => item.value.trim().toLowerCase() === trimmedCode.toLowerCase())
  if (caseInsensitiveMatches.length === 1) {
    return { match: caseInsensitiveMatches[0], isAmbiguous: false }
  }

  return { match: null, isAmbiguous: caseInsensitiveMatches.length > 1 }
}

function buildGestionnaireFullName(gestionnaire: GestionnaireItem | null): string {
  if (!gestionnaire) {
    return "-"
  }

  const fullName = `${gestionnaire.GEST_NOM || ""} ${gestionnaire.GEST_PRENOM || ""}`.trim()
  return fullName || "-"
}

function SectionCard({ title, children, className = "", actions }: { title: string; children: React.ReactNode; className?: string; actions?: React.ReactNode }) {
  return (
    <Card className={["border-slate-300 bg-white shadow-sm", className].join(" ").trim()}>
      <CardHeader className="border-b border-slate-200 pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-[15px] font-semibold text-slate-900">{title}</CardTitle>
          {actions}
        </div>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}

function FieldLine({ label, children, labelClassName = "w-[118px]" }: { label: string; children: React.ReactNode; labelClassName?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className={cn("shrink-0 text-[14px] font-semibold text-slate-800", labelClassName)}>{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function ReadonlyField({ label, value, labelClassName, valueClassName }: { label: string; value: string; labelClassName?: string; valueClassName?: string }) {
  return (
    <FieldLine label={label} labelClassName={labelClassName}>
      <DisplayBox value={value} className="h-9" valueClassName={valueClassName} />
    </FieldLine>
  )
}

function AffectationEtatBadge({ value }: { value: string }) {
  const normalized = value.trim().toLowerCase()
  const tone = normalized === "en cours"
    ? "text-[#2450d6]"
    : "text-slate-700"

  return <DisplayBox value={value || "-"} className="h-9 min-w-[110px] bg-white" valueClassName={`font-bold ${tone}`} />
}

function ConsultationTable({
  items,
  mode,
  onOpenDetail,
}: {
  items: EtudeCreanceAffectationConsultationRow[]
  mode: ConsultationMode
  onOpenDetail: (creanCode: string) => void
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        Aucun résultat trouvé pour ce filtre.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-300">
      <table className="min-w-[1280px] border-collapse bg-white text-[13px] text-slate-800">
        <thead className="bg-slate-50">
          <tr>
            <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">N°</th>
            {mode === "gestionnaire" && <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Créance</th>}
            <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Date début</th>
            <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Date fin</th>
            {mode === "creance" && <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#d92d20]">Gestionnaire</th>}
            {mode === "creance" && <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Poste</th>}
            <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Groupe Créance</th>
            <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Débiteur</th>
            <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Statut dossier</th>
            <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#d92d20]">Etat</th>
            <th className="border-b px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Détail</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.AFFECT_NO || item.CREAN_CODE || "row"}-${index}`} className={item.IS_ACTIVE ? "bg-emerald-50/40" : "bg-white"}>
              <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                <DisplayBox value={formatText(item.AFFECT_NO)} className="h-9 min-w-[72px]" valueClassName="tabular-nums" />
              </td>
              {mode === "gestionnaire" && (
                <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                  <DisplayBox value={formatText(item.CREAN_CODE)} className="h-9 min-w-[140px]" valueClassName="font-semibold text-slate-900" />
                </td>
              )}
              <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                <DisplayBox value={formatDate(item.AFFECT_DATEDEB)} className="h-9 min-w-[118px]" />
              </td>
              <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                <DisplayBox value={formatDate(item.AFFECT_DATEFIN)} className="h-9 min-w-[118px]" />
              </td>
              {mode === "creance" && (
                <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                  <div className="grid min-w-[320px] grid-cols-[110px_minmax(0,1fr)] gap-1.5">
                    <DisplayBox value={formatText(item.GEST_CODE)} className="h-9" valueClassName="tabular-nums font-semibold text-slate-900" />
                    <DisplayBox value={formatText(item.GESTIONNAIRE_LIB)} className="h-9" valueClassName="font-semibold text-slate-900" />
                  </div>
                </td>
              )}
              {mode === "creance" && (
                <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                  <DisplayBox value={formatText(item.GEST_POSTE)} className="h-9 min-w-[120px]" />
                </td>
              )}
              <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                <div className="grid min-w-[250px] grid-cols-[72px_minmax(0,1fr)] gap-1.5">
                  <DisplayBox value={formatText(item.GRP_CREAN_CODE)} className="h-9" valueClassName="tabular-nums" />
                  <DisplayBox value={formatText(item.GROUPE_CREANCE_LIB)} className="h-9" />
                </div>
              </td>
              <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                <DisplayBox value={formatText(item.DEBITEUR_NOM)} className="h-9 min-w-[280px]" />
              </td>
              <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                <div className="grid min-w-[190px] grid-cols-[80px_minmax(0,1fr)] gap-1.5">
                  <DisplayBox value={formatText(item.STAT_CODE)} className="h-9" valueClassName="tabular-nums" />
                  <DisplayBox value={formatText(item.STATUT_LIB)} className="h-9" />
                </div>
              </td>
              <td className="border-t border-slate-200 px-2 py-1.5 align-top">
                <AffectationEtatBadge value={formatText(item.AFFECTATION_ETAT)} />
              </td>
              <td className="border-t border-slate-200 px-2 py-1.5 align-top">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300"
                  onClick={() => onOpenDetail(String(item.CREAN_CODE || "").trim())}
                  disabled={!String(item.CREAN_CODE || "").trim()}
                >
                  Détail
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ConsultationAffectationsPage() {
  const apiClient = useApiClient()
  const router = useRouter()
  const [mode, setMode] = useState<ConsultationMode>("creance")
  const [context, setContext] = useState<EtudeCreanceAffectationConsultationContext | null>(null)
  const [loadingContext, setLoadingContext] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creanCode, setCreanCode] = useState("")
  const [gestCode, setGestCode] = useState("")
  const [gestionnaireStatusFilter, setGestionnaireStatusFilter] = useState<GestionnaireStatusFilter>("all")
  const [gestionnairePage, setGestionnairePage] = useState(0)
  const [showGestionnaireDialog, setShowGestionnaireDialog] = useState(false)
  const [gestionnaireSearch, setGestionnaireSearch] = useState("")
  const [creanceResult, setCreanceResult] = useState<EtudeCreanceAffectationConsultationByCreanceResponse | null>(null)
  const [gestionnaireResult, setGestionnaireResult] = useState<EtudeCreanceAffectationConsultationByGestionnaireResponse | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadContext = async () => {
      setLoadingContext(true)
      try {
        const response = await CreanceService.getEtudeCreanceAffectationConsultationContext(apiClient)
        if (!cancelled) {
          setContext(response)
        }
      } catch (err) {
        if (!cancelled) {
          const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
            || (err as Error).message
            || "Impossible de charger le contexte de consultation des affectations."
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoadingContext(false)
        }
      }
    }

    void loadContext()
    return () => {
      cancelled = true
    }
  }, [apiClient])

  const gestionnaireItems = useMemo(
    () => normalizeGestionnaires(context?.affectationOptions?.gestionnaires),
    [context?.affectationOptions?.gestionnaires]
  )

  const selectedGestionnaire = useMemo(
    () => resolveGestionnaireSelection(gestionnaireItems, gestCode).match,
    [gestCode, gestionnaireItems]
  )

  const filteredGestionnaires = useMemo(() => {
    const search = gestionnaireSearch.trim().toLowerCase()
    if (!search) {
      return gestionnaireItems
    }

    return gestionnaireItems.filter((item) => {
      const fullName = `${item.GEST_NOM || ""} ${item.GEST_PRENOM || ""}`.trim().toLowerCase()
      return item.value.toLowerCase().includes(search)
        || item.label.toLowerCase().includes(search)
        || fullName.includes(search)
    })
  }, [gestionnaireItems, gestionnaireSearch])

  const gestionnaireAllItems = useMemo(() => gestionnaireResult?.items ?? [], [gestionnaireResult])

  const isActiveAffectation = (item: EtudeCreanceAffectationConsultationRow) => {
    if (typeof item.IS_ACTIVE === "boolean") {
      return item.IS_ACTIVE
    }

    if (typeof item.IS_ACTIVE === "number") {
      return item.IS_ACTIVE === 1
    }

    return String(item.AFFECTATION_ETAT || "").trim().toLowerCase() === "en cours"
  }

  const filteredGestionnaireItems = useMemo(() => {
    if (gestionnaireStatusFilter === "active") {
      return gestionnaireAllItems.filter((item) => isActiveAffectation(item))
    }

    if (gestionnaireStatusFilter === "closed") {
      return gestionnaireAllItems.filter((item) => !isActiveAffectation(item))
    }

    return gestionnaireAllItems
  }, [gestionnaireAllItems, gestionnaireStatusFilter])

  const gestionnaireTotalPages = Math.max(1, Math.ceil(filteredGestionnaireItems.length / GESTIONNAIRE_PAGE_SIZE))

  const paginatedGestionnaireItems = useMemo(() => {
    const start = gestionnairePage * GESTIONNAIRE_PAGE_SIZE
    return filteredGestionnaireItems.slice(start, start + GESTIONNAIRE_PAGE_SIZE)
  }, [filteredGestionnaireItems, gestionnairePage])

  useEffect(() => {
    setGestionnairePage(0)
  }, [gestionnaireStatusFilter, gestionnaireResult, mode])

  const currentCreanceAffectation = creanceResult?.currentAffectation || null
  const currentItems = mode === "creance" ? (creanceResult?.items || []) : paginatedGestionnaireItems
  const totalCount = mode === "creance" ? (creanceResult?.totalCount || 0) : filteredGestionnaireItems.length
  const activeCount = mode === "creance" ? (creanceResult?.activeCount || 0) : gestionnaireAllItems.filter((item) => isActiveAffectation(item)).length

  const handleCreanceSearch = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const normalizedCode = creanCode.trim().toUpperCase()
    if (!normalizedCode) {
      setError("Veuillez saisir un code créance.")
      setCreanceResult(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await CreanceService.getEtudeCreanceAffectationConsultationByCreance(apiClient, normalizedCode)
      setCreanceResult(response)
      setCreanCode(normalizedCode)
      toast.success("Historique d'affectation chargé")
    } catch (err) {
      const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || "Impossible de consulter les affectations de cette créance."
      setError(message)
      setCreanceResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGestionnaireSearch = async () => {
    const typedCode = gestCode.trim()
    if (!typedCode) {
      setError("Veuillez sélectionner un gestionnaire.")
      setGestionnaireResult(null)
      return
    }

    const { match, isAmbiguous } = resolveGestionnaireSelection(gestionnaireItems, typedCode)
    if (isAmbiguous) {
      setGestionnaireSearch(typedCode)
      setShowGestionnaireDialog(true)
      setError("Plusieurs gestionnaires correspondent à ce code. Utilisez la liste pour choisir la bonne ligne.")
      setGestionnaireResult(null)
      return
    }

    if (!match) {
      setError("Le gestionnaire saisi est introuvable dans la liste.")
      setGestionnaireResult(null)
      return
    }

    const normalizedCode = match.value

    setLoading(true)
    setError(null)
    try {
      const response = await CreanceService.getEtudeCreanceAffectationConsultationByGestionnaire(apiClient, normalizedCode, false)
      setGestionnaireResult(response)
      setGestCode(normalizedCode)
      toast.success("Consultation du gestionnaire chargée")
    } catch (err) {
      const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || "Impossible de consulter les affectations de ce gestionnaire."
      setError(message)
      setGestionnaireResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGestionnaireCodeBlur = () => {
    const normalizedCode = gestCode.trim()
    if (!normalizedCode) {
      setGestCode("")
      setError(null)
      return
    }

    const { match, isAmbiguous } = resolveGestionnaireSelection(gestionnaireItems, normalizedCode)
    if (match) {
      setGestCode(match.value)
      setError(null)
      return
    }

    if (isAmbiguous) {
      setGestionnaireSearch(normalizedCode)
      setShowGestionnaireDialog(true)
      setError("Plusieurs gestionnaires correspondent à ce code. Utilisez la liste pour choisir la bonne ligne.")
      return
    }

    setError("Le gestionnaire saisi est introuvable dans la liste.")
  }

  const handleSelectGestionnaire = (item: GestionnaireItem) => {
    setGestCode(item.value)
    setShowGestionnaireDialog(false)
    setGestionnaireSearch("")
    setError(null)
  }

  const handleOpenCreanceDetail = (creanCode: string) => {
    const normalizedCode = creanCode.trim().toUpperCase()
    if (!normalizedCode) {
      return
    }

    router.push(`/etude_creance/affectation?creanCode=${encodeURIComponent(normalizedCode)}`)
  }

  return (
    <div className="mx-auto flex max-w-[1580px] flex-col gap-4 px-6 py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900">Consultation des affectations</h1>
        <p className="text-sm text-slate-600">Consulter l&apos;historique des affectations par créance ou par gestionnaire.</p>
      </div>

      <SectionCard
        title="Mode de consultation"
        actions={(
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={mode === "creance" ? "default" : "outline"}
              className={mode === "creance" ? "bg-[#1f6f3f] text-white hover:bg-[#195b34]" : "border-slate-300"}
              onClick={() => setMode("creance")}
            >
              Par créance
            </Button>
            <Button
              type="button"
              variant={mode === "gestionnaire" ? "default" : "outline"}
              className={mode === "gestionnaire" ? "bg-[#1f6f3f] text-white hover:bg-[#195b34]" : "border-slate-300"}
              onClick={() => setMode("gestionnaire")}
            >
              Par gestionnaire
            </Button>
          </div>
        )}
      >
        {mode === "creance" ? (
          <form className="grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]" onSubmit={handleCreanceSearch}>
            <FieldLine label="Créance" labelClassName="w-[72px]">
              <div className="grid grid-cols-[minmax(0,1fr)_44px] gap-2">
                <Input
                  value={creanCode}
                  onChange={(event) => {
                    setCreanCode(event.target.value.toUpperCase())
                    setError(null)
                  }}
                  placeholder="Saisir le code créance"
                  className="h-9 border-[#9fd89c] bg-white uppercase"
                  disabled={loadingContext || loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#1f6f3f] text-white hover:bg-[#195b34]"
                  disabled={loadingContext || loading}
                  aria-label="Consulter la créance"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </FieldLine>

            <div className="grid gap-3 md:grid-cols-2">
              <ReadonlyField label="Affectations" value={String(totalCount || 0)} labelClassName="w-[92px]" valueClassName="tabular-nums font-semibold text-slate-900" />
              <ReadonlyField label="En cours" value={String(activeCount || 0)} labelClassName="w-[72px]" valueClassName="tabular-nums font-semibold text-[#2450d6]" />
            </div>
          </form>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_360px]">
            <SectionCard title="Gestionnaire" className="shadow-none">
              <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_220px_140px]">
                <FieldLine label="Code" labelClassName="w-[62px]">
                  <div className="grid grid-cols-[minmax(0,1fr)_44px] gap-2">
                    <Input
                      value={gestCode}
                      onChange={(event) => {
                        setGestCode(event.target.value)
                        setError(null)
                      }}
                      onBlur={handleGestionnaireCodeBlur}
                      placeholder="Code gestionnaire"
                      className="h-9 border-[#9fd89c] bg-white"
                      disabled={loadingContext || loading}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="border-slate-300"
                      onClick={() => setShowGestionnaireDialog(true)}
                      disabled={loadingContext || loading}
                      aria-label="Choisir un gestionnaire"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </FieldLine>

                <ReadonlyField label="Nom" value={buildGestionnaireFullName(selectedGestionnaire)} labelClassName="w-[56px]" />
                <ReadonlyField label="Poste" value={formatText(selectedGestionnaire?.GEST_POSTE)} labelClassName="w-[52px]" />
                <Button
                  type="button"
                  className="bg-[#1f6f3f] text-white hover:bg-[#195b34]"
                  onClick={handleGestionnaireSearch}
                  disabled={loadingContext || loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Consulter
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Filtre">
              <div className="space-y-3">
                <FieldLine label="Vue" labelClassName="w-[48px]">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={gestionnaireStatusFilter === "all" ? "default" : "outline"}
                      className={gestionnaireStatusFilter === "all" ? "bg-[#1f6f3f] text-white hover:bg-[#195b34]" : "border-slate-300"}
                      onClick={() => setGestionnaireStatusFilter("all")}
                    >
                      Toutes
                    </Button>
                    <Button
                      type="button"
                      variant={gestionnaireStatusFilter === "active" ? "default" : "outline"}
                      className={gestionnaireStatusFilter === "active" ? "bg-[#1f6f3f] text-white hover:bg-[#195b34]" : "border-slate-300"}
                      onClick={() => setGestionnaireStatusFilter("active")}
                    >
                      En cours
                    </Button>
                    <Button
                      type="button"
                      variant={gestionnaireStatusFilter === "closed" ? "default" : "outline"}
                      className={gestionnaireStatusFilter === "closed" ? "bg-[#1f6f3f] text-white hover:bg-[#195b34]" : "border-slate-300"}
                      onClick={() => setGestionnaireStatusFilter("closed")}
                    >
                      Clôturé
                    </Button>
                  </div>
                </FieldLine>

                <ReadonlyField label="Total" value={String(totalCount || 0)} labelClassName="w-[48px]" valueClassName="tabular-nums font-semibold text-slate-900" />
                <ReadonlyField label="Actives" value={String(activeCount || 0)} labelClassName="w-[58px]" valueClassName="tabular-nums font-semibold text-[#2450d6]" />
              </div>
            </SectionCard>
          </div>
        )}
      </SectionCard>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {mode === "creance" && currentCreanceAffectation && (
        <SectionCard
          title="Affectation en cours"
          actions={(
            <Button
              type="button"
              variant="outline"
              className="border-slate-300"
              onClick={() => handleOpenCreanceDetail(creanCode)}
              disabled={!creanCode.trim()}
            >
              Détail créance
            </Button>
          )}
        >
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_220px_220px_180px]">
            <ReadonlyField label="Gestionnaire" value={formatText(currentCreanceAffectation.GESTIONNAIRE_LIB)} labelClassName="w-[92px] text-[#d92d20] font-black" valueClassName="font-semibold text-slate-900" />
            <ReadonlyField label="Code" value={formatText(currentCreanceAffectation.GEST_CODE)} labelClassName="w-[48px]" valueClassName="tabular-nums font-semibold text-slate-900" />
            <ReadonlyField label="Date début" value={formatDate(currentCreanceAffectation.AFFECT_DATEDEB)} labelClassName="w-[78px]" />
            <ReadonlyField label="Statut" value={formatText(currentCreanceAffectation.STATUT_LIB)} labelClassName="w-[56px]" />
          </div>
        </SectionCard>
      )}

      <SectionCard title={mode === "creance" ? "Historique des gestionnaires" : "Créances affectées au gestionnaire"}>
        <ConsultationTable items={currentItems} mode={mode} onOpenDetail={handleOpenCreanceDetail} />
        {mode === "gestionnaire" && filteredGestionnaireItems.length > GESTIONNAIRE_PAGE_SIZE && (
          <SimplePagination
            currentPage={gestionnairePage}
            totalPages={gestionnaireTotalPages}
            onPageChange={setGestionnairePage}
            className="pt-4"
          />
        )}
      </SectionCard>

      <Dialog open={showGestionnaireDialog} onOpenChange={setShowGestionnaireDialog}>
        <DialogContent className="w-[min(96vw,1180px)] !max-w-[1180px] border border-slate-300 bg-white !p-7">
          <DialogHeader className="gap-3 pr-10">
            <DialogTitle className="text-lg font-semibold text-slate-900">Sélection du gestionnaire</DialogTitle>
            <DialogDescription className="text-slate-600">
              Choisir le gestionnaire à consulter puis afficher ses créances affectées.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={gestionnaireSearch}
                onChange={(event) => setGestionnaireSearch(event.target.value)}
                placeholder="Rechercher un gestionnaire par code ou nom"
                className="h-10 border-slate-300 pl-10"
              />
            </div>

            <div className="max-h-[560px] overflow-auto rounded-lg border border-slate-200">
              <div className="min-w-[980px]">
                <div className="sticky top-0 grid grid-cols-[140px_minmax(0,1.05fr)_minmax(0,1.05fr)_120px_220px] gap-4 bg-slate-50 px-4 py-3 text-[15px] font-semibold text-slate-700">
                  <span>Code</span>
                  <span>Nom</span>
                  <span>Prénom(s)</span>
                  <span>Poste</span>
                  <span>Statut</span>
                </div>
                {filteredGestionnaires.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">Aucun gestionnaire trouvé.</div>
                ) : (
                  filteredGestionnaires.map((item, index) => (
                    <button
                      key={`${item.value}-${item.STAT_CODE || "-"}-${index}`}
                      type="button"
                      className="grid w-full grid-cols-[140px_minmax(0,1.05fr)_minmax(0,1.05fr)_120px_220px] gap-4 border-t border-slate-200 px-4 py-3 text-left text-[15px] leading-5 hover:bg-[#eef7ee]"
                      onClick={() => handleSelectGestionnaire(item)}
                    >
                      <span className="font-semibold text-slate-900">{item.value}</span>
                      <span className="truncate text-slate-700">{item.GEST_NOM || "-"}</span>
                      <span className="truncate text-slate-700">{item.GEST_PRENOM || "-"}</span>
                      <span className="truncate text-slate-700">{item.GEST_POSTE || "-"}</span>
                      <span className="truncate text-slate-600">{item.STATUT_LIB || "-"}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}