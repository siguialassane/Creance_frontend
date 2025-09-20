import { CompteOperation, CompteOperationApiResponse, CompteOperationCreateRequest, CompteOperationUpdateRequest } from "@/types/compte-operation";

export class CompteOperationService {
  private static readonly BASE_URL = "/comptes-operation";

  static async getAll(apiClient: any): Promise<CompteOperationApiResponse> {
    const response = await apiClient.get<CompteOperationApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<CompteOperation> {
    const response = await apiClient.get<CompteOperationApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Compte d'opération non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, compte: CompteOperationCreateRequest): Promise<CompteOperationApiResponse> {
    const response = await apiClient.post<CompteOperationApiResponse>(this.BASE_URL, compte);
    return response.data;
  }

  static async update(apiClient: any, code: string, compte: CompteOperationUpdateRequest): Promise<CompteOperationApiResponse> {
    const response = await apiClient.put<CompteOperationApiResponse>(`${this.BASE_URL}/${code}`, compte);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<CompteOperationApiResponse> {
    const response = await apiClient.delete<CompteOperationApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<CompteOperationApiResponse> {
    const response = await apiClient.get<CompteOperationApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

