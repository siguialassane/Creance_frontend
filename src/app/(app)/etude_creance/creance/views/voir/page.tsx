"use client"

import { useState, useRef, useEffect } from "react";
import { Box, Button, Card, CardBody, CardHeader, Heading, Text, VStack, HStack, Progress, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import CreanceForm from "@/components/creance-form/creance-form";

const VoirCreancePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const totalSteps = 4;
  const formRef = useRef<any>(null);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const creanceId = searchParams.get('id');

  // Données de test (en réalité, vous récupéreriez ces données depuis l'API)
  const mockCreanceData = {
    numeroCreance: "CRE-2024-001",
    objetCreance: "Prêt immobilier",
    groupeCreance: "Prêts immobiliers",
    debiteurCode: "DEB-001",
    periodicite: "Mensuelle",
    capitalInitial: 5000000,
    montantInteretConventionnel: 500000,
    montantCommissionBanque: 100000,
    montantARembourser: 5600000,
    montantDejaRembourse: 3600000,
    montantImpaye: 2000000,
    montantInteretRetard: 100000,
    frais: 50000,
    penalite: 20000,
    totalSolde: 2170000,
    garantiePersonnelle: true,
    garantieReelle: false,
    validation: true,
    commentaires: "Créance en cours de remboursement"
  };

  const steps = [
    { id: 1, title: "Informations générales", description: "Données de base de la créance" },
    { id: 2, title: "Détails financiers", description: "Montants et échéances" },
    { id: 3, title: "Garanties", description: "Garanties et sûretés" },
    { id: 4, title: "Validation", description: "Vérification et enregistrement" }
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
        {/* En-tête avec boutons d'action */}
        <HStack justify="space-between" align="start">
          <Box>
            <Heading size="lg" mb={2} color="#1a202c">Consultation de Créance</Heading>
            <Text color="#718096">Consultez les détails de la créance {mockCreanceData.numeroCreance}</Text>
          </Box>
          <HStack spacing={3}>
            <Button
              leftIcon={<EditIcon />}
              onClick={handleEdit}
              colorScheme="green"
              bg="#28A325"
              _hover={{ bg: "#047857" }}
            >
              Modifier
            </Button>
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="outline"
              colorScheme="gray"
            >
              Retour à la liste
            </Button>
          </HStack>
        </HStack>

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
              onDataChange={() => {}} // Pas de modification en mode consultation
              onSubmit={() => {}} // Pas de soumission en mode consultation
              readOnly={true} // Mode lecture seule
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

              <HStack spacing={3}>
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
                    leftIcon={<EditIcon />}
                    onClick={handleEdit}
                    colorScheme="green"
                    bg="#28A325"
                    _hover={{ bg: "#047857" }}
                  >
                    Modifier cette créance
                  </Button>
                )}
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default VoirCreancePage;