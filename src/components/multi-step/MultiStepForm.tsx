"use client"

import { useState, useCallback, ReactNode } from "react";
import { Box, Button, HStack, VStack, Text, Progress } from "@chakra-ui/react";

export type StepConfig = {
  id: number;
  title: string;
  description: string;
  /**
   * Fonction de validation optionnelle qui retourne true si le step est valide
   * Utilisée pour empêcher la navigation vers le step suivant
   */
  validate?: () => Promise<boolean>;
};

type MultiStepFormProps = {
  steps: StepConfig[];
  currentStep: number;
  onStepChange: (newStep: number) => void;
  onSubmit: () => void | Promise<void>;
  isSubmitting?: boolean;
  children: ReactNode;
  /**
   * Afficher les erreurs de validation
   */
  onValidationError?: (message: string) => void;
};

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  isSubmitting = false,
  children,
  onValidationError,
}: MultiStepFormProps) {
  const [validatingStep, setValidatingStep] = useState(false);

  const currentStepIndex = currentStep - 1;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;
  const progressPercent = ((currentStep) / steps.length) * 100;

  const handleNext = useCallback(async () => {
    const currentStepConfig = steps[currentStepIndex];

    // Valider le step actuel avant de passer au suivant
    if (currentStepConfig.validate) {
      setValidatingStep(true);
      try {
        const isValid = await currentStepConfig.validate();
        if (!isValid) {
          onValidationError?.("Veuillez remplir tous les champs obligatoires avant de continuer.");
          setValidatingStep(false);
          return;
        }
      } catch (error) {
        console.error('Erreur de validation:', error);
        onValidationError?.("Une erreur est survenue lors de la validation. Veuillez réessayer.");
        setValidatingStep(false);
        return;
      }
      setValidatingStep(false);
    }

    // Passer au step suivant
    if (!isLastStep) {
      onStepChange(currentStep + 1);
    }
  }, [currentStep, currentStepIndex, isLastStep, onStepChange, onValidationError, steps]);

  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1);
    }
  }, [currentStep, isFirstStep, onStepChange]);

  const handleSubmit = useCallback(async () => {
    const currentStepConfig = steps[currentStepIndex];

    // Valider le dernier step avant soumission
    if (currentStepConfig.validate) {
      setValidatingStep(true);
      try {
        const isValid = await currentStepConfig.validate();
        if (!isValid) {
          onValidationError?.("Veuillez remplir tous les champs obligatoires avant d'enregistrer.");
          setValidatingStep(false);
          return;
        }
      } catch (error) {
        console.error('Erreur de validation:', error);
        onValidationError?.("Une erreur est survenue lors de la validation. Veuillez réessayer.");
        setValidatingStep(false);
        return;
      }
      setValidatingStep(false);
    }

    await onSubmit();
  }, [currentStepIndex, onSubmit, onValidationError, steps]);

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* En-tête avec indicateurs de steps */}
      <Box>
        <HStack justify="space-between" mb={4}>
          {steps.map((step, index) => (
            <Text
              key={step.id}
              fontSize="sm"
              fontWeight="medium"
              color={currentStep >= step.id ? 'orange.600' : 'gray.500'}
            >
              {step.title}
            </Text>
          ))}
        </HStack>
        <Progress
          value={progressPercent}
          size="sm"
          colorScheme="orange"
          borderRadius="full"
          bg="gray.200"
        />
      </Box>

      {/* Titre et description du step actuel */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="orange.600" mb={2}>
          {steps[currentStepIndex]?.title}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {steps[currentStepIndex]?.description}
        </Text>
      </Box>

      {/* Contenu du step (children) */}
      <Box>{children}</Box>

      {/* Navigation */}
      <HStack justify="space-between" pt={6} borderTop="1px" borderColor="gray.200">
        <Box>
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              isDisabled={isSubmitting || validatingStep}
              px={24}
              py={4}
              minW="120px"
            >
              Précédent
            </Button>
          )}
        </Box>
        <Box>
          {!isLastStep ? (
            <Button
              onClick={handleNext}
              bg="orange.500"
              color="white"
              _hover={{ bg: 'orange.600' }}
              isLoading={validatingStep}
              loadingText="Validation..."
              px={24}
              py={4}
              minW="120px"
            >
              Suivant
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              bg="orange.500"
              color="white"
              _hover={{ bg: 'orange.600' }}
              isLoading={isSubmitting || validatingStep}
              loadingText={validatingStep ? "Validation..." : "Enregistrement..."}
              px={24}
              py={4}
              minW="120px"}
            >
              Enregistrer
            </Button>
          )}
        </Box>
      </HStack>
    </VStack>
  );
}
