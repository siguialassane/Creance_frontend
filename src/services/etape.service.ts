import { Etape, EtapeApiResponse, EtapeCreateRequest, EtapeUpdateRequest } from "@/types/etape";

export class EtapeService {
  private static readonly BASE_URL = "/etapes";

  static async getAll(apiClient: any): Promise<EtapeApiResponse> {
    const response = await apiClient.get<EtapeApiResponse>(`${this.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Etape> {
    const response = await apiClient.get<EtapeApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Étape non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, etape: EtapeCreateRequest): Promise<EtapeApiResponse> {
    const response = await apiClient.post<EtapeApiResponse>(this.BASE_URL, etape);
    return response.data;
  }

  static async update(apiClient: any, code: string, etape: EtapeUpdateRequest): Promise<EtapeApiResponse> {
    const response = await apiClient.put<EtapeApiResponse>(`${this.BASE_URL}/${code}`, etape);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<EtapeApiResponse> {
    const response = await apiClient.delete<EtapeApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<EtapeApiResponse> {
    const response = await apiClient.get<EtapeApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

