"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useApiClient } from "@/hooks/useApiClient";
import { useSession } from "next-auth/react";
import { DebiteurService } from "@/services/debiteur.service";
import { DebiteurCreateRequest } from "@/types/debiteur";
import { MultiStepForm, StepConfig } from "@/components/multi-step/MultiStepForm";
import { DebiteurFormProvider } from "@/components/debiteur-form-optimized/DebiteurFormContext";
import { useDebiteurMultiStepForm } from "@/hooks/useDebiteurMultiStepForm";
import { DebiteurFormStep1 } from "@/components/debiteur-form-optimized/DebiteurFormStep1";
import { DebiteurFormStep2Physical } from "@/components/debiteur-form-optimized/DebiteurFormStep2Physical";
import { DebiteurFormStep2Moral } from "@/components/debiteur-form-optimized/DebiteurFormStep2Moral";
import { DebiteurFormStep3 } from "@/components/debiteur-form-optimized/DebiteurFormStep3";
import { ArrowLeft } from "lucide-react";
import { useFormState } from "react-hook-form";

/**
 * Page de création d'un nouveau débiteur
 * Utilise un formulaire multi-step professionnel et modulaire
 */
export default function NouveauDebiteurPage() {
  const router = useRouter();
  const apiClient = useApiClient();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Hook personnalisé pour gérer le formulaire multi-step
  const {
    currentStep,
    formData,
    typeDebiteur,
    form,
    goToNextStep,
    goToPreviousStep,
    validateCurrentStep,
    goToStep,
  } = useDebiteurMultiStepForm({
    onDataChange: (data) => {
      // Les données sont automatiquement synchronisées par le hook
    },
  });

  // Configuration des étapes
  const steps: StepConfig[] = React.useMemo(
    () => [
      {
        id: 1,
        title: "Informations générales",
        description: "Les champs marqués d'un astérisque sont obligatoires",
        validate: async () => {
          return await validateCurrentStep();
        },
      },
      {
        id: 2,
        title:
          typeDebiteur === "P" || typeDebiteur === "physique"
            ? "Personne physique"
            : "Personne morale",
        description:
          typeDebiteur === "P" || typeDebiteur === "physique"
            ? "Informations de la personne physique"
            : "Informations de la personne morale",
        validate: async () => {
          return await validateCurrentStep();
        },
      },
      {
        id: 3,
        title: "Domiciliation",
        description: "Les champs marqués d'un astérisque sont obligatoires",
        validate: async () => {
          return await validateCurrentStep();
        },
      },
    ],
    [typeDebiteur, validateCurrentStep]
  );

  // Gestion de la soumission finale
  const handleSubmit = React.useCallback(async () => {
    // Valider la dernière étape
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }

    console.log("Données du débiteur à envoyer:", formData);

    setIsSubmitting(true);

    try {
      // Normaliser le typeDebiteur (P ou M)
      const normalizedTypeDebiteur = 
        formData.typeDebiteur === "physique" ? "P" :
        formData.typeDebiteur === "moral" ? "M" :
        formData.typeDebiteur;

      // Préparer le payload selon la documentation backend
      const payload: any = {
        typeDebiteur: normalizedTypeDebiteur,
        categorieDebiteur: formData.categorieDebiteur,
        email: formData.email,
        adressePostale: formData.adressePostale,
        telephone: formData.telephone,
        numeroCell: formData.numeroCell,
        localisation: formData.localisation,
      };

      // Ajouter les champs spécifiques selon le type
      if (normalizedTypeDebiteur === "M") {
        // Personne morale
        payload.registreCommerce = formData.registreCommerce;
        payload.raisonSociale = formData.raisonSociale;
        payload.capitalSocial = typeof formData.capitalSocial === 'string' 
          ? (formData.capitalSocial ? parseFloat(formData.capitalSocial) : undefined)
          : formData.capitalSocial;
        payload.formeJuridique = formData.formeJuridique;
        payload.domaineActivite = formData.domaineActivite;
        payload.siegeSocial = formData.siegeSocial;
        payload.nomGerant = formData.nomGerant;
      } else if (normalizedTypeDebiteur === "P") {
        // Personne physique
        payload.civilite = formData.civilite;
        payload.nom = formData.nom;
        payload.prenom = formData.prenom;
        payload.dateNaissance = formData.dateNaissance;
        payload.lieuNaissance = formData.lieuNaissance;
        payload.quartier = formData.quartier;
        payload.nationalite = formData.nationalite;
        payload.fonction = formData.fonction;
        payload.profession = formData.profession;
        payload.employeur = formData.employeur;
        payload.statutSalarie = formData.statutSalarie;
        payload.sexe = formData.sexe;
        
        // Champs optionnels personne physique
        if (formData.matricule) payload.matricule = formData.matricule;
        if (formData.dateDeces) payload.dateDeces = formData.dateDeces;
        if (formData.naturePieceIdentite) payload.naturePieceIdentite = formData.naturePieceIdentite;
        if (formData.numeroPieceIdentite) payload.numeroPieceIdentite = formData.numeroPieceIdentite;
        if (formData.dateEtablie) payload.dateEtablie = formData.dateEtablie;
        if (formData.lieuEtablie) payload.lieuEtablie = formData.lieuEtablie;
        if (formData.statutMatrimonial) payload.statutMatrimonial = formData.statutMatrimonial;
        if (formData.regimeMariage) payload.regimeMariage = formData.regimeMariage;
        if (formData.nombreEnfant !== undefined && formData.nombreEnfant !== null && formData.nombreEnfant !== '') {
          payload.nombreEnfant = typeof formData.nombreEnfant === 'number' 
            ? formData.nombreEnfant 
            : parseInt(formData.nombreEnfant.toString());
        }
        if (formData.rue) payload.rue = formData.rue;
        if (formData.nomConjoint) payload.nomConjoint = formData.nomConjoint;
        if (formData.prenomsConjoint) payload.prenomsConjoint = formData.prenomsConjoint;
        if (formData.dateNaissanceConjoint) payload.dateNaissanceConjoint = formData.dateNaissanceConjoint;
        if (formData.telConjoint) payload.telConjoint = formData.telConjoint;
        if (formData.numeroPieceConjoint) payload.numeroPieceConjoint = formData.numeroPieceConjoint;
        if (formData.adresseConjoint) payload.adresseConjoint = formData.adresseConjoint;
        if (formData.nomPere) payload.nomPere = formData.nomPere;
        if (formData.prenomsPere) payload.prenomsPere = formData.prenomsPere;
        if (formData.nomMere) payload.nomMere = formData.nomMere;
        if (formData.prenomsMere) payload.prenomsMere = formData.prenomsMere;
      }

      // Domiciliations bancaires (tableau)
      if (formData.domiciliations && Array.isArray(formData.domiciliations)) {
        // Filtrer les domiciliations valides (avec type et banqueAgence au minimum)
        const validDomiciliations = formData.domiciliations
          .filter((dom: any) => {
            // Une domiciliation est valide si elle a au moins type et banqueAgence
            return dom.type && dom.type.trim() !== "" && dom.banqueAgence && dom.banqueAgence.trim() !== "";
          })
          .map((dom: any) => {
            const domiciliation: any = {
              type: dom.type,
              banqueAgence: dom.banqueAgence,
            };
            
            // Ajouter libelle seulement s'il est renseigné
            if (dom.libelle && dom.libelle.trim() !== "") {
              domiciliation.libelle = dom.libelle;
            }
            
            // Ajouter numeroCompte seulement s'il est renseigné
            if (dom.numeroCompte && dom.numeroCompte.trim() !== "") {
              domiciliation.numeroCompte = dom.numeroCompte;
            }
            
            return domiciliation;
          });
        
        if (validDomiciliations.length > 0) {
          payload.domiciliations = validDomiciliations;
        }
      }

      console.log("Payload avec normalisation:", payload);

      // Appeler l'API pour créer le débiteur
      const response = await DebiteurService.create(
        apiClient,
        payload as unknown as DebiteurCreateRequest
      );

      console.log("Réponse de l'API:", response);

      // Afficher l'alerte de succès
      toast.success(
        `Le débiteur ${response.data?.DEB_CODE || ""} a été créé avec succès.`
      );

      // Rediriger vers la liste après un court délai
      setTimeout(() => {
        router.push("/etude_creance/debiteur/views");
      }, 1500);
    } catch (error: any) {
      console.error("Erreur lors de la création du débiteur:", error);

      // Si c'est une erreur 401, l'intercepteur a déjà géré la déconnexion
      // Ne pas afficher d'erreur supplémentaire pour éviter les confusions
      if (error.response?.status === 401) {
        // L'intercepteur gère déjà la déconnexion et la redirection
        return;
      }

      // Afficher l'erreur pour les autres types d'erreurs
      toast.error(
        error.response?.data?.error?.message ||
          error.message ||
          "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, apiClient, session, router, validateCurrentStep]);

  // Gestion des erreurs de validation
  const handleValidationError = React.useCallback((message: string) => {
    toast.error(message);
  }, []);

  // Récupérer les erreurs du formulaire de manière réactive avec useFormState
  // Cela force un re-render quand les erreurs changent
  const formState = useFormState({ 
    control: form.control,
  });
  const errors = formState.errors;

  // Rendre le contenu de l'étape actuelle
  const renderStepContent = () => {
    const { control, watch } = form;

    switch (currentStep) {
      case 1:
        return (
          <DebiteurFormStep1
            control={control}
            errors={errors}
            isEditMode={false}
            readOnly={false}
          />
        );
      case 2:
        return typeDebiteur === "P" || typeDebiteur === "physique" ? (
          <DebiteurFormStep2Physical
            control={control}
            errors={errors}
            readOnly={false}
          />
        ) : (
          <DebiteurFormStep2Moral
            control={control}
            errors={errors}
            readOnly={false}
          />
        );
      case 3:
        return (
          <DebiteurFormStep3
            control={control}
            errors={errors}
            readOnly={false}
            watch={watch}
            setValue={(name: string, value: any) => form.setValue(name as any, value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DebiteurFormProvider currentStep={currentStep}>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto ">
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
                onClick={() => router.push("/etude_creance/debiteur/views")}
                className="hover:bg-white/10 text-white border-white/20 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mt-0.5" />
                RETOUR
              </Button>
              <h1 className="text-xl font-semibold text-white">
                AJOUTER UN DEBITEUR
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
              {renderStepContent()}
            </MultiStepForm>
          </div>
        </div>
      </div>
    </DebiteurFormProvider>
  );
}
