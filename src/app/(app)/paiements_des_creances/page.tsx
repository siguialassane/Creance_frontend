"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { RecuPaiementModal } from "@/components/modals/RecuPaiementModal"
import { usePeriodicites } from "@/hooks/usePeriodicites"
import { useApiClient } from "@/hooks/useApiClient"
import { useTypeEffetsSearchable } from "@/hooks/useTypeEffetsSearchable"
import { useBanquesSearchable } from "@/hooks/useBanquesSearchable"
import { useSessionWrapper } from "@/hooks/useSessionWrapper"
import { CreanceService } from "@/services/creance.service"
import { PaiementCreanceService } from "@/services/paiement-creance.service"
import { CreanceResponse } from "@/types/creance"
import { Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"

function PaiementsCreancesPageContent() {
  const apiClient = useApiClient()
  const { data: session } = useSessionWrapper()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [savingPaiement, setSavingPaiement] = useState(false)

  // État pour le modal de reçu
  const [showRecuModal, setShowRecuModal] = useState(false)
  const [recuData, setRecuData] = useState<any>(null)

  // États pour les champs du formulaire
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
  
  // États pour la sidebar
  const [capitalInitial, setCapitalInitial] = useState("")
  const [datePremiereEch, setDatePremiereEch] = useState("")
  const [dateOctroi, setDateOctroi] = useState("")
  const [duree, setDuree] = useState("")
  const [soldeDate, setSoldeDate] = useState("")
  const [soldeMontant, setSoldeMontant] = useState("")
  
  // États pour le mode de paiement
  const [modePaiement, setModePaiement] = useState<"EFFET" | "ESPECE" | "">("")

  // États pour le paiement par effet (chèque/virement)
  const [typeEffetCode, setTypeEffetCode] = useState("")
  const [numeroCheque, setNumeroCheque] = useState("")
  const [banqueEmettriceCode, setBanqueEmettriceCode] = useState("")
  const [montant, setMontant] = useState("")
  const [datePaiement, setDatePaiement] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  // États pour le paiement par espèce
  const [libellePaiement, setLibellePaiement] = useState("")
  const [montantPaiement, setMontantPaiement] = useState("")
  const [datePaiementEspece, setDatePaiementEspece] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })


  // États pour le paiement par aval
  const [typePayeur, setTypePayeur] = useState<"DEBITEUR_PRINCIPAL" | "AVAL">("DEBITEUR_PRINCIPAL")
  const [garantiePhysCode, setGarantiePhysCode] = useState("")
  const [garantiesPhysiques, setGarantiesPhysiques] = useState<any[]>([])
  const [loadingGaranties, setLoadingGaranties] = useState(false)

  // Hooks pour les données
  const { data: periodicites } = usePeriodicites()
  const typeEffetsSearchable = useTypeEffetsSearchable()
  const banquesSearchable = useBanquesSearchable()

  // Date max pour les sélecteurs (aujourd'hui)
  const today = new Date().toISOString().split('T')[0]

  // Charger les garanties physiques (avals) pour la créance
  useEffect(() => {
    const loadGarantiesPhysiques = async () => {
      if (!codeCreance.trim()) return

      setLoadingGaranties(true)
      try {
        const response = await PaiementCreanceService.getGarantiesPhysiques(apiClient, codeCreance)
        const garanties = Array.isArray(response) ? response : (response?.data || [])
        setGarantiesPhysiques(garanties)
      } catch (error) {
        console.error("Erreur lors du chargement des garanties:", error)
        setGarantiesPhysiques([])
      } finally {
        setLoadingGaranties(false)
      }
    }

    if (codeCreance.trim()) {
      loadGarantiesPhysiques()
    }
  }, [apiClient, codeCreance])

  // Fonction pour détecter le type de paiement sélectionné
  const isEffetMode = () => {
    return modePaiement === "EFFET"
  }

  const isEspeceMode = () => {
    return modePaiement === "ESPECE"
  }


  // Fonction pour formater une date au format "DD MMM YYYY"
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = date.toLocaleDateString('fr-FR', { month: 'short' })
      const year = date.getFullYear()
      return `${day} ${month} ${year}`
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

  // Fonction pour formater un montant avec séparateurs de milliers (pour saisie)
  const formatMontant = (value: string): string => {
    // Supprimer tous les caractères non numériques sauf les espaces (qui seront supprimés)
    const cleaned = value.replace(/[^\d]/g, '')
    if (!cleaned) return ''
    
    // Ajouter les séparateurs de milliers (espaces)
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Fonction pour convertir un montant formaté en nombre (sans espaces)
  const parseMontant = (value: string): number | null => {
    const cleaned = value.replace(/\s/g, '').replace(/,/g, '.')
    if (!cleaned) return null
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? null : parsed
  }

  // Handlers pour les champs de montant avec formatage en temps réel
  const handleMontantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    // Supprimer tous les espaces pour reformater
    const cleaned = inputValue.replace(/\s/g, '')
    // Formater avec séparateurs de milliers
    const formatted = formatMontant(cleaned)
    setMontant(formatted)
  }

  const handleMontantPaiementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleaned = inputValue.replace(/\s/g, '')
    const formatted = formatMontant(cleaned)
    setMontantPaiement(formatted)
  }

  // Charger automatiquement la créance si le code est dans l'URL
  const hasAutoLoadedRef = useRef(false)

  useEffect(() => {
    const codeFromUrl = searchParams.get('code')
    if (codeFromUrl && !hasAutoLoadedRef.current) {
      hasAutoLoadedRef.current = true
      setCodeCreance(codeFromUrl)
    }
  }, [searchParams])

  // Déclencher handleAfficher quand le code est défini automatiquement
  useEffect(() => {
    if (hasAutoLoadedRef.current && codeCreance && !loading) {
      const timer = setTimeout(() => {
        handleAfficher()
      }, 200)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeCreance])

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
      
      // Formater la date de fin d'échéance
      if (creanceData.CREAN_DATE_ECHEANCE || creanceData.CREAN_DATECH) {
        const dateEch = new Date(creanceData.CREAN_DATE_ECHEANCE || creanceData.CREAN_DATECH || "")
        setDateFinEch(dateEch.toISOString().split('T')[0])
      }

      // Remplir la sidebar
      setCapitalInitial(formatNumber(creanceData.CREAN_CAPIT_INIT))

      // Date de première échéance - essayer CREAN_DATECH puis CREAN_DATE_DEBLOCAGE
      setDatePremiereEch(formatDate(creanceData.CREAN_DATECH || creanceData.CREAN_DATE_DEBLOCAGE))

      // Date d'octroi - essayer CREAN_DATOCTROI puis CREAN_DATECREA
      setDateOctroi(formatDate(creanceData.CREAN_DATOCTROI || creanceData.CREAN_DATECREA))

      setDuree(creanceData.CREAN_DUREE?.toString() || "")
      
      // Solde débiteur
      const today = new Date()
      setSoldeDate(formatDateShort(today.toISOString()))
      setSoldeMontant(formatNumber(creanceData.CREAN_TOT_SOLDE || 0))

      toast.success("Créance chargée avec succès")
    } catch (error: any) {
      console.error("Erreur lors du chargement de la créance:", error)

      // Message d'erreur plus spécifique
      let errorMessage = "Impossible de charger la créance"
      if (error.response?.status === 404 || error.message?.includes("non trouvée")) {
        errorMessage = `Aucune créance trouvée avec le code "${codeCreance}"`
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
      // Réinitialiser les champs en cas d'erreur
      setDebiteurCode("")
      setDebiteurLibelle("")
      setGroupeCreanceCode("")
      setGroupeCreanceLibelle("")
      setObjetCode("")
      setObjetLibelle("")
      setPeriodiciteCode("")
      setPeriodiciteLibelle("")
      setMontantDebloque("")
      setNbEch("")
      setDateFinEch("")
      setCapitalInitial("")
      setDatePremiereEch("")
      setDateOctroi("")
      setDuree("")
      setSoldeDate("")
      setSoldeMontant("")
    } finally {
      setLoading(false)
    }
  }

  const handleEnregistrer = async () => {
    // Validation de base
    if (!codeCreance.trim()) {
      toast.error("Veuillez d'abord rechercher une créance")
      return
    }

    if (!modePaiement) {
      toast.error("Veuillez sélectionner un mode de paiement")
      return
    }

    // Convertir les montants formatés en nombres
    const montantValue = parseMontant(montant)
    const montantPaiementValue = parseMontant(montantPaiement)

    // Préparer les données pour l'enregistrement
    const paiementData: any = {
      creanceCode: codeCreance,
      modePaiement: modePaiement,
      typePayeur: typePayeur
    }

    if (isEffetMode()) {
      // Validations pour le paiement par effet
      if (!typeEffetCode) {
        toast.error("Veuillez sélectionner un type d'effet")
        return
      }
      if (!numeroCheque) {
        toast.error("Veuillez saisir le numéro d'effet")
        return
      }
      if (!banqueEmettriceCode) {
        toast.error("Veuillez sélectionner une banque émettrice")
        return
      }
      if (!montantValue || montantValue <= 0) {
        toast.error("Veuillez saisir un montant valide")
        return
      }

      paiementData.libellePaiement = `Paiement par effet N° ${numeroCheque}`
      paiementData.montantPaiement = montantValue
      paiementData.datePaiement = datePaiement
      paiementData.typeEffet = typeEffetCode
      paiementData.numeroEffet = numeroCheque
      paiementData.banqueAgence = banqueEmettriceCode
      paiementData.montantEffet = montantValue

    } else if (isEspeceMode()) {
      // Validations pour le paiement par espèce
      if (!montantPaiementValue || montantPaiementValue <= 0) {
        toast.error("Veuillez saisir un montant valide")
        return
      }

      paiementData.libellePaiement = libellePaiement || "Paiement en espèces"
      paiementData.montantPaiement = montantPaiementValue
      paiementData.datePaiement = datePaiementEspece
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
      const response = await PaiementCreanceService.create(apiClient, paiementData)
      console.log("Paiement enregistré:", response)

      // Le backend retourne {paieCode, effetNum, message}
      const recuInfo = {
        paieCode: response.data?.paieCode,      // Code paiement (toujours disponible)
        effetNum: response.data?.effetNum,      // Numéro d'effet (disponible seulement pour paiements par effet)
        numeroPaiement: response.data?.paieCode || response.data?.effetNum || "N/A"
      }

      setRecuData(recuInfo)
      setShowRecuModal(true)
      toast.success("Paiement enregistré avec succès")
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement du paiement:", error)
      toast.error(error.response?.data?.message || error.message || "Impossible d'enregistrer le paiement")
    } finally {
      setSavingPaiement(false)
    }
  }

  const handleCloseRecuModal = () => {
    setShowRecuModal(false)
    // Rediriger vers le listing après fermeture du modal
    router.push(`/paiements_des_creances/liste?code=${codeCreance}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Paiements des creances</h1>
        
        <div className="flex gap-6">
          {/* Contenu principal */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Section supérieure - Détails de la créance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-3">
                {/* Code créance */}
                <div className="flex items-center">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Code créance</Label>
                  <Input
                    value={codeCreance}
                    onChange={(e) => setCodeCreance(e.target.value)}
                    className="flex-1 max-w-xs bg-gray-100"
                    placeholder="Saisir le code créance"
                    disabled={loading}
                  />
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white ml-1"
                    onClick={handleAfficher}
                    disabled={loading || !codeCreance.trim()}
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
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Débiteur</Label>
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

                {/* Groupe créance et Date de 1ère Echt */}
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
                  <Label className="text-sm font-bold text-gray-700 w-28 flex-shrink-0 ml-4 pr-1">Date de 1ère Echt</Label>
                  <Input
                    value={datePremiereEch}
                    className="w-32 bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* Objet et Date de Octroi */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Objet</Label>
                  <Input
                    value={objetCode}
                    className="w-24 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Input
                    value={objetLibelle}
                    className="flex-1 max-w-md bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-28 flex-shrink-0 ml-4 pr-1">Date de Octroi</Label>
                  <Input
                    value={dateOctroi}
                    className="w-32 bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* Périodicité et Durée */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Périodicité</Label>
                  <Input
                    value={periodiciteCode}
                    className="w-24 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Input
                    value={periodiciteLibelle}
                    className="flex-1 max-w-md bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-20 flex-shrink-0 ml-4 pr-1">Durée</Label>
                  <Input
                    value={duree}
                    className="w-20 bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>

                {/* Montant débloqué, Nb Ech, Date fin Ech - sur la même ligne */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant débloqué</Label>
                  <Input
                    value={montantDebloque}
                    className="w-24 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-20 flex-shrink-0 ml-2 pr-1">Nb Ech</Label>
                  <Input
                    value={nbEch}
                    className="w-40 bg-gray-100"
                    readOnly
                    disabled
                  />
                  <Label className="text-sm font-bold text-gray-700 w-24 flex-shrink-0 ml-2 pr-1">Date fin Ech</Label>
                  <Input
                    type="date"
                    value={dateFinEch}
                    className="w-32 bg-gray-100"
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Section Mode de Paiement */}
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
                    Paiement par Chèque
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
                    Paiement en Espèces
                  </span>
                </label>
              </div>
            </div>

            {/* Section Type de Payeur (Aval) - affichée si une créance est chargée */}
            {codeCreance && garantiesPhysiques.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
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

              {/* <div className="space-y-2 pt-3">
                <Button variant="outline" className="w-full bg-white hover:bg-gray-50">
                  Auxiliaire de justice
                </Button>
                <Button variant="outline" className="w-full bg-white hover:bg-gray-50">
                  Extrait de compte
                </Button>
                <Button variant="outline" className="w-full bg-white hover:bg-gray-50">
                  Rechercher un débiteur
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Section Paiement - Pleine largeur (conditionnelle selon le mode) */}
        {isEffetMode() && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
            <h2 className="text-lg font-semibold text-orange-500 mb-4">Paiement par Effet</h2>
            
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

              {/* Numéro */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Numéro</Label>
                <Input
                  value={numeroCheque}
                  onChange={(e) => setNumeroCheque(e.target.value)}
                  placeholder="Saisir le numéro"
                  className="flex-1 min-w-0 bg-white"
                />
              </div>

              {/* Banque Emettrice */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Banque Emettrice</Label>
                <SearchableSelect
                  value={banqueEmettriceCode}
                  onValueChange={(value) => setBanqueEmettriceCode(value)}
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

              {/* Montant et Date de paiement */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant</Label>
                <Input
                  value={montant}
                  onChange={handleMontantChange}
                  placeholder="Saisir le montant"
                  className="flex-1 min-w-0 bg-white"
                />
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date de paiement</Label>
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

        {isEspeceMode() && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
            <h2 className="text-lg font-semibold text-orange-500 mb-4">Paiement par espèce</h2>

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
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant Paiement</Label>
                <Input
                  value={montantPaiement}
                  onChange={handleMontantPaiementChange}
                  placeholder="Saisir le montant du paiement"
                  className="flex-1 min-w-0 bg-white"
                />
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date paiement</Label>
                <Input
                  type="date"
                  value={datePaiementEspece}
                  onChange={(e) => setDatePaiementEspece(e.target.value)}
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
            title="Reçu de Paiement de Créance"
            data={recuData}
          />
        )}
      </div>
    </div>
  )
}

export default function PaiementsCreancesPage() {
  return (
    <Suspense fallback={<div className="p-4">Chargement...</div>}>
      <PaiementsCreancesPageContent />
    </Suspense>
  )
}

