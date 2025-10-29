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
import { useApiClient } from "@/hooks/useApiClient";
import { CreanceService } from "@/services/creance.service";
import { CreanceResponse } from "@/types/creance";

// Types pour les créances (mapping de CreanceResponse à l'interface locale)
interface Creance {
  id: string;
  numeroCreance: string;
  objetCreance: string;
  groupeCreance: string;
  debiteurNom: string;
  debiteurPrenom: string;
  raisonSociale: string;
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
  const apiClient = useApiClient();

  // Récupérer les paramètres de filtrage depuis l'URL
  const debiteurId = searchParams.get('debiteurId');
  const debiteurCode = searchParams.get('debiteurCode');

  // Transformation des données de l'API vers l'interface locale
  const transformApiDataToCreance = (apiData: CreanceResponse): Creance => {
    return {
      id: apiData.CREAN_CODE,
      numeroCreance: apiData.CREAN_CODE,
      objetCreance: apiData.OBJET_CREANCE_LIB || apiData.CREAN_OBJET || '',
      groupeCreance: apiData.GROUPE_CREANCE_LIB || '',
      debiteurNom: apiData.DEB_NOM || '',
      debiteurPrenom: apiData.DEB_PREN || '',
      raisonSociale: apiData.DEB_RAIS_SOCIALE || '',
      capitalInitial: apiData.CREAN_CAPIT_INIT || 0,
      montantARembourser: apiData.CREAN_MONT_A_REMB || 0,
      montantImpaye: apiData.CREAN_MONT_IMPAYE || 0,
      totalSolde: apiData.CREAN_TOT_SOLDE || 0,
      statutCreance: apiData.CREAN_STATUT || '',
      dateCreation: apiData.CREAN_DATE_CREAT || '',
      periodicite: apiData.CREAN_PERIODICITE || '',
      garantiePersonnelle: false, // À déterminer par requête séparée si nécessaire
      garantieReelle: false // À déterminer par requête séparée si nécessaire
    };
  };

  useEffect(() => {
    const loadCreances = async () => {
      setLoading(true);
      try {
        const response = await CreanceService.getAll(apiClient);
        console.log('Données créances reçues:', response);

        if (response.success && Array.isArray(response.data.items)) {
          const transformedCreances = response.data.items.map(transformApiDataToCreance);
          setCreances(transformedCreances);
          setFilteredCreances(transformedCreances);
        } else if (response.success && Array.isArray(response.data)) {
          const transformedCreances = response.data.map(transformApiDataToCreance);
          setCreances(transformedCreances);
          setFilteredCreances(transformedCreances);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des créances:', error);
        toast({
          title: "Erreur de chargement",
          description: error.message || "Impossible de charger les créances",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCreances();
  }, [apiClient, toast]);

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

  const handleDeleteCreance = async (creance: Creance) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la créance ${creance.numeroCreance} ?`)) {
      try {
        const response = await CreanceService.delete(apiClient, creance.id);
        if (response.success) {
          setCreances(creances.filter(c => c.id !== creance.id));
          toast({
            title: "Créance supprimée",
            description: `La créance ${creance.numeroCreance} a été supprimée avec succès.`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else {
          throw new Error(response.message || "Erreur lors de la suppression");
        }
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur de suppression",
          description: error.message || "Impossible de supprimer la créance",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
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
        const raisonSociale = row.original.raisonSociale;

        // Afficher raison sociale si personne morale, sinon nom prénom
        const displayName = raisonSociale
          ? raisonSociale
          : `${debiteurNom} ${debiteurPrenom}`.trim() || "Non disponible";

        return (
          <div className="font-medium">{displayName}</div>
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
