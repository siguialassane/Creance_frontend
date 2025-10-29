"use client"

import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import CreanceForm from "@/components/creance-form/creance-form";
import { useApiClient } from "@/hooks/useApiClient";
import { CreanceService } from "@/services/creance.service";
import { CreanceResponse } from "@/types/creance";

const EditerCreancePageInner = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 5;
  const formRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const creanceId = searchParams.get('id');
  const apiClient = useApiClient();
  const toast = useToast();

  const steps = [
    { id: 1, title: "Informations générales", description: "Débiteur, groupe créance, type d'objet, capital initial" },
    { id: 2, title: "Informations générales 2", description: "Numéro, entité, objet, dates et échéances" },
    { id: 3, title: "Détails financiers", description: "Montants, intérêts, commissions et totaux" },
    { id: 4, title: "Pièces", description: "Type, référence, libellé et dates" },
    { id: 5, title: "Garanties", description: "Garanties personnelles ou réelles" }
  ];

  // Transformation des données API vers le format du formulaire (même que dans voir/page.tsx)
  const transformApiDataToForm = (apiData: CreanceResponse) => {
    return {
      debiteur: apiData.DEB_CODE,
      groupeCreance: apiData.GC_CODE,
      typeObjet: apiData.OC_CODE,
      capitalInitial: apiData.CREAN_CAPIT_INIT,
      montantDecaisse: apiData.CREAN_MONT_DECAISSE || 0,
      steCaution: '',
      statutRecouvrement: '',
      numeroPrecedent: apiData.CREAN_NUM_PREC || '',
      numeroAncien: apiData.CREAN_NUM_ANC || '',
      typeStructure: '',
      classeCreance: '',
      numeroCreance: apiData.CREAN_CODE,
      entite: '',
      objetCreance: apiData.CREAN_OBJET || '',
      periodicite: apiData.CREAN_PERIODICITE?.toLowerCase() || '',
      nbEch: apiData.CREAN_DUREE || 0,
      dateReconnaissance: '',
      datePremiereEcheance: '',
      dateDerniereEcheance: apiData.CREAN_DATE_ECHEANCE || '',
      dateOctroi: apiData.CREAN_DATE_DEBLOCAGE || '',
      datePremierPrecept: '',
      creanceSoldeAvantLid: '',
      ordonnateur: apiData.ORDO_CODE,
      montantRembourse: apiData.CREAN_MONT_A_REMB || 0,
      montantDu: apiData.CREAN_MONT_DU || 0,
      montantDejaRembourse: apiData.CREAN_MONT_REMB || 0,
      montantImpaye: apiData.CREAN_MONT_IMPAYE || 0,
      diversFrais: apiData.CREAN_FRAIS || 0,
      commission: apiData.CREAN_COMM_BANQ || 0,
      montantAss: 0,
      intConvPourcentage: apiData.CREAN_TAUX_IC || 0,
      montantIntConvPaye: apiData.CREAN_MONT_IC || 0,
      intRetPourcentage: apiData.CREAN_TAUX_IR || 0,
      encours: apiData.CREAN_ENCOURS || 0,
      totalDu: apiData.CREAN_TOTAL_DU || 0,
      penalite1Pourcent: apiData.CREAN_PENALITE || 0,
      totalARecouvrer: apiData.CREAN_TOT_SOLDE || 0,
      typePiece: '',
      reference: '',
      libelle: apiData.CREAN_OBS || '',
      dateEmission: '',
      dateReception: '',
      typeGarantie: '',
      type: '',
      employeur: '',
      statutSal: '',
      quartier: '',
      priorite: '',
      nom: '',
      prenoms: '',
      dateInscription: '',
      fonction: '',
      profession: '',
      adressePostale: ''
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

        const transformedData = transformApiDataToForm(apiData);
        setFormData(transformedData);
      } catch (error: any) {
        console.error('Erreur lors du chargement de la créance:', error);
        setError(error.message || "Impossible de charger la créance");
        toast({
          title: "Erreur de chargement",
          description: error.message || "Impossible de charger la créance",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCreance();
  }, [creanceId, apiClient, toast]);

  const validateCurrentStep = () => {
    if (!formRef.current) return false;
    return formRef.current.validateStep();
  };

  const handleSubmit = async (data: any) => {
    console.log("Données de la créance modifiée:", data);
    if (!creanceId) return;

    setIsSubmitting(true);

    try {
      // Transformation des données du formulaire vers le format API
      const creanceData = {
        debiteur: data.debiteur,
        groupeCreance: data.groupeCreance,
        objetCreance: data.typeObjet,
        objetDetail: data.objetCreance,
        capitalInitial: data.capitalInitial,
        montantDecaisse: data.montantDecaisse,
        montantInteretConventionnel: data.montantIntConvPaye,
        commissionBanque: data.commission,
        numeroPrecedent: data.numeroPrecedent,
        numeroAncien: data.numeroAncien,
        montantDu: data.montantDu,
        montantRembourse: data.montantDejaRembourse,
        montantInteretRetard: data.intRetPourcentage,
        frais: data.diversFrais,
        encours: data.encours,
        dateDeblocage: data.dateOctroi,
        dateEcheance: data.dateDerniereEcheance,
        periodicite: data.periodicite?.toUpperCase(),
        duree: data.nbEch,
        tauxInteretConventionnel: data.intConvPourcentage,
        tauxInteretRetard: data.intRetPourcentage,
        ordonnateur: data.ordonnateur,
        statut: 'EN_COURS',
        observations: data.libelle
      };

      const response = await CreanceService.update(apiClient, creanceId, creanceData);

      if (response.success) {
        toast({
          title: "Créance mise à jour",
          description: "La créance a été mise à jour avec succès",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        router.push("/etude_creance/creance/views");
      } else {
        throw new Error(response.message || "Erreur lors de la mise à jour");
      }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur de mise à jour",
        description: error.message || "Impossible de mettre à jour la créance",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la créance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Contenu principal */}
          <div className="lg:col-span-12">
            
        {/* En-tête comme dans l'image */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>Modifier une créance</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full">
              <div className={`text-sm font-medium ${step >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales
              </div>
              <div className={`text-sm font-medium ${step >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales 2
              </div>
              <div className={`text-sm font-medium ${step >= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                Détails financiers
              </div>
              <div className={`text-sm font-medium ${step >= 4 ? 'text-orange-600' : 'text-gray-500'}`}>
                Pièces
              </div>
              <div className={`text-sm font-medium ${step >= 5 ? 'text-orange-600' : 'text-gray-500'}`}>
                Garanties
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-orange-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

            {/* Contenu du formulaire */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-orange-600 mb-2">
                  {steps[step - 1].title}
                </h2>
                <p className="text-sm text-gray-600">
                  {steps[step - 1].description}
                </p>
              </div>

              <CreanceForm
                ref={formRef}
                currentStep={step}
                formData={formData}
                onDataChange={setFormData}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Navigation comme dans l'image - pied de page */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  {step > 1 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(step - 1)}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50 bg-white px-24 py-4 text-base min-w-[120px]"
                    >
                      Précédent
                    </Button>
                  )}
                </div>
                <div>
                  {step < totalSteps ? (
                    <Button 
                      onClick={() => setStep(step + 1)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                      style={{ backgroundColor: '#f97316', color: 'white' }}
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubmit(formData)}
                      disabled={isSubmitting}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                      style={{ backgroundColor: '#f97316', color: 'white' }}
                    >
                      {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EditerCreancePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EditerCreancePageInner />
    </Suspense>
  )
}
