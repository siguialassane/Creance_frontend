"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePeriodicites } from "@/hooks/usePeriodicites"
import { useApiClient } from "@/hooks/useApiClient"
import { CreanceService } from "@/services/creance.service"
import { CreanceResponse } from "@/types/creance"
import { Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function GestionPaiementsPage() {
  const apiClient = useApiClient()
  const [loading, setLoading] = useState(false)

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
  const [modePaiement, setModePaiement] = useState("")
  
  // États pour le paiement par chèque
  const [typeEffetCode, setTypeEffetCode] = useState("")
  const [typeEffetLibelle, setTypeEffetLibelle] = useState("")
  const [numeroCheque, setNumeroCheque] = useState("")
  const [banqueEmettriceCode, setBanqueEmettriceCode] = useState("")
  const [banqueEmettriceLibelle, setBanqueEmettriceLibelle] = useState("")
  const [montant, setMontant] = useState("")
  const [datePaiement, setDatePaiement] = useState(() => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = today.toLocaleDateString('fr-FR', { month: 'short' })
    const year = today.getFullYear()
    return `${day} ${month} ${year}`
  })

  // États pour le paiement par espèce
  const [libellePaiement, setLibellePaiement] = useState("")
  const [montantPaiement, setMontantPaiement] = useState("")
  const [datePaiementEspece, setDatePaiementEspece] = useState(() => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = today.toLocaleDateString('fr-FR', { month: 'short' })
    const year = today.getFullYear()
    return `${day} ${month} ${year}`
  })

  // Hooks pour les données
  const { data: periodicites } = usePeriodicites()

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
      
      // Date de première échéance (date de déblocage)
      setDatePremiereEch(formatDate(creanceData.CREAN_DATE_DEBLOCAGE))
      
      // Date d'octroi (date de création)
      setDateOctroi(formatDate(creanceData.CREAN_DATE_CREAT))
      
      setDuree(creanceData.CREAN_DUREE?.toString() || "")
      
      // Solde débiteur
      const today = new Date()
      setSoldeDate(formatDateShort(today.toISOString()))
      setSoldeMontant(formatNumber(creanceData.CREAN_TOT_SOLDE || 0))

      toast.success("Créance chargée avec succès")
    } catch (error: any) {
      console.error("Erreur lors du chargement de la créance:", error)
      toast.error(error.message || "Impossible de charger la créance")
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

  const handleEnregistrer = () => {
    // Logique d'enregistrement
    console.log("Enregistrement du paiement...")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des paiements de créances</h1>
        
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
                    className="bg-blue-600 hover:bg-blue-700 text-white ml-1"
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
            <div className="bg-white rounded-lg shadow-sm p-1.5 max-w-[280px]">
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

        {/* Section Paiement - Pleine largeur (conditionnelle selon le mode) */}
        {isChequeMode() && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mt-6">
            <h2 className="text-lg font-semibold text-orange-500 mb-4">Paiement par chèque (Effet)</h2>
            
            <div className="space-y-3 w-full">
              {/* Type Effet */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Type Effet</Label>
                <div className="flex gap-2 flex-1 min-w-0">
                  <Input
                    value={typeEffetCode}
                    onChange={(e) => setTypeEffetCode(e.target.value)}
                    placeholder="Code"
                    className="w-80 flex-shrink-0 bg-white"
                  />
                  <Input
                    value={typeEffetLibelle}
                    onChange={(e) => setTypeEffetLibelle(e.target.value)}
                    placeholder="Libellé"
                    className="flex-1 min-w-0 bg-white"
                  />
                </div>
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
                <div className="flex gap-2 flex-1 min-w-0">
                  <Input
                    value={banqueEmettriceCode}
                    onChange={(e) => setBanqueEmettriceCode(e.target.value)}
                    placeholder="Code"
                    className="w-80 flex-shrink-0 bg-white"
                  />
                  <Input
                    value={banqueEmettriceLibelle}
                    onChange={(e) => setBanqueEmettriceLibelle(e.target.value)}
                    placeholder="Libellé"
                    className="flex-1 min-w-0 bg-white"
                  />
                </div>
              </div>

              {/* Montant et Date de paiement */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant</Label>
                <Input
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  placeholder="Saisir le montant"
                  className="flex-1 min-w-0 bg-white"
                />
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date de paiement</Label>
                <Input
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
                  onChange={(e) => setMontantPaiement(e.target.value)}
                  placeholder="Saisir le montant du paiement"
                  className="flex-1 min-w-0 bg-white"
                />
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date paiement</Label>
                <Input
                  value={datePaiementEspece}
                  onChange={(e) => setDatePaiementEspece(e.target.value)}
                  className="flex-1 min-w-0 bg-white"
                />
              </div>
            </div>
          </div>
        )}

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

