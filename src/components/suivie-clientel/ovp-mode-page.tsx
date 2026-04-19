"use client"

import { FormEvent, useDeferredValue, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { useApiClient } from "@/hooks/useApiClient"
import { CreanceService } from "@/services/creance.service"
import type { CreanceResponse, SuivieClientelCreationOptions, SuivieClientelCreanceSoldePage, SuivieClientelOption } from "@/types/creance"
import {
  CodeLabelField,
  DisplayBox,
  FieldGroup,
  LabeledField,
  RecapRow,
  formatAmount,
  formatCodeAndLabel,
  formatDate,
  formatText,
} from "@/components/suivie-clientel/ovp-ui"

type OvpMode = "consultation" | "creation" | "modification"

type OvpModePageProps = {
  mode: OvpMode
}

type CreationFormState = {
  sourceOvpCode: string
  periodiciteCode: string
  acteCode: string
  typeOvpCode: string
  tiersCode: string
  compteOperationCode: string
  dateDebut: string
  dateFin: string
  dateSignature: string
  montantCreance: string
  montantPeriodique: string
  nbVirement: string
}

const placeholderRows = Array.from({ length: 9 }, (_, index) => index)
const MANUAL_DATE_FIN_PERIODICITE_CODE = "04"
const CREANCE_SOLDE_CHUNK_SIZE = 50

const emptyCreationForm = (): CreationFormState => ({
  sourceOvpCode: "",
  periodiciteCode: "",
  acteCode: "",
  typeOvpCode: "",
  tiersCode: "",
  compteOperationCode: "",
  dateDebut: "",
  dateFin: "",
  dateSignature: "",
  montantCreance: "",
  montantPeriodique: "",
  nbVirement: "",
})

function normalizeOptions(options?: SuivieClientelOption[]) {
  return (options || []).map((option) => ({
    value: String(option.CODE ?? ""),
    label: String(option.LIBELLE ?? option.CODE ?? ""),
  })).filter((option) => option.value)
}

function extractBankLabel(optionLabel: string) {
  if (!optionLabel.includes("/")) return "-"
  return optionLabel.split("/").pop()?.trim() || "-"
}

function getModeTitle(mode: OvpMode) {
  switch (mode) {
    case "creation":
      return "Suivie Clientel - OVP - Création"
    case "modification":
      return "Suivie Clientel - OVP - Modification"
    default:
      return "Suivie Clientel - OVP - Consultation"
  }
}

function toNumber(value: string) {
  const normalized = value.replace(/\s/g, "").replace(",", ".")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function isManualDateFinPeriodicity(periodiciteCode: string) {
  return periodiciteCode === MANUAL_DATE_FIN_PERIODICITE_CODE
}

function computeCreationPreview(form: CreationFormState) {
  const montantCreance = toNumber(form.montantCreance)
  const montantPeriodique = toNumber(form.montantPeriodique)
  const manualDateFin = isManualDateFinPeriodicity(form.periodiciteCode)

  if (manualDateFin) {
    if (!form.dateDebut || !form.dateFin || !montantCreance || !montantPeriodique) {
      return { nbVirement: "", dateFin: form.dateFin }
    }

    const startDate = new Date(`${form.dateDebut}T00:00:00`)
    const endDate = new Date(`${form.dateFin}T00:00:00`)
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) {
      return { nbVirement: "", dateFin: form.dateFin }
    }

    return {
      nbVirement: String(Math.ceil(montantCreance / montantPeriodique)),
      dateFin: form.dateFin,
    }
  }

  const periodMonths = Number(form.periodiciteCode)

  if (!form.dateDebut || !montantCreance || !montantPeriodique || !Number.isFinite(periodMonths) || periodMonths <= 0) {
    return { nbVirement: "", dateFin: "" }
  }

  const count = Math.ceil(montantCreance / montantPeriodique)
  const baseDate = new Date(`${form.dateDebut}T00:00:00`)
  if (Number.isNaN(baseDate.getTime())) {
    return { nbVirement: "", dateFin: "" }
  }

  const finalDate = new Date(baseDate)
  finalDate.setMonth(finalDate.getMonth() + (count - 1) * periodMonths + 1, 0)

  const yyyy = finalDate.getFullYear()
  const mm = String(finalDate.getMonth() + 1).padStart(2, "0")
  const dd = String(finalDate.getDate()).padStart(2, "0")

  return {
    nbVirement: String(count),
    dateFin: `${yyyy}-${mm}-${dd}`,
  }
}

function computeProjectedVirements(form: CreationFormState) {
  const montantCreance = toNumber(form.montantCreance)
  const montantPeriodique = toNumber(form.montantPeriodique)
  const manualDateFin = isManualDateFinPeriodicity(form.periodiciteCode)

  if (manualDateFin) {
    if (!form.dateDebut || !form.dateFin || !montantCreance || !montantPeriodique) {
      return []
    }

    const count = Math.ceil(montantCreance / montantPeriodique)
    if (!Number.isFinite(count) || count <= 0 || count > 240) {
      return []
    }

    const startDate = new Date(`${form.dateDebut}T00:00:00`)
    const endDate = new Date(`${form.dateFin}T00:00:00`)
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) {
      return []
    }

    const totalMilliseconds = endDate.getTime() - startDate.getTime()
    let montantRestant = montantCreance

    return Array.from({ length: count }, (_, index) => {
      const ratio = count === 1 ? 0 : index / (count - 1)
      const scheduledDate = index === count - 1
        ? endDate
        : new Date(startDate.getTime() + Math.round(totalMilliseconds * ratio))
      const montant = index === count - 1 ? montantRestant : Math.min(montantPeriodique, montantRestant)
      montantRestant -= montant

      return {
        code: `Prev. ${index + 1}`,
        date: formatDate(scheduledDate.toISOString()),
        montant: formatAmount(montant, { round: false }),
      }
    })
  }

  const periodMonths = Number(form.periodiciteCode)

  if (!form.dateDebut || !montantCreance || !montantPeriodique || !Number.isFinite(periodMonths) || periodMonths <= 0) {
    return []
  }

  const count = Math.ceil(montantCreance / montantPeriodique)
  if (!Number.isFinite(count) || count <= 0 || count > 240) {
    return []
  }

  const baseDate = new Date(`${form.dateDebut}T00:00:00`)
  if (Number.isNaN(baseDate.getTime())) {
    return []
  }

  let montantRestant = montantCreance

  return Array.from({ length: count }, (_, index) => {
    const virementDate = new Date(baseDate)
    virementDate.setMonth(virementDate.getMonth() + index * periodMonths + 1, 0)

    const montant = index === count - 1 ? montantRestant : Math.min(montantPeriodique, montantRestant)
    montantRestant -= montant

    return {
      code: `Prev. ${index + 1}`,
      date: formatDate(virementDate.toISOString()),
      montant: formatAmount(montant, { round: false }),
    }
  })
}

export default function OvpModePage({ mode }: OvpModePageProps) {
  const apiClient = useApiClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const codeFromQuery = searchParams.get("code")?.trim() || ""

  const [codeCreance, setCodeCreance] = useState(codeFromQuery)
  const [creance, setCreance] = useState<CreanceResponse | null>(null)
  const [creationForm, setCreationForm] = useState<CreationFormState>(emptyCreationForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDomiciliationDialog, setShowDomiciliationDialog] = useState(false)
  const [showCreanceSoldeDialog, setShowCreanceSoldeDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creanceSoldeData, setCreanceSoldeData] = useState<SuivieClientelCreanceSoldePage | null>(null)
  const [creanceSoldeError, setCreanceSoldeError] = useState<string | null>(null)
  const [creanceSoldeLoading, setCreanceSoldeLoading] = useState(false)
  const [creanceSoldePage, setCreanceSoldePage] = useState(0)
  const [creanceSoldeSearch, setCreanceSoldeSearch] = useState("")
  const [creanceSoldeTotal, setCreanceSoldeTotal] = useState<number | null>(null)
  const [creanceSoldeCountLoading, setCreanceSoldeCountLoading] = useState(false)
  const [creanceSoldeCountFailed, setCreanceSoldeCountFailed] = useState(false)
  const [defaultActeOptions, setDefaultActeOptions] = useState<Array<{ value: string; label: string }>>([])
  const [acteOptions, setActeOptions] = useState<Array<{ value: string; label: string }>>([])
  const [acteSearch, setActeSearch] = useState("")
  const [acteLoading, setActeLoading] = useState(false)
  const deferredCreanceSoldeSearch = useDeferredValue(creanceSoldeSearch)

  const resetCreanceSoldeListState = () => {
    setCreanceSoldeData(null)
    setCreanceSoldeError(null)
    setCreanceSoldePage(0)
    setCreanceSoldeTotal(null)
    setCreanceSoldeCountLoading(false)
    setCreanceSoldeCountFailed(false)
  }

  useEffect(() => {
    setCodeCreance(codeFromQuery)
  }, [codeFromQuery])

  useEffect(() => {
    if (!codeFromQuery) return

    const fetchInitialData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = mode === "creation"
          ? await CreanceService.getSuivieClientelOvpCreationContext(apiClient, codeFromQuery)
          : await CreanceService.getSuivieClientelByCode(apiClient, codeFromQuery)

        setCreance(response)
        setCreationForm(emptyCreationForm())
        if (mode === "creation") {
          const initialActes = normalizeOptions(response.creationOptions?.actes)
          setDefaultActeOptions(initialActes)
          setActeOptions(initialActes)
          setActeSearch("")
        }
        if (mode === "creation" && response.HAS_DOMICILIATION === false) {
          setShowDomiciliationDialog(true)
        }
      } catch (err) {
        const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
          || (err as Error).message
          || "Impossible de récupérer la créance."
        setError(message)
        setCreance(null)
      } finally {
        setLoading(false)
      }
    }

    void fetchInitialData()
  }, [apiClient, codeFromQuery, mode])

  useEffect(() => {
    if (mode !== "creation" || !showCreanceSoldeDialog) return

    let cancelled = false
    const fetchCreancesSolde = async () => {
      setCreanceSoldeLoading(true)
      setCreanceSoldeError(null)

      try {
        const response = await CreanceService.getSuivieClientelCreancesSolde(apiClient, {
          offset: creanceSoldePage * CREANCE_SOLDE_CHUNK_SIZE,
          size: CREANCE_SOLDE_CHUNK_SIZE,
          search: deferredCreanceSoldeSearch,
        })
        if (!cancelled) {
          setCreanceSoldeData(response)

          if (creanceSoldePage === 0 && response.items.length === 0) {
            setCreanceSoldeTotal(0)
            setCreanceSoldeCountFailed(false)
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
            || (err as Error).message
            || "Impossible de récupérer les créances soldées."
          setCreanceSoldeError(message)
          setCreanceSoldeData(null)
        }
      } finally {
        if (!cancelled) {
          setCreanceSoldeLoading(false)
        }
      }
    }

    void fetchCreancesSolde()
    return () => {
      cancelled = true
    }
  }, [apiClient, mode, showCreanceSoldeDialog, creanceSoldePage, deferredCreanceSoldeSearch])

  useEffect(() => {
    if (mode !== "creation" || !showCreanceSoldeDialog || !creanceSoldeData) return
    if (creanceSoldeCountLoading || creanceSoldeTotal !== null || creanceSoldeCountFailed) return

    let cancelled = false

    const fetchCreancesSoldeCount = async () => {
      setCreanceSoldeCountLoading(true)
      try {
        const response = await CreanceService.countSuivieClientelCreancesSolde(apiClient, {
          search: deferredCreanceSoldeSearch,
        })
        if (!cancelled) {
          setCreanceSoldeTotal(response.total)
          setCreanceSoldeCountFailed(false)
        }
      } catch {
        if (!cancelled) {
          setCreanceSoldeCountFailed(true)
        }
      } finally {
        if (!cancelled) {
          setCreanceSoldeCountLoading(false)
        }
      }
    }

    void fetchCreancesSoldeCount()

    return () => {
      cancelled = true
    }
  }, [apiClient, mode, showCreanceSoldeDialog, creanceSoldeData, creanceSoldeTotal, creanceSoldeCountLoading, creanceSoldeCountFailed, deferredCreanceSoldeSearch])

  const displayData = useMemo(() => {
    if (!creance) return null

    const ovp = creance.ovp
    const domiciliation = creance.domiciliation
    const virements = Array.isArray(creance.virements) ? creance.virements : []
    const creationOptions = (creance.creationOptions || {}) as SuivieClientelCreationOptions

    const debtorName = creance.DEBITEUR_NOM
      ? formatText(creance.DEBITEUR_NOM)
      : creance.TYPDEB_CODE === "M"
        ? formatText(creance.DEB_RAIS_SOCIALE)
        : formatText(`${creance.DEB_NOM || ""} ${creance.DEB_PREN || ""}`.trim())

    const comptesOperation = normalizeOptions(creationOptions.comptesOperation)
    const selectedCompteOperation = comptesOperation.find((option) => option.value === creationForm.compteOperationCode)

    return {
      codeCreance: formatText(creance.CREAN_CODE),
      groupeCode: formatText(creance.GRP_CREAN_CODE),
      groupeLibelle: formatText(creance.GROUPE_CREANCE_LIB),
      objetCode: formatText(creance.OBJ_CREAN_CODE),
      objetLibelle: formatText(creance.OBJET_CREANCE_LIB),
      capitalInitial: formatAmount(creance.CREAN_CAPIT_INIT),
      montantDu: formatAmount(creance.CREAN_MONT_DU),
      montantDecaisse: formatAmount(creance.CREAN_MONT_DEBLOQ),
      debiteurCode: formatText(creance.DEB_CODE),
      debiteurNom: debtorName,
      entiteLibelle: formatText(creance.ENTITE_LIB),
      objet: formatText(creance.CREAN_OBJET),
      periodiciteCode: formatText(creance.PERIOD_CODE),
      periodiciteLibelle: formatText(creance.PERIOD_LIB),
      codePrec: formatText(creance.CREAN_CODE_PREC),
      tauxIntConv: formatAmount(creance.CREAN_TAUXIC, { round: false }),
      tauxIntRet: formatAmount(creance.CREAN_TAUXIR, { round: false }),
      datePremiereEcheance: formatDate(creance.CREAN_DATEFT),
      dateDerniereEcheance: formatDate(creance.CREAN_DATECH),
      montantRembourse: formatAmount(creance.CREAN_DEJ_REMB),
      encours: formatAmount(creance.CREAN_ENCOURS),
      commission: formatAmount(creance.CREAN_COMM_BANQ),
      montantInitialRecouvrer: formatAmount(creance.CREAN_SOLDE_INIT),
      frais: formatAmount(creance.CREAN_FRAIS),
      recapPrincipal: formatAmount(creance.SOLDE_PRINC),
      recapPenalite: formatAmount(creance.SOLDE_PENALITE),
      recapAutresFrais: formatAmount(creance.SOLDE_AUT_FRAIS),
      recapPaiement: formatAmount(creance.TOT_PAIEMENT),
      recapSoldeExigible: formatAmount(creance.SOLDE_EXIGIBLE),
      ovpSource: formatCodeAndLabel(ovp?.SOU_CODE, ovp?.SOU_LIB),
      ovpPeriodicite: formatCodeAndLabel(ovp?.PERIOD_CODE, ovp?.PERIOD_LIB),
      ovpActe: formatCodeAndLabel(ovp?.ACTE_CODE, ovp?.ACTE_LIB),
      ovpDateDebut: formatDate(ovp?.OVP_DATDEB),
      ovpMontantCreance: formatAmount(ovp?.OVP_MONT_CREAN),
      ovpDateFin: formatDate(ovp?.OVP_DATFIN),
      ovpMontantPeriodique: formatAmount(ovp?.OVP_MONT),
      ovpDateSignature: formatDate(ovp?.OVP_DATSIGNE),
      ovpNombreVirements: formatAmount(ovp?.OVP_NB_VIRM ?? (virements.length > 0 ? virements.length : null)),
      ovpType: formatCodeAndLabel(ovp?.TYPOVP_CODE, ovp?.TYPOVP_LIB),
      ovpTiers: formatCodeAndLabel(ovp?.GARPHYS_CODE, ovp?.GARANTIE_TIERS_LIB),
      ovpCompteOperation: formatCodeAndLabel(ovp?.CPTOPER_CODE, ovp?.CPTOPER_LIB),
      ovpCompteBanque: formatText(ovp?.CPTOPER_BANQUE_LIB),
      ovpDomiciliation: formatCodeAndLabel(domiciliation?.DOM_CODE, domiciliation?.DOM_LIB),
      ovpDomiciliationBanque: formatText(domiciliation?.BQ_LIB),
      ovpEmployeur: formatText(ovp?.EMPLOYEUR_LIB),
      virements: virements.map((virement) => ({
        code: formatText(virement.VIRM_CODE),
        date: formatDate(virement.VIRM_DATE),
        montant: formatAmount(virement.VIRM_MONT),
      })),
      virementsTotal: formatAmount(creance.VIREMENTS_TOTAL_MONTANT),
      hasOvp: Boolean(creance.HAS_OVP),
      ovpCount: Number(creance.OVP_COUNT || 0),
      hasDomiciliation: Boolean(creance.HAS_DOMICILIATION),
      canCreateOvp: Boolean(creance.CAN_CREATE_OVP),
      creationBlockReason: formatText(creance.CREATION_BLOCK_REASON),
      creationOptions: {
        sourcesOvp: normalizeOptions(creationOptions.sourcesOvp),
        periodicites: normalizeOptions(creationOptions.periodicites),
        typesOvp: normalizeOptions(creationOptions.typesOvp),
        actes: normalizeOptions(creationOptions.actes),
        comptesOperation,
        tiers: normalizeOptions(creationOptions.tiers),
      },
      creationCompteBanque: selectedCompteOperation ? extractBankLabel(selectedCompteOperation.label) : "-",
    }
  }, [creance, creationForm.compteOperationCode])

  const creationPreview = useMemo(() => computeCreationPreview(creationForm), [creationForm])
  const projectedVirements = useMemo(() => computeProjectedVirements(creationForm), [creationForm])
  const isManualDateFinMode = isManualDateFinPeriodicity(creationForm.periodiciteCode)
  const creanceSoldeCurrentPage = creanceSoldePage + 1
  const creanceSoldeTotalPages = creanceSoldeTotal === null ? null : Math.max(1, Math.ceil(creanceSoldeTotal / CREANCE_SOLDE_CHUNK_SIZE))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedCode = codeCreance.trim()
    if (!trimmedCode) {
      setError("Veuillez saisir un code créance.")
      setCreance(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = mode === "creation"
        ? await CreanceService.getSuivieClientelOvpCreationContext(apiClient, trimmedCode)
        : await CreanceService.getSuivieClientelByCode(apiClient, trimmedCode)
      setCreance(response)
      setCreationForm(emptyCreationForm())
      if (mode === "creation") {
        const initialActes = normalizeOptions(response.creationOptions?.actes)
        setDefaultActeOptions(initialActes)
        setActeOptions(initialActes)
        setActeSearch("")
      }
      if (mode === "creation" && response.HAS_DOMICILIATION === false) {
        setShowDomiciliationDialog(true)
      }
    } catch (err) {
      const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || "Impossible de récupérer la créance."
      setError(message)
      setCreance(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCreationFieldChange = (field: keyof CreationFormState, value: string) => {
    setCreationForm((current) => ({ ...current, [field]: value }))
  }

  const handleActeSearchChange = async (value: string) => {
    setActeSearch(value)

    if (value.trim().length < 2) {
      setActeOptions(defaultActeOptions)
      return
    }

    setActeLoading(true)
    try {
      const results = await CreanceService.searchSuivieClientelOvpActes(apiClient, value)
      setActeOptions(normalizeOptions(results as SuivieClientelOption[]))
    } finally {
      setActeLoading(false)
    }
  }

  const handleCreateOvp = async () => {
    if (!creance || !displayData?.canCreateOvp) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      await CreanceService.createSuivieClientelOvp(apiClient, String(creance.CREAN_CODE), {
        sourceOvpCode: creationForm.sourceOvpCode,
        periodiciteCode: creationForm.periodiciteCode,
        acteCode: creationForm.acteCode || null,
        typeOvpCode: creationForm.typeOvpCode,
        tiersCode: creationForm.tiersCode || null,
        compteOperationCode: creationForm.compteOperationCode,
        dateDebut: creationForm.dateDebut,
        dateFin: isManualDateFinMode ? creationForm.dateFin : null,
        dateSignature: creationForm.dateSignature,
        montantCreance: creationForm.montantCreance,
        montantPeriodique: creationForm.montantPeriodique,
      })
      router.push(`/suivie_clientel/ovp/consultation?code=${creance.CREAN_CODE}`)
    } catch (err) {
      const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || "Impossible d'enregistrer l'OVP."
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white px-4 py-6 text-[14px] text-slate-900 sm:px-6">
      <div className="max-w-[1460px] space-y-4">
        <div>
          <h1 className="text-[28px] font-semibold">{getModeTitle(mode)}</h1>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#fbfbfb] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <label htmlFor="code-creance" className="shrink-0 text-[14px] font-semibold text-slate-800 xl:w-32">
              Code créance
            </label>
            <div className="flex w-full max-w-[580px] items-center gap-3">
              <Input
                id="code-creance"
                value={codeCreance}
                onChange={(event) => setCodeCreance(event.target.value)}
                placeholder="Saisir le code créance"
                autoComplete="off"
                className="h-10 rounded-[9px] border-[#7bc96f] bg-white text-[14px] shadow-sm focus-visible:ring-[#7bc96f]"
              />
              <Button
                type="submit"
                disabled={loading}
                className="h-10 rounded-[9px] bg-[#ffb37a] px-5 text-[14px] font-medium text-white hover:bg-[#f4a066]"
              >
                {loading ? "Chargement..." : "Afficher"}
              </Button>
              {mode === "creation" && (
                <Button
                  type="button"
                  className="h-10 rounded-[9px] bg-[#b9ed9b] px-5 text-[14px] font-medium text-slate-900 hover:bg-[#a7e487]"
                  onClick={() => {
                    resetCreanceSoldeListState()
                    setCreanceSoldeSearch("")
                    setShowCreanceSoldeDialog(true)
                  }}
                >
                  Consulte Creance Solde
                </Button>
              )}
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {displayData && (
            <div className="mt-5 space-y-5 overflow-x-auto">
              <div className="flex min-w-[1260px] items-start gap-5">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-[320px_minmax(0,1fr)_290px] gap-x-4 gap-y-2">
                    <LabeledField label="Code" value={displayData.codeCreance} labelClassName="w-[92px]" boxClassName="w-[124px] flex-none" valueClassName="tabular-nums" />
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-[82px] shrink-0 text-[14px] font-semibold text-slate-800">Débiteur</span>
                      <DisplayBox value={displayData.debiteurCode} className="w-[110px] flex-none" valueClassName="tabular-nums" />
                      <DisplayBox value={displayData.debiteurNom} className="min-w-0 flex-1" valueClassName="uppercase" />
                    </div>
                    <CodeLabelField label="Périodicité" code={displayData.periodiciteCode} libelle={displayData.periodiciteLibelle} labelClassName="w-[90px]" codeBoxClassName="w-[62px]" />
                    <CodeLabelField label="Grpe Créance" code={displayData.groupeCode} libelle={displayData.groupeLibelle} labelClassName="w-[92px]" codeBoxClassName="w-[74px]" />
                    <LabeledField label="Entité" value={displayData.entiteLibelle} labelClassName="w-[82px]" />
                    <LabeledField label="Code Prec" value={displayData.codePrec} labelClassName="w-[90px]" valueClassName="tabular-nums" />
                    <CodeLabelField label="Type d'Objet" code={displayData.objetCode} libelle={displayData.objetLibelle} labelClassName="w-[92px]" codeBoxClassName="w-[74px]" />
                    <LabeledField label="Objet" value={displayData.objet} className="col-span-2" labelClassName="w-[82px]" />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <LabeledField label="Capital Initial" value={displayData.capitalInitial} labelClassName="w-[110px]" valueClassName="tabular-nums" />
                    <LabeledField label="Taux Int. conv" value={displayData.tauxIntConv} labelClassName="w-[106px]" valueClassName="tabular-nums" />
                    <LabeledField label="Taux Int. Ret." value={displayData.tauxIntRet} labelClassName="w-[106px]" valueClassName="tabular-nums" />
                    <LabeledField label="Date 1ère Ech" value={displayData.datePremiereEcheance} labelClassName="w-[106px]" />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <LabeledField label="Mont. Dû" value={displayData.montantDu} labelClassName="w-[110px]" valueClassName="tabular-nums" />
                    <LabeledField label="Mont. Remb." value={displayData.montantRembourse} labelClassName="w-[106px]" valueClassName="tabular-nums" />
                    <LabeledField label="Encours" value={displayData.encours} labelClassName="w-[106px]" valueClassName="tabular-nums" />
                    <LabeledField label="Date Dern. Ech." value={displayData.dateDerniereEcheance} labelClassName="w-[106px]" />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <LabeledField label="Mont. Décaisse" value={displayData.montantDecaisse} labelClassName="w-[110px]" valueClassName="tabular-nums" />
                    <LabeledField label="Mont. Init. à recouvr." value={displayData.montantInitialRecouvrer} labelClassName="w-[138px]" valueClassName="tabular-nums" />
                    <LabeledField label="Comm." value={displayData.commission} labelClassName="w-[106px]" valueClassName="tabular-nums" />
                    <LabeledField label="Frais" value={displayData.frais} labelClassName="w-[106px]" valueClassName="tabular-nums" />
                  </div>
                </div>
                <div className="w-[300px] rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
                  <div className="mb-3 text-[15px] font-semibold text-slate-900">Récapitulatif</div>
                  <div className="space-y-2.5">
                    <RecapRow label="Principal" value={displayData.recapPrincipal} />
                    <RecapRow label="Pénalités" value={displayData.recapPenalite} />
                    <RecapRow label="Autres frais" value={displayData.recapAutresFrais} />
                    <RecapRow label="Paiement" value={displayData.recapPaiement} />
                    <RecapRow label="Solde exigible" value={displayData.recapSoldeExigible} />
                  </div>
                </div>
              </div>

              {mode === "consultation" && (
                <div className="grid min-w-[1260px] grid-cols-[minmax(0,1fr)_280px] gap-4">
                  <div className="space-y-4">
                    {!displayData.hasOvp && (
                      <div className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-[15px] font-semibold text-amber-900">Aucun OVP enregistré</div>
                            <div className="text-[13px] text-amber-800">Cette créance n&apos;a pas encore d&apos;OVP en consultation.</div>
                          </div>
                          <Button type="button" className="bg-[#2444d7] text-white hover:bg-[#1a36b0]" onClick={() => router.push(`/suivie_clientel/ovp/creation?code=${displayData.codeCreance}`)}>
                            Aller à la création
                          </Button>
                        </div>
                      </div>
                    )}

                    {displayData.hasOvp && (
                      <>
                        <div className="rounded-xl border border-slate-300 bg-white shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-[15px] font-semibold text-[#2444d7]">
                            <span>(OVP)</span>
                            <span className="text-[12px] font-medium text-slate-500">{displayData.ovpCount} OVP trouvé{displayData.ovpCount > 1 ? "s" : ""}</span>
                          </div>
                          <div className="grid grid-cols-[1.15fr_0.95fr] gap-x-8 gap-y-3 p-4">
                            <FieldGroup>
                              <LabeledField label="Source Ovp" value={displayData.ovpSource} labelClassName="w-[96px]" />
                              <LabeledField label="Périodicité" value={displayData.ovpPeriodicite} labelClassName="w-[96px]" />
                              <LabeledField label="Acte" value={displayData.ovpActe} labelClassName="w-[96px]" />
                              <div className="grid grid-cols-[300px_250px] gap-4">
                                <LabeledField label="Date Début" value={displayData.ovpDateDebut} labelClassName="w-[96px]" />
                                <LabeledField label="Montant Créan." value={displayData.ovpMontantCreance} labelClassName="w-[100px]" valueClassName="tabular-nums" />
                              </div>
                              <div className="grid grid-cols-[300px_250px] gap-4">
                                <LabeledField label="Date Fin" value={displayData.ovpDateFin} labelClassName="w-[96px]" />
                                <LabeledField label="Montant. Périod" value={displayData.ovpMontantPeriodique} labelClassName="w-[100px]" valueClassName="tabular-nums" />
                              </div>
                              <div className="grid grid-cols-[300px_250px] gap-4">
                                <LabeledField label="Date signature" value={displayData.ovpDateSignature} labelClassName="w-[96px]" />
                                <LabeledField label="Nb Virement" value={displayData.ovpNombreVirements} labelClassName="w-[100px]" valueClassName="tabular-nums" />
                              </div>
                            </FieldGroup>
                            <FieldGroup>
                              <LabeledField label="Type Ovp" value={displayData.ovpType} labelClassName="w-[100px]" />
                              <LabeledField label="Tiers" value={displayData.ovpTiers} labelClassName="w-[100px]" />
                              <div className="grid grid-cols-[minmax(0,1fr)_150px] gap-4">
                                <LabeledField label="Cpte Operation" value={displayData.ovpCompteOperation} labelClassName="w-[114px]" />
                                <LabeledField label="Banque" value={displayData.ovpCompteBanque} labelClassName="w-[60px]" />
                              </div>
                              <div className="grid grid-cols-[minmax(0,1fr)_150px] gap-4">
                                <LabeledField label="Domiciliation" value={displayData.ovpDomiciliation} labelClassName="w-[114px]" />
                                <LabeledField label="Banque" value={displayData.ovpDomiciliationBanque} labelClassName="w-[60px]" />
                              </div>
                              <LabeledField label="Employeur" value={displayData.ovpEmployeur} labelClassName="w-[100px]" />
                            </FieldGroup>
                          </div>
                        </div>

                        <div className="grid grid-cols-[1.2fr_1fr] gap-4">
                          <div className="rounded-xl border border-slate-300 bg-white shadow-sm">
                            <div className="grid grid-cols-[122px_122px_1fr] items-center border-b border-slate-200 px-4 py-3 text-[15px] font-semibold text-[#2444d7]">
                              <span>VIREMENTS</span>
                              <span className="text-center text-[13px]">Date</span>
                              <span className="text-right text-[13px]">Montant</span>
                            </div>
                            <div className="max-h-[272px] overflow-y-auto px-4 py-3">
                              <div className="space-y-2">
                                {displayData.virements.length > 0
                                  ? displayData.virements.map((virement, index) => (
                                      <div key={`${virement.code}-${index}`} className="grid grid-cols-[122px_122px_1fr] gap-2">
                                        <DisplayBox value={virement.code} className="h-8" />
                                        <DisplayBox value={virement.date} className="h-8" />
                                        <DisplayBox value={virement.montant} className="h-8" valueClassName="text-right tabular-nums" />
                                      </div>
                                    ))
                                  : placeholderRows.map((row) => (
                                      <div key={row} className="grid grid-cols-[122px_122px_1fr] gap-2">
                                        <DisplayBox value="-" className="h-8" />
                                        <DisplayBox value="-" className="h-8" />
                                        <DisplayBox value="-" className="h-8" valueClassName="text-right tabular-nums" />
                                      </div>
                                    ))}
                              </div>
                            </div>
                            <div className="border-t border-slate-200 px-4 py-3">
                              <LabeledField label="Total Montant" value={displayData.virementsTotal} labelClassName="w-[110px]" valueClassName="tabular-nums" />
                            </div>
                          </div>
                          <div className="rounded-xl border border-slate-300 bg-[#efefef] px-5 py-4 shadow-sm">
                            <div className="mb-10 text-center text-[15px] font-semibold text-[#2444d7]">AVIS DE DOMICILIATION - BILLET A ORDRE</div>
                            <div className="flex h-[170px] items-center justify-center">
                              <Button type="button" disabled className="h-14 min-w-[260px] rounded-none bg-white px-10 text-slate-700 shadow-sm hover:bg-white">
                                AVIS DE DOMICILIATION
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-300 bg-[#efefef] p-6 shadow-sm">
                    <div className="flex h-full min-h-[438px] flex-col justify-center gap-8">
                      <Button type="button" disabled className="h-14 w-full rounded-none bg-white text-slate-700 shadow-sm hover:bg-white">
                        MISE A JOUR CREANCE - AVAL
                      </Button>
                      <Button type="button" disabled className="h-14 w-full rounded-none bg-white text-slate-700 shadow-sm hover:bg-white">
                        MISE A JOUR DEBITEUR
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {mode === "creation" && (
                <div className="min-w-[1260px] space-y-4">
                  <div className="rounded-xl border border-slate-300 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-[15px] font-semibold text-[#2444d7]">
                      <span>Création OVP</span>
                      <span className="text-[12px] font-medium text-slate-500">{displayData.hasOvp ? `${displayData.ovpCount} OVP existant${displayData.ovpCount > 1 ? "s" : ""}` : "Aucun OVP existant"}</span>
                    </div>
                    <div className="grid grid-cols-[1.15fr_0.95fr] gap-x-8 gap-y-3 p-4">
                      <FieldGroup>
                        <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Source Ovp</span><SearchableSelect value={creationForm.sourceOvpCode} onValueChange={(value) => handleCreationFieldChange("sourceOvpCode", value)} items={displayData.creationOptions.sourcesOvp} placeholder="Sélectionner" disabled={!displayData.canCreateOvp} /></div>
                        <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Périodicité</span><SearchableSelect value={creationForm.periodiciteCode} onValueChange={(value) => handleCreationFieldChange("periodiciteCode", value)} items={displayData.creationOptions.periodicites} placeholder="Sélectionner" disabled={!displayData.canCreateOvp} /></div>
                        <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Acte</span><SearchableSelect value={creationForm.acteCode} onValueChange={(value) => handleCreationFieldChange("acteCode", value)} items={acteOptions} placeholder="Sélectionner" disabled={!displayData.canCreateOvp} isLoading={acteLoading} onSearchChange={handleActeSearchChange} search={acteSearch} /></div>
                        <div className="grid grid-cols-[300px_250px] gap-4">
                          <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Date Début</span><Input type="date" value={creationForm.dateDebut} onChange={(event) => handleCreationFieldChange("dateDebut", event.target.value)} disabled={!displayData.canCreateOvp} className="h-9 border-[#9fd89c]" /></div>
                          <div className="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Montant Créan.</span><Input value={creationForm.montantCreance} onChange={(event) => handleCreationFieldChange("montantCreance", event.target.value)} disabled={!displayData.canCreateOvp} className="h-9 border-[#9fd89c] text-right" /></div>
                        </div>
                        <div className="grid grid-cols-[300px_250px] gap-4">
                          <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Date Fin</span><Input type="date" value={isManualDateFinMode ? creationForm.dateFin : creationPreview.dateFin} onChange={(event) => handleCreationFieldChange("dateFin", event.target.value)} disabled={!displayData.canCreateOvp || !isManualDateFinMode} className={isManualDateFinMode ? "h-9 border-[#9fd89c]" : "h-9 border-[#9fd89c] bg-slate-100"} /></div>
                          <div className="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Montant. Périod</span><Input value={creationForm.montantPeriodique} onChange={(event) => handleCreationFieldChange("montantPeriodique", event.target.value)} disabled={!displayData.canCreateOvp} className="h-9 border-[#9fd89c] text-right" /></div>
                        </div>
                        <div className="grid grid-cols-[300px_250px] gap-4">
                          <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Date signature</span><Input type="date" value={creationForm.dateSignature} onChange={(event) => handleCreationFieldChange("dateSignature", event.target.value)} disabled={!displayData.canCreateOvp} className="h-9 border-[#9fd89c]" /></div>
                          <div className="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Nb Virement</span><Input value={creationPreview.nbVirement} disabled className="h-9 border-[#9fd89c] bg-slate-100 text-right" /></div>
                        </div>
                      </FieldGroup>

                      <FieldGroup>
                        <div className="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Type Ovp</span><SearchableSelect value={creationForm.typeOvpCode} onValueChange={(value) => handleCreationFieldChange("typeOvpCode", value)} items={displayData.creationOptions.typesOvp} placeholder="Sélectionner" disabled={!displayData.canCreateOvp} /></div>
                        <div className="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Tiers</span><SearchableSelect value={creationForm.tiersCode} onValueChange={(value) => handleCreationFieldChange("tiersCode", value)} items={displayData.creationOptions.tiers} placeholder="Sélectionner" disabled={!displayData.canCreateOvp} /></div>
                        <div className="grid grid-cols-[minmax(0,1fr)_150px] gap-4">
                          <div className="grid grid-cols-[114px_minmax(0,1fr)] items-center gap-2"><span className="text-[14px] font-semibold text-slate-800">Cpte Operation</span><SearchableSelect value={creationForm.compteOperationCode} onValueChange={(value) => handleCreationFieldChange("compteOperationCode", value)} items={displayData.creationOptions.comptesOperation} placeholder="Sélectionner" disabled={!displayData.canCreateOvp} /></div>
                          <LabeledField label="Banque" value={displayData.creationCompteBanque} labelClassName="w-[60px]" />
                        </div>
                        <div className="grid grid-cols-[minmax(0,1fr)_150px] gap-4">
                          <LabeledField label="Domiciliation" value={displayData.ovpDomiciliation} labelClassName="w-[114px]" />
                          <LabeledField label="Banque" value={displayData.ovpDomiciliationBanque} labelClassName="w-[60px]" />
                        </div>
                        <LabeledField label="Employeur" value={displayData.ovpEmployeur} labelClassName="w-[100px]" />
                      </FieldGroup>
                    </div>
                    <div className="border-t border-slate-200 px-4 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <Button type="button" disabled={!displayData.canCreateOvp || saving || loading} className="bg-[#2444d7] text-white hover:bg-[#1a36b0]" onClick={handleCreateOvp}>{saving ? "Enregistrement..." : "Enregistrer l'OVP"}</Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1.2fr_1fr] gap-4">
                    <div className="rounded-xl border border-slate-300 bg-white shadow-sm">
                      <div className="grid grid-cols-[122px_122px_1fr] items-center border-b border-slate-200 px-4 py-3 text-[15px] font-semibold text-[#2444d7]">
                        <span>VIREMENTS</span>
                        <span className="text-center text-[13px]">Date</span>
                        <span className="text-right text-[13px]">Montant</span>
                      </div>
                      <div className="max-h-[272px] overflow-y-auto px-4 py-3">
                        <div className="space-y-2">
                          {projectedVirements.length > 0
                            ? projectedVirements.map((virement, index) => (
                                <div key={`${virement.code}-${index}`} className="grid grid-cols-[122px_122px_1fr] gap-2">
                                  <DisplayBox value={virement.code} className="h-8" />
                                  <DisplayBox value={virement.date} className="h-8" />
                                  <DisplayBox value={virement.montant} className="h-8" valueClassName="text-right tabular-nums" />
                                </div>
                              ))
                            : placeholderRows.map((row) => (
                                <div key={row} className="grid grid-cols-[122px_122px_1fr] gap-2">
                                  <DisplayBox value="-" className="h-8" />
                                  <DisplayBox value="-" className="h-8" />
                                  <DisplayBox value="-" className="h-8" valueClassName="text-right tabular-nums" />
                                </div>
                              ))}
                        </div>
                      </div>
                      <div className="border-t border-slate-200 px-4 py-3">
                        <LabeledField label="Total Montant" value={creationForm.montantCreance ? formatAmount(toNumber(creationForm.montantCreance), { round: false }) : "-"} labelClassName="w-[110px]" valueClassName="tabular-nums" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-300 bg-[#efefef] px-5 py-4 shadow-sm">
                      <div className="mb-10 text-center text-[15px] font-semibold text-[#2444d7]">AVIS DE DOMICILIATION - BILLET A ORDRE</div>
                      <div className="flex h-[170px] items-center justify-center">
                        <Button type="button" disabled className="h-14 min-w-[260px] rounded-none bg-white px-10 text-slate-700 shadow-sm hover:bg-white">
                          AVIS DE DOMICILIATION
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mode === "modification" && (
                <div className="min-w-[1260px] rounded-xl border border-slate-300 bg-white px-6 py-8 shadow-sm">
                  <div className="text-[18px] font-semibold text-[#2444d7]">Mode modification</div>
                  <p className="mt-3 max-w-[720px] text-[14px] text-slate-700">La consultation reste active. Le mode modification sera branché sur le même socle après définition du parcours métier de mise à jour.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showDomiciliationDialog} onOpenChange={setShowDomiciliationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Domiciliation requise</DialogTitle>
            <DialogDescription>Le débiteur n&apos;a pas de domiciliation. Création OVP impossible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setShowDomiciliationDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreanceSoldeDialog} onOpenChange={setShowCreanceSoldeDialog}>
        <DialogContent className="h-[85vh] w-[96vw] max-w-[96vw] overflow-hidden p-0 sm:max-w-[1280px]">
          <DialogHeader className="border-b border-slate-200 px-6 py-4">
            <DialogTitle>Consultation Créances Soldées OVP</DialogTitle>
            <DialogDescription>
              Liste paginée des créances portant des OVP soldées, chargée directement depuis Oracle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Input
                value={creanceSoldeSearch}
                onChange={(event) => {
                  const nextValue = event.target.value
                  setCreanceSoldeSearch(nextValue)
                  setCreanceSoldeData(null)
                  setCreanceSoldeError(null)
                  setCreanceSoldePage(0)
                  setCreanceSoldeTotal(null)
                  setCreanceSoldeCountLoading(false)
                  setCreanceSoldeCountFailed(false)
                }}
                placeholder="Recherche rapide par code créance"
                className="max-w-sm"
              />
              <div className="text-[13px] text-slate-600">
                {creanceSoldeLoading && !creanceSoldeData && "Chargement initial en cours..."}
                {!creanceSoldeLoading && creanceSoldeData && creanceSoldeTotal !== null && `Page ${creanceSoldeCurrentPage}${creanceSoldeTotalPages ? ` / ${creanceSoldeTotalPages}` : ""} • Résultats: ${creanceSoldeTotal}`}
                {!creanceSoldeLoading && creanceSoldeData && creanceSoldeTotal === null && creanceSoldeCountLoading && `Page ${creanceSoldeCurrentPage} • Total en cours...`}
                {!creanceSoldeLoading && creanceSoldeData && creanceSoldeTotal === null && !creanceSoldeCountLoading && !creanceSoldeCountFailed && `Page ${creanceSoldeCurrentPage}`}
                {!creanceSoldeLoading && creanceSoldeData && creanceSoldeCountFailed && `Page ${creanceSoldeCurrentPage} • Total indisponible`}
              </div>
            </div>

            {creanceSoldeError && (
              <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
                {creanceSoldeError}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
              <div className="overflow-x-auto">
                <div className="min-w-[980px]">
                  <div className="grid grid-cols-[150px_1.6fr_160px_160px_160px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold uppercase tracking-wide text-slate-700">
                    <span>Créance</span>
                    <span>Débiteur</span>
                    <span className="text-right">Capital Initial</span>
                    <span className="text-right">Solde Initial</span>
                    <span className="text-right">Solde Exigible</span>
                  </div>
                </div>
              </div>
              <div className="max-h-[55vh] overflow-auto">
                {creanceSoldeLoading && !creanceSoldeData && (
                  <div className="px-4 py-8 text-center text-slate-600">Chargement...</div>
                )}

                {creanceSoldeData && creanceSoldeData.items.length === 0 && (
                  <div className="px-4 py-8 text-center text-slate-600">
                    Aucune créance soldée trouvée pour ce filtre.
                  </div>
                )}

                {creanceSoldeData?.items.map((row, index) => (
                  <div key={`${row.CREANCE}-${index}`} className="overflow-x-auto">
                    <div className="grid min-w-[980px] grid-cols-[150px_1.6fr_160px_160px_160px] gap-3 border-b border-slate-100 px-4 py-3 text-[14px] text-slate-800 last:border-b-0">
                      <span className="font-medium tabular-nums">{row.CREANCE}</span>
                      <span className="truncate">{formatText(row.DEBITEUR)}</span>
                      <span className="text-right tabular-nums">{formatAmount(row.CAPIT_INIT)}</span>
                      <span className="text-right tabular-nums">{formatAmount(row.SOLDE_INIT)}</span>
                      <span className="text-right tabular-nums">{formatAmount(row.SOLDE_EXIG)}</span>
                    </div>
                  </div>
                ))}

                {creanceSoldeLoading && creanceSoldeData && (
                  <div className="px-4 py-4 text-center text-[13px] text-slate-500">Chargement de la page...</div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-slate-200 px-6 py-4 sm:justify-between">
            <div className="text-[13px] text-slate-600">
              {creanceSoldeData ? `Page ${creanceSoldeCurrentPage}` : "Aucune ligne chargée"}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={creanceSoldeLoading || creanceSoldePage <= 0}
                onClick={() => setCreanceSoldePage((current) => Math.max(current - 1, 0))}
              >
                Précédent
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={creanceSoldeLoading || !creanceSoldeData?.hasMore}
                onClick={() => setCreanceSoldePage((current) => current + 1)}
              >
                Suivant
              </Button>
            </div>
            <div className="text-[13px] text-slate-600">
              {creanceSoldeCountLoading && "Comptage en arrière-plan..."}
              {!creanceSoldeCountLoading && creanceSoldeTotal !== null && `Total: ${creanceSoldeTotal}`}
              {!creanceSoldeCountLoading && creanceSoldeCountFailed && "Total indisponible"}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}