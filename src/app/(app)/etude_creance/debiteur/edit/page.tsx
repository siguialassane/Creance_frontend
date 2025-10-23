"use client"

import { Suspense } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation";
import DebiteurForm from "@/components/debiteur-form/debiteur-form";
import { useToast } from "@chakra-ui/react";

const EditerDebiteurPageInner = () => {
  const [step, setStep] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const debiteurId = searchParams.get('id')
  const formRef = React.useRef<any>(null)
  const toast = useToast()

  // Données de test (en réalité, vous récupéreriez ces données depuis l'API)
  const mockDebiteurData = {
    // Étape 1: Informations générales
    codeDebiteur: "DEB-2024-001",
    categorieDebiteur: "particulier",
    adressePostale: "Cocody, Angré 8ème Tranche, Abidjan",
    email: "amadou.kone@example.com",
    typeDebiteur: "physique",
    
    // Étape 2: Personne physique
    civilite: "monsieur",
    nom: "Koné",
    prenom: "Amadou",
    dateNaissance: "1985-06-15",
    lieuNaissance: "Abidjan",
    quartier: "quartier1",
    nationalite: "nationalite1",
    fonction: "fonction1",
    profession: "profession1",
    employeur: "entite1",
    statutSalarie: "statut1",
    matricule: "MAT123456",
    sexe: "M",
    dateDeces: "",
    naturePieceIdentite: "CNI",
    numeroPieceIdentite: "123456789",
    dateEtablie: "2020-01-15",
    lieuEtablie: "Abidjan",
    statutMatrimonial: "marie",
    regimeMariage: "communaute",
    nombreEnfant: "2",
    nomConjoint: "Traoré",
    prenomsConjoint: "Fatou",
    dateNaissanceConjoint: "1987-03-20",
    adresseConjoint: "Cocody, Angré 8ème Tranche",
    telConjoint: "+225 07 98 76 54 32",
    numeroPieceConjoint: "987654321",
    nomPere: "Koné",
    prenomsPere: "Mamadou",
    nomMere: "Traoré",
    prenomsMere: "Aminata",
    rue: "Rue des Écoles, N°123",
    
    // Étape 3: Domiciliation
    type: "domicile",
    numeroCompte: "1234567890123456",
    libelle: "Compte principal",
    banque: "banque1",
    banqueAgence: "agence1"
  };

  const [formData, setFormData] = React.useState({})

  const steps = [
    { id: 0, title: "Informations générales", description: "Code, catégorie, adresse, email et type de débiteur" },
    { id: 1, title: "Personne physique/morale", description: "Informations détaillées selon le type sélectionné" },
    { id: 2, title: "Domiciliation", description: "Type, compte, banque et agence" }
  ]

  React.useEffect(() => {
    // Charger le débiteur depuis le localStorage
    const loadDebiteur = () => {
      try {
        const storedDebiteurs = localStorage.getItem('debiteurs');
        
        if (storedDebiteurs && debiteurId) {
          const debiteurs = JSON.parse(storedDebiteurs);
          const foundDebiteur = debiteurs.find((d: any) => d.id === debiteurId);
          
          if (foundDebiteur) {
            console.log('📝 Débiteur chargé pour modification:', foundDebiteur);
            setFormData(foundDebiteur);
          } else {
            // Si le débiteur n'est pas trouvé, utiliser les données de test
            console.log('⚠️ Débiteur non trouvé, utilisation des données mock');
            setFormData(mockDebiteurData);
          }
        } else {
          // Si pas de localStorage, utiliser les données de test
          console.log('⚠️ Pas de localStorage, utilisation des données mock');
          setFormData(mockDebiteurData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Erreur lors du chargement du débiteur:', error);
        // En cas d'erreur, utiliser les données de test
        setFormData(mockDebiteurData);
        setLoading(false);
      }
    };
    
    if (debiteurId) {
      loadDebiteur();
    } else {
      setLoading(false);
    }
  }, [debiteurId])

  const handleSubmit = (data: any) => {
    console.log("Données du débiteur modifié:", data);
    
    try {
      // Récupérer les débiteurs existants du localStorage
      const storedDebiteurs = localStorage.getItem('debiteurs');
      
      if (storedDebiteurs && debiteurId) {
        const debiteurs = JSON.parse(storedDebiteurs);
        
        // Trouver l'index du débiteur à modifier
        const index = debiteurs.findIndex((d: any) => d.id === debiteurId);
        
        if (index !== -1) {
          // Mettre à jour le débiteur en conservant l'ID et les métadonnées
          debiteurs[index] = {
            ...debiteurs[index],
            ...data,
            id: debiteurId, // Garder l'ID original
            dateModification: new Date().toISOString().split('T')[0]
          };
          
          // Sauvegarder dans le localStorage
          localStorage.setItem('debiteurs', JSON.stringify(debiteurs));
          
          // Afficher l'alerte de succès
          toast({
            title: "Débiteur modifié avec succès !",
            description: `Le débiteur ${data.codeDebiteur || debiteurs[index].codeDebiteur} a été mis à jour.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          
          // Rediriger vers la liste après un court délai
          setTimeout(() => {
            window.location.href = "/etude_creance/debiteur/views";
          }, 1500);
        } else {
          toast({
            title: "Erreur",
            description: "Débiteur non trouvé dans le localStorage",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la modification",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement du débiteur...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* En-tête comme dans l'image */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>Modifier un débiteur</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full">
              <div className={`text-sm font-medium ${step >= 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales
              </div>
              <div className={`text-sm font-medium ${step >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                Personne physique/morale
              </div>
              <div className={`text-sm font-medium ${step >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                Domiciliation
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-orange-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 space-y-6">

            {/* Contenu du formulaire */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-orange-600 mb-2">
                  {steps[step].title}
                </h2>
                <p className="text-sm text-gray-600">
                  {steps[step].description}
                </p>
              </div>

              <DebiteurForm
                ref={formRef}
                currentStep={step + 1}
                formData={formData}
                onDataChange={setFormData}
                onSubmit={handleSubmit}
                isEditMode={true}
              />
            </div>

            {/* Navigation comme dans l'image - pied de page */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  {step > 0 && (
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
                  {step < 2 ? (
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
  )
}


export default function EditerDebiteurPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EditerDebiteurPageInner />
    </Suspense>
  )
}
