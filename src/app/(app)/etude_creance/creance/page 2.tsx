"use client"

import { useState, useRef } from "react";
import { Box, Button, Card, CardBody, CardHeader, Heading, Text, VStack, HStack, Progress, Divider, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import CreanceForm from "@/components/creance-form/creance-form";

const CreancePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const totalSteps = 4;
  const formRef = useRef<any>(null);
  const toast = useToast();

  const steps = [
    { id: 1, title: "Informations générales", description: "Données de base de la créance" },
    { id: 2, title: "Détails financiers", description: "Montants et échéances" },
    { id: 3, title: "Garanties", description: "Garanties et sûretés" },
    { id: 4, title: "Validation", description: "Vérification et enregistrement" }
  ];

  const validateCurrentStep = () => {
    if (!formRef.current) return false;
    
    // Déclencher la validation du formulaire
    return formRef.current.validateStep();
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCurrentStep(currentStep + 1);
      } else {
        toast({
          title: "Validation requise",
          description: "Veuillez remplir tous les champs obligatoires avant de continuer.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
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
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* En-tête */}
        <Box>
          <Heading 
            size="xl" 
            mb={2} 
            color="black" 
            fontWeight="900"
            fontSize="2rem"
          >
            Gestion des Créances
          </Heading>
          <Text color="black">Programme de gestion des créances</Text>
        </Box>

        {/* Barre verte avec titre de section */}
        <Box 
          px={8} 
          py={2} 
          bg="#28A325" 
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="lg" fontWeight="semibold" display="flex" alignItems="center">
            <Text as="span" fontSize="1rem" mr={1.5} transform="translateY(-4px)" fontWeight="normal" display="inline-block" lineHeight="1">⌄</Text>CRÉANCES
          </Text>
        </Box>

        {/* Section Liste des créances */}
        <Box pt={4} pb={2} px={8}>
          <Box display="flex" alignItems="center" gap={2} color="gray.700" fontWeight="semibold" fontSize="sm">
            <Text>LISTE DES CRÉANCES</Text>
          </Box>
        </Box>

        {/* Indicateur de progression */}
        <Box px={8} pb={4}>
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
        </Box>
      </VStack>
    </Box>
  );
};

export default CreancePage;
