"use client";

import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Building2, User, Plus } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";
import { DebiteurService } from "@/services/debiteur.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PaginationParams, PaginationInfo, extractPaginatedData } from "@/types/pagination";
import { ExportButton } from "@/components/ui/export-button";
import { FilterButton } from "@/components/ui/filter-button";
import { DebiteurFilterPanel } from "@/components/ui/debiteur-filter-panel";

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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const apiClient = useApiClient();
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<{
    typeDebiteur?: 'P' | 'M';
    categorieDebiteur?: string;
    quartier?: string;
    ville?: string;
    statutSalarie?: string;
  }>({});

  // Transformer les données de l'API pour correspondre à notre interface
  const transformDebiteurData = (item: any): Debiteur => ({
    id: item.DEB_CODE?.toString() || `debiteur_${item.DEB_CODE || 'unknown'}`,
    codeDebiteur: item.DEB_CODE?.toString() || 'N/A',
    categorieDebiteur: item.CATEG_DEB_CODE || 'N/A',
    typeDebiteur: item.TYPDEB_CODE === 'P' ? 'Physique' : item.TYPDEB_CODE === 'M' ? 'Morale' : 'N/A',
    email: item.DEB_EMAIL || '',
    adressePostale: item.DEB_ADRPOST || '',

    // Personne physique - colonnes réelles d'Oracle
    nom: item.DEB_NOM || '',
    prenom: item.DEB_PREN || '',
    civilite: item.CIV_CODE || '',
    nationalite: item.NAT_CODE || '',
    quartier: item.QUART_CODE || '',
    numeroCellulaire: item.DEB_CEL || '',
    numeroTelephone: item.DEB_TELBUR || '',
    profession: item.PROFES_CODE || '',
    fonction: item.FONCT_CODE || '',
    employeur: item.EMP_CODE || '',
    statutSalarie: item.STATSAL_CODE || '',

    // Personne morale - colonnes réelles d'Oracle
    raisonSociale: item.DEB_RAIS_SOCIALE || 'N/A',
    registreCommerce: item.DEB_REGISTCOM || '',
    formeJuridique: item.DEB_FORM_JURID || '',
    domaineActivite: item.DEB_DOM_ACTIV || '',
    siegeSocial: item.DEB_SIEG_SOCIAL || '',
    nomGerant: item.DEB_NOM_GERANT || '',

    // Métadonnées
    dateCreation: item.DEB_DATE_CTL ? new Date(item.DEB_DATE_CTL).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    statut: 'Actif' // Par défaut actif
  });

  // Charger les données depuis l'API backend avec pagination
  const loadDebiteurs = async (params: PaginationParams = paginationParams) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Chargement des débiteurs avec pagination:', params);
      const response = await DebiteurService.getAll(apiClient, params);
      console.log('Réponse API:', response);

      if (response.status === "SUCCESS" && response.data) {
        // Extraire le contenu paginé
        const debiteursList = response.data.content || [];
        console.log('Liste des débiteurs extraite:', debiteursList);

        // Transformer les données de l'API pour correspondre à notre interface
        const transformedDebiteurs = Array.isArray(debiteursList) 
          ? debiteursList.map(transformDebiteurData) 
          : [];

        console.log('Débiteurs transformés:', transformedDebiteurs);

        // Mettre à jour les données et les infos de pagination
        setDebiteurs(transformedDebiteurs);
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
        throw new Error(response.message || 'Erreur lors du chargement des débiteurs');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des débiteurs:', error);
      setError(error.message || 'Erreur lors du chargement des données');
      toast.error("Impossible de charger la liste des débiteurs. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage et quand les paramètres de pagination changent
  useEffect(() => {
    loadDebiteurs(paginationParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.page, paginationParams.size, paginationParams.search, paginationParams.typeDebiteur, paginationParams.categorieDebiteur, paginationParams.quartier, paginationParams.ville, paginationParams.statutSalarie]);


  const getDisplayName = (debiteur: Debiteur) => {
    if (debiteur.typeDebiteur === "Physique") {
      return `${debiteur.nom || ''} ${debiteur.prenom || ''}`.trim();
    } else {
      return debiteur.raisonSociale || 'Nom non disponible';
    }
  };

  const getTypeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    return type === "Physique" ? "default" : "secondary";
  };

  const getTypeIcon = (type: string) => {
    return type === "Physique" ? (
      <User className="h-3.5 w-3.5" />
    ) : (
      <Building2 className="h-3.5 w-3.5" />
    );
  };

  const handleViewDebiteur = (debiteur: Debiteur) => {
    // Utiliser codeDebiteur qui contient le vrai DEB_CODE
    router.push(`/etude_creance/debiteur/views/voir?id=${debiteur.codeDebiteur}`);
  };

  const handleEditDebiteur = (debiteur: Debiteur) => {
    // Utiliser codeDebiteur qui contient le vrai DEB_CODE, pas l'id qui pourrait être un numéro
    router.push(`/etude_creance/debiteur/edit?id=${debiteur.codeDebiteur}`);
  };

  const handleDeleteDebiteur = async (debiteur: Debiteur) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le débiteur ${debiteur.codeDebiteur} ?`)) {
      try {
        await DebiteurService.delete(apiClient, debiteur.codeDebiteur);

        // Mettre à jour la liste locale
        const updatedDebiteurs = debiteurs.filter(d => d.id !== debiteur.id);
        setDebiteurs(updatedDebiteurs);

        toast.success(`Le débiteur ${debiteur.codeDebiteur} a été supprimé avec succès.`);
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        toast.error("Impossible de supprimer le débiteur. Vérifiez votre connexion.");
      }
    }
  };

  const handleCreateDebiteur = () => {
    router.push("/etude_creance/debiteur/create");
  };

  // Configuration des colonnes pour DataTable - Design sobre et professionnel
  const columns: ColumnDef<Debiteur>[] = [
    {
      accessorKey: "codeDebiteur",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">
          {row.getValue("codeDebiteur")}
        </div>
      ),
    },
    {
      accessorKey: "typeDebiteur",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("typeDebiteur") as string;
        return (
          <Badge
            variant={getTypeVariant(type)}
            className="flex items-center gap-1.5 px-2.5 py-1 font-medium"
          >
            {getTypeIcon(type)}
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "nom",
      header: "Nom / Raison sociale",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {getDisplayName(row.original)}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue("email") || "-"}</div>
      ),
    },
    {
      accessorKey: "numeroTelephone",
      header: "Téléphone",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("numeroTelephone") || "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const debiteur = row.original;
        return (
          <TooltipProvider delayDuration={300}> 
            <div className="flex items-center justify-end gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDebiteur(debiteur)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 cursor-pointer"
                    aria-label="Consulter"
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
                    onClick={() => handleEditDebiteur(debiteur)}
                    className="h-8 w-8 p-0 hover:bg-green-50 cursor-pointer"
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
                    onClick={() => handleDeleteDebiteur(debiteur)}
                    className="h-8 w-8 p-0 hover:bg-red-50 cursor-pointer"
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

  // Appliquer les filtres
  const handleApplyFilters = () => {
    setPaginationParams({
      ...paginationParams,
      page: 0, // Réinitialiser à la première page
      ...filters,
    });
  };

  // Compter les filtres actifs
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== ''
  ).length;

  return (
    <div className="h-full flex flex-col bg-white">
      <DebiteurFilterPanel
        open={filterPanelOpen}
        onOpenChange={setFilterPanelOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
      />
      <DataTable
        title="DÉBITEURS"
        description=""
        columns={columns}
        data={debiteurs}
        searchKey="codeDebiteur"
        searchPlaceholder="Rechercher par code, nom, raison sociale, RC, email..."
        onAdd={handleCreateDebiteur}
        addButtonText="Nouveau débiteur"
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
        onRefresh={() => loadDebiteurs(paginationParams)}
        extraActionsSlot={
          <>
            <FilterButton
              onClick={() => setFilterPanelOpen(true)}
              activeFiltersCount={activeFiltersCount}
              disabled={loading}
            />
            <ExportButton
              onExportPDF={(params) => DebiteurService.exportPDF(apiClient, params)}
              onExportExcel={(params) => DebiteurService.exportExcel(apiClient, params)}
              searchValue={searchValue}
              defaultFileName="debiteurs"
            />
          </>
        }
      />
    </div>
  );
};

export default DebiteurPage;
