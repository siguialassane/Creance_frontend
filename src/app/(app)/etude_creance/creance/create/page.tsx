"use client"

import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { Box, Button, Card, CardBody, CardHeader, Heading, Text, VStack, HStack, Progress, Divider, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import CreanceForm from "@/components/creance-form/creance-form";

const NouvelleCreancePageInner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const totalSteps = 5;
  const formRef = useRef<any>(null);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const steps = [
    { id: 1, title: "Informations générales", description: "Débiteur, groupe créance, type d'objet, capital initial" },
    { id: 2, title: "Informations générales 2", description: "Numéro, entité, objet, dates et échéances" },
    { id: 3, title: "Détails financiers", description: "Montants, intérêts, commissions et totaux" },
    { id: 4, title: "Pièces", description: "Type, référence, libellé et dates" },
    { id: 5, title: "Garanties", description: "Garanties personnelles ou réelles" }
  ];

  // Récupérer les paramètres du débiteur depuis l'URL
  const debiteurId = searchParams.get('debiteurId');
  const debiteurCode = searchParams.get('debiteurCode');
  const debiteurNom = searchParams.get('debiteurNom');
  const debiteurPrenom = searchParams.get('debiteurPrenom');

  useEffect(() => {
    // Pré-remplir les données du débiteur si elles sont fournies
    if (debiteurId && debiteurCode && debiteurNom && debiteurPrenom) {
      setFormData(prev => ({
        ...prev,
        debiteurCode: debiteurCode,
        debiteurNom: debiteurNom,
        debiteurPrenom: debiteurPrenom
      }));
    }
  }, [debiteurId, debiteurCode, debiteurNom, debiteurPrenom]);

  const validateCurrentStep = () => {
    if (!formRef.current) return false;
    
    // Déclencher la validation du formulaire
    return formRef.current.validateStep();
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      // Navigation libre entre les étapes sans validation bloquante
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: any) => {
    console.log("Données de la créance:", data);
    // Ici vous pouvez ajouter la logique d'enregistrement
    toast({
      title: "Créance créée",
      description: "La créance a été créée avec succès.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // Rediriger vers la liste des créances après création
    router.push("/etude_creance/creance/views");
  };

  const handleBack = () => {
    router.push("/etude_creance/creance/views");
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* En-tête avec design moderne */}
        <div className="py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2 mb-5 bg-primary w-full py-4 px-8">
              <h1 className="text-2xl tracking-tight" style={{ fontWeight: 'bold', color: '#fff' }}>
                Création d'une Créance
              </h1>
              <p className="text-base text-white">
                Créez une nouvelle créance en quelques étapes
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
                  Enregistrer
                </Button>
              )}
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default function NouvelleCreancePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <NouvelleCreancePageInner />
    </Suspense>
  )
}
