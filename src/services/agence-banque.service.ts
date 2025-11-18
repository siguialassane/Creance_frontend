import { AgenceBanque, AgenceBanqueApiResponse, AgenceBanqueCreateRequest, AgenceBanqueUpdateRequest } from "@/types/agence-banque";
import { PaginationParams, ApiResponse } from "@/types/pagination";
import { fetchPaginatedData, ApiClient } from "@/lib/api";

export class AgenceBanqueService {
  private static readonly BASE_URL = "/banque-agences";

  /**
   * Récupère toutes les agences bancaires avec pagination
   */
  static async getAll(apiClient: ApiClient, params: PaginationParams = {}): Promise<ApiResponse<AgenceBanque>> {
    return await fetchPaginatedData<AgenceBanque>(this.BASE_URL, params);
  }

  /**
   * Récupère toutes les agences bancaires (méthode legacy pour compatibilité)
   */
  static async getAllLegacy(apiClient: ApiClient): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.get<AgenceBanqueApiResponse>(this.BASE_URL);
    return response.data;
  }

  /**
   * Récupère une agence bancaire par son code
   */
  static async getByCode(apiClient: ApiClient, code: string): Promise<AgenceBanque> {
    const response = await apiClient.get<AgenceBanqueApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Agence bancaire non trouvée");
    }
    return response.data.data[0];
  }

  /**
   * Crée une nouvelle agence bancaire
   */
  static async create(apiClient: ApiClient, agence: AgenceBanqueCreateRequest): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.post<AgenceBanqueApiResponse>(this.BASE_URL, agence);
    return response.data;
  }

  /**
   * Met à jour une agence bancaire existante
   */
  static async update(apiClient: ApiClient, code: string, agence: AgenceBanqueUpdateRequest): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.put<AgenceBanqueApiResponse>(`${this.BASE_URL}/${code}`, agence);
    return response.data;
  }

  /**
   * Supprime une agence bancaire
   */
  static async delete(apiClient: ApiClient, code: string): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.delete<AgenceBanqueApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  /**
   * Recherche des agences bancaires par terme
   */
  static async search(apiClient: ApiClient, searchTerm: string): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.get<AgenceBanqueApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }

  /**
   * Récupère les agences d'une banque spécifique (paginé avec recherche)
   */
  static async getByBanque(apiClient: ApiClient, banqueCode: string, params: PaginationParams = {}): Promise<ApiResponse<AgenceBanque>> {
    return await fetchPaginatedData<AgenceBanque>(`${this.BASE_URL}/banque/${banqueCode}`, params);
  }

  /**
   * Récupère toutes les agences d'une banque spécifique (sans pagination - méthode legacy)
   */
  static async getByBanqueAll(apiClient: ApiClient, banqueCode: string): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.get<AgenceBanqueApiResponse>(`${this.BASE_URL}/banque/${banqueCode}/all`);
    return response.data;
  }
}
