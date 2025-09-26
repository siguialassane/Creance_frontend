"use client"

import { useState, useRef } from "react";
import { Box, Button, Card, CardBody, CardHeader, Heading, Text, VStack, HStack, Progress, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import DebiteurForm from "@/components/debiteur-form/debiteur-form";

const NouveauDebiteurPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const totalSteps = 3;
  const formRef = useRef<any>(null);
  const toast = useToast();
  const router = useRouter();

  const steps = [
    { id: 1, title: "Informations générales", description: "Code, catégorie, adresse, email et type de débiteur" },
    { id: 2, title: "Personne physique/morale", description: "Informations détaillées selon le type sélectionné" },
    { id: 3, title: "Domiciliation", description: "Type, compte, banque et agence" }
  ];

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
    console.log("Données du débiteur:", data);
    // Ici vous pouvez ajouter la logique d'enregistrement
    toast({
      title: "Débiteur créé",
      description: "Le débiteur a été créé avec succès.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // Rediriger vers la liste des débiteurs
    router.push("/etude_creance/debiteur/views");
  };

  const handleBack = () => {
    router.push("/etude_creance/debiteur/views");
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
                Création d'un Débiteur
              </h1>
              <p className="text-base text-white">
                Créez un nouveau débiteur en quelques étapes
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
            <DebiteurForm
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
                  Créer le débiteur
                </Button>
              )}
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default NouveauDebiteurPage;
