"use client"

import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import CreanceForm from "@/components/creance-form/creance-form";
import { useApiClient } from "@/hooks/useApiClient";
import { CreanceService } from "@/services/creance.service";

const NouvelleCreancePageInner = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;
  const formRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiClient = useApiClient();
  const toast = useToast();

  const steps = [
    { id: 1, title: "Informations générales", description: "Débiteur, groupe créance, type d'objet, capital initial" },
    { id: 2, title: "Informations générales 2", description: "Numéro, entité, objet, dates et échéances" },
    { id: 3, title: "Détails financiers", description: "Montants, intérêts, commissions et totaux" },
    { id: 4, title: "Pièces", description: "Type, référence, libellé et dates" },
    { id: 5, title: "Garanties", description: "Garanties personnelles ou réelles" }
  ];

  // Récupérer les paramètres du débiteur depuis l'URL
  const debiteurId = searchParams.get('debiteurId');
  const debiteurCode = searchParams.get('debiteurCode');
  const debiteurNom = searchParams.get('debiteurNom');
  const debiteurPrenom = searchParams.get('debiteurPrenom');

  useEffect(() => {
    // Pré-remplir les données du débiteur si elles sont fournies
    if (debiteurId && debiteurCode && debiteurNom && debiteurPrenom) {
      setFormData(prev => ({
        ...prev,
        debiteurCode: debiteurCode,
        debiteurNom: debiteurNom,
        debiteurPrenom: debiteurPrenom
      }));
    }
  }, [debiteurId, debiteurCode, debiteurNom, debiteurPrenom]);

  const validateCurrentStep = () => {
    if (!formRef.current) return false;
    
    // Déclencher la validation du formulaire
    return formRef.current.validateStep();
  };

  const handleSubmit = async (data: any) => {
    console.log("Données de la créance:", data);
    setIsSubmitting(true);

    try {
      // Transformation des données du formulaire vers le format API
      const creanceData = {
        debiteur: data.debiteur,
        groupeCreance: data.groupeCreance,
        objetCreance: data.typeObjet,
        objetDetail: data.objetCreance,
        capitalInitial: data.capitalInitial,
        montantDecaisse: data.montantDecaisse,
        montantInteretConventionnel: data.montantIntConvPaye,
        commissionBanque: data.commission,
        numeroPrecedent: data.numeroPrecedent,
        numeroAncien: data.numeroAncien,
        montantDu: data.montantDu,
        montantRembourse: data.montantDejaRembourse,
        montantInteretRetard: data.intRetPourcentage,
        frais: data.diversFrais,
        encours: data.encours,
        dateDeblocage: data.dateOctroi || new Date().toISOString().split('T')[0],
        dateEcheance: data.dateDerniereEcheance || new Date().toISOString().split('T')[0],
        periodicite: data.periodicite?.toUpperCase(),
        duree: data.nbEch,
        tauxInteretConventionnel: data.intConvPourcentage,
        tauxInteretRetard: data.intRetPourcentage,
        ordonnateur: data.ordonnateur || 'ORD001',
        statut: 'EN_COURS',
        observations: data.libelle
      };

      const response = await CreanceService.create(apiClient, creanceData);

      if (response.success) {
        toast({
          title: "Créance créée",
          description: "La créance a été créée avec succès",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        router.push("/etude_creance/creance/views");
      } else {
        throw new Error(response.message || "Erreur lors de la création");
      }
    } catch (error: any) {
      console.error("Erreur lors de la création:", error);
      toast({
        title: "Erreur de création",
        description: error.message || "Impossible de créer la créance",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Contenu principal */}
          <div className="lg:col-span-12">
            
        {/* En-tête comme dans l'image */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>Ajouter une créance</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full">
              <div className={`text-sm font-medium ${step >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales
              </div>
              <div className={`text-sm font-medium ${step >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales 2
              </div>
              <div className={`text-sm font-medium ${step >= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                Détails financiers
              </div>
              <div className={`text-sm font-medium ${step >= 4 ? 'text-orange-600' : 'text-gray-500'}`}>
                Pièces
              </div>
              <div className={`text-sm font-medium ${step >= 5 ? 'text-orange-600' : 'text-gray-500'}`}>
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
                      onClick={() => handleSubmit(formData)}
                      disabled={isSubmitting}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                      style={{ backgroundColor: '#f97316', color: 'white' }}
                    >
                      {isSubmitting ? "Enregistrement..." : "Enregistrer"}
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

export default function NouvelleCreancePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <NouvelleCreancePageInner />
    </Suspense>
  )
}
