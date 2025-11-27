"use client"

import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CreanceForm from "@/components/creance-form/creance-form";
import { useApiClient } from "@/hooks/useApiClient";
import { CreanceService } from "@/services/creance.service";
import { CreanceResponse } from "@/types/creance";

const EditerCreancePageInner = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [creanceData, setCreanceData] = useState<CreanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 4; // Mis à jour selon la nouvelle structure
  const formRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const creanceId = searchParams.get('id');
  const apiClient = useApiClient();

  const steps = [
    { id: 1, title: "Informations générales", description: "Débiteur, groupe créance, objet, capital initial, dates et conditions" },
    { id: 2, title: "Détails financiers", description: "Montants, intérêts, commissions et totaux (calculés automatiquement)" },
    { id: 3, title: "Pièces jointes", description: "Documents justificatifs de la créance" },
    { id: 4, title: "Garanties", description: "Garanties personnelles ou réelles" }
  ];

  // Transformation des données API vers le format du formulaire selon la documentation (même que voir/page.tsx)
  const transformApiDataToForm = (apiData: CreanceResponse) => {
    return {
      // Étape 1: Informations générales (fusion step1 + step2)
      debiteur: apiData.DEB_CODE,
      groupeCreance: apiData.GRP_CREAN_CODE || apiData.GC_CODE || '',
      objetCreance: apiData.OBJ_CREAN_CODE || apiData.OC_CODE || '',
      capitalInitial: apiData.CREAN_CAPIT_INIT,
      montantDecaisse: apiData.CREAN_MONT_DECAISSE || 0,
      numeroPrecedent: apiData.CREAN_CODE_PREC || apiData.CREAN_NUM_PREC || '',
      numeroAncien: apiData.CREAN_CODE_ANC || apiData.CREAN_NUM_ANC || '',
      dateDeblocage: apiData.CREAN_DATEFT || apiData.CREAN_DATE_DEBLOCAGE || '',
      dateEcheance: apiData.CREAN_DATECH || apiData.CREAN_DATE_ECHEANCE || '',
      nbEch: apiData.CREAN_NBECH || apiData.nbEch || undefined,
      periodicite: apiData.CREAN_PERIODICITE || '',
      duree: apiData.CREAN_DUREE || undefined,
      tauxInteretConventionnel: apiData.CREAN_TAUXIC || apiData.CREAN_TAUX_IC || 0,
      tauxInteretRetard: apiData.CREAN_TAUXIR || apiData.CREAN_TAUX_IR || 0,
      ordonnateur: apiData.ORDO_CODE || '',
      statut: apiData.CREAN_STATUT || 'A',
      statutRecouvr: apiData.statutRecouvr !== undefined ? apiData.statutRecouvr : (apiData.CREAN_STATRECOUV ? true : undefined),
      objetDetail: apiData.CREAN_OBJET || '',

      // Étape 2: Détails financiers
      montantInteretConventionnel: apiData.CREAN_MONT_IC || 0,
      commissionBanque: apiData.CREAN_COMM_BANQ || 0,
      montantDu: apiData.CREAN_MONT_DU || 0,
      montantRembourse: apiData.CREAN_MONT_REMB || apiData.CREAN_DEJ_REMB || 0,
      montantInteretRetard: apiData.CREAN_MONT_IR || 0,
      frais: apiData.CREAN_FRAIS || 0,
      encours: apiData.CREAN_ENCOURS || 0,
      montantARembourser: apiData.CREAN_MONT_A_REMB || 0,
      montantImpaye: apiData.CREAN_MONT_IMPAYE || 0,
      totalDu: apiData.CREAN_TOTAL_DU || 0,
      penalite: apiData.CREAN_PENALITE || 0,
      totalSolde: apiData.CREAN_TOT_SOLDE || 0,

      // Étape 3: Pièces jointes (gérées par state dans CreanceForm)
      pieces: apiData.pieces || [],

      // Étape 4: Garanties (gérées par state dans CreanceForm)
      garantiesReelles: apiData.garantiesReelles || [],
      garantiesPersonnelles: apiData.garantiesPersonnelles || [],
    };
  };

  useEffect(() => {
    const loadCreance = async () => {
      if (!creanceId) {
        setError("ID de créance manquant");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const apiData = await CreanceService.getByCode(apiClient, creanceId);
        console.log('Données créance reçues (édition):', apiData);

        // Conserver les données complètes pour les garanties et pièces
        setCreanceData(apiData);

        const transformedData = transformApiDataToForm(apiData);
        console.log('Données transformées pour le formulaire:', transformedData);
        setFormData(transformedData);
      } catch (error: any) {
        console.error('Erreur lors du chargement de la créance:', error);
        setError(error.message || "Impossible de charger la créance");
        toast.error(error.message || "Impossible de charger la créance");
      } finally {
        setLoading(false);
      }
    };

    loadCreance();
  }, [creanceId, apiClient]);

  const validateCurrentStep = async () => {
    if (!formRef.current?.validateStep) return false;
    return await formRef.current.validateStep();
  };

  const handleSubmit = async () => {
    // Valider la dernière étape
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }

    if (!creanceId) {
      toast.error("ID de créance manquant");
      return;
    }

    setIsSubmitting(true);

    try {
      // Récupérer toutes les valeurs depuis le formulaire CreanceForm (source la plus fiable car c'est le vrai formulaire)
      const formValues = formRef.current?.getFormValues ? formRef.current.getFormValues() : {};
      
      // Utiliser formData qui est mis à jour en temps réel via onDataChange depuis CreanceForm
      // Combiner toutes les sources pour être sûr d'avoir toutes les données (priorité: CreanceForm > formData)
      const allFormValues = { ...formData, ...formValues };
      
      console.log("📋 Valeurs depuis CreanceForm.getFormValues():", formValues);
      console.log("📋 formData (mis à jour via onDataChange):", formData);
      console.log("📋 Toutes les valeurs combinées:", allFormValues);
      
      // Construire le payload avec TOUS les champs selon la documentation API (même structure que create)
      const creanceData: any = {};
      
      // Champs requis (8 champs obligatoires selon la doc)
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
      }
      if (allFormValues.dateEcheance) {
        creanceData.dateEcheance = allFormValues.dateEcheance;
      }
      if (allFormValues.ordonnateur !== undefined) {
        creanceData.ordonnateur = allFormValues.ordonnateur || '';
      }
      creanceData.statut = allFormValues.statut || "A";
      
      // Champs optionnels - Step 1
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
      
      // Champs optionnels - Step 1 (dates et conditions)
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
      
      // Champs optionnels - Step 2 (montants)
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
      
      // Récupérer les garanties et pièces depuis CreanceForm
      const garanties = formRef.current?.getGaranties ? formRef.current.getGaranties() : [];
      const pieces = formRef.current?.getPieces ? formRef.current.getPieces() : [];
      const watchedTypeGarantie = allFormValues.typeGarantie || '';
      
      // Séparer les garanties personnelles et réelles selon le type
      const garantiesPersonnelles: any[] = [];
      const garantiesReelles: any[] = [];
      
      garanties.forEach((garantie: any) => {
        if (watchedTypeGarantie === 'personnelles' || garantie.type === 'personnelles') {
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
        .filter((p: any) => p.typePieceCode || p.numero || p.fichier)
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
      
      console.log("📤 Payload final envoyé au backend (UPDATE):", JSON.stringify(creanceData, null, 2));
      console.log("📎 Garanties personnelles:", garantiesPersonnelles);
      console.log("📎 Garanties réelles:", garantiesReelles);
      console.log("📎 Pièces jointes:", piecesMapped);

      // Utiliser l'endpoint UPDATE avec le code de la créance
      const response = await CreanceService.update(apiClient, creanceId, creanceData);

      console.log("📥 Réponse du backend (UPDATE):", response);

      // Le backend retourne status: "SUCCESS" ou status: "ERROR"
      const responseData = response as any;
      if (responseData.status === "SUCCESS" || response.success === true) {
        const successMessage = responseData.data?.message || responseData.message || "La créance a été mise à jour avec succès";
        toast.success(successMessage);
        router.push("/etude_creance/creance/views");
      } else {
        const errorMessage = responseData.data?.message || responseData.message || "Erreur lors de la mise à jour de la créance";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      
      let errorMessage = "Impossible de mettre à jour la créance";
      
      if (error.response?.data) {
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
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la créance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Contenu principal */}
          <div className="lg:col-span-12">
            
        {/* En-tête comme dans l'image */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>Modifier une créance</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full">
              <div className={`text-sm font-medium ${step >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales
              </div>
              <div className={`text-sm font-medium ${step >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                Détails financiers
              </div>
              <div className={`text-sm font-medium ${step >= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                Pièces jointes
              </div>
              <div className={`text-sm font-medium ${step >= 4 ? 'text-orange-600' : 'text-gray-500'}`}>
                Garanties
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-orange-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

            {/* Contenu du formulaire */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-orange-600 mb-2">
                  {steps[step - 1].title}
                </h2>
                <p className="text-sm text-gray-600">
                  {steps[step - 1].description}
                </p>
              </div>

              <CreanceForm
                ref={formRef}
                currentStep={step}
                formData={formData}
                onDataChange={setFormData}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Navigation comme dans l'image - pied de page */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  {step > 1 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(step - 1)}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50 bg-white px-24 py-4 text-base min-w-[120px]"
                    >
                      Précédent
                    </Button>
                  )}
                </div>
                <div>
                  {step < totalSteps ? (
                    <Button 
                      onClick={() => setStep(step + 1)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                      style={{ backgroundColor: '#f97316', color: 'white' }}
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                      style={{ backgroundColor: '#f97316', color: 'white' }}
                    >
                      {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EditerCreancePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EditerCreancePageInner />
    </Suspense>
  )
}
