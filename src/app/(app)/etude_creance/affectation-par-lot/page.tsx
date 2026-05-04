"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Minus, Plus, RotateCcw, Save, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useApiClient } from "@/hooks/useApiClient"
import { CreanceService } from "@/services/creance.service"
import type {
  EtudeCreanceAffectationGestionnaireOption,
  EtudeCreanceAffectationLotContext,
  EtudeCreanceAffectationLotRow,
} from "@/types/creance"
import { DisplayBox, formatDate, formatText } from "@/components/suivie-clientel/ovp-ui"

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

type LotRowState = {
  code: string
  data: EtudeCreanceAffectationLotRow | null
  loading: boolean
  error: string | null
}

const DEFAULT_EMPTY_ROWS = 2

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

function createEmptyRow(): LotRowState {
  return {
    code: "",
    data: null,
    loading: false,
    error: null,
  }
}

function buildInitialRows(count: number): LotRowState[] {
  return Array.from({ length: Math.max(count, 1) }, () => createEmptyRow())
}

function ensureDisplayRows(rows: LotRowState[], minimumRows: number): LotRowState[] {
  const nextRows = [...rows]
  while (nextRows.length < Math.max(minimumRows, 1)) {
    nextRows.push(createEmptyRow())
  }

  const hasEmptyRow = nextRows.some((row) => !row.code.trim())
  if (!hasEmptyRow) {
    nextRows.push(createEmptyRow())
  }

  return nextRows
}

function SectionCard({
  title,
  children,
  className = "",
  actions,
}: {
  title: string
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}) {
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

export default function AffectationParLotPage() {
  const apiClient = useApiClient()
  const [context, setContext] = useState<EtudeCreanceAffectationLotContext | null>(null)
  const [rows, setRows] = useState<LotRowState[]>(() => buildInitialRows(DEFAULT_EMPTY_ROWS))
  const [gestCode, setGestCode] = useState("")
  const [loadingContext, setLoadingContext] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showGestionnaireDialog, setShowGestionnaireDialog] = useState(false)
  const [gestionnaireSearch, setGestionnaireSearch] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadContext = async () => {
      setLoadingContext(true)
      try {
        const result = await CreanceService.getEtudeCreanceAffectationLotContext(apiClient)
        if (cancelled) {
          return
        }

        setContext(result)
        setRows(buildInitialRows(result.emptyRowCount ?? DEFAULT_EMPTY_ROWS))
      } catch (err) {
        if (!cancelled) {
          const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
            || (err as Error).message
            || "Impossible de charger le contexte d'affectation par lot."
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

  const minimumRows = context?.emptyRowCount ?? DEFAULT_EMPTY_ROWS

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

  const normalizedRows = useMemo(() => ensureDisplayRows(rows, minimumRows), [rows, minimumRows])

  const activeCodes = useMemo(
    () => normalizedRows.map((row) => row.code.trim().toUpperCase()).filter(Boolean),
    [normalizedRows]
  )

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

  const handleRowCodeChange = (index: number, value: string) => {
    const upperValue = value.toUpperCase()
    setRows((currentRows) => {
      const nextRows = [...currentRows]
      const previousRow = nextRows[index] || createEmptyRow()
      nextRows[index] = {
        code: upperValue,
        data: previousRow.data && previousRow.data.CREAN_CODE === upperValue ? previousRow.data : null,
        loading: false,
        error: null,
      }
      return nextRows
    })
    setError(null)
  }

  const clearRow = (index: number) => {
    setRows((currentRows) => {
      const nextRows = [...currentRows]
      nextRows[index] = createEmptyRow()
      return ensureDisplayRows(nextRows, minimumRows)
    })
  }

  const resolveRow = async (index: number) => {
    const normalizedCode = normalizedRows[index]?.code.trim().toUpperCase() || ""
    if (!normalizedCode) {
      clearRow(index)
      return
    }

    const duplicateCount = activeCodes.filter((code) => code === normalizedCode).length
    if (duplicateCount > 1) {
      setRows((currentRows) => {
        const nextRows = [...currentRows]
        const currentRow = nextRows[index] || createEmptyRow()
        nextRows[index] = {
          ...currentRow,
          code: normalizedCode,
          loading: false,
          data: null,
          error: "Cette créance est déjà saisie dans le lot.",
        }
        return nextRows
      })
      return
    }

    setRows((currentRows) => {
      const nextRows = [...currentRows]
      const currentRow = nextRows[index] || createEmptyRow()
      nextRows[index] = {
        ...currentRow,
        code: normalizedCode,
        loading: true,
        error: null,
      }
      return nextRows
    })

    try {
      const response = await CreanceService.resolveEtudeCreanceAffectationLot(apiClient, {
        creanCodes: [normalizedCode],
      })
      const resolvedRow = response.rows[0] || null

      setRows((currentRows) => {
        const nextRows = [...currentRows]
        nextRows[index] = {
          code: normalizedCode,
          data: resolvedRow,
          loading: false,
          error: resolvedRow?.ERROR ? String(resolvedRow.ERROR) : null,
        }
        return ensureDisplayRows(nextRows, minimumRows)
      })
    } catch (err) {
      const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || "Impossible de résoudre la créance du lot."

      setRows((currentRows) => {
        const nextRows = [...currentRows]
        nextRows[index] = {
          code: normalizedCode,
          data: null,
          loading: false,
          error: message,
        }
        return nextRows
      })
    }
  }

  const handleResetRows = () => {
    setRows(buildInitialRows(minimumRows))
    setError(null)
  }

  const handleAddRow = () => {
    setRows((currentRows) => [...currentRows, createEmptyRow()])
  }

  const handleRemoveRow = () => {
    setRows((currentRows) => {
      if (currentRows.length <= minimumRows) {
        return currentRows
      }

      return currentRows.slice(0, -1)
    })
  }

  const handleSave = async () => {
    if (!selectedGestionnaire) {
      setError("Veuillez sélectionner un gestionnaire valide.")
      return
    }

    const validCodes = normalizedRows
      .filter((row) => Boolean(row.data?.IS_VALID))
      .map((row) => row.code.trim().toUpperCase())

    if (validCodes.length === 0) {
      setError("Veuillez saisir et valider au moins une créance pour le lot.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await CreanceService.createEtudeCreanceAffectationLot(apiClient, {
        gestCode: selectedGestionnaire.value,
        creanCodes: validCodes,
      })

      const rowsByCode = new Map(
        (response.rows || []).map((row) => [String(row.CREAN_CODE || "").trim().toUpperCase(), row])
      )

      setRows((currentRows) => {
        const nextRows = currentRows.map((row) => {
          const code = row.code.trim().toUpperCase()
          const savedRow = rowsByCode.get(code)
          if (!savedRow) {
            return row
          }

          return {
            code,
            data: savedRow,
            loading: false,
            error: savedRow.ERROR ? String(savedRow.ERROR) : null,
          }
        })
        return ensureDisplayRows(nextRows, response.emptyRowCount ?? minimumRows)
      })

      setContext((currentContext) => ({
        ...(currentContext || {}),
        affectationOptions: response.affectationOptions || currentContext?.affectationOptions,
        dateAffectation: response.dateAffectation || currentContext?.dateAffectation,
        emptyRowCount: response.emptyRowCount || currentContext?.emptyRowCount || minimumRows,
      }))

      toast.success(response.message || "Lot d'affectation enregistré avec succès")
    } catch (err) {
      const message = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || "Impossible d'enregistrer le lot d'affectation."
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-[1580px] flex-col gap-4 px-6 py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900">Affectation par lot</h1>
        <p className="text-sm text-slate-600">Choisir un gestionnaire puis saisir plusieurs créances à affecter dans le lot.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_360px]">
        <SectionCard title="Gestionnaire">
          <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_220px]">
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
                  disabled={loadingContext}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="border-slate-300"
                  onClick={() => setShowGestionnaireDialog(true)}
                  disabled={loadingContext}
                  aria-label="Choisir un gestionnaire"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </FieldLine>

            <ReadonlyField label="Nom" value={buildGestionnaireFullName(selectedGestionnaire)} labelClassName="w-[56px]" />
            <ReadonlyField label="Poste" value={formatText(selectedGestionnaire?.GEST_POSTE)} labelClassName="w-[52px]" />
          </div>
        </SectionCard>

        <SectionCard title="Statut Dossier">
          <FieldLine label="Stat Code" labelClassName="w-[74px] text-[#1d3ea8]">
            <div className="grid grid-cols-[86px_minmax(0,1fr)] gap-2">
              <DisplayBox value={formatText(selectedGestionnaire?.STAT_CODE)} className="h-9" />
              <DisplayBox value={formatText(selectedGestionnaire?.STATUT_LIB)} className="h-9" />
            </div>
          </FieldLine>
        </SectionCard>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <SectionCard
        title="Dossiers"
        actions={(
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" className="border-slate-300" onClick={handleResetRows}>
              <RotateCcw className="h-4 w-4" />
              Vider les lignes
            </Button>
            <Button
              type="button"
              className="bg-[#f97316] text-white hover:bg-[#ea580c]"
              onClick={handleSave}
              disabled={saving || loadingContext}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer le lot
            </Button>
          </div>
        )}
      >
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-slate-300">
            <table className="min-w-[1460px] border-collapse bg-white text-[13px] text-slate-800">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">N°</th>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">N° Créance</th>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Date Affectation</th>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Groupe Créance</th>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#1d3ea8]">Débiteur</th>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-[14px] font-semibold text-[#d92d20]">Etat</th>
                  <th className="border-b px-2 py-2 text-[14px] font-semibold text-[#d92d20]">Nom Gestionnaire Actuel</th>
                </tr>
              </thead>
              <tbody>
                {normalizedRows.map((row, index) => {
                  const rowData = row.data
                  const affectationState = formatText(rowData?.ETAT)
                  const currentGestionnaireLabel = formatText(rowData?.CURRENT_GESTIONNAIRE_LIB)
                  const rowMessage = row.error || (rowData?.MESSAGE ? String(rowData.MESSAGE) : null)
                  const rowTintClass = row.error
                    ? "bg-red-50"
                    : rowData?.RESULT_STATUS === "CREATED" || rowData?.RESULT_STATUS === "REASSIGNED"
                      ? "bg-emerald-50/50"
                      : rowData?.RESULT_STATUS === "UNCHANGED"
                        ? "bg-amber-50/50"
                        : "bg-white"

                  return (
                    <tr key={`lot-row-${index}`} className={rowTintClass}>
                      <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                        <DisplayBox value={formatText(rowData?.AFFECT_NO || "")} className="h-9 min-w-[66px] px-2 text-[12px]" valueClassName="tabular-nums" />
                      </td>
                      <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                        <div className="space-y-1">
                          <Input
                            value={row.code}
                            onChange={(event) => handleRowCodeChange(index, event.target.value)}
                            onBlur={() => {
                              void resolveRow(index)
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault()
                                void resolveRow(index)
                              }
                            }}
                            placeholder="Saisir la créance"
                            className="h-9 min-w-[150px] border-[#9fd89c] bg-white uppercase"
                            disabled={loadingContext || saving}
                          />
                          {row.loading && <div className="text-[12px] font-medium text-slate-500">Chargement...</div>}
                          {rowMessage && <div className="text-[12px] font-medium text-red-600">{rowMessage}</div>}
                        </div>
                      </td>
                      <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                        <DisplayBox value={formatDate(rowData?.DATE_AFFECTATION)} className="h-9 min-w-[118px]" />
                      </td>
                      <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                        <div className="grid min-w-[240px] grid-cols-[72px_minmax(0,1fr)] gap-1.5">
                          <DisplayBox value={formatText(rowData?.GRP_CREAN_CODE)} className="h-9 px-2 text-[12px]" valueClassName="tabular-nums" />
                          <DisplayBox value={formatText(rowData?.GROUPE_CREANCE_LIB)} className="h-9" />
                        </div>
                      </td>
                      <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                        <div className="grid min-w-[320px] grid-cols-[64px_minmax(0,1fr)] gap-1.5">
                          <DisplayBox value={formatText(rowData?.DEB_CODE)} className="h-9 px-2 text-[12px]" valueClassName="tabular-nums" />
                          <DisplayBox value={formatText(rowData?.DEBITEUR_NOM)} className="h-9" />
                        </div>
                      </td>
                      <td className="border-r border-t border-slate-200 px-2 py-1.5 align-top">
                        <DisplayBox
                          value={affectationState}
                          className="h-9 min-w-[110px] bg-white"
                          valueClassName={[
                            "font-bold",
                            affectationState === "Affecté" ? "text-[#2450d6]" : "text-slate-700",
                          ].join(" ").trim()}
                        />
                      </td>
                      <td className="border-t border-slate-200 px-2 py-1.5 align-top">
                        <div className="grid min-w-[360px] grid-cols-[110px_minmax(0,1fr)] gap-1.5">
                          <DisplayBox value={formatText(rowData?.CURRENT_GEST_CODE)} className="h-9 px-2 text-[12px]" valueClassName="tabular-nums font-semibold text-slate-900" />
                          <DisplayBox value={currentGestionnaireLabel} className="h-9" valueClassName="font-semibold text-slate-900" />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-9 w-9 border-slate-300"
                onClick={handleRemoveRow}
                disabled={rows.length <= minimumRows}
                aria-label="Supprimer une ligne"
                title="Supprimer une ligne"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-9 w-9 border-slate-300"
                onClick={handleAddRow}
                aria-label="Ajouter une ligne"
                title="Ajouter une ligne"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>

      <Dialog open={showGestionnaireDialog} onOpenChange={setShowGestionnaireDialog}>
        <DialogContent className="w-[min(96vw,1180px)] !max-w-[1180px] border border-slate-300 bg-white !p-7">
          <DialogHeader className="gap-3 pr-10">
            <DialogTitle className="text-lg font-semibold text-slate-900">Sélection du gestionnaire</DialogTitle>
            <DialogDescription className="text-slate-600">
              Choisir le gestionnaire unique qui recevra l&apos;ensemble des créances du lot.
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