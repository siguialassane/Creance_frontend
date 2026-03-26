"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useApiClient } from "@/hooks/useApiClient";
import { DebiteurService } from "@/services/debiteur.service";
import { MultiStepForm, StepConfig } from "@/components/multi-step/MultiStepForm";
import { DebiteurFormProvider } from "@/components/debiteur-form-optimized/DebiteurFormContext";
import { useDebiteurMultiStepForm } from "@/hooks/useDebiteurMultiStepForm";
import { DebiteurFormStep1 } from "@/components/debiteur-form-optimized/DebiteurFormStep1";
import { DebiteurFormStep2Physical } from "@/components/debiteur-form-optimized/DebiteurFormStep2Physical";
import { DebiteurFormStep2Moral } from "@/components/debiteur-form-optimized/DebiteurFormStep2Moral";
import { DebiteurFormStep3 } from "@/components/debiteur-form-optimized/DebiteurFormStep3";
import { ArrowLeft, Pencil } from "lucide-react";

const VoirDebiteurPageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debiteurId = searchParams.get('id');
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(true);
  const [initialFormData, setInitialFormData] = useState<Record<string, any>>({});

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

  useEffect(() => {
    const loadDebiteur = async () => {
      if (!debiteurId) {
        toast.error("Aucun code débiteur fourni");
        router.push('/etude_creance/debiteur/views');
        return;
      }

      setLoading(true);

      try {
        console.log('Chargement du débiteur avec le code:', debiteurId);
        const response = await DebiteurService.getByCode(apiClient, debiteurId);
        console.log('Données du débiteur reçues:', response);

        // Transformer les données API vers le format du formulaire
        const transformedData = transformApiDataToFormData(response);
        console.log('Données transformées pour le formulaire:', transformedData);

        setInitialFormData(transformedData);
      } catch (error: any) {
        console.error('Erreur lors du chargement du débiteur:', error);
        toast.error(error.message || "Impossible de charger les données du débiteur");
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
    goToStep,
  } = useDebiteurMultiStepForm({
    initialData: initialFormData,
    onDataChange: () => {
      // Pas de modification en mode consultation
    },
  });

  // Configuration des étapes (validation désactivée en mode lecture seule)
  const steps: StepConfig[] = [
    {
      id: 1,
      title: "Informations générales",
      description: "Les champs marqués d'un astérisque sont obligatoires",
      validate: async () => true, // Toujours valider en mode lecture seule
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
      validate: async () => true,
    },
    {
      id: 3,
      title: "Domiciliation",
      description: "Les champs marqués d'un astérisque sont obligatoires",
      validate: async () => true,
    },
  ];

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
            isEditMode={false}
            readOnly={true}
          />
        );
      case 2:
        return typeDebiteur === "P" || typeDebiteur === "physique" ? (
          <DebiteurFormStep2Physical
            control={control}
            errors={errors}
            readOnly={true}
          />
        ) : (
          <DebiteurFormStep2Moral
            control={control}
            errors={errors}
            readOnly={true}
          />
        );
      case 3:
        return (
          <DebiteurFormStep3
            control={control}
            errors={errors}
            readOnly={true}
            watch={form.watch}
            setValue={(name: string, value: any) => form.setValue(name as any, value)}
          />
        );
      default:
        return null;
    }
  };

  const handleBack = () => {
    router.push("/etude_creance/debiteur/views");
  };

  const handleEdit = () => {
    router.push(`/etude_creance/debiteur/edit?id=${debiteurId}`);
  };

  const handleValidationError = () => {
    // Pas d'erreur en mode lecture seule
  };

  const handleSubmit = () => {
    // Pas de soumission en mode consultation
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="hover:bg-white/10 text-white border-white/20 flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mt-0.5" />
                  RETOUR
                </Button>
                <h1 className="text-xl font-semibold text-white">
                  DÉTAILS DU DÉBITEUR
                </h1>
              </div>
              <Button
                onClick={handleEdit}
                className="bg-white hover:bg-white/90 text-[#28A325] flex items-center"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>

          {/* Formulaire multi-step avec mêmes marges que le tableau */}
          <div className="bg-white px-8 py-6 mt-9">
            <MultiStepForm
              steps={steps}
              currentStep={currentStep}
              onStepChange={goToStep}
              onSubmit={handleSubmit}
              isSubmitting={false}
              onValidationError={handleValidationError}
              submitButtonLabel="Terminer"
              hideSubmitButton={true}
            >
              {renderStepContent()}
            </MultiStepForm>
          </div>
        </div>
      </div>
    </DebiteurFormProvider>
  );
};

export default function VoirDebiteurPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <VoirDebiteurPageInner />
    </Suspense>
  );
}