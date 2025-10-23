"use client"

import { Suspense } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";

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

const CreancePageInner = () => {
  const [creances, setCreances] = useState<Creance[]>([]);
  const [filteredCreances, setFilteredCreances] = useState<Creance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [groupeFilter, setGroupeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();

  // Récupérer les paramètres de filtrage depuis l'URL
  const debiteurId = searchParams.get('debiteurId');
  const debiteurCode = searchParams.get('debiteurCode');

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

    // Filtrage par débiteur si spécifié dans l'URL
    if (debiteurId || debiteurCode) {
      filtered = filtered.filter(creance => 
        creance.debiteurNom.toLowerCase().includes(debiteurCode?.toLowerCase() || '') ||
        `${creance.debiteurNom} ${creance.debiteurPrenom}`.toLowerCase().includes(debiteurCode?.toLowerCase() || '')
      );
    }

    setFilteredCreances(filtered);
  }, [creances, searchTerm, statusFilter, groupeFilter, debiteurId, debiteurCode]);

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

  // Configuration des colonnes pour DataTable
  const columns: ColumnDef<Creance>[] = [
    {
      accessorKey: "numeroCreance",
      header: "Numéro",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("numeroCreance")}</div>
      ),
    },
    {
      accessorKey: "objetCreance",
      header: "Objet",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("objetCreance")}</div>
      ),
    },
    {
      accessorKey: "debiteurNom",
      header: "Débiteur",
      cell: ({ row }) => {
        const debiteurNom = row.getValue("debiteurNom") as string;
        const debiteurPrenom = row.original.debiteurPrenom;
        return (
          <div className="font-medium">{debiteurNom} {debiteurPrenom}</div>
        );
      },
    },
    {
      accessorKey: "capitalInitial",
      header: "Capital initial",
      cell: ({ row }) => (
        <div className="font-medium">{formatCurrency(row.getValue("capitalInitial") as number)}</div>
      ),
    },
    {
      accessorKey: "montantImpaye",
      header: "Montant impayé",
      cell: ({ row }) => (
        <div className="font-medium">{formatCurrency(row.getValue("montantImpaye") as number)}</div>
      ),
    },
    {
      accessorKey: "totalSolde",
      header: "Total solde",
      cell: ({ row }) => {
        const totalSolde = row.getValue("totalSolde") as number;
        return (
          <div className={`font-bold ${totalSolde > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {formatCurrency(totalSolde)}
          </div>
        );
      },
    },
    {
      accessorKey: "statutCreance",
      header: "Statut",
      cell: ({ row }) => (
        <Badge colorScheme={getStatusColor(row.getValue("statutCreance") as string)}>
          {row.getValue("statutCreance")}
        </Badge>
      ),
    },
    {
      accessorKey: "dateCreation",
      header: "Date création",
      cell: ({ row }) => (
        <div className="font-medium">
          {new Date(row.getValue("dateCreation") as string).toLocaleDateString('fr-FR')}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const creance = row.original;
        return (
          <div className="flex items-center gap-2">
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
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <DataTable
        title="Gestion des Créances"
        description={debiteurCode ? `Créances du débiteur: ${debiteurCode}` : "Consultez et gérez toutes vos créances"}
        columns={columns}
        data={filteredCreances}
        searchKey="numeroCreance"
        searchPlaceholder="Rechercher par numéro, objet ou débiteur..."
        onAdd={handleCreateCreance}
        addButtonText="Nouvelle créance"
        status={loading ? 'pending' : undefined}
        useServerPagination={false}
        isTableLoading={loading}
      />
    </div>
  );
};

export default function CreancePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CreancePageInner />
    </Suspense>
  )
}
