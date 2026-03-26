import { ApiClient } from "@/lib/api";
import { ApiResponse } from "@/types/pagination";

export interface DashboardData {
  encaissements12Mois: {
    montant: string;
    variation: string;
    ready: boolean;
  };
  tauxRecouvrement: {
    taux: string;
    valeurNumerique: number;
    ready: boolean;
  };
  encoursRisque: {
    montant: string;
    nombre: number;
    pourcentage: string;
    pourcentageNumerique: number;
    ready: boolean;
  };
  dossiersContentieux: {
    nombre: number;
    variation: string;
    ready: boolean;
  };
  encaissementsMensuels: Array<{
    mois: string;
    montant: number;
    ready: boolean;
  }>;
  repartitionStatut: Array<{
    statut: string;
    statutCode: string;
    nombre: number;
    montant: string;
    pourcentage: string;
    pourcentageNumerique: number;
  }>;
  topDebiteurs: Array<{
    rang: number;
    debCode: string;
    nom: string;
    type: string;
    encours: string;
    encoursNumerique: number;
    nombreCreances: number;
  }>;
  alertes: {
    promessesRetard: {
      nombre: number;
      ready: boolean;
    };
    echeances7Jours: {
      nombre: number;
      ready: boolean;
    };
    dossiersInactifs: {
      nombre: number;
      ready: boolean;
    };
  };
  statistiquesAvancees: {
    delaiMoyenRecouvrement: string;
    delaiMoyenNumerique: number;
    ready: boolean;
  };
  actionsRecentes: any[];
}

export interface DashboardFilters {
  mois?: string; // Format: YYYY-MM
  annee?: string; // Format: YYYY
}

export class DashboardService {
  private static readonly BASE_URL = "/dashboard";

  /**
   * Récupère toutes les données du tableau de bord
   */
  static async getDashboard(
    apiClient: ApiClient,
    filters?: DashboardFilters
  ): Promise<ApiResponse<DashboardData>> {
    const params = new URLSearchParams();
    
    if (filters?.mois) {
      params.append('mois', filters.mois);
    }
    
    if (filters?.annee) {
      params.append('annee', filters.annee);
    }

    const queryString = params.toString();
    const url = queryString ? `${DashboardService.BASE_URL}?${queryString}` : DashboardService.BASE_URL;

    const response = await apiClient.get(url);
    return response.data;
  }
}

