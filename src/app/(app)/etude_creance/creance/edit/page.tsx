"use client"

import { useState, useRef, useEffect } from "react";
import { Box, Button, Card, CardBody, CardHeader, Heading, Text, VStack, HStack, Progress, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import CreanceForm from "@/components/creance-form/creance-form";

const EditerCreancePage = () => {
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

  const validateCurrentStep = () => {
    if (!formRef.current) return false;
    
    // Déclencher la validation du formulaire
    return formRef.current.validateStep();
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: any) => {
    console.log("Données de la créance modifiée:", data);
    // Ici vous pouvez ajouter la logique de mise à jour
    toast({
      title: "Créance modifiée",
      description: "La créance a été modifiée avec succès.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // Rediriger vers la liste des créances après modification
    router.push("/etude_creance/creance/views");
  };

  const handleBack = () => {
    router.push("/etude_creance/creance/views");
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
        <div className="py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2 mb-5 bg-primary w-full py-4 px-8">
              <h1 className="text-2xl tracking-tight" style={{ fontWeight: 'bold', color: '#fff' }}>
                Modification d'une Créance
              </h1>
              <p className="text-base text-white">
                Modifiez la créance {mockCreanceData.numeroCreance}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-6 px-8">
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="outline"
              colorScheme="gray"
              size="md"
            >
              Retour à la liste
            </Button>
          </div>
        </div>

        {/* Indicateur de progression */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" justify="space-between">
                {steps.map((step, index) => (
                  <VStack key={step.id} spacing={2} flex={1}>
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg={currentStep >= step.id ? "#28A325" : "gray.200"}
                      color={currentStep >= step.id ? "white" : "gray.500"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                    >
                      {step.id}
                    </Box>
                    <Text fontSize="sm" fontWeight="medium" textAlign="center">
                      {step.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      {step.description}
                    </Text>
                  </VStack>
                ))}
              </HStack>
              <Progress value={progressPercentage} w="full" colorScheme="green" size="sm" />
            </VStack>
          </CardBody>
        </Card>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <Heading size="md" color="#1a202c">
              Étape {currentStep} : {steps[currentStep - 1].title}
            </Heading>
            <Text color="#718096">{steps[currentStep - 1].description}</Text>
          </CardHeader>
          <CardBody>
            <CreanceForm
              ref={formRef}
              currentStep={currentStep}
              formData={formData}
              onDataChange={setFormData}
              onSubmit={handleSubmit}
            />
          </CardBody>
        </Card>

        {/* Navigation */}
        <Card>
          <CardBody>
            <HStack justify="space-between">
              <Button
                leftIcon={<ChevronLeftIcon />}
                onClick={handlePrevious}
                isDisabled={currentStep === 1}
                variant="outline"
              >
                Précédent
              </Button>
              
              <HStack spacing={4}>
                <Text fontSize="sm" color="gray.500">
                  Étape {currentStep} sur {totalSteps}
                </Text>
              </HStack>

              {currentStep < totalSteps ? (
                <Button
                  rightIcon={<ChevronRightIcon />}
                  onClick={handleNext}
                  colorScheme="green"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit(formData)}
                  colorScheme="green"
                >
                  Mettre à jour la créance
                </Button>
              )}
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default EditerCreancePage;
