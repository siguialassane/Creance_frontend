"use client"

import { FormEvent, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApiClient } from "@/hooks/useApiClient"
import { CreanceService } from "@/services/creance.service"
import type { CreanceResponse } from "@/types/creance"

type DisplayBoxProps = {
  value: string
  className?: string
  valueClassName?: string
}

type LabeledFieldProps = {
  label: string
  value: string
  className?: string
  labelClassName?: string
  boxClassName?: string
  valueClassName?: string
}

function DisplayBox({ value, className, valueClassName }: DisplayBoxProps) {
  return (
    <div
      className={[
        "flex h-9 min-w-0 items-center rounded-[6px] border border-[#9fd89c] bg-[#eef2f5] px-3 text-[14px] text-slate-700 shadow-none",
        className || "",
      ].join(" ").trim()}
    >
      <span className={["block min-w-0 truncate", valueClassName || ""].join(" ").trim()}>{value}</span>
    </div>
  )
}

type RecapRowProps = {
  label: string
  value: string
}

type RegularisationRow = {
  date: string
  heure: string
  montant: string
  cumulPaiement: string
  solde: string
  motif: string
  affectation: string
  isHighlighted: boolean
}

function RecapRow({ label, value }: RecapRowProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[110px] shrink-0 text-[13px] font-medium text-slate-800">{label}</span>
      <DisplayBox value={value} className="h-8 flex-1 rounded-[7px] px-2 text-[13px] shadow-none" valueClassName="tabular-nums" />
    </div>
  )
}

function LabeledField({
  label,
  value,
  className,
  labelClassName,
  boxClassName,
  valueClassName,
}: LabeledFieldProps) {
  return (
    <div className={["flex min-w-0 items-center gap-2", className || ""].join(" ").trim()}>
      <span className={["shrink-0 text-[14px] font-semibold text-slate-800", labelClassName || "w-32"].join(" ").trim()}>
        {label}
      </span>
      <DisplayBox value={value} className={["flex-1", boxClassName || ""].join(" ").trim()} valueClassName={valueClassName} />
    </div>
  )
}

function getMovementTimestamp(value: unknown): number {
  if (!value) return 0
  const timestamp = new Date(String(value)).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function formatAmount(value: unknown, options?: { round?: boolean }): string {
  if (value === null || value === undefined || value === "") return "-"
  const numericValue = typeof value === "number" ? value : Number(String(value).replace(/\s/g, ""))
  if (Number.isNaN(numericValue)) return String(value)

  const shouldRound = options?.round !== false
  const displayValue = shouldRound ? Math.round(numericValue) : numericValue

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: shouldRound ? 0 : 2,
  }).format(displayValue)
}

function formatDate(value: unknown): string {
  if (!value) return "-"
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString("fr-FR")
}

function formatText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-"
  return String(value)
}

function buildEmptyExtraitDisplayData() {
  return {
    codeCreance: "-",
    debiteurCode: "-",
    debiteurNom: "-",
    groupeCode: "-",
    groupeLibelle: "-",
    objetCode: "-",
    objetLibelle: "-",
    capitalInitial: "-",
    montantReamenage: "-",
    montantAss: "-",
    montantDi: "-",
    tauxIntConv: "-",
    tauxIntRet: "-",
    montantIr: "-",
    dejaRembourse: "-",
    numeroPrec: "-",
    numeroAnc: "-",
    dateEffet: "-",
    dateEcheance: "-",
    dateOctroi: "-",
    montantIc: "-",
    nbEcheances: "-",
    numProduit: "-",
    codeProduit: "-",
    libelleProduit: "-",
    gestionnaire: "-",
    encours: "-",
    penalite: "-",
    soldeInitial: "-",
    recapPaiement: "-",
    recapPenalite: "-",
    recapAutresFrais: "-",
    recapEchImpayee: "-",
    recapEchEncours: "-",
    recapPrincipal: "-",
    recapSoldeExigible: "-",
  }
}

export default function ExtraitDeComptePage() {
  const apiClient = useApiClient()
  const [codeCreance, setCodeCreance] = useState("")
  const [creance, setCreance] = useState<CreanceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayData = useMemo(() => {
    if (!creance) return buildEmptyExtraitDisplayData()

    const pick = (...keys: string[]) => {
      for (const key of keys) {
        const value = creance[key]
        if (value !== null && value !== undefined && value !== "") {
          return value
        }
      }
      return undefined
    }

    const debiteurNom = creance.TYPDEB_CODE === "M"
      ? formatText(creance.DEB_RAIS_SOCIALE)
      : formatText(`${creance.DEB_NOM || ""} ${creance.DEB_PREN || ""}`.trim())

    const codeProduit = formatText(pick("TYPE_TITRE_CODE"))
    const libelleProduit = formatText(pick("PRODUIT_GROUPE_LIB", "PRODUIT_LIB", "TYPE_TITRE_LIB"))

    return {
      codeCreance: formatText(creance.CREAN_CODE),
      debiteurCode: formatText(creance.DEB_CODE),
      debiteurNom,
      groupeCode: formatText(pick("GRP_CREAN_CODE", "GC_CODE")),
      groupeLibelle: formatText(creance.GROUPE_CREANCE_LIB),
      objetCode: formatText(pick("OBJ_CREAN_CODE", "CREAN_OBJET", "OC_CODE")),
      objetLibelle: formatText(creance.OBJET_CREANCE_LIB),
      capitalInitial: formatAmount(creance.CREAN_CAPIT_INIT),
      montantReamenage: formatAmount(pick("CREAN_MONT_A_REMB", "CREAN_MONT_DEBLOQ", "CREAN_MONT_DECAISSE")),
      montantAss: formatAmount(pick("CREAN_MONT_ASS")),
      montantDi: formatAmount(creance.CREAN_MONT_DU),
      tauxIntConv: formatAmount(pick("CREAN_TAUXIC", "CREAN_TAUX_IC"), { round: false }),
      tauxIntRet: formatAmount(pick("CREAN_TAUXIR", "CREAN_TAUX_IR"), { round: false }),
      montantIr: formatAmount(creance.CREAN_MONT_IR),
      dejaRembourse: formatAmount(pick("CREAN_DEJ_REMB")),
      numeroPrec: formatText(pick("CREAN_CODE_PREC", "CREAN_NUM_PREC")),
      numeroAnc: formatText(pick("CREAN_CODE_ANC", "CREAN_NUM_ANC")),
      dateEffet: formatDate(pick("CREAN_DATEFT")),
      dateEcheance: formatDate(pick("CREAN_DATECH", "CREAN_DATE_ECHEANCE")),
      dateOctroi: formatDate(pick("CREAN_DATOCTROI", "CREAN_DATECREA", "CREAN_DATE_CREAT")),
      montantIc: formatAmount(pick("CREAN_MONT_IC")),
      nbEcheances: formatText(creance.CREAN_NBECH),
      numProduit: formatText(creance.CPTE_CLI_NUM),
      codeProduit,
      libelleProduit,
      gestionnaire: formatText(pick("GESTIONNAIRE_NOM", "CREAN_USER_CODE")),
      encours: formatAmount(creance.CREAN_ENCOURS),
      penalite: formatAmount(creance.CREAN_PENALITE),
      soldeInitial: formatAmount(creance.CREAN_SOLDE_INIT),
      recapPaiement: formatAmount(creance.TOT_PAIEMENT),
      recapPenalite: formatAmount(creance.SOLDE_PENALITE),
      recapAutresFrais: formatAmount(creance.SOLDE_AUT_FRAIS),
      recapEchImpayee: formatAmount(creance.ECH_IMP),
      recapEchEncours: formatAmount(creance.ECH_ENCOURS),
      recapPrincipal: formatAmount(creance.SOLDE_PRINC),
      recapSoldeExigible: formatAmount(creance.SOLDE_EXIGIBLE),
    }
  }, [creance])

  const regularisationRows = useMemo((): RegularisationRow[] => {
    if (!creance?.regularisations || creance.regularisations.length === 0) return []

    const sortedRows = [...creance.regularisations].sort((left, right) => {
      const rightRegulDate = getMovementTimestamp(right.REGUL_DATE)
      const leftRegulDate = getMovementTimestamp(left.REGUL_DATE)

      if (rightRegulDate !== leftRegulDate) {
        return rightRegulDate - leftRegulDate
      }

      return getMovementTimestamp(right.REGUL_DATE_CTL) - getMovementTimestamp(left.REGUL_DATE_CTL)
    })

    return sortedRows.map((row, index) => ({
      isHighlighted: index === 0,
      date: formatDate(row.REGUL_DATE),
      heure: row.REGUL_DATE_CTL ? new Date(String(row.REGUL_DATE_CTL)).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) : "-",
      montant: formatAmount(row.REGUL_MONT),
      cumulPaiement: formatAmount(row.PAIEMENT),
      solde: formatAmount(row.SOLDE),
      motif: String(row.REGUL_TYPE_CODE) === "0" ? "Solde initial" : formatText(row.REGUL_MOTIF),
      affectation: formatText(row.AFFECTATION),
    }))
  }, [creance])

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
      const response = await CreanceService.getByCode(apiClient, trimmedCode)
      setCreance(response)
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

  return (
    <div className="bg-white px-4 py-6 text-[14px] text-slate-900 sm:px-6">
      <div className="max-w-[1460px] space-y-4">
        <div>
          <h1 className="text-[28px] font-semibold">Extrait de compte - Créance</h1>
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
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-5 overflow-x-auto">
              <div className="flex min-w-[1260px] items-start gap-5">
                <div className="w-[920px] space-y-2.5">
                <div className="flex items-center gap-3">
                  <LabeledField
                    label="Code Créance"
                    value={displayData.codeCreance}
                    className="w-[228px]"
                    labelClassName="w-[98px]"
                    boxClassName="w-[116px] flex-none"
                    valueClassName="tabular-nums"
                  />
                  <LabeledField
                    label="Débiteur"
                    value={displayData.debiteurCode}
                    className="w-[198px]"
                    labelClassName="w-[74px]"
                    boxClassName="w-[84px] flex-none"
                    valueClassName="tabular-nums"
                  />
                  <DisplayBox value={displayData.debiteurNom} className="flex-1" valueClassName="uppercase" />
                </div>

                <div className="flex items-center gap-3">
                  <LabeledField
                    label="Groupe"
                    value={displayData.groupeCode}
                    className="w-[182px]"
                    labelClassName="w-[74px]"
                    boxClassName="w-[76px] flex-none"
                    valueClassName="tabular-nums"
                  />
                  <DisplayBox value={displayData.groupeLibelle} className="w-[154px] flex-none" />
                  <LabeledField
                    label="Objet"
                    value={displayData.objetCode}
                    className="w-[156px]"
                    labelClassName="w-[48px]"
                    boxClassName="w-[66px] flex-none"
                    valueClassName="tabular-nums"
                  />
                  <DisplayBox value={displayData.objetLibelle} className="flex-1" valueClassName="uppercase" />
                </div>

                <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                  <LabeledField label="Capital Initial" value={displayData.capitalInitial} labelClassName="w-[122px]" valueClassName="tabular-nums" />
                  <LabeledField label="Taux Int. Conv." value={displayData.tauxIntConv} labelClassName="w-[122px]" valueClassName="tabular-nums" />
                  <LabeledField label="Date Effet" value={displayData.dateEffet} labelClassName="w-[100px]" />
                </div>

                <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                  <LabeledField label="Montant réaménagé" value={displayData.montantReamenage} labelClassName="w-[122px]" valueClassName="tabular-nums" />
                  <LabeledField label="Taux Int. Ret." value={displayData.tauxIntRet} labelClassName="w-[122px]" valueClassName="tabular-nums" />
                  <LabeledField label="Date Échéance" value={displayData.dateEcheance} labelClassName="w-[100px]" />
                </div>

                <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                  <LabeledField label="Mont Ass" value={displayData.montantAss} labelClassName="w-[122px]" valueClassName="tabular-nums" />
                  <LabeledField label="Mont Ir" value={displayData.montantIr} labelClassName="w-[122px]" valueClassName="tabular-nums" />
                  <LabeledField label="Mont Ic" value={displayData.montantIc} labelClassName="w-[100px]" valueClassName="tabular-nums" />
                </div>

                <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                  <LabeledField label="Mont Di" value={displayData.montantDi} labelClassName="w-[122px]" valueClassName="tabular-nums" />
                  <LabeledField label="Dél Remb." value={displayData.dejaRembourse} labelClassName="w-[122px]" valueClassName="tabular-nums" />
                  <LabeledField label="Date d'octroi" value={displayData.dateOctroi} labelClassName="w-[100px]" />
                </div>

                <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                  <LabeledField label="N° Prec." value={displayData.numeroPrec} labelClassName="w-[122px]" />
                  <LabeledField label="N° Anc." value={displayData.numeroAnc} labelClassName="w-[122px]" />
                  <LabeledField label="Nb Ech." value={displayData.nbEcheances} labelClassName="w-[100px]" />
                </div>

                <div className="flex items-start gap-3 pt-0.5">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <LabeledField
                        label="num.Prod."
                        value={displayData.numProduit}
                        className="w-[148px]"
                        labelClassName="w-[72px]"
                        boxClassName="w-[56px] flex-none"
                        valueClassName="tabular-nums"
                      />
                      <LabeledField
                        label="Code Produit"
                        value={displayData.codeProduit}
                        className="w-[164px]"
                        labelClassName="w-[86px]"
                        boxClassName="w-[52px] flex-none"
                      />
                      <DisplayBox value={displayData.libelleProduit} className="w-[204px] flex-none" valueClassName="uppercase" />
                    </div>

                    <LabeledField
                      label="Gestionnaire"
                      value={displayData.gestionnaire}
                      className="max-w-[520px]"
                      labelClassName="w-[86px]"
                      valueClassName="uppercase"
                    />
                  </div>

                  <div className="w-[262px] space-y-3">
                    <LabeledField label="Encours" value={displayData.encours} labelClassName="w-[78px]" valueClassName="tabular-nums" />
                    <LabeledField label="Pénalité" value={displayData.penalite} labelClassName="w-[78px]" valueClassName="tabular-nums" />
                    <LabeledField label="Solde Init." value={displayData.soldeInitial} labelClassName="w-[78px]" valueClassName="tabular-nums" />
                  </div>
                </div>

                </div>

                <div className="w-[302px] rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
                  <div className="mb-3 text-[15px] font-semibold text-slate-900">Récapitulatif</div>
                  <div className="space-y-2.5">
                    <RecapRow label="Paiement" value={displayData.recapPaiement} />
                    <RecapRow label="Pénalités" value={displayData.recapPenalite} />
                    <RecapRow label="Autres frais" value={displayData.recapAutresFrais} />
                    <RecapRow label="Ech. Impayée" value={displayData.recapEchImpayee} />
                    <RecapRow label="Ech. Encours" value={displayData.recapEchEncours} />
                    <RecapRow label="Principal" value={displayData.recapPrincipal} />
                    <RecapRow label="Solde exigible" value={displayData.recapSoldeExigible} />
                  </div>
                </div>
              </div>

              <div className="min-w-[1260px] rounded-xl border border-slate-300 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div className="text-[15px] font-semibold text-slate-900">
                    Extrait de compte
                  </div>
                  <Button type="button" className="h-9 rounded-[9px] bg-[#2f6fed] px-4 text-[14px] font-medium text-white hover:bg-[#245ad0]">
                    Exporter
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full min-w-[1180px] border-collapse text-[13px] text-slate-800">
                      <thead className="sticky top-0 z-10 bg-slate-50">
                        <tr className="text-left">
                          <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold">Date</th>
                          <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold">Heure</th>
                          <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold">Montant</th>
                          <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold">Cumul Paiement</th>
                          <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold">Solde</th>
                          <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold">Motif de régularisation</th>
                          <th className="border-b bg-slate-50 px-3 py-2.5 font-semibold">Affectation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regularisationRows.length > 0 ? regularisationRows.map((row, index) => (
                          <tr
                            key={`${row.date}-${row.heure}-${index}`}
                            className={row.isHighlighted ? "bg-red-50 text-red-700" : "odd:bg-white even:bg-slate-50/40"}
                          >
                            <td className="border-r border-t border-slate-200 px-3 py-2.5 font-medium">{row.date}</td>
                            <td className="border-r border-t border-slate-200 px-3 py-2.5 font-medium">{row.heure}</td>
                            <td className="border-r border-t border-slate-200 px-3 py-2.5 text-right font-medium tabular-nums">{row.montant}</td>
                            <td className="border-r border-t border-slate-200 px-3 py-2.5 text-right font-medium tabular-nums">{row.cumulPaiement}</td>
                            <td className="border-r border-t border-slate-200 px-3 py-2.5 text-right font-medium tabular-nums">{row.solde}</td>
                            <td className="border-r border-t border-slate-200 px-3 py-2.5 font-semibold">{row.motif}</td>
                            <td className="border-t border-slate-200 px-3 py-2.5 font-medium">{row.affectation}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={7} className="px-3 py-6 text-center text-slate-500">
                              Aucun mouvement de régularisation trouvé.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
