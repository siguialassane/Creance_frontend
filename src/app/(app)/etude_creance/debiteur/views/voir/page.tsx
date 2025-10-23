"use client"

import { Suspense } from "react";
import { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Button as ChakraButton, 
  Card, 
  CardBody, 
  CardHeader, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Badge, 
  Divider,
  Grid,
  GridItem,
  useToast
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import DebiteurForm from "@/components/debiteur-form/debiteur-form";
import { Button } from "@/components/ui/button";

// Types pour les débiteurs
interface Debiteur {
  id: string;
  // Étape 1: Informations générales
  codeDebiteur: string;
  categorieDebiteur: string;
  adressePostale: string;
  email: string;
  typeDebiteur: string;
  
  // Étape 2: Personne physique/morale
  civilite?: string;
  nom: string;
  prenom?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  quartier?: string;
  nationalite?: string;
  numeroCellulaire?: string;
  numeroTelephone?: string;
  fonction?: string;
  profession?: string;
  employeur?: string;
  statutSalarie?: string;
  matricule?: string;
  sexe?: string;
  dateDeces?: string;
  naturePieceIdentite?: string;
  numeroPieceIdentite?: string;
  dateEtablie?: string;
  lieuEtablie?: string;
  statutMatrimonial?: string;
  regimeMariage?: string;
  nombreEnfant?: string;
  nomConjoint?: string;
  prenomsConjoint?: string;
  dateNaissanceConjoint?: string;
  adresseConjoint?: string;
  telConjoint?: string;
  numeroPieceConjoint?: string;
  nomPere?: string;
  prenomsPere?: string;
  nomMere?: string;
  prenomsMere?: string;
  rue?: string;
  
  // Personne morale
  registreCommerce?: string;
  raisonSociale?: string;
  capitalSocial?: string;
  formeJuridique?: string;
  domaineActivite?: string;
  siegeSocial?: string;
  nomGerant?: string;
  
  // Étape 3: Domiciliation
  type?: string;
  numeroCompte?: string;
  libelle?: string;
  banque?: string;
  banqueAgence?: string;
  
  // Métadonnées
  dateCreation: string;
  statut: string;
}

const VoirDebiteurPageInner = () => {
  const [debiteur, setDebiteur] = useState<Debiteur | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const totalSteps = 3;
  const formRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const debiteurId = searchParams.get('id');
  const toast = useToast();

  const steps = [
    { id: 1, title: "Informations générales", description: "Code, catégorie, adresse, email et type de débiteur" },
    { id: 2, title: "Personne physique/morale", description: "Informations détaillées selon le type sélectionné" },
    { id: 3, title: "Domiciliation", description: "Type, compte, banque et agence" }
  ];

  // Données de test (en réalité, vous récupéreriez ces données depuis l'API)
  const mockDebiteurPhysique: Debiteur = {
    id: "1",
    // Étape 1: Informations générales
    codeDebiteur: "DEB-2024-001",
    categorieDebiteur: "Particulier",
    adressePostale: "Cocody, Angré 8ème Tranche, Abidjan",
    email: "amadou.kone@example.com",
    typeDebiteur: "physique",
    
    // Étape 2: Personne physique
    nom: "Koné",
    prenom: "Amadou",
    civilite: "Monsieur",
    dateNaissance: "15/06/1985",
    lieuNaissance: "Abidjan",
    nationalite: "Ivoirienne",
    quartier: "Cocody",
    numeroCellulaire: "+225 07 12 34 56 78",
    numeroTelephone: "+225 20 30 40 50",
    profession: "Fonctionnaire",
    fonction: "Directeur",
    employeur: "Ministère des Finances",
    statutSalarie: "Actif",
    matricule: "MAT123456",
    sexe: "Masculin",
    dateDeces: undefined,
    naturePieceIdentite: "CNI",
    numeroPieceIdentite: "123456789",
    dateEtablie: "15/01/2020",
    lieuEtablie: "Abidjan",
    statutMatrimonial: "Marié",
    regimeMariage: "Communauté",
    nombreEnfant: "2",
    nomConjoint: "Traoré",
    prenomsConjoint: "Fatou",
    dateNaissanceConjoint: "20/03/1987",
    adresseConjoint: "Cocody, Angré 8ème Tranche",
    telConjoint: "+225 07 98 76 54 32",
    numeroPieceConjoint: "987654321",
    nomPere: "Koné",
    prenomsPere: "Mamadou",
    nomMere: "Traoré",
    prenomsMere: "Aminata",
    rue: "Rue des Écoles, N°123",
    
    // Étape 3: Domiciliation
    type: "Domicile",
    numeroCompte: "1234567890123456",
    libelle: "Compte principal",
    banque: "Banque Populaire de Côte d'Ivoire",
    banqueAgence: "Agence Plateau",
    
    // Métadonnées
    dateCreation: "15/01/2024",
    statut: "Actif"
  };

  // Deuxième débiteur - Personne morale
  const mockDebiteurMoral: Debiteur = {
    id: "2",
    // Étape 1: Informations générales
    codeDebiteur: "DEB-2024-002",
    categorieDebiteur: "Entreprise",
    adressePostale: "Plateau, Tour B, Abidjan",
    email: "contact@societe-abc.com",
    typeDebiteur: "moral",
    
    // Étape 2: Personne morale
    nom: "Société ABC SARL",
    registreCommerce: "CI-ABJ-2024-A-12345",
    raisonSociale: "Société ABC SARL",
    capitalSocial: "10 000 000 FCFA",
    formeJuridique: "SARL",
    domaineActivite: "Commerce",
    siegeSocial: "Plateau, Tour B, Abidjan",
    nomGerant: "Koné Amadou",
    
    // Étape 3: Domiciliation
    type: "Bureau",
    numeroCompte: "9876543210987654",
    libelle: "Compte entreprise",
    banque: "Ecobank",
    banqueAgence: "Agence Plateau",
    
    // Métadonnées
    dateCreation: "10/03/2024",
    statut: "Actif"
  };

  // Troisième débiteur - Personne morale différente
  const mockDebiteurMoral2: Debiteur = {
    id: "4",
    // Étape 1: Informations générales
    codeDebiteur: "DEB-2024-004",
    categorieDebiteur: "Entreprise",
    adressePostale: "Cocody, Boulevard de la République, Abidjan",
    email: "info@commerce-dia.com",
    typeDebiteur: "moral",
    
    // Étape 2: Personne morale
    nom: "Commerce Dia SARL",
    registreCommerce: "CI-ABJ-2024-B-67890",
    raisonSociale: "Commerce Dia SARL",
    capitalSocial: "5 000 000 FCFA",
    formeJuridique: "SARL",
    domaineActivite: "Commerce",
    siegeSocial: "Cocody, Boulevard de la République",
    nomGerant: "Dia Aminata",
    
    // Étape 3: Domiciliation
    type: "Bureau",
    numeroCompte: "1111222233334444",
    libelle: "Compte commercial",
    banque: "SGBCI",
    banqueAgence: "Agence Cocody",
    
    // Métadonnées
    dateCreation: "05/04/2024",
    statut: "Actif"
  };

  // Récupérer le débiteur selon l'ID
  const getDebiteurById = (id: string | null): Debiteur => {
    if (id === "1") return mockDebiteurPhysique; // Personne physique
    if (id === "2") return mockDebiteurPhysique; // Personne physique aussi
    if (id === "3") return mockDebiteurMoral; // Personne morale
    if (id === "4") return mockDebiteurMoral2; // Personne morale différente
    return mockDebiteurPhysique; // Par défaut, retourner le premier
  };

  const currentDebiteur = getDebiteurById(debiteurId);

  useEffect(() => {
    // Charger le débiteur depuis le localStorage
    const loadDebiteur = () => {
      try {
        const storedDebiteurs = localStorage.getItem('debiteurs');
        
        if (storedDebiteurs && debiteurId) {
          const debiteurs = JSON.parse(storedDebiteurs);
          const foundDebiteur = debiteurs.find((d: Debiteur) => d.id === debiteurId);
          
          if (foundDebiteur) {
            setDebiteur(foundDebiteur);
            setFormData(foundDebiteur);
          } else {
            // Si le débiteur n'est pas trouvé, utiliser les données de test
            setDebiteur(currentDebiteur);
            setFormData(currentDebiteur);
          }
        } else {
          // Si pas de localStorage, utiliser les données de test
          setDebiteur(currentDebiteur);
          setFormData(currentDebiteur);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du débiteur:', error);
        // En cas d'erreur, utiliser les données de test
      setDebiteur(currentDebiteur);
        setFormData(currentDebiteur);
      setLoading(false);
      }
    };
    
    loadDebiteur();
  }, [debiteurId, currentDebiteur]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif": return "green";
      case "Inactif": return "red";
      case "Suspendu": return "orange";
      default: return "gray";
    }
  };

  const handleBack = () => {
    window.location.href = "/etude_creance/debiteur/views";
  };

  const handleEdit = () => {
    window.location.href = `/etude_creance/debiteur/edit?id=${debiteur?.id}`;
  };

  if (loading) {
    return (
      <Box p={6} maxW="1200px" mx="auto">
        <Text>Chargement du débiteur...</Text>
      </Box>
    );
  }

  if (!debiteur) {
    return (
      <Box p={6} maxW="1200px" mx="auto">
        <Text>Débiteur non trouvé</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* En-tête avec design moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>
                Gestion des Débiteurs
              </h1>
              <p className="text-base text-gray-600">
                Programme de gestion des débiteurs
              </p>
            </div>
            <HStack spacing={3}>
              <ChakraButton
                leftIcon={<EditIcon />}
                onClick={handleEdit}
                colorScheme="green"
                bg="#28A325"
                _hover={{ bg: "#047857" }}
              >
                Modifier
              </ChakraButton>
              <ChakraButton
                leftIcon={<ArrowBackIcon />}
                onClick={handleBack}
                variant="outline"
                colorScheme="gray"
              >
                Retour à la liste
              </ChakraButton>
            </HStack>
          </div>
          
          {/* Indicateurs des étapes */}
          <div className="flex items-center justify-between mb-4 mt-12">
            <div className="flex items-center justify-between w-full">
              <div className={`text-sm font-medium ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales
              </div>
              <div className={`text-sm font-medium ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                Personne physique/morale
              </div>
              <div className={`text-sm font-medium ${currentStep >= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                Domiciliation
              </div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-orange-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-orange-600 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          <div>
            <DebiteurForm
              ref={formRef}
              currentStep={currentStep}
              formData={formData}
              onDataChange={() => {}} // Pas de modification en mode consultation
              onSubmit={() => {}} // Pas de soumission en mode consultation
              readOnly={true} // Mode lecture seule
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="pt-6 pb-6 px-6">
            <div className="flex justify-between items-center">
              <div>
                {currentStep > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50 bg-white px-24 py-4 text-base min-w-[120px]"
                  >
                    Précédent
                  </Button>
                )}
              </div>
              <div>
                <Button 
                  onClick={handleNext}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                  style={{ backgroundColor: '#f97316', color: 'white' }}
                  disabled={currentStep === totalSteps}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>

        
      </VStack>
    </Box>
  );
};

export default function VoirDebiteurPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <VoirDebiteurPageInner />
    </Suspense>
  )
}
