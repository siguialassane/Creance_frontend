"use client";

import { Suspense } from "react";
import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";
import { PaiementService } from "@/services/paiement.service";
import { PaiementHistoriqueService } from "@/services/paiement-historique.service";
import { CreanceService } from "@/services/creance.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Eye, Pencil, Trash2, Printer } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PaginationParams, PaginationInfo } from "@/types/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecuPaiementModal } from "@/components/modals/RecuPaiementModal";

// Interface pour les paiements
interface Paiement {
  id: string;
  identifiant: string; // PAIE_CODE ou FRAIS_CODE
  typePaiement: "CREANCE" | "FRAIS" | "FACTURE";
  typePaiementLib: string;
  effetNum?: string;
  fraisCode?: string;
  paieCode?: string;
  creanceCode: string;
  typeEffet?: string;
  typeEffetLibelle?: string;
  banqueAgence?: string;
  banqueLibelle?: string;
  modePaiement?: string;
  modePaiementLib?: string;
  montant: number;
  dateCreation: string;
  datePaiement: string;
  statut: string;
  libelle: string;
  numRecu?: string;
  // Pour les frais
  typeFraisCode?: string;
  typeFraisLib?: string;
  // Pour les factures
  contratCode?: string;
}

const PaiementsListePageInner = () => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPaiements, setFilteredPaiements] = useState<Paiement[]>([]);
  const [creanceCode, setCreanceCode] = useState<string>("");
  const [creanceData, setCreanceData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiClient = useApiClient();

  // Récupérer le code créance depuis l'URL
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setCreanceCode(code);
    } else {
      toast.error("Code créance manquant");
      router.push("/etude_creance/creance/views");
    }
  }, [searchParams, router]);

  // Charger les données de la créance pour le solde
  const loadCreance = async () => {
    if (!creanceCode) return;
    try {
      const data = await CreanceService.getByCode(apiClient, creanceCode);
      console.log("[DEBUG PAYMENTS LIST] Creance Data for", creanceCode, {
        SOLDE_EXIGIBLE: data.SOLDE_EXIGIBLE,
        CREAN_SOLDE_INIT: data.CREAN_SOLDE_INIT,
        CREAN_TOT_SOLDE: data.CREAN_TOT_SOLDE,
        CREAN_CAPIT_INIT: data.CREAN_CAPIT_INIT,
        CREAN_MONT_A_REMB: data.CREAN_MONT_A_REMB,
      });
      setCreanceData(data);
    } catch (error: any) {
      console.error("Erreur lors du chargement de la créance:", error);
    }
  };

  useEffect(() => {
    if (creanceCode) {
      loadCreance();
    }
  }, [creanceCode]);

  // Transformation des données de l'API vers l'interface locale
  const transformApiDataToPaiement = (apiData: any): Paiement => {
    const typePaiement = apiData.TYPE_PAIEMENT || "CREANCE";
    const identifiant = apiData.IDENTIFIANT || apiData.PAIE_CODE || apiData.FRAIS_CODE || apiData.EFFET_NUM || "";
    
    return {
      id: identifiant,
      identifiant: identifiant,
      typePaiement: typePaiement,
      typePaiementLib: apiData.TYPE_PAIEMENT_LIB || "Paiement",
      effetNum: apiData.EFFET_NUM || apiData.effetNum,
      fraisCode: apiData.FRAIS_CODE || apiData.fraisCode,
      paieCode: apiData.PAIE_CODE || apiData.paieCode,
      creanceCode: apiData.CREAN_CODE || apiData.creanceCode,
      typeEffet: apiData.TYPEFT_CODE || apiData.typeEffet,
      typeEffetLibelle: apiData.TYPEFT_LIB || apiData.typeEffetLibelle,
      banqueAgence: apiData.BQAG_NUM || apiData.BQAG_CODE || apiData.banqueAgence,
      banqueLibelle: apiData.BQAG_LIB || apiData.banqueLibelle,
      modePaiement: apiData.MODE_PAIE_CODE || apiData.modePaiement,
      modePaiementLib: apiData.MODE_PAIEMENT_LIB || apiData.MODE_PAIE_LIB || apiData.modePaiementLib,
      montant: parseFloat(apiData.MONTANT || apiData.EFFET_MONT || apiData.PAIE_MONT || apiData.FRAIS_MONT_PAY || apiData.montant || 0),
      dateCreation: apiData.DATE_CREATION || apiData.PAIE_DATCREA || apiData.FRAIS_DATCREAT || apiData.dateCreation,
      datePaiement: apiData.DATE_PAIEMENT || apiData.PAIE_DATEFT || apiData.FRAIS_DATE_PAY || apiData.datePaiement,
      statut: apiData.STATUT || apiData.PAIE_VALIDE || apiData.PAIE_CPTA || apiData.statut || "EN_ATTENTE",
      libelle: apiData.LIBELLE || apiData.PAIE_LIB || apiData.FRAIS_LIB || apiData.libelle || "",
      numRecu: apiData.NUM_RECU || apiData.PAIE_NUM_RECU_VERS || apiData.NUM_RECUS || apiData.numRecu,
      typeFraisCode: apiData.TYPFRAIS_CODE || apiData.typeFraisCode,
      typeFraisLib: apiData.TYPFRAIS_LIB || apiData.typeFraisLib,
      contratCode: apiData.CONTRAT_CODE || apiData.contratCode,
    };
  };

  // Charger les paiements
  const loadPaiements = async (params: PaginationParams) => {
    if (!creanceCode) return;

    setLoading(true);
    try {
      // Utiliser le nouveau service d'historique pour récupérer tous les types de paiements
      const response = await PaiementHistoriqueService.getAllByCreance(apiClient, creanceCode);

      // Transformer les données
      const data = response.data || response;
      const paiementsList = Array.isArray(data)
        ? data
        : Array.isArray(data.content)
          ? data.content
          : Array.isArray(data.data)
            ? data.data
            : [];

      const transformedPaiements = paiementsList.map(transformApiDataToPaiement);

      // Pagination côté client pour l'historique complet
      const totalElements = transformedPaiements.length;
      const totalPages = Math.ceil(totalElements / (params.size || 20));
      const startIndex = (params.page || 0) * (params.size || 20);
      const endIndex = startIndex + (params.size || 20);
      const paginatedPaiements = transformedPaiements.slice(startIndex, endIndex);
      
      setPaiements(paginatedPaiements);
      setPagination({
        totalElements: totalElements,
        totalPages: totalPages,
        size: params.size || 20,
        number: params.page || 0,
        first: params.page === 0,
        last: (params.page || 0) >= totalPages - 1,
        hasNext: (params.page || 0) < totalPages - 1,
        hasPrevious: (params.page || 0) > 0,
        numberOfElements: paginatedPaiements.length,
      });
    } catch (error: any) {
      console.error("Erreur lors du chargement des paiements:", error);
      toast.error(error.response?.data?.message || "Erreur lors du chargement des paiements");
      setPaiements([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les paiements au montage et lors des changements de params
  useEffect(() => {
    if (creanceCode) {
      loadPaiements(paginationParams);
    }
  }, [paginationParams, creanceCode]);

  // Formater la devise avec point comme séparateur de milliers
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
    }).format(amount);
    return formatted.replace(/\s/g, ".") + " F CFA";
  };

  // Handlers
  const handleAddPaiement = () => {
    router.push(`/paiements_des_creances?code=${creanceCode}`);
  };

  const handleBack = () => {
    router.push("/etude_creance/creance/views");
  };

  const handleViewPaiement = (paiement: Paiement) => {
    // TODO: Implémenter la vue détaillée d'un paiement
    toast.info("Fonctionnalité à venir");
  };

  const handleEditPaiement = (paiement: Paiement) => {
    router.push(`/etude_creance/paiement/edit?id=${paiement.identifiant}&creanceCode=${creanceCode}`);
  };

  const handleDeletePaiement = async (paiement: Paiement) => {
    // TODO: Implémenter la suppression d'un paiement
    toast.info("Fonctionnalité à venir");
  };

  const [showRecuDialog, setShowRecuDialog] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);

  const handlePrintRecu = (paiement: Paiement) => {
    // Pour les paiements de frais, on utilise fraisCode, sinon effetNum ou paieCode
    const recuData: Paiement = {
      ...paiement,
      effetNum: paiement.effetNum || paiement.fraisCode?.toString() || paiement.paieCode?.toString() || "",
    };
    setSelectedPaiement(recuData);
    setShowRecuDialog(true);
  };

  // Configuration des colonnes pour DataTable
  const columns: ColumnDef<Paiement>[] = [
    {
      accessorKey: "typePaiement",
      header: "Type paiement",
      cell: ({ row }) => {
        const type = row.original.typePaiement;
        const typeColors: Record<string, string> = {
          CREANCE: "bg-blue-100 text-blue-800",
          FRAIS: "bg-green-100 text-green-800",
          FACTURE: "bg-purple-100 text-purple-800",
        };
        return (
          <Badge className={typeColors[type] || "bg-gray-100 text-gray-800"}>
            {row.original.typePaiementLib}
          </Badge>
        );
      },
    },
    {
      accessorKey: "identifiant",
      header: "Numéro",
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">
          {row.getValue("identifiant") || row.original.effetNum || "-"}
        </div>
      ),
    },
    {
      accessorKey: "libelle",
      header: "Libellé",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 max-w-xs truncate" title={row.getValue("libelle")}>
          {row.getValue("libelle") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "modePaiementLib",
      header: "Mode paiement",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue("modePaiementLib") || row.original.modePaiement || "-"}
        </div>
      ),
    },
    {
      accessorKey: "typeEffetLibelle",
      header: "Type effet",
      cell: ({ row }) => {
        const paiement = row.original;
        if (paiement.typePaiement === "FRAIS" && paiement.typeFraisLib) {
          return (
            <div className="font-medium text-gray-900">
              {paiement.typeFraisCode} - {paiement.typeFraisLib}
            </div>
          );
        }
        return (
          <div className="font-medium text-gray-900">
            {paiement.typeEffet ? `${paiement.typeEffet} - ${paiement.typeEffetLibelle || "-"}` : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "banqueLibelle",
      header: "Banque",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.banqueAgence ? `${row.original.banqueAgence} - ${row.getValue("banqueLibelle") || "-"}` : "-"}
        </div>
      ),
    },
    {
      accessorKey: "montant",
      header: "Montant",
      cell: ({ row }) => (
        <div className="text-sm font-bold text-orange-600">
          {formatCurrency(row.getValue("montant") as number)}
        </div>
      ),
    },
    {
      accessorKey: "datePaiement",
      header: "Date paiement",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("datePaiement")
            ? new Date(row.getValue("datePaiement") as string).toLocaleDateString("fr-FR")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.getValue("statut") as string;
        return (
          <Badge variant={statut === "Validé" ? "default" : "outline"} className="font-medium">
            {statut || "En attente"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const paiement = row.original;
        return (
          <TooltipProvider>
            <div className="flex items-center justify-end gap-2">
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewPaiement(paiement)}
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Consulter</p>
                </TooltipContent>
              </Tooltip> */}
              {paiement.effetNum || paiement.fraisCode || paiement.paieCode ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePrintRecu(paiement)}
                      className="h-8 w-8 p-0 hover:bg-orange-50"
                    >
                      <Printer className="h-4 w-4 text-orange-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Imprimer reçu</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPaiement(paiement)}
                    className="h-8 w-8 p-0 hover:bg-green-50"
                  >
                    <Pencil className="h-4 w-4 text-green-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modifier</p>
                </TooltipContent>
              </Tooltip>
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePaiement(paiement)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Supprimer</p>
                </TooltipContent>
              </Tooltip> */}
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  // Filtrer les paiements selon le terme de recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPaiements(paiements);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = paiements.filter((paiement) => {
      const identifiantStr = paiement.identifiant?.toString() || "";
      const typePaiementLibStr = paiement.typePaiementLib?.toString() || "";
      const modePaiementLibStr = paiement.modePaiementLib?.toString() || "";
      const montantStr = paiement.montant?.toString() || "";
      const datePaiementStr = paiement.datePaiement?.toString() || "";
      const statutStr = paiement.statut?.toString() || "";

      return identifiantStr.toLowerCase().includes(lowerSearchTerm) ||
             typePaiementLibStr.toLowerCase().includes(lowerSearchTerm) ||
             modePaiementLibStr.toLowerCase().includes(lowerSearchTerm) ||
             montantStr.includes(lowerSearchTerm) ||
             datePaiementStr.toLowerCase().includes(lowerSearchTerm) ||
             statutStr.toLowerCase().includes(lowerSearchTerm);
    });
    setFilteredPaiements(filtered);
  }, [searchTerm, paiements]);

  // Gestion de la pagination
  const handlePageChange = (newPage: number) => {
    setPaginationParams({
      ...paginationParams,
      page: newPage,
    });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPaginationParams({
      page: 0,
      size: newSize,
      search: paginationParams.search,
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Paiements de la créance {creanceCode}
            </h2>
            <p className="text-muted-foreground">
              Liste des paiements enregistrés pour cette créance
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddPaiement}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un paiement
        </Button>
      </div>

      {/* Solde après régularisation */}
      {creanceData && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
          <span className="font-semibold text-orange-700">Solde après régularisation :</span>
          <span className="text-xl font-bold text-orange-600">
            {formatCurrency(creanceData.SOLDE_EXIGIBLE || 0)}
          </span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {filteredPaiements.length} paiement(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            title=""
            columns={columns as ColumnDef<unknown, unknown>[]}
            data={filteredPaiements}
            isTableLoading={loading}
            pagination={pagination}
            searchValue={searchTerm}
            onSearchValueChange={setSearchTerm}
            onPaginationChange={(params) => {
              if (params.page !== undefined) handlePageChange(params.page);
              if (params.size !== undefined) handlePageSizeChange(params.size);
            }}
          />
        </CardContent>
      </Card>

      {/* Dialog pour imprimer les reçus */}
      {selectedPaiement && (
        <RecuPaiementModal
          open={showRecuDialog}
          onClose={() => setShowRecuDialog(false)}
          title={`Reçu de paiement - ${selectedPaiement.typePaiementLib}`}
          data={{
            effetNum: selectedPaiement.effetNum,
            paieCode: selectedPaiement.paieCode,
            fraisCode: selectedPaiement.fraisCode?.toString(),
            numeroPaiement: selectedPaiement.identifiant || selectedPaiement.effetNum || selectedPaiement.fraisCode?.toString() || selectedPaiement.paieCode?.toString() || "N/A",
          }}
        />
      )}
    </div>
  );
};

const PaiementsListePage = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PaiementsListePageInner />
    </Suspense>
  );
};

export default PaiementsListePage;
