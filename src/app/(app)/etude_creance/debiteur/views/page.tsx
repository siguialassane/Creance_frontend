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
  Input, 
  Select, 
  InputGroup, 
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  IconButton,
  useToast
} from "@chakra-ui/react";
import { SearchIcon, AddIcon, EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

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

const DebiteurPage = () => {
  const [debiteurs, setDebiteurs] = useState<Debiteur[]>([]);
  const [filteredDebiteurs, setFilteredDebiteurs] = useState<Debiteur[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  // Données de test
  const mockDebiteurs: Debiteur[] = [
    {
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
    },
    {
      id: "2",
      codeDebiteur: "DEB-2024-002",
      nom: "Traoré",
      prenom: "Fatou",
      categorieDebiteur: "Particulier",
      typeDebiteur: "Physique",
      civilite: "Madame",
      nationalite: "Malienne",
      adresse: "Plateau, Rue des Jardins",
      quartier: "Plateau",
      localisation: "Abidjan, Côte d'Ivoire",
      numeroCellulaire: "+225 07 98 76 54 32",
      profession: "Commerçante",
      fonction: "Propriétaire",
      employeur: "Commerce Traoré",
      statutSalarie: "Actif",
      typeDomicil: "Bureau",
      agenceBanque: "Agence Cocody",
      dateCreation: "2024-02-20",
      statut: "Actif"
    },
    {
      id: "3",
      codeDebiteur: "DEB-2024-003",
      nom: "Entreprise ABC",
      prenom: "ABC",
      categorieDebiteur: "Entreprise",
      typeDebiteur: "Moral",
      civilite: "Société",
      nationalite: "Ivoirienne",
      adresse: "Yopougon, Zone Industrielle",
      quartier: "Yopougon",
      localisation: "Abidjan, Côte d'Ivoire",
      numeroCellulaire: "+225 07 11 22 33 44",
      numeroTelephone: "+225 20 25 30 35",
      profession: "Industrie",
      fonction: "Directeur Général",
      employeur: "Entreprise ABC",
      statutSalarie: "Actif",
      typeDomicil: "Bureau",
      agenceBanque: "Agence Yopougon",
      dateCreation: "2024-03-10",
      statut: "Actif"
    }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setDebiteurs(mockDebiteurs);
      setFilteredDebiteurs(mockDebiteurs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filtrage des débiteurs
    let filtered = debiteurs;

    if (searchTerm) {
      filtered = filtered.filter(debiteur =>
        debiteur.codeDebiteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debiteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debiteur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debiteur.numeroCellulaire.includes(searchTerm)
      );
    }

    if (categorieFilter) {
      filtered = filtered.filter(debiteur => debiteur.categorieDebiteur === categorieFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(debiteur => debiteur.typeDebiteur === typeFilter);
    }

    setFilteredDebiteurs(filtered);
  }, [debiteurs, searchTerm, categorieFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif": return "green";
      case "Inactif": return "red";
      case "Suspendu": return "orange";
      default: return "gray";
    }
  };

  const handleViewDebiteur = (debiteur: Debiteur) => {
    router.push(`/etude_creance/debiteur/views/voir?id=${debiteur.id}`);
  };

  const handleEditDebiteur = (debiteur: Debiteur) => {
    router.push(`/etude_creance/debiteur/edit?id=${debiteur.id}`);
  };

  const handleDeleteDebiteur = (debiteur: Debiteur) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le débiteur ${debiteur.codeDebiteur} ?`)) {
      setDebiteurs(debiteurs.filter(d => d.id !== debiteur.id));
      toast({
        title: "Débiteur supprimé",
        description: `Le débiteur ${debiteur.codeDebiteur} a été supprimé avec succès.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateDebiteur = () => {
    router.push("/etude_creance/debiteur/create");
  };

  return (
    <Box p={6} maxW="1400px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* En-tête avec bouton de création */}
        <HStack justify="space-between">
          <Box>
            <Heading size="lg" mb={2} color="#1a202c">Gestion des Débiteurs</Heading>
            <Text color="#718096">Consultez et gérez tous vos débiteurs</Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            onClick={handleCreateDebiteur}
            colorScheme="green"
            bg="#28A325"
            _hover={{ bg: "#047857" }}
            size="lg"
          >
            Nouveau débiteur
          </Button>
        </HStack>

        {/* Actions et filtres */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" justify="space-between">
                <HStack spacing={4} flex={1}>
                  <InputGroup maxW="400px">
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Rechercher par code, nom ou téléphone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      borderColor="#d1d5db"
                      _focus={{ borderColor: "#28A325" }}
                    />
                  </InputGroup>
                  
                  <Select
                    placeholder="Toutes les catégories"
                    value={categorieFilter}
                    onChange={(e) => setCategorieFilter(e.target.value)}
                    maxW="200px"
                    borderColor="#d1d5db"
                    _focus={{ borderColor: "#28A325" }}
                  >
                    <option value="Particulier">Particulier</option>
                    <option value="Entreprise">Entreprise</option>
                    <option value="Association">Association</option>
                  </Select>

                  <Select
                    placeholder="Tous les types"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    maxW="200px"
                    borderColor="#d1d5db"
                    _focus={{ borderColor: "#28A325" }}
                  >
                    <option value="Physique">Physique</option>
                    <option value="Moral">Moral</option>
                  </Select>
                </HStack>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  {filteredDebiteurs.length} débiteur(s) trouvé(s)
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Actifs: {filteredDebiteurs.filter(d => d.statut === "Actif").length}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Tableau des débiteurs */}
        <Card>
          <CardHeader>
            <Heading size="md" color="#1a202c">Liste des débiteurs</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th color="#374151">Code</Th>
                    <Th color="#374151">Nom complet</Th>
                    <Th color="#374151">Catégorie</Th>
                    <Th color="#374151">Type</Th>
                    <Th color="#374151">Téléphone</Th>
                    <Th color="#374151">Localisation</Th>
                    <Th color="#374151">Statut</Th>
                    <Th color="#374151">Date création</Th>
                    <Th color="#374151">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={9} textAlign="center" py={8}>
                        <Text color="gray.500">Chargement des débiteurs...</Text>
                      </Td>
                    </Tr>
                  ) : filteredDebiteurs.length === 0 ? (
                    <Tr>
                      <Td colSpan={9} textAlign="center" py={8}>
                        <Text color="gray.500">Aucun débiteur trouvé</Text>
                      </Td>
                    </Tr>
                  ) : (
                    filteredDebiteurs.map((debiteur) => (
                      <Tr key={debiteur.id} _hover={{ bg: "gray.50" }}>
                        <Td fontWeight="medium">{debiteur.codeDebiteur}</Td>
                        <Td>{debiteur.nom} {debiteur.prenom}</Td>
                        <Td>{debiteur.categorieDebiteur}</Td>
                        <Td>{debiteur.typeDebiteur}</Td>
                        <Td>{debiteur.numeroCellulaire}</Td>
                        <Td>{debiteur.localisation}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(debiteur.statut)}>
                            {debiteur.statut}
                          </Badge>
                        </Td>
                        <Td>{new Date(debiteur.dateCreation).toLocaleDateString('fr-FR')}</Td>
                        <Td>
                          <HStack spacing={1}>
                            <IconButton
                              aria-label="Voir"
                              icon={<ViewIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => handleViewDebiteur(debiteur)}
                            />
                            <IconButton
                              aria-label="Modifier"
                              icon={<EditIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="green"
                              onClick={() => handleEditDebiteur(debiteur)}
                            />
                            <IconButton
                              aria-label="Supprimer"
                              icon={<DeleteIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteDebiteur(debiteur)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default DebiteurPage;
