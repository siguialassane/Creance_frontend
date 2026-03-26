"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { RecuPaiementModal } from "@/components/modals/RecuPaiementModal"
import { useApiClient } from "@/hooks/useApiClient"
import { useTypeEffetsSearchable } from "@/hooks/useTypeEffetsSearchable"
import { useBanquesSearchable } from "@/hooks/useBanquesSearchable"
import { useSessionWrapper } from "@/hooks/useSessionWrapper"
import { CreanceService } from "@/services/creance.service"
import { PaiementFraisService } from "@/services/paiement-frais.service"
import { CreanceResponse } from "@/types/creance"
import { usePeriodicites } from "@/hooks/usePeriodicites"
import { Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function PaiementDesFraisPage() {
  const apiClient = useApiClient()
  const { data: session } = useSessionWrapper()
  const [loading, setLoading] = useState(false)
  const [savingFrais, setSavingFrais] = useState(false)
  const [savingPaiement, setSavingPaiement] = useState(false)
  const { data: periodicites } = usePeriodicites()

  // État pour le modal de reçu
  const [showRecuModal, setShowRecuModal] = useState(false)
  const [recuData, setRecuData] = useState<any>(null)

  // Hooks pour les sélections
  const typeEffetsSearchable = useTypeEffetsSearchable()
  const banquesSearchable = useBanquesSearchable()

  // États pour la section CREANCE
  const [codeCreance, setCodeCreance] = useState("")
  const [debiteurCode, setDebiteurCode] = useState("")
  const [debiteurLibelle, setDebiteurLibelle] = useState("")
  const [groupeCreanceCode, setGroupeCreanceCode] = useState("")
  const [groupeCreanceLibelle, setGroupeCreanceLibelle] = useState("")
  const [objetCode, setObjetCode] = useState("")
  const [objetLibelle, setObjetLibelle] = useState("")
  const [periodiciteCode, setPeriodiciteCode] = useState("")
  const [periodiciteLibelle, setPeriodiciteLibelle] = useState("")
  const [montantDebloque, setMontantDebloque] = useState("")
  const [nbEch, setNbEch] = useState("")
  const [dateFinEch, setDateFinEch] = useState("")
  const [capitalInitial, setCapitalInitial] = useState("")
  const [datePremiereEch, setDatePremiereEch] = useState("")
  const [dateOctroi, setDateOctroi] = useState("")
  const [duree, setDuree] = useState("")
  const [statut, setStatut] = useState("")
  const [tauxIR, setTauxIR] = useState("")
  const [tauxIC, setTauxIC] = useState("")
  const [soldeDate, setSoldeDate] = useState("")
  const [soldeMontant, setSoldeMontant] = useState("")
  const [creanceCharge, setCreanceCharge] = useState(false)

  // États pour les types de frais et frais non payés
  const [typesFrais, setTypesFrais] = useState<any[]>([])
  const [loadingTypesFrais, setLoadingTypesFrais] = useState(false)
  const [fraisNonPayes, setFraisNonPayes] = useState<any[]>([])
  const [loadingFraisNonPayes, setLoadingFraisNonPayes] = useState(false)

  // S'assurer que typesFrais est toujours un tableau
  const safeTypesFrais = Array.isArray(typesFrais) ? typesFrais : []

  // États pour le workflow: "CREATE" ou "PAY"
  const [workflow, setWorkflow] = useState<"CREATE" | "PAY" | "">("")

  // États pour la création d'un frais
  const [typeFraisCode, setTypeFraisCode] = useState("")
  const [montantFrais, setMontantFrais] = useState("")
  const [libelleFrais, setLibelleFrais] = useState("")

  // États pour le paiement d'un frais existant
  const [fraisCode, setFraisCode] = useState("")
  const [fraisSelectionne, setFraisSelectionne] = useState<any>(null)
  const [numeroRecuManuel, setNumeroRecuManuel] = useState("")
  const [montantPaye, setMontantPaye] = useState("")
  const [datePaiementFrais, setDatePaiementFrais] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  // États pour le mode de paiement
  const [modePaiement, setModePaiement] = useState<"EFFET" | "ESPECE" | "">("")

  // États pour le paiement par effet
  const [typeEffetCode, setTypeEffetCode] = useState("")
  const [numeroEffet, setNumeroEffet] = useState("")
  const [banqueAgence, setBanqueAgence] = useState("")
  const [montantEffet, setMontantEffet] = useState("")

  // États pour le paiement par aval
  const [typePayeur, setTypePayeur] = useState<"DEBITEUR_PRINCIPAL" | "AVAL">("DEBITEUR_PRINCIPAL")
  const [garantiePhysCode, setGarantiePhysCode] = useState("")
  const [garantiesPhysiques, setGarantiesPhysiques] = useState<any[]>([])
  const [loadingGaranties, setLoadingGaranties] = useState(false)

  // Date max pour les sélecteurs (aujourd'hui)
  const today = new Date().toISOString().split('T')[0]

  // Fonction pour détecter le type de paiement sélectionné
  const isEffetMode = () => {
    return modePaiement === "EFFET"
  }

  const isEspeceMode = () => {
    return modePaiement === "ESPECE"
  }

  // Fonction pour formater une date au format "DD/MM/YYYY"
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return dateString
    }
  }

  // Fonction pour formater une date au format "DD/MM/YYYY"
  const formatDateShort = (dateString: string | undefined): string => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return dateString
    }
  }

  // Fonction pour formater un nombre avec espaces
  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null) return ""
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
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

  // Charger les types de frais depuis l'API
  const loadTypesFrais = async () => {
    setLoadingTypesFrais(true)
    try {
      const response = await PaiementFraisService.getTypeFrais(apiClient)
      // Extraire les données du format ApiResult
      const types = Array.isArray(response) ? response : (response?.data || [])
      setTypesFrais(types)
    } catch (error) {
      console.error("Erreur lors du chargement des types de frais:", error)
      toast.error("Impossible de charger les types de frais")
      setTypesFrais([]) // S'assurer que c'est toujours un tableau
    } finally {
      setLoadingTypesFrais(false)
    }
  }

  // Charger les frais non payés pour la créance
  const loadFraisNonPayes = async () => {
    if (!codeCreance.trim()) {
      return
    }

    setLoadingFraisNonPayes(true)
    try {
      const response = await PaiementFraisService.getFraisNonPayes(apiClient, codeCreance)
      // Extraire les données du format ApiResult
      const frais = Array.isArray(response) ? response : (response?.data || [])
      setFraisNonPayes(frais)
    } catch (error) {
      console.error("Erreur lors du chargement des frais non payés:", error)
      toast.error("Impossible de charger les frais non payés")
      setFraisNonPayes([]) // S'assurer que c'est toujours un tableau
    } finally {
      setLoadingFraisNonPayes(false)
    }
  }

  // Charger les garanties physiques (avals) pour la créance
  const loadGarantiesPhysiques = async () => {
    if (!codeCreance.trim()) return

    setLoadingGaranties(true)
    try {
      // Utiliser le service de créance M3 pour récupérer les avals
      const { PaiementCreanceService } = await import("@/services/paiement-creance.service")
      const garanties = await PaiementCreanceService.getGarantiesPhysiques(apiClient, codeCreance)
      setGarantiesPhysiques(garanties || [])
    } catch (error) {
      console.error("Erreur lors du chargement des garanties:", error)
    } finally {
      setLoadingGaranties(false)
    }
  }

  // Handlers pour les champs de montant avec formatage en temps réel
  const handleMontantFraisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleaned = inputValue.replace(/\s/g, '')
    const formatted = formatMontant(cleaned)
    setMontantFrais(formatted)
  }

  const handleMontantPayeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleaned = inputValue.replace(/\s/g, '')
    const formatted = formatMontant(cleaned)
    setMontantPaye(formatted)
  }

  const handleMontantEffetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleaned = inputValue.replace(/\s/g, '')
    const formatted = formatMontant(cleaned)
    setMontantEffet(formatted)
  }

  // Fonction pour charger les données de la créance
  const handleAfficher = async () => {
    if (!codeCreance.trim()) {
      toast.error("Veuillez saisir un code créance")
      return
    }

    setLoading(true)
    try {
      const creanceData: CreanceResponse = await CreanceService.getByCode(apiClient, codeCreance.trim())
      
      // Remplir les champs avec les données récupérées
      setDebiteurCode(creanceData.DEB_CODE || "")
      setDebiteurLibelle(
        creanceData.TYPDEB_CODE === 'M' 
          ? creanceData.DEB_RAIS_SOCIALE || ""
          : `${creanceData.DEB_NOM || ""} ${creanceData.DEB_PREN || ""}`.trim()
      )

      const groupeCode = creanceData.GRP_CREAN_CODE || creanceData.GC_CODE || ""
      setGroupeCreanceCode(groupeCode)
      setGroupeCreanceLibelle(creanceData.GROUPE_CREANCE_LIB || "")

      const objetCodeValue = creanceData.OBJ_CREAN_CODE || creanceData.OC_CODE || ""
      setObjetCode(objetCodeValue)
      setObjetLibelle(creanceData.OBJET_CREANCE_LIB || "")

      setPeriodiciteCode(creanceData.PERIOD_CODE || "")
      const periodicite = periodicites?.find((p: any) => (p.PER_CODE || p.code) === creanceData.PERIOD_CODE)
      if (periodicite) {
        setPeriodiciteLibelle(periodicite.PER_LIB || periodicite.libelle || "")
      }

      setMontantDebloque(formatNumber(creanceData.CREAN_MONT_DECAISSE))
      setNbEch(creanceData.CREAN_NBECH ? `${creanceData.CREAN_NBECH} ECH. DE ${formatNumber(creanceData.CREAN_MONT_A_REMB)}` : "")
      
      if (creanceData.CREAN_DATE_ECHEANCE || creanceData.CREAN_DATECH) {
        const dateEch = new Date(creanceData.CREAN_DATE_ECHEANCE || creanceData.CREAN_DATECH || "")
        setDateFinEch(dateEch.toISOString().split('T')[0])
      }

      setCapitalInitial(formatNumber(creanceData.CREAN_CAPIT_INIT))
      setDatePremiereEch(formatDate(creanceData.CREAN_DATE_DEBLOCAGE))
      setDateOctroi(formatDate(creanceData.CREAN_DATE_CREAT))
      setDuree(creanceData.CREAN_DUREE?.toString() || "")
      
      const today = new Date()
      setSoldeDate(formatDateShort(today.toISOString()))
      setSoldeMontant(formatNumber(creanceData.CREAN_TOT_SOLDE || 0))

      setCreanceCharge(true)

      // Charger les données supplémentaires
      await loadTypesFrais()
      await loadFraisNonPayes()
      await loadGarantiesPhysiques()

      toast.success("Créance chargée avec succès")
    } catch (error: any) {
      console.error("Erreur lors du chargement de la créance:", error)
      toast.error(error.message || "Impossible de charger la créance")
      setCreanceCharge(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCreerFrais = async () => {
    // Validation
    if (!codeCreance.trim()) {
      toast.error("Veuillez d'abord rechercher une créance")
      return
    }

    if (!typeFraisCode) {
      toast.error("Veuillez sélectionner un type de frais")
      return
    }

    const montantFraisValue = parseMontant(montantFrais)
    if (!montantFraisValue || montantFraisValue <= 0) {
      toast.error("Veuillez saisir un montant valide")
      return
    }

    if (!libelleFrais.trim()) {
      toast.error("Veuillez saisir un libellé pour le frais")
      return
    }

    // Créer le frais
    setSavingFrais(true)
    try {
      const response = await PaiementFraisService.createFrais(apiClient, {
        creanceCode: codeCreance,
        typeFrais: typeFraisCode,
        montant: montantFraisValue,
        libelle: libelleFrais
      })

      console.log("Frais créé:", response)
      toast.success("Frais créé avec succès")

      // Réinitialiser le formulaire de création
      setTypeFraisCode("")
      setMontantFrais("")
      setLibelleFrais("")

      // Recharger les frais non payés
      await loadFraisNonPayes()

      // Basculer vers le workflow de paiement
      setWorkflow("PAY")
    } catch (error: any) {
      console.error("Erreur lors de la création du frais:", error)
      toast.error(error.response?.data?.message || error.message || "Impossible de créer le frais")
    } finally {
      setSavingFrais(false)
    }
  }

  const handlePayerFrais = async () => {
    // Validation
    if (!codeCreance.trim()) {
      toast.error("Veuillez d'abord rechercher une créance")
      return
    }

    if (!fraisCode) {
      toast.error("Veuillez sélectionner un frais à payer")
      return
    }

    const montantPayeValue = parseMontant(montantPaye)
    if (!montantPayeValue || montantPayeValue <= 0) {
      toast.error("Veuillez saisir un montant valide")
      return
    }

    if (!modePaiement) {
      toast.error("Veuillez sélectionner un mode de paiement")
      return
    }

    if (!numeroRecuManuel.trim()) {
      toast.error("Veuillez saisir le numéro de reçu manuel")
      return
    }

    // Préparer les données
    const paiementData: any = {
      creanceCode: codeCreance,
      fraisCode: parseInt(fraisCode),
      recuManuel: numeroRecuManuel,
      montantPaye: montantPayeValue,
      datePaiement: datePaiementFrais,
      modePaiement: modePaiement,
      typePayeur: typePayeur
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

    // Validation paiement par aval
    if (typePayeur === "AVAL") {
      if (!garantiePhysCode) {
        toast.error("Veuillez sélectionner un aval (garantie physique)")
        return
      }
      paiementData.garantiePhysCode = parseInt(garantiePhysCode)
    }

    // Enregistrement via l'API
    setSavingPaiement(true)
    try {
      const response = await PaiementFraisService.create(apiClient, paiementData)
      console.log("Paiement de frais enregistré:", response)

      // Le backend retourne {fraisCode, effetNum, creanceCode, message}
      // Pour le reçu, on utilise effetNum si disponible (paiement par effet), sinon fraisCode
      const recuInfo = {
        effetNum: response.data?.effetNum,        // Numéro d'effet (disponible seulement pour paiements par effet)
        fraisCode: response.data?.fraisCode,      // Code frais (utilisé si pas d'effetNum)
        numeroPaiement: response.data?.effetNum || response.data?.fraisCode || "N/A"
      }

      setRecuData(recuInfo)
      setShowRecuModal(true)
      toast.success("Paiement de frais enregistré avec succès")

      // Réinitialiser le formulaire
      setFraisCode("")
      setFraisSelectionne(null)
      setNumeroRecuManuel("")
      setMontantPaye("")
      setModePaiement("")
      setTypeEffetCode("")
      setNumeroEffet("")
      setBanqueAgence("")
      setMontantEffet("")
      setTypePayeur("DEBITEUR_PRINCIPAL")
      setGarantiePhysCode("")

      // Recharger les frais non payés
      await loadFraisNonPayes()
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Paiement des frais</h1>
        
        <div className="flex gap-6">
          {/* Contenu principal */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Section CREANCE */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-orange-500 mb-4">CREANCE</h2>
              <div className="space-y-3">
                {/* Code créance */}
                <div className="flex items-center">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Code créance</Label>
                  <Input
                    value={codeCreance}
                    onChange={(e) => setCodeCreance(e.target.value)}
                    className="flex-1 max-w-xs bg-gray-100"
                    placeholder="Saisir le code créance"
                    disabled={loading || creanceCharge}
                  />
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 text-white ml-1"
                    onClick={handleAfficher}
                    disabled={loading || !codeCreance.trim() || creanceCharge}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    Afficher
                  </Button>
                </div>

                {/* Débiteur et Capital initial */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Code débiteur</Label>
                  <Input
                    value={debiteurCode}
                    className="w-28 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Input
                    value={debiteurLibelle}
                    className="flex-1 max-w-md bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-28 flex-shrink-0 ml-4 pr-1">Capital initial</Label>
                  <Input
                    value={capitalInitial}
                    className="w-32 bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* Groupe créance et Périodicité */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Groupe créance</Label>
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
                  <Label className="text-sm font-bold text-gray-700 w-28 flex-shrink-0 ml-4 pr-1">Périodicité</Label>
                  <Input
                    value={periodiciteCode ? `${periodiciteCode} - ${periodiciteLibelle}` : ""}
                    className="flex-1 max-w-md bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* Objet créance et Date octroi */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Objet créance</Label>
                  <Input
                    value={objetCode ? `${objetCode} - ${objetLibelle}` : ""}
                    className="flex-1 max-w-md bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-28 flex-shrink-0 ml-4 pr-1">Date octroi</Label>
                  <Input
                    value={dateOctroi}
                    className="w-32 bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* Montant débloqué, Date 1ère Echéance, Nbre. Echéance */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant décaissé</Label>
                  <Input
                    value={montantDebloque}
                    className="w-24 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-28 flex-shrink-0 ml-2 pr-1">Date 1ère Echéance</Label>
                  <Input
                    value={datePremiereEch}
                    className="w-32 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-24 flex-shrink-0 ml-2 pr-1">Nbre. Echéance</Label>
                  <Input
                    value={nbEch}
                    className="w-40 bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* Date dernière échéance, Durée, Statut */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Date dernière échéance</Label>
                  <Input
                    type="date"
                    value={dateFinEch}
                    className="w-32 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-20 flex-shrink-0 ml-2 pr-1">Durée</Label>
                  <Input
                    value={duree}
                    className="w-20 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-20 flex-shrink-0 ml-2 pr-1">Statut</Label>
                  <Input
                    value={statut}
                    className="w-32 bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* Taux IR et Taux IC */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Taux IR</Label>
                  <Input
                    value={tauxIR}
                    className="w-24 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-28 flex-shrink-0 ml-2 pr-1">Taux IC</Label>
                  <Input
                    value={tauxIC}
                    className="w-24 bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar droite */}
          <div className="w-80 space-y-4">
            {/* Bloc SOLDE DEBITEUR et boutons */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
              <div className="border-b pb-3 space-y-2">
                <Label className="text-sm font-bold text-orange-600 block">SOLDE DEBITEUR</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-28 flex-shrink-0 pr-1">DU</Label>
                  <Input
                    value={soldeDate}
                    className="flex-1"
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-28 flex-shrink-0 pr-1">Montant</Label>
                  <Input
                    value={soldeMontant}
                    className="flex-1"
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2 pt-3">
                <Button variant="outline" className="w-full bg-white hover:bg-gray-50">
                  Auxiliaire de justice
                </Button>
                <Button variant="outline" className="w-full bg-white hover:bg-gray-50">
                  Extrait de compte
                </Button>
                <Button variant="outline" className="w-full bg-white hover:bg-gray-50">
                  Rechercher un débiteur
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Workflow FRAIS - Affichée si créance chargée */}
        {creanceCharge && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Action sur les Frais</h3>
            <div className="flex gap-5">
              <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                workflow === "CREATE"
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="workflow"
                  value="CREATE"
                  checked={workflow === "CREATE"}
                  onChange={(e) => setWorkflow(e.target.value as any)}
                  className="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2"
                />
                <span className={`ml-3 text-base font-medium ${
                  workflow === "CREATE" ? 'text-orange-700' : 'text-gray-700'
                }`}>
                  Créer un frais
                </span>
              </label>

              <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                workflow === "PAY"
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="workflow"
                  value="PAY"
                  checked={workflow === "PAY"}
                  onChange={(e) => setWorkflow(e.target.value as any)}
                  className="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2"
                />
                <span className={`ml-3 text-base font-medium ${
                  workflow === "PAY" ? 'text-orange-700' : 'text-gray-700'
                }`}>
                  Payer un frais existant
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Section Création de Frais */}
        {workflow === "CREATE" && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
            <h2 className="text-lg font-semibold text-orange-500 mb-4">Création d'un Frais</h2>

            <div className="space-y-3 w-full">
              {/* Type de frais */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Type de frais</Label>
                <Select value={typeFraisCode} onValueChange={setTypeFraisCode}>
                  <SelectTrigger className="flex-1 bg-white">
                    <SelectValue placeholder="Sélectionner un type de frais" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingTypesFrais ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : safeTypesFrais.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">Aucun type de frais disponible</div>
                    ) : (
                      safeTypesFrais.map((type) => (
                        <SelectItem key={type.TYPFRAIS_CODE} value={type.TYPFRAIS_CODE}>
                          {type.TYPFRAIS_CODE} - {type.TYPFRAIS_LIB}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Montant du frais */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant</Label>
                <Input
                  value={montantFrais}
                  onChange={handleMontantFraisChange}
                  placeholder="Saisir le montant"
                  className="flex-1 bg-white"
                />
              </div>

              {/* Libellé du frais */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Libellé</Label>
                <Input
                  value={libelleFrais}
                  onChange={(e) => setLibelleFrais(e.target.value)}
                  placeholder="Saisir le libellé du frais"
                  className="flex-1 bg-white"
                />
              </div>
            </div>

            {/* Bouton Créer */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleCreerFrais}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={savingFrais}
              >
                {savingFrais ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer le frais"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Section Paiement de Frais */}
        {workflow === "PAY" && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
              <h2 className="text-lg font-semibold text-orange-500 mb-4">Paiement d'un Frais</h2>

              <div className="space-y-3 w-full">
                {/* Sélection du frais à payer */}
                <div className="flex items-center gap-2 w-full">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Sélectionner un frais</Label>
                  <Select
                    value={fraisCode}
                    onValueChange={(value) => {
                      setFraisCode(value)
                      const frais = fraisNonPayes.find(f => f.FRAIS_CODE?.toString() === value)
                      setFraisSelectionne(frais || null)
                    }}
                  >
                    <SelectTrigger className="flex-1 bg-white">
                      <SelectValue placeholder="Sélectionner un frais non payé" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingFraisNonPayes ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : fraisNonPayes.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Aucun frais non payé</div>
                      ) : (
                        fraisNonPayes.map((frais) => (
                          <SelectItem key={frais.FRAIS_CODE} value={frais.FRAIS_CODE?.toString()}>
                            Frais #{frais.FRAIS_CODE} - {frais.TYPFRAIS_LIB} - Reste: {formatNumber(frais.FRAIS_RESTE_A_PAY)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Affichage des infos du frais sélectionné */}
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
                      <span className="font-semibold text-gray-700">Montant payé:</span>
                      <span>{formatNumber(fraisSelectionne.FRAIS_MONT_PAY || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Reste à payer:</span>
                      <span className="text-orange-600 font-bold">{formatNumber(fraisSelectionne.FRAIS_RESTE_A_PAY)}</span>
                    </div>
                  </div>
                )}

                {/* Numéro de reçu manuel */}
                <div className="flex items-center gap-2 w-full">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Nº Reçu Manuel</Label>
                  <Input
                    value={numeroRecuManuel}
                    onChange={(e) => setNumeroRecuManuel(e.target.value)}
                    placeholder="Saisir le numéro de reçu manuel"
                    className="flex-1 bg-white"
                  />
                </div>

                {/* Montant à payer et Date */}
                <div className="flex items-center gap-2 w-full">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant à payer</Label>
                  <Input
                    value={montantPaye}
                    onChange={handleMontantPayeChange}
                    placeholder="Saisir le montant à payer"
                    className="flex-1 bg-white"
                  />
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date paiement</Label>
                  <Input
                    type="date"
                    value={datePaiementFrais}
                    onChange={(e) => setDatePaiementFrais(e.target.value)}
                    max={today}
                    className="flex-1 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section Mode de Paiement */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
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

            {/* Section Type de Payeur (Aval) */}
            {garantiesPhysiques.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Type de Payeur</h3>
                <div className="space-y-4">
                  <div className="flex gap-5">
                    <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      typePayeur === "DEBITEUR_PRINCIPAL"
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="typePayeur"
                        value="DEBITEUR_PRINCIPAL"
                        checked={typePayeur === "DEBITEUR_PRINCIPAL"}
                        onChange={(e) => setTypePayeur(e.target.value as any)}
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2"
                      />
                      <span className={`ml-3 text-base font-medium ${
                        typePayeur === "DEBITEUR_PRINCIPAL" ? 'text-orange-700' : 'text-gray-700'
                      }`}>
                        Débiteur Principal
                      </span>
                    </label>

                    <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      typePayeur === "AVAL"
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="typePayeur"
                        value="AVAL"
                        checked={typePayeur === "AVAL"}
                        onChange={(e) => setTypePayeur(e.target.value as any)}
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2"
                      />
                      <span className={`ml-3 text-base font-medium ${
                        typePayeur === "AVAL" ? 'text-orange-700' : 'text-gray-700'
                      }`}>
                        Aval (Garantie Personnelle)
                      </span>
                    </label>
                  </div>

                  {typePayeur === "AVAL" && (
                    <div className="flex items-center gap-2 w-full">
                      <Label className="text-sm font-bold text-gray-700 w-48 flex-shrink-0 pr-1">Sélectionner un Aval</Label>
                      <Select value={garantiePhysCode} onValueChange={setGarantiePhysCode}>
                        <SelectTrigger className="flex-1 bg-white">
                          <SelectValue placeholder="Sélectionner un aval" />
                        </SelectTrigger>
                        <SelectContent>
                          {garantiesPhysiques.map((garantie) => (
                            <SelectItem key={garantie.GARPHYS_CODE} value={garantie.GARPHYS_CODE?.toString()}>
                              {garantie.GARPHYS_NOM} {garantie.GARPHYS_PREN} - {garantie.TYPGAR_PHYS_LIB}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section Paiement par Effet */}
            {isEffetMode() && (
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
                <h2 className="text-lg font-semibold text-orange-500 mb-4">Détails du Paiement par Effet</h2>

                <div className="space-y-3 w-full">
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

                  {/* Numéro d'effet */}
                  <div className="flex items-center gap-2 w-full">
                    <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Numéro</Label>
                    <Input
                      value={numeroEffet}
                      onChange={(e) => setNumeroEffet(e.target.value)}
                      placeholder="Saisir le numéro d'effet"
                      className="flex-1 bg-white"
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
                      className="flex-1 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bouton Enregistrer le paiement */}
            {modePaiement && (
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handlePayerFrais}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={savingPaiement}
                >
                  {savingPaiement ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer le paiement"
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Modal de reçu */}
        {showRecuModal && recuData && (
          <RecuPaiementModal
            open={showRecuModal}
            onClose={handleCloseRecuModal}
            title="Reçu de Paiement de Frais"
            data={recuData}
          />
        )}
      </div>
    </div>
  )
}
