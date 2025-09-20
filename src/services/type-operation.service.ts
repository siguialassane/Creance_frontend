import { TypeOperation, TypeOperationApiResponse, TypeOperationCreateRequest, TypeOperationUpdateRequest } from "@/types/type-operation";

export class TypeOperationService {
  private static readonly BASE_URL = "/types-operation";

  static async getAll(apiClient: any): Promise<TypeOperationApiResponse> {
    const response = await apiClient.get<TypeOperationApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<TypeOperation> {
    const response = await apiClient.get<TypeOperationApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Type d'opération non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, type: TypeOperationCreateRequest): Promise<TypeOperationApiResponse> {
    const response = await apiClient.post<TypeOperationApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: any, code: string, type: TypeOperationUpdateRequest): Promise<TypeOperationApiResponse> {
    const response = await apiClient.put<TypeOperationApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<TypeOperationApiResponse> {
    const response = await apiClient.delete<TypeOperationApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<TypeOperationApiResponse> {
    const response = await apiClient.get<TypeOperationApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

