"use client"

import { createContext, useContext, ReactNode } from "react";
import { useDebiteurFormDataProgressive, DebiteurFormData } from "@/hooks/useDebiteurFormDataStep";

type DebiteurFormContextType = {
  formData: DebiteurFormData;
  isLoading: boolean;
  error: any;
  // États de chargement par étape
  isLoadingStep1: boolean;
  isLoadingStep2: boolean;
  isLoadingStep3: boolean;
};

const DebiteurFormContext = createContext<DebiteurFormContextType | null>(null);

type DebiteurFormProviderProps = {
  children: ReactNode;
  currentStep?: number;
};

export function DebiteurFormProvider({ children, currentStep = 1 }: DebiteurFormProviderProps) {
  const { 
    data, 
    isLoading, 
    error,
    step1,
    step2,
    step3,
  } = useDebiteurFormDataProgressive(currentStep);

  // Créer un objet formData par défaut avec des tableaux vides pour éviter les erreurs
  const defaultFormData: DebiteurFormData = {
    categoriesDebiteur: [],
    typesDebiteur: [],
    civilites: [],
    quartiers: [],
    nationalites: [],
    fonctions: [],
    professions: [],
    employeurs: [],
    statutsSalarie: [],
    typesDomicil: [],
    banques: [],
    agencesBanque: [],
  };

  const formData = data || defaultFormData;

  // Les données sont toujours disponibles (même si certaines sont en cours de chargement)
  // On ne bloque plus le rendu, les selects afficheront leurs propres indicateurs de chargement
  return (
    <DebiteurFormContext.Provider 
      value={{ 
        formData,
        isLoading,
        error,
        isLoadingStep1: step1.isLoading,
        isLoadingStep2: step2.isLoading,
        isLoadingStep3: step3.isLoading,
      }}
    >
      {children}
    </DebiteurFormContext.Provider>
  );
}

/**
 * Hook pour accéder aux données du formulaire débiteur
 * À utiliser dans les sous-composants du formulaire
 */
export function useDebiteurFormContext() {
  const context = useContext(DebiteurFormContext);
  if (!context) {
    throw new Error('useDebiteurFormContext must be used within DebiteurFormProvider');
  }
  return context;
}
