"use client"

import { FormEvent, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useApiClient } from "@/hooks/useApiClient"
import { CreanceService } from "@/services/creance.service"
import type { EtudeCreanceAffectationGestionnaireOption, EtudeCreanceAffectationResponse } from "@/types/creance"
import {
  DisplayBox,
  formatAmount,
  formatCodeAndLabel,
  formatDate,
  formatText,
} from "@/components/suivie-clientel/ovp-ui"

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

type DisplayData = {
  numero: string
  codeCreance: string
  debiteurCode: string
  debiteurNom: string
  groupeCreance: string
  objetCreance: string
  capitalInitial: string
  montantDebloque: string
  dateDebutEch: string
  dateFinEch: string
  dateOctroi: string
  periodiciteCode: string
  periodiciteLib: string
  nbEch: string
  duree: string
  gestionnaireActuelNom: string
  nouveauGestCode: string
  nouveauGestNom: string
  nouveauGestPrenom: string
  nouveauGestPoste: string
  dateAffectation: string
  statutCode: string
  statutLib: string
}

function normalizeGestionnaires(options?: EtudeCreanceAffectationGestionnaireOption[]): GestionnaireItem[] {
  return (options || [])
    .map((option) => ({
      ...option,
      value: String(option.CODE ?? option.GEST_CODE ?? ""),
      label: String(option.LIBELLE ?? option.GEST_CODE ?? ""),
    }))
    .filter((option) => option.value)
}

function buildEmptyDisplayData(): DisplayData {
  return {
    numero: "-",
    codeCreance: "-",
    debiteurCode: "-",
    debiteurNom: "-",
    groupeCreance: "-",
    objetCreance: "-",
    capitalInitial: "-",
    montantDebloque: "-",
    dateDebutEch: "-",
    dateFinEch: "-",
    dateOctroi: "-",
    periodiciteCode: "-",
    periodiciteLib: "-",
    nbEch: "-",
    duree: "-",
    gestionnaireActuelNom: "-",
    nouveauGestCode: "-",
    nouveauGestNom: "-",
    nouveauGestPrenom: "-",
    nouveauGestPoste: "-",
    dateAffectation: "-",
    statutCode: "-",
    statutLib: "-",
  }
}

function SectionCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={["border-slate-300 bg-white shadow-sm", className].join(" ").trim()}>
      <CardHeader className="border-b border-slate-200 pb-3">
        <CardTitle className="text-[15px] font-semibold text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}

function FieldLine({
  label,
  children,
  labelClassName = "w-[118px]",
}: {
  label: string
  children: React.ReactNode
  labelClassName?: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className={["shrink-0 text-[14px] font-semibold text-slate-800", labelClassName].join(" ").trim()}>{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function ReadonlyField({
  label,
  value,
  labelClassName,
  valueClassName,
}: {
  label: string
  value: string
  labelClassName?: string
  valueClassName?: string
}) {
  return (
    <FieldLine label={label} labelClassName={labelClassName}>
      <DisplayBox value={value} className="h-9" valueClassName={valueClassName} />
    </FieldLine>
  )
}

export default function AffectationPage() {
  const apiClient = useApiClient()
  const [codeCreance, setCodeCreance] = useState("")
  const [creance, setCreance] = useState<EtudeCreanceAffectationResponse | null>(null)
  const [gestCode, setGestCode] = useState("")
  const [affectMotif, setAffectMotif] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showGestionnaireDialog, setShowGestionnaireDialog] = useState(false)
  const [showCurrentGestionnaireDialog, setShowCurrentGestionnaireDialog] = useState(false)
  const [gestionnaireSearch, setGestionnaireSearch] = useState("")

  const gestionnaireItems = useMemo(
    () => normalizeGestionnaires(creance?.affectationOptions?.gestionnaires),
    [creance?.affectationOptions?.gestionnaires]
  )

  const selectedGestionnaire = useMemo(
    () => gestionnaireItems.find((item) => item.value === gestCode.trim().toUpperCase()) || null,
    [gestCode, gestionnaireItems]
  )

  const currentAffectation = creance?.affectationCurrent

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

  const displayData = useMemo(() => {
    if (!creance) {
      return buildEmptyDisplayData()
    }

    return {
      numero: formatText(currentAffectation?.AFFECT_NO),
      codeCreance: formatText(creance.CREAN_CODE),
      debiteurCode: formatText(creance.DEB_CODE),
      debiteurNom: formatText(creance.DEBITEUR_NOM),
      groupeCreance: formatCodeAndLabel(creance.GRP_CREAN_CODE, creance.GROUPE_CREANCE_LIB),
      objetCreance: formatCodeAndLabel(creance.OBJ_CREAN_CODE, creance.OBJET_CREANCE_LIB),
      capitalInitial: formatAmount(creance.CREAN_CAPIT_INIT),
      montantDebloque: formatAmount(creance.CREAN_MONT_DEBLOQ),
      dateDebutEch: formatDate(creance.CREAN_DATEFT),
      dateFinEch: formatDate(creance.CREAN_DATECH),
      dateOctroi: formatDate(creance.CREAN_DATOCTROI),
      periodiciteCode: formatText(creance.PERIOD_CODE),
      periodiciteLib: formatText(creance.PERIOD_LIB),
      nbEch: formatText(creance.CREAN_NBECH),
      duree: formatText(creance.CREAN_DUREE),
      gestionnaireActuelNom: formatText(currentAffectation?.GESTIONNAIRE_LIB ?? creance.NOMGEST),
      nouveauGestCode: formatText(selectedGestionnaire?.GEST_CODE ?? gestCode.trim().toUpperCase()),
      nouveauGestNom: formatText(selectedGestionnaire?.GEST_NOM),
      nouveauGestPrenom: formatText(selectedGestionnaire?.GEST_PRENOM),
      nouveauGestPoste: formatText(selectedGestionnaire?.GEST_POSTE),
      dateAffectation: selectedGestionnaire ? formatDate(new Date().toISOString()) : "-",
      statutCode: formatText(selectedGestionnaire?.STAT_CODE),
      statutLib: formatText(selectedGestionnaire?.STATUT_LIB),
    }
  }, [creance, currentAffectation, gestCode, selectedGestionnaire])

  const loadCreance = async (requestedCode?: string) => {
    const trimmedCode = (requestedCode ?? codeCreance).trim().toUpperCase()
    if (!trimmedCode) {
      setError("Veuillez saisir un code créance.")
      setCreance(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await CreanceService.getEtudeCreanceAffectation(apiClient, trimmedCode)
      setCreance(response)
      setCodeCreance(trimmedCode)
      setGestCode("")
      setAffectMotif("")
      setGestionnaireSearch("")
      setShowCurrentGestionnaireDialog(false)
      toast.success("Dossier chargé avec succès")
    } catch (err) {
      const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || "Impossible de charger le dossier créance."
      setError(message)
      setCreance(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await loadCreance()
  }

  const handleGestionnaireCodeBlur = () => {
    const trimmedCode = gestCode.trim().toUpperCase()
    if (!trimmedCode) {
      setGestCode("")
      setError(null)
      return
    }

    const match = gestionnaireItems.find((item) => item.value === trimmedCode)
    if (match) {
      setGestCode(match.value)
      setError(null)
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

  const handleSave = async () => {
    if (!creance?.CREAN_CODE) {
      setError("Veuillez d'abord charger un dossier créance.")
      return
    }

    if (!selectedGestionnaire) {
      setError("Veuillez sélectionner un gestionnaire valide.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await CreanceService.createEtudeCreanceAffectation(apiClient, creance.CREAN_CODE, {
        gestCode: selectedGestionnaire.value,
        affectMotif: affectMotif.trim() || null,
      })

      setCreance(response)
      setGestCode("")
      setAffectMotif("")
      setGestionnaireSearch("")
      toast.success(response.message || "Affectation enregistrée avec succès")
    } catch (err) {
      const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || "Impossible d'enregistrer l'affectation."
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-[1520px] flex-col gap-4 px-6 py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900">Affectation des dossiers créances</h1>
        <p className="text-sm text-slate-600">Affecter un dossier créance à un gestionnaire.</p>
      </div>

      <SectionCard title="Dossier">
        <form className="space-y-4" onSubmit={handleSearch}>
          <div className="grid gap-4 xl:grid-cols-[180px_minmax(430px,520px)_minmax(0,1fr)]">
            <ReadonlyField label="Numero" value={displayData.numero} labelClassName="w-[82px]" />

            <FieldLine label="Créance" labelClassName="w-[86px]">
              <div className="grid grid-cols-[minmax(0,1fr)_44px] gap-3">
                <Input
                  value={codeCreance}
                  onChange={(event) => {
                    setCodeCreance(event.target.value.toUpperCase())
                    setError(null)
                  }}
                  placeholder="Saisir le code créance"
                  className="h-9 border-[#9fd89c] bg-white pr-3 font-medium uppercase tracking-[0.04em]"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#1f6f3f] text-white hover:bg-[#195b34]"
                  disabled={loading}
                  aria-label={loading ? "Chargement du dossier" : "Charger le dossier créance"}
                  title={loading ? "Chargement du dossier" : "Charger le dossier créance"}
                >
                  <Search className={["h-4 w-4", loading ? "animate-pulse" : ""].join(" ").trim()} />
                  <span className="sr-only">{loading ? "Chargement du dossier" : "Charger le dossier créance"}</span>
                </Button>
              </div>
            </FieldLine>

            <div className="grid min-w-0 grid-cols-[78px_108px_minmax(0,1fr)] items-center gap-2.5">
              <span className="text-[14px] font-semibold text-slate-800">Débiteur</span>
              <DisplayBox value={displayData.debiteurCode} className="h-9" />
              <DisplayBox value={displayData.debiteurNom} className="h-9" />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {creance && Number(creance.AFFECTATION_ACTIVE_COUNT || 0) > 1 && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
              Plusieurs affectations actives ont été trouvées sur ce dossier. La plus récente est affichée et la prochaine sauvegarde clôturera les lignes actives avant insertion de la nouvelle affectation.
            </div>
          )}

          <div className="grid gap-3 xl:grid-cols-[1.1fr_1fr]">
            <ReadonlyField label="Groupe Créance" value={displayData.groupeCreance} labelClassName="w-[120px]" />
            <ReadonlyField label="Objet" value={displayData.objetCreance} labelClassName="w-[56px]" />
          </div>

          <div className="grid gap-3 xl:grid-cols-[250px_220px_260px_1fr]">
            <ReadonlyField label="Capital Initial" value={displayData.capitalInitial} labelClassName="w-[108px]" valueClassName="tabular-nums" />
            <ReadonlyField label="Date déb éch" value={displayData.dateDebutEch} labelClassName="w-[98px]" />
            <ReadonlyField label="Date d'octroi" value={displayData.dateOctroi} labelClassName="w-[100px]" />
            <div className="grid grid-cols-[88px_90px_minmax(0,1fr)] items-center gap-2">
              <span className="text-[14px] font-semibold text-slate-800">Périodicité</span>
              <DisplayBox value={displayData.periodiciteCode} className="h-9" />
              <DisplayBox value={displayData.periodiciteLib} className="h-9" />
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[250px_220px_260px_1fr]">
            <ReadonlyField label="Montant Débloqué" value={displayData.montantDebloque} labelClassName="w-[108px]" valueClassName="tabular-nums" />
            <ReadonlyField label="Date fin éch" value={displayData.dateFinEch} labelClassName="w-[98px]" />
            <ReadonlyField label="Nb. Ech." value={displayData.nbEch} labelClassName="w-[82px]" />
            <ReadonlyField label="Durée" value={displayData.duree} labelClassName="w-[52px]" />
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_116px]">
            <FieldLine label="Gestionnaire actuel" labelClassName="w-[148px] text-[15px] font-black text-[#b42318]">
              <DisplayBox
                value={displayData.gestionnaireActuelNom}
                className="h-10 px-4"
                valueClassName="text-[16px] font-semibold text-slate-900"
              />
            </FieldLine>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-slate-300 px-4"
              onClick={() => setShowCurrentGestionnaireDialog(true)}
              disabled={!currentAffectation && !creance?.NOMGEST}
            >
              Détail
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Gestionnaire">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <FieldLine label="Code" labelClassName="w-[86px]">
              <div className="grid grid-cols-[minmax(0,1fr)_170px] gap-2">
                <Input
                  value={gestCode}
                  onChange={(event) => {
                    setGestCode(event.target.value.toUpperCase())
                    setError(null)
                  }}
                  onBlur={handleGestionnaireCodeBlur}
                  placeholder="Saisir le code gestionnaire"
                  className="h-9 border-[#9fd89c] bg-white uppercase"
                  disabled={!creance}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300"
                  onClick={() => setShowGestionnaireDialog(true)}
                  disabled={!creance}
                >
                  Choisir dans la liste
                </Button>
              </div>
            </FieldLine>

            <div className="grid gap-3 md:grid-cols-2">
              <ReadonlyField label="Nom" value={displayData.nouveauGestNom} labelClassName="w-[70px]" />
              <ReadonlyField label="Prénom(s)" value={displayData.nouveauGestPrenom} labelClassName="w-[86px]" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ReadonlyField label="Code" value={displayData.nouveauGestCode} labelClassName="w-[70px]" />
              <ReadonlyField label="Poste" value={displayData.nouveauGestPoste} labelClassName="w-[86px]" />
            </div>
          </div>

          <div className="space-y-3">
            <ReadonlyField label="Date Affectation" value={displayData.dateAffectation} labelClassName="w-[118px]" />
            <FieldLine label="Statut dossier" labelClassName="w-[118px]">
              <div className="grid grid-cols-[90px_minmax(0,1fr)] gap-2">
                <DisplayBox value={displayData.statutCode} className="h-9" />
                <DisplayBox value={displayData.statutLib} className="h-9" />
              </div>
            </FieldLine>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Motif Affectation">
        <div className="space-y-2">
          <span className="text-[14px] font-semibold text-slate-800">Affectation Motif</span>
          <Textarea
            value={affectMotif}
            onChange={(event) => setAffectMotif(event.target.value)}
            placeholder="Saisir le motif d'affectation"
            className="min-h-[128px] border-[#9fd89c] bg-white"
            maxLength={200}
            disabled={!creance}
          />
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button
          type="button"
          className="bg-[#f97316] text-white hover:bg-[#ea580c]"
          onClick={handleSave}
          disabled={saving || loading || !creance}
        >
          {saving ? "Enregistrement..." : "Enregistrer l'affectation"}
        </Button>
      </div>

      <Dialog open={showGestionnaireDialog} onOpenChange={setShowGestionnaireDialog}>
        <DialogContent className="w-[min(96vw,1180px)] !max-w-[1180px] border border-slate-300 bg-white !p-7">
          <DialogHeader className="gap-3 pr-10">
            <DialogTitle className="text-lg font-semibold text-slate-900">Sélection du gestionnaire</DialogTitle>
            <DialogDescription className="text-slate-600">
              Rechercher par code ou par nom, puis sélectionner le gestionnaire à affecter au dossier.
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
                  filteredGestionnaires.map((item) => (
                    <button
                      key={item.value}
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

      <Dialog open={showCurrentGestionnaireDialog} onOpenChange={setShowCurrentGestionnaireDialog}>
        <DialogContent className="w-[min(95vw,1080px)] !max-w-[1080px] border border-slate-300 bg-white !p-7">
          <DialogHeader className="gap-3 pr-10">
            <DialogTitle className="text-lg font-semibold text-slate-900">Détail du gestionnaire actuel</DialogTitle>
            <DialogDescription className="text-slate-600">
              Informations détaillées sur le gestionnaire actuellement rattaché au dossier et son affectation active.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
            <SectionCard title="Gestionnaire" className="shadow-none">
              <div className="space-y-4">
                <ReadonlyField label="Code" value={formatText(currentAffectation?.GEST_CODE)} labelClassName="w-[96px]" />
                <ReadonlyField label="Nom" value={formatText(currentAffectation?.GEST_NOM)} labelClassName="w-[96px]" />
                <ReadonlyField label="Prénom(s)" value={formatText(currentAffectation?.GEST_PRENOM)} labelClassName="w-[96px]" />
                <ReadonlyField label="Poste" value={formatText(currentAffectation?.GEST_POSTE)} labelClassName="w-[96px]" />
              </div>
            </SectionCard>

            <SectionCard title="Affectation active" className="shadow-none">
              <div className="space-y-4">
                <ReadonlyField label="Numero" value={formatText(currentAffectation?.AFFECT_NO)} labelClassName="w-[102px]" />
                <ReadonlyField label="Date début" value={formatDate(currentAffectation?.AFFECT_DATEDEB)} labelClassName="w-[102px]" />
                <FieldLine label="Statut" labelClassName="w-[102px]">
                  <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
                    <DisplayBox value={formatText(currentAffectation?.STAT_CODE)} className="h-9" />
                    <DisplayBox value={formatText(currentAffectation?.STATUT_LIB)} className="h-9" />
                  </div>
                </FieldLine>
                <ReadonlyField label="Motif" value={formatText(currentAffectation?.AFFECT_MOTIF)} labelClassName="w-[102px]" />
              </div>
            </SectionCard>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}