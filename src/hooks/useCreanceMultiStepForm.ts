"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { getSchemaForStep } from "@/lib/validations/creance-schemas";
import { z } from "zod";

/**
 * Hook personnalisé pour gérer le formulaire multi-step créance
 * Centralise la logique de validation, navigation et gestion d'état
 * Inclut la logique de calcul automatique des montants
 */

interface UseCreanceMultiStepFormOptions {
  initialData?: Record<string, any>;
  onDataChange?: (data: Record<string, any>) => void;
}

export function useCreanceMultiStepForm({
  initialData = {},
  onDataChange,
}: UseCreanceMultiStepFormOptions = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  // Initialiser react-hook-form sans resolver strict
  // La validation se fera manuellement pour chaque étape avec les schémas Zod
  const form = useForm({
    defaultValues: formData,
    mode: "onChange",
  });

  const { watch, trigger, reset, setValue } = form;

  // Surveiller les changements du formulaire et effectuer les calculs automatiques
  useEffect(() => {
    const subscription = watch((value) => {
      const newFormData = value as Record<string, any>;
      
      // Calculs automatiques des montants dérivés (étape 3)
      const v: any = newFormData || {};

      // Variables de base
      const capitalInitial = Number(v.capitalInitial || 0);
      const pourcentageIntConv = Number(v.intConvPourcentage || 0);
      const commissionBanque = Number(v.commission || 0);
      const montantDejaRembourse = Number(v.montantDejaRembourse || 0);
      const pourcentageIntRetard = Number(v.intRetPourcentage || 0);
      const frais = Number(v.diversFrais || 0);
      const encours = Number(v.encours || 0);

      // Conversion des pourcentages en montants
      const montantIntConv = Math.round((capitalInitial * pourcentageIntConv) / 100);
      const montantIntRetard = Math.round((capitalInitial * pourcentageIntRetard) / 100);

      // 1) MONTANT À REMBOURSER : CAPITAL INITIAL + MONTANT INTERÊT CONVENTIONNEL + MONTANT COMMISSION BANQUE
      const calcMontantARembourser = capitalInitial + montantIntConv + commissionBanque;

      // 3) MONTANT IMPAYÉ : MONTANT DU - MONTANT DÉJÀ REMBOURSÉ
      const montantDu = Number(v.montantDu || 0);
      const calcMontantImpaye = Math.max(montantDu - montantDejaRembourse, 0);

      // 5) TOTAL DÛ : MONTANT IMPAYÉ + MONTANT INTÉRÊT DE RETARD + FRAIS
      const calcTotalDu = calcMontantImpaye + montantIntRetard + frais;

      // 6) PÉNALITÉ : CREAN_PENALITE (1/100) - calculée automatiquement
      const calcPenalite = Math.round(calcTotalDu * 0.01); // 1% du total dû

      // 7) TOTAL SOLDE (À RECOUVRER) : TOTAL DÛ + ENCOURS + PÉNALITÉ
      const calcTotalSolde = calcTotalDu + encours + calcPenalite;

      // Appliquer les valeurs calculées si différentes pour éviter les boucles
      const updates: Record<string, any> = {};
      
      if (typeof v.montantIntConvPaye !== 'number' || v.montantIntConvPaye !== montantIntConv) {
        updates.montantIntConvPaye = montantIntConv;
      }
      if (typeof v.montantRembourse !== 'number' || v.montantRembourse !== calcMontantARembourser) {
        updates.montantRembourse = calcMontantARembourser;
      }
      if (typeof v.montantImpaye !== 'number' || v.montantImpaye !== calcMontantImpaye) {
        updates.montantImpaye = calcMontantImpaye;
      }
      if (typeof v.totalDu !== 'number' || v.totalDu !== calcTotalDu) {
        updates.totalDu = calcTotalDu;
      }
      if (typeof v.penalite1Pourcent !== 'number' || v.penalite1Pourcent !== calcPenalite) {
        updates.penalite1Pourcent = calcPenalite;
      }
      if (typeof v.totalARecouvrer !== 'number' || v.totalARecouvrer !== calcTotalSolde) {
        updates.totalARecouvrer = calcTotalSolde;
      }

      // Appliquer les mises à jour en une seule fois
      Object.keys(updates).forEach((key) => {
        setValue(key as any, updates[key], { 
          shouldValidate: false, 
          shouldDirty: false, 
          shouldTouch: false 
        });
      });

      // Mettre à jour les données après calculs
      const finalData = { ...newFormData, ...updates };
      setFormData(finalData);
      onDataChange?.(finalData);
    });

    return () => subscription.unsubscribe();
  }, [watch, onDataChange, setValue]);

  // Synchroniser avec les données initiales
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset(initialData);
      setFormData(initialData);
    }
  }, []); // Seulement au montage

  // Valider l'étape actuelle
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    // Obtenir le schéma spécifique pour cette étape
    const stepSchema = getSchemaForStep(currentStep);
    
    // Récupérer les valeurs actuelles
    const values = form.getValues();
    
    // Valider avec le schéma de l'étape actuelle
    try {
      await stepSchema.parseAsync(values);
      
      // Si la validation Zod réussit, valider avec react-hook-form
      const isValid = await trigger();
      
      if (!isValid) {
        console.log("Validation react-hook-form échouée pour step", currentStep);
      }
      
      return isValid;
    } catch (error) {
      // Si la validation Zod échoue, on doit définir les erreurs manuellement
      if (error instanceof z.ZodError) {
        console.log("Validation Zod échouée pour step", currentStep, error.errors);
        // Transformer les erreurs Zod en erreurs react-hook-form
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          form.setError(path as any, {
            type: "validation",
            message: err.message,
          });
        });
      }
      
      // Déclencher la validation pour afficher les erreurs
      await trigger();
      return false;
    }
  }, [trigger, currentStep, form]);

  // Aller à l'étape suivante (avec validation)
  const goToNextStep = useCallback(async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 4) {
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
      if (step >= 1 && step <= 4) {
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
  }, [form]);

  return {
    // État
    currentStep,
    formData,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 4,

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

