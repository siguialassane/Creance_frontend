"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { RecuPaiementModal } from "@/components/modals/RecuPaiementModal"
import { useApiClient } from "@/hooks/useApiClient"
import { useTypeEffetsSearchable } from "@/hooks/useTypeEffetsSearchable"
import { useBanquesSearchable } from "@/hooks/useBanquesSearchable"
import { PaiementFactureService } from "@/services/paiement-facture.service"
import { Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function PaiementContratBailPage() {
  const apiClient = useApiClient()
  const [loading, setLoading] = useState(false)
  const [savingPaiement, setSavingPaiement] = useState(false)
  const [contratCharge, setContratCharge] = useState(false)

  // État pour le modal de reçu
  const [showRecuModal, setShowRecuModal] = useState(false)
  const [recuData, setRecuData] = useState<any>(null)

  // Hooks pour les sélections
  const typeEffetsSearchable = useTypeEffetsSearchable()
  const banquesSearchable = useBanquesSearchable()

  // États pour les contrats actifs
  const [contratsActifs, setContratsActifs] = useState<any[]>([])
  const [loadingContrats, setLoadingContrats] = useState(false)

  // États pour la section CONTRAT BAIL
  const [numeroContrat, setNumeroContrat] = useState("")
  const [libelle, setLibelle] = useState("")
  const [numeroLocataire, setNumeroLocataire] = useState("")
  const [nomLocataire, setNomLocataire] = useState("")
  const [groupeCreanceCode, setGroupeCreanceCode] = useState("")
  const [groupeCreanceLibelle, setGroupeCreanceLibelle] = useState("")
  const [numeroLogement, setNumeroLogement] = useState("")
  const [numeroBloc, setNumeroBloc] = useState("")
  const [numeroLot, setNumeroLot] = useState("")
  const [numeroILot, setNumeroILot] = useState("")
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [typeCode, setTypeCode] = useState("")
  const [typeLibelle, setTypeLibelle] = useState("")
  const [caution, setCaution] = useState("")
  const [operation, setOperation] = useState("")
  const [soldeContrat, setSoldeContrat] = useState("")

  // États pour le mode de paiement
  const [modePaiement, setModePaiement] = useState<"EFFET" | "ESPECE" | "">("")

  // États pour le paiement par effet
  const [libellePaiement, setLibellePaiement] = useState("")
  const [montantPaiement, setMontantPaiement] = useState("")
  const [datePaiement, setDatePaiement] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [typeEffetCode, setTypeEffetCode] = useState("")
  const [numeroEffet, setNumeroEffet] = useState("")
  const [banqueAgence, setBanqueAgence] = useState("")
  const [montantEffet, setMontantEffet] = useState("")

  // Date max pour les sélecteurs (aujourd'hui)
  const today = new Date().toISOString().split('T')[0]

  // Fonction pour détecter le type de paiement sélectionné
  const isEffetMode = () => {
    return modePaiement === "EFFET"
  }

  const isEspeceMode = () => {
    return modePaiement === "ESPECE"
  }

  // Fonction pour formater un montant avec séparateurs de milliers
  const formatMontant = (value: string): string => {
    const cleaned = value.replace(/[^\d]/g, '')
    if (!cleaned) return ''
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Fonction pour convertir un montant formaté en nombre
  const parseMontant = (value: string): number | null => {
    const cleaned = value.replace(/\s/g, '').replace(/,/g, '.')
    if (!cleaned) return null
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? null : parsed
  }

  // Fonction pour formater un nombre avec séparateurs de milliers
  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "0"
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Handlers pour les champs de montant avec formatage en temps réel
  const handleMontantPaiementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleaned = inputValue.replace(/\s/g, '')
    const formatted = formatMontant(cleaned)
    setMontantPaiement(formatted)
  }

  const handleMontantEffetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleaned = inputValue.replace(/\s/g, '')
    const formatted = formatMontant(cleaned)
    setMontantEffet(formatted)
  }

  // Charger les contrats actifs au montage du composant
  useEffect(() => {
    const loadContratsActifs = async () => {
      setLoadingContrats(true)
      try {
        const contrats = await PaiementFactureService.getContratsActifs(apiClient)
        setContratsActifs(contrats || [])
      } catch (error) {
        console.error("Erreur lors du chargement des contrats:", error)
        toast.error("Impossible de charger les contrats actifs")
      } finally {
        setLoadingContrats(false)
      }
    }
    loadContratsActifs()
  }, [apiClient])

  // Fonction pour charger les données du contrat
  const handleAfficher = async () => {
    if (!numeroContrat.trim()) {
      toast.error("Veuillez saisir un numéro de contrat")
      return
    }

    setLoading(true)
    try {
      const contratCode = parseInt(numeroContrat.trim())
      if (isNaN(contratCode)) {
        toast.error("Le numéro de contrat doit être un nombre")
        return
      }

      // Charger les données du contrat depuis l'API
      const contratData = await PaiementFactureService.getContratInfo(apiClient, contratCode)

      if (contratData) {
        const contrat = contratData.data || contratData
        setLibelle(contrat.CONT_LIB || "")
        setNumeroLocataire(contrat.LOCAT_CODE?.toString() || "")
        setNomLocataire((contrat.LOCAT_NOM || "") + " " + (contrat.LOCAT_PREN || ""))
        setGroupeCreanceCode(contrat.GRP_CREAN_CODE || "")
        setGroupeCreanceLibelle(contrat.GRP_CREAN_LIB || "")
        // Les informations de logement ne sont pas disponibles dans la requête actuelle
        setNumeroLogement("")
        setNumeroBloc("")
        setNumeroLot("")
        setNumeroILot("")
        setDateDebut(contrat.CONT_DATDEB ? new Date(contrat.CONT_DATDEB).toISOString().split('T')[0] : "")
        setDateFin(contrat.CONT_DATFIN ? new Date(contrat.CONT_DATFIN).toISOString().split('T')[0] : "")
        setTypeCode(contrat.TYPCONT_CODE || "")
        setTypeLibelle(contrat.TYPCONT_LIB || "")
        setCaution("") // Non disponible dans la requête actuelle
        setOperation("") // Non disponible dans la requête actuelle
        setSoldeContrat(formatNumber(contrat.CONT_SOLDE))
        setContratCharge(true)
        toast.success("Contrat chargé avec succès")
      } else {
        toast.error("Contrat introuvable")
        setContratCharge(false)
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement du contrat:", error)
      toast.error(error.response?.data?.message || error.message || "Impossible de charger le contrat")
      setContratCharge(false)
    } finally {
      setLoading(false)
    }
  }

  const handleEnregistrer = async () => {
    // Validation
    if (!numeroContrat.trim()) {
      toast.error("Veuillez d'abord rechercher un contrat")
      return
    }

    if (!modePaiement) {
      toast.error("Veuillez sélectionner un mode de paiement")
      return
    }

    const contratCode = parseInt(numeroContrat.trim())
    if (isNaN(contratCode)) {
      toast.error("Le numéro de contrat doit être un nombre")
      return
    }

    const montantPaiementValue = parseMontant(montantPaiement)
    if (!montantPaiementValue || montantPaiementValue <= 0) {
      toast.error("Veuillez saisir un montant valide")
      return
    }

    if (!libellePaiement.trim()) {
      toast.error("Veuillez saisir un libellé pour le paiement")
      return
    }

    if (!datePaiement) {
      toast.error("Veuillez saisir une date de paiement")
      return
    }

    // Préparer les données
    const paiementData: any = {
      contratCode: contratCode,
      libellePaiement: libellePaiement,
      montantPaiement: montantPaiementValue,
      datePaiement: datePaiement,
      modePaiement: modePaiement
    }

    if (isEffetMode()) {
      // Validations pour le paiement par effet
      if (!typeEffetCode) {
        toast.error("Veuillez sélectionner un type d'effet")
        return
      }
      if (!numeroEffet) {
        toast.error("Veuillez saisir le numéro d'effet")
        return
      }
      if (!banqueAgence) {
        toast.error("Veuillez sélectionner une banque émettrice")
        return
      }

      const montantEffetValue = parseMontant(montantEffet)
      if (!montantEffetValue || montantEffetValue <= 0) {
        toast.error("Veuillez saisir un montant d'effet valide")
        return
      }

      paiementData.typeEffet = typeEffetCode
      paiementData.numeroEffet = numeroEffet
      paiementData.banqueAgence = banqueAgence
      paiementData.montantEffet = montantEffetValue
    }

    // Enregistrement via l'API
    setSavingPaiement(true)
    try {
      const response = await PaiementFactureService.create(apiClient, paiementData)
      console.log("Paiement de facture enregistré:", response)

      // Le backend retourne {paieCode, effetNum, message}
      const recuInfo = {
        paieCode: response.data?.paieCode,      // Code paiement (toujours disponible)
        effetNum: response.data?.effetNum,      // Numéro d'effet (disponible seulement pour paiements par effet)
        numeroPaiement: response.data?.paieCode || response.data?.effetNum || "N/A"
      }

      setRecuData(recuInfo)
      setShowRecuModal(true)
      toast.success("Paiement de facture/loyer enregistré avec succès")

      // Réinitialiser le formulaire de paiement
      setLibellePaiement("")
      setMontantPaiement("")
      setModePaiement("")
      setTypeEffetCode("")
      setNumeroEffet("")
      setBanqueAgence("")
      setMontantEffet("")
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement du paiement:", error)
      toast.error(error.response?.data?.message || error.message || "Impossible d'enregistrer le paiement")
    } finally {
      setSavingPaiement(false)
    }
  }

  const handleCloseRecuModal = () => {
    setShowRecuModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Paiement contrat de bail</h1>
        
        <div className="flex gap-6">
          {/* Contenu principal */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Section CONTRAT BAIL */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">CONTRAT BAIL</h2>
              <div className="space-y-3">
                {/* Nº CONTRAT */}
                <div className="flex items-center">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Nº CONTRAT</Label>
                  <Input
                    value={numeroContrat}
                    onChange={(e) => setNumeroContrat(e.target.value)}
                    className="flex-1 max-w-xs bg-gray-100"
                    placeholder="Saisir le numéro de contrat"
                    disabled={loading}
                  />
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 text-white ml-1"
                    onClick={handleAfficher}
                    disabled={loading || !numeroContrat.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    Afficher
                  </Button>
                </div>

                {/* LIBELLE */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">LIBELLE</Label>
                  <Input
                    value={libelle}
                    className="flex-1 bg-gray-100"
                    readOnly
                    disabled={contratCharge}
                  />
                </div>

                {/* Nº LOCATAIRE et Nom Locataire */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Nº LOCATAIRE</Label>
                  <Input
                    value={numeroLocataire}
                    className="w-28 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-24 flex-shrink-0 ml-2 pr-1">Nom Locataire</Label>
                  <Input
                    value={nomLocataire}
                    className="flex-1 max-w-md bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* GRPE CREANCE */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">GRPE CREANCE</Label>
                  <Input
                    value={groupeCreanceCode}
                    className="w-28 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Input
                    value={groupeCreanceLibelle}
                    className="flex-1 max-w-md bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* Nº LOGEMENT, Nº bloc, Nº Lot, Nº ILot */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Nº LOGEMENT</Label>
                    <Input
                      value={numeroLogement}
                      className="w-28 bg-gray-100"
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-gray-700 w-20 flex-shrink-0 pr-1">Nº bloc</Label>
                    <Input
                      value={numeroBloc}
                      className="w-24 bg-gray-100"
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-gray-700 w-16 flex-shrink-0 pr-1">Nº Lot</Label>
                    <Input
                      value={numeroLot}
                      className="w-24 bg-gray-100"
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-gray-700 w-16 flex-shrink-0 pr-1">Nº ILot</Label>
                    <Input
                      value={numeroILot}
                      className="w-24 bg-gray-100"
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                {/* Date début et Date fin */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Date début</Label>
                  <Input
                    type="date"
                    value={dateDebut}
                    className="w-40 bg-gray-100"
                    readOnly
                    disabled={contratCharge}
                  />
                  <Label className="text-sm font-bold text-gray-700 w-24 flex-shrink-0 ml-4 pr-1">Date fin</Label>
                  <Input
                    type="date"
                    value={dateFin}
                    className="w-40 bg-gray-100"
                    readOnly
                    disabled={contratCharge}
                  />
                </div>

                {/* Type, Caution, Opération */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Type</Label>
                  <Input
                    value={typeCode}
                    className="w-28 bg-gray-100"
                    readOnly
                    disabled={contratCharge}
                  />
                  <Input
                    value={typeLibelle}
                    className="flex-1 max-w-md bg-gray-100"
                    readOnly
                    disabled={contratCharge}
                  />
                  <Label className="text-sm font-bold text-gray-700 w-20 flex-shrink-0 ml-4 pr-1">Caution</Label>
                  <Input
                    value={caution}
                    className="w-32 bg-gray-100"
                    readOnly
                    disabled
                    placeholder="Montant caution"
                  />
                  <Label className="text-sm font-bold text-gray-700 w-24 flex-shrink-0 ml-4 pr-1">Opération</Label>
                  <Input
                    value={operation}
                    className="w-40 bg-gray-100"
                    readOnly
                    disabled={contratCharge}
                  />
                </div>

                {/* Solde Contrat - affiché uniquement si contrat chargé */}
                {contratCharge && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                    <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Solde Contrat</Label>
                    <Input
                      value={soldeContrat}
                      className="w-48 bg-blue-50 font-bold text-blue-700 border-blue-300"
                      readOnly
                      disabled
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section Mode de Paiement */}
            {contratCharge && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Mode de Paiement</h3>
                <div className="flex gap-5">
                  <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    modePaiement === "EFFET"
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="modePaiement"
                      value="EFFET"
                      checked={modePaiement === "EFFET"}
                      onChange={(e) => setModePaiement(e.target.value as any)}
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2"
                    />
                    <span className={`ml-3 text-base font-medium ${
                      modePaiement === "EFFET" ? 'text-orange-700' : 'text-gray-700'
                    }`}>
                      Paiement par Effet
                    </span>
                  </label>

                  <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    modePaiement === "ESPECE"
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="modePaiement"
                      value="ESPECE"
                      checked={modePaiement === "ESPECE"}
                      onChange={(e) => setModePaiement(e.target.value as any)}
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2"
                    />
                    <span className={`ml-3 text-base font-medium ${
                      modePaiement === "ESPECE" ? 'text-orange-700' : 'text-gray-700'
                    }`}>
                      Paiement par Espèce
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Paiement - Pleine largeur (conditionnelle selon le mode) */}
        {isEffetMode() && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
            <h2 className="text-lg font-semibold text-orange-500 mb-4">Paiement par Effet</h2>

            <div className="space-y-3 w-full">
              {/* Libellé Paiement */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Libellé Paiement</Label>
                <Input
                  value={libellePaiement}
                  onChange={(e) => setLibellePaiement(e.target.value)}
                  placeholder="Saisir le libellé du paiement"
                  className="flex-1 min-w-0 bg-white"
                />
              </div>

              {/* Montant Paiement et Date */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant</Label>
                <Input
                  value={montantPaiement}
                  onChange={handleMontantPaiementChange}
                  placeholder="Saisir le montant"
                  className="flex-1 min-w-0 bg-white"
                />
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date</Label>
                <Input
                  type="date"
                  value={datePaiement}
                  onChange={(e) => setDatePaiement(e.target.value)}
                  max={today}
                  className="flex-1 min-w-0 bg-white"
                />
              </div>

              {/* Type Effet */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Type Effet</Label>
                <SearchableSelect
                  value={typeEffetCode}
                  onValueChange={(value) => setTypeEffetCode(value)}
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

              {/* Numéro d'effet (numéro du chèque) */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">N° Effet</Label>
                <Input
                  value={numeroEffet}
                  onChange={(e) => setNumeroEffet(e.target.value)}
                  placeholder="Saisir le numéro du chèque"
                  className="flex-1 min-w-0 bg-white"
                />
              </div>

              {/* Banque Emettrice */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Banque Emettrice</Label>
                <SearchableSelect
                  value={banqueAgence}
                  onValueChange={(value) => setBanqueAgence(value)}
                  items={banquesSearchable.items}
                  placeholder="Sélectionner une banque"
                  emptyMessage="Aucune banque trouvée"
                  searchPlaceholder="Rechercher une banque..."
                  isLoading={banquesSearchable.isLoading}
                  hasMore={banquesSearchable.hasMore}
                  onLoadMore={banquesSearchable.loadMore}
                  isFetchingMore={banquesSearchable.isFetchingMore}
                  onSearchChange={banquesSearchable.setSearch}
                  className="flex-1"
                />
              </div>

              {/* Montant Effet */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant Effet</Label>
                <Input
                  value={montantEffet}
                  onChange={handleMontantEffetChange}
                  placeholder="Saisir le montant de l'effet"
                  className="flex-1 min-w-0 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {isEspeceMode() && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
            <h2 className="text-lg font-semibold text-orange-500 mb-4">Paiement par Espèce</h2>

            <div className="space-y-3 w-full">
              {/* Libellé Paiement */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Libellé Paiement</Label>
                <Input
                  value={libellePaiement}
                  onChange={(e) => setLibellePaiement(e.target.value)}
                  placeholder="Saisir le libellé du paiement"
                  className="flex-1 min-w-0 bg-white"
                />
              </div>

              {/* Montant Paiement et Date paiement */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant</Label>
                <Input
                  value={montantPaiement}
                  onChange={handleMontantPaiementChange}
                  placeholder="Saisir le montant du paiement"
                  className="flex-1 min-w-0 bg-white"
                />
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date</Label>
                <Input
                  type="date"
                  value={datePaiement}
                  onChange={(e) => setDatePaiement(e.target.value)}
                  max={today}
                  className="flex-1 min-w-0 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Boutons en bas - affichés seulement si un formulaire est visible */}
        {modePaiement && (
          <div className="flex justify-end items-center mt-6">
            <Button
              onClick={handleEnregistrer}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={savingPaiement}
            >
              {savingPaiement ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        )}

        {/* Modal de reçu */}
        {showRecuModal && recuData && (
          <RecuPaiementModal
            open={showRecuModal}
            onClose={handleCloseRecuModal}
            title="Reçu de Paiement de Facture/Loyer"
            data={recuData}
          />
        )}
      </div>
    </div>
  )
}

