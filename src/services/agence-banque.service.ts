import { AgenceBanque, AgenceBanqueApiResponse, AgenceBanqueCreateRequest, AgenceBanqueUpdateRequest } from "@/types/agence-banque";

export class AgenceBanqueService {
  private static readonly BASE_URL = "/banque-agences";

  /**
   * Récupère toutes les agences bancaires
   */
  static async getAll(apiClient: any): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.get<AgenceBanqueApiResponse>(this.BASE_URL);
    return response.data;
  }

  /**
   * Récupère une agence bancaire par son code
   */
  static async getByCode(apiClient: any, code: string): Promise<AgenceBanque> {
    const response = await apiClient.get<AgenceBanqueApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Agence bancaire non trouvée");
    }
    return response.data.data[0];
  }

  /**
   * Crée une nouvelle agence bancaire
   */
  static async create(apiClient: any, agence: AgenceBanqueCreateRequest): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.post<AgenceBanqueApiResponse>(this.BASE_URL, agence);
    return response.data;
  }

  /**
   * Met à jour une agence bancaire existante
   */
  static async update(apiClient: any, code: string, agence: AgenceBanqueUpdateRequest): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.put<AgenceBanqueApiResponse>(`${this.BASE_URL}/${code}`, agence);
    return response.data;
  }

  /**
   * Supprime une agence bancaire
   */
  static async delete(apiClient: any, code: string): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.delete<AgenceBanqueApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  /**
   * Recherche des agences bancaires par terme
   */
  static async search(apiClient: any, searchTerm: string): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.get<AgenceBanqueApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }

  /**
   * Récupère les agences d'une banque spécifique
   */
  static async getByBanque(apiClient: any, banqueCode: string): Promise<AgenceBanqueApiResponse> {
    const response = await apiClient.get<AgenceBanqueApiResponse>(`${this.BASE_URL}/banque/${banqueCode}`);
    return response.data;
  }
}
