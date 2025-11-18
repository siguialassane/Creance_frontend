import { Operation, OperationApiResponse, OperationCreateRequest, OperationUpdateRequest } from "@/types/operation";

export class OperationService {
  private static readonly BASE_URL = "/operations";

  static async getAll(apiClient: any): Promise<OperationApiResponse> {
    const response = await apiClient.get<OperationApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Operation> {
    const response = await apiClient.get<OperationApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Opération non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, operation: OperationCreateRequest): Promise<OperationApiResponse> {
    const response = await apiClient.post<OperationApiResponse>(this.BASE_URL, operation);
    return response.data;
  }

  static async update(apiClient: any, code: string, operation: OperationUpdateRequest): Promise<OperationApiResponse> {
    const response = await apiClient.put<OperationApiResponse>(`${this.BASE_URL}/${code}`, operation);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<OperationApiResponse> {
    const response = await apiClient.delete<OperationApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<OperationApiResponse> {
    const response = await apiClient.get<OperationApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

