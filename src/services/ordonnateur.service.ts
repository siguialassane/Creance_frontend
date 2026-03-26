import { ApiClient } from "@/lib/api";
import { PaginationParams, ApiResponse } from "@/types/pagination";
import { fetchPaginatedData } from "@/lib/api";

export interface Ordonnateur {
  ORDO_CODE: string;
  ORDO_LIB: string;
}

export interface OrdonnateurApiResponse {
  status: string;
  data: Ordonnateur | Ordonnateur[] | { content: Ordonnateur[]; totalElements: number; [key: string]: any };
  message?: string;
}

export class OrdonnateurService {
  private static readonly BASE_URL = "/ordonnateurs";

  /**
   * Récupère tous les ordonnateurs
   */
  static async getAll(apiClient: ApiClient, params?: PaginationParams): Promise<OrdonnateurApiResponse> {
    if (params) {
      const response = await fetchPaginatedData<Ordonnateur>(OrdonnateurService.BASE_URL, params);
      return response as any;
    }
    const response = await apiClient.get(OrdonnateurService.BASE_URL);
    return response.data;
  }

  /**
   * Récupère un ordonnateur par son code
   */
  static async getByCode(apiClient: ApiClient, code: string): Promise<Ordonnateur> {
    const response = await apiClient.get(`${OrdonnateurService.BASE_URL}/${code}`);
    const data = response.data?.data || response.data;
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return data;
  }

  /**
   * Recherche d'ordonnateurs
   */
  static async search(apiClient: ApiClient, searchTerm: string): Promise<OrdonnateurApiResponse> {
    const response = await apiClient.get(`${OrdonnateurService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }

  /**
   * Fonction utilitaire : Nom de l'ordonnateur
   */
  static async getNom(apiClient: ApiClient, code: string): Promise<{ ORDO_CODE: string; ORDO_LIB: string }> {
    const response = await apiClient.get(`${OrdonnateurService.BASE_URL}/${code}/nom`);
    return response.data?.data || response.data;
  }
}


