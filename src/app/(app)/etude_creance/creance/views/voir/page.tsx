"use client"

import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CreanceForm from "@/components/creance-form/creance-form";
import { Button } from "@/components/ui/button";
import { useApiClient } from "@/hooks/useApiClient";
import { CreanceService } from "@/services/creance.service";
import { CreanceResponse } from "@/types/creance";
import { getStatutRecouvrementLibelle } from "@/lib/constants/statut-recouvrement";
import { ArrowLeft, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const VoirCreancePageInner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [creanceData, setCreanceData] = useState<CreanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 4; // Mis à jour selon la nouvelle structure
  const formRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const creanceId = searchParams.get('id');
  const apiClient = useApiClient();

  const steps = [
    { id: 1, title: "Informations générales", description: "Débiteur, groupe créance, objet, capital initial, dates et conditions" },
    { id: 2, title: "Détails financiers", description: "Montants, intérêts, commissions et totaux (calculés automatiquement)" },
    { id: 3, title: "Pièces jointes", description: "Documents justificatifs de la créance" },
    { id: 4, title: "Garanties", description: "Garanties personnelles ou réelles" }
  ];

  // Transformation des données API vers le format du formulaire selon la documentation
  const transformApiDataToForm = (apiData: CreanceResponse) => {
    return {
      // Étape 1: Informations générales (fusion step1 + step2)
      debiteur: apiData.DEB_CODE,
      groupeCreance: apiData.GRP_CREAN_CODE || apiData.GC_CODE || '',
      objetCreance: apiData.OBJ_CREAN_CODE || apiData.OC_CODE || '',
      capitalInitial: apiData.CREAN_CAPIT_INIT,
      montantDecaisse: apiData.CREAN_MONT_DECAISSE || 0,
      numeroPrecedent: apiData.CREAN_CODE_PREC || apiData.CREAN_NUM_PREC || '',
      numeroAncien: apiData.CREAN_CODE_ANC || apiData.CREAN_NUM_ANC || '',
      dateDeblocage: apiData.CREAN_DATEFT || apiData.CREAN_DATE_DEBLOCAGE || '',
      dateEcheance: apiData.CREAN_DATECH || apiData.CREAN_DATE_ECHEANCE || '',
      periodicite: apiData.CREAN_PERIODICITE || '',
      duree: apiData.CREAN_NBECH || apiData.CREAN_DUREE || 0,
      tauxInteretConventionnel: apiData.CREAN_TAUXIC || apiData.CREAN_TAUX_IC || 0,
      tauxInteretRetard: apiData.CREAN_TAUXIR || apiData.CREAN_TAUX_IR || 0,
      ordonnateur: apiData.ORDO_CODE || '',
      statut: apiData.CREAN_STATRECOUV || apiData.CREAN_STATUT || '',
      objetDetail: apiData.CREAN_OBJET || '',

      // Étape 2: Détails financiers
      montantInteretConventionnel: apiData.CREAN_MONT_IC || 0,
      commissionBanque: apiData.CREAN_COMM_BANQ || 0,
      montantDu: apiData.CREAN_MONT_DU || 0,
      montantRembourse: apiData.CREAN_MONT_REMB || apiData.CREAN_DEJ_REMB || 0,
      montantInteretRetard: apiData.CREAN_MONT_IR || 0,
      frais: apiData.CREAN_FRAIS || 0,
      encours: apiData.CREAN_ENCOURS || 0,
      montantARembourser: apiData.CREAN_MONT_A_REMB || 0,
      montantImpaye: apiData.CREAN_MONT_IMPAYE || 0,
      totalDu: apiData.CREAN_TOTAL_DU || 0,
      penalite: apiData.CREAN_PENALITE || 0,
      totalSolde: apiData.CREAN_TOT_SOLDE || 0,

      // Étape 3: Pièces jointes (gérées par state dans CreanceForm)
      pieces: apiData.pieces || [],

      // Étape 4: Garanties (gérées par state dans CreanceForm)
      garantiesReelles: apiData.garantiesReelles || [],
      garantiesPersonnelles: apiData.garantiesPersonnelles || [],
    };
  };

  useEffect(() => {
    const loadCreance = async () => {
      if (!creanceId) {
        setError("ID de créance manquant");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const apiData = await CreanceService.getByCode(apiClient, creanceId);
        console.log('Données créance reçues:', apiData);

        // Conserver les données complètes pour l'affichage des garanties et pièces
        setCreanceData(apiData);
        
        const transformedData = transformApiDataToForm(apiData);
        setFormData(transformedData);
      } catch (error: any) {
        console.error('Erreur lors du chargement de la créance:', error);
        setError(error.message || "Impossible de charger la créance");
        toast.error(error.message || "Impossible de charger la créance");
      } finally {
        setLoading(false);
      }
    };

    loadCreance();
  }, [creanceId, apiClient]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    router.push("/etude_creance/creance/views");
  };

  const handleEdit = () => {
    router.push(`/etude_creance/creance/edit?id=${creanceId}`);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p className="text-gray-600">Chargement de la créance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p className="text-red-500">Erreur: {error}</p>
        <Button onClick={handleBack} className="mt-4">Retour à la liste</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* En-tête avec design moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>Consultation de Créance</h1>
              <p className="text-base text-gray-600">
                Consultez les détails de la créance {formData.numeroCreance || creanceId}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleEdit}
                className="bg-[#28A325] hover:bg-[#047857] text-white"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button
                onClick={handleBack}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la liste
              </Button>
            </div>
          </div>
          
          {/* Indicateurs des étapes */}
          <div className="flex items-center justify-between mb-4 mt-12">
            <div className="flex items-center justify-between w-full">
              <div className={`text-sm font-medium ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales
              </div>
              <div className={`text-sm font-medium ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                Détails financiers
              </div>
              <div className={`text-sm font-medium ${currentStep >= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                Pièces jointes
              </div>
              <div className={`text-sm font-medium ${currentStep >= 4 ? 'text-orange-600' : 'text-gray-500'}`}>
                Garanties
              </div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-orange-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-orange-600 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          <div>
            <CreanceForm
              ref={formRef}
              currentStep={currentStep}
              formData={formData}
              onDataChange={() => {}} // Pas de modification en mode consultation
              onSubmit={() => {}} // Pas de soumission en mode consultation
              readOnly={true} // Mode lecture seule
            />
          </div>

          {/* Affichage des garanties et pièces en mode détail (si step 3 ou 4) */}
          {currentStep === 3 && creanceData?.pieces && creanceData.pieces.length > 0 && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pièces jointes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Numéro</TableHead>
                        <TableHead>Date de dépôt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creanceData.pieces.map((piece, index) => (
                        <TableRow key={index}>
                          <TableCell>{piece.PIECE_TYPE || '-'}</TableCell>
                          <TableCell>{piece.PIECE_NUM || '-'}</TableCell>
                          <TableCell>
                            {piece.PIECE_DATEDEP 
                              ? new Date(piece.PIECE_DATEDEP).toLocaleDateString('fr-FR')
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 4 && (
            <div className="mt-6 space-y-6">
              {/* Garanties réelles */}
              {creanceData?.garantiesReelles && creanceData.garantiesReelles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Garanties réelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Référence</TableHead>
                          <TableHead>Valeur estimée</TableHead>
                          <TableHead>Date de valorisation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {creanceData.garantiesReelles.map((garantie, index) => (
                          <TableRow key={index}>
                            <TableCell>{garantie.GAREEL_TYPGAR || '-'}</TableCell>
                            <TableCell>{garantie.GAREEL_REFGAR || '-'}</TableCell>
                            <TableCell>
                              {garantie.GAREEL_VALEST 
                                ? new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: 'XOF',
                                    minimumFractionDigits: 0
                                  }).format(garantie.GAREEL_VALEST)
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {garantie.GAREEL_DATEVAL 
                                ? new Date(garantie.GAREEL_DATEVAL).toLocaleDateString('fr-FR')
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Garanties personnelles */}
              {creanceData?.garantiesPersonnelles && creanceData.garantiesPersonnelles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Garanties personnelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Code débiteur</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Prénom</TableHead>
                          <TableHead>Raison sociale</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {creanceData.garantiesPersonnelles.map((garantie, index) => (
                          <TableRow key={index}>
                            <TableCell>{garantie.GARPHYS_TYPGAR || '-'}</TableCell>
                            <TableCell>{garantie.DEB_CODE || '-'}</TableCell>
                            <TableCell>{garantie.DEB_NOM || '-'}</TableCell>
                            <TableCell>{garantie.DEB_PREN || '-'}</TableCell>
                            <TableCell>{garantie.DEB_RAIS_SOCIALE || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Message si aucune garantie */}
              {(!creanceData?.garantiesReelles || creanceData.garantiesReelles.length === 0) &&
               (!creanceData?.garantiesPersonnelles || creanceData.garantiesPersonnelles.length === 0) && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-500 text-center">Aucune garantie enregistrée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="pt-6 pb-6 px-6">
            <div className="flex justify-between items-center">
              <div>
                {currentStep > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50 bg-white px-24 py-4 text-base min-w-[120px]"
                  >
                    Précédent
                  </Button>
                )}
              </div>
              <div>
                <Button 
                  onClick={handleNext}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                  style={{ backgroundColor: '#f97316', color: 'white' }}
                  disabled={currentStep === totalSteps}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VoirCreancePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <VoirCreancePageInner />
    </Suspense>
  )
}