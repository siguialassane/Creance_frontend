"use client";

import { Suspense } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useApiClient } from "@/hooks/useApiClient";
import { DebiteurService } from "@/services/debiteur.service";
import { MultiStepForm, StepConfig } from "@/components/multi-step/MultiStepForm";
import { DebiteurFormProvider } from "@/components/debiteur-form-optimized/DebiteurFormContext";
import { useDebiteurMultiStepForm } from "@/hooks/useDebiteurMultiStepForm";
import { DebiteurFormStep1 } from "@/components/debiteur-form-optimized/DebiteurFormStep1";
import { DebiteurFormStep2Physical } from "@/components/debiteur-form-optimized/DebiteurFormStep2Physical";
import { DebiteurFormStep2Moral } from "@/components/debiteur-form-optimized/DebiteurFormStep2Moral";
import { DebiteurFormStep3 } from "@/components/debiteur-form-optimized/DebiteurFormStep3";
import { ArrowLeft } from "lucide-react";

const EditerDebiteurPageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debiteurId = searchParams.get('id');
  const apiClient = useApiClient();
  const [loading, setLoading] = React.useState(true);
  const [initialFormData, setInitialFormData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Transformer les données de l'API vers le format du formulaire
  const transformApiDataToFormData = (apiData: any): any => {
    // Helper pour formater les dates
    const formatDate = (dateValue: any): string => {
      if (!dateValue) return '';
      if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
      }
      try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch {
        return '';
      }
    };
    
    // Helper pour formater les téléphones
    const formatPhone = (phoneValue: any): string => {
      if (!phoneValue) return '';
      if (typeof phoneValue === 'string' && phoneValue.startsWith('+')) {
        return phoneValue;
      }
      const cleanPhone = phoneValue.toString().replace(/\s/g, '').replace(/^0+/, '');
      if (cleanPhone) {
        return `+225${cleanPhone}`;
      }
      return phoneValue;
    };
    
    return {
      // Étape 1: Informations générales
      codeDebiteur: apiData.DEB_CODE?.toString() || '',
      categorieDebiteur: apiData.CATEG_DEB_CODE || '',
      adressePostale: apiData.DEB_ADRPOST || '',
      email: apiData.DEB_EMAIL || '',
      telephone: formatPhone(apiData.DEB_TELBUR),
      numeroCell: formatPhone(apiData.DEB_CEL),
      typeDebiteur: apiData.TYPDEB_CODE || '',

      // Étape 2: Personne physique
      civilite: apiData.CIV_CODE || '',
      nom: apiData.DEB_NOM || '',
      prenom: apiData.DEB_PREN || '',
      dateNaissance: formatDate(apiData.DEB_DATNAISS),
      lieuNaissance: apiData.DEB_LIEUNAISS || '',
      quartier: apiData.QUART_CODE || '',
      nationalite: apiData.NAT_CODE || '',
      fonction: apiData.FONCT_CODE || '',
      profession: apiData.PROFES_CODE || '',
      employeur: apiData.EMP_CODE || '',
      statutSalarie: apiData.STATSAL_CODE || '',
      matricule: apiData.DEB_MATRIC || '',
      sexe: apiData.DEB_SEXE || '',
      dateDeces: formatDate(apiData.DEB_DATDEC),
      naturePieceIdentite: apiData.DEB_NATPIDENT || '',
      numeroPieceIdentite: apiData.DEB_NUMPIDENT || '',
      dateEtablie: formatDate(apiData.DEB_DATETPIDENT),
      lieuEtablie: apiData.DEB_LIEUETPIDENT || '',
      statutMatrimonial: apiData.DEB_SITMATRI || '',
      regimeMariage: apiData.REGMAT_CODE || '',
      nombreEnfant: apiData.DEB_NBR_ENF?.toString() || '',
      nomConjoint: apiData.DEB_CJ_NOM || '',
      prenomsConjoint: apiData.DEB_CJ_PREN || '',
      dateNaissanceConjoint: formatDate(apiData.DEB_CJ_DATNAISS),
      telConjoint: formatPhone(apiData.DEB_CJ_TEL),
      numeroPieceConjoint: apiData.DEB_CJ_NUMPIDENT || '',
      adresseConjoint: apiData.DEB_CJ_ADR || '',
      nomPere: apiData.DEB_NPERE || '',
      prenomsPere: apiData.DEB_PRPERE || '',
      nomMere: apiData.DEB_NMERE || '',
      prenomsMere: apiData.DEB_PRMERE || '',
      rue: apiData.DEB_RUE || '',

      // Étape 2: Personne morale
      registreCommerce: apiData.DEB_REGISTCOM || '',
      raisonSociale: apiData.DEB_RAIS_SOCIALE || '',
      capitalSocial: apiData.DEB_CAPITSOCIAL?.toString() || '',
      formeJuridique: apiData.DEB_FORM_JURID || '',
      domaineActivite: apiData.DEB_DOM_ACTIV || '',
      siegeSocial: apiData.DEB_SIEG_SOCIAL || '',
      nomGerant: apiData.DEB_NOM_GERANT || '',

      // Étape 3: Domiciliations (tableau)
      domiciliations: apiData.domiciliations && Array.isArray(apiData.domiciliations) && apiData.domiciliations.length > 0
        ? apiData.domiciliations.map((dom: any) => {
            // Extraire tous les champs possibles selon la structure API
            return {
              type: dom.TYPDOM_CODE || '',
              numeroCompte: dom.DOM_NUM_COMPTE || dom.DOM_NUMERO_COMPTE || dom.DOM_NUM || '',
              libelle: dom.DOM_LIB || dom.DOM_LIBELLE || '',
              banque: dom.BQ_CODE || dom.BANQUE_CODE || dom.BQAG_BQ_CODE || '',
              banqueAgence: dom.BQAG_NUM || dom.BQAG_CODE || dom.AGENCE_CODE || '',
            };
          })
        : [],
    };
  };

  React.useEffect(() => {
    const loadDebiteur = async () => {
      if (!debiteurId) {
        toast.error("Aucun code débiteur fourni");
        router.push('/etude_creance/debiteur/views');
        return;
      }

      setLoading(true);

      try {
        console.log('Chargement du débiteur pour modification avec le code:', debiteurId);
        const response = await DebiteurService.getByCode(apiClient, debiteurId);
        console.log('Données du débiteur reçues:', response);
        console.log('Domiciliations dans la réponse:', {
          hasDomiciliations: !!response.domiciliations,
          isArray: Array.isArray(response.domiciliations),
          count: response.domiciliations?.length || 0,
          firstDomiciliation: response.domiciliations?.[0],
        });

        // Transformer les données API vers le format du formulaire
        const transformedData = transformApiDataToFormData(response);
        console.log('Données transformées pour le formulaire:', transformedData);
        console.log('Données de domiciliations:', {
          count: transformedData.domiciliations?.length || 0,
          domiciliations: transformedData.domiciliations,
        });
        console.log('Données brutes de domiciliations depuis API:', {
          hasDomiciliations: !!response.domiciliations,
          count: response.domiciliations?.length || 0,
          domiciliations: response.domiciliations,
        });

        setInitialFormData(transformedData);
      } catch (error: any) {
        console.error('Erreur lors du chargement du débiteur:', error);
        toast.error(error.message || "Impossible de charger les données du débiteur");
        router.push('/etude_creance/debiteur/views');
      } finally {
        setLoading(false);
      }
    };

    loadDebiteur();
  }, [debiteurId, apiClient, router]);

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
    initialData: initialFormData,
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

    // Obtenir les valeurs actuelles du formulaire (pour inclure les domiciliations à jour)
    const currentFormValues = form.getValues() as Record<string, any>;
    console.log("Données actuelles du formulaire:", currentFormValues);
    console.log("Données du débiteur à modifier (formData):", formData);

    if (!debiteurId) {
      toast.error("Aucun code débiteur fourni");
      return;
    }

    setIsSubmitting(true);

    try {
      // Utiliser les valeurs actuelles du formulaire plutôt que formData pour garantir la synchronisation
      const dataToUse = currentFormValues;
      
      // Normaliser le typeDebiteur (P ou M)
      const normalizedTypeDebiteur = 
        dataToUse.typeDebiteur === "physique" ? "P" :
        dataToUse.typeDebiteur === "moral" ? "M" :
        dataToUse.typeDebiteur;

      // Préparer le payload selon la documentation backend
      const payload: any = {
        typeDebiteur: normalizedTypeDebiteur,
        categorieDebiteur: dataToUse.categorieDebiteur,
        email: dataToUse.email,
        adressePostale: dataToUse.adressePostale,
        telephone: dataToUse.telephone,
        numeroCell: dataToUse.numeroCell,
      };

      // Ajouter les champs spécifiques selon le type
      if (normalizedTypeDebiteur === "M") {
        // Personne morale
        payload.registreCommerce = dataToUse.registreCommerce;
        payload.raisonSociale = dataToUse.raisonSociale;
        payload.capitalSocial = typeof dataToUse.capitalSocial === 'string' 
          ? (dataToUse.capitalSocial ? parseFloat(dataToUse.capitalSocial) : undefined)
          : dataToUse.capitalSocial;
        payload.formeJuridique = dataToUse.formeJuridique;
        payload.domaineActivite = dataToUse.domaineActivite;
        payload.siegeSocial = dataToUse.siegeSocial;
        payload.nomGerant = dataToUse.nomGerant;
      } else if (normalizedTypeDebiteur === "P") {
        // Personne physique
        payload.civilite = dataToUse.civilite;
        payload.nom = dataToUse.nom;
        payload.prenom = dataToUse.prenom;
        payload.dateNaissance = dataToUse.dateNaissance;
        payload.lieuNaissance = dataToUse.lieuNaissance;
        payload.quartier = dataToUse.quartier;
        payload.nationalite = dataToUse.nationalite;
        payload.fonction = dataToUse.fonction;
        payload.profession = dataToUse.profession;
        payload.employeur = dataToUse.employeur;
        payload.statutSalarie = dataToUse.statutSalarie;
        payload.sexe = dataToUse.sexe;
        
        // Champs optionnels personne physique
        if (dataToUse.matricule) payload.matricule = dataToUse.matricule;
        if (dataToUse.dateDeces) payload.dateDeces = dataToUse.dateDeces;
        if (dataToUse.naturePieceIdentite) payload.naturePieceIdentite = dataToUse.naturePieceIdentite;
        if (dataToUse.numeroPieceIdentite) payload.numeroPieceIdentite = dataToUse.numeroPieceIdentite;
        if (dataToUse.dateEtablie) payload.dateEtablie = dataToUse.dateEtablie;
        if (dataToUse.lieuEtablie) payload.lieuEtablie = dataToUse.lieuEtablie;
        if (dataToUse.statutMatrimonial) payload.statutMatrimonial = dataToUse.statutMatrimonial;
        if (dataToUse.regimeMariage) payload.regimeMariage = dataToUse.regimeMariage;
        if (dataToUse.nombreEnfant !== undefined && dataToUse.nombreEnfant !== null && dataToUse.nombreEnfant !== '') {
          payload.nombreEnfant = typeof dataToUse.nombreEnfant === 'number' 
            ? dataToUse.nombreEnfant 
            : parseInt(dataToUse.nombreEnfant.toString());
        }
        if (dataToUse.rue) payload.rue = dataToUse.rue;
        if (dataToUse.nomConjoint) payload.nomConjoint = dataToUse.nomConjoint;
        if (dataToUse.prenomsConjoint) payload.prenomsConjoint = dataToUse.prenomsConjoint;
        if (dataToUse.dateNaissanceConjoint) payload.dateNaissanceConjoint = dataToUse.dateNaissanceConjoint;
        if (dataToUse.telConjoint) payload.telConjoint = dataToUse.telConjoint;
        if (dataToUse.numeroPieceConjoint) payload.numeroPieceConjoint = dataToUse.numeroPieceConjoint;
        if (dataToUse.adresseConjoint) payload.adresseConjoint = dataToUse.adresseConjoint;
        if (dataToUse.nomPere) payload.nomPere = dataToUse.nomPere;
        if (dataToUse.prenomsPere) payload.prenomsPere = dataToUse.prenomsPere;
        if (dataToUse.nomMere) payload.nomMere = dataToUse.nomMere;
        if (dataToUse.prenomsMere) payload.prenomsMere = dataToUse.prenomsMere;
      }

      // Domiciliations bancaires (tableau) - utiliser les valeurs actuelles du formulaire
      const currentDomiciliations = dataToUse.domiciliations;
      if (currentDomiciliations && Array.isArray(currentDomiciliations)) {
        console.log("Domiciliations actuelles du formulaire:", currentDomiciliations);
        // Filtrer les domiciliations valides (avec type et banqueAgence au minimum)
        const validDomiciliations = currentDomiciliations
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

      console.log('Envoi de la mise à jour vers l\'API...');
      const response = await DebiteurService.update(apiClient, debiteurId, payload);
      console.log('Réponse de l\'API:', response);

      if (response.status === "SUCCESS") {
        toast.success(`Le débiteur ${dataToUse.codeDebiteur || debiteurId} a été mis à jour.`);

        // Rediriger vers la liste après un court délai
        setTimeout(() => {
          router.push("/etude_creance/debiteur/views");
        }, 1500);
      } else {
        throw new Error(response.message || "Erreur lors de la modification");
      }
    } catch (error: any) {
      console.error('Erreur lors de la modification:', error);
      
      // Si c'est une erreur 401, l'intercepteur a déjà géré la déconnexion
      // Ne pas afficher d'erreur supplémentaire pour éviter les confusions
      if (error.response?.status === 401) {
        // L'intercepteur gère déjà la déconnexion et la redirection
        return;
      }
      
      toast.error(error.message || "Une erreur s'est produite lors de la modification");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, form, apiClient, debiteurId, router, validateCurrentStep]);

  // Gestion des erreurs de validation
  const handleValidationError = React.useCallback((message: string) => {
    toast.error(message);
  }, []);

  // Rendre le contenu de l'étape actuelle
  const renderStepContent = () => {
    const { control, formState } = form;
    const { errors } = formState;

    switch (currentStep) {
      case 1:
        return (
          <DebiteurFormStep1
            control={control}
            errors={errors}
            isEditMode={true}
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
            watch={form.watch}
            setValue={(name: string, value: any) => form.setValue(name as any, value)}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement du débiteur...</div>
      </div>
    );
  }

  return (
    <DebiteurFormProvider currentStep={currentStep}>
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
                onClick={() => router.push("/etude_creance/debiteur/views")}
                className="hover:bg-white/10 text-white border-white/20 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mt-0.5" />
                RETOUR
              </Button>
              <h1 className="text-xl font-semibold text-white">
                MODIFIER UN DEBITEUR
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
};

export default function EditerDebiteurPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EditerDebiteurPageInner />
    </Suspense>
  );
}