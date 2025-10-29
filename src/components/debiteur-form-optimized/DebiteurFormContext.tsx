"use client"

import { createContext, useContext, ReactNode } from "react";
import { useDebiteurFormData, DebiteurFormData } from "@/hooks/useDebiteurFormData";
import { Spinner, Center, Alert, AlertIcon, AlertTitle, AlertDescription, VStack } from "@chakra-ui/react";

type DebiteurFormContextType = {
  formData: DebiteurFormData;
  isLoading: boolean;
  error: any;
};

const DebiteurFormContext = createContext<DebiteurFormContextType | null>(null);

export function DebiteurFormProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useDebiteurFormData();

  // Afficher un loader pendant le chargement initial
  if (isLoading) {
    return (
      <Center minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="orange.500" thickness="4px" />
          <p style={{ color: '#666' }}>Chargement des données du formulaire...</p>
        </VStack>
      </Center>
    );
  }

  // Afficher une erreur si le chargement échoue
  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription>
          Impossible de charger les données du formulaire. Veuillez rafraîchir la page.
        </AlertDescription>
      </Alert>
    );
  }

  // Les données sont prêtes, on peut rendre les enfants
  return (
    <DebiteurFormContext.Provider value={{ formData: data!, isLoading, error }}>
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
