"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { DisplayBox, formatAmount, formatText } from "@/components/suivie-clientel/ovp-ui"
import { useApiClient } from "@/hooks/useApiClient"
import { CreanceService } from "@/services/creance.service"
import type {
  SuivieClientelOption,
  SuivieClientelOvpMensuelBankOption,
  SuivieClientelOvpMensuelContext,
  SuivieClientelOvpMensuelFilters,
  SuivieClientelOvpMensuelResponse,
  SuivieClientelOvpMensuelRow,
} from "@/types/creance"

function normalizeOptions(options?: SuivieClientelOption[]) {
  return (options || []).map((option) => ({
    value: String(option.CODE ?? ""),
    label: String(option.LIBELLE ?? option.CODE ?? ""),
  })).filter((option) => option.value)
}

function buildFallbackFilters(): SuivieClientelOvpMensuelFilters {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const formatInputDate = (date: Date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  const dateTraite = `${String(today.getDate()).padStart(2, "0")}${String(today.getMonth() + 1).padStart(2, "0")}${today.getFullYear()}`

  return {
    ENTITE_CODE: "03",
    ENTITE_LIB: "LES FONDS SOCIAUX",
    BANQ_CODE: "",
    BANQ_LIB: "",
    CPT_BQ: "",
    CPT_BQ_VAL: "",
    CPTOPER_CODE: "",
    AGBANQ_CODE: "",
    DATE_DEBUT_PERIODE: formatInputDate(firstDay),
    DATE_FIN_PERIODE: formatInputDate(lastDay),
    DATE_TRAITE: dateTraite,
  }
}

function buildEmptyResponse(filters: SuivieClientelOvpMensuelFilters): SuivieClientelOvpMensuelResponse {
  return {
    filters,
    items: [],
    totals: {
      TT_CPTE: 0,
      TOT_CPTE: 0,
      TOT_MONT: 0,
      TOTAL_LIGNES: 0,
    },
  }
}

type OvpMensuelSaveFilePickerWindow = Window & {
  showSaveFilePicker?: (options?: {
    suggestedName?: string
    types?: Array<{
      description?: string
      accept: Record<string, string[]>
    }>
  }) => Promise<{
    createWritable: () => Promise<{
      write: (data: Blob) => Promise<void>
      close: () => Promise<void>
    }>
  }>
}

function triggerOvpMensuelBrowserDownload(blob: Blob, fileName: string) {
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = downloadUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
}

function isOvpMensuelSavePickerAbort(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError"
}

async function saveOvpMensuelBlob(blob: Blob, fileName: string) {
  const filePicker = (window as OvpMensuelSaveFilePickerWindow).showSaveFilePicker

  if (typeof filePicker !== "function") {
    triggerOvpMensuelBrowserDownload(blob, fileName)
    return
  }

  try {
    const fileHandle = await filePicker({
      suggestedName: fileName,
      types: [
        {
          description: "Fichier OVP mensuel",
          accept: {
            "text/plain": [".txt", ".TXT"],
          },
        },
      ],
    })

    const writable = await fileHandle.createWritable()
    await writable.write(blob)
    await writable.close()
  } catch (error) {
    if (isOvpMensuelSavePickerAbort(error)) {
      return
    }

    triggerOvpMensuelBrowserDownload(blob, fileName)
  }
}

const OVP_MENSUEL_VISIBLE_ROWS = 15
const OVP_MENSUEL_TABLE_ROW_HEIGHT_PX = 36
const OVP_MENSUEL_TABLE_HEADER_HEIGHT_PX = 41

export default function OvpMensuelPage() {
  const apiClient = useApiClient()
  const [contextData, setContextData] = useState<SuivieClientelOvpMensuelContext | null>(null)
  const [filters, setFilters] = useState<SuivieClientelOvpMensuelFilters>(buildFallbackFilters)
  const [resultData, setResultData] = useState<SuivieClientelOvpMensuelResponse>(buildEmptyResponse(buildFallbackFilters()))
  const [contextLoading, setContextLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [hasLoadedResult, setHasLoadedResult] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const entiteOptions = useMemo(() => normalizeOptions(contextData?.entites), [contextData?.entites])
  const banqueOptions = useMemo(() => normalizeOptions(contextData?.banques), [contextData?.banques])

  const syncBanqueProfile = (bankProfile: SuivieClientelOvpMensuelBankOption | null) => {
    // Les champs compte opération et agence suivent strictement la banque sélectionnée pour coller au métier.
    setFilters((current) => ({
      ...current,
      BANQ_CODE: bankProfile?.BANQ_CODE ?? "",
      BANQ_LIB: bankProfile?.BANQ_LIB ?? "",
      CPT_BQ: bankProfile?.CPT_BQ ?? "",
      CPT_BQ_VAL: bankProfile?.CPT_BQ_VAL ?? "",
      CPTOPER_CODE: bankProfile?.CPTOPER_CODE ?? "",
      AGBANQ_CODE: bankProfile?.AGBANQ_CODE ?? "",
    }))
  }

  const loadMensuelData = async (nextFilters: SuivieClientelOvpMensuelFilters) => {
    setLoading(true)
    setError(null)

    try {
      const response = await CreanceService.getSuivieClientelOvpMensuel(apiClient, {
        entiteCode: nextFilters.ENTITE_CODE,
        banqueCode: nextFilters.BANQ_CODE,
        dateDebut: nextFilters.DATE_DEBUT_PERIODE,
        dateFin: nextFilters.DATE_FIN_PERIODE,
      })

      setResultData(response)
      setFilters(response.filters)
      setHasLoadedResult(true)
    } catch (err) {
      const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || "Impossible de charger la génération mensuelle des OVP."
      setError(message)
      setResultData(buildEmptyResponse(nextFilters))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const loadContext = async () => {
      setContextLoading(true)
      setError(null)

      try {
        const response = await CreanceService.getSuivieClientelOvpMensuelContext(apiClient)
        if (cancelled) {
          return
        }

        setContextData(response)
        setFilters(response.defaultFilters)
        setResultData(buildEmptyResponse(response.defaultFilters))
        setHasLoadedResult(false)
      } catch (err) {
        if (cancelled) {
          return
        }

        const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
          || (err as Error).message
          || "Impossible de charger le contexte de génération mensuelle des OVP."
        setError(message)
      } finally {
        if (!cancelled) {
          setContextLoading(false)
        }
      }
    }

    void loadContext()

    return () => {
      cancelled = true
    }
  }, [apiClient])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void loadMensuelData(filters)
  }

  const handleExport = async () => {
    setExporting(true)
    setError(null)

    try {
      const { blob, fileName } = await CreanceService.exportSuivieClientelOvpMensuelTxt(apiClient, {
        entiteCode: filters.ENTITE_CODE,
        banqueCode: filters.BANQ_CODE,
        dateDebut: filters.DATE_DEBUT_PERIODE,
        dateFin: filters.DATE_FIN_PERIODE,
      })

      await saveOvpMensuelBlob(blob, fileName)
    } catch (err) {
      let message = "Impossible de générer le fichier OVP mensuel."
      const errorResponse = (err as Error & { response?: { data?: Blob | { message?: string } } }).response?.data

      if (errorResponse instanceof Blob) {
        const text = await errorResponse.text()
        try {
          const parsed = JSON.parse(text) as { message?: string }
          message = parsed.message || text || message
        } catch {
          message = text || message
        }
      } else {
        message = (errorResponse as { message?: string } | undefined)?.message
          || (err as Error).message
          || message
      }

      setError(message)
    } finally {
      setExporting(false)
    }
  }

  const rows = resultData.items
  const totals = resultData.totals
  const tableViewportHeight = OVP_MENSUEL_TABLE_HEADER_HEIGHT_PX + (OVP_MENSUEL_VISIBLE_ROWS * OVP_MENSUEL_TABLE_ROW_HEIGHT_PX)

  return (
    <div className="bg-white px-4 py-6 text-[14px] text-slate-900 sm:px-6">
      <div className="max-w-[1460px] space-y-4">
        <div>
          <h1 className="text-[28px] font-semibold">Suivie Clientel - OVP - Generation des ovp mensuel</h1>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#fbfbfb] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-800">Entité</span>
                  <SearchableSelect
                    value={filters.ENTITE_CODE}
                    onValueChange={(value) => {
                      const entite = contextData?.entites.find((item) => String(item.CODE ?? "") === value) ?? null
                      setFilters((current) => ({
                        ...current,
                        ENTITE_CODE: value,
                        ENTITE_LIB: String(entite?.LIBELLE ?? ""),
                      }))
                    }}
                    items={entiteOptions}
                    placeholder="Sélectionner"
                    disabled={contextLoading}
                  />
                </div>

                <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-800">Banque</span>
                  <SearchableSelect
                    value={filters.BANQ_CODE}
                    onValueChange={(value) => {
                      const bankProfile = contextData?.banques.find((item) => item.CODE === value) ?? null
                      syncBanqueProfile(bankProfile)
                    }}
                    items={banqueOptions}
                    placeholder="Sélectionner"
                    disabled={contextLoading}
                  />
                </div>

                <div className="grid grid-cols-[148px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-800">Date Début Période</span>
                  <Input
                    type="date"
                    value={filters.DATE_DEBUT_PERIODE}
                    onChange={(event) => setFilters((current) => ({ ...current, DATE_DEBUT_PERIODE: event.target.value }))}
                    className="h-9 border-[#9fd89c]"
                  />
                </div>

                <div className="grid grid-cols-[148px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-800">Date Fin Période</span>
                  <Input
                    type="date"
                    value={filters.DATE_FIN_PERIODE}
                    onChange={(event) => setFilters((current) => ({ ...current, DATE_FIN_PERIODE: event.target.value }))}
                    className="h-9 border-[#9fd89c]"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-800">Cpt bq</span>
                  <DisplayBox value={formatText(filters.CPT_BQ)} className="h-9" valueClassName="tabular-nums" />
                </div>

                <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-800">Cpt bq val</span>
                  <DisplayBox value={formatText(filters.CPT_BQ_VAL)} className="h-9" valueClassName="tabular-nums" />
                </div>

                <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-800">Agence</span>
                  <DisplayBox value={formatText(filters.AGBANQ_CODE)} className="h-9" valueClassName="tabular-nums" />
                </div>

                <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2 md:col-span-2">
                  <span className="text-[14px] font-semibold text-slate-800">Date Traité</span>
                  <DisplayBox value={formatText(filters.DATE_TRAITE)} className="h-9 max-w-[220px]" valueClassName="tabular-nums" />
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-3">
                  <Button
                    type="submit"
                    disabled={loading || contextLoading || !filters.ENTITE_CODE || !filters.BANQ_CODE || !filters.DATE_DEBUT_PERIODE || !filters.DATE_FIN_PERIODE}
                    className="h-10 rounded-[9px] bg-[#2444d7] px-5 text-[14px] font-medium text-white hover:bg-[#1a36b0]"
                  >
                    {loading ? "Chargement..." : "Afficher"}
                  </Button>
                  {hasLoadedResult && (
                    <Button
                      type="button"
                      disabled={exporting}
                      className="h-10 rounded-[9px] bg-[#f97316] px-5 text-[14px] font-medium text-white hover:bg-[#ea580c]"
                      onClick={() => void handleExport()}
                    >
                      <Download className="h-4 w-4" />
                      {exporting ? "Export..." : "Exporter"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-slate-300 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-[15px] font-semibold text-[#2444d7]">
            <span>Liste des ovp</span>
            <span className="text-[12px] font-medium text-slate-500">{totals.TOTAL_LIGNES} ligne(s)</span>
          </div>

          <div className="overflow-x-auto px-4 py-4">
            <div className="overflow-y-auto" style={{ maxHeight: `${tableViewportHeight}px` }}>
            <table className="min-w-[1280px] w-full border-separate border-spacing-0 text-[13px] whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="text-left text-[12px] uppercase tracking-[0.08em] text-slate-500">
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">N° ord.</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">N° ovp</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">N°Créance</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Nom Débiteur</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Banq</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Compte</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Compte Long</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-right">Mont</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Date crea</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Date signe</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">N° Virm</th>
                  <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Date virm</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? rows.map((row: SuivieClientelOvpMensuelRow) => (
                  <tr key={`${row.OVP_CODE}-${row.VIRM_CODE}-${row.NUM_ORD}`} className="odd:bg-white even:bg-slate-50/60">
                    <td className="border border-slate-200 px-3 py-2 tabular-nums">{formatText(row.NUM_ORD)}</td>
                    <td className="border border-slate-200 px-3 py-2 tabular-nums">{formatText(row.OVP_CODE)}</td>
                    <td className="border border-slate-200 px-3 py-2 tabular-nums">{formatText(row.CREAN_CODE)}</td>
                    <td className="border border-slate-200 px-3 py-2">{formatText(row.NOM_DEBITEUR)}</td>
                    <td className="border border-slate-200 px-3 py-2 tabular-nums">{formatText(row.BANQ)}</td>
                    <td className="border border-slate-200 px-3 py-2 tabular-nums">{formatText(row.COMPTE)}</td>
                    <td className="border border-slate-200 px-3 py-2 tabular-nums">{formatText(row.COMPTE_LONG)}</td>
                    <td className="border border-slate-200 px-3 py-2 text-right tabular-nums">{formatAmount(row.MONT)}</td>
                    <td className="border border-slate-200 px-3 py-2">{formatText(row.DATE_CREA)}</td>
                    <td className="border border-slate-200 px-3 py-2">{formatText(row.DATE_SIGNE)}</td>
                    <td className="border border-slate-200 px-3 py-2 tabular-nums">{formatText(row.VIRM_CODE)}</td>
                    <td className="border border-slate-200 px-3 py-2">{formatText(row.DATE_VIRM)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={12} className="border border-slate-200 px-4 py-10 text-center text-[14px] text-slate-500">
                      {loading ? "Chargement des OVP mensuels..." : "Aucune ligne affichée. Cliquez sur Afficher pour lancer la génération mensuelle."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>

          <div className="border-t border-slate-200 px-4 py-4">
            <div className="flex flex-wrap items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-slate-700">TT Cpte</span>
                <DisplayBox value={formatAmount(totals.TT_CPTE)} className="w-[180px]" valueClassName="text-right tabular-nums" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-slate-700">Tot Cpte</span>
                <DisplayBox value={formatAmount(totals.TOT_CPTE)} className="w-[180px]" valueClassName="text-right tabular-nums" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-slate-700">Mont</span>
                <DisplayBox value={formatAmount(totals.TOT_MONT)} className="w-[180px]" valueClassName="text-right tabular-nums" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(error)}
        onOpenChange={(open) => {
          if (!open) {
            setError(null)
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className="max-w-md border border-red-200 bg-white shadow-xl"
        >
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold text-red-900">Information</DialogTitle>
            <DialogDescription asChild>
              <p className="text-[14px] font-medium leading-6 text-slate-700">{error}</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="bg-[#2444d7] text-white hover:bg-[#1a36b0]"
              onClick={() => setError(null)}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}