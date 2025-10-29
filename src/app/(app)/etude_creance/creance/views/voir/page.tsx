"use client"

import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { Box, Button as ChakraButton, Card, CardBody, CardHeader, Heading, Text, VStack, HStack, Progress, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import CreanceForm from "@/components/creance-form/creance-form";
import { Button } from "@/components/ui/button";
import { useApiClient } from "@/hooks/useApiClient";
import { CreanceService } from "@/services/creance.service";
import { CreanceResponse } from "@/types/creance";

const VoirCreancePageInner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 5;
  const formRef = useRef<any>(null);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const creanceId = searchParams.get('id');
  const apiClient = useApiClient();

  const steps = [
    { id: 1, title: "Informations générales", description: "Débiteur, groupe créance, type d'objet, capital initial" },
    { id: 2, title: "Informations générales 2", description: "Numéro, entité, objet, dates et échéances" },
    { id: 3, title: "Détails financiers", description: "Montants, intérêts, commissions et totaux" },
    { id: 4, title: "Pièces", description: "Type, référence, libellé et dates" },
    { id: 5, title: "Garanties", description: "Garanties personnelles ou réelles" }
  ];

  // Transformation des données API vers le format du formulaire
  const transformApiDataToForm = (apiData: CreanceResponse) => {
    return {
      // Étape 1: Informations générales
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

      // Étape 2: Informations générales 2
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

      // Étape 3: Détails financiers
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

      // Étape 4: Pièces
      typePiece: '',
      reference: '',
      libelle: apiData.CREAN_OBS || '',
      dateEmission: '',
      dateReception: '',

      // Étape 5: Garanties
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
      <Box p={6} maxW="1200px" mx="auto">
        <Text>Chargement de la créance...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} maxW="1200px" mx="auto">
        <Text color="red.500">Erreur: {error}</Text>
        <ChakraButton mt={4} onClick={handleBack}>Retour à la liste</ChakraButton>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* En-tête avec design moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>Consultation de Créance</h1>
              <p className="text-base text-gray-600">
                Consultez les détails de la créance {formData.numeroCreance || creanceId}
              </p>
            </div>
            <HStack spacing={3}>
              <ChakraButton
                leftIcon={<EditIcon />}
                onClick={handleEdit}
                colorScheme="green"
                bg="#28A325"
                _hover={{ bg: "#047857" }}
              >
                Modifier
              </ChakraButton>
              <ChakraButton
                leftIcon={<ArrowBackIcon />}
                onClick={handleBack}
                variant="outline"
                colorScheme="gray"
              >
                Retour à la liste
              </ChakraButton>
            </HStack>
          </div>
          
          {/* Indicateurs des étapes */}
          <div className="flex items-center justify-between mb-4 mt-12">
            <div className="flex items-center justify-between w-full">
              <div className={`text-sm font-medium ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales
              </div>
              <div className={`text-sm font-medium ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales 2
              </div>
              <div className={`text-sm font-medium ${currentStep >= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                Détails financiers
              </div>
              <div className={`text-sm font-medium ${currentStep >= 4 ? 'text-orange-600' : 'text-gray-500'}`}>
                Pièces
              </div>
              <div className={`text-sm font-medium ${currentStep >= 5 ? 'text-orange-600' : 'text-gray-500'}`}>
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
      </VStack>
    </Box>
  );
};

export default function VoirCreancePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <VoirCreancePageInner />
    </Suspense>
  )
}