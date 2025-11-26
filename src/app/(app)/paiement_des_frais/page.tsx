"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { useApiClient } from "@/hooks/useApiClient"
import { useAgencesBanqueSearchable } from "@/hooks/useAgencesBanqueSearchable"
import { useModesPaiementSearchable } from "@/hooks/useModesPaiementSearchable"
import { useTypeFraissSearchable } from "@/hooks/useTypeFraissSearchable"
import { useFraissSearchable } from "@/hooks/useFraissSearchable"
import { useLignesEcheanceSearchable } from "@/hooks/useLignesEcheanceSearchable"
import { CreanceService } from "@/services/creance.service"
import { CreanceResponse } from "@/types/creance"
import { usePeriodicites } from "@/hooks/usePeriodicites"
import { Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function PaiementDesFraisPage() {
  const apiClient = useApiClient()
  const [loading, setLoading] = useState(false)
  const { data: periodicites } = usePeriodicites()

  // Hooks pour les sélections avec recherche
  const {
    items: agencesItems,
    isLoading: isLoadingAgences,
    hasMore: hasMoreAgences,
    loadMore: loadMoreAgences,
    isFetchingMore: isFetchingMoreAgences,
    search: agencesSearch,
    setSearch: setAgencesSearch,
  } = useAgencesBanqueSearchable()

  const {
    items: modesPaiementItems,
    isLoading: isLoadingModesPaiement,
    search: modesPaiementSearch,
    setSearch: setModesPaiementSearch,
  } = useModesPaiementSearchable()

  const {
    items: typeFraissItems,
    isLoading: isLoadingTypeFraiss,
    search: typeFraissSearch,
    setSearch: setTypeFraissSearch,
  } = useTypeFraissSearchable()

  // États pour la section CREANCE
  const [codeCreance, setCodeCreance] = useState("")

  const {
    items: fraissItems,
    isLoading: isLoadingFraiss,
    hasMore: hasMoreFraiss,
    loadMore: loadMoreFraiss,
    isFetchingMore: isFetchingMoreFraiss,
    search: fraissSearch,
    setSearch: setFraissSearch,
  } = useFraissSearchable(codeCreance || undefined)

  const {
    items: lignesEcheanceItems,
    isLoading: isLoadingLignesEcheance,
    hasMore: hasMoreLignesEcheance,
    loadMore: loadMoreLignesEcheance,
    isFetchingMore: isFetchingMoreLignesEcheance,
    search: lignesEcheanceSearch,
    setSearch: setLignesEcheanceSearch,
  } = useLignesEcheanceSearchable(codeCreance || undefined)
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

  // États pour la section FRAIS
  const [numeroRecuManuel, setNumeroRecuManuel] = useState("")
  const [numeroFrais, setNumeroFrais] = useState("")
  const [numeroFraisLibelle, setNumeroFraisLibelle] = useState("")
  const [numeroLigEch, setNumeroLigEch] = useState("")
  const [numeroLigEchLibelle, setNumeroLigEchLibelle] = useState("")
  const [typeFraisCode, setTypeFraisCode] = useState("")
  const [typeFraisLibelle, setTypeFraisLibelle] = useState("")
  const [montantFrais, setMontantFrais] = useState("")
  const [montantPaye, setMontantPaye] = useState("")
  const [datePaiementFrais, setDatePaiementFrais] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  // États pour le mode de paiement
  const [modePaiement, setModePaiement] = useState("")
  
  // États pour le paiement par chèque
  const [libellePaiementCheque, setLibellePaiementCheque] = useState("")
  const [banqueAgenceCode, setBanqueAgenceCode] = useState("")
  const [banqueAgenceLibelle, setBanqueAgenceLibelle] = useState("")
  const [modePaiementCode, setModePaiementCode] = useState("")
  const [modePaiementLibelle, setModePaiementLibelle] = useState("")
  const [numeroEffet, setNumeroEffet] = useState("")
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

  // Modes de paiement statiques
  const modesPaiementList = [
    { code: "cheque", libelle: "Paiement par chèque" },
    { code: "espece", libelle: "Paiement par espèce" }
  ]

  // Fonction pour détecter le type de paiement sélectionné
  const isChequeMode = () => {
    return modePaiement === "cheque"
  }

  const isEspeceMode = () => {
    return modePaiement === "espece"
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

  // Handlers pour les champs de montant avec formatage en temps réel
  const handleMontantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleaned = inputValue.replace(/\s/g, '')
    const formatted = formatMontant(cleaned)
    setMontant(formatted)
  }

  const handleMontantPaiementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleaned = inputValue.replace(/\s/g, '')
    const formatted = formatMontant(cleaned)
    setMontantPaiement(formatted)
  }

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
      toast.success("Créance chargée avec succès")
    } catch (error: any) {
      console.error("Erreur lors du chargement de la créance:", error)
      toast.error(error.message || "Impossible de charger la créance")
      setCreanceCharge(false)
    } finally {
      setLoading(false)
    }
  }

  const handleEnregistrer = () => {
    const montantValue = parseMontant(montant)
    const montantPaiementValue = parseMontant(montantPaiement)
    const montantFraisValue = parseMontant(montantFrais)
    const montantPayeValue = parseMontant(montantPaye)

    const paiementData: any = {
      codeCreance,
      numeroRecuManuel,
      numeroFrais,
      numeroLigEch,
      typeFraisCode,
      typeFraisLibelle,
      montantFrais: montantFraisValue,
      montantPaye: montantPayeValue,
      datePaiementFrais,
    }

    if (isChequeMode()) {
      paiementData.modePaiement = "cheque"
      paiementData.libellePaiement = libellePaiementCheque
      paiementData.banqueAgenceCode = banqueAgenceCode
      paiementData.banqueAgenceLibelle = banqueAgenceLibelle
      paiementData.modePaiementCode = modePaiementCode
      paiementData.modePaiementLibelle = modePaiementLibelle
      paiementData.numeroEffet = numeroEffet
      paiementData.montant = montantValue
      paiementData.datePaiement = datePaiement
    } else if (isEspeceMode()) {
      paiementData.modePaiement = "espece"
      paiementData.libellePaiement = libellePaiement
      paiementData.montant = montantPaiementValue
      paiementData.datePaiement = datePaiementEspece
    }

    console.log("Enregistrement du paiement des frais...", paiementData)
    toast.success("Paiement des frais enregistré avec succès")
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
                    className="bg-blue-600 hover:bg-blue-700 text-white ml-1"
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

        {/* Section FRAIS - Pleine largeur */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
          <h2 className="text-lg font-semibold text-orange-500 mb-4">FRAIS</h2>
          
          <div className="space-y-3 w-full">
            {/* Nº Réçu Mannuel */}
            <div className="flex items-center gap-2 w-full">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Nº Réçu Mannuel</Label>
              <Input
                value={numeroRecuManuel}
                onChange={(e) => setNumeroRecuManuel(e.target.value)}
                placeholder="Saisir le numéro de reçu manuel"
                className="flex-1 min-w-0 bg-white"
              />
            </div>

            {/* N° Frais (2 cases avec sélection) */}
            <div className="flex items-center gap-2 w-full">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">N° Frais</Label>
              <div className="flex gap-2 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <SearchableSelect
                    items={fraissItems}
                    value={numeroFrais}
                    onValueChange={(value) => {
                      setNumeroFrais(value)
                      const selectedFrais = fraissItems.find((item) => item.value === value)
                      if (selectedFrais) {
                        setNumeroFraisLibelle(selectedFrais.FRAIS_LIB || selectedFrais.libelle || selectedFrais.label || "")
                      } else {
                        setNumeroFraisLibelle("")
                      }
                    }}
                    placeholder="Sélectionner un numéro de frais"
                    search={fraissSearch}
                    onSearchChange={setFraissSearch}
                    isLoading={isLoadingFraiss}
                    hasMore={hasMoreFraiss}
                    onLoadMore={loadMoreFraiss}
                    isFetchingMore={isFetchingMoreFraiss}
                  />
                </div>
              </div>
              <Input
                value={numeroFraisLibelle}
                className="flex-1 min-w-0 bg-gray-100"
                readOnly
                disabled
                placeholder="Libellé"
              />
            </div>

            {/* N° Lig. ech. (2 cases avec sélection) */}
            <div className="flex items-center gap-2 w-full">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">N° Lig. ech.</Label>
              <div className="flex gap-2 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <SearchableSelect
                    items={lignesEcheanceItems}
                    value={numeroLigEch}
                    onValueChange={(value) => {
                      setNumeroLigEch(value)
                      const selectedLigne = lignesEcheanceItems.find((item) => item.value === value)
                      if (selectedLigne) {
                        setNumeroLigEchLibelle(selectedLigne.LIG_ECH_LIB || selectedLigne.libelle || selectedLigne.label || "")
                      } else {
                        setNumeroLigEchLibelle("")
                      }
                    }}
                    placeholder="Sélectionner un numéro de ligne échéance"
                    search={lignesEcheanceSearch}
                    onSearchChange={setLignesEcheanceSearch}
                    isLoading={isLoadingLignesEcheance}
                    hasMore={hasMoreLignesEcheance}
                    onLoadMore={loadMoreLignesEcheance}
                    isFetchingMore={isFetchingMoreLignesEcheance}
                  />
                </div>
              </div>
              <Input
                value={numeroLigEchLibelle}
                className="flex-1 min-w-0 bg-gray-100"
                readOnly
                disabled
                placeholder="Libellé"
              />
            </div>

            {/* Type frais (2 cases) */}
            <div className="flex items-center gap-2 w-full">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Type frais</Label>
              <Input
                value={typeFraisCode}
                onChange={(e) => setTypeFraisCode(e.target.value)}
                placeholder="Code"
                className="w-28 bg-white"
              />
              <Input
                value={typeFraisLibelle}
                onChange={(e) => setTypeFraisLibelle(e.target.value)}
                placeholder="Libellé"
                className="flex-1 min-w-0 bg-white"
              />
            </div>

            {/* Montant, Mont Payé, Date Paiement */}
            <div className="flex items-center gap-2 w-full">
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant</Label>
              <Input
                value={montantFrais}
                onChange={handleMontantFraisChange}
                placeholder="Saisir le montant"
                className="flex-1 min-w-0 bg-white"
              />
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Mont Payé</Label>
              <Input
                value={montantPaye}
                onChange={handleMontantPayeChange}
                placeholder="Saisir le montant payé"
                className="flex-1 min-w-0 bg-white"
              />
              <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date Paiement</Label>
              <Input
                type="date"
                value={datePaiementFrais}
                onChange={(e) => setDatePaiementFrais(e.target.value)}
                className="flex-1 min-w-0 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section Mode de Paiement */}
        <div className="bg-white rounded-lg shadow-sm p-1.5 max-w-[280px] mt-6">
          <Select value={modePaiement} onValueChange={setModePaiement}>
            <SelectTrigger 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white border-orange-500 h-10 text-base [&>span]:text-white"
              style={{ backgroundColor: '#f97316', borderColor: '#f97316' }}
            >
              <SelectValue placeholder="Mode de Paiement" className="text-white" />
            </SelectTrigger>
            <SelectContent>
              {modesPaiementList.map((mode) => (
                <SelectItem key={mode.code} value={mode.code}>
                  {mode.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section Paiement - Pleine largeur (conditionnelle selon le mode) */}
        {isChequeMode() && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
            <h2 className="text-lg font-semibold text-orange-500 mb-4">Paiement par chèque (Effet)</h2>
            
            <div className="space-y-3 w-full">
              {/* Libellé Paiement */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Libellé Paiement</Label>
                <Input
                  value={libellePaiementCheque}
                  onChange={(e) => setLibellePaiementCheque(e.target.value)}
                  placeholder="Saisir le libellé du paiement"
                  className="flex-1 min-w-0 bg-white"
                />
              </div>

              {/* Banque agence */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Banque agence</Label>
                <div className="flex gap-2 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <SearchableSelect
                      items={agencesItems}
                      value={banqueAgenceCode}
                      onValueChange={(value) => {
                        setBanqueAgenceCode(value)
                        const selectedAgence = agencesItems.find((item) => item.value === value)
                        if (selectedAgence) {
                          setBanqueAgenceLibelle(selectedAgence.BQAG_LIB || selectedAgence.libelle || selectedAgence.label || "")
                        } else {
                          setBanqueAgenceLibelle("")
                        }
                      }}
                      placeholder="Sélectionner une banque agence"
                      search={agencesSearch}
                      onSearchChange={setAgencesSearch}
                      isLoading={isLoadingAgences}
                      hasMore={hasMoreAgences}
                      onLoadMore={loadMoreAgences}
                      isFetchingMore={isFetchingMoreAgences}
                    />
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Mode de paiement</Label>
                <div className="flex-1 min-w-0">
                  <SearchableSelect
                    items={modesPaiementItems}
                    value={modePaiementCode}
                    onValueChange={(value) => {
                      setModePaiementCode(value)
                      const selectedMode = modesPaiementItems.find((item) => item.value === value)
                      if (selectedMode) {
                        setModePaiementLibelle(selectedMode.TYP_PAIE_LIB || selectedMode.libelle || selectedMode.label || "")
                      } else {
                        setModePaiementLibelle("")
                      }
                    }}
                    placeholder="Sélectionner un mode de paiement"
                    search={modesPaiementSearch}
                    onSearchChange={setModesPaiementSearch}
                    isLoading={isLoadingModesPaiement}
                    hasMore={false}
                    onLoadMore={() => {}}
                    isFetchingMore={false}
                  />
                </div>
              </div>

              {/* N effet */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">N effet</Label>
                <Input
                  value={numeroEffet}
                  onChange={(e) => setNumeroEffet(e.target.value)}
                  placeholder="Saisir le numéro d'effet"
                  className="flex-1 min-w-0 bg-white"
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
                  className="flex-1 min-w-0 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section GARANTIE PERSONNELLE */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold text-orange-500 mb-4">GARANTIE PERSONNELLE</h2>
          <div className="border-b border-gray-200 mb-4">
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-orange-600 border-b-2 border-orange-600">
                Personnelle
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                ASSUREUR
              </button>
            </div>
          </div>
          <div className="min-h-[200px] bg-gray-50 rounded border border-gray-200 p-4">
            {/* Zone de contenu pour la garantie personnelle */}
          </div>
        </div>

        {/* Boutons en bas */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-300">
            Retour
          </Button>
          <Button
            onClick={handleEnregistrer}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  )
}

