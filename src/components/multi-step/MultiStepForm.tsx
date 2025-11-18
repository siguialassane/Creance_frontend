"use client"

import { useState, useCallback, ReactNode } from "react";

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
  /**
   * Label personnalisé pour le bouton de soumission
   */
  submitButtonLabel?: string;
  /**
   * Cacher le bouton de soumission (utile en mode lecture seule)
   */
  hideSubmitButton?: boolean;
};

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  isSubmitting = false,
  children,
  onValidationError,
  submitButtonLabel = 'Enregistrer',
  hideSubmitButton = false,
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
    <div className="flex flex-col gap-6 w-full">
      {/* En-tête avec indicateurs de steps */}
      <div>
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <p
              key={step.id}
              className={`text-sm font-medium ${
                currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              {step.title}
            </p>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Titre et description du step actuel */}
      <div>
        <h3 className="text-lg font-semibold text-orange-600 mb-2">
          {steps[currentStepIndex]?.title}
        </h3>
        <p className="text-sm text-gray-600">
          {steps[currentStepIndex]?.description}
        </p>
      </div>

      {/* Contenu du step (children) */}
      <div>{children}</div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <div>
          {!isFirstStep && (
            <button
              onClick={handlePrevious}
              disabled={isSubmitting || validatingStep}
              className="px-6 py-2 min-w-[100px] border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Précédent
            </button>
          )}
        </div>
        <div>
          {!isLastStep ? (
            <button
              onClick={handleNext}
              disabled={validatingStep}
              className="px-6 py-2 min-w-[100px] bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {validatingStep ? 'Validation...' : 'Suivant'}
            </button>
          ) : !hideSubmitButton ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || validatingStep}
              className="px-6 py-2 min-w-[100px] bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {validatingStep ? 'Validation...' : isSubmitting ? 'Enregistrement...' : submitButtonLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
