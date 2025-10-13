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

// Types pour les créances
interface Creance {
  id: string;
  numeroCreance: string;
  objetCreance: string;
  groupeCreance: string;
  debiteurNom: string;
  debiteurPrenom: string;
  capitalInitial: number;
  montantARembourser: number;
  montantImpaye: number;
  totalSolde: number;
  statutCreance: string;
  dateCreation: string;
  periodicite: string;
  garantiePersonnelle: boolean;
  garantieReelle: boolean;
}

const EtudeCreancePage = () => {
  const [creances, setCreances] = useState<Creance[]>([]);
  const [filteredCreances, setFilteredCreances] = useState<Creance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [groupeFilter, setGroupeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  // Données de test
  const mockCreances: Creance[] = [
    {
      id: "1",
      numeroCreance: "CRE-2024-001",
      objetCreance: "Prêt immobilier",
      groupeCreance: "Prêts immobiliers",
      debiteurNom: "Koné",
      debiteurPrenom: "Amadou",
      capitalInitial: 5000000,
      montantARembourser: 6000000,
      montantImpaye: 2000000,
      totalSolde: 2200000,
      statutCreance: "En cours",
      dateCreation: "2024-01-15",
      periodicite: "Mensuelle",
      garantiePersonnelle: true,
      garantieReelle: false
    },
    {
      id: "2",
      numeroCreance: "CRE-2024-002",
      objetCreance: "Prêt véhicule",
      groupeCreance: "Prêts véhicules",
      debiteurNom: "Traoré",
      debiteurPrenom: "Fatou",
      capitalInitial: 2500000,
      montantARembourser: 3000000,
      montantImpaye: 1500000,
      totalSolde: 1650000,
      statutCreance: "En retard",
      dateCreation: "2024-02-20",
      periodicite: "Mensuelle",
      garantiePersonnelle: false,
      garantieReelle: true
    },
    {
      id: "3",
      numeroCreance: "CRE-2024-003",
      objetCreance: "Prêt consommation",
      groupeCreance: "Prêts consommation",
      debiteurNom: "Diabaté",
      debiteurPrenom: "Moussa",
      capitalInitial: 1000000,
      montantARembourser: 1200000,
      montantImpaye: 0,
      totalSolde: 0,
      statutCreance: "Remboursé",
      dateCreation: "2024-03-10",
      periodicite: "Mensuelle",
      garantiePersonnelle: true,
      garantieReelle: false
    }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setCreances(mockCreances);
      setFilteredCreances(mockCreances);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filtrage des créances
    let filtered = creances;

    if (searchTerm) {
      filtered = filtered.filter(creance =>
        creance.numeroCreance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creance.objetCreance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${creance.debiteurNom} ${creance.debiteurPrenom}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(creance => creance.statutCreance === statusFilter);
    }

    if (groupeFilter) {
      filtered = filtered.filter(creance => creance.groupeCreance === groupeFilter);
    }

    setFilteredCreances(filtered);
  }, [creances, searchTerm, statusFilter, groupeFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours": return "green";
      case "En retard": return "red";
      case "Remboursé": return "blue";
      default: return "gray";
    }
  };

  const handleViewCreance = (creance: Creance) => {
    router.push(`/etude_creance/creance/views/voir?id=${creance.id}`);
  };

  const handleEditCreance = (creance: Creance) => {
    router.push(`/etude_creance/creance/edit?id=${creance.id}`);
  };

  const handleDeleteCreance = (creance: Creance) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la créance ${creance.numeroCreance} ?`)) {
      setCreances(creances.filter(c => c.id !== creance.id));
      toast({
        title: "Créance supprimée",
        description: `La créance ${creance.numeroCreance} a été supprimée avec succès.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateCreance = () => {
    router.push("/etude_creance/creance/create");
  };

  return (
    <Box p={6} maxW="1400px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* En-tête avec bouton de création */}
        <HStack justify="space-between">
          <Box>
            <Heading 
              size="xl" 
              mb={2} 
              color="black" 
              fontWeight="900"
              fontSize="2rem"
            >
              Gestion des Créances
            </Heading>
            <Text color="black">Programme de gestion des créances</Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            onClick={handleCreateCreance}
            colorScheme="green"
            bg="#28A325"
            _hover={{ bg: "#047857" }}
            size="lg"
          >
            Nouvelle créance
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
                      placeholder="Rechercher par numéro, objet ou débiteur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      borderColor="#d1d5db"
                      _focus={{ borderColor: "#28A325" }}
                    />
                  </InputGroup>
                  
                  <Select
                    placeholder="Tous les statuts"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    maxW="200px"
                    borderColor="#d1d5db"
                    _focus={{ borderColor: "#28A325" }}
                  >
                    <option value="En cours">En cours</option>
                    <option value="En retard">En retard</option>
                    <option value="Remboursé">Remboursé</option>
                  </Select>

                  <Select
                    placeholder="Tous les groupes"
                    value={groupeFilter}
                    onChange={(e) => setGroupeFilter(e.target.value)}
                    maxW="200px"
                    borderColor="#d1d5db"
                    _focus={{ borderColor: "#28A325" }}
                  >
                    <option value="Prêts immobiliers">Prêts immobiliers</option>
                    <option value="Prêts véhicules">Prêts véhicules</option>
                    <option value="Prêts consommation">Prêts consommation</option>
                  </Select>
                </HStack>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  {filteredCreances.length} créance(s) trouvée(s)
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total solde: {formatCurrency(filteredCreances.reduce((sum, c) => sum + c.totalSolde, 0))}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Tableau des créances */}
        <Card>
          <CardHeader>
            <Heading size="md" color="#1a202c">Liste des créances</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th color="#374151">Numéro</Th>
                    <Th color="#374151">Objet</Th>
                    <Th color="#374151">Débiteur</Th>
                    <Th color="#374151">Capital initial</Th>
                    <Th color="#374151">Montant impayé</Th>
                    <Th color="#374151">Total solde</Th>
                    <Th color="#374151">Statut</Th>
                    <Th color="#374151">Date création</Th>
                    <Th color="#374151">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={9} textAlign="center" py={8}>
                        <Text color="gray.500">Chargement des créances...</Text>
                      </Td>
                    </Tr>
                  ) : filteredCreances.length === 0 ? (
                    <Tr>
                      <Td colSpan={9} textAlign="center" py={8}>
                        <Text color="gray.500">Aucune créance trouvée</Text>
                      </Td>
                    </Tr>
                  ) : (
                    filteredCreances.map((creance) => (
                      <Tr key={creance.id} _hover={{ bg: "gray.50" }}>
                        <Td fontWeight="medium">{creance.numeroCreance}</Td>
                        <Td>{creance.objetCreance}</Td>
                        <Td>{creance.debiteurNom} {creance.debiteurPrenom}</Td>
                        <Td>{formatCurrency(creance.capitalInitial)}</Td>
                        <Td>{formatCurrency(creance.montantImpaye)}</Td>
                        <Td fontWeight="bold" color={creance.totalSolde > 0 ? "red.500" : "green.500"}>
                          {formatCurrency(creance.totalSolde)}
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(creance.statutCreance)}>
                            {creance.statutCreance}
                          </Badge>
                        </Td>
                        <Td>{new Date(creance.dateCreation).toLocaleDateString('fr-FR')}</Td>
                        <Td>
                          <HStack spacing={1}>
                            <IconButton
                              aria-label="Voir"
                              icon={<ViewIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => handleViewCreance(creance)}
                            />
                            <IconButton
                              aria-label="Modifier"
                              icon={<EditIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="green"
                              onClick={() => handleEditCreance(creance)}
                            />
                            <IconButton
                              aria-label="Supprimer"
                              icon={<DeleteIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteCreance(creance)}
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

export default EtudeCreancePage;
