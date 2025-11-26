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
import { Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function PaiementContratBailPage() {
  const apiClient = useApiClient()
  const [loading, setLoading] = useState(false)
  const [contratCharge, setContratCharge] = useState(false)

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

  // Fonction pour formater un montant avec séparateurs de milliers
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
  const handleCautionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    // Supprimer tous les espaces pour reformater
    const cleaned = inputValue.replace(/\s/g, '')
    // Formater avec séparateurs de milliers
    const formatted = formatMontant(cleaned)
    setCaution(formatted)
  }

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
    // Supprimer tous les espaces pour reformater
    const cleaned = inputValue.replace(/\s/g, '')
    // Formater avec séparateurs de milliers
    const formatted = formatMontant(cleaned)
    setMontantPaiement(formatted)
  }

  // Fonction pour charger les données du contrat
  const handleAfficher = async () => {
    if (!numeroContrat.trim()) {
      toast.error("Veuillez saisir un numéro de contrat")
      return
    }

    setLoading(true)
    try {
      // TODO: Appeler l'API pour charger les données du contrat
      // const contratData = await ContratService.getByNumero(apiClient, numeroContrat.trim())
      
      // TODO: Appeler l'API pour charger les données du contrat
      // const contratData = await ContratService.getByNumero(apiClient, numeroContrat.trim())
      
      // Simulation pour l'instant
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remplir tous les champs du contrat
      setLibelle("Contrat de bail résidentiel")
      setNumeroLocataire("LOC001")
      setNomLocataire("KOUAME Jean")
      setGroupeCreanceCode("GC001")
      setGroupeCreanceLibelle("Baux immobiliers")
      setNumeroLogement("LOG123")
      setNumeroBloc("B01")
      setNumeroLot("L05")
      setNumeroILot("IL02")
      setDateDebut("2024-01-01")
      setDateFin("2024-12-31")
      setTypeCode("T001")
      setTypeLibelle("Résidentiel")
      setCaution("500 000")
      setOperation("Location")
      setContratCharge(true)
      toast.success("Contrat chargé avec succès")
    } catch (error: any) {
      console.error("Erreur lors du chargement du contrat:", error)
      toast.error(error.message || "Impossible de charger le contrat")
      // Réinitialiser les champs en cas d'erreur
      setLibelle("")
      setNumeroLocataire("")
      setNomLocataire("")
      setGroupeCreanceCode("")
      setGroupeCreanceLibelle("")
      setNumeroLogement("")
      setNumeroBloc("")
      setNumeroLot("")
      setNumeroILot("")
      setDateDebut("")
      setDateFin("")
      setTypeCode("")
      setTypeLibelle("")
      setCaution("")
      setOperation("")
      setContratCharge(false)
    } finally {
      setLoading(false)
    }
  }

  const handleEnregistrer = () => {
    // Convertir les montants formatés en nombres pour l'enregistrement
    const cautionValue = parseMontant(caution)
    const montantValue = parseMontant(montant)
    const montantPaiementValue = parseMontant(montantPaiement)

    // Préparer les données pour l'enregistrement
    const paiementData: any = {
      numeroContrat,
      // ... autres champs du contrat
      caution: cautionValue,
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

    // Logique d'enregistrement
    console.log("Enregistrement du paiement...", paiementData)
    toast.success("Paiement enregistré avec succès")
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
                    className="bg-blue-600 hover:bg-blue-700 text-white ml-1"
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
                    onChange={handleCautionChange}
                    className="w-32 bg-gray-100"
                    readOnly={contratCharge}
                    disabled={contratCharge}
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

              {/* Banque Agence */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Banque agence</Label>
                <div className="flex gap-2 flex-1 min-w-0">
                  <div className="w-80 flex-shrink-0">
                    <SearchableSelect
                      value={banqueAgenceCode}
                      onValueChange={(value) => {
                        setBanqueAgenceCode(value)
                        const selectedAgence = agencesItems.find((item) => item.value === value)
                        if (selectedAgence) {
                          setBanqueAgenceLibelle(selectedAgence.BQAG_LIB || selectedAgence.libelle || "")
                        } else {
                          setBanqueAgenceLibelle("")
                        }
                      }}
                      items={agencesItems}
                      placeholder="Code"
                      searchPlaceholder="Rechercher une agence..."
                      emptyMessage="Aucune agence trouvée"
                      isLoading={isLoadingAgences}
                      hasMore={hasMoreAgences}
                      onLoadMore={loadMoreAgences}
                      isFetchingMore={isFetchingMoreAgences}
                      onSearchChange={setAgencesSearch}
                      search={agencesSearch}
                      className="h-9 text-sm"
                    />
                  </div>
                  <Input
                    value={banqueAgenceLibelle}
                    className="flex-1 min-w-0 bg-gray-100"
                    readOnly
                    disabled
                    placeholder="Libellé"
                  />
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Mode de paiement</Label>
                <div className="flex gap-2 flex-1 min-w-0">
                  <div className="w-80 flex-shrink-0">
                    <SearchableSelect
                      value={modePaiementCode}
                      onValueChange={(value) => {
                        setModePaiementCode(value)
                        const selectedMode = modesPaiementItems.find((item) => item.value === value)
                        if (selectedMode) {
                          setModePaiementLibelle(selectedMode.TYP_PAIE_LIB || selectedMode.libelle || "")
                        } else {
                          setModePaiementLibelle("")
                        }
                      }}
                      items={modesPaiementItems}
                      placeholder="Code"
                      searchPlaceholder="Rechercher un mode de paiement..."
                      emptyMessage="Aucun mode de paiement trouvé"
                      isLoading={isLoadingModesPaiement}
                      onSearchChange={setModesPaiementSearch}
                      search={modesPaiementSearch}
                      className="h-9 text-sm"
                    />
                  </div>
                  <Input
                    value={modePaiementLibelle}
                    className="flex-1 min-w-0 bg-gray-100"
                    readOnly
                    disabled
                    placeholder="Libellé"
                  />
                </div>
              </div>

              {/* Nº EFFET */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">N effet</Label>
                <Input
                  value={numeroEffet}
                  onChange={(e) => setNumeroEffet(e.target.value)}
                  placeholder="Saisir le numéro d'effet"
                  className="flex-1 min-w-0 bg-white"
                />
              </div>

              {/* Montant et Date */}
              <div className="flex items-center gap-2 w-full">
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 pr-1">Montant</Label>
                <Input
                  value={montant}
                  onChange={handleMontantChange}
                  placeholder="Saisir le montant"
                  className="flex-1 min-w-0 bg-white"
                />
                <Label className="text-sm font-bold text-gray-700 w-32 flex-shrink-0 ml-4 pr-1">Date</Label>
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

