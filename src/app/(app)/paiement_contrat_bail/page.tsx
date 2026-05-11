"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { RecuPaiementModal } from "@/components/modals/RecuPaiementModal"
import { useApiClient } from "@/hooks/useApiClient"
import { useTypeEffetsSearchable } from "@/hooks/useTypeEffetsSearchable"
import { useAgencesBanqueSearchable } from "@/hooks/useAgencesBanqueSearchable"
import { PaiementFraisService, ModePaiementFrais } from "@/services/paiement-frais.service"
import { Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function PaiementContratBailPage() {
  const apiClient = useApiClient()
  const [loading, setLoading] = useState(false)
  const [savingFrais, setSavingFrais] = useState(false)
  const [savingPaiement, setSavingPaiement] = useState(false)
  const [contratCharge, setContratCharge] = useState(false)
  const isSubmittingRef = useRef(false)

  // État pour le modal de reçu
  const [showRecuModal, setShowRecuModal] = useState(false)
  const [recuData, setRecuData] = useState<any>(null)

  // Hooks pour les sélections
  const typeEffetsSearchable = useTypeEffetsSearchable()
  const agencesSearchable = useAgencesBanqueSearchable(null)

  // États pour la section CONTRAT BAIL
  const [numeroContrat, setNumeroContrat] = useState("")
  const [libelle, setLibelle] = useState("")
  const [numeroLocataire, setNumeroLocataire] = useState("")
  const [numeroLogement, setNumeroLogement] = useState("")
  const [libelleLogement, setLibelleLogement] = useState("")
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [typeCode, setTypeCode] = useState("")
  const [typeLibelle, setTypeLibelle] = useState("")
  const [caution, setCaution] = useState("")
  const [soldeContrat, setSoldeContrat] = useState("")

  // États pour les types de frais et frais non payés
  const [typesFrais, setTypesFrais] = useState<any[]>([])
  const [loadingTypesFrais, setLoadingTypesFrais] = useState(false)
  const [fraisNonPayes, setFraisNonPayes] = useState<any[]>([])
  const [loadingFraisNonPayes, setLoadingFraisNonPayes] = useState(false)

  // Workflow: "CREATE" = créer un frais, "PAY" = payer un frais existant
  const [workflow, setWorkflow] = useState<"CREATE" | "PAY" | "">("")

  // États pour la création d'un frais
  const [typeFraisCode, setTypeFraisCode] = useState("")
  const [montantFrais, setMontantFrais] = useState("")
  const [libelleFrais, setLibelleFrais] = useState("")

  // États pour le paiement
  const [fraisCode, setFraisCode] = useState("")
  const [fraisSelectionne, setFraisSelectionne] = useState<any>(null)
  const [recuManuel, setRecuManuel] = useState("")
  const [montantPaye, setMontantPaye] = useState("")
  const [datePaiement, setDatePaiement] = useState(() => new Date().toISOString().split('T')[0])
  const [modePaiement, setModePaiement] = useState<ModePaiementFrais | "">("")

  // États pour le paiement par effet
  const [typeEffetCode, setTypeEffetCode] = useState("")
  const [numeroEffet, setNumeroEffet] = useState("")
  const [banqueAgence, setBanqueAgence] = useState("")
  const [montantEffet, setMontantEffet] = useState("")

  const today = new Date().toISOString().split('T')[0]

  const formatMontant = (value: string): string => {
    const cleaned = value.replace(/[^\d]/g, '')
    if (!cleaned) return ''
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const parseMontant = (value: string): number | null => {
    const cleaned = value.replace(/\s/g, '').replace(/,/g, '.')
    if (!cleaned) return null
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? null : parsed
  }

  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "0"
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const loadTypesFrais = async () => {
    setLoadingTypesFrais(true)
    try {
      const response = await PaiementFraisService.getTypeFrais(apiClient)
      const types = Array.isArray(response) ? response : (response?.data || [])
      setTypesFrais(types)
    } catch (error) {
      console.error("Erreur chargement types de frais:", error)
      setTypesFrais([])
    } finally {
      setLoadingTypesFrais(false)
    }
  }

  const loadFraisNonPayes = async (contCode: number) => {
    setLoadingFraisNonPayes(true)
    try {
      const response = await PaiementFraisService.getFraisNonPayesBail(apiClient, contCode)
      const frais = Array.isArray(response) ? response : (response?.data || [])
      setFraisNonPayes(frais)
    } catch (error) {
      console.error("Erreur chargement frais non payés bail:", error)
      setFraisNonPayes([])
    } finally {
      setLoadingFraisNonPayes(false)
    }
  }

  const handleAfficher = async () => {
    if (!numeroContrat.trim()) {
      toast.error("Veuillez saisir un numéro de contrat")
      return
    }
    const contCode = parseInt(numeroContrat.trim())
    if (isNaN(contCode)) {
      toast.error("Le numéro de contrat doit être un nombre")
      return
    }

    setLoading(true)
    try {
      const response = await PaiementFraisService.getBailDetails(apiClient, contCode)
      const contrat = response?.data || response

      setLibelle(contrat.CONT_LIB || "")
      setNumeroLocataire(contrat.LOCAT_CODE?.toString() || "")
      setNumeroLogement(contrat.LOGE_CODE?.toString() || "")
      setLibelleLogement(contrat.LOGE_LIB || "")
      setDateDebut(contrat.CONT_DATDEB ? new Date(contrat.CONT_DATDEB).toISOString().split('T')[0] : "")
      setDateFin(contrat.CONT_DATFIN ? new Date(contrat.CONT_DATFIN).toISOString().split('T')[0] : "")
      setTypeCode(contrat.TYPCONT_CODE || "")
      setTypeLibelle(contrat.TYPCONT_LIB || "")
      setCaution(formatNumber(contrat.CONT_CAUTION))
      setSoldeContrat(formatNumber(contrat.CONT_SOLDE))
      setContratCharge(true)

      await Promise.all([loadTypesFrais(), loadFraisNonPayes(contCode)])
      toast.success("Contrat chargé avec succès")
    } catch (error: any) {
      console.error("Erreur lors du chargement du contrat:", error)
      toast.error(error.response?.data?.message || error.message || "Impossible de charger le contrat")
      setContratCharge(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCreerFrais = async () => {
    if (!typeFraisCode) { toast.error("Veuillez sélectionner un type de frais"); return }
    const montantVal = parseMontant(montantFrais)
    if (!montantVal || montantVal <= 0) { toast.error("Veuillez saisir un montant valide"); return }
    if (!libelleFrais.trim()) { toast.error("Veuillez saisir un libellé"); return }

    setSavingFrais(true)
    try {
      await PaiementFraisService.createFrais(apiClient, {
        contCode: parseInt(numeroContrat),
        typeFrais: typeFraisCode,
        montant: montantVal,
        libelle: libelleFrais,
      })
      toast.success("Frais créé avec succès")
      setTypeFraisCode("")
      setMontantFrais("")
      setLibelleFrais("")
      await loadFraisNonPayes(parseInt(numeroContrat))
      setWorkflow("PAY")
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Impossible de créer le frais")
    } finally {
      setSavingFrais(false)
    }
  }

  const handlePayerFrais = async () => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true

    const validationError = (msg: string) => { toast.error(msg); isSubmittingRef.current = false }

    if (!fraisCode) return validationError("Veuillez sélectionner un frais à payer")
    const montantVal = parseMontant(montantPaye)
    if (!montantVal || montantVal <= 0) return validationError("Veuillez saisir un montant valide")
    if (!modePaiement) return validationError("Veuillez sélectionner un mode de paiement")

    const paiementData: any = {
      fraisCode: parseInt(fraisCode),
      contCode: parseInt(numeroContrat),
      montantPaye: montantVal,
      datePaiement,
      modePaiement,
      ...(recuManuel.trim() && { recuManuel }),
    }

    if (modePaiement === "EFFET") {
      if (!typeEffetCode) return validationError("Veuillez sélectionner un type d'effet")
      if (!numeroEffet) return validationError("Veuillez saisir le numéro d'effet")
      if (!banqueAgence) return validationError("Veuillez sélectionner une agence émettrice")
      const montantEffetVal = parseMontant(montantEffet)
      if (!montantEffetVal || montantEffetVal <= 0) return validationError("Veuillez saisir un montant d'effet valide")
      paiementData.typeEffet = typeEffetCode
      paiementData.numeroEffet = numeroEffet
      paiementData.banqueAgence = banqueAgence
      paiementData.montantEffet = montantEffetVal
    }

    setSavingPaiement(true)
    try {
      const response = await PaiementFraisService.create(apiClient, paiementData)
      setRecuData({
        fraisCode: response.data?.fraisCode,
        effetNum: response.data?.effetNum,
        numeroPaiement: response.data?.effetNum || response.data?.fraisCode || "N/A",
      })
      setShowRecuModal(true)
      toast.success("Paiement enregistré avec succès")

      setFraisCode("")
      setFraisSelectionne(null)
      setRecuManuel("")
      setMontantPaye("")
      setModePaiement("")
      setTypeEffetCode("")
      setNumeroEffet("")
      setBanqueAgence("")
      setMontantEffet("")
      await loadFraisNonPayes(parseInt(numeroContrat))
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Impossible d'enregistrer le paiement")
    } finally {
      setSavingPaiement(false)
      isSubmittingRef.current = false
    }
  }

  const safeTypesFrais = Array.isArray(typesFrais) ? typesFrais : []

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Paiement contrat de bail</h1>

        {/* Section CONTRAT BAIL */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">CONTRAT BAIL</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Nº CONTRAT</Label>
              <Input
                value={numeroContrat}
                onChange={(e) => setNumeroContrat(e.target.value)}
                className="flex-1 max-w-xs bg-gray-100"
                placeholder="Saisir le numéro de contrat"
                disabled={loading || contratCharge}
              />
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white ml-1"
                onClick={handleAfficher}
                disabled={loading || !numeroContrat.trim() || contratCharge}
              >
                {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Eye className="h-4 w-4 mr-1" />}
                Afficher
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">LIBELLE</Label>
              <Input value={libelle} className="flex-1 bg-gray-100" readOnly disabled />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Nº LOCATAIRE</Label>
              <Input value={numeroLocataire} className="w-28 bg-gray-100" readOnly disabled />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Nº LOGEMENT</Label>
              <Input value={numeroLogement} className="w-28 bg-gray-100" readOnly disabled />
              <Input value={libelleLogement} className="flex-1 max-w-md bg-gray-100" readOnly disabled />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Date début</Label>
              <Input type="date" value={dateDebut} className="w-40 bg-gray-100" readOnly disabled />
              <Label className="text-sm font-bold text-gray-700 w-24 flex-shrink-0 ml-4 pr-1">Date fin</Label>
              <Input type="date" value={dateFin} className="w-40 bg-gray-100" readOnly disabled />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Type</Label>
              <Input value={typeCode} className="w-28 bg-gray-100" readOnly disabled />
              <Input value={typeLibelle} className="flex-1 max-w-md bg-gray-100" readOnly disabled />
              <Label className="text-sm font-bold text-gray-700 w-20 flex-shrink-0 ml-4 pr-1">Caution</Label>
              <Input value={caution} className="w-32 bg-gray-100" readOnly disabled />
            </div>

            {contratCharge && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Solde Contrat</Label>
                <Input value={soldeContrat} className="w-48 bg-blue-50 font-bold text-blue-700 border-blue-300" readOnly disabled />
              </div>
            )}
          </div>
        </div>

        {/* Sélection du workflow */}
        {contratCharge && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Action sur les Frais</h3>
            <div className="flex gap-5">
              {([
                { value: "CREATE", label: "Créer un frais" },
                { value: "PAY",    label: "Payer un frais existant" },
              ] as { value: "CREATE" | "PAY"; label: string }[]).map(({ value, label }) => (
                <label key={value} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  workflow === value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="workflow"
                    value={value}
                    checked={workflow === value}
                    onChange={(e) => setWorkflow(e.target.value as "CREATE" | "PAY")}
                    className="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2"
                  />
                  <span className={`ml-3 text-base font-medium ${workflow === value ? 'text-orange-700' : 'text-gray-700'}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Création d'un frais */}
        {workflow === "CREATE" && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-orange-500">Création d'un Frais</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Type de frais</Label>
                <Select value={typeFraisCode} onValueChange={setTypeFraisCode}>
                  <SelectTrigger className="flex-1 bg-white">
                    <SelectValue placeholder="Sélectionner un type de frais" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingTypesFrais ? (
                      <div className="flex items-center justify-center py-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
                    ) : safeTypesFrais.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">Aucun type disponible</div>
                    ) : safeTypesFrais.map((type) => (
                      <SelectItem key={type.TYPFRAIS_CODE} value={type.TYPFRAIS_CODE}>
                        {type.TYPFRAIS_CODE} - {type.TYPFRAIS_LIB}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant</Label>
                <Input
                  value={montantFrais}
                  onChange={(e) => setMontantFrais(formatMontant(e.target.value.replace(/\s/g, '')))}
                  placeholder="Saisir le montant"
                  className="flex-1 bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Libellé</Label>
                <Input
                  value={libelleFrais}
                  onChange={(e) => setLibelleFrais(e.target.value)}
                  placeholder="Saisir le libellé du frais"
                  className="flex-1 bg-white"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCreerFrais} className="bg-orange-500 hover:bg-orange-600 text-white" disabled={savingFrais}>
                {savingFrais ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Création...</> : "Créer le frais"}
              </Button>
            </div>
          </div>
        )}

        {/* Paiement d'un frais */}
        {workflow === "PAY" && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mb-6">
              <h2 className="text-lg font-semibold text-orange-500">Paiement d'un Frais</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Frais à payer</Label>
                  <Select
                    value={fraisCode}
                    onValueChange={(value) => {
                      setFraisCode(value)
                      setFraisSelectionne(fraisNonPayes.find((f) => f.FRAIS_CODE?.toString() === value) || null)
                    }}
                  >
                    <SelectTrigger className="flex-1 bg-white">
                      <SelectValue placeholder="Sélectionner un frais non payé" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingFraisNonPayes ? (
                        <div className="flex items-center justify-center py-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
                      ) : fraisNonPayes.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Aucun frais non payé</div>
                      ) : fraisNonPayes.map((frais) => (
                        <SelectItem key={frais.FRAIS_CODE} value={frais.FRAIS_CODE?.toString()}>
                          Frais #{frais.FRAIS_CODE} - {frais.TYPFRAIS_LIB} - Reste: {formatNumber(frais.FRAIS_RESTE_A_PAY)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {fraisSelectionne && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Type:</span>
                      <span>{fraisSelectionne.TYPFRAIS_LIB}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Montant total:</span>
                      <span>{formatNumber(fraisSelectionne.FRAIS_MONT)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Reste à payer:</span>
                      <span className="text-orange-600 font-bold">{formatNumber(fraisSelectionne.FRAIS_RESTE_A_PAY)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Nº Reçu Manuel</Label>
                  <Input
                    value={recuManuel}
                    onChange={(e) => setRecuManuel(e.target.value)}
                    placeholder="Optionnel"
                    className="flex-1 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant à payer</Label>
                  <Input
                    value={montantPaye}
                    onChange={(e) => setMontantPaye(formatMontant(e.target.value.replace(/\s/g, '')))}
                    placeholder="Saisir le montant"
                    className="flex-1 bg-white"
                  />
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date paiement</Label>
                  <Input
                    type="date"
                    value={datePaiement}
                    onChange={(e) => setDatePaiement(e.target.value)}
                    max={today}
                    className="flex-1 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Mode de Paiement */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mode de Paiement</h3>
              <div className="flex flex-wrap gap-3">
                {([
                  { value: "ESPECE",   label: "Espèces" },
                  { value: "CHEQUE",   label: "Chèque" },
                  { value: "TRAITE",   label: "Traite" },
                  { value: "VIREMENT", label: "Virement" },
                  { value: "EFFET",    label: "Effet" },
                  { value: "BANQUE",   label: "Banque" },
                  { value: "OVP",      label: "OVP" },
                ] as { value: ModePaiementFrais; label: string }[]).map(({ value, label }) => (
                  <label key={value} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    modePaiement === value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="modePaiement"
                      value={value}
                      checked={modePaiement === value}
                      onChange={(e) => setModePaiement(e.target.value as ModePaiementFrais)}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 focus:ring-2"
                    />
                    <span className={`ml-2 text-sm font-medium ${modePaiement === value ? 'text-orange-700' : 'text-gray-700'}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Détails effet */}
            {modePaiement === "EFFET" && (
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mb-6">
                <h2 className="text-lg font-semibold text-orange-500">Détails du Paiement par Effet</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Type Effet</Label>
                    <SearchableSelect
                      value={typeEffetCode}
                      onValueChange={setTypeEffetCode}
                      items={typeEffetsSearchable.items}
                      placeholder="Sélectionner un type d'effet"
                      emptyMessage="Aucun type trouvé"
                      searchPlaceholder="Rechercher un type..."
                      isLoading={typeEffetsSearchable.isLoading}
                      hasMore={typeEffetsSearchable.hasMore}
                      onLoadMore={typeEffetsSearchable.loadMore}
                      isFetchingMore={typeEffetsSearchable.isFetchingMore}
                      onSearchChange={typeEffetsSearchable.setSearch}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">N° Effet</Label>
                    <Input
                      value={numeroEffet}
                      onChange={(e) => setNumeroEffet(e.target.value)}
                      placeholder="Saisir le numéro d'effet"
                      className="flex-1 bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Agence Emettrice</Label>
                    <SearchableSelect
                      value={banqueAgence}
                      onValueChange={setBanqueAgence}
                      items={agencesSearchable.items}
                      placeholder="Sélectionner une agence"
                      emptyMessage="Aucune agence trouvée"
                      searchPlaceholder="Rechercher une agence..."
                      isLoading={agencesSearchable.isLoading}
                      hasMore={agencesSearchable.hasMore}
                      onLoadMore={agencesSearchable.loadMore}
                      isFetchingMore={agencesSearchable.isFetchingMore}
                      onSearchChange={agencesSearchable.setSearch}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant Effet</Label>
                    <Input
                      value={montantEffet}
                      onChange={(e) => setMontantEffet(formatMontant(e.target.value.replace(/\s/g, '')))}
                      placeholder="Saisir le montant de l'effet"
                      className="flex-1 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {modePaiement && (
              <div className="flex justify-end">
                <Button onClick={handlePayerFrais} className="bg-orange-500 hover:bg-orange-600 text-white" disabled={savingPaiement}>
                  {savingPaiement ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enregistrement...</> : "Enregistrer le paiement"}
                </Button>
              </div>
            )}
          </>
        )}

        {showRecuModal && recuData && (
          <RecuPaiementModal
            open={showRecuModal}
            onClose={() => setShowRecuModal(false)}
            title="Reçu de Paiement de Frais Bail"
            data={recuData}
          />
        )}
      </div>
    </div>
  )
}
