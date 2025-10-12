"use client"

import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreanceForm from "@/components/creance-form/creance-form";

const EditerCreancePageInner = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const totalSteps = 5;
  const formRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const creanceId = searchParams.get('id');

  // Données de test (en réalité, vous récupéreriez ces données depuis l'API)
  const mockCreanceData = {
    // Étape 1: Informations générales
    debiteur: "deb1",
    groupeCreance: "GC001",
    typeObjet: "OC001",
    capitalInitial: 5000000,
    montantDecaisse: 5000000,
    steCaution: "Société de Caution ABC",
    statutRecouvrement: "oui",
    numeroPrecedent: "CRE-2023-999",
    numeroAncien: "OLD-001",
    typeStructure: "SARL",
    classeCreance: "CLAS001",
    
    // Étape 2: Informations générales 2
    numeroCreance: "CRE-2024-001",
    entite: "ENT001",
    objetCreance: "Prêt immobilier",
    periodicite: "mensuelle",
    nbEch: 12,
    dateReconnaissance: "2024-01-15",
    datePremiereEcheance: "2024-02-15",
    dateDerniereEcheance: "2024-12-15",
    dateOctroi: "2024-01-10",
    datePremierPrecept: "2024-01-20",
    creanceSoldeAvantLid: "Solde avant LID",
    
    // Étape 3: Détails financiers
    ordonnateur: "Ministère des Finances",
    montantRembourse: 5600000,
    montantDu: 5600000,
    montantDejaRembourse: 3600000,
    montantImpaye: 2000000,
    diversFrais: 50000,
    commission: 100000,
    montantAss: 25000,
    intConvPourcentage: 10,
    montantIntConvPaye: 500000,
    intRetPourcentage: 2,
    encours: 100000,
    totalDu: 2150000,
    penalite1Pourcent: 21500,
    totalARecouvrer: 2271500,
    
    // Étape 4: Pièces
    typePiece: "contrat",
    reference: "REF-001",
    libelle: "Contrat de prêt immobilier",
    dateEmission: "2024-01-15",
    dateReception: "2024-01-16",
    
    // Étape 5: Garanties
    typeGarantie: "personnelles",
    type: "Caution personnelle",
    employeur: "ENT002",
    statutSal: "Actif",
    quartier: "Q001",
    priorite: "Haute",
    nom: "Koné",
    prenoms: "Amadou",
    dateInscription: "2024-01-15",
    fonction: "Directeur",
    profession: "Fonctionnaire",
    adressePostale: "Cocody, Angré 8ème Tranche, Abidjan"
  };

  const steps = [
    { id: 1, title: "Informations générales", description: "Débiteur, groupe créance, type d'objet, capital initial" },
    { id: 2, title: "Informations générales 2", description: "Numéro, entité, objet, dates et échéances" },
    { id: 3, title: "Détails financiers", description: "Montants, intérêts, commissions et totaux" },
    { id: 4, title: "Pièces", description: "Type, référence, libellé et dates" },
    { id: 5, title: "Garanties", description: "Garanties personnelles ou réelles" }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setFormData(mockCreanceData);
      setLoading(false);
    }, 1000);
  }, [creanceId]);

  const validateCurrentStep = () => {
    if (!formRef.current) return false;
    
    // Déclencher la validation du formulaire
    return formRef.current.validateStep();
  };

  const handleSubmit = (data: any) => {
    console.log("Données de la créance modifiée:", data);
    // Ici vous pouvez ajouter la logique de mise à jour
    router.push("/etude_creance/creance/views");
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Modifier une créance</h1>
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
                      className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                      style={{ backgroundColor: '#f97316', color: 'white' }}
                    >
                      Mettre à jour
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
