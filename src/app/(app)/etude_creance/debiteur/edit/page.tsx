"use client"

import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { Box, Button, Card, CardBody, CardHeader, Heading, Text, VStack, HStack, Progress, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import DebiteurForm from "@/components/debiteur-form/debiteur-form";

const EditerDebiteurPageInner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const totalSteps = 3;
  const formRef = useRef<any>(null);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const debiteurId = searchParams.get('id');

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

  const steps = [
    { id: 1, title: "Informations générales", description: "Code, catégorie, adresse, email et type de débiteur" },
    { id: 2, title: "Personne physique/morale", description: "Informations détaillées selon le type sélectionné" },
    { id: 3, title: "Domiciliation", description: "Type, compte, banque et agence" }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setFormData(mockDebiteurData);
      setLoading(false);
    }, 1000);
  }, [debiteurId]);

  const validateCurrentStep = () => {
    if (!formRef.current) return false;
    
    // Déclencher la validation du formulaire
    return formRef.current.validateStep();
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: any) => {
    console.log("Données du débiteur modifié:", data);
    // Ici vous pouvez ajouter la logique de mise à jour
    toast({
      title: "Débiteur modifié",
      description: "Le débiteur a été modifié avec succès.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // Rediriger vers la liste des débiteurs
    router.push("/etude_creance/debiteur/views");
  };

  const handleBack = () => {
    router.push("/etude_creance/debiteur/views");
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  if (loading) {
    return (
      <Box p={6} maxW="1200px" mx="auto">
        <Text>Chargement du débiteur...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* En-tête avec design moderne */}
        <div className="py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2 mb-5 bg-primary w-full py-4 px-8">
              <h1 className="text-2xl tracking-tight" style={{ fontWeight: 'bold', color: '#fff' }}>
                Modification d'un Débiteur
              </h1>
              <p className="text-base text-white">
                Modifiez le débiteur {mockDebiteurData.codeDebiteur}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-6 px-8">
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="outline"
              colorScheme="gray"
              size="md"
            >
              Retour à la liste
            </Button>
          </div>
        </div>

        {/* Indicateur de progression */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" justify="space-between">
                {steps.map((step, index) => (
                  <VStack key={step.id} spacing={2} flex={1}>
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg={currentStep >= step.id ? "#28A325" : "gray.200"}
                      color={currentStep >= step.id ? "white" : "gray.500"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                    >
                      {step.id}
                    </Box>
                    <Text fontSize="sm" fontWeight="medium" textAlign="center">
                      {step.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      {step.description}
                    </Text>
                  </VStack>
                ))}
              </HStack>
              <Progress value={progressPercentage} w="full" colorScheme="green" size="sm" />
            </VStack>
          </CardBody>
        </Card>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <Heading size="md" color="#1a202c">
              Étape {currentStep} : {steps[currentStep - 1].title}
            </Heading>
            <Text color="#718096">{steps[currentStep - 1].description}</Text>
          </CardHeader>
          <CardBody>
            <DebiteurForm
              ref={formRef}
              currentStep={currentStep}
              formData={formData}
              onDataChange={setFormData}
              onSubmit={handleSubmit}
              isEditMode={true}
            />
          </CardBody>
        </Card>

        {/* Navigation */}
        <Card>
          <CardBody>
            <HStack justify="space-between">
              <Button
                leftIcon={<ChevronLeftIcon />}
                onClick={handlePrevious}
                isDisabled={currentStep === 1}
                variant="outline"
              >
                Précédent
              </Button>
              
              <HStack spacing={4}>
                <Text fontSize="sm" color="gray.500">
                  Étape {currentStep} sur {totalSteps}
                </Text>
              </HStack>

              {currentStep < totalSteps ? (
                <Button
                  rightIcon={<ChevronRightIcon />}
                  onClick={handleNext}
                  colorScheme="green"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit(formData)}
                  colorScheme="green"
                >
                  Mettre à jour le débiteur
                </Button>
              )}
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default function EditerDebiteurPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EditerDebiteurPageInner />
    </Suspense>
  )
}
