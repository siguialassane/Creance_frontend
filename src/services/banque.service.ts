import { Banque, BanqueApiResponse, BanqueCreateRequest, BanqueUpdateRequest } from "@/types/banque";

export class BanqueService {
  private static readonly BASE_URL = "/banques";

  /**
   * Récupère toutes les banques
   */
  static async getAll(apiClient: any): Promise<BanqueApiResponse> {
    const response = await apiClient.get<BanqueApiResponse>(this.BASE_URL);
    console.log("response", response)
    return response.data;
  }

  /**
   * Récupère une banque par son code
   */
  static async getByCode(apiClient: any, code: string): Promise<Banque> {
    const response = await apiClient.get<BanqueApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Banque non trouvée");
    }
    return response.data.data[0];
  }

  /**
   * Crée une nouvelle banque
   */
  static async create(apiClient: any, banque: BanqueCreateRequest): Promise<BanqueApiResponse> {
    const response = await apiClient.post<BanqueApiResponse>(this.BASE_URL, banque);
    return response.data;
  }

  /**
   * Met à jour une banque existante
   */
  static async update(apiClient: any, code: string, banque: BanqueUpdateRequest): Promise<BanqueApiResponse> {
    const response = await apiClient.put<BanqueApiResponse>(`${this.BASE_URL}/${code}`, banque);
    return response.data;
  }

  /**
   * Supprime une banque
   */
  static async delete(apiClient: any, code: string): Promise<BanqueApiResponse> {
    const response = await apiClient.delete<BanqueApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  /**
   * Recherche des banques par terme
   */
  static async search(apiClient: any, searchTerm: string): Promise<BanqueApiResponse> {
    const response = await apiClient.get<BanqueApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}
