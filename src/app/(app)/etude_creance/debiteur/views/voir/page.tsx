"use client"

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const debiteurId = searchParams.get('id');
  const toast = useToast();

  // Données de test (en réalité, vous récupéreriez ces données depuis l'API)
  const mockDebiteurPhysique: Debiteur = {
    id: "1",
    // Étape 1: Informations générales
    codeDebiteur: "DEB-2024-001",
    categorieDebiteur: "Particulier",
    adressePostale: "Cocody, Angré 8ème Tranche, Abidjan",
    email: "amadou.kone@example.com",
    typeDebiteur: "Physique",
    
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
    typeDebiteur: "Moral",
    
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
    typeDebiteur: "Moral",
    
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
    // Simulation du chargement des données
    setTimeout(() => {
      setDebiteur(currentDebiteur);
      setLoading(false);
    }, 1000);
  }, [debiteurId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif": return "green";
      case "Inactif": return "red";
      case "Suspendu": return "orange";
      default: return "gray";
    }
  };

  const handleBack = () => {
    router.push("/etude_creance/debiteur/views");
  };

  const handleEdit = () => {
    router.push(`/etude_creance/debiteur/edit?id=${debiteur?.id}`);
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
        <div className="py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2 mb-5 bg-primary w-full py-4 px-8">
              <h1 className="text-2xl tracking-tight" style={{ fontWeight: 'bold', color: '#fff' }}>
                {debiteur.nom} {debiteur.prenom}
              </h1>
              <p className="text-base text-white">
                Code: {debiteur.codeDebiteur}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-6 px-8">
            <HStack spacing={3}>
              <Button
                leftIcon={<EditIcon />}
                onClick={handleEdit}
                colorScheme="green"
                bg="#28A325"
                _hover={{ bg: "#047857" }}
              >
                Modifier
              </Button>
              <Button
                leftIcon={<ArrowBackIcon />}
                onClick={handleBack}
                variant="outline"
                colorScheme="gray"
              >
                Retour à la liste
              </Button>
            </HStack>
          </div>
        </div>

        {/* Informations générales */}
        <Card>
          <CardHeader>
            <Heading size="md" color="#1a202c">Informations générales</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Code débiteur:</Text>
                    <Text>{debiteur.codeDebiteur}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Catégorie:</Text>
                    <Text>{debiteur.categorieDebiteur}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Type:</Text>
                    <Text>{debiteur.typeDebiteur}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Email:</Text>
                    <Text>{debiteur.email}</Text>
                  </HStack>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Adresse postale:</Text>
                    <Text>{debiteur.adressePostale}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Statut:</Text>
                    <Badge colorScheme={getStatusColor(debiteur.statut)}>
                      {debiteur.statut}
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Date de création:</Text>
                    <Text>{new Date(debiteur.dateCreation).toLocaleDateString('fr-FR')}</Text>
                  </HStack>
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Informations personnelles - seulement pour personne physique */}
        {debiteur.typeDebiteur?.toLowerCase() === 'physique' && (
          <Card>
            <CardHeader>
              <Heading size="md" color="#1a202c">Informations personnelles</Heading>
            </CardHeader>
            <CardBody>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <GridItem>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Civilité:</Text>
                      <Text>{debiteur.civilite}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Nom:</Text>
                      <Text>{debiteur.nom}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Prénom:</Text>
                      <Text>{debiteur.prenom}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Date de naissance:</Text>
                      <Text>{debiteur.dateNaissance}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Lieu de naissance:</Text>
                      <Text>{debiteur.lieuNaissance}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Sexe:</Text>
                      <Text>{debiteur.sexe}</Text>
                    </HStack>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Quartier:</Text>
                      <Text>{debiteur.quartier}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Nationalité:</Text>
                      <Text>{debiteur.nationalite}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Fonction:</Text>
                      <Text>{debiteur.fonction}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Profession:</Text>
                      <Text>{debiteur.profession}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Employeur:</Text>
                      <Text>{debiteur.employeur}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Statut Salarié:</Text>
                      <Text>{debiteur.statutSalarie}</Text>
                    </HStack>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Matricule:</Text>
                      <Text>{debiteur.matricule}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Nature pièce d'identité:</Text>
                      <Text>{debiteur.naturePieceIdentite}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Numéro pièce d'identité:</Text>
                      <Text>{debiteur.numeroPieceIdentite}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Date établie:</Text>
                      <Text>{debiteur.dateEtablie}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Lieu établi:</Text>
                      <Text>{debiteur.lieuEtablie}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Rue:</Text>
                      <Text>{debiteur.rue}</Text>
                    </HStack>
                  </VStack>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        )}

        {/* Informations de l'entreprise - seulement pour personne morale */}
        {debiteur.typeDebiteur?.toLowerCase() === 'moral' && (
          <Card>
            <CardHeader>
              <Heading size="md" color="#1a202c">Informations de l'entreprise</Heading>
            </CardHeader>
            <CardBody>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Raison sociale:</Text>
                      <Text>{debiteur.raisonSociale}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Registre de commerce:</Text>
                      <Text>{debiteur.registreCommerce}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Forme juridique:</Text>
                      <Text>{debiteur.formeJuridique}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Domaine d'activité:</Text>
                      <Text>{debiteur.domaineActivite}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Capital social:</Text>
                      <Text>{debiteur.capitalSocial}</Text>
                    </HStack>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Siège social:</Text>
                      <Text>{debiteur.siegeSocial}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Nom du gérant:</Text>
                      <Text>{debiteur.nomGerant}</Text>
                    </HStack>
                  </VStack>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        )}

        {/* Informations familiales - seulement pour personne physique */}
        {debiteur.typeDebiteur?.toLowerCase() === 'physique' && (
          <Card>
            <CardHeader>
              <Heading size="md" color="#1a202c">Informations familiales</Heading>
            </CardHeader>
            <CardBody>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Statut matrimonial:</Text>
                      <Text>{debiteur.statutMatrimonial}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Régime de mariage:</Text>
                      <Text>{debiteur.regimeMariage}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Nombre d'enfant:</Text>
                      <Text>{debiteur.nombreEnfant}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Nom du conjoint:</Text>
                      <Text>{debiteur.nomConjoint}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Prénoms du conjoint:</Text>
                      <Text>{debiteur.prenomsConjoint}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Date de naissance conjoint:</Text>
                      <Text>{debiteur.dateNaissanceConjoint}</Text>
                    </HStack>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Adresse du conjoint:</Text>
                      <Text>{debiteur.adresseConjoint}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Téléphone du conjoint:</Text>
                      <Text>{debiteur.telConjoint}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Numéro de pièce du conjoint:</Text>
                      <Text>{debiteur.numeroPieceConjoint}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Nom du père:</Text>
                      <Text>{debiteur.nomPere}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Prénoms du père:</Text>
                      <Text>{debiteur.prenomsPere}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Nom de la mère:</Text>
                      <Text>{debiteur.nomMere}</Text>
                    </HStack>
                  </VStack>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        )}

        {/* Domiciliation */}
        <Card>
          <CardHeader>
            <Heading size="md" color="#1a202c">Domiciliation</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Type:</Text>
                    <Text>{debiteur.type}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Numéro du compte:</Text>
                    <Text>{debiteur.numeroCompte}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Libellé:</Text>
                    <Text>{debiteur.libelle}</Text>
                  </HStack>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Banque:</Text>
                    <Text>{debiteur.banque}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Banque agence:</Text>
                    <Text>{debiteur.banqueAgence}</Text>
                  </HStack>
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        
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
