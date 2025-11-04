"use client";

import { Suspense } from "react";
import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";
import { CreanceService } from "@/services/creance.service";
import { CreanceResponse } from "@/types/creance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PaginationParams, PaginationInfo } from "@/types/pagination";
import { getStatutRecouvrementLibelle, getStatutRecouvrementVariant } from "@/lib/constants/statut-recouvrement";

// Types pour les créances (mapping de CreanceResponse à l'interface locale)
interface Creance {
  id: string;
  numeroCreance: string;
  debiteurCode: string; // Code du débiteur selon la doc
  objetCreance: string;
  groupeCreance: string;
  debiteurNom: string;
  debiteurPrenom: string;
  raisonSociale: string;
  typeDebiteur: string; // 'P' ou 'M'
  capitalInitial: number;
  soldeInit: number; // CREAN_SOLDE_INIT selon la doc
  montantARembourser: number;
  montantImpaye: number;
  totalSolde: number;
  statutCreance: string;
  statutRecouvrement: string; // CREAN_STATRECOUV selon la doc
  dateCreation: string;
  dateDeblocage: string;
  dateEcheance: string;
  periodicite: string;
  garantiePersonnelle: boolean;
  garantieReelle: boolean;
}

// Fonction pour afficher le débiteur selon la documentation
function getDebiteurDisplay(row: Creance): string {
  if (row.typeDebiteur === 'M') {
    // Débiteur moral (entreprise)
    return row.raisonSociale || `${row.debiteurNom || ''} ${row.debiteurPrenom || ''}`.trim();
  } else {
    // Débiteur physique (personne)
    return `${row.debiteurNom || ''} ${row.debiteurPrenom || ''}`.trim();
  }
}

const CreancePageInner = () => {
  const [creances, setCreances] = useState<Creance[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalElements: 0,
    totalPages: 0,
    size: 20,
    number: 0,
    first: true,
    last: false,
    hasNext: false,
    hasPrevious: false,
    numberOfElements: 0,
  });
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 0,
    size: 20,
    search: undefined,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const apiClient = useApiClient();

  // Transformation des données de l'API vers l'interface locale selon la documentation
  const transformApiDataToCreance = (apiData: any): Creance => {
    return {
      id: apiData.CREAN_CODE,
      numeroCreance: apiData.CREAN_CODE,
      debiteurCode: apiData.DEB_CODE || '', // Code du débiteur
      objetCreance: apiData.CREAN_OBJET || apiData.OBJET_CREANCE_LIB || '',
      groupeCreance: apiData.GROUPE_CREANCE_LIB || '',
      debiteurNom: apiData.DEB_NOM || '',
      debiteurPrenom: apiData.DEB_PREN || '',
      raisonSociale: apiData.DEB_RAIS_SOCIALE || '',
      typeDebiteur: apiData.TYPDEB_CODE || 'P', // 'P' pour personne physique, 'M' pour personne morale
      capitalInitial: apiData.CREAN_CAPIT_INIT || 0,
      soldeInit: apiData.CREAN_SOLDE_INIT || apiData.CREAN_TOT_SOLDE || 0, // Solde à recouvrer selon la doc
      montantARembourser: apiData.CREAN_MONT_A_REMB || 0,
      montantImpaye: apiData.CREAN_MONT_IMPAYE || 0,
      totalSolde: apiData.CREAN_TOT_SOLDE || 0,
      statutCreance: apiData.CREAN_STATUT || '',
      statutRecouvrement: apiData.CREAN_STATRECOUV || '', // Statut de recouvrement (VARCHAR2(2))
      dateCreation: apiData.CREAN_DATECREA || apiData.CREAN_DATE_CREAT || '',
      dateDeblocage: apiData.CREAN_DATEFT || apiData.CREAN_DATE_DEBLOCAGE || '',
      dateEcheance: apiData.CREAN_DATECH || apiData.CREAN_DATE_ECHEANCE || '',
      periodicite: apiData.CREAN_PERIODICITE || '',
      garantiePersonnelle: (apiData.garantiesPersonnelles && apiData.garantiesPersonnelles.length > 0) || false,
      garantieReelle: (apiData.garantiesReelles && apiData.garantiesReelles.length > 0) || false
    };
  };

  // Fonction pour charger les créances avec pagination
  const loadCreances = async (params: PaginationParams = paginationParams) => {
    setLoading(true);
    try {
      const response = await CreanceService.getAll(apiClient, params);
      console.log("Données créances reçues:", response);

      if (response.status === "SUCCESS" && response.data) {
        // Extraire le contenu paginé (peut être content ou items selon l'API)
        const creancesList = response.data.content || response.data.items || [];
        const transformedCreances = Array.isArray(creancesList)
          ? creancesList.map(transformApiDataToCreance)
          : [];

        setCreances(transformedCreances);
        
        // Mettre à jour les infos de pagination
        setPagination({
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0,
          size: response.data.size || 20,
          number: response.data.number || 0,
          first: response.data.first ?? true,
          last: response.data.last ?? false,
          hasNext: response.data.hasNext ?? false,
          hasPrevious: response.data.hasPrevious ?? false,
          numberOfElements: response.data.numberOfElements || 0,
        });
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des créances');
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des créances:", error);
      toast.error(error.message || "Impossible de charger les créances");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage et quand les paramètres de pagination changent
  useEffect(() => {
    loadCreances(paginationParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.page, paginationParams.size, paginationParams.search]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Les fonctions getStatusColor et getStatusVariant sont remplacées par les fonctions du fichier statut-recouvrement.ts

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
          toast.success(`La créance ${creance.numeroCreance} a été supprimée avec succès.`);
        } else {
          throw new Error(response.message || "Erreur lors de la suppression");
        }
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        toast.error(error.message || "Impossible de supprimer la créance");
      }
    }
  };

  const handleCreateCreance = () => {
    router.push("/etude_creance/creance/create");
  };

  // Configuration des colonnes pour DataTable - Design sobre et professionnel
  const columns: ColumnDef<Creance>[] = [
    {
      accessorKey: "numeroCreance",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">
          {row.getValue("numeroCreance")}
        </div>
      ),
    },
    {
      accessorKey: "debiteurNom",
      header: "Débiteur",
      cell: ({ row }) => {
        const debiteurCode = row.original.debiteurCode || '';
        const displayName = getDebiteurDisplay(row.original) || "Non disponible";
        // Afficher le code débiteur à côté du nom séparé par "-"
        const displayText = debiteurCode ? `${debiteurCode} - ${displayName}` : displayName;
        return (
          <div className="font-medium text-gray-900">{displayText}</div>
        );
      },
    },
    {
      accessorKey: "objetCreance",
      header: "Objet",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 max-w-md truncate">
          {row.getValue("objetCreance") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "capitalInitial",
      header: "Capital",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {formatCurrency(row.getValue("capitalInitial") as number)}
        </div>
      ),
    },
    {
      accessorKey: "soldeInit",
      header: "Solde",
      cell: ({ row }) => {
        const solde = row.getValue("soldeInit") as number;
        return (
          <div className={`text-sm font-medium ${solde > 0 ? "text-orange-600" : "text-gray-600"}`}>
            {formatCurrency(solde)}
          </div>
        );
      },
    },
    {
      accessorKey: "statutRecouvrement",
      header: "Statut",
      cell: ({ row }) => {
        const statutCode = row.getValue("statutRecouvrement") as string;
        const statutLibelle = getStatutRecouvrementLibelle(statutCode);
        return (
          <Badge variant={getStatutRecouvrementVariant(statutCode)} className="font-medium">
            {statutLibelle}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dateCreation",
      header: "Date création",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("dateCreation")
            ? new Date(row.getValue("dateCreation") as string).toLocaleDateString("fr-FR")
            : "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const creance = row.original;
        return (
          <TooltipProvider>
            <div className="flex items-center justify-end gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewCreance(creance)}
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Consulter</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCreance(creance)}
                    className="h-8 w-8 p-0 hover:bg-green-50"
                  >
                    <Pencil className="h-4 w-4 text-green-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modifier</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCreance(creance)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Supprimer</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  // Gestion de la recherche serveur
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = async () => {
    // Réinitialiser à la page 0 et déclencher le chargement avec la recherche
    setPaginationParams({
      ...paginationParams,
      page: 0,
      search: searchValue || undefined,
    });
  };

  const handleSearchReset = () => {
    setSearchValue("");
    // Réinitialiser la pagination et recharger toutes les données
    setPaginationParams({
      page: 0,
      size: paginationParams.size || 20,
      search: undefined,
    });
  };

  // Gestion du changement de pagination
  const handlePaginationChange = (params: { page?: number; size?: number; search?: string }) => {
    setPaginationParams({
      ...paginationParams,
      ...(params.page !== undefined && { page: params.page }),
      ...(params.size !== undefined && { size: params.size }),
      ...(params.search !== undefined && { search: params.search }),
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <DataTable
        title="CRÉANCES"
        description=""
        columns={columns}
        data={creances}
        searchKey="numeroCreance"
        searchPlaceholder="Rechercher par numéro, objet, débiteur..."
        onAdd={handleCreateCreance}
        addButtonText="Nouvelle créance"
        status={loading ? "pending" : undefined}
        useServerPagination={true}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        isPaginationLoading={loading}
        isTableLoading={loading}
        sectionTitle=""
        listTitle=""
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
        onSearchReset={handleSearchReset}
        onRefresh={() => loadCreances(paginationParams)}
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
