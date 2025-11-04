import { CreanceCreateRequest, CreanceApiResponse, CreanceResponse } from "@/types/creance";
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
    return await fetchPaginatedData<any>(this.BASE_URL, params);
  }

  /**
   * Récupère toutes les créances (méthode legacy pour compatibilité)
   */
  static async getAllLegacy(apiClient: any): Promise<any> {
    const response = await apiClient.get(`${this.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<CreanceResponse> {
    const response = await apiClient.get(`${this.BASE_URL}/${code}`);
    if (!response.data.data) {
      throw new Error("Créance non trouvée");
    }
    return response.data.data;
  }

  static async create(apiClient: any, creance: CreanceCreateRequest): Promise<CreanceApiResponse> {
    const cleanedCreance = this.cleanNumericFields(creance);
    const response = await apiClient.post(this.BASE_URL, cleanedCreance);
    return response.data;
  }

  static async update(apiClient: any, code: string, creance: Partial<CreanceCreateRequest>): Promise<CreanceApiResponse> {
    const cleanedCreance = this.cleanNumericFields(creance);
    const response = await apiClient.put(`${this.BASE_URL}/${code}`, cleanedCreance);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<CreanceApiResponse> {
    const response = await apiClient.delete(`${this.BASE_URL}/${code}`);
    return response.data;
  }
}
