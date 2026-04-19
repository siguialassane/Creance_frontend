import { CreanceCreateRequest, CreanceApiResponse, CreanceResponse, SuivieClientelCreanceSoldeCount, SuivieClientelCreanceSoldePage } from "@/types/creance";
import { PaginationParams, ApiResponse } from "@/types/pagination";
import { fetchPaginatedData, ApiClient } from "@/lib/api";

export class CreanceService {
  private static readonly BASE_URL = "/creances";

  /**
   * Nettoie les champs numériques en supprimant les espaces de formatage
   * pour éviter l'erreur ORA-01722 (nombre non valide)
   */
  private static cleanNumericFields(data: any): any {
    const cleaned = { ...data };

    // Champs numériques qui peuvent avoir des espaces de formatage
    const numericFields = [
      'capitalInitial',
      'montantDecaisse',
      'montantInteretConventionnel',
      'commissionBanque',
      'montantDu',
      'montantRembourse',
      'montantInteretRetard',
      'frais',
      'encours',
      'tauxInteretConventionnel',
      'tauxInteretRetard',
      'duree'
    ];

    numericFields.forEach(field => {
      if (cleaned[field] && typeof cleaned[field] === 'string') {
        // Supprimer tous les espaces et caractères non numériques sauf les points et virgules
        cleaned[field] = cleaned[field].replace(/\s/g, '');
      }
    });

    return cleaned;
  }

  /**
   * Récupère toutes les créances avec pagination
   */
  static async getAll(apiClient: ApiClient, params: PaginationParams = {}): Promise<ApiResponse<any>> {
    return await fetchPaginatedData<any>(CreanceService.BASE_URL, params);
  }

  /**
   * Récupère toutes les créances (méthode legacy pour compatibilité)
   */
  static async getAllLegacy(apiClient: any): Promise<any> {
    const response = await apiClient.get(`${CreanceService.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<CreanceResponse> {
    const response = await apiClient.get(`${CreanceService.BASE_URL}/${code}`);
    if (!response.data.data) {
      throw new Error("Créance non trouvée");
    }
    return response.data.data;
  }

  static async getSuivieClientelByCode(apiClient: any, code: string): Promise<CreanceResponse> {
    const response = await apiClient.get(`${CreanceService.BASE_URL}/${code}/suivie-clientel`);
    if (!response.data.data) {
      throw new Error("Créance non trouvée pour le suivi clientèle");
    }
    return response.data.data;
  }

  static async getSuivieClientelOvpCreationContext(apiClient: any, code: string): Promise<CreanceResponse> {
    const response = await apiClient.get(`${CreanceService.BASE_URL}/${code}/suivie-clientel/ovp-creation-context`);
    if (!response.data.data) {
      throw new Error("Contexte de création OVP introuvable");
    }
    return response.data.data;
  }

  static async searchSuivieClientelOvpActes(apiClient: any, query = ""): Promise<Array<Record<string, unknown>>> {
    const response = await apiClient.get(`${CreanceService.BASE_URL}/suivie-clientel/ovp/actes/search`, {
      params: { q: query },
    });
    return response.data.data || [];
  }

  static async createSuivieClientelOvp(apiClient: any, code: string, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
    const response = await apiClient.post(`${CreanceService.BASE_URL}/${code}/suivie-clientel/ovp`, payload);
    return response.data.data;
  }

  static async getSuivieClientelCreancesSolde(
    apiClient: ApiClient,
    params: { afterCode?: string; size?: number; search?: string } = {}
  ): Promise<SuivieClientelCreanceSoldePage> {
    const response = await apiClient.get(`${CreanceService.BASE_URL}/suivie-clientel/creances-solde`, {
      params,
    });
    return response.data.data;
  }

  static async countSuivieClientelCreancesSolde(
    apiClient: ApiClient,
    params: { search?: string } = {}
  ): Promise<SuivieClientelCreanceSoldeCount> {
    const response = await apiClient.get(`${CreanceService.BASE_URL}/suivie-clientel/creances-solde/count`, {
      params,
    });
    return response.data.data;
  }

  static async create(apiClient: any, creance: CreanceCreateRequest): Promise<CreanceApiResponse> {
    const cleanedCreance = this.cleanNumericFields(creance);
    const response = await apiClient.post(CreanceService.BASE_URL, cleanedCreance);
    return response.data;
  }

  static async update(apiClient: any, code: string, creance: Partial<CreanceCreateRequest>): Promise<CreanceApiResponse> {
    const cleanedCreance = this.cleanNumericFields(creance);
    const response = await apiClient.put(`${CreanceService.BASE_URL}/${code}`, cleanedCreance);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<CreanceApiResponse> {
    const response = await apiClient.delete(`${CreanceService.BASE_URL}/${code}`);
    return response.data;
  }

  /**
   * Exporte les créances en PDF
   */
  static async exportPDF(
    apiClient: ApiClient,
    params: { search?: string; page?: number; size?: number } = {}
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.search) queryParams.append('search', params.search);

    const url = `${CreanceService.BASE_URL}/export/pdf${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    return response.data;
  }

  /**
   * Exporte les créances en Excel
   */
  static async exportExcel(
    apiClient: ApiClient,
    params: { search?: string; page?: number; size?: number } = {}
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.search) queryParams.append('search', params.search);

    const url = `${CreanceService.BASE_URL}/export/excel${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    return response.data;
  }
}
