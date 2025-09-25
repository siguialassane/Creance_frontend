"use client"

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
  codeDebiteur: string;
  nom: string;
  prenom: string;
  categorieDebiteur: string;
  typeDebiteur: string;
  civilite: string;
  nationalite: string;
  adresse: string;
  quartier: string;
  localisation: string;
  numeroCellulaire: string;
  numeroTelephone?: string;
  profession?: string;
  fonction?: string;
  employeur?: string;
  statutSalarie?: string;
  typeDomicil?: string;
  agenceBanque?: string;
  dateCreation: string;
  statut: string;
}

const VoirDebiteurPage = () => {
  const [debiteur, setDebiteur] = useState<Debiteur | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const debiteurId = searchParams.get('id');
  const toast = useToast();

  // Données de test (en réalité, vous récupéreriez ces données depuis l'API)
  const mockDebiteur: Debiteur = {
    id: "1",
    codeDebiteur: "DEB-2024-001",
    nom: "Koné",
    prenom: "Amadou",
    categorieDebiteur: "Particulier",
    typeDebiteur: "Physique",
    civilite: "Monsieur",
    nationalite: "Ivoirienne",
    adresse: "Cocody, Angré 8ème Tranche",
    quartier: "Cocody",
    localisation: "Abidjan, Côte d'Ivoire",
    numeroCellulaire: "+225 07 12 34 56 78",
    numeroTelephone: "+225 20 30 40 50",
    profession: "Fonctionnaire",
    fonction: "Directeur",
    employeur: "Ministère des Finances",
    statutSalarie: "Actif",
    typeDomicil: "Domicile",
    agenceBanque: "Agence Plateau",
    dateCreation: "2024-01-15",
    statut: "Actif"
  };

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setDebiteur(mockDebiteur);
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
        {/* En-tête avec boutons d'action */}
        <HStack justify="space-between" align="start">
          <Box>
            <Heading size="lg" mb={2} color="#1a202c">
              {debiteur.nom} {debiteur.prenom}
            </Heading>
            <Text color="#718096">Code: {debiteur.codeDebiteur}</Text>
          </Box>
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
        </HStack>

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
                    <Text fontWeight="semibold" color="#374151">Civilité:</Text>
                    <Text>{debiteur.civilite}</Text>
                  </HStack>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Nationalité:</Text>
                    <Text>{debiteur.nationalite}</Text>
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

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <Heading size="md" color="#1a202c">Informations personnelles</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Nom:</Text>
                    <Text>{debiteur.nom}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Prénom:</Text>
                    <Text>{debiteur.prenom}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Adresse:</Text>
                    <Text>{debiteur.adresse}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Quartier:</Text>
                    <Text>{debiteur.quartier}</Text>
                  </HStack>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Localisation:</Text>
                    <Text>{debiteur.localisation}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="#374151">Cellulaire:</Text>
                    <Text>{debiteur.numeroCellulaire}</Text>
                  </HStack>
                  {debiteur.numeroTelephone && (
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Téléphone:</Text>
                      <Text>{debiteur.numeroTelephone}</Text>
                    </HStack>
                  )}
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Informations professionnelles */}
        <Card>
          <CardHeader>
            <Heading size="md" color="#1a202c">Informations professionnelles</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  {debiteur.profession && (
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Profession:</Text>
                      <Text>{debiteur.profession}</Text>
                    </HStack>
                  )}
                  {debiteur.fonction && (
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Fonction:</Text>
                      <Text>{debiteur.fonction}</Text>
                    </HStack>
                  )}
                  {debiteur.employeur && (
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Employeur:</Text>
                      <Text>{debiteur.employeur}</Text>
                    </HStack>
                  )}
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  {debiteur.statutSalarie && (
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Statut salarié:</Text>
                      <Text>{debiteur.statutSalarie}</Text>
                    </HStack>
                  )}
                  {debiteur.typeDomicil && (
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Type de domiciliation:</Text>
                      <Text>{debiteur.typeDomicil}</Text>
                    </HStack>
                  )}
                  {debiteur.agenceBanque && (
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color="#374151">Agence de banque:</Text>
                      <Text>{debiteur.agenceBanque}</Text>
                    </HStack>
                  )}
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <Heading size="md" color="#1a202c">Actions rapides</Heading>
          </CardHeader>
          <CardBody>
            <HStack spacing={4}>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => {
                  // Rediriger vers la création de créance avec le débiteur pré-sélectionné
                  router.push(`/etude_creance/creance/create?debiteurId=${debiteur.id}&debiteurCode=${debiteur.codeDebiteur}&debiteurNom=${debiteur.nom}&debiteurPrenom=${debiteur.prenom}`);
                }}
              >
                Créer une créance
              </Button>
              <Button
                colorScheme="purple"
                variant="outline"
                onClick={() => {
                  // Rediriger vers la liste des créances filtrée par ce débiteur
                  router.push(`/etude_creance/creance/views?debiteurId=${debiteur.id}&debiteurCode=${debiteur.codeDebiteur}`);
                }}
              >
                Voir les créances
              </Button>
              <Button
                colorScheme="green"
                variant="outline"
                onClick={() => {
                  // Rediriger vers la gestion amiable pour ce débiteur
                  router.push(`/etude_creance/gestion_amiable?debiteurId=${debiteur.id}&debiteurCode=${debiteur.codeDebiteur}`);
                }}
              >
                Gestion amiable
              </Button>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default VoirDebiteurPage;
