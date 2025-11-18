"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { getSchemaForStep } from "@/lib/validations/debiteur-schemas";
import { z } from "zod";

/**
 * Hook personnalisé pour gérer le formulaire multi-step débiteur
 * Centralise la logique de validation, navigation et gestion d'état
 */

interface UseDebiteurMultiStepFormOptions {
  initialData?: Record<string, any>;
  onDataChange?: (data: Record<string, any>) => void;
}

export function useDebiteurMultiStepForm({
  initialData = {},
  onDataChange,
}: UseDebiteurMultiStepFormOptions = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Normaliser initialData pour éviter undefined/null dans les valeurs par défaut
  const normalizedInitialData = Object.keys(initialData).length > 0 
    ? Object.keys(initialData).reduce((acc, key) => {
        const value = initialData[key];
        // Convertir undefined/null en chaîne vide pour les champs texte
        if (value === undefined || value === null) {
          acc[key] = "";
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>)
    : {}; // Si initialData est vide, on commence avec un objet vide
  
  const [formData, setFormData] = useState<Record<string, any>>(normalizedInitialData);
  const [typeDebiteur, setTypeDebiteur] = useState<string | undefined>(
    normalizedInitialData.typeDebiteur
  );
  const typeDebiteurRef = useRef<string | undefined>(normalizedInitialData.typeDebiteur);

  // Initialiser react-hook-form sans resolver strict
  // La validation se fera manuellement pour chaque étape avec les schémas Zod
  const form = useForm({
    defaultValues: {
      ...normalizedInitialData,
      domiciliations: normalizedInitialData.domiciliations || [],
    },
    mode: "onChange",
    criteriaMode: "all", // Afficher toutes les erreurs, pas seulement la première
  });

  const { watch, trigger, reset } = form;

  // Surveiller les changements du formulaire
  useEffect(() => {
    const subscription = watch((value) => {
      // Normaliser les valeurs pour éviter undefined/null
      const newFormData = Object.keys(value || {}).reduce((acc, key) => {
        const val = (value as Record<string, any>)[key];
        
        // Préserver les tableaux (comme domiciliations) sans les convertir
        if (key === "domiciliations" && Array.isArray(val)) {
          acc[key] = val;
        } else if (val === undefined || val === null) {
          // Convertir undefined/null en chaîne vide pour les champs texte uniquement
          acc[key] = "";
        } else {
          acc[key] = val;
        }
        return acc;
      }, {} as Record<string, any>);
      
      setFormData(newFormData);
      onDataChange?.(newFormData);

      // Mettre à jour le type de débiteur si nécessaire
      if (
        newFormData.typeDebiteur &&
        newFormData.typeDebiteur !== typeDebiteurRef.current
      ) {
        typeDebiteurRef.current = newFormData.typeDebiteur;
        setTypeDebiteur(newFormData.typeDebiteur);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  // Synchroniser avec les données initiales quand elles changent
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Normaliser les données initiales
      const normalizedData = Object.keys(initialData).reduce((acc, key) => {
        const value = initialData[key];
        // Convertir undefined/null en chaîne vide pour les champs texte
        if (value === undefined || value === null) {
          acc[key] = "";
        } else if (key === "domiciliations" && !Array.isArray(value)) {
          // S'assurer que domiciliations est un tableau vide si non défini
          acc[key] = [];
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      // S'assurer que domiciliations est un tableau vide par défaut si non présent
      if (!normalizedData.domiciliations || !Array.isArray(normalizedData.domiciliations)) {
        normalizedData.domiciliations = [];
      }
      
      reset(normalizedData);
      setFormData(normalizedData);
      if (normalizedData.typeDebiteur) {
        typeDebiteurRef.current = normalizedData.typeDebiteur;
        setTypeDebiteur(normalizedData.typeDebiteur);
      }
    }
  }, [initialData, reset]); // Se synchroniser quand initialData change

  // Messages personnalisés selon le champ et le type d'erreur
  const fieldLabels: Record<string, string> = {
    categorieDebiteur: "La catégorie débiteur est requise",
    typeDebiteur: "Le type débiteur est requis",
    adressePostale: "L'adresse postale est requise",
    email: "L'email est requis",
    telephone: "Le téléphone est requis",
    numeroCell: "Le numéro de cellulaire est requis",
  };

  // Fonction pour traduire les messages d'erreur Zod en français convivial
  const getFrenchErrorMessage = (error: z.ZodIssue, path: string): string => {
    
    // Détecter si c'est un champ manquant (undefined, null, ou chaîne vide)
    const isMissingField = 
      error.received === "undefined" || 
      error.received === "null" ||
      error.message?.includes("expected") && error.message?.includes("received");
    
    // Si le message contient déjà du français ou n'est pas un message par défaut de Zod, le retourner tel quel
    if (error.message && 
        !error.message.startsWith("Invalid") && 
        !error.message.includes("expected") &&
        !error.message.includes("received")) {
      return error.message;
    }
    
    // Traduire les messages d'erreur Zod par défaut en français
    const errorCode = error.code;
    
    switch (errorCode) {
      case z.ZodIssueCode.invalid_type:
        // Champ manquant (undefined ou null) - toujours retourner "requis"
        if (isMissingField) {
          return fieldLabels[path] || `Le champ ${path} est requis`;
        }
        // Type invalide (mais pas manquant) - format invalide
        return fieldLabels[path] || `Le champ ${path} est requis`;
        
      case z.ZodIssueCode.invalid_enum_value:
        // Pour les enum, si c'est vide, c'est "requis", sinon "valeur invalide"
        if (isMissingField || !error.message || error.message.includes("expected")) {
          return fieldLabels[path] || `Le champ ${path} est requis`;
        }
        if (path === "typeDebiteur") {
          return "Le type débiteur doit être 'P' (physique) ou 'M' (moral)";
        }
        return `La valeur de ${path} n'est pas valide`;
        
      case z.ZodIssueCode.too_small:
        // Champ requis (longueur minimale de 1)
        if (error.minimum === 1 && error.type === "string") {
          return fieldLabels[path] || `Le champ ${path} est requis`;
        }
        // Autre minimum
        return `La valeur de ${path} doit être au moins ${error.minimum}`;
        
      case z.ZodIssueCode.too_big:
        return `La valeur de ${path} ne peut pas dépasser ${error.maximum}`;
        
      case z.ZodIssueCode.invalid_string:
        if (error.validation === "email") {
          return "Email invalide (format attendu: exemple@domaine.com)";
        }
        return `Le format de ${path} est invalide`;
        
      case z.ZodIssueCode.custom:
        // Message personnalisé du schéma
        return error.message || `Erreur de validation pour ${path}`;
        
      default:
        // Par défaut, si le message contient "expected" ou "received", c'est un champ manquant
        if (isMissingField || 
            (error.message && (error.message.includes("expected") || error.message.includes("received")))) {
          return fieldLabels[path] || `Le champ ${path} est requis`;
        }
        // Retourner un message générique en français
        return fieldLabels[path] || `Erreur de validation pour ${path}`;
    }
  };

  // Valider l'étape actuelle
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    // Obtenir le schéma spécifique pour cette étape
    const stepSchema = getSchemaForStep(currentStep, typeDebiteurRef.current);
    
    // Récupérer les valeurs actuelles
    const values = form.getValues();
    
    // Valider avec le schéma de l'étape actuelle
    try {
      await stepSchema.parseAsync(values);
      
      // Si la validation Zod réussit, valider avec react-hook-form
      // On valide tous les champs pour s'assurer que les erreurs s'affichent
      const isValid = await trigger();
      
      return isValid;
    } catch (error) {
      // Si la validation Zod échoue, on doit définir les erreurs manuellement
      if (error instanceof z.ZodError) {
        // Transformer les erreurs Zod en erreurs react-hook-form
        // ZodError utilise 'issues' et non 'errors'
        if (error.issues && Array.isArray(error.issues)) {
          // Définir toutes les erreurs avec setError()
          error.issues.forEach((err: z.ZodIssue) => {
            const path = err.path.join(".");
            // Vérifier si la valeur est vraiment vide (undefined, null, ou chaîne vide)
            const fieldValue = values[path];
            const isEmptyValue = fieldValue === undefined || fieldValue === null || fieldValue === "" || 
                                (typeof fieldValue === "string" && fieldValue.trim() === "");
            
            // Si c'est vide, forcer le message "requis" au lieu de "format invalide"
            const frenchMessage = isEmptyValue 
              ? (fieldLabels[path] || `Le champ ${path} est requis`)
              : getFrenchErrorMessage(err, path);
              
            form.setError(path as any, {
              type: "validation",
              message: frenchMessage,
            }, { shouldFocus: false });
          });
          
          // Les erreurs sont déjà définies avec setError() et seront affichées automatiquement
          // Ne pas appeler trigger() car cela peut nettoyer les erreurs définies manuellement
          // car nous n'utilisons pas de resolver dans useForm
        }
      }
      
      return false;
    }
  }, [trigger, currentStep, form, fieldLabels, getFrenchErrorMessage]);

  // Aller à l'étape suivante (avec validation)
  const goToNextStep = useCallback(async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return true;
    }
    return false;
  }, [currentStep, validateCurrentStep]);

  // Aller à l'étape précédente
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Aller à une étape spécifique
  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= 3) {
        setCurrentStep(step);
      }
    },
    []
  );

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    form.reset();
    setFormData({});
    setCurrentStep(1);
    typeDebiteurRef.current = undefined;
    setTypeDebiteur(undefined);
  }, [form]);

  return {
    // État
    currentStep,
    formData,
    typeDebiteur,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 3,

    // Form methods
    form,

    // Navigation
    goToNextStep,
    goToPreviousStep,
    goToStep,
    setCurrentStep,

    // Validation
    validateCurrentStep,

    // Utilitaires
    resetForm,
  };
}

