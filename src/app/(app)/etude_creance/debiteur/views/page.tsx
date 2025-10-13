"use client"

import { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Text, 
  VStack, 
  HStack, 
  Input, 
  Select, 
  Badge,
  IconButton,
  useToast
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

// Types pour les débiteurs
interface Debiteur {
  id: string;
  codeDebiteur: string;
  categorieDebiteur: string;
  typeDebiteur: string;
  email: string;
  adressePostale: string;
  
  // Personne physique
  nom?: string;
  prenom?: string;
  civilite?: string;
  nationalite?: string;
  quartier?: string;
  numeroCellulaire?: string;
  numeroTelephone?: string;
  profession?: string;
  fonction?: string;
  employeur?: string;
  statutSalarie?: string;
  
  // Personne morale
  raisonSociale?: string;
  registreCommerce?: string;
  formeJuridique?: string;
  domaineActivite?: string;
  siegeSocial?: string;
  nomGerant?: string;
  
  // Métadonnées
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
      categorieDebiteur: "Particulier",
      typeDebiteur: "Physique",
      email: "amadou.kone@example.com",
      adressePostale: "Cocody, Angré 8ème Tranche, Abidjan",
      nom: "Koné",
      prenom: "Amadou",
      civilite: "Monsieur",
      nationalite: "Ivoirienne",
      quartier: "Cocody",
      numeroCellulaire: "+225 07 12 34 56 78",
      numeroTelephone: "+225 20 30 40 50",
      profession: "Fonctionnaire",
      fonction: "Directeur",
      employeur: "Ministère des Finances",
      statutSalarie: "Actif",
      dateCreation: "2024-01-15",
      statut: "Actif"
    },
    {
      id: "2",
      codeDebiteur: "DEB-2024-002",
      categorieDebiteur: "Particulier",
      typeDebiteur: "Physique",
      email: "fatou.traore@example.com",
      adressePostale: "Plateau, Rue des Jardins, Abidjan",
      nom: "Traoré",
      prenom: "Fatou",
      civilite: "Madame",
      nationalite: "Malienne",
      quartier: "Plateau",
      numeroCellulaire: "+225 07 98 76 54 32",
      profession: "Commerçante",
      fonction: "Propriétaire",
      employeur: "Commerce Traoré",
      statutSalarie: "Actif",
      dateCreation: "2024-02-20",
      statut: "Actif"
    },
    {
      id: "3",
      codeDebiteur: "DEB-2024-003",
      categorieDebiteur: "Entreprise",
      typeDebiteur: "Moral",
      email: "contact@societe-abc.com",
      adressePostale: "Yopougon, Zone Industrielle, Abidjan",
      raisonSociale: "Société ABC SARL",
      registreCommerce: "CI-ABJ-2024-A-12345",
      formeJuridique: "SARL",
      domaineActivite: "Industrie",
      siegeSocial: "Yopougon, Zone Industrielle",
      nomGerant: "Koné Mamadou",
      dateCreation: "2024-03-10",
      statut: "Actif"
    },
    {
      id: "4",
      codeDebiteur: "DEB-2024-004",
      categorieDebiteur: "Entreprise",
      typeDebiteur: "Moral",
      email: "info@commerce-dia.com",
      adressePostale: "Cocody, Boulevard de la République, Abidjan",
      raisonSociale: "Commerce Dia SARL",
      registreCommerce: "CI-ABJ-2024-B-67890",
      formeJuridique: "SARL",
      domaineActivite: "Commerce",
      siegeSocial: "Cocody, Boulevard de la République",
      nomGerant: "Dia Aminata",
      dateCreation: "2024-04-05",
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
      filtered = filtered.filter(debiteur => {
        const searchLower = searchTerm.toLowerCase();
        return (
          debiteur.codeDebiteur.toLowerCase().includes(searchLower) ||
          (debiteur.nom && debiteur.nom.toLowerCase().includes(searchLower)) ||
          (debiteur.prenom && debiteur.prenom.toLowerCase().includes(searchLower)) ||
          (debiteur.raisonSociale && debiteur.raisonSociale.toLowerCase().includes(searchLower)) ||
          (debiteur.registreCommerce && debiteur.registreCommerce.toLowerCase().includes(searchLower)) ||
          (debiteur.nomGerant && debiteur.nomGerant.toLowerCase().includes(searchLower)) ||
          debiteur.email.toLowerCase().includes(searchLower) ||
          (debiteur.numeroCellulaire && debiteur.numeroCellulaire.includes(searchTerm))
        );
      });
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

  const getDisplayName = (debiteur: Debiteur) => {
    if (debiteur.typeDebiteur === "Physique") {
      return `${debiteur.nom || ''} ${debiteur.prenom || ''}`.trim();
    } else {
      return debiteur.raisonSociale || 'Nom non disponible';
    }
  };

  const getDisplayInfo = (debiteur: Debiteur) => {
    if (debiteur.typeDebiteur === "Physique") {
      return `${debiteur.civilite || ''} - ${debiteur.profession || 'Profession non renseignée'}`;
    } else {
      return `${debiteur.formeJuridique || ''} - ${debiteur.domaineActivite || 'Domaine non renseigné'}`;
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Physique" ? "blue" : "purple";
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

  // Configuration des colonnes pour DataTable
  const columns: ColumnDef<Debiteur>[] = [
    {
      accessorKey: "codeDebiteur",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("codeDebiteur")}</div>
      ),
    },
    {
      accessorKey: "typeDebiteur",
      header: "Type",
      cell: ({ row }) => (
        <Badge colorScheme={getTypeColor(row.getValue("typeDebiteur") as string)}>
          {row.getValue("typeDebiteur")}
        </Badge>
      ),
    },
    {
      accessorKey: "nom",
      header: "Nom / Raison sociale",
      cell: ({ row }) => (
        <div className="font-medium">{getDisplayName(row.original)}</div>
      ),
    },
    {
      accessorKey: "categorieDebiteur",
      header: "Catégorie",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("categorieDebiteur")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "numeroCellulaire",
      header: "Téléphone",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("numeroCellulaire")}</div>
      ),
    },
    {
      accessorKey: "adressePostale",
      header: "Adresse",
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate" title={row.getValue("adressePostale") as string}>
          {row.getValue("adressePostale")}
        </div>
      ),
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => (
        <Badge colorScheme={row.getValue("statut") === "Actif" ? "green" : "red"}>
          {row.getValue("statut")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const debiteur = row.original;
        return (
          <div className="flex items-center gap-2">
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
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <DataTable
        title="Gestion des Débiteurs"
        description="Consultez et gérez tous vos débiteurs"
        columns={columns}
        data={filteredDebiteurs}
        searchKey="codeDebiteur"
        searchPlaceholder="Rechercher par code, nom, raison sociale, RC..."
        onAdd={handleCreateDebiteur}
        addButtonText="Nouveau débiteur"
        status={loading ? 'pending' : undefined}
        useServerPagination={false}
        isTableLoading={loading}
        sectionTitle="DÉBITEURS"
        listTitle="LISTE DES DÉBITEURS"
      />
    </div>
  );
};

export default DebiteurPage;
