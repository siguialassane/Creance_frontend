"use client"

import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { Box, Button as ChakraButton, Card, CardBody, CardHeader, Heading, Text, VStack, HStack, Progress, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import CreanceForm from "@/components/creance-form/creance-form";
import { Button } from "@/components/ui/button";

const VoirCreancePageInner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const totalSteps = 5;
  const formRef = useRef<any>(null);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const creanceId = searchParams.get('id');

  // Données de test (en réalité, vous récupéreriez ces données depuis l'API)
  const mockCreanceData = {
    // Étape 1: Informations générales
    debiteur: "deb1",
    groupeCreance: "GC001",
    typeObjet: "OC001",
    capitalInitial: 5000000,
    montantDecaisse: 5000000,
    steCaution: "Société de Caution ABC",
    statutRecouvrement: "oui",
    numeroPrecedent: "CRE-2023-999",
    numeroAncien: "OLD-001",
    typeStructure: "SARL",
    classeCreance: "CLAS001",
    
    // Étape 2: Informations générales 2
    numeroCreance: "CRE-2024-001",
    entite: "ENT001",
    objetCreance: "Prêt immobilier",
    periodicite: "mensuelle",
    nbEch: 12,
    dateReconnaissance: "2024-01-15",
    datePremiereEcheance: "2024-02-15",
    dateDerniereEcheance: "2024-12-15",
    dateOctroi: "2024-01-10",
    datePremierPrecept: "2024-01-20",
    creanceSoldeAvantLid: "Solde avant LID",
    
    // Étape 3: Détails financiers
    ordonnateur: "Ministère des Finances",
    montantRembourse: 5600000,
    montantDu: 5600000,
    montantDejaRembourse: 3600000,
    montantImpaye: 2000000,
    diversFrais: 50000,
    commission: 100000,
    montantAss: 25000,
    intConvPourcentage: 10,
    montantIntConvPaye: 500000,
    intRetPourcentage: 2,
    encours: 100000,
    totalDu: 2150000,
    penalite1Pourcent: 21500,
    totalARecouvrer: 2271500,
    
    // Étape 4: Pièces
    typePiece: "contrat",
    reference: "REF-001",
    libelle: "Contrat de prêt immobilier",
    dateEmission: "2024-01-15",
    dateReception: "2024-01-16",
    
    // Étape 5: Garanties
    typeGarantie: "personnelles",
    type: "Caution personnelle",
    employeur: "ENT002",
    statutSal: "Actif",
    quartier: "Q001",
    priorite: "Haute",
    nom: "Koné",
    prenoms: "Amadou",
    dateInscription: "2024-01-15",
    fonction: "Directeur",
    profession: "Fonctionnaire",
    adressePostale: "Cocody, Angré 8ème Tranche, Abidjan"
  };

  const steps = [
    { id: 1, title: "Informations générales", description: "Débiteur, groupe créance, type d'objet, capital initial" },
    { id: 2, title: "Informations générales 2", description: "Numéro, entité, objet, dates et échéances" },
    { id: 3, title: "Détails financiers", description: "Montants, intérêts, commissions et totaux" },
    { id: 4, title: "Pièces", description: "Type, référence, libellé et dates" },
    { id: 5, title: "Garanties", description: "Garanties personnelles ou réelles" }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setFormData(mockCreanceData);
      setLoading(false);
    }, 1000);
  }, [creanceId]);

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

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* En-tête avec design moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>Consultation de Créance</h1>
              <p className="text-base text-gray-600">
                Consultez les détails de la créance {mockCreanceData.numeroCreance}
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