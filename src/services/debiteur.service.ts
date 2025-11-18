import { DebiteurCreateRequest, DebiteurApiResponse, DebiteurResponse } from "@/types/debiteur";
import { PaginationParams, ApiResponse } from "@/types/pagination";
import { fetchPaginatedData, ApiClient } from "@/lib/api";

export class DebiteurService {
  private static readonly BASE_URL = "/debiteurs";

  /**
   * Nettoie les champs numériques en supprimant les espaces de formatage
   * pour éviter l'erreur ORA-01722 (nombre non valide)
   */
  private static cleanNumericFields(data: any): any {
    const cleaned = { ...data };
    
    // Champs numériques connus qui peuvent avoir des espaces de formatage
    const numericFields = ['capitalSocial', 'nombreEnfant'];
    
    numericFields.forEach(field => {
      if (cleaned[field] && typeof cleaned[field] === 'string') {
        // Supprimer tous les espaces et caractères non numériques sauf les points et virgules
        cleaned[field] = cleaned[field].replace(/\s/g, '');
      }
    });
    
    return cleaned;
  }

  /**
   * Récupère tous les débiteurs avec pagination
   */
  static async getAll(apiClient: ApiClient, params: PaginationParams = {}): Promise<ApiResponse<any>> {
    return await fetchPaginatedData<any>(this.BASE_URL, params);
  }

  /**
   * Récupère tous les débiteurs (méthode legacy pour compatibilité)
   */
  static async getAllLegacy(apiClient: any): Promise<any> {
    const response = await apiClient.get(`${this.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<DebiteurResponse> {
    const response = await apiClient.get(`${this.BASE_URL}/${code}`);
    if (!response.data.data) {
      throw new Error("Débiteur non trouvé");
    }
    return response.data.data;
  }

  static async create(apiClient: any, debiteur: DebiteurCreateRequest): Promise<DebiteurApiResponse> {
    const cleanedDebiteur = this.cleanNumericFields(debiteur);
    const response = await apiClient.post(this.BASE_URL, cleanedDebiteur);
    return response.data;
  }

  static async update(apiClient: any, code: string, debiteur: Partial<DebiteurCreateRequest>): Promise<DebiteurApiResponse> {
    const cleanedDebiteur = this.cleanNumericFields(debiteur);
    const response = await apiClient.put(`${this.BASE_URL}/${code}`, cleanedDebiteur);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<DebiteurApiResponse> {
    const response = await apiClient.delete(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  /**
   * Exporte les débiteurs en PDF
   */
  static async exportPDF(
    apiClient: ApiClient,
    params: { search?: string; page?: number; size?: number } = {}
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.search) queryParams.append('search', params.search);

    const url = `${this.BASE_URL}/export/pdf${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    return response.data;
  }

  /**
   * Exporte les débiteurs en Excel
   */
  static async exportExcel(
    apiClient: ApiClient,
    params: { search?: string; page?: number; size?: number } = {}
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.search) queryParams.append('search', params.search);

    const url = `${this.BASE_URL}/export/excel${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    return response.data;
  }
}
