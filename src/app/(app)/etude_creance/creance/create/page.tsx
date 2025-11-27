"use client";

import { Suspense } from "react";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useApiClient } from "@/hooks/useApiClient";
import { CreanceService } from "@/services/creance.service";
import { MultiStepForm, StepConfig } from "@/components/multi-step/MultiStepForm";
import { useCreanceMultiStepForm } from "@/hooks/useCreanceMultiStepForm";
import CreanceForm from "@/components/creance-form/creance-form";
import { ArrowLeft } from "lucide-react";

/**
 * Page de création d'une nouvelle créance
 * Utilise un formulaire multi-step professionnel et modulaire
 */
const NouvelleCreancePageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiClient = useApiClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const creanceFormRef = React.useRef<any>(null);

  // Récupérer les paramètres du débiteur depuis l'URL
  const debiteurId = searchParams.get("debiteurId");
  const debiteurCode = searchParams.get("debiteurCode");
  const debiteurNom = searchParams.get("debiteurNom");
  const debiteurPrenom = searchParams.get("debiteurPrenom");

  // État local pour stocker toutes les données du formulaire en temps réel
  const [allFormData, setAllFormData] = React.useState<Record<string, any>>({});

  // Hook personnalisé pour gérer le formulaire multi-step
  const {
    currentStep,
    formData,
    form,
    validateCurrentStep,
    goToStep,
  } = useCreanceMultiStepForm({
    initialData: React.useMemo(() => {
      const initial: Record<string, any> = {};
      // Pré-remplir les données du débiteur si elles sont fournies
      if (debiteurId && debiteurCode && debiteurNom && debiteurPrenom) {
        initial.debiteurCode = debiteurCode;
        initial.debiteurNom = debiteurNom;
        initial.debiteurPrenom = debiteurPrenom;
      }
      return initial;
    }, [debiteurId, debiteurCode, debiteurNom, debiteurPrenom]),
    onDataChange: (data) => {
      // Synchroniser toutes les données dans l'état local
      setAllFormData(data);
      console.log("🔄 Données mises à jour via onDataChange:", data);
    },
  });

  // Configuration des étapes
  const steps: StepConfig[] = React.useMemo(
    () => [
      {
        id: 1,
        title: "Informations générales",
        description: "Les champs marqués d'un astérisque orange sont obligatoires",
        validate: async () => {
          // Utiliser la validation depuis le composant CreanceForm qui a accès au vrai formulaire
          if (creanceFormRef.current?.validateStep) {
            return await creanceFormRef.current.validateStep();
          }
          // Fallback sur la validation du hook si le ref n'est pas disponible
          return await validateCurrentStep();
        },
      },
      {
        id: 2,
        title: "Détails financiers",
        description: "Montants, intérêts, commissions et totaux (calculés automatiquement)",
        validate: async () => {
          // Utiliser la validation depuis le composant CreanceForm qui a accès au vrai formulaire
          if (creanceFormRef.current?.validateStep) {
            return await creanceFormRef.current.validateStep();
          }
          // Fallback sur la validation du hook si le ref n'est pas disponible
          return await validateCurrentStep();
        },
      },
      {
        id: 3,
        title: "Pièces jointes",
        description: "Ajouter les pièces jointes nécessaires",
        validate: async () => {
          // Validation optionnelle pour les pièces
          return true;
        },
      },
      {
        id: 4,
        title: "Garanties",
        description: "Garanties personnelles ou réelles (optionnel)",
        validate: async () => {
          // Utiliser la validation depuis le composant CreanceForm qui a accès au vrai formulaire
          if (creanceFormRef.current?.validateStep) {
            return await creanceFormRef.current.validateStep();
          }
          // Fallback sur la validation du hook si le ref n'est pas disponible
          return await validateCurrentStep();
        },
      },
    ],
    [validateCurrentStep]
  );

  // Gestion de la soumission finale
  const handleSubmit = React.useCallback(async () => {
    // Valider la dernière étape
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }

    setIsSubmitting(true);

    try {
      // Récupérer toutes les valeurs depuis le formulaire CreanceForm (source la plus fiable car c'est le vrai formulaire)
      const formValues = creanceFormRef.current?.getFormValues ? creanceFormRef.current.getFormValues() : {};
      
      // Utiliser allFormData qui est mis à jour en temps réel via onDataChange depuis CreanceForm
      // Combiner toutes les sources pour être sûr d'avoir toutes les données (priorité: CreanceForm > allFormData > formData)
      const allFormValues = { ...formData, ...allFormData, ...formValues };
      
      console.log("📋 Valeurs depuis CreanceForm.getFormValues():", formValues);
      console.log("📋 allFormData (mis à jour via onDataChange):", allFormData);
      console.log("📋 formData du hook:", formData);
      console.log("📋 Toutes les valeurs combinées:", allFormValues);
      console.log("📋 Nombre total de champs:", Object.keys(allFormValues).length);
      console.log("📋 Exemples de champs clés:", {
        debiteur: allFormValues.debiteur,
        groupeCreance: allFormValues.groupeCreance,
        objetCreance: allFormValues.objetCreance,
        capitalInitial: allFormValues.capitalInitial,
        ordonnateur: allFormValues.ordonnateur,
        statut: allFormValues.statut,
        dateDeblocage: allFormValues.dateDeblocage,
        dateEcheance: allFormValues.dateEcheance,
      });
      
      // Construire le payload avec TOUS les champs selon la documentation API
      // INCLURE TOUS LES CHAMPS même s'ils sont vides (sauf undefined/null)
      const creanceData: any = {};
      
      // Champs requis (8 champs obligatoires selon la doc) - TOUJOURS inclure avec leurs vraies valeurs
      // Inclure même les chaînes vides car ce sont des champs obligatoires
      if (allFormValues.debiteur !== undefined) {
        creanceData.debiteur = allFormValues.debiteur || '';
      }
      if (allFormValues.groupeCreance !== undefined) {
        creanceData.groupeCreance = allFormValues.groupeCreance || '';
      }
      if (allFormValues.objetCreance !== undefined) {
        creanceData.objetCreance = allFormValues.objetCreance || '';
      }
      if (allFormValues.capitalInitial !== undefined) {
        creanceData.capitalInitial = allFormValues.capitalInitial ?? 0;
      }
      if (allFormValues.dateDeblocage) {
        creanceData.dateDeblocage = allFormValues.dateDeblocage;
      } else {
        creanceData.dateDeblocage = new Date().toISOString().split("T")[0];
      }
      if (allFormValues.dateEcheance) {
        creanceData.dateEcheance = allFormValues.dateEcheance;
      } else {
        creanceData.dateEcheance = new Date().toISOString().split("T")[0];
      }
      if (allFormValues.ordonnateur !== undefined) {
        creanceData.ordonnateur = allFormValues.ordonnateur || '';
      }
      // Le statut est déjà en initiale (A, C, S) dans le formulaire, l'envoyer tel quel
      creanceData.statut = allFormValues.statut || "A";
      
      // Champs optionnels - Step 1 (inclure seulement s'ils existent)
      if (allFormValues.objetDetail !== undefined && allFormValues.objetDetail) {
        creanceData.objetDetail = allFormValues.objetDetail;
      }
      if (allFormValues.montantDecaisse !== undefined && allFormValues.montantDecaisse !== null) {
        creanceData.montantDecaisse = allFormValues.montantDecaisse;
      }
      if (allFormValues.numeroPrecedent !== undefined && allFormValues.numeroPrecedent) {
        creanceData.numeroPrecedent = allFormValues.numeroPrecedent;
      }
      if (allFormValues.numeroAncien !== undefined && allFormValues.numeroAncien) {
        creanceData.numeroAncien = allFormValues.numeroAncien;
      }
      
      // Champs optionnels - Step 2
      if (allFormValues.periodicite !== undefined && allFormValues.periodicite) {
        creanceData.periodicite = allFormValues.periodicite;
      }
      if (allFormValues.nbEch !== undefined && allFormValues.nbEch !== null) {
        creanceData.nbEch = allFormValues.nbEch;
      }
      if (allFormValues.duree !== undefined && allFormValues.duree !== null) {
        creanceData.duree = allFormValues.duree;
      }
      if (allFormValues.statutRecouvr !== undefined && allFormValues.statutRecouvr !== null) {
        creanceData.statutRecouvr = allFormValues.statutRecouvr;
      }
      if (allFormValues.tauxInteretConventionnel !== undefined && allFormValues.tauxInteretConventionnel !== null) {
        creanceData.tauxInteretConventionnel = allFormValues.tauxInteretConventionnel;
      }
      if (allFormValues.tauxInteretRetard !== undefined && allFormValues.tauxInteretRetard !== null) {
        creanceData.tauxInteretRetard = allFormValues.tauxInteretRetard;
      }
      
      // Champs optionnels - Step 3 (montants)
      if (allFormValues.montantInteretConventionnel !== undefined && allFormValues.montantInteretConventionnel !== null) {
        creanceData.montantInteretConventionnel = allFormValues.montantInteretConventionnel;
      }
      if (allFormValues.commissionBanque !== undefined && allFormValues.commissionBanque !== null) {
        creanceData.commissionBanque = allFormValues.commissionBanque;
      }
      if (allFormValues.montantDu !== undefined && allFormValues.montantDu !== null) {
        creanceData.montantDu = allFormValues.montantDu;
      }
      if (allFormValues.montantRembourse !== undefined && allFormValues.montantRembourse !== null) {
        creanceData.montantRembourse = allFormValues.montantRembourse;
      }
      if (allFormValues.montantInteretRetard !== undefined && allFormValues.montantInteretRetard !== null) {
        creanceData.montantInteretRetard = allFormValues.montantInteretRetard;
      }
      if (allFormValues.frais !== undefined && allFormValues.frais !== null) {
        creanceData.frais = allFormValues.frais;
      }
      if (allFormValues.encours !== undefined && allFormValues.encours !== null) {
        creanceData.encours = allFormValues.encours;
      }
      
      // Champs calculés (inclure si calculés)
      if (allFormValues.montantARembourser !== undefined && allFormValues.montantARembourser !== null) {
        creanceData.montantARembourser = allFormValues.montantARembourser;
      }
      if (allFormValues.montantImpaye !== undefined && allFormValues.montantImpaye !== null) {
        creanceData.montantImpaye = allFormValues.montantImpaye;
      }
      if (allFormValues.totalDu !== undefined && allFormValues.totalDu !== null) {
        creanceData.totalDu = allFormValues.totalDu;
      }
      if (allFormValues.penalite !== undefined && allFormValues.penalite !== null) {
        creanceData.penalite = allFormValues.penalite;
      }
      if (allFormValues.totalSolde !== undefined && allFormValues.totalSolde !== null) {
        creanceData.totalSolde = allFormValues.totalSolde;
      }
      
      // Champs optionnels - Step 4
      if (allFormValues.observations !== undefined && allFormValues.observations) {
        creanceData.observations = allFormValues.observations;
      }
      
      // Récupérer les garanties et pièces depuis CreanceForm
      const garanties = creanceFormRef.current?.getGaranties ? creanceFormRef.current.getGaranties() : [];
      const pieces = creanceFormRef.current?.getPieces ? creanceFormRef.current.getPieces() : [];
      const watchedTypeGarantie = allFormValues.typeGarantie || '';
      
      // Séparer les garanties personnelles et réelles selon le type
      const garantiesPersonnelles: any[] = [];
      const garantiesReelles: any[] = [];
      
      garanties.forEach((garantie: any) => {
        if (watchedTypeGarantie === 'personnelles' || garantie.type === 'personnelles') {
          // Mapper vers le format API pour garanties personnelles
          garantiesPersonnelles.push({
            TYPGAR_PHYS_CODE: garantie.type || '',
            GARPHYS_CODE: garantie.numeroGarantie || garantie.code || '',
            GARPHYS_NOM: garantie.nom || '',
            GARPHYS_PREN: garantie.prenoms || '',
            GARPHYS_TEL: garantie.tel || '',
            GARPHYS_ADR: garantie.adressePostale || garantie.adresse || '',
            GARPHYS_PROFESSION: garantie.profession || '',
            GARPHYS_EMPLOYEUR: garantie.employeur || '',
            GARPHYS_REVENU: garantie.revenu || undefined,
            CIV_CODE: garantie.civCode || '',
            QUART_CODE: garantie.quartier || '',
            VILLE_CODE: garantie.ville || '',
            DEB_CODE: garantie.debCode || null,
          });
        } else if (watchedTypeGarantie === 'reelles' || garantie.type === 'reelles') {
          // Mapper vers le format API pour garanties réelles
          garantiesReelles.push({
            TYPGAR_REEL_CODE: garantie.type || '',
            GAR_REEL_DESCRIPTION: garantie.description || garantie.objetMontant || '',
            GAR_REEL_VALEUR: garantie.valeur || garantie.objetMontant ? parseFloat(String(garantie.objetMontant)) : undefined,
            GAR_REEL_ADRESSE: garantie.adresse || garantie.adressePostale || '',
            GAR_REEL_SURFACE: garantie.surface ? parseFloat(String(garantie.surface)) : undefined,
            CIRCONSCRIPTION_CODE: garantie.circonscription || '',
            TITRE_FONCIER_NUM: garantie.titreFoncier || '',
            TERRAIN_CODE: garantie.terrain || null,
            LOGEMENT_CODE: garantie.logement || null,
          });
        }
      });
      
      // Ajouter les garanties seulement si elles existent
      if (garantiesPersonnelles.length > 0) {
        creanceData.garantiesPersonnelles = garantiesPersonnelles;
      }
      if (garantiesReelles.length > 0) {
        creanceData.garantiesReelles = garantiesReelles;
      }
      
      // Mapper les pièces jointes vers le format API
      const piecesMapped = pieces
        .filter((p: any) => p.typePieceCode || p.numero || p.fichier) // Ne garder que les pièces avec au moins un champ rempli
        .map((piece: any) => ({
          TYPE_PIECE_CODE: piece.typePieceCode || '',
          PIECE_NUM: piece.numero || '',
          PIECE_DATE: piece.date || '',
          PIECE_DESCRIPTION: piece.description || '',
          PIECE_FICHIER: piece.fichier || (piece.file ? piece.file.name : ''),
        }));
      
      if (piecesMapped.length > 0) {
        creanceData.pieces = piecesMapped;
      }
      
      console.log("📤 Payload final envoyé au backend:", JSON.stringify(creanceData, null, 2));
      console.log("📎 Garanties personnelles:", garantiesPersonnelles);
      console.log("📎 Garanties réelles:", garantiesReelles);
      console.log("📎 Pièces jointes:", piecesMapped);

      const response = await CreanceService.create(apiClient, creanceData);

      console.log("📥 Réponse du backend:", response);

      // Le backend retourne status: "SUCCESS" ou status: "ERROR"
      const responseData = response as any;
      if (responseData.status === "SUCCESS" || response.success === true) {
        // Utiliser le message de data.message si disponible, sinon celui de response.message
        const successMessage = responseData.data?.message || responseData.message || "La créance a été créée avec succès";
        toast.success(successMessage);
        router.push("/etude_creance/creance/views");
      } else {
        // Gérer les erreurs métier retournées par le backend
        const errorMessage = responseData.data?.message || responseData.message || "Erreur lors de la création de la créance";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Erreur lors de la création:", error);
      
      // Gérer les erreurs HTTP et les erreurs métier
      let errorMessage = "Impossible de créer la créance";
      
      if (error.response?.data) {
        // Erreur avec réponse du backend
        const backendError = error.response.data;
        console.log("📥 Erreur backend:", backendError);
        
        if (backendError.status === "ERROR" || backendError.status === "FAILED") {
          errorMessage = backendError.data?.message || backendError.message || errorMessage;
        } else if (backendError.message) {
          errorMessage = backendError.message;
        } else if (backendError.error?.message) {
          errorMessage = backendError.error.message;
        }
      } else if (error.message) {
        // Erreur avec message personnalisé
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, apiClient, router, validateCurrentStep]);

  // Gestion des erreurs de validation
  const handleValidationError = React.useCallback((message: string) => {
    toast.error(message);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        {/* Barre verte avec titre (même style que les listing) */}
        <div 
          className="px-8 py-4"
          style={{
            backgroundColor: '#28A325',
            color: 'white',
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/etude_creance/creance/views")}
              className="hover:bg-white/10 text-white border-white/20 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mt-0.5" />
              RETOUR
            </Button>
            <h1 className="text-xl font-semibold text-white">
              AJOUTER UNE CRÉANCE
            </h1>
          </div>
        </div>

        {/* Formulaire multi-step avec mêmes marges que le tableau */}
        <div className="bg-white px-8 py-6 mt-9">
          <MultiStepForm
            steps={steps}
            currentStep={currentStep}
            onStepChange={goToStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onValidationError={handleValidationError}
          >
                  <CreanceForm
                    ref={creanceFormRef}
                    currentStep={currentStep}
                    formData={allFormData || formData}
                    onDataChange={(data) => {
                      // Synchroniser les données en temps réel
                      setAllFormData(data);
                      console.log("🔄 CreanceForm onDataChange appelé avec:", Object.keys(data).length, "champs");
                    }}
                    onSubmit={handleSubmit}
                  />
          </MultiStepForm>
        </div>
      </div>
    </div>
  );
};

export default function NouvelleCreancePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <NouvelleCreancePageInner />
    </Suspense>
  )
}
